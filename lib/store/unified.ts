// =====================================================
// STORE UNIFICADO - ZUSTAND
// =====================================================

import type {
    AICoachAdvice,
    AICoachAnalysis,
    AuthState,
    Competition,
    Session,
    TrainingPhase,
    TrainingReport,
    TrainingZones,
    User,
} from '@/lib/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// =====================================================
// AUTH STORE
// =====================================================
interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      setUser: user =>
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        }),

      setLoading: isLoading => set({ isLoading }),

      setError: error => set({ error }),

      signOut: () =>
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// =====================================================
// SESSIONS STORE
// =====================================================
interface SessionsStore {
  sessions: Session[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addSession: (session: Omit<Session, 'id'>) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  deleteSession: (id: string) => void;
  setSessions: (sessions: Session[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Getters
  getSessionsByDate: (date: string) => Session[];
  getSessionsByRange: (startDate: string, endDate: string) => Session[];
  getTotalDistance: () => number;
  getTotalSessions: () => number;
}

export const useSessionsStore = create<SessionsStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      isLoading: false,
      error: null,

      addSession: sessionData => {
        const newSession: Session = {
          ...sessionData,
          id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        };

        set(state => ({
          sessions: [...state.sessions, newSession],
          error: null,
        }));
      },

      updateSession: (id, updates) => {
        set(state => ({
          sessions: state.sessions.map(session =>
            session.id === id ? { ...session, ...updates } : session
          ),
          error: null,
        }));
      },

      deleteSession: id => {
        set(state => ({
          sessions: state.sessions.filter(session => session.id !== id),
          error: null,
        }));
      },

      setSessions: sessions => set({ sessions, error: null }),
      setLoading: isLoading => set({ isLoading }),
      setError: error => set({ error }),

      getSessionsByDate: date => {
        const { sessions } = get();
        return sessions.filter(session => session.date === date);
      },

      getSessionsByRange: (startDate, endDate) => {
        const { sessions } = get();
        return sessions.filter(
          session => session.date >= startDate && session.date <= endDate
        );
      },

      getTotalDistance: () => {
        const { sessions } = get();
        return sessions.reduce((total, session) => total + session.distance, 0);
      },

      getTotalSessions: () => {
        const { sessions } = get();
        return sessions.length;
      },
    }),
    {
      name: 'sessions-storage',
      partialize: state => ({ sessions: state.sessions }),
    }
  )
);

// =====================================================
// COMPETITIONS STORE
// =====================================================
interface CompetitionsStore {
  competitions: Competition[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setCompetitions: (competitions: Competition[]) => void;
  addCompetition: (competition: Competition) => void;
  updateCompetition: (id: string, updates: Partial<Competition>) => void;
  deleteCompetition: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Getters
  getCompetitionsByDate: (date: string) => Competition[];
  getMainCompetition: () => Competition | null;
  getUpcomingCompetitions: () => Competition[];
}

export const useCompetitionsStore = create<CompetitionsStore>()(
  persist(
    (set, get) => ({
      competitions: [],
      isLoading: false,
      error: null,

      setCompetitions: competitions => set({ competitions, error: null }),

      addCompetition: competition => {
        set(state => ({
          competitions: [...state.competitions, competition],
          error: null,
        }));
      },

      updateCompetition: (id, updates) => {
        set(state => ({
          competitions: state.competitions.map(competition =>
            competition.id === id ? { ...competition, ...updates } : competition
          ),
          error: null,
        }));
      },

      deleteCompetition: id => {
        set(state => ({
          competitions: state.competitions.filter(
            competition => competition.id !== id
          ),
          error: null,
        }));
      },

      setLoading: isLoading => set({ isLoading }),
      setError: error => set({ error }),

      getCompetitionsByDate: date => {
        const { competitions } = get();
        return competitions.filter(competition => competition.date === date);
      },

      getMainCompetition: () => {
        const { competitions } = get();
        return (
          competitions.find(competition => competition.priority === 'high') ||
          null
        );
      },

      getUpcomingCompetitions: () => {
        const { competitions } = get();
        const now = new Date().toISOString().split('T')[0];
        return competitions
          .filter(
            competition =>
              competition.date >= now && competition.status === 'upcoming'
          )
          .sort((a, b) => a.date.localeCompare(b.date));
      },
    }),
    {
      name: 'competitions-storage',
      partialize: state => ({ competitions: state.competitions }),
    }
  )
);

// =====================================================
// TRAINING STORE
// =====================================================
interface TrainingStore {
  phases: TrainingPhase[];
  zones: TrainingZones;
  selectedMethodology: string;
  methodologies: Record<
    string,
    {
      label: string;
      description: string;
      zones: Record<string, string>;
    }
  >;
  isLoading: boolean;
  error: string | null;

  // Actions
  setPhases: (phases: TrainingPhase[]) => void;
  addPhase: (phase: TrainingPhase) => void;
  updatePhase: (id: string, updates: Partial<TrainingPhase>) => void;
  deletePhase: (id: string) => void;
  setZones: (zones: TrainingZones) => void;
  setMethodology: (methodology: string) => void;
  updateZones: (zones: Record<string, string>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Getters
  getCurrentPhase: () => TrainingPhase | null;
  getPhaseById: (id: string) => TrainingPhase | null;
  getPhaseProgress: () => number;
}

const zoneMethodologies = {
  standard: {
    label: 'Sistema Estándar',
    description: 'Zonas tradicionales de entrenamiento de natación',
    zones: {
      Z1: 'Recuperación',
      Z2: 'Aeróbico Base',
      Z3: 'Aeróbico Umbral',
      Z4: 'VO2 Max',
      Z5: 'Neuromuscular',
    },
  },
  'british-swimming': {
    label: 'British Swimming',
    description: 'Metodología oficial de British Swimming',
    zones: {
      Z1: 'A1',
      Z2: 'A2',
      Z3: 'AT',
      Z4: 'VO2',
      Z5: 'Speed',
    },
  },
  urbanchek: {
    label: 'Urbanchek',
    description: 'Sistema de colores de Urbanchek',
    zones: {
      Z1: 'Yellow',
      Z2: 'White',
      Z3: 'Pink/Red',
      Z4: 'Blue',
      Z5: 'Platinum',
    },
  },
  olbrecht: {
    label: 'Olbrecht',
    description: 'Metodología de Jan Olbrecht',
    zones: {
      Z1: 'AEC',
      Z2: 'AEP',
      Z3: 'ANC',
      Z4: 'ANP',
      Z5: 'Speed',
    },
  },
  'research-based': {
    label: 'Research-based Zones',
    description: 'Zonas basadas en investigación científica',
    zones: {
      Z1: 'Up to Lactate Threshold',
      Z2: 'Up to Critical Speed',
      Z3: 'Up to VO2 Max Pace',
      Z4: 'Up to Maximum Speed',
      Z5: 'Maximum Speed',
    },
  },
};

// Default phases data
const defaultPhases: TrainingPhase[] = [
  {
    id: 'base',
    name: 'Base',
    duration: 4,
    description: 'Fase de construcción de la base aeróbica y técnica',
    focus: ['Aeróbico', 'Técnica'],
    intensity: 4,
    volume: 25000,
    color: 'bg-blue-500',
    order: 1,
  },
  {
    id: 'construccion',
    name: 'Construcción',
    duration: 4,
    description: 'Fase de desarrollo de la potencia aeróbica y umbral',
    focus: ['Umbral', 'Aeróbico'],
    intensity: 6,
    volume: 30000,
    color: 'bg-green-500',
    order: 2,
  },
  {
    id: 'especifico',
    name: 'Específico',
    duration: 4,
    description: 'Fase de trabajo específico de velocidad y VO2 Max',
    focus: ['VO2 Max', 'Velocidad'],
    intensity: 8,
    volume: 28000,
    color: 'bg-orange-500',
    order: 3,
  },
  {
    id: 'pico',
    name: 'Pico',
    duration: 2,
    description: 'Fase de puesta a punto y competición',
    focus: ['Velocidad', 'Recuperación'],
    intensity: 9,
    volume: 20000,
    color: 'bg-red-500',
    order: 4,
  },
];

export const useTrainingStore = create<TrainingStore>()(
  persist(
    (set, get) => ({
      phases: defaultPhases,
      zones: {
        z1: { name: 'Recovery', min: 0, max: 60 },
        z2: { name: 'Aerobic Base', min: 60, max: 70 },
        z3: { name: 'Aerobic Threshold', min: 70, max: 80 },
        z4: { name: 'Lactate Threshold', min: 80, max: 90 },
        z5: { name: 'VO2 Max', min: 90, max: 100 },
      },
      selectedMethodology: 'standard',
      methodologies: zoneMethodologies,
      isLoading: false,
      error: null,

      setPhases: phases => set({ phases, error: null }),

      addPhase: phase => {
        set(state => ({
          phases: [...state.phases, phase],
          error: null,
        }));
      },

      updatePhase: (id, updates) => {
        set(state => ({
          phases: state.phases.map(phase =>
            phase.id === id ? { ...phase, ...updates } : phase
          ),
          error: null,
        }));
      },

      deletePhase: id => {
        set(state => ({
          phases: state.phases.filter(phase => phase.id !== id),
          error: null,
        }));
      },

      setZones: zones => set({ zones, error: null }),
      setMethodology: selectedMethodology => {
        const methodology =
          zoneMethodologies[
            selectedMethodology as keyof typeof zoneMethodologies
          ];
        if (methodology) {
          set({ selectedMethodology });
        }
      },
      updateZones: zones => {
        set(state => ({
          zones: {
            ...state.zones,
            z1: { ...state.zones.z1, name: zones.Z1 },
            z2: { ...state.zones.z2, name: zones.Z2 },
            z3: { ...state.zones.z3, name: zones.Z3 },
            z4: { ...state.zones.z4, name: zones.Z4 },
            z5: { ...state.zones.z5, name: zones.Z5 },
          },
          selectedMethodology: 'custom',
          error: null,
        }));
      },
      setLoading: isLoading => set({ isLoading }),
      setError: error => set({ error }),

      getCurrentPhase: () => {
        const { phases } = get();
        const now = new Date().toISOString().split('T')[0];
        return (
          phases
            .filter(phase => phase.startDate && phase.endDate)
            .find(phase => phase.startDate! <= now && phase.endDate! >= now) ||
          null
        );
      },

      getPhaseById: id => {
        const { phases } = get();
        return phases.find(phase => phase.id === id) || null;
      },

      getPhaseProgress: () => {
        const { phases } = get();
        const now = new Date();
        const sortedPhases = phases
          .filter(phase => phase.startDate && phase.endDate)
          .sort(
            (a, b) =>
              new Date(a.startDate!).getTime() -
              new Date(b.startDate!).getTime()
          );

        if (sortedPhases.length === 0) return 0;

        const firstPhase = sortedPhases[0];
        const lastPhase = sortedPhases[sortedPhases.length - 1];

        if (!firstPhase.startDate || !lastPhase.endDate) return 0;

        const cycleStart = new Date(firstPhase.startDate);
        const cycleEnd = new Date(lastPhase.endDate);
        const totalCycleDays = Math.ceil(
          (cycleEnd.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)
        );
        const daysPassed = Math.ceil(
          (now.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)
        );

        return Math.min(Math.max((daysPassed / totalCycleDays) * 100, 0), 100);
      },
    }),
    {
      name: 'training-storage',
      partialize: state => ({
        phases: state.phases,
        zones: state.zones,
        selectedMethodology: state.selectedMethodology,
      }),
    }
  )
);

// =====================================================
// AI COACH STORE
// =====================================================
interface AICoachStore {
  isEnabled: boolean;
  advice: AICoachAdvice[];
  analysis: AICoachAnalysis | null;
  adviceHistory: AICoachAdvice[];
  isLoading: boolean;
  error: string | null;

  // Actions
  toggleAICoach: () => void;
  addAdvice: (advice: Omit<AICoachAdvice, 'id' | 'createdAt'>) => void;
  updateAdvice: (id: string, updates: Partial<AICoachAdvice>) => void;
  deleteAdvice: (id: string) => void;
  setAnalysis: (analysis: AICoachAnalysis | null) => void;
  clearAdvice: () => void;
  markAdviceAsRead: (adviceId: string) => void;
  analyzeTraining: (trainingData: {
    title: string;
    content: string;
    type: string;
    date: Date;
    totalDistance: number;
    detectedZones: string[];
  }) => void;
  getPersonalizedAdvice: (context: string) => AICoachAdvice[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Getters
  getAdviceByType: (type: AICoachAdvice['type']) => AICoachAdvice[];
  getHighPriorityAdvice: () => AICoachAdvice[];
}

export const useAICoachStore = create<AICoachStore>()(
  persist(
    (set, get) => ({
      isEnabled: true,
      advice: [],
      analysis: null,
      adviceHistory: [],
      isLoading: false,
      error: null,

      toggleAICoach: () => {
        set(state => ({ isEnabled: !state.isEnabled }));
      },

      addAdvice: adviceData => {
        const newAdvice: AICoachAdvice = {
          ...adviceData,
          id: Date.now().toString(36) + Math.random().toString(36).substr(2),
          createdAt: new Date(),
        };

        set(state => ({
          advice: [...state.advice, newAdvice],
          error: null,
        }));
      },

      updateAdvice: (id, updates) => {
        set(state => ({
          advice: state.advice.map(advice =>
            advice.id === id ? { ...advice, ...updates } : advice
          ),
          error: null,
        }));
      },

      deleteAdvice: id => {
        set(state => ({
          advice: state.advice.filter(advice => advice.id !== id),
          error: null,
        }));
      },

      setAnalysis: analysis => set({ analysis, error: null }),
      clearAdvice: () => set({ advice: [], analysis: null, error: null }),

      markAdviceAsRead: adviceId => {
        set(state => {
          const adviceToMark = state.advice.find(
            advice => advice.id === adviceId
          );
          if (adviceToMark) {
            return {
              adviceHistory: [...state.adviceHistory, adviceToMark],
              advice: state.advice.filter(advice => advice.id !== adviceId),
            };
          }
          return state;
        });
      },

      analyzeTraining: trainingData => {
        const { isEnabled } = get();
        if (!isEnabled) return;

        // Simulación de análisis de IA (aquí iría la lógica real)
        const analysis: AICoachAnalysis = {
          overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
          strengths: [
            'Excelente consistencia en las series',
            'Buena distribución de zonas de intensidad',
            'Tiempo de recuperación apropiado',
          ],
          improvements: [
            'Considera aumentar la distancia de calentamiento',
            'Podrías incluir más trabajo técnico',
            'El volumen total podría ser mayor',
          ],
          recommendations: generatePersonalizedAdvice(trainingData),
          nextTrainingFocus: 'Trabajo de resistencia aeróbica',
          recoveryStatus: 'good',
        };

        set({ analysis, error: null });
      },

      getPersonalizedAdvice: context => {
        const contextAdvice: AICoachAdvice[] = [];

        if (context.includes('fatiga') || context.includes('cansado')) {
          contextAdvice.push({
            id: `context-${Date.now()}-1`,
            type: 'recovery',
            title: 'Día de recuperación activa',
            message:
              'Si te sientes fatigado, considera hacer una sesión de recuperación activa en lugar de entrenamiento intenso.',
            priority: 'high',
            actionable: true,
            actionText: 'Cambiar a 30min de natación suave Z1',
            createdAt: new Date(),
          });
        }

        if (
          context.includes('competición') ||
          context.includes('competencia')
        ) {
          contextAdvice.push({
            id: `context-${Date.now()}-2`,
            type: 'performance',
            title: 'Preparación para competición',
            message:
              'Para una competición, reduce el volumen y mantén la intensidad en los últimos días antes del evento.',
            priority: 'high',
            actionable: true,
            actionText: 'Planificar taper de 3-5 días',
            createdAt: new Date(),
          });
        }

        return contextAdvice;
      },

      setLoading: isLoading => set({ isLoading }),
      setError: error => set({ error }),

      getAdviceByType: type => {
        const { advice } = get();
        return advice.filter(advice => advice.type === type);
      },

      getHighPriorityAdvice: () => {
        const { advice } = get();
        return advice.filter(advice => advice.priority === 'high');
      },
    }),
    {
      name: 'ai-coach-storage',
      partialize: state => ({
        isEnabled: state.isEnabled,
        advice: state.advice,
        analysis: state.analysis,
        adviceHistory: state.adviceHistory,
      }),
    }
  )
);

// Helper function for generating personalized advice
function generatePersonalizedAdvice(trainingData: {
  title: string;
  content: string;
  type: string;
  date: Date;
  totalDistance: number;
  detectedZones: string[];
}): AICoachAdvice[] {
  const advice: AICoachAdvice[] = [];

  // Análisis de volumen
  if (trainingData.totalDistance < 1500) {
    advice.push({
      id: `advice-${Date.now()}-1`,
      type: 'performance',
      title: 'Aumenta el volumen gradualmente',
      message:
        'Tu entrenamiento actual es de volumen moderado. Para mejorar la resistencia, considera aumentar gradualmente la distancia total.',
      priority: 'medium',
      actionable: true,
      actionText: 'Agregar 200-300m más en la próxima sesión',
      createdAt: new Date(),
    });
  }

  // Análisis de zonas
  if (
    trainingData.detectedZones &&
    !trainingData.detectedZones.includes('Z4')
  ) {
    advice.push({
      id: `advice-${Date.now()}-2`,
      type: 'performance',
      title: 'Incluye trabajo de alta intensidad',
      message:
        'No se detectó trabajo en Z4. Para mejorar la velocidad, incluye series cortas de alta intensidad.',
      priority: 'high',
      actionable: true,
      actionText: 'Agregar 4x50m Z4 con 2min descanso',
      createdAt: new Date(),
    });
  }

  // Análisis de recuperación
  advice.push({
    id: `advice-${Date.now()}-3`,
    type: 'recovery',
    title: 'Hidratación post-entrenamiento',
    message:
      'Recuerda hidratarte adecuadamente después del entrenamiento. Tu cuerpo necesita reponer los fluidos perdidos.',
    priority: 'medium',
    actionable: true,
    actionText: 'Beber 500ml de agua en la próxima hora',
    createdAt: new Date(),
  });

  return advice;
}

// =====================================================
// REPORTS STORE
// =====================================================
interface ReportsStore {
  reports: TrainingReport[];
  selectedReport: TrainingReport | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  addReport: (report: Omit<TrainingReport, 'id' | 'generatedAt'>) => void;
  updateReport: (id: string, updates: Partial<TrainingReport>) => void;
  deleteReport: (id: string) => void;
  selectReport: (id: string) => void;
  clearReports: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Getters
  getReportsByType: (type: TrainingReport['type']) => TrainingReport[];
  getRecentReports: (limit?: number) => TrainingReport[];
}

export const useReportsStore = create<ReportsStore>()(
  persist(
    (set, get) => ({
      reports: [],
      selectedReport: null,
      isLoading: false,
      error: null,

      addReport: reportData => {
        const newReport: TrainingReport = {
          ...reportData,
          id: Date.now().toString(36) + Math.random().toString(36).substr(2),
          generatedAt: new Date(),
        };

        set(state => ({
          reports: [...state.reports, newReport],
          error: null,
        }));
      },

      updateReport: (id, updates) => {
        set(state => ({
          reports: state.reports.map(report =>
            report.id === id ? { ...report, ...updates } : report
          ),
          error: null,
        }));
      },

      deleteReport: id => {
        set(state => ({
          reports: state.reports.filter(report => report.id !== id),
          selectedReport:
            state.selectedReport?.id === id ? null : state.selectedReport,
          error: null,
        }));
      },

      selectReport: id => {
        const { reports } = get();
        const report = reports.find(report => report.id === id);
        set({ selectedReport: report || null });
      },

      clearReports: () =>
        set({
          reports: [],
          selectedReport: null,
          error: null,
        }),

      setLoading: isLoading => set({ isLoading }),
      setError: error => set({ error }),

      getReportsByType: type => {
        const { reports } = get();
        return reports.filter(report => report.type === type);
      },

      getRecentReports: (limit = 5) => {
        const { reports } = get();
        return reports
          .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime())
          .slice(0, limit);
      },
    }),
    {
      name: 'reports-storage',
      partialize: state => ({
        reports: state.reports,
        selectedReport: state.selectedReport,
      }),
    }
  )
);

// =====================================================
// UI STORE
// =====================================================
interface UIStore {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
  }>;

  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setSidebarOpen: (open: boolean) => void;
  addNotification: (
    notification: Omit<UIStore['notifications'][0], 'id'>
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    set => ({
      theme: 'system',
      sidebarOpen: true,
      notifications: [],

      setTheme: theme => set({ theme }),
      setSidebarOpen: sidebarOpen => set({ sidebarOpen }),

      addNotification: notification => {
        const id =
          Date.now().toString(36) + Math.random().toString(36).substr(2);
        set(state => ({
          notifications: [...state.notifications, { ...notification, id }],
        }));
      },

      removeNotification: id => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      },

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'ui-storage',
      partialize: state => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
