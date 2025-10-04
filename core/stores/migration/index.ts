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

// Clubs migration bridge (NEW - DEPLOYED)
export { useClubsMigration, useClubsMigrationBridge, useClubsStoreBridge, type ClubsMigrationActions, type ClubsMigrationState } from './clubs-bridge';

// Clubs migration adapter (NEW - DEPLOYED)
export {
    useClubsData, useClubsStoreAdapter, useClubsStore as useLegacyClubsStore, useMembersData, useTeamsData
} from './clubs-adapter';

// TODO: Implement these in future commits
// export { useCompetitionsStoreBridge, useCompetitionsMigration } from './competitions-bridge';
// export { useTrainingStoreBridge, useTrainingMigration } from './training-bridge';
