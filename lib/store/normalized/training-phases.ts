import { TrainingPhase } from '@/lib/types/entities'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// =====================================================
// TIPOS NORMALIZADOS
// =====================================================
interface NormalizedPhases {
  byId: Record<string, TrainingPhase>
  allIds: string[]
  byStatus: {
    active: string[]
    upcoming: string[]
    completed: string[]
  }
  byPriority: {
    high: string[]
    medium: string[]
    low: string[]
  }
}

interface TrainingPhasesState {
  // Datos normalizados
  phases: NormalizedPhases
  isLoading: boolean
  error: string | null
  lastFetch: string | null

  // Actions
  setPhases: (phases: TrainingPhase[]) => void
  addPhase: (phase: TrainingPhase) => void
  updatePhase: (id: string, updates: Partial<TrainingPhase>) => void
  deletePhase: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearPhases: () => void

  // Selectors
  getPhase: (id: string) => TrainingPhase | null
  getAllPhases: () => TrainingPhase[]
  getActivePhases: () => TrainingPhase[]
  getUpcomingPhases: () => TrainingPhase[]
  getCompletedPhases: () => TrainingPhase[]
  getPhasesByPriority: (priority: 'high' | 'medium' | 'low') => TrainingPhase[]
  getCurrentPhase: () => TrainingPhase | null
  getPhaseByDate: (date: string) => TrainingPhase | null
}

// =====================================================
// FUNCIONES AUXILIARES
// =====================================================
function normalizePhases(phases: TrainingPhase[]): NormalizedPhases {
  const byId: Record<string, TrainingPhase> = {}
  const allIds: string[] = []
  const byStatus = {
    active: [] as string[],
    upcoming: [] as string[],
    completed: [] as string[]
  }
  const byPriority = {
    high: [] as string[],
    medium: [] as string[],
    low: [] as string[]
  }

  const today = new Date().toISOString().split('T')[0]

  phases.forEach(phase => {
    byId[phase.id] = phase
    allIds.push(phase.id)

    // Indexar por estado
    if (phase.is_active) {
      byStatus.active.push(phase.id)
    } else if (phase.start_date > today) {
      byStatus.upcoming.push(phase.id)
    } else if (phase.end_date < today) {
      byStatus.completed.push(phase.id)
    }

    // Indexar por prioridad
    byPriority[phase.priority].push(phase.id)
  })

  return {
    byId,
    allIds,
    byStatus,
    byPriority
  }
}

function denormalizePhases(normalized: NormalizedPhases): TrainingPhase[] {
  return normalized.allIds.map(id => normalized.byId[id])
}

// =====================================================
// STORE PRINCIPAL
// =====================================================
export const useTrainingPhasesStore = create<TrainingPhasesState>()(
  persist(
    (set, get) => ({
      phases: {
        byId: {},
        allIds: [],
        byStatus: {
          active: [],
          upcoming: [],
          completed: []
        },
        byPriority: {
          high: [],
          medium: [],
          low: []
        }
      },
      isLoading: false,
      error: null,
      lastFetch: null,

      setPhases: (phases) => {
        const normalized = normalizePhases(phases)
        set({
          phases: normalized,
          error: null,
          lastFetch: new Date().toISOString()
        })
      },

      addPhase: (phase) => {
        set((state) => {
          const newPhases = [...denormalizePhases(state.phases), phase]
          const normalized = normalizePhases(newPhases)
          return {
            phases: normalized,
            error: null
          }
        })
      },

      updatePhase: (id, updates) => {
        set((state) => {
          const phase = state.phases.byId[id]
          if (!phase) return state

          const updatedPhase = { ...phase, ...updates }
          const newPhases = denormalizePhases(state.phases).map(p =>
            p.id === id ? updatedPhase : p
          )
          const normalized = normalizePhases(newPhases)

          return {
            phases: normalized,
            error: null
          }
        })
      },

      deletePhase: (id) => {
        set((state) => {
          const newPhases = denormalizePhases(state.phases).filter(p => p.id !== id)
          const normalized = normalizePhases(newPhases)

          return {
            phases: normalized,
            error: null
          }
        })
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearPhases: () => set({
        phases: {
          byId: {},
          allIds: [],
          byStatus: {
            active: [],
            upcoming: [],
            completed: []
          },
          byPriority: {
            high: [],
            medium: [],
            low: []
          }
        },
        error: null,
        lastFetch: null
      }),

      // =====================================================
      // SELECTORS
      // =====================================================
      getPhase: (id) => {
        const { phases } = get()
        return phases.byId[id] || null
      },

      getAllPhases: () => {
        const { phases } = get()
        return denormalizePhases(phases)
      },

      getActivePhases: () => {
        const { phases } = get()
        return phases.byStatus.active.map(id => phases.byId[id])
      },

      getUpcomingPhases: () => {
        const { phases } = get()
        return phases.byStatus.upcoming.map(id => phases.byId[id])
      },

      getCompletedPhases: () => {
        const { phases } = get()
        return phases.byStatus.completed.map(id => phases.byId[id])
      },

      getPhasesByPriority: (priority) => {
        const { phases } = get()
        return phases.byPriority[priority].map(id => phases.byId[id])
      },

      getCurrentPhase: () => {
        const { phases } = get()
        const activePhases = phases.byStatus.active.map(id => phases.byId[id])
        
        if (activePhases.length === 0) return null

        // Si hay múltiples fases activas, devolver la de mayor prioridad
        return activePhases.reduce((current, phase) => {
          if (!current) return phase
          
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          const currentPriority = priorityOrder[current.priority]
          const phasePriority = priorityOrder[phase.priority]
          
          return phasePriority > currentPriority ? phase : current
        }, null as TrainingPhase | null)
      },

      getPhaseByDate: (date) => {
        const { phases } = get()
        const allPhases = denormalizePhases(phases)
        
        return allPhases.find(phase => 
          phase.start_date <= date && 
          phase.end_date >= date && 
          phase.is_active
        ) || null
      }
    }),
    {
      name: 'training-phases-normalized-storage',
      partialize: (state) => ({
        phases: state.phases,
        lastFetch: state.lastFetch
      })
    }
  )
)

// =====================================================
// SELECTORS ADICIONALES
// =====================================================
export const trainingPhasesSelectors = {
  // Selector para fases de la próxima semana
  getUpcomingWeekPhases: (state: TrainingPhasesState) => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const nextWeekDate = nextWeek.toISOString().split('T')[0]
    
    return state.getAllPhases().filter(phase => 
      phase.start_date <= nextWeekDate && 
      phase.start_date > today.toISOString().split('T')[0]
    )
  },

  // Selector para fases que terminan pronto
  getEndingSoonPhases: (state: TrainingPhasesState) => {
    const today = new Date()
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    const nextMonthDate = nextMonth.toISOString().split('T')[0]
    
    return state.getAllPhases().filter(phase => 
      phase.end_date <= nextMonthDate && 
      phase.end_date > today.toISOString().split('T')[0] &&
      phase.is_active
    )
  },

  // Selector para estadísticas de fases
  getPhasesStats: (state: TrainingPhasesState) => {
    const allPhases = state.getAllPhases()
    const activePhases = state.getActivePhases()
    const completedPhases = state.getCompletedPhases()
    
    return {
      total: allPhases.length,
      active: activePhases.length,
      completed: completedPhases.length,
      upcoming: state.getUpcomingPhases().length,
      highPriority: state.getPhasesByPriority('high').length,
      mediumPriority: state.getPhasesByPriority('medium').length,
      lowPriority: state.getPhasesByPriority('low').length
    }
  }
}
