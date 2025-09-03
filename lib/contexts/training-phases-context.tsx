"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Tipos de datos
export interface TrainingPhase {
  id: string;
  name: string;
  duration: number; // en semanas
  description: string;
  focus: string[];
  intensity: number; // 1-10
  volume: number; // metros por semana
  color: string;
  startDate?: string; // Fecha de inicio (opcional)
  endDate?: string; // Fecha de fin (calculada automáticamente)
  order: number; // Orden de las fases
}

interface TrainingPhasesContextType {
  phases: TrainingPhase[];
  setPhases: (phases: TrainingPhase[]) => void;
  addPhase: (phase: TrainingPhase) => void;
  updatePhase: (id: string, phase: Partial<TrainingPhase>) => void;
  deletePhase: (id: string) => void;
  getCurrentPhase: () => TrainingPhase | null;
  getPhaseProgress: () => number;
}

const TrainingPhasesContext = createContext<TrainingPhasesContextType | undefined>(undefined);

// Datos de ejemplo
const defaultPhases: TrainingPhase[] = [
  {
    id: "base",
    name: "Base",
    duration: 8,
    description: "Desarrollo de la resistencia aeróbica base",
    focus: ["Aeróbico", "Técnica", "Fuerza"],
    intensity: 4,
    volume: 25000,
    color: "bg-blue-500",
    startDate: "2025-01-06", // Lunes de la primera semana
    order: 1
  },
  {
    id: "construccion",
    name: "Construcción",
    duration: 6,
    description: "Aumento gradual de la intensidad y volumen",
    focus: ["Aeróbico", "Umbral", "Técnica"],
    intensity: 6,
    volume: 30000,
    color: "bg-green-500",
    order: 2
  },
  {
    id: "especifico",
    name: "Específico",
    duration: 4,
    description: "Entrenamiento específico para la competición",
    focus: ["Umbral", "VO2 Max", "Velocidad"],
    intensity: 8,
    volume: 28000,
    color: "bg-orange-500",
    order: 3
  },
  {
    id: "pico",
    name: "Pico",
    duration: 2,
    description: "Máxima intensidad y tapering",
    focus: ["Velocidad", "VO2 Max", "Recuperación"],
    intensity: 9,
    volume: 20000,
    color: "bg-red-500",
    order: 4
  }
];

export function TrainingPhasesProvider({ children }: { children: React.ReactNode }) {
  const [phases, setPhasesState] = useState<TrainingPhase[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('training-phases');
      return saved ? JSON.parse(saved) : defaultPhases;
    }
    return defaultPhases;
  });

  // Función para calcular fechas de las fases
  const calculatePhaseDates = (phases: TrainingPhase[]) => {
    const sortedPhases = [...phases].sort((a, b) => a.order - b.order);
    const calculatedPhases: TrainingPhase[] = [];

    for (let i = 0; i < sortedPhases.length; i++) {
      const phase = { ...sortedPhases[i] };
      
      if (i === 0) {
        // La primera fase mantiene su fecha de inicio
        if (phase.startDate) {
          const startDate = new Date(phase.startDate);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + (phase.duration * 7) - 1); // -1 porque el último día es el domingo
          phase.endDate = endDate.toISOString().split('T')[0];
        }
      } else {
        // Las fases posteriores empiezan donde terminó la anterior
        const previousPhase = calculatedPhases[i - 1];
        if (previousPhase.endDate) {
          const startDate = new Date(previousPhase.endDate);
          startDate.setDate(startDate.getDate() + 1); // Empieza el lunes siguiente
          phase.startDate = startDate.toISOString().split('T')[0];
          
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + (phase.duration * 7) - 1);
          phase.endDate = endDate.toISOString().split('T')[0];
        }
      }
      
      calculatedPhases.push(phase);
    }
    
    return calculatedPhases;
  };

  // Calcular las fases con fechas
  const phasesWithDates = calculatePhaseDates(phases);

  // Guardar en localStorage cuando cambien las fases
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('training-phases', JSON.stringify(phases));
    }
  }, [phases]);

  const setPhases = (newPhases: TrainingPhase[]) => {
    setPhasesState(newPhases);
  };

  const addPhase = (phase: TrainingPhase) => {
    setPhasesState(prev => [...prev, phase]);
  };

  const updatePhase = (id: string, updatedPhase: Partial<TrainingPhase>) => {
    setPhasesState(prev => prev.map(phase => 
      phase.id === id ? { ...phase, ...updatedPhase } : phase
    ));
  };

  const deletePhase = (id: string) => {
    setPhasesState(prev => prev.filter(phase => phase.id !== id));
  };

  // Función para obtener la fase actual
  const getCurrentPhase = () => {
    const now = new Date();
    const currentPhase = phasesWithDates.find(phase => {
      if (!phase.startDate || !phase.endDate) return false;
      const startDate = new Date(phase.startDate);
      const endDate = new Date(phase.endDate);
      return now >= startDate && now <= endDate;
    });
    return currentPhase || null;
  };

  // Función para obtener el progreso del ciclo
  const getPhaseProgress = () => {
    const now = new Date();
    const sortedPhases = phasesWithDates.sort((a, b) => a.order - b.order);
    
    if (sortedPhases.length === 0) return 0;
    
    const firstPhase = sortedPhases[0];
    const lastPhase = sortedPhases[sortedPhases.length - 1];
    
    if (!firstPhase.startDate || !lastPhase.endDate) return 0;
    
    const cycleStart = new Date(firstPhase.startDate);
    const cycleEnd = new Date(lastPhase.endDate);
    const totalCycleDays = Math.ceil((cycleEnd.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((now.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.min(Math.max((daysPassed / totalCycleDays) * 100, 0), 100);
  };

  const value: TrainingPhasesContextType = {
    phases: phasesWithDates,
    setPhases,
    addPhase,
    updatePhase,
    deletePhase,
    getCurrentPhase,
    getPhaseProgress
  };

  return (
    <TrainingPhasesContext.Provider value={value}>
      {children}
    </TrainingPhasesContext.Provider>
  );
}

export function useTrainingPhases() {
  const context = useContext(TrainingPhasesContext);
  if (context === undefined) {
    throw new Error('useTrainingPhases must be used within a TrainingPhasesProvider');
  }
  return context;
}
