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
    User
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
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        error: null 
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      signOut: () => set({ 
        user: null, 
        isAuthenticated: false, 
        error: null 
      }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
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
  addSession: (session: Omit<Session, "id">) => void;
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

      addSession: (sessionData) => {
        const newSession: Session = {
          ...sessionData,
          id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        };
        
        set((state) => ({
          sessions: [...state.sessions, newSession],
          error: null,
        }));
      },

      updateSession: (id, updates) => {
        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === id ? { ...session, ...updates } : session
          ),
          error: null,
        }));
      },

      deleteSession: (id) => {
        set((state) => ({
          sessions: state.sessions.filter(session => session.id !== id),
          error: null,
        }));
      },

      setSessions: (sessions) => set({ sessions, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      getSessionsByDate: (date) => {
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
      partialize: (state) => ({ sessions: state.sessions }),
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

      setCompetitions: (competitions) => set({ competitions, error: null }),
      
      addCompetition: (competition) => {
        set((state) => ({
          competitions: [...state.competitions, competition],
          error: null,
        }));
      },

      updateCompetition: (id, updates) => {
        set((state) => ({
          competitions: state.competitions.map(competition =>
            competition.id === id 
              ? { ...competition, ...updates } 
              : competition
          ),
          error: null,
        }));
      },

      deleteCompetition: (id) => {
        set((state) => ({
          competitions: state.competitions.filter(competition => competition.id !== id),
          error: null,
        }));
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      getCompetitionsByDate: (date) => {
        const { competitions } = get();
        return competitions.filter(competition => competition.date === date);
      },

      getMainCompetition: () => {
        const { competitions } = get();
        return competitions.find(competition => competition.priority === "high") || null;
      },

      getUpcomingCompetitions: () => {
        const { competitions } = get();
        const now = new Date().toISOString().split('T')[0];
        return competitions
          .filter(competition => competition.date >= now && competition.status === "upcoming")
          .sort((a, b) => a.date.localeCompare(b.date));
      },
    }),
    {
      name: 'competitions-storage',
      partialize: (state) => ({ competitions: state.competitions }),
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
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPhases: (phases: TrainingPhase[]) => void;
  addPhase: (phase: TrainingPhase) => void;
  updatePhase: (id: string, updates: Partial<TrainingPhase>) => void;
  deletePhase: (id: string) => void;
  setZones: (zones: TrainingZones) => void;
  setMethodology: (methodology: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Getters
  getCurrentPhase: () => TrainingPhase | null;
  getPhaseById: (id: string) => TrainingPhase | null;
}

export const useTrainingStore = create<TrainingStore>()(
  persist(
    (set, get) => ({
      phases: [],
      zones: {
        z1: { name: "Recovery", min: 0, max: 60 },
        z2: { name: "Aerobic Base", min: 60, max: 70 },
        z3: { name: "Aerobic Threshold", min: 70, max: 80 },
        z4: { name: "Lactate Threshold", min: 80, max: 90 },
        z5: { name: "VO2 Max", min: 90, max: 100 },
      },
      selectedMethodology: "standard",
      isLoading: false,
      error: null,

      setPhases: (phases) => set({ phases, error: null }),
      
      addPhase: (phase) => {
        set((state) => ({
          phases: [...state.phases, phase],
          error: null,
        }));
      },

      updatePhase: (id, updates) => {
        set((state) => ({
          phases: state.phases.map(phase =>
            phase.id === id ? { ...phase, ...updates } : phase
          ),
          error: null,
        }));
      },

      deletePhase: (id) => {
        set((state) => ({
          phases: state.phases.filter(phase => phase.id !== id),
          error: null,
        }));
      },

      setZones: (zones) => set({ zones, error: null }),
      setMethodology: (selectedMethodology) => set({ selectedMethodology }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      getCurrentPhase: () => {
        const { phases } = get();
        const now = new Date().toISOString().split('T')[0];
        return phases
          .filter(phase => phase.startDate && phase.endDate)
          .find(phase => phase.startDate! <= now && phase.endDate! >= now) || null;
      },

      getPhaseById: (id) => {
        const { phases } = get();
        return phases.find(phase => phase.id === id) || null;
      },
    }),
    {
      name: 'training-storage',
      partialize: (state) => ({ 
        phases: state.phases,
        zones: state.zones,
        selectedMethodology: state.selectedMethodology
      }),
    }
  )
);

// =====================================================
// AI COACH STORE
// =====================================================
interface AICoachStore {
  advice: AICoachAdvice[];
  analysis: AICoachAnalysis | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addAdvice: (advice: Omit<AICoachAdvice, "id" | "createdAt">) => void;
  updateAdvice: (id: string, updates: Partial<AICoachAdvice>) => void;
  deleteAdvice: (id: string) => void;
  setAnalysis: (analysis: AICoachAnalysis | null) => void;
  clearAdvice: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Getters
  getAdviceByType: (type: AICoachAdvice["type"]) => AICoachAdvice[];
  getHighPriorityAdvice: () => AICoachAdvice[];
}

export const useAICoachStore = create<AICoachStore>()(
  persist(
    (set, get) => ({
      advice: [],
      analysis: null,
      isLoading: false,
      error: null,

      addAdvice: (adviceData) => {
        const newAdvice: AICoachAdvice = {
          ...adviceData,
          id: Date.now().toString(36) + Math.random().toString(36).substr(2),
          createdAt: new Date(),
        };
        
        set((state) => ({
          advice: [...state.advice, newAdvice],
          error: null,
        }));
      },

      updateAdvice: (id, updates) => {
        set((state) => ({
          advice: state.advice.map(advice =>
            advice.id === id ? { ...advice, ...updates } : advice
          ),
          error: null,
        }));
      },

      deleteAdvice: (id) => {
        set((state) => ({
          advice: state.advice.filter(advice => advice.id !== id),
          error: null,
        }));
      },

      setAnalysis: (analysis) => set({ analysis, error: null }),
      clearAdvice: () => set({ advice: [], analysis: null, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      getAdviceByType: (type) => {
        const { advice } = get();
        return advice.filter(advice => advice.type === type);
      },

      getHighPriorityAdvice: () => {
        const { advice } = get();
        return advice.filter(advice => advice.priority === "high");
      },
    }),
    {
      name: 'ai-coach-storage',
      partialize: (state) => ({ 
        advice: state.advice,
        analysis: state.analysis
      }),
    }
  )
);

// =====================================================
// REPORTS STORE
// =====================================================
interface ReportsStore {
  reports: TrainingReport[];
  selectedReport: TrainingReport | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addReport: (report: Omit<TrainingReport, "id" | "generatedAt">) => void;
  updateReport: (id: string, updates: Partial<TrainingReport>) => void;
  deleteReport: (id: string) => void;
  selectReport: (id: string) => void;
  clearReports: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Getters
  getReportsByType: (type: TrainingReport["type"]) => TrainingReport[];
  getRecentReports: (limit?: number) => TrainingReport[];
}

export const useReportsStore = create<ReportsStore>()(
  persist(
    (set, get) => ({
      reports: [],
      selectedReport: null,
      isLoading: false,
      error: null,

      addReport: (reportData) => {
        const newReport: TrainingReport = {
          ...reportData,
          id: Date.now().toString(36) + Math.random().toString(36).substr(2),
          generatedAt: new Date(),
        };
        
        set((state) => ({
          reports: [...state.reports, newReport],
          error: null,
        }));
      },

      updateReport: (id, updates) => {
        set((state) => ({
          reports: state.reports.map(report =>
            report.id === id ? { ...report, ...updates } : report
          ),
          error: null,
        }));
      },

      deleteReport: (id) => {
        set((state) => ({
          reports: state.reports.filter(report => report.id !== id),
          selectedReport: state.selectedReport?.id === id ? null : state.selectedReport,
          error: null,
        }));
      },

      selectReport: (id) => {
        const { reports } = get();
        const report = reports.find(report => report.id === id);
        set({ selectedReport: report || null });
      },

      clearReports: () => set({ 
        reports: [], 
        selectedReport: null, 
        error: null 
      }),

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      getReportsByType: (type) => {
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
      partialize: (state) => ({ 
        reports: state.reports,
        selectedReport: state.selectedReport
      }),
    }
  )
);

// =====================================================
// UI STORE
// =====================================================
interface UIStore {
  theme: "light" | "dark" | "system";
  sidebarOpen: boolean;
  notifications: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    duration?: number;
  }>;
  
  // Actions
  setTheme: (theme: "light" | "dark" | "system") => void;
  setSidebarOpen: (open: boolean) => void;
  addNotification: (notification: Omit<UIStore["notifications"][0], "id">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: "system",
      sidebarOpen: true,
      notifications: [],

      setTheme: (theme) => set({ theme }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      
      addNotification: (notification) => {
        const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        set((state) => ({
          notifications: [...state.notifications, { ...notification, id }],
        }));
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      },

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ 
        theme: state.theme,
        sidebarOpen: state.sidebarOpen
      }),
    }
  )
);
