'use client';

// =====================================================
// NEW SESSIONS DATA HOOK
// =====================================================

import {
  useSessions,
  useSessionsLoading,
  useSessionsSelectors,
} from '@/core/stores/entities/session';

// =====================================================
// HOOK CENTRALIZADO PARA DATOS DE SESIONES
// =====================================================

export function useSessionsData() {
  const sessions = useSessions();
  const isLoading = useSessionsLoading();
  const {
    getTotalDistance,
    getAverageDistance,
    getZoneDistribution,
  } = useSessionsSelectors();

  // =====================================================
  // MÉTRICAS
  // =====================================================
  const metrics = {
    totalDistance: getTotalDistance(),
    totalSessions: sessions.length,
    avgDistance: getAverageDistance(),
  };

  // =====================================================
  // ANÁLISIS DE ZONAS
  // =====================================================
  const zoneAnalysis = Object.entries(getZoneDistribution()).map(
    ([zone, distance]) => ({
      zone: zone.toUpperCase(),
      distance,
    })
  );

  // =====================================================
  // RETORNO
  // =====================================================
  return {
    sessions,
    metrics,
    zoneAnalysis,
    isLoading,
  };
}
