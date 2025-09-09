import { useSessionsApi } from '@/lib/services/sessions-api';
import { Session } from '@/lib/types/entities';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// =====================================================
// QUERY KEYS
// =====================================================

export const sessionsKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionsKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...sessionsKeys.lists(), filters] as const,
  details: () => [...sessionsKeys.all, 'detail'] as const,
  detail: (_id: string) => [...sessionsKeys.details(), _id] as const,
  stats: () => [...sessionsKeys.all, 'stats'] as const,
  statsWithFilters: (filters: Record<string, unknown>) =>
    [...sessionsKeys.stats(), filters] as const,
};

// =====================================================
// QUERIES
// =====================================================

// Hook para obtener todas las sesiones
export function useSessionsQuery(filters?: {
  date?: string;
  startDate?: string;
  endDate?: string;
  training_phase__id?: string;
  competition__id?: string;
  stroke_type?: string;
  session_type?: string;
}) {
  const api = useSessionsApi();

  return useQuery({
    queryKey: sessionsKeys.list(filters || {}),
    queryFn: () => api.getSessions(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

// Hook para obtener una sesión específica
export function useSessionQuery(_id: string) {
  const api = useSessionsApi();

  return useQuery({
    queryKey: sessionsKeys.detail(_id),
    queryFn: () => api.getSession(_id),
    enabled: !!_id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para obtener sesiones paginadas
export function useSessionsPaginatedQuery(
  page: number,
  limit: number = 10,
  filters?: {
    startDate?: string;
    endDate?: string;
    training_phase__id?: string;
    competition__id?: string;
  }
) {
  const api = useSessionsApi();

  return useQuery({
    queryKey: [...sessionsKeys.lists(), 'paginated', { page, limit, filters }],
    queryFn: () => api.getSessionsPaginated(page, limit, filters),
    staleTime: 2 * 60 * 1000,
  });
}

// Hook para buscar sesiones
export function useSessionsSearchQuery(query: string) {
  const api = useSessionsApi();

  return useQuery({
    queryKey: [...sessionsKeys.lists(), 'search', query],
    queryFn: () => api.searchSessions(query),
    enabled: query.length > 2, // Solo buscar si hay al menos 3 caracteres
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
}

// Hook para estadísticas de sesiones
export function useSessionsStatsQuery(filters?: {
  startDate?: string;
  endDate?: string;
  training_phase__id?: string;
}) {
  const api = useSessionsApi();

  return useQuery({
    queryKey: sessionsKeys.statsWithFilters(filters || {}),
    queryFn: () => api.getSessionsStats(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// =====================================================
// MUTATIONS
// =====================================================

// Hook para crear sesión
export function useCreateSessionMutation() {
  const api = useSessionsApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      sessionData: Omit<
        Session,
        '_id' | 'created_at' | 'updated_at' | 'user__id'
      >
    ) => api.createSession(sessionData),
    onMutate: async _newSession => {
      // Cancelar queries en progreso para evitar conflictos
      await queryClient.cancelQueries({ queryKey: sessionsKeys.all });

      // Snapshot del estado anterior
      const previousSessions = queryClient.getQueriesData({
        queryKey: sessionsKeys.all,
      });

      // Crear sesión optimista temporal
      const optimisticSession: Session = {
        ..._newSession,
        _id: `temp-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user__id: 'current-user', // Se actualizará con el ID real del usuario
      };

      // Actualizar cache optimistamente
      queryClient.setQueriesData(
        { queryKey: sessionsKeys.lists() },
        (old: Session[] | undefined) => {
          if (!old) return [optimisticSession];
          return [optimisticSession, ...old];
        }
      );

      // Retornar _contexto para rollback
      return { previousSessions, optimisticSession };
    },
    onError: (error, _newSession) => {
      // Rollback en caso de error
      console.error('Error creating session:', error);
    },
    onSuccess: (data, _variables) => {
      // Actualizar con datos reales del servidor
      queryClient.setQueriesData(
        { queryKey: sessionsKeys.lists() },
        (old: Session[] | undefined) => {
          if (!old) return [data];
          return old.map(session => (session.id === data.id ? data : session));
        }
      );

      // Invalidar queries para sincronizar
      queryClient.invalidateQueries({ queryKey: sessionsKeys.all });
    },
    onSettled: () => {
      // Siempre inval_idar al final para asegurar consistencia
      queryClient.invalidateQueries({ queryKey: sessionsKeys.all });
    },
  });
}

// Hook para actualizar sesión
export function useUpdateSessionMutation() {
  const api = useSessionsApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      _id,
      updates,
    }: {
      _id: string;
      updates: Partial<Session>;
    }) => api.updateSession(_id, updates),
    onMutate: async ({ _id, updates }) => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: sessionsKeys.all });

      // Snapshot del estado anterior
      const previousSessions = queryClient.getQueriesData({
        queryKey: sessionsKeys.all,
      });

      // Actualizar optimistamente
      queryClient.setQueriesData(
        { queryKey: sessionsKeys.lists() },
        (old: Session[] | undefined) => {
          if (!old) return old;
          return old.map(session =>
            session._id === _id
              ? { ...session, ...updates, updated_at: new Date().toISOString() }
              : session
          );
        }
      );

      // Actualizar también la query de detalle
      queryClient.setQueryData(
        sessionsKeys.detail(_id),
        (old: Session | undefined) => {
          if (!old) return old;
          return { ...old, ...updates, updated_at: new Date().toISOString() };
        }
      );

      return { previousSessions, sessionId: _id };
    },
    onError: (error, _variables) => {
      // Rollback en caso de error
      console.error('Error updating session:', error);
    },
    onSuccess: (data, _variables) => {
      // Actualizar con datos reales del servidor
      queryClient.setQueriesData(
        { queryKey: sessionsKeys.lists() },
        (old: Session[] | undefined) => {
          if (!old) return old;
          return old.map(session =>
            session.id === _variables.id ? data : session
          );
        }
      );

      // Actualizar query de detalle
      queryClient.setQueryData(sessionsKeys.detail(_variables.id), data);

      // Inval_idar para sincronizar
      queryClient.invalidateQueries({ queryKey: sessionsKeys.all });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: sessionsKeys.all });
    },
  });
}

// Hook para eliminar sesión
export function useDeleteSessionMutation() {
  const api = useSessionsApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (_id: string) => api.deleteSession(_id),
    onMutate: async _id => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: sessionsKeys.all });

      // Snapshot del estado anterior
      const previousSessions = queryClient.getQueriesData({
        queryKey: sessionsKeys.all,
      });

      // Eliminar optimistamente de las listas
      queryClient.setQueriesData(
        { queryKey: sessionsKeys.lists() },
        (old: Session[] | undefined) => {
          if (!old) return old;
          return old.filter(session => session._id !== _id);
        }
      );

      // Marcar como eliminado en la query de detalle
      queryClient.setQueryData(
        sessionsKeys.detail(_id),
        (old: Session | undefined) => {
          if (!old) return old;
          return {
            ...old,
            deleted: true,
            updated_at: new Date().toISOString(),
          };
        }
      );

      return { previousSessions, sessionId: _id };
    },
    onError: (error, _id) => {
      // Rollback en caso de error
      console.error('Error deleting session:', error);
    },
    onSuccess: (data, _id) => {
      // Eliminar completamente de las queries
      queryClient.removeQueries({ queryKey: sessionsKeys.detail(_id) });

      // Invalidar para sincronizar
      queryClient.invalidateQueries({ queryKey: sessionsKeys.all });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: sessionsKeys.all });
    },
  });
}

// =====================================================
// HOOKS DE CONVENIENCIA
// =====================================================

// Hook para prefetch de sesiones
export function usePrefetchSessions() {
  const queryClient = useQueryClient();
  const sessionsApi = useSessionsApi();

  return {
    prefetchSessions: (filters?: Record<string, unknown>) => {
      queryClient.prefetchQuery({
        queryKey: sessionsKeys.list(filters || {}),
        queryFn: () => sessionsApi.getSessions(filters),
        staleTime: 2 * 60 * 1000,
      });
    },
    prefetchSession: (_id: string) => {
      queryClient.prefetchQuery({
        queryKey: sessionsKeys.detail(_id),
        queryFn: () => sessionsApi.getSession(_id),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}

// Hook para inval_idar cache
export function useInval_idateSessions() {
  const queryClient = useQueryClient();

  return {
    inval_idateAll: () => {
      queryClient.invalidateQueries({ queryKey: sessionsKeys.all });
    },
    inval_idateList: (filters?: Record<string, unknown>) => {
      queryClient.invalidateQueries({
        queryKey: sessionsKeys.list(filters || {}),
      });
    },
    inval_idateDetail: (_id: string) => {
      queryClient.invalidateQueries({ queryKey: sessionsKeys.detail(_id) });
    },
    inval_idateStats: (filters?: Record<string, unknown>) => {
      queryClient.invalidateQueries({
        queryKey: sessionsKeys.statsWithFilters(filters || {}),
      });
    },
  };
}
