"use client";

import { useTrainingZones } from "@/lib/contexts/training-zones-context";
import { useAdvancedZoneDetection } from "@/lib/hooks/use-advanced-zone-detection";
import React from "react";
// NUEVO: Importar el store unificado
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTrainingStore } from "@/lib/store/unified";

import {
    Activity,
    AlertCircle,
    BarChart3,
    Brain,
    CheckCircle,
    Clock,
    Info,
    Lightbulb,
    Loader2,
    MapPin,
    Target,
    TrendingUp,
    Zap,
} from "lucide-react";

interface AdvancedZoneDetectorProps {
  content: string;
  trainingType?: string;
  phase?: string;
  competition?: boolean;
}

export function AdvancedZoneDetector({
  content,
  trainingType,
  phase,
  competition,
}: AdvancedZoneDetectorProps) {
  // MANTENER: Context existente
  const { currentZones } = useTrainingZones();
  
  // OPTIMIZADO: Solo usar lo necesario del store
  const { phases: storePhases } = useTrainingStore();

  // NUEVO: Sincronizar datos del context al store
  React.useEffect(() => {
    if (storePhases.length === 0) {
      // Si el store está vacío, no hacer nada por ahora
      // La sincronización se maneja en el componente padre
    }
  }, [storePhases]);

  const detection = useAdvancedZoneDetection(content, {
    trainingType,
    phase,
    competition,
  });

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case "Z1":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "Z2":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "Z3":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "Z4":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300";
      case "Z5":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80)
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (confidence >= 60)
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };

  if (!content.trim()) {
    return (
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Detección Inteligente de Zonas
          </CardTitle>
          <CardDescription>
            Escribe tu entrenamiento para ver el análisis automático avanzado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Comienza a escribir tu entrenamiento...</p>
            <p className="text-sm mt-2">
              El sistema detectará automáticamente zonas, distancias y métricas
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Resumen General con IA */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Análisis Inteligente del Entrenamiento
            {detection.isLoading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </CardTitle>
          <CardDescription>
            Detección automática multi-capa con análisis contextual
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Métricas principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg bg-background/50">
              <Target className="h-5 w-5 mx-auto mb-2 text-primary" />
              <div className="text-lg font-bold">
                {detection.totalDistance.toLocaleString()}m
              </div>
              <div className="text-xs text-muted-foreground">
                Distancia Total
              </div>
            </div>
            <div className="text-center p-3 border rounded-lg bg-background/50">
              <Clock className="h-5 w-5 mx-auto mb-2 text-primary" />
              <div className="text-lg font-bold">
                {detection.estimatedDuration}min
              </div>
              <div className="text-xs text-muted-foreground">Duración Est.</div>
            </div>
            <div className="text-center p-3 border rounded-lg bg-background/50">
              <TrendingUp className="h-5 w-5 mx-auto mb-2 text-primary" />
              <div className="text-lg font-bold">
                {detection.detectedZones.length}
              </div>
              <div className="text-xs text-muted-foreground">
                Zonas Detectadas
              </div>
            </div>
            <div className="text-center p-3 border rounded-lg bg-background/50">
              {getConfidenceIcon(detection.confidence)}
              <div
                className={`text-lg font-bold ${getConfidenceColor(detection.confidence)}`}
              >
                {detection.confidence}%
              </div>
              <div className="text-xs text-muted-foreground">Confianza IA</div>
            </div>
          </div>

          {/* Barra de confianza */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Confianza del análisis IA</span>
              <span className={getConfidenceColor(detection.confidence)}>
                {detection.confidence}%
              </span>
            </div>
            <Progress value={detection.confidence} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Zonas Detectadas con Confianza */}
      {detection.detectedZones.length > 0 && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Zonas de Intensidad Detectadas
            </CardTitle>
            <CardDescription>
              Análisis multi-capa con confianza calculada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {detection.detectedZones.map((zoneResult, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-background/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getZoneColor(zoneResult.zone)}>
                      {zoneResult.zone}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {detection.zoneDistribution[zoneResult.zone]?.toFixed(
                          1
                        ) || 0}
                        %
                      </span>
                      <div className="flex items-center gap-1">
                        {getConfidenceIcon(zoneResult.confidence)}
                        <span className="text-xs text-muted-foreground">
                          {zoneResult.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground mb-2">
                    {currentZones[zoneResult.zone as keyof typeof currentZones]}
                  </div>

                  <Progress
                    value={detection.zoneDistribution[zoneResult.zone] || 0}
                    className="h-2 mb-2"
                  />

                  <div className="text-xs text-muted-foreground mb-2">
                    {detection.zoneBreakdown[zoneResult.zone]?.distance.toFixed(
                      0
                    ) || 0}
                    m estimados
                  </div>

                  {zoneResult.context && (
                    <div className="text-xs text-muted-foreground bg-muted/30 rounded p-2">
                      <strong>Contexto:</strong> {zoneResult.context}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Elementos Detectados */}
      {(detection.detectedStrokes.length > 0 ||
        detection.detectedIntensities.length > 0) && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Elementos Detectados
            </CardTitle>
            <CardDescription>
              Análisis automático de estilos e intensidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {detection.detectedStrokes.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Estilos de Natación:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {detection.detectedStrokes.map(stroke => (
                    <Badge key={stroke} variant="secondary" className="gap-1">
                      {stroke}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {detection.detectedIntensities.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Niveles de Intensidad:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {detection.detectedIntensities.map(intensity => (
                    <Badge key={intensity} variant="outline" className="gap-1">
                      {intensity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sugerencias Inteligentes */}
      {detection.suggestions.length > 0 && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">
                Sugerencias inteligentes para mejorar tu entrenamiento:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {detection.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Información del Sistema */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Información del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              • <strong>Análisis Multi-Capa:</strong> Combina palabras clave,
              patrones, métricas y contexto
            </p>
            <p>
              • <strong>IA Contextual:</strong> Considera el tipo de
              entrenamiento y fase actual
            </p>
            <p>
              • <strong>Confianza Calculada:</strong> Cada detección incluye un
              nivel de confianza
            </p>
            <p>
              • <strong>Tiempo Real:</strong> Análisis automático mientras
              escribes
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Advertencia si no se detectan zonas */}
      {detection.detectedZones.length === 0 &&
        content.length > 50 &&
        !detection.isLoading && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No se detectaron zonas de intensidad. Considera agregar
              referencias como &quot;Z1&quot;, &quot;Z2&quot;,
              &quot;aeróbico&quot;, &quot;umbral&quot;, &quot;máximo&quot;, etc.
              para un mejor análisis.
            </AlertDescription>
          </Alert>
        )}
    </div>
  );
}
