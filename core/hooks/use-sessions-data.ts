'use client';

import { useSessionsStore } from '@/core/stores/unified';
import { getSessions } from '@/infra/config/actions/sessions';
import { useCallback, useEffect, useMemo, useState } from 'react';

// =====================================================
// HOOK CENTRALIZADO PARA DATOS DE SESIONES
// =====================================================
export function useSessionsData() {
  const { sessions, setSessions, isLoading, setLoading, setError } =
    useSessionsStore();
  const [lastFetch, setLastFetch] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // =====================================================
  // CARGAR SESIONES CON CACHÉ INTELIGENTE
  // =====================================================
  const loadSessions = useCallback(
    async (forceRefresh = false) => {
      const now = Date.now();
      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

      // Si hay datos en caché y no es refresh forzado, no cargar
      if (
        !forceRefresh &&
        sessions.length > 0 &&
        now - lastFetch < CACHE_DURATION
      ) {
        return sessions;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await getSessions();
        setSessions(data);
        setLastFetch(now);
        setIsInitialized(true);

        return data;
      } catch (error) {
        console.error('Error cargando sesiones:', error);
        setError('Error al cargar las sesiones');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [sessions.length, lastFetch, setSessions, setLoading, setError]
  );

  // =====================================================
  // CARGAR DATOS AL MONTAR (SOLO UNA VEZ)
  // =====================================================
  useEffect(() => {
    if (!isInitialized && !isLoading) {
      loadSessions();
    }
  }, [isInitialized, isLoading]); // Removido loadSessions de las dependencias

  // =====================================================
  // FILTROS OPTIMIZADOS CON USEMEMO
  // =====================================================
  const getFilteredSessions = useCallback(
    (filters: {
      startDate?: Date;
      endDate?: Date;
      stroke?: string;
      type?: string;
      rpe?: number;
    }) => {
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
    [sessions]
  );

  // =====================================================
  // MÉTRICAS OPTIMIZADAS
  // =====================================================
  const metrics = useMemo(() => {
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
  }, [sessions]);

  // =====================================================
  // ANÁLISIS DE ZONAS OPTIMIZADO
  // =====================================================
  const zoneAnalysis = useMemo(() => {
    const zoneTotals = { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 };
    let totalDistance = 0;

    sessions.forEach(session => {
      if (session.zone_volumes) {
        Object.entries(session.zone_volumes).forEach(([zone, volume]) => {
          if (zone in zoneTotals) {
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
  }, [sessions]);

  // =====================================================
  // ANÁLISIS SEMANAL OPTIMIZADO
  // =====================================================
  const weeklyAnalysis = useMemo(() => {
    const weeklyData: {
      [key: string]: { distance: number; sessions: number; avgRPE: number };
    } = {};

    sessions.forEach(session => {
      const sessionDate = new Date(session.date);
      const weekStart = new Date(sessionDate);
      weekStart.setDate(sessionDate.getDate() - sessionDate.getDay() + 1); // Lunes
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
  }, [sessions]);

  return {
    sessions,
    metrics,
    zoneAnalysis,
    weeklyAnalysis,
    isLoading,
    isInitialized,
    loadSessions,
    getFilteredSessions,
  };
}
