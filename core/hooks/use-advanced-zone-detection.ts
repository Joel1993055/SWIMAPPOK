'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

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

// Multi-layer detection engine
class ZoneDetectionEngine {
  private zoneKeywords = {
    Z1: {
      keywords: [
        'warm-up',
        'cool-down',
        'easy',
        'recovery',
        'regeneration',
        'relaxed',
        'calm',
        'slow',
        'easy pace',
        'z1',
        'zone 1',
        'base aerobic',
        'easy endurance',
      ],
      patterns: [
        /warm.?up/gi,
        /cool.?down/gi,
        /recovery/gi,
        /regeneration/gi,
        /easy/gi,
        /relaxed/gi,
        /calm/gi,
        /slow/gi,
        /\bz1\b/gi,
        /zone 1/gi,
      ],
      intensity: 'low',
      heartRate: '60-70%',
      weight: 1.0,
    },
    Z2: {
      keywords: [
        'aerobic',
        'base',
        'endurance',
        'steady',
        'continuous',
        'moderate',
        'comfortable',
        'z2',
        'zone 2',
        'aerobic base',
        'base endurance',
        'endurance pace',
      ],
      patterns: [
        /aerobic/gi,
        /\bbase\b/gi,
        /endurance/gi,
        /steady/gi,
        /continuous/gi,
        /moderate/gi,
        /\bz2\b/gi,
        /zone 2/gi,
        /endurance pace/gi,
      ],
      intensity: 'moderate',
      heartRate: '70-80%',
      weight: 1.0,
    },
    Z3: {
      keywords: [
        'threshold',
        'tempo',
        'pace',
        'hard',
        'strong',
        'challenging',
        'effort',
        'z3',
        'zone 3',
        'aerobic threshold',
        'threshold pace',
      ],
      patterns: [
        /threshold/gi,
        /tempo/gi,
        /pace/gi,
        /hard/gi,
        /strong/gi,
        /challenging/gi,
        /\bz3\b/gi,
        /zone 3/gi,
        /aerobic threshold/gi,
        /threshold pace/gi,
      ],
      intensity: 'moderate-high',
      heartRate: '80-90%',
      weight: 1.2,
    },
    Z4: {
      keywords: [
        'vo2',
        'vo2 max',
        'maximal',
        'very hard',
        'speed',
        'power',
        'sprint',
        'z4',
        'zone 4',
        'lactate',
        'anaerobic',
      ],
      patterns: [
        /vo2/gi,
        /max(imal)?/gi,
        /very hard/gi,
        /sprint/gi,
        /speed/gi,
        /power/gi,
        /\bz4\b/gi,
        /zone 4/gi,
        /lactate/gi,
        /anaerobic/gi,
      ],
      intensity: 'high',
      heartRate: '90-95%',
      weight: 1.3,
    },
    Z5: {
      keywords: [
        'neuromuscular',
        'explosive',
        'max speed',
        'all-out sprint',
        'z5',
        'zone 5',
        'maximum speed',
        'force',
        'explosion',
      ],
      patterns: [
        /neuromuscular/gi,
        /explosive/gi,
        /max(imum)? speed/gi,
        /all-?out (sprint)?/gi,
        /\bz5\b/gi,
        /zone 5/gi,
        /force/gi,
        /explosion/gi,
      ],
      intensity: 'maximal',
      heartRate: '95-100%',
      weight: 1.4,
    },
  };

  private strokeKeywords = {
    Freestyle: ['freestyle', 'free', 'crawl'],
    Backstroke: ['backstroke', 'back'],
    Breaststroke: ['breaststroke', 'breast'],
    Butterfly: ['butterfly', 'fly'],
  };

  private intensityKeywords = {
    Low: ['easy', 'relaxed', 'calm', 'slow', 'comfortable'],
    Medium: ['moderate', 'steady', 'balanced', 'normal'],
    High: ['hard', 'strong', 'challenging', 'effort', 'tough', 'demanding'],
    Maximal: ['max', 'sprint', 'explosive', 'maximum speed', 'all-out', 'extreme'],
  };

  private contextualAnalysis = {
    trainingType: {
      endurance: ['Z1', 'Z2'],
      tempo: ['Z2', 'Z3'],
      intervals: ['Z3', 'Z4', 'Z5'],
      sprint: ['Z4', 'Z5'],
      recovery: ['Z1'],
      technique: ['Z1', 'Z2'],
      strength: ['Z4', 'Z5'],
    },
    phase: {
      preparation: ['Z1', 'Z2'],
      base: ['Z2', 'Z3'],
      specific: ['Z3', 'Z4'],
      competition: ['Z4', 'Z5'],
      recovery: ['Z1'],
    },
  };

  // Keyword analysis
  analyzeKeywords(content: string): ZoneDetectionResult[] {
    const text = content.toLowerCase();
    const results: ZoneDetectionResult[] = [];

    Object.entries(this.zoneKeywords).forEach(([zone, config]) => {
      let confidence = 0;
      let context = '';

      // Keyword scoring
      config.keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          confidence += matches.length * 15 * config.weight;
          context += `${keyword} `;
        }
      });

      // Pattern scoring
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
            intensity: this.getIntensityValue(config.intensity),
          },
        });
      }
    });

    return results.sort((a, b) => b.confidence - a.confidence);
  }

  // Metric analysis
  analyzeMetrics(content: string): ZoneDetectionResult[] {
    const results: ZoneDetectionResult[] = [];
    const text = content.toLowerCase();

    // Interval analysis (e.g., 10x100m)
    const intervalRegex = /(\d+)x(\d+)\s*(?:m|meters?)/gi;
    const intervalMatches = text.match(intervalRegex);
    if (intervalMatches) {
      intervalMatches.forEach(match => {
        const [reps, distance] =
          match.match(/(\d+)x(\d+)/)?.slice(1).map(Number) || [0, 0];
        const intervalDistance = reps * distance;

        // Classify by interval distance
        if (distance <= 50) {
          results.push({
            zone: 'Z5',
            confidence: 80,
            context: `Short intervals ${match}`,
            metrics: { distance: intervalDistance, duration: reps * 2 },
          });
        } else if (distance <= 100) {
          results.push({
            zone: 'Z4',
            confidence: 75,
            context: `Medium intervals ${match}`,
            metrics: { distance: intervalDistance, duration: reps * 3 },
          });
        } else {
          results.push({
            zone: 'Z3',
            confidence: 70,
            context: `Long intervals ${match}`,
            metrics: { distance: intervalDistance, duration: reps * 5 },
          });
        }
      });
    }

    // Rest analysis (e.g., 30s rest / 1 min rest)
    const restRegex =
      /(\d+)\s*(?:s|sec|seconds?|min|minutes?)\s*(?:rest|recovery)/gi;
    const restMatches = text.match(restRegex);
    if (restMatches) {
      restMatches.forEach(match => {
        const restTime = parseInt(match.replace(/[^\d]/g, ''));
        if (restTime <= 30) {
          results.push({
            zone: 'Z5',
            confidence: 85,
            context: `Short rest ${match}`,
            metrics: { duration: restTime },
          });
        } else if (restTime <= 60) {
          results.push({
            zone: 'Z4',
            confidence: 80,
            context: `Medium rest ${match}`,
            metrics: { duration: restTime },
          });
        }
      });
    }

    return results;
  }

  // Contextual analysis
  analyzeContext(content: string, context: TrainingContext): ZoneDetectionResult[] {
    const results: ZoneDetectionResult[] = [];

    // By training type
    if (context.trainingType) {
      const expectedZones =
        this.contextualAnalysis.trainingType[
          context.trainingType.toLowerCase() as keyof typeof this.contextualAnalysis.trainingType
        ];
      if (expectedZones) {
        expectedZones.forEach(zone => {
          results.push({
            zone,
            confidence: 60,
            context: `Training type: ${context.trainingType}`,
            metrics: {
              intensity: this.getIntensityValue(
                this.zoneKeywords[zone as keyof typeof this.zoneKeywords].intensity
              ),
            },
          });
        });
      }
    }

    // By phase
    if (context.phase) {
      const expectedZones =
        this.contextualAnalysis.phase[
          context.phase.toLowerCase() as keyof typeof this.contextualAnalysis.phase
        ];
      if (expectedZones) {
        expectedZones.forEach(zone => {
          results.push({
            zone,
            confidence: 50,
            context: `Phase: ${context.phase}`,
            metrics: {
              intensity: this.getIntensityValue(
                this.zoneKeywords[zone as keyof typeof this.zoneKeywords].intensity
              ),
            },
          });
        });
      }
    }

    return results;
  }

  // Smart merge of results
  mergeResults(results: ZoneDetectionResult[][]): ZoneDetectionResult[] {
    const zoneScores = new Map<
      string,
      {
        confidence: number;
        contexts: string[];
        metrics: Record<string, unknown>;
      }
    >();

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
          metrics: result.metrics || {},
        });
      }
    });

    return Array.from(zoneScores.entries())
      .map(([zone, data]) => ({
        zone,
        confidence: data.confidence,
        context: data.contexts.join(', '),
        metrics: data.metrics,
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5); // Top 5 zones
  }

  // Stroke detection
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

  // Intensity detection
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

  // Total metrics calculation
  calculateMetrics(
    content: string,
    detectedZones: ZoneDetectionResult[]
  ): {
    totalDistance: number;
    estimatedDuration: number;
    zoneDistribution: Record<string, number>;
    zoneBreakdown: Record<string, { distance: number; percentage: number }>;
  } {
    const text = content.toLowerCase();

    // Extract distances (m / km)
    const distanceRegex = /(\d+(?:\.\d+)?)\s*(?:m|meters?|km|kilometers?)/gi;
    const distanceMatches = text.match(distanceRegex);
    let totalDistance = 0;

    if (distanceMatches) {
      totalDistance = distanceMatches.reduce((sum, match) => {
        const value = parseFloat(match.replace(/[^\d.]/g, ''));
        const unit = /km|kilometer/.test(match.toLowerCase()) ? value * 1000 : value;
        return sum + unit;
      }, 0);
    }

    // Zone distribution
    const totalConfidence = detectedZones.reduce(
      (sum, zone) => sum + zone.confidence,
      0
    );
    const zoneDistribution: Record<string, number> = {};
    const zoneBreakdown: Record<string, { distance: number; percentage: number }> = {};

    detectedZones.forEach(zone => {
      const percentage =
        totalConfidence > 0 ? (zone.confidence / totalConfidence) * 100 : 0;
      zoneDistribution[zone.zone] = percentage;
      zoneBreakdown[zone.zone] = {
        distance: (totalDistance * percentage) / 100,
        percentage,
      };
    });

    // Duration estimate (very rough heuristic: ~25 min per km)
    const estimatedDuration =
      totalDistance > 0 ? Math.round((totalDistance / 1000) * 25) : 0;

    return {
      totalDistance,
      estimatedDuration,
      zoneDistribution,
      zoneBreakdown,
    };
  }

  // Smart suggestions
  generateSuggestions(content: string, detectedZones: ZoneDetectionResult[]): string[] {
    const suggestions: string[] = [];
    const text = content.toLowerCase();

    if (detectedZones.length === 0) {
      suggestions.push('Consider adding intensity zones (Z1–Z5) for better analysis.');
    }

    if (detectedZones.length > 0 && !detectedZones.some(z => z.zone === 'Z1')) {
      suggestions.push('Add a Z1 warm-up at the start of the session.');
    }

    if (
      detectedZones.some(z => ['Z3', 'Z4', 'Z5'].includes(z.zone)) &&
      !detectedZones.some(z => z.zone === 'Z1')
    ) {
      suggestions.push('Include a Z1 cool-down after high-intensity work.');
    }

    if (!/(\d+)\s*(m|meters?|km|kilometers?)/i.test(text)) {
      suggestions.push('Specify distances (e.g., 200m, 1.5km) for more accurate analysis.');
    }

    if (
      !/(freestyle|free|crawl|backstroke|back|breaststroke|breast|butterfly|fly)/i.test(
        text
      )
    ) {
      suggestions.push('Mention strokes used (freestyle, backstroke, breaststroke, butterfly).');
    }

    if (detectedZones.length > 0 && detectedZones.every(z => z.confidence < 70)) {
      suggestions.push('Be more explicit with intensity cues to improve detection accuracy.');
    }

    return suggestions;
  }

  private getIntensityValue(intensity: string): number {
    switch (intensity) {
      case 'low':
        return 1;
      case 'moderate':
        return 2;
      case 'moderate-high':
        return 3;
      case 'high':
        return 4;
      case 'maximal':
        return 5;
      default:
        return 0;
    }
  }
}

export function useAdvancedZoneDetection(
  content: string,
  context: TrainingContext = {}
): AdvancedZoneDetection {
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
    isLoading: false,
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
        isLoading: false,
      });
      return;
    }

    setDetection(prev => ({ ...prev, isLoading: true }));

    try {
      // Multi-layer analysis
      const keywordResults = engine.analyzeKeywords(content);
      const metricResults = engine.analyzeMetrics(content);
      const contextualResults = engine.analyzeContext(content, context);

      // Smart merge
      const mergedZones = engine.mergeResults([
        keywordResults,
        metricResults,
        contextualResults,
      ]);

      // Extra metrics
      const metrics = engine.calculateMetrics(content, mergedZones);
      const detectedStrokes = engine.detectStrokes(content);
      const detectedIntensities = engine.detectIntensities(content);
      const suggestions = engine.generateSuggestions(content, mergedZones);

      // Overall confidence
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
        isLoading: false,
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
