// =====================================================
// SESSIONS STORE MIGRATION TESTS
// =====================================================

import { useNewSessionsStore } from '@/core/stores/entities/session';
import { useSessionsMigration, useSessionsStoreBridge } from '@/core/stores/migration/sessions-bridge';
import { useLegacySessionsStore } from '@/core/stores/unified';
import { act, renderHook } from '@testing-library/react';

// Mock the legacy store
jest.mock('@/core/stores/unified', () => ({
  useSessionsStore: jest.fn(() => ({
    sessions: [],
    addSession: jest.fn(),
    updateSession: jest.fn(),
    deleteSession: jest.fn(),
    setSessions: jest.fn(),
  })),
}));

// Mock the new store
jest.mock('@/core/stores/entities/session', () => ({
  useSessionsStore: jest.fn(() => ({
    entities: {},
    ids: [],
    addSession: jest.fn(),
    updateSession: jest.fn(),
    deleteSession: jest.fn(),
    setEntities: jest.fn(),
    setLoading: jest.fn(),
    isLoading: false,
  })),
}));

describe('Sessions Store Migration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Data Consistency Validation', () => {
    it('should validate data consistency between stores', () => {
      const { result } = renderHook(() => useSessionsStoreBridge());
      
      const validation = result.current.validateDataConsistency();
      
      expect(validation).toHaveProperty('isConsistent');
      expect(validation).toHaveProperty('newCount');
      expect(validation).toHaveProperty('legacyCount');
      expect(validation).toHaveProperty('differences');
    });

    it('should detect inconsistencies between stores', () => {
      // Mock different data in stores
      const mockLegacyStore = {
        sessions: [
          { id: '1', date: '2024-01-01', distance: 1000 },
          { id: '2', date: '2024-01-02', distance: 2000 },
        ],
      };

      const mockNewStore = {
        entities: { '1': { id: '1', date: '2024-01-01', distance: 1000 } },
        ids: ['1'],
      };

      (useLegacySessionsStore as jest.Mock).mockReturnValue(mockLegacyStore);
      (useNewSessionsStore as jest.Mock).mockReturnValue(mockNewStore);

      const { result } = renderHook(() => useSessionsStoreBridge());
      
      const validation = result.current.validateDataConsistency();
      
      expect(validation.isConsistent).toBe(false);
      expect(validation.newCount).toBe(1);
      expect(validation.legacyCount).toBe(2);
      expect(validation.differences.length).toBeGreaterThan(0);
    });
  });

  describe('Dual-Write Operations', () => {
    it('should add session to both stores', async () => {
      const mockAddSession = jest.fn();
      const mockLegacyAddSession = jest.fn();

      (useNewSessionsStore as jest.Mock).mockReturnValue({
        addSession: mockAddSession,
        entities: {},
        ids: [],
      });

      (useLegacySessionsStore as jest.Mock).mockReturnValue({
        addSession: mockLegacyAddSession,
        sessions: [],
      });

      const { result } = renderHook(() => useSessionsStoreBridge());
      
      const sessionData = {
        date: '2024-01-01',
        swimmer: 'Test Swimmer',
        distance: 1000,
        stroke: 'freestyle' as const,
        sessionType: 'aerobic' as const,
        mainSet: 'Test Set',
      };

      await act(async () => {
        const result = await result.current.addSession(sessionData);
        expect(result.success).toBe(true);
        expect(result.error).toBeNull();
      });

      expect(mockAddSession).toHaveBeenCalledWith(sessionData);
      expect(mockLegacyAddSession).toHaveBeenCalledWith(sessionData);
    });

    it('should handle errors in dual-write operations', async () => {
      const mockAddSession = jest.fn().mockImplementation(() => {
        throw new Error('New store error');
      });

      (useNewSessionsStore as jest.Mock).mockReturnValue({
        addSession: mockAddSession,
        entities: {},
        ids: [],
      });

      (useLegacySessionsStore as jest.Mock).mockReturnValue({
        addSession: jest.fn(),
        sessions: [],
      });

      const { result } = renderHook(() => useSessionsStoreBridge());
      
      const sessionData = {
        date: '2024-01-01',
        swimmer: 'Test Swimmer',
        distance: 1000,
        stroke: 'freestyle' as const,
        sessionType: 'aerobic' as const,
        mainSet: 'Test Set',
      };

      await act(async () => {
        const result = await result.current.addSession(sessionData);
        expect(result.success).toBe(false);
        expect(result.error).toContain('Failed to add session');
      });
    });
  });

  describe('Migration Process', () => {
    it('should perform successful migration', async () => {
      const mockLegacySessions = [
        { id: '1', date: '2024-01-01', distance: 1000 },
        { id: '2', date: '2024-01-02', distance: 2000 },
      ];

      const mockSetEntities = jest.fn();
      const mockSetLoading = jest.fn();

      (useLegacySessionsStore as jest.Mock).mockReturnValue({
        sessions: mockLegacySessions,
      });

      (useNewSessionsStore as jest.Mock).mockReturnValue({
        entities: {},
        ids: [],
        setEntities: mockSetEntities,
        setLoading: mockSetLoading,
      });

      const { result } = renderHook(() => useSessionsMigration());
      
      await act(async () => {
        const migrationResult = await result.current.performMigration();
        
        expect(migrationResult.success).toBe(true);
        expect(migrationResult.message).toContain('Migration completed');
        expect(migrationResult.migrated).toBe(2);
      });

      expect(mockSetEntities).toHaveBeenCalledWith(mockLegacySessions);
      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    it('should skip migration when stores are consistent', async () => {
      const mockSessions = [
        { id: '1', date: '2024-01-01', distance: 1000 },
        { id: '2', date: '2024-01-02', distance: 2000 },
      ];

      (useLegacySessionsStore as jest.Mock).mockReturnValue({
        sessions: mockSessions,
      });

      (useNewSessionsStore as jest.Mock).mockReturnValue({
        entities: { '1': mockSessions[0], '2': mockSessions[1] },
        ids: ['1', '2'],
        setEntities: jest.fn(),
        setLoading: jest.fn(),
      });

      const { result } = renderHook(() => useSessionsMigration());
      
      await act(async () => {
        const migrationResult = await result.current.performMigration();
        
        expect(migrationResult.success).toBe(true);
        expect(migrationResult.message).toContain('No migration needed');
        expect(migrationResult.migrated).toBe(0);
      });
    });

    it('should handle migration errors gracefully', async () => {
      const mockSetEntities = jest.fn().mockImplementation(() => {
        throw new Error('Migration error');
      });

      (useLegacySessionsStore as jest.Mock).mockReturnValue({
        sessions: [{ id: '1', date: '2024-01-01', distance: 1000 }],
      });

      (useNewSessionsStore as jest.Mock).mockReturnValue({
        entities: {},
        ids: [],
        setEntities: mockSetEntities,
        setLoading: jest.fn(),
      });

      const { result } = renderHook(() => useSessionsMigration());
      
      await act(async () => {
        const migrationResult = await result.current.performMigration();
        
        expect(migrationResult.success).toBe(false);
        expect(migrationResult.error).toContain('Migration failed');
      });
    });
  });

  describe('Performance Validation', () => {
    it('should measure migration performance', async () => {
      const startTime = Date.now();
      
      const mockSessions = Array.from({ length: 1000 }, (_, i) => ({
        id: `session-${i}`,
        date: '2024-01-01',
        distance: 1000,
      }));

      (useLegacySessionsStore as jest.Mock).mockReturnValue({
        sessions: mockSessions,
      });

      (useNewSessionsStore as jest.Mock).mockReturnValue({
        entities: {},
        ids: [],
        setEntities: jest.fn(),
        setLoading: jest.fn(),
      });

      const { result } = renderHook(() => useSessionsMigration());
      
      await act(async () => {
        await result.current.performMigration();
      });

      const endTime = Date.now();
      const migrationTime = endTime - startTime;
      
      // Migration should complete within reasonable time (adjust threshold as needed)
      expect(migrationTime).toBeLessThan(1000); // 1 second
    });
  });
});
