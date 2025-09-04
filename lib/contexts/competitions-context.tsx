"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Tipos de datos
export interface Competition {
  id: string;
  name: string;
  date: string;
  location: string;
  type: "nacional" | "regional" | "local" | "internacional";
  events: string[];
  objectives: string;
  results?: {
    event: string;
    time: string;
    position: number;
    personalBest: boolean;
  }[];
  status: "upcoming" | "completed" | "cancelled";
  priority: "high" | "medium" | "low";
}

interface CompetitionsContextType {
  competitions: Competition[];
  setCompetitions: (competitions: Competition[]) => void;
  addCompetition: (competition: Competition) => void;
  updateCompetition: (id: string, competition: Partial<Competition>) => void;
  deleteCompetition: (id: string) => void;
  getCompetitionsByDate: (date: string) => Competition[];
  getMainCompetition: () => Competition | null;
}

const CompetitionsContext = createContext<CompetitionsContextType | undefined>(undefined);

// Datos de ejemplo
const defaultCompetitions: Competition[] = [
  {
    id: "comp-1",
    name: "Campeonato Nacional 2025",
    date: "2025-06-15",
    location: "Madrid, España",
    type: "nacional",
    events: ["100m Libre", "200m Libre", "4x100m Libre"],
    objectives: "Objetivo principal del año. Buscar clasificación para el Campeonato de Europa",
    status: "upcoming",
    priority: "high"
  },
  {
    id: "comp-2",
    name: "Copa Regional Primavera",
    date: "2025-04-20",
    location: "Barcelona, España",
    type: "regional",
    events: ["50m Libre", "100m Libre"],
    objectives: "Test de forma antes del Nacional. Objetivo: mejorar tiempos personales",
    status: "upcoming",
    priority: "medium"
  },
  {
    id: "comp-3",
    name: "Trofeo Ciudad de Valencia",
    date: "2025-03-10",
    location: "Valencia, España",
    type: "local",
    events: ["100m Libre", "200m Libre"],
    objectives: "Primera competición del año. Evaluar forma actual",
    results: [
      {
        event: "100m Libre",
        time: "52.45",
        position: 3,
        personalBest: true
      },
      {
        event: "200m Libre",
        time: "1:58.32",
        position: 5,
        personalBest: false
      }
    ],
    status: "completed",
    priority: "low"
  }
];

export function CompetitionsProvider({ children }: { children: React.ReactNode }) {
  const [competitions, setCompetitionsState] = useState<Competition[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('competitions');
      return saved ? JSON.parse(saved) : defaultCompetitions;
    }
    return defaultCompetitions;
  });

  // Guardar en localStorage cuando cambien las competiciones
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('competitions', JSON.stringify(competitions));
    }
  }, [competitions]);

  const setCompetitions = (newCompetitions: Competition[]) => {
    setCompetitionsState(newCompetitions);
  };

  const addCompetition = (competition: Competition) => {
    setCompetitionsState(prev => [...prev, competition]);
  };

  const updateCompetition = (id: string, updatedCompetition: Partial<Competition>) => {
    setCompetitionsState(prev => prev.map(competition => 
      competition.id === id ? { ...competition, ...updatedCompetition } : competition
    ));
  };

  const deleteCompetition = (id: string) => {
    setCompetitionsState(prev => prev.filter(competition => competition.id !== id));
  };

  // Función para obtener competiciones por fecha
  const getCompetitionsByDate = (date: string) => {
    return competitions.filter(competition => competition.date === date);
  };

  // Función para obtener la competición principal (prioridad alta)
  const getMainCompetition = () => {
    return competitions.find(competition => competition.priority === "high") || null;
  };

  const value: CompetitionsContextType = {
    competitions,
    setCompetitions,
    addCompetition,
    updateCompetition,
    deleteCompetition,
    getCompetitionsByDate,
    getMainCompetition
  };

  return (
    <CompetitionsContext.Provider value={value}>
      {children}
    </CompetitionsContext.Provider>
  );
}

export function useCompetitions() {
  const context = useContext(CompetitionsContext);
  if (context === undefined) {
    throw new Error('useCompetitions must be used within a CompetitionsProvider');
  }
  return context;
}
