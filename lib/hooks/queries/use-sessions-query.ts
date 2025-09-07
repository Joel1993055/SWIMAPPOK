import { useSessionsApi } from '@/lib/services/sessions-api'
import { Session } from '@/lib/types/entities'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// =====================================================
// QUERY KEYS
// =====================================================

export const sessionsKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionsKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...sessionsKeys.lists(), filters] as const,
  details: () => [...sessionsKeys.all, 'detail'] as const,
  detail: (id: string) => [...sessionsKeys.details(), id] as const,
  stats: () => [...sessionsKeys.all, 'stats'] as const,
  statsWithFilters: (filters: Record<string, any>) => [...sessionsKeys.stats(), filters] as const,
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
    onSuccess: () => {
      // Invalidar todas las queries de sesiones
      queryClient.invalidateQueries({ queryKey: sessionsKeys.all })
    },
    onError: (error) => {
      console.error('Error creating session:', error)
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
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: sessionsKeys.all })
      queryClient.invalidateQueries({ queryKey: sessionsKeys.detail(variables.id) })
    },
    onError: (error) => {
      console.error('Error updating session:', error)
    },
  })
}

// Hook para eliminar sesión
export function useDeleteSessionMutation() {
  const api = useSessionsApi()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => api.deleteSession(id),
    onSuccess: (data, id) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: sessionsKeys.all })
      queryClient.removeQueries({ queryKey: sessionsKeys.detail(id) })
    },
    onError: (error) => {
      console.error('Error deleting session:', error)
    },
  })
}

// =====================================================
// HOOKS DE CONVENIENCIA
// =====================================================

// Hook para prefetch de sesiones
export function usePrefetchSessions() {
  const queryClient = useQueryClient()
  
  return {
    prefetchSessions: (filters?: Record<string, any>) => {
      queryClient.prefetchQuery({
        queryKey: sessionsKeys.list(filters || {}),
        queryFn: () => useSessionsApi().getSessions(filters),
        staleTime: 2 * 60 * 1000,
      })
    },
    prefetchSession: (id: string) => {
      queryClient.prefetchQuery({
        queryKey: sessionsKeys.detail(id),
        queryFn: () => useSessionsApi().getSession(id),
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
    invalidateList: (filters?: Record<string, any>) => {
      queryClient.invalidateQueries({ queryKey: sessionsKeys.list(filters || {}) })
    },
    invalidateDetail: (id: string) => {
      queryClient.invalidateQueries({ queryKey: sessionsKeys.detail(id) })
    },
    invalidateStats: (filters?: Record<string, any>) => {
      queryClient.invalidateQueries({ queryKey: sessionsKeys.statsWithFilters(filters || {}) })
    }
  }
}
