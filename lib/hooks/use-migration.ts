// =====================================================
// HOOK DE MIGRACIÓN - FACILITAR TRANSICIÓN
// =====================================================

import { useAICoachStore, useAuthStore, useCompetitionsStore, useReportsStore, useSessionsStore, useTrainingStore } from '@/lib/store/unified';
import { useEffect } from 'react';

// =====================================================
// MIGRACIÓN DE SESSIONS
// =====================================================
export function useSessionsMigration() {
  const { setSessions } = useSessionsStore();

  useEffect(() => {
    // Migrar datos de localStorage si existen
    const migrateSessions = () => {
      try {
        const stored = localStorage.getItem('swim-sessions-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.state?.sessions) {
            setSessions(parsed.state.sessions);
            console.log('✅ Sessions migradas exitosamente');
          }
        }
      } catch (error) {
        console.warn('⚠️ Error migrando sessions:', error);
      }
    };

    migrateSessions();
  }, [setSessions]);
}

// =====================================================
// MIGRACIÓN DE COMPETITIONS
// =====================================================
export function useCompetitionsMigration() {
  const { setCompetitions } = useCompetitionsStore();

  useEffect(() => {
    const migrateCompetitions = () => {
      try {
        const stored = localStorage.getItem('competitions');
        if (stored) {
          const competitions = JSON.parse(stored);
          setCompetitions(competitions);
          console.log('✅ Competitions migradas exitosamente');
        }
      } catch (error) {
        console.warn('⚠️ Error migrando competitions:', error);
      }
    };

    migrateCompetitions();
  }, [setCompetitions]);
}

// =====================================================
// MIGRACIÓN DE TRAINING ZONES
// =====================================================
export function useTrainingZonesMigration() {
  const { setZones, setMethodology } = useTrainingStore();

  useEffect(() => {
    const migrateTrainingZones = () => {
      try {
        const methodology = localStorage.getItem('training-zones-methodology');
        const customZones = localStorage.getItem('training-zones-custom');
        
        if (methodology) {
          setMethodology(methodology);
        }
        
        if (customZones) {
          const zones = JSON.parse(customZones);
          setZones(zones);
          console.log('✅ Training zones migradas exitosamente');
        }
      } catch (error) {
        console.warn('⚠️ Error migrando training zones:', error);
      }
    };

    migrateTrainingZones();
  }, [setZones, setMethodology]);
}

// =====================================================
// MIGRACIÓN COMPLETA
// =====================================================
export function useCompleteMigration() {
  useSessionsMigration();
  useCompetitionsMigration();
  useTrainingZonesMigration();
}

// =====================================================
// HOOK DE COMPATIBILIDAD
// =====================================================
export function useStoreCompatibility() {
  const authStore = useAuthStore();
  const sessionsStore = useSessionsStore();
  const competitionsStore = useCompetitionsStore();
  const trainingStore = useTrainingStore();
  const aiCoachStore = useAICoachStore();
  const reportsStore = useReportsStore();

  return {
    // Auth
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    authLoading: authStore.isLoading,
    authError: authStore.error,
    
    // Sessions
    sessions: sessionsStore.sessions,
    sessionsLoading: sessionsStore.isLoading,
    sessionsError: sessionsStore.error,
    
    // Competitions
    competitions: competitionsStore.competitions,
    competitionsLoading: competitionsStore.isLoading,
    competitionsError: competitionsStore.error,
    
    // Training
    phases: trainingStore.phases,
    zones: trainingStore.zones,
    trainingLoading: trainingStore.isLoading,
    trainingError: trainingStore.error,
    
    // AI Coach
    advice: aiCoachStore.advice,
    analysis: aiCoachStore.analysis,
    aiCoachLoading: aiCoachStore.isLoading,
    aiCoachError: aiCoachStore.error,
    
    // Reports
    reports: reportsStore.reports,
    selectedReport: reportsStore.selectedReport,
    reportsLoading: reportsStore.isLoading,
    reportsError: reportsStore.error,
  };
}
