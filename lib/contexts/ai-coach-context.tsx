"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

interface AICoachAdvice {
  id: string;
  type: 'performance' | 'technique' | 'recovery' | 'nutrition' | 'motivation';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  actionText?: string;
  createdAt: Date;
}

interface AICoachAnalysis {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  recommendations: AICoachAdvice[];
  nextTrainingFocus: string;
  recoveryStatus: 'excellent' | 'good' | 'needs_attention' | 'overreaching';
}

interface TrainingData {
  title: string;
  content: string;
  type: string;
  date: Date;
  totalDistance: number;
  detectedZones: string[];
}

interface AICoachContextType {
  isEnabled: boolean;
  currentAnalysis: AICoachAnalysis | null;
  adviceHistory: AICoachAdvice[];
  toggleAICoach: () => void;
  analyzeTraining: (trainingData: TrainingData) => void;
  markAdviceAsRead: (adviceId: string) => void;
  getPersonalizedAdvice: (context: string) => AICoachAdvice[];
}

const AICoachContext = createContext<AICoachContextType | undefined>(undefined);

export function AICoachProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aiCoachEnabled') === 'true';
    }
    return true; // Por defecto habilitado
  });

  const [currentAnalysis, setCurrentAnalysis] = useState<AICoachAnalysis | null>(null);
  const [adviceHistory, setAdviceHistory] = useState<AICoachAdvice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aiCoachEnabled', isEnabled.toString());
    }
  }, [isEnabled]);

  const toggleAICoach = () => {
    setIsEnabled(!isEnabled);
  };

  const analyzeTraining = (trainingData: TrainingData) => {
    if (!isEnabled) return;

    // Simulación de análisis de IA (aquí iría la lógica real)
    const analysis: AICoachAnalysis = {
      overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
      strengths: [
        "Excelente consistencia en las series",
        "Buena distribución de zonas de intensidad",
        "Tiempo de recuperación apropiado"
      ],
      improvements: [
        "Considera aumentar la distancia de calentamiento",
        "Podrías incluir más trabajo técnico",
        "El volumen total podría ser mayor"
      ],
      recommendations: generatePersonalizedAdvice(trainingData),
      nextTrainingFocus: "Trabajo de resistencia aeróbica",
      recoveryStatus: 'good'
    };

    setCurrentAnalysis(analysis);
  };

  const generatePersonalizedAdvice = (trainingData: TrainingData): AICoachAdvice[] => {
    const advice: AICoachAdvice[] = [];

    // Análisis de volumen
    if (trainingData.totalDistance < 1500) {
      advice.push({
        id: `advice-${Date.now()}-1`,
        type: 'performance',
        title: "Aumenta el volumen gradualmente",
        message: "Tu entrenamiento actual es de volumen moderado. Para mejorar la resistencia, considera aumentar gradualmente la distancia total.",
        priority: 'medium',
        actionable: true,
        actionText: "Agregar 200-300m más en la próxima sesión",
        createdAt: new Date()
      });
    }

    // Análisis de zonas
    if (trainingData.detectedZones && !trainingData.detectedZones.includes('Z4')) {
      advice.push({
        id: `advice-${Date.now()}-2`,
        type: 'performance',
        title: "Incluye trabajo de alta intensidad",
        message: "No se detectó trabajo en Z4. Para mejorar la velocidad, incluye series cortas de alta intensidad.",
        priority: 'high',
        actionable: true,
        actionText: "Agregar 4x50m Z4 con 2min descanso",
        createdAt: new Date()
      });
    }

    // Análisis de recuperación
    advice.push({
      id: `advice-${Date.now()}-3`,
      type: 'recovery',
      title: "Hidratación post-entrenamiento",
      message: "Recuerda hidratarte adecuadamente después del entrenamiento. Tu cuerpo necesita reponer los fluidos perdidos.",
      priority: 'medium',
      actionable: true,
      actionText: "Beber 500ml de agua en la próxima hora",
      createdAt: new Date()
    });

    return advice;
  };

  const markAdviceAsRead = (adviceId: string) => {
    setAdviceHistory(prev => [
      ...prev,
      ...(currentAnalysis?.recommendations.filter(advice => advice.id === adviceId) || [])
    ]);
  };

  const getPersonalizedAdvice = (context: string): AICoachAdvice[] => {
    // Generar consejos basados en el contexto
    const contextAdvice: AICoachAdvice[] = [];

    if (context.includes('fatiga') || context.includes('cansado')) {
      contextAdvice.push({
        id: `context-${Date.now()}-1`,
        type: 'recovery',
        title: "Día de recuperación activa",
        message: "Si te sientes fatigado, considera hacer una sesión de recuperación activa en lugar de entrenamiento intenso.",
        priority: 'high',
        actionable: true,
        actionText: "Cambiar a 30min de natación suave Z1",
        createdAt: new Date()
      });
    }

    if (context.includes('competición') || context.includes('competencia')) {
      contextAdvice.push({
        id: `context-${Date.now()}-2`,
        type: 'performance',
        title: "Preparación para competición",
        message: "Para una competición, reduce el volumen y mantén la intensidad en los últimos días antes del evento.",
        priority: 'high',
        actionable: true,
        actionText: "Planificar taper de 3-5 días",
        createdAt: new Date()
      });
    }

    return contextAdvice;
  };

  return (
    <AICoachContext.Provider 
      value={{ 
        isEnabled, 
        currentAnalysis, 
        adviceHistory, 
        toggleAICoach, 
        analyzeTraining, 
        markAdviceAsRead,
        getPersonalizedAdvice
      }}
    >
      {children}
    </AICoachContext.Provider>
  );
}

export function useAICoach() {
  const context = useContext(AICoachContext);
  if (context === undefined) {
    throw new Error('useAICoach must be used within an AICoachProvider');
  }
  return context;
}
