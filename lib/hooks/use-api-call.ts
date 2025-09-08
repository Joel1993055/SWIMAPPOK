import { useCallback, useState } from 'react'
import { useErrorHandler } from './use-error-handler'

// =====================================================
// TIPOS PARA API CALLS
// =====================================================
interface ApiCallOptions {
  retries?: number
  retryDelay?: number
  timeout?: number
  onSuccess?: (data: unknown) => void
  onError?: (error: Error) => void
}

interface ApiCallState<T> {
  data: T | null
  error: Error | null
  loading: boolean
  retryCount: number
}

interface ApiCallReturn<T> extends ApiCallState<T> {
  execute: (apiCall: () => Promise<T>, options?: ApiCallOptions) => Promise<{ data: T | null; error: Error | null }>
  reset: () => void
  retry: () => Promise<{ data: T | null; error: Error | null }>
}

// =====================================================
// HOOK PRINCIPAL
// =====================================================
export function useApiCall<T = unknown>(): ApiCallReturn<T> {
  const [state, setState] = useState<ApiCallState<T>>({
    data: null,
    error: null,
    loading: false,
    retryCount: 0
  })

  const { captureError } = useErrorHandler()

  const execute = useCallback(async (
    apiCall: () => Promise<T>,
    options: ApiCallOptions = {}
  ): Promise<{ data: T | null; error: Error | null }> => {
    const {
      retries = 3,
      retryDelay = 1000,
      timeout = 30000,
      onSuccess,
      onError
    } = options

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Timeout wrapper
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      })

      const result = await Promise.race([apiCall(), timeoutPromise])
      
      setState(prev => ({
        ...prev,
        data: result,
        loading: false,
        error: null,
        retryCount: 0
      }))

      onSuccess?.(result)
      return { data: result, error: null }

    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      
      setState(prev => ({
        ...prev,
        error: err,
        loading: false,
        retryCount: prev.retryCount + 1
      }))

      // Log error with context
      captureError(err, {
        component: 'useApiCall',
        action: 'execute',
        metadata: {
          retryCount: state.retryCount,
          retries,
          timeout
        }
      })

      onError?.(err)

      // Auto-retry logic
      if (state.retryCount < retries) {
        setTimeout(() => {
          execute(apiCall, options)
        }, retryDelay * Math.pow(2, state.retryCount)) // Exponential backoff
      }

      return { data: null, error: err }
    }
  }, [state.retryCount, captureError])

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      loading: false,
      retryCount: 0
    })
  }, [])

  const retry = useCallback(async (): Promise<{ data: T | null; error: Error | null }> => {
    if (!state.error) {
      return { data: state.data, error: null }
    }

    // Reset retry count and try again
    setState(prev => ({ ...prev, retryCount: 0 }))
    return execute(() => Promise.resolve(state.data as T))
  }, [state.error, state.data, execute])

  return {
    ...state,
    execute,
    reset,
    retry
  }
}

// =====================================================
// HOOKS ESPECÍFICOS PARA DIFERENTES TIPOS DE OPERACIONES
// =====================================================

// Hook para operaciones CRUD
export function useCrudApi<T extends { id: string }>(entityName: string) {
  const { data, error, loading, execute } = useApiCall<T[]>()

  const create = useCallback(async (item: Omit<T, 'id'>) => {
    return execute(async () => {
      // Implementar lógica de creación
      throw new Error('Not implemented')
    }, {
      onSuccess: () => {
        console.log(`${entityName} created successfully`)
      }
    })
  }, [execute, entityName])

  const read = useCallback(async (id?: string) => {
    return execute(async () => {
      // Implementar lógica de lectura
      throw new Error('Not implemented')
    })
  }, [execute])

  const update = useCallback(async (id: string, updates: Partial<T>) => {
    return execute(async () => {
      // Implementar lógica de actualización
      throw new Error('Not implemented')
    }, {
      onSuccess: () => {
        console.log(`${entityName} updated successfully`)
      }
    })
  }, [execute, entityName])

  const remove = useCallback(async (id: string) => {
    return execute(async () => {
      // Implementar lógica de eliminación
      throw new Error('Not implemented')
    }, {
      onSuccess: () => {
        console.log(`${entityName} deleted successfully`)
      }
    })
  }, [execute, entityName])

  return {
    data,
    error,
    loading,
    create,
    read,
    update,
    remove
  }
}

// Hook para operaciones de búsqueda y filtrado
export function useSearchApi<T>(entityName: string) {
  const { data, error, loading, execute } = useApiCall<T[]>()

  const search = useCallback(async (query: string, filters?: Record<string, unknown>) => {
    return execute(async () => {
      // Implementar lógica de búsqueda
      throw new Error('Not implemented')
    }, {
      onSuccess: () => {
        console.log(`Search completed for ${entityName}`)
      }
    })
  }, [execute, entityName])

  const filter = useCallback(async (filters: Record<string, unknown>) => {
    return execute(async () => {
      // Implementar lógica de filtrado
      throw new Error('Not implemented')
    })
  }, [execute])

  return {
    data,
    error,
    loading,
    search,
    filter
  }
}

// Hook para operaciones de paginación
export function usePaginatedApi<T>(entityName: string) {
  const { data, error, loading, execute } = useApiCall<{
    items: T[]
    total: number
    page: number
    limit: number
    hasMore: boolean
  }>()

  const fetchPage = useCallback(async (page: number, limit: number = 10) => {
    return execute(async () => {
      // Implementar lógica de paginación
      throw new Error('Not implemented')
    }, {
      onSuccess: () => {
        console.log(`Page ${page} loaded for ${entityName}`)
      }
    })
  }, [execute, entityName])

  return {
    data,
    error,
    loading,
    fetchPage
  }
}
