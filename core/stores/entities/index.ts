// =====================================================
// ENTITY STORES - CENTRALIZED EXPORTS
// =====================================================

// Session entity
export {
    useNewSessionsStore, useSession, useSessions, useSessionsActions, useSessionsByDate,
    useSessionsByDateRange, useSessionsCount, useSessionsError, useSessionsLoading, useSessionsSelectors, useSessionsStore, type SessionEntity,
    type SessionsState
} from './session';

// Shared types
export {
    createEntityId,
    createTimestamp,
    normalizeEntities, type BaseEntity, type EntityActions,
    type EntitySelectors, type EntityState
} from './types';

// =====================================================
// FUTURE ENTITY EXPORTS (TO BE IMPLEMENTED)
// =====================================================

// TODO: Implement these in future commits
// export { useClubsStore, type ClubEntity } from './club';
// export { useCompetitionsStore, type CompetitionEntity } from './competition';
// export { useTrainingStore, type TrainingEntity } from './training';
// export { useUsersStore, type UserEntity } from './user';
