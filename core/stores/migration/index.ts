// =====================================================
// MIGRATION UTILITIES - CENTRALIZED EXPORTS
// =====================================================

// Sessions migration
export {
    useSessionsMigration, useSessionsStoreBridge
} from './sessions-bridge';

// =====================================================
// MIGRATION TYPES
// =====================================================

export interface MigrationResult {
  success: boolean;
  message?: string;
  error?: string;
  migrated?: number;
  validation?: {
    isConsistent: boolean;
    newCount: number;
    legacyCount: number;
    differences: string[];
  };
}

export interface MigrationState {
  isMigrating: boolean;
  migrationProgress: number;
  lastMigrationCheck: number;
  errors: string[];
}

// =====================================================
// FUTURE MIGRATION EXPORTS (TO BE IMPLEMENTED)
// =====================================================

// TODO: Implement these in future commits
// export { useClubsStoreBridge, useClubsMigration } from './clubs-bridge';
// export { useCompetitionsStoreBridge, useCompetitionsMigration } from './competitions-bridge';
// export { useTrainingStoreBridge, useTrainingMigration } from './training-bridge';
