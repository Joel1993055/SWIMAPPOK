'use client';

import { useAppContext } from '@/core/contexts/app-context';
import { useSessionsData } from '@/core/hooks/use-sessions-data';
import { useMemo } from 'react';

/**
 * Hook para obtener sesiones filtradas por club y grupo seleccionado
 */
export function useFilteredSessions() {
  const { sessions, isLoading, loadSessions } = useSessionsData();
  const { selectedClub, selectedGroup, currentClub, currentGroup } = useAppContext();

  // Filtrar sesiones por club y grupo seleccionado
  const filteredSessions = useMemo(() => {
    if (!selectedClub || !selectedGroup) {
      return [];
    }

    return sessions.filter(session => {
      // Filtrar por club (comparar nombres)
      const clubMatch = currentClub ? 
        session.club === currentClub.name : 
        false;
      
      // Filtrar por grupo (comparar nombres)
      const groupMatch = currentGroup ? 
        session.group_name === currentGroup.name : 
        false;

      return clubMatch && groupMatch;
    });
  }, [sessions, selectedClub, selectedGroup, currentClub, currentGroup]);

  // Estadísticas de las sesiones filtradas
  const stats = useMemo(() => {
    if (filteredSessions.length === 0) {
      return {
        totalSessions: 0,
        totalDistance: 0,
        totalDuration: 0,
        averageRPE: 0,
        lastSession: null,
      };
    }

    const totalDistance = filteredSessions.reduce((sum, session) => sum + (session.distance || 0), 0);
    const totalDuration = filteredSessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const averageRPE = filteredSessions.reduce((sum, session) => sum + (session.rpe || 0), 0) / filteredSessions.length;
    
    const lastSession = filteredSessions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    return {
      totalSessions: filteredSessions.length,
      totalDistance,
      totalDuration,
      averageRPE: Math.round(averageRPE * 10) / 10,
      lastSession,
    };
  }, [filteredSessions]);

  return {
    sessions: filteredSessions,
    isLoading,
    loadSessions,
    stats,
    hasContext: selectedClub && selectedGroup,
    contextInfo: {
      club: currentClub?.name || 'No club selected',
      group: currentGroup?.name || 'No group selected',
    },
  };
}
