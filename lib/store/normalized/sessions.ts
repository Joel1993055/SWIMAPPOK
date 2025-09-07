import { Session } from '@/lib/types/entities'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// =====================================================
// TIPOS NORMALIZADOS
// =====================================================
interface NormalizedSessions {
  byId: Record<string, Session>
  allIds: string[]
  byDate: Record<string, string[]>
  byPhase: Record<string, string[]>
  byCompetition: Record<string, string[]>
}

interface SessionsState {
  // Datos normalizados
  sessions: NormalizedSessions
  isLoading: boolean
  error: string | null
  lastFetch: string | null

  // Actions
  setSessions: (sessions: Session[]) => void
  addSession: (session: Session) => void
  updateSession: (id: string, updates: Partial<Session>) => void
  deleteSession: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearSessions: () => void

  // Selectors
  getSession: (id: string) => Session | null
  getSessionsByDate: (date: string) => Session[]
  getSessionsByPhase: (phaseId: string) => Session[]
  getSessionsByCompetition: (competitionId: string) => Session[]
  getSessionsByRange: (startDate: string, endDate: string) => Session[]
  getAllSessions: () => Session[]
  getTotalDistance: () => number
  getTotalDuration: () => number
  getAverageRPE: () => number
}

// =====================================================
// FUNCIONES AUXILIARES
// =====================================================
function normalizeSessions(sessions: Session[]): NormalizedSessions {
  const byId: Record<string, Session> = {}
  const allIds: string[] = []
  const byDate: Record<string, string[]> = {}
  const byPhase: Record<string, string[]> = {}
  const byCompetition: Record<string, string[]> = {}

  sessions.forEach(session => {
    byId[session.id] = session
    allIds.push(session.id)

    // Indexar por fecha
    if (!byDate[session.date]) {
      byDate[session.date] = []
    }
    byDate[session.date].push(session.id)

    // Indexar por fase de entrenamiento
    if (!byPhase[session.training_phase_id]) {
      byPhase[session.training_phase_id] = []
    }
    byPhase[session.training_phase_id].push(session.id)

    // Indexar por competencia (si existe)
    if (session.competition_id) {
      if (!byCompetition[session.competition_id]) {
        byCompetition[session.competition_id] = []
      }
      byCompetition[session.competition_id].push(session.id)
    }
  })

  return {
    byId,
    allIds,
    byDate,
    byPhase,
    byCompetition
  }
}

function denormalizeSessions(normalized: NormalizedSessions): Session[] {
  return normalized.allIds.map(id => normalized.byId[id])
}

// =====================================================
// STORE PRINCIPAL
// =====================================================
export const useSessionsStore = create<SessionsState>()(
  persist(
    (set, get) => ({
      sessions: {
        byId: {},
        allIds: [],
        byDate: {},
        byPhase: {},
        byCompetition: {}
      },
      isLoading: false,
      error: null,
      lastFetch: null,

      setSessions: (sessions) => {
        const normalized = normalizeSessions(sessions)
        set({
          sessions: normalized,
          error: null,
          lastFetch: new Date().toISOString()
        })
      },

      addSession: (session) => {
        set((state) => {
          const newSessions = [...denormalizeSessions(state.sessions), session]
          const normalized = normalizeSessions(newSessions)
          return {
            sessions: normalized,
            error: null
          }
        })
      },

      updateSession: (id, updates) => {
        set((state) => {
          const session = state.sessions.byId[id]
          if (!session) return state

          const updatedSession = { ...session, ...updates }
          const newSessions = denormalizeSessions(state.sessions).map(s =>
            s.id === id ? updatedSession : s
          )
          const normalized = normalizeSessions(newSessions)

          return {
            sessions: normalized,
            error: null
          }
        })
      },

      deleteSession: (id) => {
        set((state) => {
          const newSessions = denormalizeSessions(state.sessions).filter(s => s.id !== id)
          const normalized = normalizeSessions(newSessions)

          return {
            sessions: normalized,
            error: null
          }
        })
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearSessions: () => set({
        sessions: {
          byId: {},
          allIds: [],
          byDate: {},
          byPhase: {},
          byCompetition: {}
        },
        error: null,
        lastFetch: null
      }),

      // =====================================================
      // SELECTORS
      // =====================================================
      getSession: (id) => {
        const { sessions } = get()
        return sessions.byId[id] || null
      },

      getSessionsByDate: (date) => {
        const { sessions } = get()
        const sessionIds = sessions.byDate[date] || []
        return sessionIds.map(id => sessions.byId[id])
      },

      getSessionsByPhase: (phaseId) => {
        const { sessions } = get()
        const sessionIds = sessions.byPhase[phaseId] || []
        return sessionIds.map(id => sessions.byId[id])
      },

      getSessionsByCompetition: (competitionId) => {
        const { sessions } = get()
        const sessionIds = sessions.byCompetition[competitionId] || []
        return sessionIds.map(id => sessions.byId[id])
      },

      getSessionsByRange: (startDate, endDate) => {
        const { sessions } = get()
        const allSessions = denormalizeSessions(sessions)
        return allSessions.filter(session => 
          session.date >= startDate && session.date <= endDate
        )
      },

      getAllSessions: () => {
        const { sessions } = get()
        return denormalizeSessions(sessions)
      },

      getTotalDistance: () => {
        const { sessions } = get()
        const allSessions = denormalizeSessions(sessions)
        return allSessions.reduce((total, session) => total + session.distance_meters, 0)
      },

      getTotalDuration: () => {
        const { sessions } = get()
        const allSessions = denormalizeSessions(sessions)
        return allSessions.reduce((total, session) => total + session.duration_minutes, 0)
      },

      getAverageRPE: () => {
        const { sessions } = get()
        const allSessions = denormalizeSessions(sessions)
        if (allSessions.length === 0) return 0
        
        const totalRPE = allSessions.reduce((total, session) => total + session.rpe, 0)
        return totalRPE / allSessions.length
      }
    }),
    {
      name: 'sessions-normalized-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        lastFetch: state.lastFetch
      })
    }
  )
)

// =====================================================
// SELECTORS ADICIONALES (fuera del store para mejor performance)
// =====================================================
export const sessionsSelectors = {
  // Selector para sesiones de la semana actual
  getCurrentWeekSessions: (state: SessionsState) => {
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6))
    
    const startDate = startOfWeek.toISOString().split('T')[0]
    const endDate = endOfWeek.toISOString().split('T')[0]
    
    return state.getSessionsByRange(startDate, endDate)
  },

  // Selector para sesiones del mes actual
  getCurrentMonthSessions: (state: SessionsState) => {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    
    const startDate = startOfMonth.toISOString().split('T')[0]
    const endDate = endOfMonth.toISOString().split('T')[0]
    
    return state.getSessionsByRange(startDate, endDate)
  },

  // Selector para estadísticas de rendimiento
  getPerformanceStats: (state: SessionsState) => {
    const allSessions = state.getAllSessions()
    
    if (allSessions.length === 0) {
      return {
        totalSessions: 0,
        totalDistance: 0,
        totalDuration: 0,
        averageRPE: 0,
        averageDistance: 0,
        averageDuration: 0
      }
    }

    const totalDistance = state.getTotalDistance()
    const totalDuration = state.getTotalDuration()
    const averageRPE = state.getAverageRPE()

    return {
      totalSessions: allSessions.length,
      totalDistance,
      totalDuration,
      averageRPE,
      averageDistance: totalDistance / allSessions.length,
      averageDuration: totalDuration / allSessions.length
    }
  }
}
