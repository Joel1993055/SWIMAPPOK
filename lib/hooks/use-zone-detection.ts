'use client';

import { useEffect, useMemo, useState } from 'react';

interface ZoneDetection {
  detectedZones: string[];
  zoneDistribution: Record<string, number>;
  suggestions: string[];
  confidence: number;
}

interface TrainingMetrics {
  totalDistance: number;
  estimatedDuration: number;
  zoneBreakdown: Record<string, { distance: number; percentage: number }>;
  detectedStrokes: string[];
  detectedIntensities: string[];
}

// Zone detection keywords
const zoneKeywords = {
  Z1: [
    'warm-up',
    'cool-down',
    'recovery',
    'regenerative',
    'easy',
    'light',
    'relaxed',
    'calm',
    'slow',
    'z1',
    'zone 1',
  ],
  Z2: [
    'aerobic',
    'base',
    'endurance',
    'steady',
    'moderate',
    'comfortable',
    'z2',
    'zone 2',
    'aerobic base',
    'base endurance',
  ],
  Z3: [
    'threshold',
    'tempo',
    'pace',
    'intense',
    'hard',
    'challenging',
    'effort',
    'z3',
    'zone 3',
    'aerobic threshold',
  ],
  Z4: [
    'vo2',
    'max',
    'very intense',
    'sprint',
    'speed',
    'power',
    'z4',
    'zone 4',
    'vo2 max',
    'lactate',
    'anaerobic',
  ],
  Z5: [
    'neuromuscular',
    'explosive',
    'max speed',
    'all-out sprint',
    'z5',
    'zone 5',
    'maximum speed',
    'strength',
    'explosion',
  ],
};

// Stroke detection keywords
const strokeKeywords = {
  Freestyle: ['freestyle', 'free', 'crawl', 'front crawl'],
  Backstroke: ['backstroke', 'back', 'dorsal'],
  Breaststroke: ['breaststroke', 'breast', 'br'],
  Butterfly: ['butterfly', 'fly'],
};

// Intensity detection keywords
const intensityKeywords = {
  Low: ['easy', 'light', 'relaxed', 'calm', 'slow', 'comfortable'],
  Medium: ['moderate', 'steady', 'medium', 'controlled', 'balanced'],
  High: ['intense', 'hard', 'strong', 'challenging', 'effortful', 'tough', 'demanding'],
  Max: ['max', 'all-out', 'explosive', 'maximum speed', 'sprint'],
};

export function useZoneDetection(content: string): ZoneDetection & TrainingMetrics {
  const [detection, setDetection] = useState<ZoneDetection & TrainingMetrics>({
    detectedZones: [],
    zoneDistribution: {},
    suggestions: [],
    confidence: 0,
    totalDistance: 0,
    estimatedDuration: 0,
    zoneBreakdown: {},
    detectedStrokes: [],
    detectedIntensities: [],
  });

  const analysis = useMemo(() => {
    if (!content.trim()) {
      return {
        detectedZones: [],
        zoneDistribution: {},
        suggestions: [],
        confidence: 0,
        totalDistance: 0,
        estimatedDuration: 0,
        zoneBreakdown: {},
        detectedStrokes: [],
        detectedIntensities: [],
      };
    }

    const text = content.toLowerCase();
    const detectedZones: string[] = [];
    const zoneCounts: Record<string, number> = {};
    const detectedStrokes: string[] = [];
    const detectedIntensities: string[] = [];
    let totalDistance = 0;

    // Detect zones
    Object.entries(zoneKeywords).forEach(([zone, keywords]) => {
      keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          if (!detectedZones.includes(zone)) {
            detectedZones.push(zone);
          }
          zoneCounts[zone] = (zoneCounts[zone] || 0) + matches.length;
        }
      });
    });

    // Detect strokes
    Object.entries(strokeKeywords).forEach(([stroke, keywords]) => {
      keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        if (regex.test(text) && !detectedStrokes.includes(stroke)) {
          detectedStrokes.push(stroke);
        }
      });
    });

    // Detect intensities
    Object.entries(intensityKeywords).forEach(([intensity, keywords]) => {
      keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        if (regex.test(text) && !detectedIntensities.includes(intensity)) {
          detectedIntensities.push(intensity);
        }
      });
    });

    // Extract distances
    const distanceRegex = /(\d+(?:\.\d+)?)\s*(?:m|meters?|km|kilometers?)/gi;
    const distanceMatches = text.match(distanceRegex);
    if (distanceMatches) {
      totalDistance = distanceMatches.reduce((sum, match) => {
        const value = parseFloat(match.replace(/[^\d.]/g, ''));
        const unit = /km|kilometer/.test(match.toLowerCase()) ? value * 1000 : value;
        return sum + unit;
      }, 0);
    }

    // Calculate zone distribution
    const totalZoneMentions = Object.values(zoneCounts).reduce((sum, count) => sum + count, 0);
    const zoneDistribution: Record<string, number> = {};
    const zoneBreakdown: Record<string, { distance: number; percentage: number }> = {};

    detectedZones.forEach((zone) => {
      const percentage = totalZoneMentions > 0 ? (zoneCounts[zone] / totalZoneMentions) * 100 : 0;
      zoneDistribution[zone] = percentage;
      zoneBreakdown[zone] = {
        distance: (totalDistance * percentage) / 100,
        percentage,
      };
    });

    // Generate suggestions
    const suggestions: string[] = [];

    if (detectedZones.length === 0) {
      suggestions.push('Consider adding intensity zones (Z1, Z2, Z3, Z4, Z5).');
    }

    if (detectedZones.length > 0 && !detectedZones.includes('Z1')) {
      suggestions.push('Add a Z1 warm-up to start the session.');
    }

    if (
      detectedZones.length > 0 &&
      !detectedZones.includes('Z1') &&
      detectedZones.some((z) => ['Z3', 'Z4', 'Z5'].includes(z))
    ) {
      suggestions.push('Include a Z1 cool-down after the high-intensity work.');
    }

    if (totalDistance === 0) {
      suggestions.push('Specify distances (e.g., 200m, 1.5km) for better analysis.');
    }

    if (detectedStrokes.length === 0) {
      suggestions.push('Mention strokes (freestyle, backstroke, breaststroke, butterfly).');
    }

    // Compute confidence
    let confidence = 0;
    if (detectedZones.length > 0) confidence += 30;
    if (totalDistance > 0) confidence += 25;
    if (detectedStrokes.length > 0) confidence += 20;
    if (detectedIntensities.length > 0) confidence += 15;
    if (content.length > 100) confidence += 10;

    // Estimate duration (roughly: 1km ≈ 25 minutes)
    const estimatedDuration = totalDistance > 0 ? Math.round((totalDistance / 1000) * 25) : 0;

    return {
      detectedZones,
      zoneDistribution,
      suggestions,
      confidence: Math.min(confidence, 100),
      totalDistance,
      estimatedDuration,
      zoneBreakdown,
      detectedStrokes,
      detectedIntensities,
    };
  }, [content]);

  useEffect(() => {
    setDetection(analysis);
  }, [analysis]);

  return detection;
}
