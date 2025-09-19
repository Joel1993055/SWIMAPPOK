'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Detección Automática de Zonas
          </CardTitle>
          <CardDescription>
            Usa IA para detectar automáticamente los metros por zona basándose en tu descripción
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Escribe una descripción de tu entrenamiento para activar la detección automática</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Detección Automática de Zonas
        </CardTitle>
        <CardDescription>
          Usa IA para detectar automáticamente los metros por zona basándose en tu descripción
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Botón de detección */}
        <div className="flex gap-2">
          <Button
            onClick={handleDetect}
            disabled={isDetecting || disabled}
            className="flex-1"
          >
            {isDetecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analizando con IA...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Detectar Zonas con IA
              </>
            )}
          </Button>
          
          {result && (
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Ocultar' : 'Ver Detalles'}
            </Button>
          )}
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Error en la detección de zonas:</p>
                <p>{error}</p>
                {error.includes('OpenAI') && (
                  <div className="text-sm bg-muted p-2 rounded">
                    <p className="font-medium">Solución:</p>
                    <ol className="list-decimal list-inside space-y-1 mt-1">
                      <li>Configura OPENAI_API_KEY en tu archivo .env.local</li>
                      <li>Reinicia el servidor de desarrollo</li>
                      <li>Verifica que la clave de API sea válida</li>
                    </ol>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Resultado */}
        {result && (
          <div className="space-y-4">
            {/* Resumen */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Confianza:</span>
                <div className="flex items-center gap-2">
                  {getConfidenceIcon(result.confidence)}
                  <span className={`text-sm font-bold ${getConfidenceColor(result.confidence)}`}>
                    {result.confidence}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total:</span>
                <Badge variant="outline">
                  {Object.values(result.zones).reduce((sum, zone) => sum + zone, 0)}m
                </Badge>
              </div>
            </div>

            {/* Zonas detectadas */}
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(result.zones).map(([zone, meters]) => (
                <div key={zone} className="text-center p-2 border rounded-lg bg-background/50">
                  <div className="text-xs font-medium text-muted-foreground">
                    {zone.toUpperCase()}
                  </div>
                  <div className="text-lg font-bold">
                    {meters}m
                  </div>
                </div>
              ))}
            </div>

            {/* Botón aplicar */}
            <Button
              onClick={handleApplyZones}
              className="w-full"
              disabled={result.confidence < 30}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Aplicar Zonas Detectadas
            </Button>

            {/* Detalles expandibles */}
            {isExpanded && (
              <div className="space-y-3 pt-4 border-t">
                {/* Razonamiento */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Análisis de la IA:</h4>
                  <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded-lg">
                    {result.reasoning}
                  </p>
                </div>

                {/* Sugerencias */}
                {result.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Sugerencias:
                    </h4>
                    <ul className="space-y-1">
                      {result.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
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
      </CardContent>
    </Card>
  );
}
