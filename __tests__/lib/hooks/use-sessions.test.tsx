import { useSession, useSessions, useSessionsPagination, useSessionsStats } from '@/lib/hooks/use-sessions'
import { renderHook, waitFor } from '@testing-library/react'

// Mock de los stores
jest.mock('@/lib/store/normalized/sessions', () => ({
  useSessionsStore: () => ({
    sessions: {
      byId: {},
      allIds: [],
      byDate: {},
      byPhase: {},
      byCompetition: {}
    },
    isLoading: false,
    error: null,
    lastFetch: null,
    setSessions: jest.fn(),
    addSession: jest.fn(),
    updateSession: jest.fn(),
    deleteSession: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    clearSessions: jest.fn(),
    getSession: jest.fn(),
    getSessionsByDate: jest.fn(),
    getSessionsByPhase: jest.fn(),
    getSessionsByCompetition: jest.fn(),
    getSessionsByRange: jest.fn(),
    getAllSessions: jest.fn(),
    getTotalDistance: jest.fn(),
    getTotalDuration: jest.fn(),
    getAverageRPE: jest.fn()
  })
}))

// Mock de los servicios API
jest.mock('@/lib/services/sessions-api', () => ({
  useSessionsApi: () => ({
    createSession: jest.fn(),
    getSession: jest.fn(),
    getSessions: jest.fn(),
    updateSession: jest.fn(),
    deleteSession: jest.fn(),
    getSessionsPaginated: jest.fn(),
    searchSessions: jest.fn(),
    getSessionsStats: jest.fn()
  })
}))

// Mock del hook useApiCall
jest.mock('@/lib/hooks/use-api-call', () => ({
  useApiCall: () => ({
    execute: jest.fn(),
    loading: false,
    error: null,
    data: null,
    reset: jest.fn(),
    retry: jest.fn()
  })
}))

// Mock de useErrorHandler
jest.mock('@/lib/hooks/use-error-handler', () => ({
  useErrorHandler: () => ({
    captureError: jest.fn()
  })
}))

describe('useSessions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return sessions state and actions', () => {
    const { result } = renderHook(() => useSessions())

    expect(result.current.sessions).toBeDefined()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.loadSessions).toBeDefined()
    expect(result.current.createSession).toBeDefined()
    expect(result.current.updateSession).toBeDefined()
    expect(result.current.deleteSession).toBeDefined()
    expect(result.current.searchSessions).toBeDefined()
  })

  it('should provide store selectors', () => {
    const { result } = renderHook(() => useSessions())

    expect(result.current.getSession).toBeDefined()
    expect(result.current.getSessionsByDate).toBeDefined()
    expect(result.current.getSessionsByPhase).toBeDefined()
    expect(result.current.getSessionsByCompetition).toBeDefined()
    expect(result.current.getSessionsByRange).toBeDefined()
    expect(result.current.getTotalDistance).toBeDefined()
    expect(result.current.getTotalDuration).toBeDefined()
    expect(result.current.getAverageRPE).toBeDefined()
  })

  it('should provide store actions', () => {
    const { result } = renderHook(() => useSessions())

    expect(result.current.clearSessions).toBeDefined()
    expect(result.current.setError).toBeDefined()
  })
})

describe('useSessionsPagination', () => {
  it('should return pagination state and actions', () => {
    const { result } = renderHook(() => useSessionsPagination(10))

    expect(result.current.loadPage).toBeDefined()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.hasMore).toBe(false)
  })

  it('should use the provided limit', () => {
    const { result } = renderHook(() => useSessionsPagination(20))

    expect(result.current.loadPage).toBeDefined()
  })
})

describe('useSessionsStats', () => {
  it('should return stats state and actions', () => {
    const { result } = renderHook(() => useSessionsStats())

    expect(result.current.loadStats).toBeDefined()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })
})

describe('useSession', () => {
  it('should return session state and actions for specific session', () => {
    const { result } = renderHook(() => useSession('session-1'))

    expect(result.current.session).toBeDefined()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.loadSession).toBeDefined()
    expect(result.current.updateSession).toBeDefined()
    expect(result.current.deleteSession).toBeDefined()
  })
})

// Tests de integración más realistas
describe('useSessions Integration', () => {
  let mockStore: any
  let mockApi: any
  let mockApiCall: any

  beforeEach(() => {
    mockStore = {
      sessions: {
        byId: {},
        allIds: [],
        byDate: {},
        byPhase: {},
        byCompetition: {}
      },
      isLoading: false,
      error: null,
      setSessions: jest.fn(),
      addSession: jest.fn(),
      updateSession: jest.fn(),
      deleteSession: jest.fn(),
      setError: jest.fn(),
      getSession: jest.fn(),
      getSessionsByDate: jest.fn(),
      getSessionsByPhase: jest.fn(),
      getSessionsByCompetition: jest.fn(),
      getSessionsByRange: jest.fn(),
      getAllSessions: jest.fn(),
      getTotalDistance: jest.fn(),
      getTotalDuration: jest.fn(),
      getAverageRPE: jest.fn()
    }

    mockApi = {
      createSession: jest.fn(),
      getSession: jest.fn(),
      getSessions: jest.fn(),
      updateSession: jest.fn(),
      deleteSession: jest.fn(),
      getSessionsPaginated: jest.fn(),
      searchSessions: jest.fn(),
      getSessionsStats: jest.fn()
    }

    mockApiCall = {
      execute: jest.fn(),
      loading: false,
      error: null,
      data: null,
      reset: jest.fn(),
      retry: jest.fn()
    }

    // Mock the modules
    jest.doMock('@/lib/store/normalized/sessions', () => ({
      useSessionsStore: () => mockStore
    }))

    jest.doMock('@/lib/services/sessions-api', () => ({
      useSessionsApi: () => mockApi
    }))

    jest.doMock('@/lib/hooks/use-api-call', () => ({
      useApiCall: () => mockApiCall
    }))
  })

  it('should call loadSessions when sessions array is empty', async () => {
    mockStore.sessions.allIds = []
    mockApiCall.execute.mockResolvedValue({ data: [], error: null })

    const { result } = renderHook(() => useSessions())

    await waitFor(() => {
      expect(mockApiCall.execute).toHaveBeenCalled()
    })
  })

  it('should not call loadSessions when sessions array is not empty', async () => {
    mockStore.sessions.allIds = ['session-1']
    mockApiCall.execute.mockResolvedValue({ data: [], error: null })

    const { result } = renderHook(() => useSessions())

    await waitFor(() => {
      expect(mockApiCall.execute).not.toHaveBeenCalled()
    })
  })

  it('should call loadSessions when loading is false', async () => {
    mockStore.sessions.allIds = []
    mockApiCall.loading = false
    mockApiCall.execute.mockResolvedValue({ data: [], error: null })

    const { result } = renderHook(() => useSessions())

    await waitFor(() => {
      expect(mockApiCall.execute).toHaveBeenCalled()
    })
  })

  it('should not call loadSessions when loading is true', async () => {
    mockStore.sessions.allIds = []
    mockApiCall.loading = true
    mockApiCall.execute.mockResolvedValue({ data: [], error: null })

    const { result } = renderHook(() => useSessions())

    await waitFor(() => {
      expect(mockApiCall.execute).not.toHaveBeenCalled()
    })
  })
})
