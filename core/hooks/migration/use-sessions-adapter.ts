// =====================================================
// SESSIONS HOOK ADAPTER - MIGRATION BRIDGE
// =====================================================

import { useNewSessionsStore } from '@/core/stores/entities/session';
import { useSessionsStoreBridge } from '@/core/stores/migration/sessions-bridge';
import { useCallback, useEffect, useState } from 'react';

// =====================================================
// LEGACY API COMPATIBILITY TYPES
// =====================================================

interface LegacySession {
  id: string;
  date: string;
  swimmer: string;
  distance: number;
  stroke: 'freestyle' | 'backstroke' | 'breaststroke' | 'butterfly' | 'mixed';
  sessionType: 'aerobic' | 'threshold' | 'speed' | 'technique' | 'recovery';
  mainSet: string;
  notes?: string;
  title?: string;
  content?: string;
  type?: string;
  rpe?: number;
  duration?: number;
  zone_volumes?: {
    z1: number;
    z2: number;
    z3: number;
    z4: number;
    z5: number;
  };
}

interface SessionsFilters {
  date?: string;
  startDate?: string;
  endDate?: string;
  training_phase_id?: string;
  competition_id?: string;
  stroke_type?: string;
  session_type?: string;
}

// =====================================================
// MAIN SESSIONS HOOK ADAPTER
// =====================================================

export function useSessions() {
  const bridge = useSessionsStoreBridge();
  const newStore = useNewSessionsStore();
  const [lastFetch, setLastFetch] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // =====================================================
  // DATA TRANSFORMATION UTILITIES
  // =====================================================

  const transformToLegacy = useCallback((session: any): LegacySession => {
    return {
      id: session.id,
      date: session.date,
      swimmer: session.swimmer,
      distance: session.distance,
      stroke: session.stroke,
      sessionType: session.sessionType,
      mainSet: session.mainSet,
      notes: session.notes,
      title: session.mainSet || 'Session',
      content: session.notes || '',
      type: session.sessionType,
      rpe: session.averageRPE,
      duration: session.totalVolume,
      zone_volumes: session.zoneVolumes,
    };
  }, []);

  const transformFromLegacy = useCallback((legacySession: LegacySession) => {
    return {
      date: legacySession.date,
      swimmer: legacySession.swimmer,
      distance: legacySession.distance,
      stroke: legacySession.stroke,
      sessionType: legacySession.sessionType,
      mainSet: legacySession.mainSet,
      notes: legacySession.notes,
      zoneVolumes: legacySession.zone_volumes,
      totalVolume: legacySession.duration,
      averageRPE: legacySession.rpe,
    };
  }, []);

  // =====================================================
  // LEGACY API METHODS
  // =====================================================

  const loadSessions = useCallback(
    async (filters?: SessionsFilters) => {
      try {
        bridge.setLoading(true);
        bridge.setError(null);

        // For now, return existing sessions (API integration will come later)
        const sessions = newStore.ids.map(id => newStore.entities[id]);
        const legacySessions = sessions.map(transformToLegacy);

        setLastFetch(Date.now());
        setIsInitialized(true);

        return {
          data: legacySessions,
          error: null,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        bridge.setError(errorMessage);
        return {
          data: null,
          error: { message: errorMessage },
        };
      } finally {
        bridge.setLoading(false);
      }
    },
    [bridge, newStore, transformToLegacy]
  );

  const createSession = useCallback(
    async (sessionData: Omit<LegacySession, 'id'>) => {
      try {
        bridge.setLoading(true);
        bridge.setError(null);

        const transformedData = transformFromLegacy(sessionData as LegacySession);
        const result = bridge.addSession(transformedData);

        if (!result.success) {
          throw new Error(result.error || 'Failed to create session');
        }

        return {
          data: transformToLegacy(newStore.entities[newStore.ids[newStore.ids.length - 1]]),
          error: null,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        bridge.setError(errorMessage);
        return {
          data: null,
          error: { message: errorMessage },
        };
      } finally {
        bridge.setLoading(false);
      }
    },
    [bridge, newStore, transformFromLegacy, transformToLegacy]
  );

  const updateSession = useCallback(
    async (id: string, updates: Partial<LegacySession>) => {
      try {
        bridge.setLoading(true);
        bridge.setError(null);

        const transformedUpdates = transformFromLegacy(updates as LegacySession);
        const result = bridge.updateSession(id, transformedUpdates);

        if (!result.success) {
          throw new Error(result.error || 'Failed to update session');
        }

        const updatedSession = newStore.entities[id];
        return {
          data: updatedSession ? transformToLegacy(updatedSession) : null,
          error: null,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        bridge.setError(errorMessage);
        return {
          data: null,
          error: { message: errorMessage },
        };
      } finally {
        bridge.setLoading(false);
      }
    },
    [bridge, newStore, transformFromLegacy, transformToLegacy]
  );

  const deleteSession = useCallback(
    async (id: string) => {
      try {
        bridge.setLoading(true);
        bridge.setError(null);

        const result = bridge.deleteSession(id);

        if (!result.success) {
          throw new Error(result.error || 'Failed to delete session');
        }

        return {
          data: { id },
          error: null,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        bridge.setError(errorMessage);
        return {
          data: null,
          error: { message: errorMessage },
        };
      } finally {
        bridge.setLoading(false);
      }
    },
    [bridge]
  );

  const searchSessions = useCallback(
    async (query: string) => {
      try {
        bridge.setLoading(true);
        bridge.setError(null);

        // Simple client-side search for now
        const sessions = newStore.ids.map(id => newStore.entities[id]);
        const filteredSessions = sessions.filter(session =>
          session.mainSet.toLowerCase().includes(query.toLowerCase()) ||
          session.notes?.toLowerCase().includes(query.toLowerCase()) ||
          session.swimmer.toLowerCase().includes(query.toLowerCase())
        );

        const legacySessions = filteredSessions.map(transformToLegacy);

        return {
          data: legacySessions,
          error: null,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        bridge.setError(errorMessage);
        return {
          data: null,
          error: { message: errorMessage },
        };
      } finally {
        bridge.setLoading(false);
      }
    },
    [bridge, newStore, transformToLegacy]
  );

  // =====================================================
  // LEGACY SELECTORS
  // =====================================================

  const getAllSessions = useCallback(() => {
    return newStore.ids.map(id => transformToLegacy(newStore.entities[id]));
  }, [newStore, transformToLegacy]);

  const getSession = useCallback((id: string) => {
    const session = newStore.entities[id];
    return session ? transformToLegacy(session) : null;
  }, [newStore, transformToLegacy]);

  const getSessionsByDate = useCallback((date: string) => {
    const sessions = newStore.getSessionsByDate(date);
    return sessions.map(transformToLegacy);
  }, [newStore, transformToLegacy]);

  const getSessionsByPhase = useCallback((phase: string) => {
    const sessions = newStore.getSessionsByPhase(phase);
    return sessions.map(transformToLegacy);
  }, [newStore, transformToLegacy]);

  const getSessionsByCompetition = useCallback((competitionId: string) => {
    // This would need to be implemented in the new store
    const sessions = newStore.ids.map(id => newStore.entities[id]);
    return sessions.map(transformToLegacy);
  }, [newStore, transformToLegacy]);

  const getSessionsByRange = useCallback((startDate: string, endDate: string) => {
    const sessions = newStore.getSessionsByDateRange(startDate, endDate);
    return sessions.map(transformToLegacy);
  }, [newStore, transformToLegacy]);

  const getTotalDistance = useCallback(() => {
    return newStore.getTotalDistance();
  }, [newStore]);

  const getTotalDuration = useCallback(() => {
    // Calculate from zone volumes or use totalVolume
    const sessions = newStore.ids.map(id => newStore.entities[id]);
    return sessions.reduce((total, session) => total + (session.totalVolume || 0), 0);
  }, [newStore]);

  const getAverageRPE = useCallback(() => {
    const sessions = newStore.ids.map(id => newStore.entities[id]);
    const sessionsWithRPE = sessions.filter(s => s.averageRPE);
    if (sessionsWithRPE.length === 0) return 0;
    return sessionsWithRPE.reduce((sum, s) => sum + (s.averageRPE || 0), 0) / sessionsWithRPE.length;
  }, [newStore]);

  // =====================================================
  // AUTO-LOAD ON MOUNT
  // =====================================================

  useEffect(() => {
    if (!isInitialized && !bridge.isLoading && newStore.ids.length === 0) {
      loadSessions();
    }
  }, [isInitialized, bridge.isLoading, newStore.ids.length, loadSessions]);

  // =====================================================
  // RETURN LEGACY API
  // =====================================================

  return {
    // State
    sessions: getAllSessions(),
    isLoading: bridge.isLoading,
    error: bridge.error,

    // Actions
    loadSessions,
    createSession,
    updateSession,
    deleteSession,
    searchSessions,

    // Selectors
    getSession,
    getSessionsByDate,
    getSessionsByPhase,
    getSessionsByCompetition,
    getSessionsByRange,
    getTotalDistance,
    getTotalDuration,
    getAverageRPE,

    // Store actions
    clearSessions: bridge.clearEntities,
    setError: bridge.setError,
  };
}

// =====================================================
// PAGINATION HOOK ADAPTER
// =====================================================

export function useSessionsPagination(limit: number = 10) {
  const bridge = useSessionsStoreBridge();
  const newStore = useNewSessionsStore();

  const loadPage = useCallback(
    async (
      page: number,
      filters?: {
        startDate?: string;
        endDate?: string;
        training_phase_id?: string;
        competition_id?: string;
      }
    ) => {
      try {
        bridge.setLoading(true);
        bridge.setError(null);

        // Simple pagination for now
        const allSessions = newStore.ids.map(id => newStore.entities[id]);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const pageSessions = allSessions.slice(startIndex, endIndex);

        return {
          data: {
            items: pageSessions,
            total: allSessions.length,
            page,
            limit,
            hasMore: endIndex < allSessions.length,
          },
          error: null,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        bridge.setError(errorMessage);
        return {
          data: null,
          error: { message: errorMessage },
        };
      } finally {
        bridge.setLoading(false);
      }
    },
    [bridge, newStore, limit]
  );

  return {
    loadPage,
    loading: bridge.isLoading,
    error: bridge.error,
    hasMore: newStore.ids.length > 0,
  };
}

// =====================================================
// STATS HOOK ADAPTER
// =====================================================

export function useSessionsStats() {
  const bridge = useSessionsStoreBridge();
  const newStore = useNewSessionsStore();

  const loadStats = useCallback(
    async (filters?: {
      startDate?: string;
      endDate?: string;
      training_phase_id?: string;
    }) => {
      try {
        bridge.setLoading(true);
        bridge.setError(null);

        const sessions = newStore.ids.map(id => newStore.entities[id]);
        
        const stats = {
          totalSessions: sessions.length,
          totalDistance: newStore.getTotalDistance(),
          totalDuration: sessions.reduce((total, session) => total + (session.totalVolume || 0), 0),
          averageRPE: sessions.length > 0 ? sessions.reduce((sum, s) => sum + (s.averageRPE || 0), 0) / sessions.length : 0,
          averageDistance: newStore.getAverageDistance(),
          averageDuration: sessions.length > 0 ? sessions.reduce((sum, s) => sum + (s.totalVolume || 0), 0) / sessions.length : 0,
          strokeDistribution: {} as Record<string, number>,
          sessionTypeDistribution: {} as Record<string, number>,
        };

        // Calculate distributions
        sessions.forEach(session => {
          stats.strokeDistribution[session.stroke] = (stats.strokeDistribution[session.stroke] || 0) + 1;
          stats.sessionTypeDistribution[session.sessionType] = (stats.sessionTypeDistribution[session.sessionType] || 0) + 1;
        });

        return {
          data: stats,
          error: null,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        bridge.setError(errorMessage);
        return {
          data: null,
          error: { message: errorMessage },
        };
      } finally {
        bridge.setLoading(false);
      }
    },
    [bridge, newStore]
  );

  return {
    loadStats,
    loading: bridge.isLoading,
    error: bridge.error,
  };
}

// =====================================================
// SINGLE SESSION HOOK ADAPTER
// =====================================================

export function useSession(id: string) {
  const bridge = useSessionsStoreBridge();
  const newStore = useNewSessionsStore();

  const loadSession = useCallback(async () => {
    try {
      bridge.setLoading(true);
      bridge.setError(null);

      const session = newStore.entities[id];
      if (!session) {
        throw new Error('Session not found');
      }

      return {
        data: session,
        error: null,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      bridge.setError(errorMessage);
      return {
        data: null,
        error: { message: errorMessage },
      };
    } finally {
      bridge.setLoading(false);
    }
  }, [bridge, newStore, id]);

  const updateSession = useCallback(
    async (updates: Partial<any>) => {
      try {
        bridge.setLoading(true);
        bridge.setError(null);

        const result = bridge.updateSession(id, updates);

        if (!result.success) {
          throw new Error(result.error || 'Failed to update session');
        }

        const updatedSession = newStore.entities[id];
        return {
          data: updatedSession,
          error: null,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        bridge.setError(errorMessage);
        return {
          data: null,
          error: { message: errorMessage },
        };
      } finally {
        bridge.setLoading(false);
      }
    },
    [bridge, newStore, id]
  );

  const deleteSession = useCallback(async () => {
    try {
      bridge.setLoading(true);
      bridge.setError(null);

      const result = bridge.deleteSession(id);

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete session');
      }

      return {
        data: { id },
        error: null,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      bridge.setError(errorMessage);
      return {
        data: null,
        error: { message: errorMessage },
      };
    } finally {
      bridge.setLoading(false);
    }
  }, [bridge, id]);

  // Auto-load session if not exists
  useEffect(() => {
    if (!newStore.entities[id] && !bridge.isLoading) {
      loadSession();
    }
  }, [id, loadSession, bridge.isLoading, newStore.entities]);

  return {
    session: newStore.entities[id],
    loading: bridge.isLoading,
    error: bridge.error,
    loadSession,
    updateSession,
    deleteSession,
  };
}
