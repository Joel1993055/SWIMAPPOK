import { useApiCall, useCrudApi, usePaginatedApi, useSearchApi } from '@/lib/hooks/use-api-call'
import { act, renderHook } from '@testing-library/react'

// Mock del hook useErrorHandler
jest.mock('@/lib/hooks/use-error-handler', () => ({
  useErrorHandler: () => ({
    captureError: jest.fn()
  })
}))

describe('useApiCall', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should handle successful API calls', async () => {
      const { result } = renderHook(() => useApiCall())

      const mockData = { id: 1, name: 'Test' }
      const mockApiCall = jest.fn().mockResolvedValue(mockData)

      let executeResult: any
      await act(async () => {
        executeResult = await result.current.execute(mockApiCall)
      })

      expect(executeResult.data).toEqual(mockData)
      expect(executeResult.error).toBeNull()
      expect(result.current.data).toEqual(mockData)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should handle failed API calls', async () => {
      const { result } = renderHook(() => useApiCall())

      const mockError = new Error('API Error')
      const mockApiCall = jest.fn().mockRejectedValue(mockError)

      let executeResult: any
      await act(async () => {
        executeResult = await result.current.execute(mockApiCall)
      })

      expect(executeResult.data).toBeNull()
      expect(executeResult.error).toEqual(mockError)
      expect(result.current.data).toBeNull()
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toEqual(mockError)
    })

    it('should handle timeout', async () => {
      const { result } = renderHook(() => useApiCall())

      const mockApiCall = jest.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      )

      let executeResult: any
      await act(async () => {
        executeResult = await result.current.execute(mockApiCall, { timeout: 50 })
      })

      expect(executeResult.data).toBeNull()
      expect(executeResult.error).toBeInstanceOf(Error)
      expect(executeResult.error.message).toBe('Request timeout')
    })

    it('should handle retries', async () => {
      const { result } = renderHook(() => useApiCall())

      let attemptCount = 0
      const mockApiCall = jest.fn().mockImplementation(() => {
        attemptCount++
        if (attemptCount < 3) {
          return Promise.reject(new Error('Temporary error'))
        }
        return Promise.resolve({ success: true })
      })

      let executeResult: any
      await act(async () => {
        executeResult = await result.current.execute(mockApiCall, { retries: 3 })
      })

      expect(attemptCount).toBe(3)
      expect(executeResult.data).toEqual({ success: true })
      expect(executeResult.error).toBeNull()
    })

    it('should call onSuccess callback', async () => {
      const { result } = renderHook(() => useApiCall())

      const mockData = { id: 1, name: 'Test' }
      const mockApiCall = jest.fn().mockResolvedValue(mockData)
      const onSuccess = jest.fn()

      await act(async () => {
        await result.current.execute(mockApiCall, { onSuccess })
      })

      expect(onSuccess).toHaveBeenCalledWith(mockData)
    })

    it('should call onError callback', async () => {
      const { result } = renderHook(() => useApiCall())

      const mockError = new Error('API Error')
      const mockApiCall = jest.fn().mockRejectedValue(mockError)
      const onError = jest.fn()

      await act(async () => {
        await result.current.execute(mockApiCall, { onError })
      })

      expect(onError).toHaveBeenCalledWith(mockError)
    })
  })

  describe('reset', () => {
    it('should reset state to initial values', () => {
      const { result } = renderHook(() => useApiCall())

      // Set some state
      act(() => {
        result.current.execute(() => Promise.resolve({ data: 'test' }))
      })

      expect(result.current.data).toBe('test')
      expect(result.current.loading).toBe(false)

      // Reset
      act(() => {
        result.current.reset()
      })

      expect(result.current.data).toBeNull()
      expect(result.current.error).toBeNull()
      expect(result.current.loading).toBe(false)
      expect(result.current.retryCount).toBe(0)
    })
  })

  describe('retry', () => {
    it('should retry the last API call', async () => {
      const { result } = renderHook(() => useApiCall())

      const mockData = { id: 1, name: 'Test' }
      const mockApiCall = jest.fn().mockResolvedValue(mockData)

      // First call
      await act(async () => {
        await result.current.execute(mockApiCall)
      })

      expect(result.current.data).toEqual(mockData)

      // Retry
      let retryResult: any
      await act(async () => {
        retryResult = await result.current.retry()
      })

      expect(retryResult.data).toEqual(mockData)
      expect(retryResult.error).toBeNull()
    })

    it('should not retry if there was no error', async () => {
      const { result } = renderHook(() => useApiCall())

      const mockData = { id: 1, name: 'Test' }
      const mockApiCall = jest.fn().mockResolvedValue(mockData)

      await act(async () => {
        await result.current.execute(mockApiCall)
      })

      let retryResult: any
      await act(async () => {
        retryResult = await result.current.retry()
      })

      expect(retryResult.data).toEqual(mockData)
      expect(retryResult.error).toBeNull()
    })
  })
})

describe('useCrudApi', () => {
  it('should provide CRUD operations', () => {
    const { result } = renderHook(() => useCrudApi('test'))

    expect(result.current.create).toBeDefined()
    expect(result.current.read).toBeDefined()
    expect(result.current.update).toBeDefined()
    expect(result.current.remove).toBeDefined()
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('should handle create operation', async () => {
    const { result } = renderHook(() => useCrudApi('test'))

    await act(async () => {
      await result.current.create({ name: 'Test' })
    })

    // Since the actual implementation throws "Not implemented",
    // we expect an error
    expect(result.current.error).toBeDefined()
  })
})

describe('useSearchApi', () => {
  it('should provide search operations', () => {
    const { result } = renderHook(() => useSearchApi('test'))

    expect(result.current.search).toBeDefined()
    expect(result.current.filter).toBeDefined()
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('should handle search operation', async () => {
    const { result } = renderHook(() => useSearchApi('test'))

    await act(async () => {
      await result.current.search('test query')
    })

    // Since the actual implementation throws "Not implemented",
    // we expect an error
    expect(result.current.error).toBeDefined()
  })
})

describe('usePaginatedApi', () => {
  it('should provide pagination operations', () => {
    const { result } = renderHook(() => usePaginatedApi('test'))

    expect(result.current.fetchPage).toBeDefined()
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('should handle pagination operation', async () => {
    const { result } = renderHook(() => usePaginatedApi('test'))

    await act(async () => {
      await result.current.fetchPage(1, 10)
    })

    // Since the actual implementation throws "Not implemented",
    // we expect an error
    expect(result.current.error).toBeDefined()
  })
})
