"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  Target, 
  Zap, 
  Calendar,
  Activity,
  BarChart3
} from "lucide-react";
import { useSessionsStore } from "@/lib/store/sessions";
import { getAggregations } from "@/lib/aggregations";
import { useState } from "react";

export function PerformanceInsights() {
  const { sessions } = useSessionsStore();
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  // Calcular insights basados en los datos
  const generateInsights = () => {
    const stats = getAggregations(sessions);
    const insights = [];

    // Insight 1: Consistencia semanal
    const last4Weeks = sessions
      .filter(s => {
        const sessionDate = new Date(s.date);
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
        return sessionDate >= fourWeeksAgo;
      })
      .reduce((acc, s) => {
        const week = Math.floor((Date.now() - new Date(s.date).getTime()) / (7 * 24 * 60 * 60 * 1000));
        if (!acc[week]) acc[week] = [];
        acc[week].push(s);
        return acc;
      }, {} as Record<number, typeof sessions>);

    const weeklyConsistency = Object.values(last4Weeks).map(weekSessions => weekSessions.length);
    const avgSessionsPerWeek = weeklyConsistency.reduce((a, b) => a + b, 0) / weeklyConsistency.length;
    
    if (avgSessionsPerWeek < 3) {
      insights.push({
        id: 'consistency',
        type: 'warning',
        title: 'Consistencia Semanal Baja',
        description: 'Tu promedio de sesiones por semana está por debajo de lo recomendado',
        icon: AlertTriangle,
        details: `Promedio actual: ${avgSessionsPerWeek.toFixed(1)} sesiones/semana`,
        recommendation: 'Intenta mantener al menos 3-4 sesiones por semana para mejor progreso',
        action: 'Ver Plan de Entrenamiento',
        severity: 'medium'
      });
    } else if (avgSessionsPerWeek >= 4) {
      insights.push({
        id: 'consistency',
        type: 'success',
        title: 'Excelente Consistencia',
        description: 'Mantienes un ritmo de entrenamiento muy constante',
        icon: CheckCircle,
        details: `Promedio actual: ${avgSessionsPerWeek.toFixed(1)} sesiones/semana`,
        recommendation: '¡Sigue así! La consistencia es clave para el progreso',
        action: 'Ver Estadísticas',
        severity: 'low'
      });
    }

    // Insight 2: Balance de intensidades
    const intensityDistribution = sessions.reduce((acc, s) => {
      const intensity = s.intensity || 0;
      if (intensity <= 2) acc.low++;
      else if (intensity <= 4) acc.medium++;
      else acc.high++;
      return acc;
    }, { low: 0, medium: 0, high: 0 });

    const totalSessions = sessions.length;
    const lowPercentage = (intensityDistribution.low / totalSessions) * 100;
    const highPercentage = (intensityDistribution.high / totalSessions) * 100;

    if (highPercentage > 40) {
      insights.push({
        id: 'intensity',
        type: 'warning',
        title: 'Alto Volumen de Alta Intensidad',
        description: 'Muchas sesiones de alta intensidad pueden llevar al sobreentrenamiento',
        icon: AlertTriangle,
        details: `${highPercentage.toFixed(1)}% de sesiones de alta intensidad`,
        recommendation: 'Considera añadir más sesiones de recuperación (Z1-Z2)',
        action: 'Ver Distribución de Intensidades',
        severity: 'high'
      });
    } else if (lowPercentage > 60) {
      insights.push({
        id: 'intensity',
        type: 'info',
        title: 'Volumen de Recuperación Alto',
        description: 'Buena cantidad de sesiones de recuperación',
        icon: Lightbulb,
        details: `${lowPercentage.toFixed(1)}% de sesiones de recuperación`,
        recommendation: 'Podrías añadir más sesiones de intensidad moderada para progreso',
        action: 'Ver Plan de Intensidades',
        severity: 'low'
      });
    }

    // Insight 3: Progreso de distancia
    const monthlyProgress = sessions
      .filter(s => {
        const sessionDate = new Date(s.date);
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return sessionDate >= threeMonthsAgo;
      })
      .reduce((acc, s) => {
        const month = s.date.substring(0, 7);
        if (!acc[month]) acc[month] = 0;
        acc[month] += s.distance;
        return acc;
      }, {} as Record<string, number>);

    const monthlyDistances = Object.values(monthlyProgress);
    if (monthlyDistances.length >= 2) {
      const lastMonth = monthlyDistances[monthlyDistances.length - 1];
      const previousMonth = monthlyDistances[monthlyDistances.length - 2];
      const progress = ((lastMonth - previousMonth) / previousMonth) * 100;

      if (progress > 20) {
        insights.push({
          id: 'progress',
          type: 'success',
          title: 'Progreso Excepcional',
          description: 'Has aumentado significativamente tu volumen mensual',
          icon: TrendingUp,
          details: `+${progress.toFixed(1)}% vs mes anterior`,
          recommendation: 'Excelente progreso, mantén el ritmo pero no te sobreentrenes',
          action: 'Ver Gráfico de Progreso',
          severity: 'low'
        });
      } else if (progress < -15) {
        insights.push({
          id: 'progress',
          type: 'warning',
          title: 'Disminución de Volumen',
          description: 'Tu volumen mensual ha disminuido significativamente',
          icon: TrendingDown,
          details: `${progress.toFixed(1)}% vs mes anterior`,
          recommendation: 'Revisa tu plan de entrenamiento y ajusta según sea necesario',
          action: 'Revisar Plan',
          severity: 'medium'
        });
      }
    }

    // Insight 4: Técnica vs Aeróbico
    const techniqueSessions = sessions.filter(s => s.technique).length;
    const techniquePercentage = (techniqueSessions / totalSessions) * 100;

    if (techniquePercentage < 15) {
      insights.push({
        id: 'technique',
        type: 'info',
        title: 'Poca Atención a la Técnica',
        description: 'Las sesiones de técnica son importantes para el progreso',
        icon: Lightbulb,
        details: `${techniquePercentage.toFixed(1)}% de sesiones de técnica`,
        recommendation: 'Considera añadir más sesiones enfocadas en técnica',
        action: 'Ver Plan de Técnica',
        severity: 'medium'
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info': return <Lightbulb className="w-5 h-5 text-blue-600" />;
      default: return <Lightbulb className="w-5 h-5 text-blue-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800';
      case 'medium': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800';
      case 'low': return 'border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800';
      default: return 'border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-800 dark:text-red-200';
      case 'medium': return 'text-yellow-800 dark:text-yellow-200';
      case 'low': return 'text-green-800 dark:text-green-200';
      default: return 'text-blue-800 dark:text-blue-200';
    }
  };

  if (insights.length === 0) {
    return (
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 dark:border-green-800">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
            ¡Todo en Orden!
          </h4>
          <p className="text-sm text-green-700 dark:text-green-300">
            Tu rendimiento está equilibrado y progresando bien
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Performance Insights
        </h3>
        <p className="text-sm text-muted-foreground">
          Análisis inteligente de tu rendimiento
        </p>
      </div>

      {/* Insights */}
      <div className="space-y-3">
        {insights.map((insight) => (
          <Card 
            key={insight.id} 
            className={`border-2 transition-all duration-200 hover:shadow-md cursor-pointer ${
              expandedInsight === insight.id ? 'ring-2 ring-primary/20' : ''
            } ${getSeverityColor(insight.severity)}`}
            onClick={() => setExpandedInsight(expandedInsight === insight.id ? null : insight.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {getInsightIcon(insight.type)}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-semibold text-sm ${getSeverityTextColor(insight.severity)}`}>
                      {insight.title}
                    </h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        insight.severity === 'high' ? 'bg-red-100 text-red-800' :
                        insight.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {insight.severity === 'high' ? 'Alto' : 
                       insight.severity === 'medium' ? 'Medio' : 'Bajo'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {insight.description}
                  </p>

                  {expandedInsight === insight.id && (
                    <div className="space-y-3 pt-2 border-t border-muted/20">
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                        <p className="text-sm font-medium mb-1">Detalles:</p>
                        <p className="text-sm text-muted-foreground">{insight.details}</p>
                      </div>
                      
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                        <p className="text-sm font-medium mb-1">Recomendación:</p>
                        <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Aquí irían las acciones específicas
                        }}
                      >
                        {insight.action}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumen */}
      <div className="text-center p-3 bg-muted/30 rounded-lg">
        <p className="text-xs text-muted-foreground">
          {insights.length} insight{insights.length !== 1 ? 's' : ''} generado{insights.length !== 1 ? 's' : ''} automáticamente
        </p>
      </div>
    </div>
  );
}
