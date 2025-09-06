import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Session } from "../types/session";

// Función para generar IDs únicos que funcione en todos los entornos
function generateId(): string {
  // Usar crypto.randomUUID() si está disponible (navegadores modernos)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback para navegadores antiguos y móviles
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

interface SessionsState {
  sessions: Session[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addSession: (session: Omit<Session, "id">) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  deleteSession: (id: string) => void;
  loadSessions: () => void;
  clearSessions: () => void;

  // Computed values
  getSessionsByDate: (date: string) => Session[];
  getSessionsByRange: (startDate: string, endDate: string) => Session[];
}

export const useSessionsStore = create<SessionsState>()(
  persist(
    (set, get) => ({
      sessions: [],
      isLoading: false,
      error: null,

      addSession: sessionData => {
        const newSession: Session = {
          ...sessionData,
          id: generateId(),
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

      loadSessions: () => {
        // Loaded automatically by persist middleware
        set({ isLoading: false, error: null });
      },

      clearSessions: () => {
        set({ sessions: [], error: null });
      },

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
    }),
    {
      name: "swim-sessions-storage",
      partialize: state => ({ sessions: state.sessions }),
    }
  )
);
