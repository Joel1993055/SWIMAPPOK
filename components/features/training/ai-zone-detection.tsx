'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAIZoneDetection } from '@/lib/hooks/use-ai-zone-detection';
import { AlertCircle, Brain, CheckCircle, Lightbulb, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface AIZoneDetectionProps {
  content: string;
  objective?: string;
  timeSlot?: 'AM' | 'PM';
  onZonesDetected: (zones: { z1: number; z2: number; z3: number; z4: number; z5: number }) => void;
  disabled?: boolean;
}

export function AIZoneDetection({ 
  content, 
  objective, 
  timeSlot, 
  onZonesDetected, 
  disabled = false 
}: AIZoneDetectionProps) {
  const { isDetecting, result, error, detectZones, reset } = useAIZoneDetection();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDetect = async () => {
    await detectZones(content, objective, timeSlot);
  };

  const handleApplyZones = () => {
    if (result?.zones) {
      onZonesDetected(result.zones);
      setIsExpanded(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (confidence >= 60) return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };

  if (!content.trim()) {
    return (
      <div className="bg-muted/30 rounded-lg p-4 border border-dashed">
        <div className="text-center text-muted-foreground">
          <Brain className="h-6 w-6 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Escribe tu entrenamiento para activar la detección automática de zonas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 rounded-lg p-4 border">
      {/* Header compacto */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Detección Automática de Zonas</span>
        </div>
        {result && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 px-2 text-xs"
          >
            {isExpanded ? 'Ocultar' : 'Detalles'}
          </Button>
        )}
      </div>

      {/* Botón de detección */}
      <div className="space-y-3">
        <Button
          onClick={handleDetect}
          disabled={isDetecting || disabled}
          className="w-full h-9"
          size="sm"
        >
          {isDetecting ? (
            <>
              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
              Analizando...
            </>
          ) : (
            <>
              <Brain className="h-3 w-3 mr-2" />
              Detectar Zonas con IA
            </>
          )}
        </Button>

        {/* Error compacto */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">Error en la detección</p>
                <p className="text-xs text-destructive/80">{error}</p>
                {error.includes('OpenAI') && (
                  <div className="text-xs bg-muted p-2 rounded mt-2">
                    <p className="font-medium">Solución:</p>
                    <ul className="list-disc list-inside space-y-0.5 mt-1">
                      <li>Configura OPENAI_API_KEY en .env.local</li>
                      <li>Reinicia el servidor</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Resultado compacto */}
        {result && (
          <div className="space-y-3">
            {/* Resumen compacto */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {getConfidenceIcon(result.confidence)}
                <span className={`font-medium ${getConfidenceColor(result.confidence)}`}>
                  {result.confidence}% confianza
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                {Object.values(result.zones).reduce((sum, zone) => sum + zone, 0)}m total
              </Badge>
            </div>

            {/* Zonas detectadas compactas */}
            <div className="grid grid-cols-5 gap-1">
              {Object.entries(result.zones).map(([zone, meters]) => (
                <div key={zone} className="text-center p-2 border rounded bg-background/50">
                  <div className="text-xs font-medium text-muted-foreground">
                    {zone.toUpperCase()}
                  </div>
                  <div className="text-sm font-bold">
                    {meters}m
                  </div>
                </div>
              ))}
            </div>

            {/* Botón aplicar compacto */}
            <Button
              onClick={handleApplyZones}
              className="w-full h-8"
              size="sm"
              disabled={result.confidence < 30}
            >
              <CheckCircle className="h-3 w-3 mr-2" />
              Aplicar Zonas
            </Button>

            {/* Detalles expandibles compactos */}
            {isExpanded && (
              <div className="space-y-2 pt-3 border-t">
                {/* Razonamiento */}
                <div>
                  <h4 className="text-xs font-medium mb-1">Análisis de la IA:</h4>
                  <p className="text-xs text-muted-foreground bg-background/50 p-2 rounded">
                    {result.reasoning}
                  </p>
                </div>

                {/* Sugerencias */}
                {result.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium mb-1 flex items-center gap-1">
                      <Lightbulb className="h-3 w-3" />
                      Sugerencias:
                    </h4>
                    <ul className="space-y-0.5">
                      {result.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                          <span className="text-primary">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
