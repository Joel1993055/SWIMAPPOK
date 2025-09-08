import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

// =====================================================
// TIPOS GENÉRICOS
// =====================================================

export interface OptimisticUpdateConfig<TData, TVariables, TContext = unknown> {
  // Query keys a cancelar
  queryKeys: (string | number)[][]
  
  // Función para crear el snapshot del estado anterior
  getPreviousData: (queryClient: unknown) => TContext
  
  // Función para aplicar la actualización optimista
  applyOptimisticUpdate: (
    queryClient: unknown,
    variables: TVariables,
    context: TContext
  ) => void
  
  // Función para revertir en caso de error
  revertOnError?: (
    queryClient: unknown,
    context: TContext
  ) => void
  
  // Función para actualizar con datos reales del servidor
  updateWithServerData?: (
    queryClient: unknown,
    data: TData,
    variables: TVariables,
    context: TContext
  ) => void
}

// =====================================================
// HOOK GENÉRICO PARA OPTIMISTIC UPDATES
// =====================================================

export function useOptimisticMutation<TData, TVariables, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  config: OptimisticUpdateConfig<TData, TVariables, TContext>,
  options?: Omit<UseMutationOptions<TData, Error, TVariables, TContext>, 'mutationFn' | 'onMutate' | 'onError' | 'onSuccess' | 'onSettled'>
) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn,
    onMutate: useCallback(async (variables: TVariables) => {
      // Cancelar queries en progreso
      await Promise.all(
        config.queryKeys.map(queryKey => 
          queryClient.cancelQueries({ queryKey })
        )
      )
      
      // Crear snapshot del estado anterior
      const context = config.getPreviousData(queryClient)
      
      // Aplicar actualización optimista
      config.applyOptimisticUpdate(queryClient, variables, context)
      
      return context
    }, [queryClient, config]),
    
    onError: useCallback((error: Error, variables: TVariables, context: TContext) => {
      // Revertir en caso de error
      if (config.revertOnError) {
        config.revertOnError(queryClient, context)
      }
      
      console.error('Optimistic update failed:', error)
    }, [queryClient, config]),
    
    onSuccess: useCallback((data: TData, variables: TVariables, context: TContext) => {
      // Actualizar con datos reales del servidor
      if (config.updateWithServerData) {
        config.updateWithServerData(queryClient, data, variables, context)
      }
      
      // Invalidar queries para sincronizar
      config.queryKeys.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey })
      })
    }, [queryClient, config]),
    
    onSettled: useCallback(() => {
      // Siempre invalidar al final para asegurar consistencia
      config.queryKeys.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey })
      })
    }, [queryClient, config]),
    
    ...options,
  })
}

// =====================================================
// HELPERS ESPECÍFICOS PARA DIFERENTES TIPOS DE OPERACIONES
// =====================================================

// Helper para operaciones CRUD estándar
export function createCrudOptimisticConfig<T extends { id: string }>(
  entityName: string,
  queryKeys: {
    all: (string | number)[]
    lists: () => (string | number)[]
    detail: (id: string) => (string | number)[]
  }
) {
  return {
    // Configuración para CREATE
    create: (): OptimisticUpdateConfig<T, Omit<T, 'id' | 'created_at' | 'updated_at' | 'user_id'>> => ({
      queryKeys: [queryKeys.all],
      getPreviousData: (queryClient) => ({
        previousData: queryClient.getQueriesData({ queryKey: queryKeys.all })
      }),
      applyOptimisticUpdate: (queryClient, newItem, context) => {
        const optimisticItem: T = {
          ...newItem,
          id: `temp-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: 'current-user'
        } as T
        
        queryClient.setQueriesData(
          { queryKey: queryKeys.lists() },
          (old: T[] | undefined) => {
            if (!old) return [optimisticItem]
            return [optimisticItem, ...old]
          }
        )
      },
      revertOnError: (queryClient, context) => {
        if (context.previousData) {
          context.previousData.forEach(([queryKey, data]) => {
            queryClient.setQueryData(queryKey, data)
          })
        }
      },
      updateWithServerData: (queryClient, data, variables, context) => {
        queryClient.setQueriesData(
          { queryKey: queryKeys.lists() },
          (old: T[] | undefined) => {
            if (!old) return [data]
            return old.map(item => 
              item.id === context.optimisticItem?.id ? data : item
            )
          }
        )
        queryClient.setQueryData(queryKeys.detail(data.id), data)
      }
    }),
    
    // Configuración para UPDATE
    update: (): OptimisticUpdateConfig<T, { id: string; updates: Partial<T> }> => ({
      queryKeys: [queryKeys.all],
      getPreviousData: (queryClient) => ({
        previousData: queryClient.getQueriesData({ queryKey: queryKeys.all })
      }),
      applyOptimisticUpdate: (queryClient, { id, updates }, context) => {
        queryClient.setQueriesData(
          { queryKey: queryKeys.lists() },
          (old: T[] | undefined) => {
            if (!old) return old
            return old.map(item => 
              item.id === id 
                ? { ...item, ...updates, updated_at: new Date().toISOString() }
                : item
            )
          }
        )
        
        queryClient.setQueryData(
          queryKeys.detail(id),
          (old: T | undefined) => {
            if (!old) return old
            return { ...old, ...updates, updated_at: new Date().toISOString() }
          }
        )
      },
      revertOnError: (queryClient, context) => {
        if (context.previousData) {
          context.previousData.forEach(([queryKey, data]) => {
            queryClient.setQueryData(queryKey, data)
          })
        }
      },
      updateWithServerData: (queryClient, data, { id }, context) => {
        queryClient.setQueriesData(
          { queryKey: queryKeys.lists() },
          (old: T[] | undefined) => {
            if (!old) return old
            return old.map(item => 
              item.id === id ? data : item
            )
          }
        )
        queryClient.setQueryData(queryKeys.detail(id), data)
      }
    }),
    
    // Configuración para DELETE
    delete: (): OptimisticUpdateConfig<{ id: string }, string> => ({
      queryKeys: [queryKeys.all],
      getPreviousData: (queryClient) => ({
        previousData: queryClient.getQueriesData({ queryKey: queryKeys.all })
      }),
      applyOptimisticUpdate: (queryClient, id, context) => {
        queryClient.setQueriesData(
          { queryKey: queryKeys.lists() },
          (old: T[] | undefined) => {
            if (!old) return old
            return old.filter(item => item.id !== id)
          }
        )
        
        queryClient.setQueryData(
          queryKeys.detail(id),
          (old: T | undefined) => {
            if (!old) return old
            return { ...old, deleted: true, updated_at: new Date().toISOString() }
          }
        )
      },
      revertOnError: (queryClient, context) => {
        if (context.previousData) {
          context.previousData.forEach(([queryKey, data]) => {
            queryClient.setQueryData(queryKey, data)
          })
        }
      },
      updateWithServerData: (queryClient, data, id, context) => {
        queryClient.removeQueries({ queryKey: queryKeys.detail(id) })
      }
    })
  }
}

// =====================================================
// HOOKS DE CONVENIENCIA PARA OPERACIONES COMUNES
// =====================================================

// Hook para crear con optimistic update
export function useOptimisticCreate<T extends { id: string }>(
  mutationFn: (data: Omit<T, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<T>,
  queryKeys: {
    all: (string | number)[]
    lists: () => (string | number)[]
    detail: (id: string) => (string | number)[]
  }
) {
  const config = createCrudOptimisticConfig<T>(queryKeys)
  return useOptimisticMutation(mutationFn, config.create())
}

// Hook para actualizar con optimistic update
export function useOptimisticUpdate<T extends { id: string }>(
  mutationFn: (variables: { id: string; updates: Partial<T> }) => Promise<T>,
  queryKeys: {
    all: (string | number)[]
    lists: () => (string | number)[]
    detail: (id: string) => (string | number)[]
  }
) {
  const config = createCrudOptimisticConfig<T>(queryKeys)
  return useOptimisticMutation(mutationFn, config.update())
}

// Hook para eliminar con optimistic update
export function useOptimisticDelete<T extends { id: string }>(
  mutationFn: (id: string) => Promise<{ id: string }>,
  queryKeys: {
    all: (string | number)[]
    lists: () => (string | number)[]
    detail: (id: string) => (string | number)[]
  }
) {
  const config = createCrudOptimisticConfig<T>(queryKeys)
  return useOptimisticMutation(mutationFn, config.delete())
}
