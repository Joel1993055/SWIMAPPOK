// =====================================================
// MIGRATION HOOKS - CENTRALIZED EXPORTS
// =====================================================

// Sessions migration hooks
export {
    useSession, useSessions,
    useSessionsPagination,
    useSessionsStats
} from './use-sessions-adapter';

export { useSessionsData } from './use-sessions-data-adapter';

// =====================================================
// MIGRATION TYPES
// =====================================================

export interface LegacySession {
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

export interface SessionsFilters {
  date?: string;
  startDate?: string;
  endDate?: string;
  training_phase_id?: string;
  competition_id?: string;
  stroke_type?: string;
  session_type?: string;
}

export interface SessionsDataFilters {
  startDate?: Date;
  endDate?: Date;
  stroke?: string;
  type?: string;
  rpe?: number;
}

// =====================================================
// FUTURE MIGRATION EXPORTS (TO BE IMPLEMENTED)
// =====================================================

// TODO: Implement these in future commits
// export { useClubsData } from './use-clubs-adapter';
// export { useCompetitionsData } from './use-competitions-adapter';
// export { useTrainingData } from './use-training-adapter';
