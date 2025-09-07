import { useSessionsStore } from '@/lib/store/normalized/sessions'
import { Session } from '@/lib/types/entities'
import { act, renderHook } from '@testing-library/react'

// Mock de datos de prueba
const mockSession: Session = {
  id: 'session-1',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  user_id: 'user-1',
  name: 'Test Session',
  date: '2024-01-01',
  duration_minutes: 60,
  distance_meters: 2000,
  stroke_type: 'freestyle',
  session_type: 'aerobic',
  main_set: '4x500m @ 80%',
  rpe: 7,
  notes: 'Test session',
  training_phase_id: 'phase-1',
  competition_id: 'comp-1',
  pool_type: 'indoor',
  water_temperature: 25
}

const mockSessions: Session[] = [
  mockSession,
  {
    ...mockSession,
    id: 'session-2',
    name: 'Test Session 2',
    date: '2024-01-02',
    distance_meters: 1500,
    stroke_type: 'backstroke'
  }
]

describe('SessionsStore Normalized', () => {
  beforeEach(() => {
    // Limpiar el store antes de cada test
    act(() => {
      useSessionsStore.getState().clearSessions()
    })
  })

  describe('setSessions', () => {
    it('should normalize and store sessions correctly', () => {
      const { result } = renderHook(() => useSessionsStore())

      act(() => {
        result.current.setSessions(mockSessions)
      })

      expect(result.current.sessions.allIds).toHaveLength(2)
      expect(result.current.sessions.byId['session-1']).toEqual(mockSession)
      expect(result.current.sessions.byId['session-2']).toEqual(mockSessions[1])
    })

    it('should index sessions by date correctly', () => {
      const { result } = renderHook(() => useSessionsStore())

      act(() => {
        result.current.setSessions(mockSessions)
      })

      expect(result.current.sessions.byDate['2024-01-01']).toContain('session-1')
      expect(result.current.sessions.byDate['2024-01-02']).toContain('session-2')
    })

    it('should index sessions by training phase correctly', () => {
      const { result } = renderHook(() => useSessionsStore())

      act(() => {
        result.current.setSessions(mockSessions)
      })

      expect(result.current.sessions.byPhase['phase-1']).toContain('session-1')
      expect(result.current.sessions.byPhase['phase-1']).toContain('session-2')
    })

    it('should index sessions by competition correctly', () => {
      const { result } = renderHook(() => useSessionsStore())

      act(() => {
        result.current.setSessions(mockSessions)
      })

      expect(result.current.sessions.byCompetition['comp-1']).toContain('session-1')
      expect(result.current.sessions.byCompetition['comp-1']).toContain('session-2')
    })
  })

  describe('addSession', () => {
    it('should add a new session to the store', () => {
      const { result } = renderHook(() => useSessionsStore())

      act(() => {
        result.current.addSession(mockSession)
      })

      expect(result.current.sessions.allIds).toContain('session-1')
      expect(result.current.sessions.byId['session-1']).toEqual(mockSession)
    })

    it('should update indexes when adding a session', () => {
      const { result } = renderHook(() => useSessionsStore())

      act(() => {
        result.current.addSession(mockSession)
      })

      expect(result.current.sessions.byDate['2024-01-01']).toContain('session-1')
      expect(result.current.sessions.byPhase['phase-1']).toContain('session-1')
      expect(result.current.sessions.byCompetition['comp-1']).toContain('session-1')
    })
  })

  describe('updateSession', () => {
    it('should update an existing session', () => {
      const { result } = renderHook(() => useSessionsStore())

      act(() => {
        result.current.setSessions([mockSession])
        result.current.updateSession('session-1', { name: 'Updated Session' })
      })

      expect(result.current.sessions.byId['session-1'].name).toBe('Updated Session')
    })

    it('should not update non-existent session', () => {
      const { result } = renderHook(() => useSessionsStore())

      act(() => {
        result.current.setSessions([mockSession])
        result.current.updateSession('non-existent', { name: 'Updated Session' })
      })

      expect(result.current.sessions.byId['session-1'].name).toBe('Test Session')
    })
  })

  describe('deleteSession', () => {
    it('should delete a session from the store', () => {
      const { result } = renderHook(() => useSessionsStore())

      act(() => {
        result.current.setSessions(mockSessions)
        result.current.deleteSession('session-1')
      })

      expect(result.current.sessions.allIds).not.toContain('session-1')
      expect(result.current.sessions.byId['session-1']).toBeUndefined()
    })

    it('should update indexes when deleting a session', () => {
      const { result } = renderHook(() => useSessionsStore())

      act(() => {
        result.current.setSessions(mockSessions)
        result.current.deleteSession('session-1')
      })

      // Verificar que los índices se actualicen correctamente
      expect(result.current.sessions.byDate['2024-01-01']).not.toContain('session-1')
      expect(result.current.sessions.byPhase['phase-1']).not.toContain('session-1')
      expect(result.current.sessions.byCompetition['comp-1']).not.toContain('session-1')
    })
  })

  describe('selectors', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useSessionsStore())
      act(() => {
        result.current.setSessions(mockSessions)
      })
    })

    it('should get session by id', () => {
      const { result } = renderHook(() => useSessionsStore())

      const session = result.current.getSession('session-1')
      expect(session).toEqual(mockSession)

      const nonExistent = result.current.getSession('non-existent')
      expect(nonExistent).toBeNull()
    })

    it('should get sessions by date', () => {
      const { result } = renderHook(() => useSessionsStore())

      const sessionsByDate = result.current.getSessionsByDate('2024-01-01')
      expect(sessionsByDate).toHaveLength(1)
      expect(sessionsByDate[0]).toEqual(mockSession)

      const emptySessions = result.current.getSessionsByDate('2024-01-03')
      expect(emptySessions).toHaveLength(0)
    })

    it('should get sessions by phase', () => {
      const { result } = renderHook(() => useSessionsStore())

      const sessionsByPhase = result.current.getSessionsByPhase('phase-1')
      expect(sessionsByPhase).toHaveLength(2)

      const emptySessions = result.current.getSessionsByPhase('non-existent')
      expect(emptySessions).toHaveLength(0)
    })

    it('should get sessions by competition', () => {
      const { result } = renderHook(() => useSessionsStore())

      const sessionsByCompetition = result.current.getSessionsByCompetition('comp-1')
      expect(sessionsByCompetition).toHaveLength(2)

      const emptySessions = result.current.getSessionsByCompetition('non-existent')
      expect(emptySessions).toHaveLength(0)
    })

    it('should get sessions by date range', () => {
      const { result } = renderHook(() => useSessionsStore())

      const sessionsByRange = result.current.getSessionsByRange('2024-01-01', '2024-01-02')
      expect(sessionsByRange).toHaveLength(2)

      const emptySessions = result.current.getSessionsByRange('2024-01-03', '2024-01-04')
      expect(emptySessions).toHaveLength(0)
    })

    it('should get all sessions', () => {
      const { result } = renderHook(() => useSessionsStore())

      const allSessions = result.current.getAllSessions()
      expect(allSessions).toHaveLength(2)
      expect(allSessions).toEqual(mockSessions)
    })

    it('should calculate total distance', () => {
      const { result } = renderHook(() => useSessionsStore())

      const totalDistance = result.current.getTotalDistance()
      expect(totalDistance).toBe(3500) // 2000 + 1500
    })

    it('should calculate total duration', () => {
      const { result } = renderHook(() => useSessionsStore())

      const totalDuration = result.current.getTotalDuration()
      expect(totalDuration).toBe(120) // 60 + 60
    })

    it('should calculate average RPE', () => {
      const { result } = renderHook(() => useSessionsStore())

      const averageRPE = result.current.getAverageRPE()
      expect(averageRPE).toBe(7) // (7 + 7) / 2
    })
  })

  describe('error handling', () => {
    it('should handle setError correctly', () => {
      const { result } = renderHook(() => useSessionsStore())

      act(() => {
        result.current.setError('Test error')
      })

      expect(result.current.error).toBe('Test error')
    })

    it('should handle setLoading correctly', () => {
      const { result } = renderHook(() => useSessionsStore())

      act(() => {
        result.current.setLoading(true)
      })

      expect(result.current.isLoading).toBe(true)

      act(() => {
        result.current.setLoading(false)
      })

      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('clearSessions', () => {
    it('should clear all sessions and reset state', () => {
      const { result } = renderHook(() => useSessionsStore())

      act(() => {
        result.current.setSessions(mockSessions)
        result.current.setError('Test error')
        result.current.setLoading(true)
      })

      expect(result.current.sessions.allIds).toHaveLength(2)
      expect(result.current.error).toBe('Test error')
      expect(result.current.isLoading).toBe(true)

      act(() => {
        result.current.clearSessions()
      })

      expect(result.current.sessions.allIds).toHaveLength(0)
      expect(result.current.error).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })
  })
})