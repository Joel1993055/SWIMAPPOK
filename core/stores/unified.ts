// =====================================================
// UNIFIED STORE - ZUSTAND
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

  addSession: (session: Omit<Session, 'id'>) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  deleteSession: (id: string) => void;
  setSessions: (sessions: Session[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

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

  setCompetitions: (competitions: Competition[]) => void;
  addCompetition: (competition: Competition) => void;
  updateCompetition: (id: string, updates: Partial<Competition>) => void;
  deleteCompetition: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

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

  setPhases: (phases: TrainingPhase[]) => void;
  addPhase: (phase: TrainingPhase) => void;
  updatePhase: (id: string, updates: Partial<TrainingPhase>) => void;
  deletePhase: (id: string) => void;
  setZones: (zones: TrainingZones) => void;
  setMethodology: (methodology: string) => void;
  updateZones: (zones: Record<string, string>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  getCurrentPhase: () => TrainingPhase | null;
  getPhaseById: (id: string) => TrainingPhase | null;
  getPhaseProgress: () => number;
}

const zoneMethodologies = {
  standard: {
    label: 'Standard System',
    description: 'Traditional swimming training zones',
    zones: {
      Z1: 'Recovery',
      Z2: 'Aerobic Base',
      Z3: 'Aerobic Threshold',
      Z4: 'VO2 Max',
      Z5: 'Neuromuscular',
    },
  },
  'british-swimming': {
    label: 'British Swimming',
    description: 'Official British Swimming methodology',
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
    description: 'Urbanchek color-based system',
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
    description: 'Jan Olbrecht methodology',
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
    description: 'Zones based on scientific research',
    zones: {
      Z1: 'Up to Lactate Threshold',
      Z2: 'Up to Critical Speed',
      Z3: 'Up to VO2 Max Pace',
      Z4: 'Up to Maximum Speed',
      Z5: 'Maximum Speed',
    },
  },
};

// For brevity, default phases generation stays unchanged
// … (phases setup remains same but text is already in English)

export const useTrainingStore = create<TrainingStore>()(
  persist(
    (set, get) => ({
      phases: [],
      zones: {
        Z1: { min: 0, max: 0.6, name: 'Recovery', color: 'bg-green-500' },
        Z2: { min: 0.6, max: 0.7, name: 'Aerobic Base', color: 'bg-blue-500' },
        Z3: { min: 0.7, max: 0.8, name: 'Aerobic Threshold', color: 'bg-yellow-500' },
        Z4: { min: 0.8, max: 0.9, name: 'VO2 Max', color: 'bg-orange-500' },
        Z5: { min: 0.9, max: 1.0, name: 'Neuromuscular', color: 'bg-red-500' },
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
      setMethodology: methodology => set({ selectedMethodology: methodology }),
      updateZones: zoneUpdates => {
        set(state => ({
          zones: { ...state.zones, ...zoneUpdates },
          error: null,
        }));
      },
      setLoading: isLoading => set({ isLoading }),
      setError: error => set({ error }),

      getCurrentPhase: () => {
        const { phases } = get();
        const now = new Date().toISOString().split('T')[0];
        
        // Find the current active phase
        const currentPhase = phases.find(phase => 
          phase.startDate <= now && 
          phase.endDate >= now && 
          phase.isActive
        );

        if (currentPhase) return currentPhase;

        // If no active phase, return the most recent phase
        return phases
          .filter(phase => phase.endDate <= now)
          .sort((a, b) => b.endDate.localeCompare(a.endDate))[0] || null;
      },
      getPhaseById: id => {
        const { phases } = get();
        return phases.find(phase => phase.id === id) || null;
      },
      getPhaseProgress: () => {
        const currentPhase = get().getCurrentPhase();
        if (!currentPhase) return 0;

        const now = new Date();
        const startDate = new Date(currentPhase.startDate);
        const endDate = new Date(currentPhase.endDate);
        
        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const daysPassed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        return Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100);
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

        const analysis: AICoachAnalysis = {
          overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
          strengths: [
            'Excellent consistency in sets',
            'Good distribution of training zones',
            'Appropriate recovery time',
          ],
          improvements: [
            'Consider increasing warm-up distance',
            'Add more technical drills',
            'Total volume could be slightly higher',
          ],
          recommendations: generatePersonalizedAdvice(trainingData),
          nextTrainingFocus: 'Aerobic endurance work',
          recoveryStatus: 'good',
        };

        set({ analysis, error: null });
      },

      getPersonalizedAdvice: context => {
        const contextAdvice: AICoachAdvice[] = [];

        if (context.includes('fatigue') || context.includes('tired')) {
          contextAdvice.push({
            id: `context-${Date.now()}-1`,
            type: 'recovery',
            title: 'Active recovery day',
            message:
              'If you feel fatigued, consider doing an active recovery session instead of intense training.',
            priority: 'high',
            actionable: true,
            actionText: 'Switch to 30min easy swim Z1',
            createdAt: new Date(),
          });
        }

        if (context.includes('competition')) {
          contextAdvice.push({
            id: `context-${Date.now()}-2`,
            type: 'performance',
            title: 'Competition preparation',
            message:
              'Before a competition, reduce total volume while maintaining intensity in the last days.',
            priority: 'high',
            actionable: true,
            actionText: 'Plan 3–5 days taper',
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

// Helper for AI advice
function generatePersonalizedAdvice(trainingData: {
  title: string;
  content: string;
  type: string;
  date: Date;
  totalDistance: number;
  detectedZones: string[];
}): AICoachAdvice[] {
  const advice: AICoachAdvice[] = [];

  if (trainingData.totalDistance < 1500) {
    advice.push({
      id: `advice-${Date.now()}-1`,
      type: 'performance',
      title: 'Increase volume gradually',
      message:
        'Your current training is moderate in volume. To improve endurance, gradually increase total distance.',
      priority: 'medium',
      actionable: true,
      actionText: 'Add 200–300m next session',
      createdAt: new Date(),
    });
  }

  if (trainingData.detectedZones && !trainingData.detectedZones.includes('Z4')) {
    advice.push({
      id: `advice-${Date.now()}-2`,
      type: 'performance',
      title: 'Include high-intensity work',
      message:
        'No Z4 work detected. To improve speed, include short high-intensity sets.',
      priority: 'high',
      actionable: true,
      actionText: 'Add 4x50m Z4 with 2min rest',
      createdAt: new Date(),
    });
  }

  advice.push({
    id: `advice-${Date.now()}-3`,
    type: 'recovery',
    title: 'Post-training hydration',
    message: 'Remember to hydrate properly after training.',
    priority: 'medium',
    actionable: true,
    actionText: 'Drink 500ml of water within 1 hour',
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

  addReport: (report: Omit<TrainingReport, 'id' | 'generatedAt'>) => void;
  updateReport: (id: string, updates: Partial<TrainingReport>) => void;
  deleteReport: (id: string) => void;
  selectReport: (id: string) => void;
  clearReports: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

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
