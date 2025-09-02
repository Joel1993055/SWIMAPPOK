"use client";

import { useState, useEffect, useMemo } from 'react';

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

// Palabras clave para detección de zonas
const zoneKeywords = {
  Z1: [
    'calentamiento', 'calma', 'recuperación', 'regenerativo', 'suave', 'fácil', 
    'relajado', 'tranquilo', 'lento', 'warm-up', 'cool-down', 'vuelta a la calma',
    'z1', 'zona 1', 'recuperación', 'regenerativo'
  ],
  Z2: [
    'aeróbico', 'base', 'resistencia', 'continuo', 'moderado', 'confortable',
    'z2', 'zona 2', 'aeróbico base', 'resistencia base'
  ],
  Z3: [
    'umbral', 'tempo', 'ritmo', 'intenso', 'fuerte', 'desafiante', 'esfuerzo',
    'z3', 'zona 3', 'aeróbico umbral', 'umbral aeróbico'
  ],
  Z4: [
    'vo2', 'máximo', 'muy intenso', 'sprint', 'velocidad', 'potencia',
    'z4', 'zona 4', 'vo2 max', 'máximo consumo'
  ],
  Z5: [
    'neuromuscular', 'explosivo', 'máxima velocidad', 'sprint máximo',
    'z5', 'zona 5', 'neuromuscular', 'velocidad máxima'
  ]
};

// Palabras clave para detección de estilos
const strokeKeywords = {
  'Libre': ['libre', 'crawl', 'crol', 'freestyle'],
  'Espalda': ['espalda', 'backstroke', 'dorso'],
  'Pecho': ['pecho', 'braza', 'breaststroke', 'brazada'],
  'Mariposa': ['mariposa', 'butterfly', 'mariposa']
};

// Palabras clave para detección de intensidad
const intensityKeywords = {
  'Baja': ['fácil', 'suave', 'relajado', 'tranquilo', 'lento'],
  'Media': ['moderado', 'confortable', 'medio', 'normal'],
  'Alta': ['intenso', 'fuerte', 'desafiante', 'esfuerzo', 'duro'],
  'Máxima': ['máximo', 'sprint', 'explosivo', 'velocidad máxima']
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
    detectedIntensities: []
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
        detectedIntensities: []
      };
    }

    const text = content.toLowerCase();
    const detectedZones: string[] = [];
    const zoneCounts: Record<string, number> = {};
    const detectedStrokes: string[] = [];
    const detectedIntensities: string[] = [];
    let totalDistance = 0;

    // Detectar zonas
    Object.entries(zoneKeywords).forEach(([zone, keywords]) => {
      keywords.forEach(keyword => {
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

    // Detectar estilos
    Object.entries(strokeKeywords).forEach(([stroke, keywords]) => {
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        if (regex.test(text) && !detectedStrokes.includes(stroke)) {
          detectedStrokes.push(stroke);
        }
      });
    });

    // Detectar intensidades
    Object.entries(intensityKeywords).forEach(([intensity, keywords]) => {
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        if (regex.test(text) && !detectedIntensities.includes(intensity)) {
          detectedIntensities.push(intensity);
        }
      });
    });

    // Extraer distancias
    const distanceRegex = /(\d+(?:\.\d+)?)\s*(?:m|metros?|km|kilómetros?)/gi;
    const distanceMatches = text.match(distanceRegex);
    if (distanceMatches) {
      totalDistance = distanceMatches.reduce((sum, match) => {
        const value = parseFloat(match.replace(/[^\d.]/g, ''));
        const unit = match.toLowerCase().includes('km') ? value * 1000 : value;
        return sum + unit;
      }, 0);
    }

    // Calcular distribución de zonas
    const totalZoneMentions = Object.values(zoneCounts).reduce((sum, count) => sum + count, 0);
    const zoneDistribution: Record<string, number> = {};
    const zoneBreakdown: Record<string, { distance: number; percentage: number }> = {};

    detectedZones.forEach(zone => {
      const percentage = totalZoneMentions > 0 ? (zoneCounts[zone] / totalZoneMentions) * 100 : 0;
      zoneDistribution[zone] = percentage;
      zoneBreakdown[zone] = {
        distance: (totalDistance * percentage) / 100,
        percentage
      };
    });

    // Generar sugerencias
    const suggestions: string[] = [];
    
    if (detectedZones.length === 0) {
      suggestions.push("Considera agregar zonas de intensidad (Z1, Z2, Z3, Z4, Z5)");
    }
    
    if (detectedZones.length > 0 && !detectedZones.includes('Z1')) {
      suggestions.push("Agrega un calentamiento en Z1 para comenzar");
    }
    
    if (detectedZones.length > 0 && !detectedZones.includes('Z1') && detectedZones.some(z => ['Z3', 'Z4', 'Z5'].includes(z))) {
      suggestions.push("Incluye vuelta a la calma en Z1 después del trabajo intenso");
    }
    
    if (totalDistance === 0) {
      suggestions.push("Especifica las distancias (ej: 200m, 1.5km)");
    }
    
    if (detectedStrokes.length === 0) {
      suggestions.push("Menciona los estilos de natación (libre, espalda, pecho, mariposa)");
    }

    // Calcular confianza
    let confidence = 0;
    if (detectedZones.length > 0) confidence += 30;
    if (totalDistance > 0) confidence += 25;
    if (detectedStrokes.length > 0) confidence += 20;
    if (detectedIntensities.length > 0) confidence += 15;
    if (content.length > 100) confidence += 10;

    // Estimar duración (aproximación: 1km = 20-30 minutos dependiendo del nivel)
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
      detectedIntensities
    };
  }, [content]);

  useEffect(() => {
    setDetection(analysis);
  }, [analysis]);

  return detection;
}
