import { ZoneDetectionResult } from '@/lib/services/ai-zone-detector';
import { useCallback, useState } from 'react';

interface UseAIZoneDetectionReturn {
  isDetecting: boolean;
  result: ZoneDetectionResult | null;
  error: string | null;
  detectZones: (content: string, objective?: string, timeSlot?: 'AM' | 'PM') => Promise<void>;
  reset: () => void;
}

export function useAIZoneDetection(): UseAIZoneDetectionReturn {
  const [isDetecting, setIsDetecting] = useState(false);
  const [result, setResult] = useState<ZoneDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const detectZones = useCallback(async (
    content: string, 
    objective?: string, 
    timeSlot?: 'AM' | 'PM'
  ) => {
    if (!content.trim()) {
      setError('El contenido del entrenamiento no puede estar vacío');
      return;
    }

    setIsDetecting(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/detect-zones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          objective,
          timeSlot
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la detección de zonas');
      }

      setResult(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error detecting zones:', err);
    } finally {
      setIsDetecting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsDetecting(false);
  }, []);

  return {
    isDetecting,
    result,
    error,
    detectZones,
    reset
  };
}
