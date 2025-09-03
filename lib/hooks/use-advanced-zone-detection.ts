"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';


interface ZoneDetectionResult {
  zone: string;
  confidence: number;
  context: string;
  metrics?: {
    distance?: number;
    duration?: number;
    intensity?: number;
  };
}

interface AdvancedZoneDetection {
  detectedZones: ZoneDetectionResult[];
  totalDistance: number;
  estimatedDuration: number;
  zoneDistribution: Record<string, number>;
  zoneBreakdown: Record<string, { distance: number; percentage: number }>;
  detectedStrokes: string[];
  detectedIntensities: string[];
  confidence: number;
  suggestions: string[];
  isLoading: boolean;
}

interface TrainingContext {
  trainingType?: string;
  phase?: string;
  competition?: boolean;
  previousZones?: string[];
}

// Motor de detección multi-capa
class ZoneDetectionEngine {
  private zoneKeywords = {
    Z1: {
      keywords: [
        'calentamiento', 'calma', 'recuperación', 'regenerativo', 'suave', 'fácil', 
        'relajado', 'tranquilo', 'lento', 'warm-up', 'cool-down', 'vuelta a la calma',
        'z1', 'zona 1', 'recuperación', 'regenerativo', 'aeróbico base', 'fondo suave'
      ],
      patterns: [
        /calentamiento/gi, /calma/gi, /recuperación/gi, /regenerativo/gi, /suave/gi,
        /warm.?up/gi, /cool.?down/gi, /vuelta a la calma/gi, /z1/gi, /zona 1/gi
      ],
      intensity: 'baja',
      heartRate: '60-70%',
      weight: 1.0
    },
    Z2: {
      keywords: [
        'aeróbico', 'base', 'resistencia', 'continuo', 'moderado', 'confortable',
        'z2', 'zona 2', 'aeróbico base', 'resistencia base', 'fondo', 'ritmo base'
      ],
      patterns: [
        /aeróbico/gi, /base/gi, /resistencia/gi, /continuo/gi, /moderado/gi,
        /z2/gi, /zona 2/gi, /fondo/gi, /ritmo base/gi
      ],
      intensity: 'moderada',
      heartRate: '70-80%',
      weight: 1.0
    },
    Z3: {
      keywords: [
        'umbral', 'tempo', 'ritmo', 'intenso', 'fuerte', 'desafiante', 'esfuerzo',
        'z3', 'zona 3', 'aeróbico umbral', 'umbral aeróbico', 'tempo', 'ritmo umbral'
      ],
      patterns: [
        /umbral/gi, /tempo/gi, /ritmo/gi, /intenso/gi, /fuerte/gi, /desafiante/gi,
        /z3/gi, /zona 3/gi, /aeróbico umbral/gi, /umbral aeróbico/gi
      ],
      intensity: 'moderada-alta',
      heartRate: '80-90%',
      weight: 1.2
    },
    Z4: {
      keywords: [
        'vo2', 'máximo', 'muy intenso', 'sprint', 'velocidad', 'potencia',
        'z4', 'zona 4', 'vo2 max', 'máximo consumo', 'lactato', 'anaeróbico'
      ],
      patterns: [
        /vo2/gi, /máximo/gi, /muy intenso/gi, /sprint/gi, /velocidad/gi, /potencia/gi,
        /z4/gi, /zona 4/gi, /vo2 max/gi, /lactato/gi, /anaeróbico/gi
      ],
      intensity: 'alta',
      heartRate: '90-95%',
      weight: 1.3
    },
    Z5: {
      keywords: [
        'neuromuscular', 'explosivo', 'máxima velocidad', 'sprint máximo',
        'z5', 'zona 5', 'neuromuscular', 'velocidad máxima', 'fuerza', 'explosión'
      ],
      patterns: [
        /neuromuscular/gi, /explosivo/gi, /máxima velocidad/gi, /sprint máximo/gi,
        /z5/gi, /zona 5/gi, /velocidad máxima/gi, /fuerza/gi, /explosión/gi
      ],
      intensity: 'máxima',
      heartRate: '95-100%',
      weight: 1.4
    }
  };

  private strokeKeywords = {
    'Libre': ['libre', 'crawl', 'crol', 'freestyle', 'estilo libre'],
    'Espalda': ['espalda', 'backstroke', 'dorso', 'estilo espalda'],
    'Pecho': ['pecho', 'braza', 'breaststroke', 'brazada', 'estilo pecho'],
    'Mariposa': ['mariposa', 'butterfly', 'estilo mariposa']
  };

  private intensityKeywords = {
    'Baja': ['fácil', 'suave', 'relajado', 'tranquilo', 'lento', 'cómodo'],
    'Media': ['moderado', 'confortable', 'medio', 'normal', 'equilibrado'],
    'Alta': ['intenso', 'fuerte', 'desafiante', 'esfuerzo', 'duro', 'exigente'],
    'Máxima': ['máximo', 'sprint', 'explosivo', 'velocidad máxima', 'extremo']
  };

  private contextualAnalysis = {
    trainingType: {
      'fondo': ['Z1', 'Z2'],
      'tempo': ['Z2', 'Z3'],
      'intervalos': ['Z3', 'Z4', 'Z5'],
      'sprint': ['Z4', 'Z5'],
      'recuperación': ['Z1'],
      'técnica': ['Z1', 'Z2'],
      'fuerza': ['Z4', 'Z5']
    },
    phase: {
      'preparación': ['Z1', 'Z2'],
      'base': ['Z2', 'Z3'],
      'específica': ['Z3', 'Z4'],
      'competición': ['Z4', 'Z5'],
      'recuperación': ['Z1']
    }
  };

  // Análisis de palabras clave
  analyzeKeywords(content: string): ZoneDetectionResult[] {
    const text = content.toLowerCase();
    const results: ZoneDetectionResult[] = [];

    Object.entries(this.zoneKeywords).forEach(([zone, config]) => {
      let confidence = 0;
      let context = '';

      // Análisis de palabras clave
      config.keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          confidence += matches.length * 15 * config.weight;
          context += `${keyword} `;
        }
      });

      // Análisis de patrones
      config.patterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
          confidence += matches.length * 20 * config.weight;
        }
      });

      if (confidence > 0) {
        results.push({
          zone,
          confidence: Math.min(confidence, 100),
          context: context.trim(),
          metrics: {
            intensity: this.getIntensityValue(config.intensity)
          }
        });
      }
    });

    return results.sort((a, b) => b.confidence - a.confidence);
  }

  // Análisis de métricas
  analyzeMetrics(content: string): ZoneDetectionResult[] {
    const results: ZoneDetectionResult[] = [];
    const text = content.toLowerCase();

    // Análisis de intervalos
    const intervalRegex = /(\d+)x(\d+)\s*(?:m|metros?)/gi;
    const intervalMatches = text.match(intervalRegex);
    if (intervalMatches) {
      intervalMatches.forEach(match => {
        const [reps, distance] = match.match(/(\d+)x(\d+)/)?.slice(1).map(Number) || [0, 0];
        const intervalDistance = reps * distance;

        // Clasificar por distancia del intervalo
        if (distance <= 50) {
          results.push({
            zone: 'Z5',
            confidence: 80,
            context: `Intervalos cortos ${match}`,
            metrics: { distance: intervalDistance, duration: reps * 2 }
          });
        } else if (distance <= 100) {
          results.push({
            zone: 'Z4',
            confidence: 75,
            context: `Intervalos medios ${match}`,
            metrics: { distance: intervalDistance, duration: reps * 3 }
          });
        } else {
          results.push({
            zone: 'Z3',
            confidence: 70,
            context: `Intervalos largos ${match}`,
            metrics: { distance: intervalDistance, duration: reps * 5 }
          });
        }
      });
    }

    // Análisis de descansos
    const restRegex = /(\d+)\s*(?:s|segundos?|min|minutos?)\s*(?:descanso|rest)/gi;
    const restMatches = text.match(restRegex);
    if (restMatches) {
      restMatches.forEach(match => {
        const restTime = parseInt(match.replace(/[^\d]/g, ''));
        if (restTime <= 30) {
          results.push({
            zone: 'Z5',
            confidence: 85,
            context: `Descanso corto ${match}`,
            metrics: { duration: restTime }
          });
        } else if (restTime <= 60) {
          results.push({
            zone: 'Z4',
            confidence: 80,
            context: `Descanso medio ${match}`,
            metrics: { duration: restTime }
          });
        }
      });
    }

    return results;
  }

  // Análisis contextual
  analyzeContext(content: string, context: TrainingContext): ZoneDetectionResult[] {
    const results: ZoneDetectionResult[] = [];
    const text = content.toLowerCase();

    // Análisis por tipo de entrenamiento
    if (context.trainingType) {
      const expectedZones = this.contextualAnalysis.trainingType[context.trainingType.toLowerCase() as keyof typeof this.contextualAnalysis.trainingType];
      if (expectedZones) {
        expectedZones.forEach(zone => {
          results.push({
            zone,
            confidence: 60,
            context: `Tipo de entrenamiento: ${context.trainingType}`,
            metrics: { intensity: this.getIntensityValue(this.zoneKeywords[zone as keyof typeof this.zoneKeywords].intensity) }
          });
        });
      }
    }

    // Análisis por fase
    if (context.phase) {
      const expectedZones = this.contextualAnalysis.phase[context.phase.toLowerCase() as keyof typeof this.contextualAnalysis.phase];
      if (expectedZones) {
        expectedZones.forEach(zone => {
          results.push({
            zone,
            confidence: 50,
            context: `Fase: ${context.phase}`,
            metrics: { intensity: this.getIntensityValue(this.zoneKeywords[zone as keyof typeof this.zoneKeywords].intensity) }
          });
        });
      }
    }

    return results;
  }

  // Fusión inteligente de resultados
  mergeResults(results: ZoneDetectionResult[][]): ZoneDetectionResult[] {
    const zoneScores = new Map<string, { confidence: number; contexts: string[]; metrics: Record<string, unknown> }>();

    results.flat().forEach(result => {
      const existing = zoneScores.get(result.zone);
      if (existing) {
        existing.confidence = Math.max(existing.confidence, result.confidence);
        existing.contexts.push(result.context);
        existing.metrics = { ...existing.metrics, ...result.metrics };
      } else {
        zoneScores.set(result.zone, {
          confidence: result.confidence,
          contexts: [result.context],
          metrics: result.metrics || {}
        });
      }
    });

    return Array.from(zoneScores.entries())
      .map(([zone, data]) => ({
        zone,
        confidence: data.confidence,
        context: data.contexts.join(', '),
        metrics: data.metrics
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5); // Top 5 zonas
  }

  // Detectar estilos
  detectStrokes(content: string): string[] {
    const text = content.toLowerCase();
    const detectedStrokes: string[] = [];

    Object.entries(this.strokeKeywords).forEach(([stroke, keywords]) => {
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        if (regex.test(text) && !detectedStrokes.includes(stroke)) {
          detectedStrokes.push(stroke);
        }
      });
    });

    return detectedStrokes;
  }

  // Detectar intensidades
  detectIntensities(content: string): string[] {
    const text = content.toLowerCase();
    const detectedIntensities: string[] = [];

    Object.entries(this.intensityKeywords).forEach(([intensity, keywords]) => {
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        if (regex.test(text) && !detectedIntensities.includes(intensity)) {
          detectedIntensities.push(intensity);
        }
      });
    });

    return detectedIntensities;
  }

  // Calcular métricas totales
  calculateMetrics(content: string, detectedZones: ZoneDetectionResult[]): {
    totalDistance: number;
    estimatedDuration: number;
    zoneDistribution: Record<string, number>;
    zoneBreakdown: Record<string, { distance: number; percentage: number }>;
  } {
    const text = content.toLowerCase();
    
    // Extraer distancias
    const distanceRegex = /(\d+(?:\.\d+)?)\s*(?:m|metros?|km|kilómetros?)/gi;
    const distanceMatches = text.match(distanceRegex);
    let totalDistance = 0;

    if (distanceMatches) {
      totalDistance = distanceMatches.reduce((sum, match) => {
        const value = parseFloat(match.replace(/[^\d.]/g, ''));
        const unit = match.toLowerCase().includes('km') ? value * 1000 : value;
        return sum + unit;
      }, 0);
    }

    // Calcular distribución de zonas
    const totalConfidence = detectedZones.reduce((sum, zone) => sum + zone.confidence, 0);
    const zoneDistribution: Record<string, number> = {};
    const zoneBreakdown: Record<string, { distance: number; percentage: number }> = {};

    detectedZones.forEach(zone => {
      const percentage = totalConfidence > 0 ? (zone.confidence / totalConfidence) * 100 : 0;
      zoneDistribution[zone.zone] = percentage;
      zoneBreakdown[zone.zone] = {
        distance: (totalDistance * percentage) / 100,
        percentage
      };
    });

    // Estimar duración
    const estimatedDuration = totalDistance > 0 ? Math.round((totalDistance / 1000) * 25) : 0;

    return {
      totalDistance,
      estimatedDuration,
      zoneDistribution,
      zoneBreakdown
    };
  }

  // Generar sugerencias inteligentes
  generateSuggestions(content: string, detectedZones: ZoneDetectionResult[]): string[] {
    const suggestions: string[] = [];
    const text = content.toLowerCase();

    if (detectedZones.length === 0) {
      suggestions.push("Considera agregar zonas de intensidad (Z1, Z2, Z3, Z4, Z5) para un mejor análisis");
    }

    if (detectedZones.length > 0 && !detectedZones.some(z => z.zone === 'Z1')) {
      suggestions.push("Agrega un calentamiento en Z1 para comenzar el entrenamiento");
    }

    if (detectedZones.some(z => ['Z3', 'Z4', 'Z5'].includes(z.zone)) && !detectedZones.some(z => z.zone === 'Z1')) {
      suggestions.push("Incluye vuelta a la calma en Z1 después del trabajo intenso");
    }

    if (!text.includes('m') && !text.includes('metros') && !text.includes('km')) {
      suggestions.push("Especifica las distancias (ej: 200m, 1.5km) para un análisis más preciso");
    }

    if (!text.includes('libre') && !text.includes('espalda') && !text.includes('pecho') && !text.includes('mariposa')) {
      suggestions.push("Menciona los estilos de natación (libre, espalda, pecho, mariposa)");
    }

    if (detectedZones.length > 0 && detectedZones.every(z => z.confidence < 70)) {
      suggestions.push("Considera ser más específico con las zonas de intensidad para mayor precisión");
    }

    return suggestions;
  }

  private getIntensityValue(intensity: string): number {
    switch (intensity) {
      case 'baja': return 1;
      case 'moderada': return 2;
      case 'moderada-alta': return 3;
      case 'alta': return 4;
      case 'máxima': return 5;
      default: return 0;
    }
  }
}

export function useAdvancedZoneDetection(content: string, context: TrainingContext = {}): AdvancedZoneDetection {
  const [detection, setDetection] = useState<AdvancedZoneDetection>({
    detectedZones: [],
    totalDistance: 0,
    estimatedDuration: 0,
    zoneDistribution: {},
    zoneBreakdown: {},
    detectedStrokes: [],
    detectedIntensities: [],
    confidence: 0,
    suggestions: [],
    isLoading: false
  });

  const engine = useMemo(() => new ZoneDetectionEngine(), []);

  const analyzeContent = useCallback(async () => {
    if (!content.trim() || content.length < 10) {
      setDetection({
        detectedZones: [],
        totalDistance: 0,
        estimatedDuration: 0,
        zoneDistribution: {},
        zoneBreakdown: {},
        detectedStrokes: [],
        detectedIntensities: [],
        confidence: 0,
        suggestions: [],
        isLoading: false
      });
      return;
    }

    setDetection(prev => ({ ...prev, isLoading: true }));

    try {
      // Análisis multi-capa
      const keywordResults = engine.analyzeKeywords(content);
      const metricResults = engine.analyzeMetrics(content);
      const contextualResults = engine.analyzeContext(content, context);

      // Fusión inteligente
      const mergedZones = engine.mergeResults([keywordResults, metricResults, contextualResults]);

      // Métricas adicionales
      const metrics = engine.calculateMetrics(content, mergedZones);
      const detectedStrokes = engine.detectStrokes(content);
      const detectedIntensities = engine.detectIntensities(content);
      const suggestions = engine.generateSuggestions(content, mergedZones);

      // Calcular confianza general
      const confidence = Math.min(
        (mergedZones.length > 0 ? 40 : 0) +
        (metrics.totalDistance > 0 ? 25 : 0) +
        (detectedStrokes.length > 0 ? 20 : 0) +
        (detectedIntensities.length > 0 ? 15 : 0),
        100
      );

      setDetection({
        detectedZones: mergedZones,
        totalDistance: metrics.totalDistance,
        estimatedDuration: metrics.estimatedDuration,
        zoneDistribution: metrics.zoneDistribution,
        zoneBreakdown: metrics.zoneBreakdown,
        detectedStrokes,
        detectedIntensities,
        confidence,
        suggestions,
        isLoading: false
      });
    } catch (error) {
      console.error('Error in zone detection:', error);
      setDetection(prev => ({ ...prev, isLoading: false }));
    }
  }, [content, context, engine]);

  useEffect(() => {
    const timeoutId = setTimeout(analyzeContent, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [analyzeContent]);

  return detection;
}
