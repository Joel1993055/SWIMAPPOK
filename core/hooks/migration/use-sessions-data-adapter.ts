// =====================================================
// SESSIONS DATA HOOK ADAPTER - MIGRATION BRIDGE
// =====================================================

import { useNewSessionsStore } from '@/core/stores/entities/session';
import { useSessionsStoreBridge } from '@/core/stores/migration/sessions-bridge';
import { useCallback, useEffect, useMemo, useState } from 'react';

// =====================================================
// LEGACY SESSION TYPE (COMPATIBILITY)
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
  startDate?: Date;
  endDate?: Date;
  stroke?: string;
  type?: string;
  rpe?: number;
}

// =====================================================
// MAIN SESSIONS DATA HOOK ADAPTER
// =====================================================

export function useSessionsData() {
  const bridge = useSessionsStoreBridge();
  const newStore = useNewSessionsStore();
  const [lastFetch, setLastFetch] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // =====================================================
  // DATA TRANSFORMATION
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

  // =====================================================
  // CACHED DATA LOADING
  // =====================================================

  const loadSessions = useCallback(
    async (forceRefresh = false) => {
      const now = Date.now();
      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

      // Check cache validity
      if (
        !forceRefresh &&
        newStore.ids.length > 0 &&
        now - lastFetch < CACHE_DURATION
      ) {
        return newStore.ids.map(id => transformToLegacy(newStore.entities[id]));
      }

      try {
        bridge.setLoading(true);
        bridge.setError(null);

        // For now, return existing sessions (API integration will come later)
        const sessions = newStore.ids.map(id => newStore.entities[id]);
        const legacySessions = sessions.map(transformToLegacy);

        setLastFetch(now);
        setIsInitialized(true);

        return legacySessions;
      } catch (error) {
        console.error('Error loading sessions:', error);
        bridge.setError('Error loading sessions');
        throw error;
      } finally {
        bridge.setLoading(false);
      }
    },
    [bridge, newStore, lastFetch, transformToLegacy]
  );

  // =====================================================
  // AUTO-LOAD ON MOUNT
  // =====================================================

  useEffect(() => {
    if (!isInitialized && !bridge.isLoading) {
      loadSessions();
    }
  }, [isInitialized, bridge.isLoading, loadSessions]);

  // =====================================================
  // FILTERED SESSIONS (OPTIMIZED)
  // =====================================================

  const getFilteredSessions = useCallback(
    (filters: SessionsFilters) => {
      const sessions = newStore.ids.map(id => transformToLegacy(newStore.entities[id]));

      return sessions.filter(session => {
        if (filters.startDate) {
          const sessionDate = new Date(session.date);
          if (sessionDate < filters.startDate) return false;
        }

        if (filters.endDate) {
          const sessionDate = new Date(session.date);
          if (sessionDate > filters.endDate) return false;
        }

        if (filters.stroke && session.stroke !== filters.stroke) {
          return false;
        }

        if (filters.type && session.type !== filters.type) {
          return false;
        }

        if (filters.rpe && session.rpe !== filters.rpe) {
          return false;
        }

        return true;
      });
    },
    [newStore, transformToLegacy]
  );

  // =====================================================
  // METRICS CALCULATION (OPTIMIZED)
  // =====================================================

  const metrics = useMemo(() => {
    const sessions = newStore.ids.map(id => transformToLegacy(newStore.entities[id]));

    if (sessions.length === 0) {
      return {
        totalDistance: 0,
        totalSessions: 0,
        avgDistance: 0,
        avgDuration: 0,
        avgRPE: 0,
        totalTime: 0,
      };
    }

    const totals = sessions.reduce(
      (acc, session) => ({
        distance: acc.distance + (session.distance || 0),
        duration: acc.duration + (session.duration || 0),
        rpe: acc.rpe + (session.rpe || 0),
        sessions: acc.sessions + 1,
      }),
      { distance: 0, duration: 0, rpe: 0, sessions: 0 }
    );

    return {
      totalDistance: totals.distance,
      totalSessions: totals.sessions,
      avgDistance: totals.sessions > 0 ? totals.distance / totals.sessions : 0,
      avgDuration: totals.sessions > 0 ? totals.duration / totals.sessions : 0,
      avgRPE: totals.sessions > 0 ? totals.rpe / totals.sessions : 0,
      totalTime: totals.duration,
    };
  }, [newStore, transformToLegacy]);

  // =====================================================
  // ZONE ANALYSIS (OPTIMIZED)
  // =====================================================

  const zoneAnalysis = useMemo(() => {
    const sessions = newStore.ids.map(id => transformToLegacy(newStore.entities[id]));
    const zoneTotals = { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 };
    let totalDistance = 0;

    sessions.forEach(session => {
      if (session.zone_volumes) {
        Object.entries(session.zone_volumes).forEach(([zone, volume]) => {
          if (zone in zoneTotals && typeof volume === 'number') {
            zoneTotals[zone as keyof typeof zoneTotals] += volume;
            totalDistance += volume;
          }
        });
      }
    });

    return Object.entries(zoneTotals).map(([zone, distance]) => ({
      zone: `Z${zone.slice(1)}`,
      distance,
      percentage: totalDistance > 0 ? (distance / totalDistance) * 100 : 0,
    }));
  }, [newStore, transformToLegacy]);

  // =====================================================
  // WEEKLY ANALYSIS (OPTIMIZED)
  // =====================================================

  const weeklyAnalysis = useMemo(() => {
    const sessions = newStore.ids.map(id => transformToLegacy(newStore.entities[id]));
    const weeklyData: {
      [key: string]: { distance: number; sessions: number; avgRPE: number };
    } = {};

    sessions.forEach(session => {
      const sessionDate = new Date(session.date);
      const weekStart = new Date(sessionDate);
      weekStart.setDate(sessionDate.getDate() - sessionDate.getDay() + 1); // Monday
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { distance: 0, sessions: 0, avgRPE: 0 };
      }

      weeklyData[weekKey].distance += session.distance || 0;
      weeklyData[weekKey].sessions += 1;
      weeklyData[weekKey].avgRPE += session.rpe || 0;
    });

    return Object.entries(weeklyData)
      .map(([week, data]) => ({
        week,
        distance: data.distance,
        sessions: data.sessions,
        avgRPE: data.sessions > 0 ? data.avgRPE / data.sessions : 0,
      }))
      .sort((a, b) => a.week.localeCompare(b.week));
  }, [newStore, transformToLegacy]);

  // =====================================================
  // RETURN LEGACY API
  // =====================================================

  return {
    sessions: newStore.ids.map(id => transformToLegacy(newStore.entities[id])),
    metrics,
    zoneAnalysis,
    weeklyAnalysis,
    isLoading: bridge.isLoading,
    isInitialized,
    loadSessions,
    getFilteredSessions,
  };
}
