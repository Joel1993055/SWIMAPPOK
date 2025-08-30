"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, Target, Activity } from "lucide-react";
import { useSessionsStore } from "@/lib/store/sessions";

export function AnalyticsContent() {
  const { sessions } = useSessionsStore();

  // Función helper para calcular métricas del mes anterior
  const getPreviousMonthMetrics = () => {
    const now = new Date();
    const previousMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const previousMonthStr = `${now.getFullYear()}-${(previousMonth + 1).toString().padStart(2, '0')}`;
    
    const previousMonthSessions = sessions.filter(s => s.date.startsWith(previousMonthStr));
    const previousMonthDistance = previousMonthSessions.reduce((sum, s) => sum + s.distance, 0);
    const previousMonthCount = previousMonthSessions.length;
    
    return { distance: previousMonthDistance, count: previousMonthCount };
  };

  // Función helper para calcular métricas del mes actual
  const getCurrentMonthMetrics = () => {
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    
    const currentMonthSessions = sessions.filter(s => s.date.startsWith(currentMonthStr));
    const currentMonthDistance = currentMonthSessions.reduce((sum, s) => sum + s.distance, 0);
    const currentMonthCount = currentMonthSessions.length;
    
    return { distance: currentMonthDistance, count: currentMonthCount };
  };

  const currentMetrics = getCurrentMonthMetrics();
  const previousMetrics = getPreviousMonthMetrics();

  // Calcular cambios porcentuales
  const distanceChange = previousMetrics.distance > 0 
    ? ((currentMetrics.distance - previousMetrics.distance) / previousMetrics.distance * 100).toFixed(1)
    : 0;
  
  const countChange = previousMetrics.count > 0 
    ? ((currentMetrics.count - previousMetrics.count) / previousMetrics.count * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header de Analytics */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Analytics</h2>
        <p className="text-muted-foreground">
          Análisis profundo de tu rendimiento y tendencias
        </p>
      </div>

      {/* Comparativa Mes Actual vs Mes Anterior */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Comparativa Mensual
            </CardTitle>
            <CardDescription>
              Compara tu rendimiento del mes actual con el anterior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Distancia */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground">Distancia Total</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {Math.round(currentMetrics.distance / 1000 * 10) / 10}k
                  </span>
                  <span className={`text-sm font-medium ${
                    parseFloat(distanceChange) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {parseFloat(distanceChange) >= 0 ? '+' : ''}{distanceChange}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  vs {Math.round(previousMetrics.distance / 1000 * 10) / 10}k del mes anterior
                </p>
              </div>

              {/* Sesiones */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground">Número de Sesiones</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{currentMetrics.count}</span>
                  <span className={`text-sm font-medium ${
                    parseFloat(countChange) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {parseFloat(countChange) >= 0 ? '+' : ''}{countChange}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  vs {previousMetrics.count} del mes anterior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Placeholder para futuras funcionalidades */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Análisis de Tendencias
            </CardTitle>
            <CardDescription>
              Próximamente: gráficos de evolución y patrones de entrenamiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Funcionalidad en desarrollo</p>
              <p className="text-sm">Aquí verás análisis avanzados de tu progreso</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
