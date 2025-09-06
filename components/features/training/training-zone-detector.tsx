"use client";

import { useZoneDetection } from "@/lib/hooks/use-zone-detection";
import { useTrainingZones } from "@/lib/contexts/training-zones-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Activity,
  Target,
  Clock,
  MapPin,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Lightbulb,
} from "lucide-react";

interface TrainingZoneDetectorProps {
  content: string;
}

export function TrainingZoneDetector({ content }: TrainingZoneDetectorProps) {
  const { currentZones } = useTrainingZones();
  const detection = useZoneDetection(content);

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

  if (!content.trim()) {
    return (
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Detección de Zonas
          </CardTitle>
          <CardDescription>
            Escribe tu entrenamiento para ver el análisis automático
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Comienza a escribir tu entrenamiento...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Resumen General */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Análisis del Entrenamiento
          </CardTitle>
          <CardDescription>
            Detección automática de zonas y métricas
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
              <CheckCircle className="h-5 w-5 mx-auto mb-2 text-primary" />
              <div
                className={`text-lg font-bold ${getConfidenceColor(detection.confidence)}`}
              >
                {detection.confidence}%
              </div>
              <div className="text-xs text-muted-foreground">Confianza</div>
            </div>
          </div>

          {/* Barra de confianza */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Confianza del análisis</span>
              <span className={getConfidenceColor(detection.confidence)}>
                {detection.confidence}%
              </span>
            </div>
            <Progress value={detection.confidence} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Zonas Detectadas */}
      {detection.detectedZones.length > 0 && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Zonas de Intensidad Detectadas
            </CardTitle>
            <CardDescription>
              Distribución de zonas según tu metodología actual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {detection.detectedZones.map(zone => (
                <div
                  key={zone}
                  className="p-4 border rounded-lg bg-background/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getZoneColor(zone)}>{zone}</Badge>
                    <span className="text-sm font-medium">
                      {detection.zoneDistribution[zone].toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {currentZones[zone as keyof typeof currentZones]}
                  </div>
                  <Progress
                    value={detection.zoneDistribution[zone]}
                    className="h-2"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {detection.zoneBreakdown[zone].distance.toFixed(0)}m
                    estimados
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estilos e Intensidades Detectadas */}
      {(detection.detectedStrokes.length > 0 ||
        detection.detectedIntensities.length > 0) && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Elementos Detectados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {detection.detectedStrokes.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Estilos de Natación:</h4>
                <div className="flex flex-wrap gap-2">
                  {detection.detectedStrokes.map(stroke => (
                    <Badge key={stroke} variant="secondary">
                      {stroke}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {detection.detectedIntensities.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Niveles de Intensidad:</h4>
                <div className="flex flex-wrap gap-2">
                  {detection.detectedIntensities.map(intensity => (
                    <Badge key={intensity} variant="outline">
                      {intensity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sugerencias */}
      {detection.suggestions.length > 0 && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">
                Sugerencias para mejorar tu entrenamiento:
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

      {/* Advertencia si no se detectan zonas */}
      {detection.detectedZones.length === 0 && content.length > 50 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No se detectaron zonas de intensidad. Considera agregar referencias
            como &quot;Z1&quot;, &quot;Z2&quot;, &quot;aeróbico&quot;,
            &quot;umbral&quot;, &quot;máximo&quot;, etc. para un mejor análisis.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
