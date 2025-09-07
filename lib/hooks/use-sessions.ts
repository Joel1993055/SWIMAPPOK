import { useApiCall } from '@/lib/hooks/use-api-call'
import { useSessionsApi } from '@/lib/services/sessions-api'
import { useSessionsStore } from '@/lib/store/normalized/sessions'
import { Session } from '@/lib/types/entities'
import { useCallback, useEffect } from 'react'

// =====================================================
// HOOK PRINCIPAL PARA SESIONES
// =====================================================
export function useSessions() {
  const store = useSessionsStore()
  const api = useSessionsApi()
  const { execute, loading, error } = useApiCall<Session[]>()

  // =====================================================
  // CARGAR SESIONES
  // =====================================================
  const loadSessions = useCallback(async (filters?: {
    date?: string
    startDate?: string
    endDate?: string
    training_phase_id?: string
    competition_id?: string
    stroke_type?: string
    session_type?: string
  }) => {
    const result = await execute(() => api.getSessions(filters))
    
    if (result.data) {
      store.setSessions(result.data)
    }
    
    if (result.error) {
      store.setError(result.error.message)
    }
    
    return result
  }, [execute, api, store])

  // =====================================================
  // CREAR SESIÓN
  // =====================================================
  const createSession = useCallback(async (sessionData: Omit<Session, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    const result = await execute(() => api.createSession(sessionData))
    
    if (result.data) {
      store.addSession(result.data)
    }
    
    if (result.error) {
      store.setError(result.error.message)
    }
    
    return result
  }, [execute, api, store])

  // =====================================================
  // ACTUALIZAR SESIÓN
  // =====================================================
  const updateSession = useCallback(async (id: string, updates: Partial<Session>) => {
    const result = await execute(() => api.updateSession(id, updates))
    
    if (result.data) {
      store.updateSession(id, updates)
    }
    
    if (result.error) {
      store.setError(result.error.message)
    }
    
    return result
  }, [execute, api, store])

  // =====================================================
  // ELIMINAR SESIÓN
  // =====================================================
  const deleteSession = useCallback(async (id: string) => {
    const result = await execute(() => api.deleteSession(id))
    
    if (result.data) {
      store.deleteSession(id)
    }
    
    if (result.error) {
      store.setError(result.error.message)
    }
    
    return result
  }, [execute, api, store])

  // =====================================================
  // BÚSQUEDA DE SESIONES
  // =====================================================
  const searchSessions = useCallback(async (query: string) => {
    const result = await execute(() => api.searchSessions(query))
    
    if (result.data) {
      store.setSessions(result.data)
    }
    
    if (result.error) {
      store.setError(result.error.message)
    }
    
    return result
  }, [execute, api, store])

  // =====================================================
  // CARGAR SESIONES AL MONTAR EL COMPONENTE
  // =====================================================
  useEffect(() => {
    if (store.sessions.allIds.length === 0 && !loading) {
      loadSessions()
    }
  }, [loadSessions, store.sessions.allIds.length, loading])

  // =====================================================
  // RETORNAR ESTADO Y ACCIONES
  // =====================================================
  return {
    // Estado del store
    sessions: store.getAllSessions(),
    isLoading: loading || store.isLoading,
    error: error || store.error,
    
    // Acciones
    loadSessions,
    createSession,
    updateSession,
    deleteSession,
    searchSessions,
    
    // Selectores del store
    getSession: store.getSession,
    getSessionsByDate: store.getSessionsByDate,
    getSessionsByPhase: store.getSessionsByPhase,
    getSessionsByCompetition: store.getSessionsByCompetition,
    getSessionsByRange: store.getSessionsByRange,
    getTotalDistance: store.getTotalDistance,
    getTotalDuration: store.getTotalDuration,
    getAverageRPE: store.getAverageRPE,
    
    // Acciones del store
    clearSessions: store.clearSessions,
    setError: store.setError
  }
}

// =====================================================
// HOOK PARA PAGINACIÓN
// =====================================================
export function useSessionsPagination(limit: number = 10) {
  const store = useSessionsStore()
  const api = useSessionsApi()
  const { execute, loading, error } = useApiCall<{
    items: Session[]
    total: number
    page: number
    limit: number
    hasMore: boolean
  }>()

  const loadPage = useCallback(async (
    page: number,
    filters?: {
      startDate?: string
      endDate?: string
      training_phase_id?: string
      competition_id?: string
    }
  ) => {
    const result = await execute(() => api.getSessionsPaginated(page, limit, filters))
    
    if (result.data) {
      // Si es la primera página, reemplazar todas las sesiones
      if (page === 1) {
        store.setSessions(result.data.items)
      } else {
        // Si no es la primera página, agregar a las existentes
        result.data.items.forEach(session => store.addSession(session))
      }
    }
    
    if (result.error) {
      store.setError(result.error.message)
    }
    
    return result
  }, [execute, api, store, limit])

  return {
    loadPage,
    loading,
    error,
    hasMore: store.sessions.allIds.length > 0 // Simplificado, debería venir del API
  }
}

// =====================================================
// HOOK PARA ESTADÍSTICAS
// =====================================================
export function useSessionsStats() {
  const store = useSessionsStore()
  const api = useSessionsApi()
  const { execute, loading, error } = useApiCall<{
    totalSessions: number
    totalDistance: number
    totalDuration: number
    averageRPE: number
    averageDistance: number
    averageDuration: number
    strokeDistribution: Record<string, number>
    sessionTypeDistribution: Record<string, number>
  }>()

  const loadStats = useCallback(async (filters?: {
    startDate?: string
    endDate?: string
    training_phase_id?: string
  }) => {
    const result = await execute(() => api.getSessionsStats(filters))
    
    if (result.error) {
      store.setError(result.error.message)
    }
    
    return result
  }, [execute, api, store])

  return {
    loadStats,
    loading,
    error
  }
}

// =====================================================
// HOOK PARA UNA SESIÓN ESPECÍFICA
// =====================================================
export function useSession(id: string) {
  const store = useSessionsStore()
  const api = useSessionsApi()
  const { execute, loading, error } = useApiCall<Session>()

  const loadSession = useCallback(async () => {
    const result = await execute(() => api.getSession(id))
    
    if (result.data) {
      store.addSession(result.data)
    }
    
    if (result.error) {
      store.setError(result.error.message)
    }
    
    return result
  }, [execute, api, store, id])

  const updateSession = useCallback(async (updates: Partial<Session>) => {
    const result = await execute(() => api.updateSession(id, updates))
    
    if (result.data) {
      store.updateSession(id, updates)
    }
    
    if (result.error) {
      store.setError(result.error.message)
    }
    
    return result
  }, [execute, api, store, id])

  const deleteSession = useCallback(async () => {
    const result = await execute(() => api.deleteSession(id))
    
    if (result.data) {
      store.deleteSession(id)
    }
    
    if (result.error) {
      store.setError(result.error.message)
    }
    
    return result
  }, [execute, api, store, id])

  // Cargar sesión si no existe en el store
  useEffect(() => {
    if (!store.getSession(id) && !loading) {
      loadSession()
    }
  }, [id, loadSession, loading, store])

  return {
    session: store.getSession(id),
    loading,
    error,
    loadSession,
    updateSession,
    deleteSession
  }
}
