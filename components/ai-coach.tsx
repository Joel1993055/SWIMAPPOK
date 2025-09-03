"use client";

import { useAICoach } from "@/lib/contexts/ai-coach-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Bot, 
  Brain, 
  TrendingUp, 
  Target, 
  Heart, 
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Settings,
  X
} from "lucide-react";
import { useState } from "react";

interface AICoachProps {
  className?: string;
}

export function AICoach({ className }: AICoachProps) {
  const { 
    isEnabled, 
    currentAnalysis, 
    toggleAICoach, 
    markAdviceAsRead,
    getPersonalizedAdvice 
  } = useAICoach();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [contextInput, setContextInput] = useState("");

  const getAdviceIcon = (type: string) => {
    switch (type) {
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'technique': return <Target className="h-4 w-4" />;
      case 'recovery': return <Heart className="h-4 w-4" />;
      case 'nutrition': return <Brain className="h-4 w-4" />;
      case 'motivation': return <Sparkles className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getRecoveryStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'needs_attention': return 'text-yellow-600';
      case 'overreaching': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRecoveryStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bueno';
      case 'needs_attention': return 'Necesita atención';
      case 'overreaching': return 'Sobreentrenamiento';
      default: return 'Desconocido';
    }
  };

  if (!isEnabled) {
    return (
      <Card className={`bg-muted/50 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Coach
          </CardTitle>
          <CardDescription>
            Tu entrenador personal inteligente está desactivado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={toggleAICoach} className="w-full gap-2">
            <Sparkles className="h-4 w-4" />
            Activar AI Coach
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header del AI Coach */}
      <Card className="bg-muted/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <CardTitle>AI Coach</CardTitle>
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                Activo
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 p-0"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAICoach}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            Análisis inteligente y recomendaciones personalizadas
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Análisis Actual */}
      {currentAnalysis && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Análisis del Entrenamiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Score General */}
            <div className="text-center p-4 border rounded-lg bg-background/50">
              <div className="text-3xl font-bold text-primary mb-2">
                {currentAnalysis.overallScore}/100
              </div>
              <div className="text-sm text-muted-foreground mb-3">Puntuación General</div>
              <Progress value={currentAnalysis.overallScore} className="h-2" />
            </div>

            {/* Estado de Recuperación */}
            <div className="flex items-center justify-between p-3 border rounded-lg bg-background/50">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="font-medium">Estado de Recuperación</span>
              </div>
              <Badge className={getRecoveryStatusColor(currentAnalysis.recoveryStatus)}>
                {getRecoveryStatusText(currentAnalysis.recoveryStatus)}
              </Badge>
            </div>

            {/* Próximo Enfoque */}
            <div className="p-3 border rounded-lg bg-background/50">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4" />
                <span className="font-medium">Próximo Enfoque</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentAnalysis.nextTrainingFocus}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fortalezas y Mejoras */}
      {currentAnalysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fortalezas */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Fortalezas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentAnalysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Mejoras */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600">
                <AlertTriangle className="h-5 w-5" />
                Áreas de Mejora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentAnalysis.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recomendaciones */}
      {currentAnalysis && currentAnalysis.recommendations.length > 0 && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Recomendaciones Personalizadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentAnalysis.recommendations.map((advice) => (
              <Alert key={advice.id}>
                <div className="flex items-start gap-2">
                  {getAdviceIcon(advice.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{advice.title}</span>
                      <Badge className={getPriorityColor(advice.priority)}>
                        {advice.priority === 'high' ? 'Alta' : 
                         advice.priority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                    </div>
                    <AlertDescription className="mb-2">
                      {advice.message}
                    </AlertDescription>
                    {advice.actionable && advice.actionText && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAdviceAsRead(advice.id)}
                          className="text-xs"
                        >
                          {advice.actionText}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Consulta Contextual */}
      {isExpanded && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Consulta al AI Coach
            </CardTitle>
            <CardDescription>
              Describe tu situación para recibir consejos personalizados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <textarea
              value={contextInput}
              onChange={(e) => setContextInput(e.target.value)}
              placeholder="Ej: Me siento fatigado después del entrenamiento de ayer..."
              className="w-full p-3 border rounded-lg resize-none h-20 text-sm"
            />
            <Button
              onClick={() => {
                const advice = getPersonalizedAdvice(contextInput);
                // Aquí se mostrarían los consejos generados
                console.log('Consejos generados:', advice);
                setContextInput("");
              }}
              className="w-full gap-2"
              disabled={!contextInput.trim()}
            >
              <Sparkles className="h-4 w-4" />
              Obtener Consejo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Estado Inicial */}
      {!currentAnalysis && (
        <Card className="bg-muted/50">
          <CardContent className="text-center py-8">
            <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">
              El AI Coach analizará tu entrenamiento automáticamente
            </p>
            <p className="text-sm text-muted-foreground">
              Crea un entrenamiento para ver el análisis inteligente
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
