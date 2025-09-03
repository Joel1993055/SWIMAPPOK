"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

interface ChartData {
  id: string;
  type: 'volume' | 'sessions' | 'progress' | 'zones' | 'performance';
  title: string;
  description: string;
  data: unknown;
  config: unknown;
  selected: boolean;
}

interface TrainingReport {
  id: string;
  title: string;
  date: string;
  type: string;
  location: string;
  coach: string;
  content: string;
  duration: number;
  distance: number;
  rpe: number;
  selected: boolean;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  charts: string[];
  trainings: boolean;
  dateRange: {
    start: Date;
    end: Date;
  };
}

interface ReportsContextType {
  selectedCharts: ChartData[];
  selectedTrainings: TrainingReport[];
  reportTemplates: ReportTemplate[];
  currentTemplate: ReportTemplate | null;
  addChart: (chart: ChartData) => void;
  removeChart: (chartId: string) => void;
  addTraining: (training: TrainingReport) => void;
  removeTraining: (trainingId: string) => void;
  createReport: (template: ReportTemplate) => void;
  exportToPDF: () => void;
  printReport: () => void;
  clearSelection: () => void;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

// Datos de ejemplo para charts
const sampleCharts: ChartData[] = [
  {
    id: 'volume-chart',
    type: 'volume',
    title: 'Gráfico Volumen Total',
    description: 'Evolución del volumen de entrenamiento por período',
    data: null,
    config: null,
    selected: false
  },
  {
    id: 'sessions-chart',
    type: 'sessions',
    title: 'Sesiones de Entrenamiento',
    description: 'Distribución de sesiones por tipo y duración',
    data: null,
    config: null,
    selected: false
  },
  {
    id: 'progress-chart',
    type: 'progress',
    title: 'Progreso de Rendimiento',
    description: 'Evolución de tiempos y marcas personales',
    data: null,
    config: null,
    selected: false
  },
  {
    id: 'zones-chart',
    type: 'zones',
    title: 'Distribución de Zonas',
    description: 'Tiempo invertido en cada zona de intensidad',
    data: null,
    config: null,
    selected: false
  },
  {
    id: 'performance-chart',
    type: 'performance',
    title: 'Análisis de Rendimiento',
    description: 'Métricas de rendimiento y comparativas',
    data: null,
    config: null,
    selected: false
  }
];

// Datos de ejemplo para entrenamientos
const sampleTrainings: TrainingReport[] = [
  {
    id: 'training-1',
    title: 'Entrenamiento de Resistencia',
    date: '2025-01-15',
    type: 'Aeróbico',
    location: 'Piscina Municipal',
    coach: 'María García',
    content: 'Calentamiento: 200m libre Z1\nSerie principal: 8x100m libre Z3 con 20s descanso\nVuelta a la calma: 200m espalda Z1',
    duration: 45,
    distance: 2000,
    rpe: 6,
    selected: false
  },
  {
    id: 'training-2',
    title: 'Trabajo de Técnica',
    date: '2025-01-17',
    type: 'Técnica',
    location: 'Piscina Municipal',
    coach: 'Carlos López',
    content: 'Calentamiento: 300m libre Z1\nEjercicios técnicos: 4x50m espalda con tabla\nSerie principal: 6x100m espalda Z2\nVuelta a la calma: 200m libre Z1',
    duration: 30,
    distance: 1500,
    rpe: 4,
    selected: false
  },
  {
    id: 'training-3',
    title: 'Entrenamiento de Velocidad',
    date: '2025-01-20',
    type: 'Velocidad',
    location: 'Piscina Municipal',
    coach: 'Ana Martínez',
    content: 'Calentamiento: 400m libre Z1\nSerie principal: 10x50m libre Z4 con 1min descanso\nVuelta a la calma: 300m libre Z1',
    duration: 35,
    distance: 1200,
    rpe: 8,
    selected: false
  }
];

// Plantillas de reportes predefinidas
const sampleTemplates: ReportTemplate[] = [
  {
    id: 'weekly-report',
    name: 'Reporte Semanal',
    description: 'Resumen semanal de entrenamientos y progreso',
    charts: ['volume-chart', 'sessions-chart'],
    trainings: true,
    dateRange: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date()
    }
  },
  {
    id: 'monthly-report',
    name: 'Reporte Mensual',
    description: 'Análisis mensual completo de rendimiento',
    charts: ['volume-chart', 'sessions-chart', 'progress-chart', 'zones-chart'],
    trainings: true,
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    }
  },
  {
    id: 'performance-report',
    name: 'Reporte de Rendimiento',
    description: 'Análisis detallado de rendimiento y métricas',
    charts: ['progress-chart', 'performance-chart', 'zones-chart'],
    trainings: false,
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    }
  }
];

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [selectedCharts, setSelectedCharts] = useState<ChartData[]>([]);
  const [selectedTrainings, setSelectedTrainings] = useState<TrainingReport[]>([]);
  const [reportTemplates] = useState<ReportTemplate[]>(sampleTemplates);
  const [currentTemplate, setCurrentTemplate] = useState<ReportTemplate | null>(null);

  const addChart = (chart: ChartData) => {
    setSelectedCharts(prev => [...prev, { ...chart, selected: true }]);
  };

  const removeChart = (chartId: string) => {
    setSelectedCharts(prev => prev.filter(chart => chart.id !== chartId));
  };

  const addTraining = (training: TrainingReport) => {
    setSelectedTrainings(prev => [...prev, { ...training, selected: true }]);
  };

  const removeTraining = (trainingId: string) => {
    setSelectedTrainings(prev => prev.filter(training => training.id !== trainingId));
  };

  const createReport = (template: ReportTemplate) => {
    setCurrentTemplate(template);
    
    // Aplicar plantilla
    const templateCharts = sampleCharts.filter(chart => 
      template.charts.includes(chart.id)
    );
    setSelectedCharts(templateCharts.map(chart => ({ ...chart, selected: true })));
    
    if (template.trainings) {
      setSelectedTrainings(sampleTrainings.map(training => ({ ...training, selected: true })));
    } else {
      setSelectedTrainings([]);
    }
  };

  const exportToPDF = () => {
    // Aquí iría la lógica para exportar a PDF
    console.log('Exportando a PDF:', {
      template: currentTemplate,
      charts: selectedCharts,
      trainings: selectedTrainings
    });
    alert('Funcionalidad de exportación a PDF en desarrollo');
  };

  const printReport = () => {
    // Aquí iría la lógica para imprimir
    console.log('Imprimiendo reporte:', {
      template: currentTemplate,
      charts: selectedCharts,
      trainings: selectedTrainings
    });
    window.print();
  };

  const clearSelection = () => {
    setSelectedCharts([]);
    setSelectedTrainings([]);
    setCurrentTemplate(null);
  };

  return (
    <ReportsContext.Provider 
      value={{ 
        selectedCharts, 
        selectedTrainings, 
        reportTemplates, 
        currentTemplate,
        addChart, 
        removeChart, 
        addTraining, 
        removeTraining,
        createReport,
        exportToPDF,
        printReport,
        clearSelection
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
}

export { sampleCharts, sampleTrainings };
