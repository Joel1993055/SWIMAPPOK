import { Competition } from '@/lib/types/entities'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// =====================================================
// TIPOS NORMALIZADOS
// =====================================================
interface NormalizedCompetitions {
  byId: Record<string, Competition>
  allIds: string[]
  byStatus: {
    upcoming: string[]
    completed: string[]
    cancelled: string[]
  }
  byPriority: {
    high: string[]
    medium: string[]
    low: string[]
  }
  byType: {
    local: string[]
    regional: string[]
    national: string[]
    international: string[]
  }
}

interface CompetitionsState {
  // Datos normalizados
  competitions: NormalizedCompetitions
  isLoading: boolean
  error: string | null
  lastFetch: string | null

  // Actions
  setCompetitions: (competitions: Competition[]) => void
  addCompetition: (competition: Competition) => void
  updateCompetition: (id: string, updates: Partial<Competition>) => void
  deleteCompetition: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearCompetitions: () => void

  // Selectors
  getCompetition: (id: string) => Competition | null
  getAllCompetitions: () => Competition[]
  getUpcomingCompetitions: () => Competition[]
  getCompletedCompetitions: () => Competition[]
  getCancelledCompetitions: () => Competition[]
  getCompetitionsByPriority: (priority: 'high' | 'medium' | 'low') => Competition[]
  getCompetitionsByType: (type: 'local' | 'regional' | 'national' | 'international') => Competition[]
  getMainCompetition: () => Competition | null
  getCompetitionsByDate: (date: string) => Competition[]
  getCompetitionsByRange: (startDate: string, endDate: string) => Competition[]
}

// =====================================================
// FUNCIONES AUXILIARES
// =====================================================
function normalizeCompetitions(competitions: Competition[]): NormalizedCompetitions {
  const byId: Record<string, Competition> = {}
  const allIds: string[] = []
  const byStatus = {
    upcoming: [] as string[],
    completed: [] as string[],
    cancelled: [] as string[]
  }
  const byPriority = {
    high: [] as string[],
    medium: [] as string[],
    low: [] as string[]
  }
  const byType = {
    local: [] as string[],
    regional: [] as string[],
    national: [] as string[],
    international: [] as string[]
  }

  const today = new Date().toISOString().split('T')[0]

  competitions.forEach(competition => {
    byId[competition.id] = competition
    allIds.push(competition.id)

    // Indexar por estado
    byStatus[competition.status].push(competition.id)

    // Indexar por prioridad
    byPriority[competition.priority].push(competition.id)

    // Indexar por tipo
    byType[competition.type].push(competition.id)
  })

  return {
    byId,
    allIds,
    byStatus,
    byPriority,
    byType
  }
}

function denormalizeCompetitions(normalized: NormalizedCompetitions): Competition[] {
  return normalized.allIds.map(id => normalized.byId[id])
}

// =====================================================
// STORE PRINCIPAL
// =====================================================
export const useCompetitionsStore = create<CompetitionsState>()(
  persist(
    (set, get) => ({
      competitions: {
        byId: {},
        allIds: [],
        byStatus: {
          upcoming: [],
          completed: [],
          cancelled: []
        },
        byPriority: {
          high: [],
          medium: [],
          low: []
        },
        byType: {
          local: [],
          regional: [],
          national: [],
          international: []
        }
      },
      isLoading: false,
      error: null,
      lastFetch: null,

      setCompetitions: (competitions) => {
        const normalized = normalizeCompetitions(competitions)
        set({
          competitions: normalized,
          error: null,
          lastFetch: new Date().toISOString()
        })
      },

      addCompetition: (competition) => {
        set((state) => {
          const newCompetitions = [...denormalizeCompetitions(state.competitions), competition]
          const normalized = normalizeCompetitions(newCompetitions)
          return {
            competitions: normalized,
            error: null
          }
        })
      },

      updateCompetition: (id, updates) => {
        set((state) => {
          const competition = state.competitions.byId[id]
          if (!competition) return state

          const updatedCompetition = { ...competition, ...updates }
          const newCompetitions = denormalizeCompetitions(state.competitions).map(c =>
            c.id === id ? updatedCompetition : c
          )
          const normalized = normalizeCompetitions(newCompetitions)

          return {
            competitions: normalized,
            error: null
          }
        })
      },

      deleteCompetition: (id) => {
        set((state) => {
          const newCompetitions = denormalizeCompetitions(state.competitions).filter(c => c.id !== id)
          const normalized = normalizeCompetitions(newCompetitions)

          return {
            competitions: normalized,
            error: null
          }
        })
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearCompetitions: () => set({
        competitions: {
          byId: {},
          allIds: [],
          byStatus: {
            upcoming: [],
            completed: [],
            cancelled: []
          },
          byPriority: {
            high: [],
            medium: [],
            low: []
          },
          byType: {
            local: [],
            regional: [],
            national: [],
            international: []
          }
        },
        error: null,
        lastFetch: null
      }),

      // =====================================================
      // SELECTORS
      // =====================================================
      getCompetition: (id) => {
        const { competitions } = get()
        return competitions.byId[id] || null
      },

      getAllCompetitions: () => {
        const { competitions } = get()
        return denormalizeCompetitions(competitions)
      },

      getUpcomingCompetitions: () => {
        const { competitions } = get()
        return competitions.byStatus.upcoming
          .map(id => competitions.byId[id])
          .sort((a, b) => a.date.localeCompare(b.date))
      },

      getCompletedCompetitions: () => {
        const { competitions } = get()
        return competitions.byStatus.completed
          .map(id => competitions.byId[id])
          .sort((a, b) => b.date.localeCompare(a.date))
      },

      getCancelledCompetitions: () => {
        const { competitions } = get()
        return competitions.byStatus.cancelled
          .map(id => competitions.byId[id])
          .sort((a, b) => b.date.localeCompare(a.date))
      },

      getCompetitionsByPriority: (priority) => {
        const { competitions } = get()
        return competitions.byPriority[priority].map(id => competitions.byId[id])
      },

      getCompetitionsByType: (type) => {
        const { competitions } = get()
        return competitions.byType[type].map(id => competitions.byId[id])
      },

      getMainCompetition: () => {
        const { competitions } = get()
        const highPriorityCompetitions = competitions.byPriority.high
          .map(id => competitions.byId[id])
          .filter(c => c.status === 'upcoming')
          .sort((a, b) => a.date.localeCompare(b.date))

        return highPriorityCompetitions[0] || null
      },

      getCompetitionsByDate: (date) => {
        const { competitions } = get()
        const allCompetitions = denormalizeCompetitions(competitions)
        return allCompetitions.filter(competition => competition.date === date)
      },

      getCompetitionsByRange: (startDate, endDate) => {
        const { competitions } = get()
        const allCompetitions = denormalizeCompetitions(competitions)
        return allCompetitions.filter(competition => 
          competition.date >= startDate && competition.date <= endDate
        )
      }
    }),
    {
      name: 'competitions-normalized-storage',
      partialize: (state) => ({
        competitions: state.competitions,
        lastFetch: state.lastFetch
      })
    }
  )
)

// =====================================================
// SELECTORS ADICIONALES
// =====================================================
export const competitionsSelectors = {
  // Selector para competencias de la próxima semana
  getUpcomingWeekCompetitions: (state: CompetitionsState) => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const nextWeekDate = nextWeek.toISOString().split('T')[0]
    
    return state.getCompetitionsByRange(
      today.toISOString().split('T')[0],
      nextWeekDate
    ).filter(c => c.status === 'upcoming')
  },

  // Selector para competencias del próximo mes
  getUpcomingMonthCompetitions: (state: CompetitionsState) => {
    const today = new Date()
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    const nextMonthDate = nextMonth.toISOString().split('T')[0]
    
    return state.getCompetitionsByRange(
      today.toISOString().split('T')[0],
      nextMonthDate
    ).filter(c => c.status === 'upcoming')
  },

  // Selector para competencias por distancia
  getCompetitionsByDistance: (state: CompetitionsState, distance: number) => {
    return state.getAllCompetitions().filter(c => c.distance === distance)
  },

  // Selector para competencias por stroke
  getCompetitionsByStroke: (state: CompetitionsState, stroke: string) => {
    return state.getAllCompetitions().filter(c => c.stroke === stroke)
  },

  // Selector para estadísticas de competencias
  getCompetitionsStats: (state: CompetitionsState) => {
    const allCompetitions = state.getAllCompetitions()
    const upcoming = state.getUpcomingCompetitions()
    const completed = state.getCompletedCompetitions()
    const cancelled = state.getCancelledCompetitions()
    
    return {
      total: allCompetitions.length,
      upcoming: upcoming.length,
      completed: completed.length,
      cancelled: cancelled.length,
      highPriority: state.getCompetitionsByPriority('high').length,
      mediumPriority: state.getCompetitionsByPriority('medium').length,
      lowPriority: state.getCompetitionsByPriority('low').length,
      local: state.getCompetitionsByType('local').length,
      regional: state.getCompetitionsByType('regional').length,
      national: state.getCompetitionsByType('national').length,
      international: state.getCompetitionsByType('international').length
    }
  }
}
