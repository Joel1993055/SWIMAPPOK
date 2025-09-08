import { useSessionsApi } from '@/lib/services/sessions-api'
import { Session } from '@/lib/types/entities'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// =====================================================
// QUERY KEYS
// =====================================================

export const sessionsKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionsKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...sessionsKeys.lists(), filters] as const,
  details: () => [...sessionsKeys.all, 'detail'] as const,
  detail: (id: string) => [...sessionsKeys.details(), id] as const,
  stats: () => [...sessionsKeys.all, 'stats'] as const,
  statsWithFilters: (filters: Record<string, unknown>) => [...sessionsKeys.stats(), filters] as const,
}

// =====================================================
// QUERIES
// =====================================================

// Hook para obtener todas las sesiones
export function useSessionsQuery(filters?: {
  date?: string
  startDate?: string
  endDate?: string
  training_phase_id?: string
  competition_id?: string
  stroke_type?: string
  session_type?: string
}) {
  const api = useSessionsApi()
  
  return useQuery({
    queryKey: sessionsKeys.list(filters || {}),
    queryFn: () => api.getSessions(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}

// Hook para obtener una sesión específica
export function useSessionQuery(id: string) {
  const api = useSessionsApi()
  
  return useQuery({
    queryKey: sessionsKeys.detail(id),
    queryFn: () => api.getSession(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Hook para obtener sesiones paginadas
export function useSessionsPaginatedQuery(
  page: number,
  limit: number = 10,
  filters?: {
    startDate?: string
    endDate?: string
    training_phase_id?: string
    competition_id?: string
  }
) {
  const api = useSessionsApi()
  
  return useQuery({
    queryKey: [...sessionsKeys.lists(), 'paginated', { page, limit, filters }],
    queryFn: () => api.getSessionsPaginated(page, limit, filters),
    staleTime: 2 * 60 * 1000,
  })
}

// Hook para buscar sesiones
export function useSessionsSearchQuery(query: string) {
  const api = useSessionsApi()
  
  return useQuery({
    queryKey: [...sessionsKeys.lists(), 'search', query],
    queryFn: () => api.searchSessions(query),
    enabled: query.length > 2, // Solo buscar si hay al menos 3 caracteres
    staleTime: 1 * 60 * 1000, // 1 minuto
  })
}

// Hook para estadísticas de sesiones
export function useSessionsStatsQuery(filters?: {
  startDate?: string
  endDate?: string
  training_phase_id?: string
}) {
  const api = useSessionsApi()
  
  return useQuery({
    queryKey: sessionsKeys.statsWithFilters(filters || {}),
    queryFn: () => api.getSessionsStats(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// =====================================================
// MUTATIONS
// =====================================================

// Hook para crear sesión
export function useCreateSessionMutation() {
  const api = useSessionsApi()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (sessionData: Omit<Session, 'id' | 'created_at' | 'updated_at' | 'user_id'>) =>
      api.createSession(sessionData),
    onMutate: async (newSession) => {
      // Cancelar queries en progreso para evitar conflictos
      await queryClient.cancelQueries({ queryKey: sessionsKeys.all })
      
      // Snapshot del estado anterior
      const previousSessions = queryClient.getQueriesData({ queryKey: sessionsKeys.all })
      
      // Crear sesión optimista temporal
      const optimisticSession: Session = {
        ...newSession,
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'current-user' // Se actualizará con el ID real del usuario
      }
      
      // Actualizar cache optimistamente
      queryClient.setQueriesData(
        { queryKey: sessionsKeys.lists() },
        (old: Session[] | undefined) => {
          if (!old) return [optimisticSession]
          return [optimisticSession, ...old]
        }
      )
      
      // Retornar contexto para rollback
      return { previousSessions, optimisticSession }
    },
    onError: (error, newSession, context) => {
      // Rollback en caso de error
      if (context?.previousSessions) {
        context.previousSessions.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      console.error('Error creating session:', error)
    },
    onSuccess: (data, variables, context) => {
      // Actualizar con datos reales del servidor
      queryClient.setQueriesData(
        { queryKey: sessionsKeys.lists() },
        (old: Session[] | undefined) => {
          if (!old) return [data]
          return old.map(session => 
            session.id === context?.optimisticSession.id ? data : session
          )
        }
      )
      
      // Invalidar queries para sincronizar
      queryClient.invalidateQueries({ queryKey: sessionsKeys.all })
    },
    onSettled: () => {
      // Siempre invalidar al final para asegurar consistencia
      queryClient.invalidateQueries({ queryKey: sessionsKeys.all })
    },
  })
}

// Hook para actualizar sesión
export function useUpdateSessionMutation() {
  const api = useSessionsApi()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Session> }) =>
      api.updateSession(id, updates),
    onMutate: async ({ id, updates }) => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: sessionsKeys.all })
      
      // Snapshot del estado anterior
      const previousSessions = queryClient.getQueriesData({ queryKey: sessionsKeys.all })
      
      // Actualizar optimistamente
      queryClient.setQueriesData(
        { queryKey: sessionsKeys.lists() },
        (old: Session[] | undefined) => {
          if (!old) return old
          return old.map(session => 
            session.id === id 
              ? { ...session, ...updates, updated_at: new Date().toISOString() }
              : session
          )
        }
      )
      
      // Actualizar también la query de detalle
      queryClient.setQueryData(
        sessionsKeys.detail(id),
        (old: Session | undefined) => {
          if (!old) return old
          return { ...old, ...updates, updated_at: new Date().toISOString() }
        }
      )
      
      return { previousSessions, sessionId: id }
    },
    onError: (error, variables, context) => {
      // Rollback en caso de error
      if (context?.previousSessions) {
        context.previousSessions.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      console.error('Error updating session:', error)
    },
    onSuccess: (data, variables, context) => {
      // Actualizar con datos reales del servidor
      queryClient.setQueriesData(
        { queryKey: sessionsKeys.lists() },
        (old: Session[] | undefined) => {
          if (!old) return old
          return old.map(session => 
            session.id === variables.id ? data : session
          )
        }
      )
      
      // Actualizar query de detalle
      queryClient.setQueryData(sessionsKeys.detail(variables.id), data)
      
      // Invalidar para sincronizar
      queryClient.invalidateQueries({ queryKey: sessionsKeys.all })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: sessionsKeys.all })
    },
  })
}

// Hook para eliminar sesión
export function useDeleteSessionMutation() {
  const api = useSessionsApi()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => api.deleteSession(id),
    onMutate: async (id) => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: sessionsKeys.all })
      
      // Snapshot del estado anterior
      const previousSessions = queryClient.getQueriesData({ queryKey: sessionsKeys.all })
      
      // Eliminar optimistamente de las listas
      queryClient.setQueriesData(
        { queryKey: sessionsKeys.lists() },
        (old: Session[] | undefined) => {
          if (!old) return old
          return old.filter(session => session.id !== id)
        }
      )
      
      // Marcar como eliminado en la query de detalle
      queryClient.setQueryData(
        sessionsKeys.detail(id),
        (old: Session | undefined) => {
          if (!old) return old
          return { ...old, deleted: true, updated_at: new Date().toISOString() }
        }
      )
      
      return { previousSessions, sessionId: id }
    },
    onError: (error, id, context) => {
      // Rollback en caso de error
      if (context?.previousSessions) {
        context.previousSessions.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      console.error('Error deleting session:', error)
    },
    onSuccess: (data, id, context) => {
      // Eliminar completamente de las queries
      queryClient.removeQueries({ queryKey: sessionsKeys.detail(id) })
      
      // Invalidar para sincronizar
      queryClient.invalidateQueries({ queryKey: sessionsKeys.all })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: sessionsKeys.all })
    },
  })
}

// =====================================================
// HOOKS DE CONVENIENCIA
// =====================================================

// Hook para prefetch de sesiones
export function usePrefetchSessions() {
  const queryClient = useQueryClient()
  const sessionsApi = useSessionsApi()
  
  return {
    prefetchSessions: (filters?: Record<string, unknown>) => {
      queryClient.prefetchQuery({
        queryKey: sessionsKeys.list(filters || {}),
        queryFn: () => sessionsApi.getSessions(filters),
        staleTime: 2 * 60 * 1000,
      })
    },
    prefetchSession: (id: string) => {
      queryClient.prefetchQuery({
        queryKey: sessionsKeys.detail(id),
        queryFn: () => sessionsApi.getSession(id),
        staleTime: 5 * 60 * 1000,
      })
    }
  }
}

// Hook para invalidar cache
export function useInvalidateSessions() {
  const queryClient = useQueryClient()
  
  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: sessionsKeys.all })
    },
    invalidateList: (filters?: Record<string, unknown>) => {
      queryClient.invalidateQueries({ queryKey: sessionsKeys.list(filters || {}) })
    },
    invalidateDetail: (id: string) => {
      queryClient.invalidateQueries({ queryKey: sessionsKeys.detail(id) })
    },
    invalidateStats: (filters?: Record<string, unknown>) => {
      queryClient.invalidateQueries({ queryKey: sessionsKeys.statsWithFilters(filters || {}) })
    }
  }
}
