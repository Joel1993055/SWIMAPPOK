// =====================================================
// HOOKS MIGRATION TESTS
// =====================================================

import { useSession, useSessions, useSessionsData } from '@/core/hooks/migration/use-sessions-adapter';
import { useNewSessionsStore } from '@/core/stores/entities/session';
import { useSessionsStoreBridge } from '@/core/stores/migration/sessions-bridge';
import { act, renderHook } from '@testing-library/react';

// Mock the migration bridge
jest.mock('@/core/stores/migration/sessions-bridge', () => ({
  useSessionsStoreBridge: jest.fn(() => ({
    isLoading: false,
    error: null,
    setLoading: jest.fn(),
    setError: jest.fn(),
    addSession: jest.fn(() => ({ success: true, error: null })),
    updateSession: jest.fn(() => ({ success: true, error: null })),
    deleteSession: jest.fn(() => ({ success: true, error: null })),
    clearEntities: jest.fn(),
  })),
}));

// Mock the new store
jest.mock('@/core/stores/entities/session', () => ({
  useNewSessionsStore: jest.fn(() => ({
    entities: {
      '1': {
        id: '1',
        date: '2024-01-01',
        swimmer: 'Test Swimmer',
        distance: 1000,
        stroke: 'freestyle',
        sessionType: 'aerobic',
        mainSet: 'Test Set',
        notes: 'Test notes',
        zoneVolumes: { z1: 100, z2: 200, z3: 300, z4: 200, z5: 200 },
        totalVolume: 1000,
        averageRPE: 7,
      },
    },
    ids: ['1'],
    getSessionsByDate: jest.fn(() => []),
    getSessionsByPhase: jest.fn(() => []),
    getSessionsByDateRange: jest.fn(() => []),
    getTotalDistance: jest.fn(() => 1000),
    getAverageDistance: jest.fn(() => 1000),
  })),
}));

describe('Hooks Migration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useSessions Hook', () => {
    it('should maintain the same API surface', () => {
      const { result } = renderHook(() => useSessions());

      // Check that all expected properties are present
      expect(result.current).toHaveProperty('sessions');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('loadSessions');
      expect(result.current).toHaveProperty('createSession');
      expect(result.current).toHaveProperty('updateSession');
      expect(result.current).toHaveProperty('deleteSession');
      expect(result.current).toHaveProperty('searchSessions');
      expect(result.current).toHaveProperty('getSession');
      expect(result.current).toHaveProperty('getSessionsByDate');
      expect(result.current).toHaveProperty('getSessionsByPhase');
      expect(result.current).toHaveProperty('getSessionsByCompetition');
      expect(result.current).toHaveProperty('getSessionsByRange');
      expect(result.current).toHaveProperty('getTotalDistance');
      expect(result.current).toHaveProperty('getTotalDuration');
      expect(result.current).toHaveProperty('getAverageRPE');
      expect(result.current).toHaveProperty('clearSessions');
      expect(result.current).toHaveProperty('setError');
    });

    it('should transform data correctly', () => {
      const { result } = renderHook(() => useSessions());

      expect(result.current.sessions).toHaveLength(1);
      expect(result.current.sessions[0]).toMatchObject({
        id: '1',
        date: '2024-01-01',
        swimmer: 'Test Swimmer',
        distance: 1000,
        stroke: 'freestyle',
        sessionType: 'aerobic',
        mainSet: 'Test Set',
        notes: 'Test notes',
        title: 'Test Set',
        content: 'Test notes',
        type: 'aerobic',
        rpe: 7,
        duration: 1000,
        zone_volumes: { z1: 100, z2: 200, z3: 300, z4: 200, z5: 200 },
      });
    });

    it('should handle CRUD operations', async () => {
      const { result } = renderHook(() => useSessions());

      // Test create
      await act(async () => {
        const createResult = await result.current.createSession({
          date: '2024-01-02',
          swimmer: 'New Swimmer',
          distance: 2000,
          stroke: 'backstroke',
          sessionType: 'threshold',
          mainSet: 'New Set',
        });

        expect(createResult.error).toBeNull();
      });

      // Test update
      await act(async () => {
        const updateResult = await result.current.updateSession('1', {
          distance: 1500,
        });

        expect(updateResult.error).toBeNull();
      });

      // Test delete
      await act(async () => {
        const deleteResult = await result.current.deleteSession('1');

        expect(deleteResult.error).toBeNull();
      });
    });

    it('should handle search functionality', async () => {
      const { result } = renderHook(() => useSessions());

      await act(async () => {
        const searchResult = await result.current.searchSessions('Test');

        expect(searchResult.error).toBeNull();
        expect(searchResult.data).toBeDefined();
      });
    });
  });

  describe('useSessionsData Hook', () => {
    it('should maintain the same API surface', () => {
      const { result } = renderHook(() => useSessionsData());

      // Check that all expected properties are present
      expect(result.current).toHaveProperty('sessions');
      expect(result.current).toHaveProperty('metrics');
      expect(result.current).toHaveProperty('zoneAnalysis');
      expect(result.current).toHaveProperty('weeklyAnalysis');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('isInitialized');
      expect(result.current).toHaveProperty('loadSessions');
      expect(result.current).toHaveProperty('getFilteredSessions');
    });

    it('should calculate metrics correctly', () => {
      const { result } = renderHook(() => useSessionsData());

      expect(result.current.metrics).toMatchObject({
        totalDistance: 1000,
        totalSessions: 1,
        avgDistance: 1000,
        avgDuration: 1000,
        avgRPE: 7,
        totalTime: 1000,
      });
    });

    it('should calculate zone analysis correctly', () => {
      const { result } = renderHook(() => useSessionsData());

      expect(result.current.zoneAnalysis).toHaveLength(5);
      expect(result.current.zoneAnalysis[0]).toMatchObject({
        zone: 'Z1',
        distance: 100,
        percentage: expect.any(Number),
      });
    });

    it('should filter sessions correctly', () => {
      const { result } = renderHook(() => useSessionsData());

      const filtered = result.current.getFilteredSessions({
        stroke: 'freestyle',
      });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].stroke).toBe('freestyle');
    });
  });

  describe('useSession Hook', () => {
    it('should maintain the same API surface', () => {
      const { result } = renderHook(() => useSession('1'));

      // Check that all expected properties are present
      expect(result.current).toHaveProperty('session');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('loadSession');
      expect(result.current).toHaveProperty('updateSession');
      expect(result.current).toHaveProperty('deleteSession');
    });

    it('should return the correct session', () => {
      const { result } = renderHook(() => useSession('1'));

      expect(result.current.session).toMatchObject({
        id: '1',
        date: '2024-01-01',
        swimmer: 'Test Swimmer',
        distance: 1000,
        stroke: 'freestyle',
        sessionType: 'aerobic',
        mainSet: 'Test Set',
      });
    });

    it('should handle session operations', async () => {
      const { result } = renderHook(() => useSession('1'));

      // Test update
      await act(async () => {
        const updateResult = await result.current.updateSession({
          distance: 1500,
        });

        expect(updateResult.error).toBeNull();
      });

      // Test delete
      await act(async () => {
        const deleteResult = await result.current.deleteSession();

        expect(deleteResult.error).toBeNull();
      });
    });
  });

  describe('Performance Tests', () => {
    it('should handle large datasets efficiently', () => {
      const startTime = Date.now();

      // Mock large dataset
      const mockStore = {
        entities: {},
        ids: [],
      };

      // Generate 1000 sessions
      for (let i = 0; i < 1000; i++) {
        mockStore.entities[`${i}`] = {
          id: `${i}`,
          date: '2024-01-01',
          swimmer: `Swimmer ${i}`,
          distance: 1000,
          stroke: 'freestyle',
          sessionType: 'aerobic',
          mainSet: `Set ${i}`,
        };
        mockStore.ids.push(`${i}`);
      }

      (useNewSessionsStore as jest.Mock).mockReturnValue(mockStore);

      const { result } = renderHook(() => useSessionsData());

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      // Should process 1000 sessions in reasonable time
      expect(processingTime).toBeLessThan(100); // 100ms
      expect(result.current.sessions).toHaveLength(1000);
    });
  });

  describe('Error Handling', () => {
    it('should handle store errors gracefully', () => {
      (useSessionsStoreBridge as jest.Mock).mockReturnValue({
        isLoading: false,
        error: 'Store error',
        setLoading: jest.fn(),
        setError: jest.fn(),
        addSession: jest.fn(() => ({ success: false, error: 'Add failed' })),
        updateSession: jest.fn(() => ({ success: false, error: 'Update failed' })),
        deleteSession: jest.fn(() => ({ success: false, error: 'Delete failed' })),
        clearEntities: jest.fn(),
      });

      const { result } = renderHook(() => useSessions());

      expect(result.current.error).toBe('Store error');
    });

    it('should handle CRUD operation errors', async () => {
      (useSessionsStoreBridge as jest.Mock).mockReturnValue({
        isLoading: false,
        error: null,
        setLoading: jest.fn(),
        setError: jest.fn(),
        addSession: jest.fn(() => ({ success: false, error: 'Add failed' })),
        updateSession: jest.fn(() => ({ success: false, error: 'Update failed' })),
        deleteSession: jest.fn(() => ({ success: false, error: 'Delete failed' })),
        clearEntities: jest.fn(),
      });

      const { result } = renderHook(() => useSessions());

      await act(async () => {
        const createResult = await result.current.createSession({
          date: '2024-01-02',
          swimmer: 'New Swimmer',
          distance: 2000,
          stroke: 'backstroke',
          sessionType: 'threshold',
          mainSet: 'New Set',
        });

        expect(createResult.success).toBe(false);
        expect(createResult.error).toContain('Failed to create session');
      });
    });
  });
});
