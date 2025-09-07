import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useCompetitionsStore } from './normalized/competitions'
import { useSessionsStore } from './normalized/sessions'
import { useTrainingPhasesStore } from './normalized/training-phases'
import { useAICoachStore, useAuthStore, useReportsStore, useUIStore } from './unified'

// =====================================================
// TIPOS PARA EL STORE UNIFICADO
// =====================================================

interface UnifiedAppState {
  // Estado de la aplicación
  isInitialized: boolean
  lastSync: string | null
  syncInProgress: boolean
  
  // Estados de los stores individuales
  sessions: ReturnType<typeof useSessionsStore>
  trainingPhases: ReturnType<typeof useTrainingPhasesStore>
  competitions: ReturnType<typeof useCompetitionsStore>
  auth: ReturnType<typeof useAuthStore>
  aiCoach: ReturnType<typeof useAICoachStore>
  reports: ReturnType<typeof useReportsStore>
  ui: ReturnType<typeof useUIStore>
  
  // Acciones unificadas
  initialize: () => void
  syncAll: () => Promise<void>
  resetAll: () => void
  getAppStats: () => {
    totalSessions: number
    totalPhases: number
    totalCompetitions: number
    totalReports: number
    lastActivity: string | null
  }
}

// =====================================================
// STORE UNIFICADO
// =====================================================

export const useUnifiedStore = create<UnifiedAppState>()(
  persist(
    (set, get) => ({
      isInitialized: false,
      lastSync: null,
      syncInProgress: false,
      
      // Inicializar stores individuales
      sessions: useSessionsStore.getState(),
      trainingPhases: useTrainingPhasesStore.getState(),
      competitions: useCompetitionsStore.getState(),
      auth: useAuthStore.getState(),
      aiCoach: useAICoachStore.getState(),
      reports: useReportsStore.getState(),
      ui: useUIStore.getState(),
      
      // =====================================================
      // ACCIONES UNIFICADAS
      // =====================================================
      
      initialize: () => {
        set({ isInitialized: true })
        
        // Sincronizar stores individuales
        set({
          sessions: useSessionsStore.getState(),
          trainingPhases: useTrainingPhasesStore.getState(),
          competitions: useCompetitionsStore.getState(),
          auth: useAuthStore.getState(),
          aiCoach: useAICoachStore.getState(),
          reports: useReportsStore.getState(),
          ui: useUIStore.getState()
        })
      },
      
      syncAll: async () => {
        set({ syncInProgress: true })
        
        try {
          // Aquí irían las llamadas a la API para sincronizar todos los datos
          // Por ahora solo actualizamos el timestamp
          set({ 
            lastSync: new Date().toISOString(),
            syncInProgress: false
          })
        } catch (error) {
          console.error('Error syncing data:', error)
          set({ syncInProgress: false })
        }
      },
      
      resetAll: () => {
        // Resetear todos los stores
        useSessionsStore.getState().clearSessions()
        useTrainingPhasesStore.getState().clearPhases()
        useCompetitionsStore.getState().clearCompetitions()
        useAuthStore.getState().signOut()
        useAICoachStore.getState().clearAdvice()
        useReportsStore.getState().clearReports()
        useUIStore.getState().clearNotifications()
        
        // Resetear estado unificado
        set({
          isInitialized: false,
          lastSync: null,
          syncInProgress: false
        })
      },
      
      getAppStats: () => {
        const state = get()
        const sessions = state.sessions.getAllSessions()
        const phases = state.trainingPhases.getAllPhases()
        const competitions = state.competitions.getAllCompetitions()
        const reports = state.reports.reports
        
        // Calcular última actividad
        const allDates = [
          ...sessions.map(s => s.updated_at),
          ...phases.map(p => p.updated_at),
          ...competitions.map(c => c.updated_at),
          ...reports.map(r => r.generated_at.toISOString())
        ].filter(Boolean)
        
        const lastActivity = allDates.length > 0 
          ? new Date(Math.max(...allDates.map(d => new Date(d).getTime()))).toISOString()
          : null
        
        return {
          totalSessions: sessions.length,
          totalPhases: phases.length,
          totalCompetitions: competitions.length,
          totalReports: reports.length,
          lastActivity
        }
      }
    }),
    {
      name: 'unified-app-storage',
      partialize: (state) => ({
        isInitialized: state.isInitialized,
        lastSync: state.lastSync,
        syncInProgress: state.syncInProgress
      })
    }
  )
)

// =====================================================
// HOOKS DE CONVENIENCIA
// =====================================================

// Hook para obtener estadísticas de la aplicación
export function useAppStats() {
  const getAppStats = useUnifiedStore(state => state.getAppStats)
  return getAppStats()
}

// Hook para sincronización
export function useSync() {
  const syncAll = useUnifiedStore(state => state.syncAll)
  const syncInProgress = useUnifiedStore(state => state.syncInProgress)
  const lastSync = useUnifiedStore(state => state.lastSync)
  
  return {
    syncAll,
    syncInProgress,
    lastSync
  }
}

// Hook para inicialización
export function useAppInitialization() {
  const initialize = useUnifiedStore(state => state.initialize)
  const isInitialized = useUnifiedStore(state => state.isInitialized)
  
  return {
    initialize,
    isInitialized
  }
}

// Hook para reset completo
export function useAppReset() {
  const resetAll = useUnifiedStore(state => state.resetAll)
  
  return { resetAll }
}
