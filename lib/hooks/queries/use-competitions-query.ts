import { Competition } from '@/lib/actions/competitions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// =====================================================
// QUERY KEYS
// =====================================================

export const competitionsKeys = {
  all: ['competitions'] as const,
  lists: () => [...competitionsKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...competitionsKeys.lists(), filters] as const,
  details: () => [...competitionsKeys.all, 'detail'] as const,
  detail: (id: string) => [...competitionsKeys.details(), id] as const,
  main: () => [...competitionsKeys.all, 'main'] as const,
  upcoming: (limit: number) =>
    [...competitionsKeys.all, 'upcoming', limit] as const,
  byPriority: (priority: string) =>
    [...competitionsKeys.all, 'priority', priority] as const,
};

// =====================================================
// QUERIES
// =====================================================

// Hook para obtener todas las competencias
export function useCompetitionsQuery() {
  return useQuery({
    queryKey: competitionsKeys.lists(),
    queryFn: async () => {
      const response = await fetch('/api/competitions');
      if (!response.ok) throw new Error('Failed to fetch competitions');
      return response.json() as Promise<Competition[]>;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

// Hook para obtener una competencia específica
export function useCompetitionQuery(id: string) {
  return useQuery({
    queryKey: competitionsKeys.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/competitions/${id}`);
      if (!response.ok) throw new Error('Failed to fetch competition');
      return response.json() as Promise<Competition>;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para obtener competencia principal
export function useMainCompetitionQuery() {
  return useQuery({
    queryKey: competitionsKeys.main(),
    queryFn: async () => {
      const response = await fetch('/api/competitions/main');
      if (!response.ok) throw new Error('Failed to fetch main competition');
      return response.json() as Promise<Competition | null>;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para obtener competencias próximas
export function useUpcomingCompetitionsQuery(limit: number = 5) {
  return useQuery({
    queryKey: competitionsKeys.upcoming(limit),
    queryFn: async () => {
      const response = await fetch(`/api/competitions/upcoming?limit=${limit}`);
      if (!response.ok)
        throw new Error('Failed to fetch upcoming competitions');
      return response.json() as Promise<Competition[]>;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

// Hook para obtener competencias por prioridad
export function useCompetitionsByPriorityQuery(
  priority: 'low' | 'medium' | 'high'
) {
  return useQuery({
    queryKey: competitionsKeys.byPriority(priority),
    queryFn: async () => {
      const response = await fetch(`/api/competitions/priority/${priority}`);
      if (!response.ok)
        throw new Error('Failed to fetch competitions by priority');
      return response.json() as Promise<Competition[]>;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

// =====================================================
// MUTATIONS CON OPTIMISTIC UPDATES
// =====================================================

// Hook para crear competencia
export function useCreateCompetitionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      competitionData: Omit<
        Competition,
        'id' | 'created_at' | 'updated_at' | 'user_id'
      >
    ) => {
      const response = await fetch('/api/competitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(competitionData),
      });
      if (!response.ok) throw new Error('Failed to create competition');
      return response.json() as Promise<Competition>;
    },
    onMutate: async newCompetition => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: competitionsKeys.all });

      // Snapshot del estado anterior
      const previousCompetitions = queryClient.getQueriesData({
        queryKey: competitionsKeys.all,
      });

      // Crear competencia optimista temporal
      const optimisticCompetition: Competition = {
        ...newCompetition,
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'current-user', // Se actualizará con el ID real del usuario
      };

      // Actualizar cache optimistamente
      queryClient.setQueriesData(
        { queryKey: competitionsKeys.lists() },
        (old: Competition[] | undefined) => {
          if (!old) return [optimisticCompetition];
          return [optimisticCompetition, ...old];
        }
      );

      // Actualizar competencia principal si es de alta prioridad
      if (newCompetition.priority === 'high') {
        queryClient.setQueryData(
          competitionsKeys.main(),
          (old: Competition | null) => {
            if (!old || new Date(newCompetition.date) < new Date(old.date)) {
              return optimisticCompetition;
            }
            return old;
          }
        );
      }

      // Actualizar competencias próximas
      queryClient.setQueriesData(
        { queryKey: competitionsKeys.upcoming(5) },
        (old: Competition[] | undefined) => {
          if (!old) return [optimisticCompetition];
          const futureDate = new Date(newCompetition.date);
          const now = new Date();
          if (futureDate >= now) {
            return [optimisticCompetition, ...old].slice(0, 5);
          }
          return old;
        }
      );

      // Actualizar competencias por prioridad
      queryClient.setQueriesData(
        { queryKey: competitionsKeys.byPriority(newCompetition.priority) },
        (old: Competition[] | undefined) => {
          if (!old) return [optimisticCompetition];
          return [optimisticCompetition, ...old];
        }
      );

      return { previousCompetitions, optimisticCompetition };
    },
    onError: (error, newCompetition, context) => {
      // Rollback en caso de error
      if (context?.previousCompetitions) {
        context.previousCompetitions.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error('Error creating competition:', error);
    },
    onSuccess: (data, variables, context) => {
      // Actualizar con datos reales del servidor
      queryClient.setQueriesData(
        { queryKey: competitionsKeys.lists() },
        (old: Competition[] | undefined) => {
          if (!old) return [data];
          return old.map(competition =>
            competition.id === context?.optimisticCompetition.id
              ? data
              : competition
          );
        }
      );

      // Actualizar otras queries con datos reales
      queryClient.setQueryData(competitionsKeys.detail(data.id), data);

      // Invalidar para sincronizar
      queryClient.invalidateQueries({ queryKey: competitionsKeys.all });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: competitionsKeys.all });
    },
  });
}

// Hook para actualizar competencia
export function useUpdateCompetitionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Competition>;
    }) => {
      const response = await fetch(`/api/competitions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update competition');
      return response.json() as Promise<Competition>;
    },
    onMutate: async ({ id, updates }) => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: competitionsKeys.all });

      // Snapshot del estado anterior
      const previousCompetitions = queryClient.getQueriesData({
        queryKey: competitionsKeys.all,
      });

      // Actualizar optimistamente
      queryClient.setQueriesData(
        { queryKey: competitionsKeys.lists() },
        (old: Competition[] | undefined) => {
          if (!old) return old;
          return old.map(competition =>
            competition.id === id
              ? {
                  ...competition,
                  ...updates,
                  updated_at: new Date().toISOString(),
                }
              : competition
          );
        }
      );

      // Actualizar query de detalle
      queryClient.setQueryData(
        competitionsKeys.detail(id),
        (old: Competition | undefined) => {
          if (!old) return old;
          return { ...old, ...updates, updated_at: new Date().toISOString() };
        }
      );

      // Actualizar competencia principal si es relevante
      queryClient.setQueryData(
        competitionsKeys.main(),
        (old: Competition | null) => {
          if (!old || old.id !== id) return old;
          return { ...old, ...updates, updated_at: new Date().toISOString() };
        }
      );

      return { previousCompetitions, competitionId: id };
    },
    onError: (error, variables, context) => {
      // Rollback en caso de error
      if (context?.previousCompetitions) {
        context.previousCompetitions.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error('Error updating competition:', error);
    },
    onSuccess: (data, variables, context) => {
      // Actualizar con datos reales del servidor
      queryClient.setQueriesData(
        { queryKey: competitionsKeys.lists() },
        (old: Competition[] | undefined) => {
          if (!old) return old;
          return old.map(competition =>
            competition.id === variables.id ? data : competition
          );
        }
      );

      // Actualizar query de detalle
      queryClient.setQueryData(competitionsKeys.detail(variables.id), data);

      // Invalidar para sincronizar
      queryClient.invalidateQueries({ queryKey: competitionsKeys.all });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: competitionsKeys.all });
    },
  });
}

// Hook para eliminar competencia
export function useDeleteCompetitionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/competitions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete competition');
      return { id };
    },
    onMutate: async id => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: competitionsKeys.all });

      // Snapshot del estado anterior
      const previousCompetitions = queryClient.getQueriesData({
        queryKey: competitionsKeys.all,
      });

      // Eliminar optimistamente de las listas
      queryClient.setQueriesData(
        { queryKey: competitionsKeys.lists() },
        (old: Competition[] | undefined) => {
          if (!old) return old;
          return old.filter(competition => competition.id !== id);
        }
      );

      // Marcar como eliminado en la query de detalle
      queryClient.setQueryData(
        competitionsKeys.detail(id),
        (old: Competition | undefined) => {
          if (!old) return old;
          return {
            ...old,
            deleted: true,
            updated_at: new Date().toISOString(),
          };
        }
      );

      // Actualizar competencia principal si era la principal
      queryClient.setQueryData(
        competitionsKeys.main(),
        (old: Competition | null) => {
          if (!old || old.id !== id) return old;
          return null;
        }
      );

      return { previousCompetitions, competitionId: id };
    },
    onError: (error, id, context) => {
      // Rollback en caso de error
      if (context?.previousCompetitions) {
        context.previousCompetitions.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error('Error deleting competition:', error);
    },
    onSuccess: (data, id, context) => {
      // Eliminar completamente de las queries
      queryClient.removeQueries({ queryKey: competitionsKeys.detail(id) });

      // Invalidar para sincronizar
      queryClient.invalidateQueries({ queryKey: competitionsKeys.all });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: competitionsKeys.all });
    },
  });
}

// =====================================================
// HOOKS DE CONVENIENCIA
// =====================================================

// Hook para prefetch de competencias
export function usePrefetchCompetitions() {
  const queryClient = useQueryClient();

  return {
    prefetchCompetitions: () => {
      queryClient.prefetchQuery({
        queryKey: competitionsKeys.lists(),
        queryFn: async () => {
          const response = await fetch('/api/competitions');
          if (!response.ok) throw new Error('Failed to fetch competitions');
          return response.json() as Promise<Competition[]>;
        },
        staleTime: 2 * 60 * 1000,
      });
    },
    prefetchCompetition: (id: string) => {
      queryClient.prefetchQuery({
        queryKey: competitionsKeys.detail(id),
        queryFn: async () => {
          const response = await fetch(`/api/competitions/${id}`);
          if (!response.ok) throw new Error('Failed to fetch competition');
          return response.json() as Promise<Competition>;
        },
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}

// Hook para invalidar cache
export function useInvalidateCompetitions() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: competitionsKeys.all });
    },
    invalidateList: () => {
      queryClient.invalidateQueries({ queryKey: competitionsKeys.lists() });
    },
    invalidateDetail: (id: string) => {
      queryClient.invalidateQueries({ queryKey: competitionsKeys.detail(id) });
    },
    invalidateMain: () => {
      queryClient.invalidateQueries({ queryKey: competitionsKeys.main() });
    },
    invalidateUpcoming: (limit: number = 5) => {
      queryClient.invalidateQueries({
        queryKey: competitionsKeys.upcoming(limit),
      });
    },
    invalidateByPriority: (priority: string) => {
      queryClient.invalidateQueries({
        queryKey: competitionsKeys.byPriority(priority),
      });
    },
  };
}
