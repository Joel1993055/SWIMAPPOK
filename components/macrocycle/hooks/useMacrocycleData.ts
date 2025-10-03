import { macrocycleData } from '@/data/macrocycle';
import { useMemo } from 'react';

export interface MacrocycleFilters {
  period: 'all' | 'BASIC' | 'SPECIFIC' | 'COMPETITION';
  type: 'all' | 'tests' | 'competitions' | 'registrations' | 'holidays';
  search: string;
}

export function useMacrocycleData() {
  const data = useMemo(() => macrocycleData, []);

  const isLoading = false; // En una app real, esto vendría de una API

  const filteredData = useMemo(() => {
    return data; // Los filtros se aplicarán en los componentes hijos
  }, [data]);

  return {
    data: filteredData,
    isLoading,
    totalWeeks: data.length,
    periods: ['BASIC', 'SPECIFIC', 'COMPETITION'] as const,
  };
}

export function useMacrocycleView() {
  const currentView = 'timeline'; // En una app real, esto vendría del localStorage
  
  const setView = (view: 'timeline' | 'grid') => {
    // En una app real, esto guardaría en localStorage
    console.log('Setting view to:', view);
  };

  return {
    currentView,
    setView,
  };
}
