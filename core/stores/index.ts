// =====================================================
// STORE UNIFICADO - PUNTO DE ENTRADA ÚNICO
// =====================================================

// NEW ENTITY STORES (MIGRATION IN PROGRESS)
export {
    useNewSessionsStore, useSessionsActions, useSessionsByDate,
    useSessionsByDateRange, useSessionsCount, useSessionsError, useSessionsLoading, useSessionsSelectors, useSessionsStore, type SessionEntity, type SessionsState
} from './entities/session';

// CLUBS ENTITY STORES (NEW - DEPLOYED)
export {
    useActiveClubs, useClub, useClubs, useClubsActions, useClubsByCategory, useClubsByLocation, useClubsError, useClubsLoading, useClubsSelectors, useClubsStore, useNewClubsStore, type ClubEntity, type ClubsState
} from './entities/club';

export {
    useActiveTeams, useNewTeamsStore, useTeam, useTeams, useTeamsActions, useTeamsByCategory, useTeamsByClub, useTeamsByCoach, useTeamsByGender, useTeamsByLevel, useTeamsError, useTeamsLoading, useTeamsSelectors, useTeamsStore, type TeamEntity, type TeamsState
} from './entities/team';

export {
    useActiveMembers, useMember, useMembers, useMembersActions, useMembersByClub, useMembersByRole, useMembersByTeam, useMembersError, useMembersLoading, useMembersSelectors, useMembersStore, useNewMembersStore, type MemberEntity, type MembersState
} from './entities/member';

export {
    useBreadcrumb, useNavigationActions, useNavigationStore, useNewNavigationStore, usePreferences, useSelectedClubId, useSelectedMemberId, useSelectedTeamId, useSidebarCollapsed, useSidebarWidth, type NavigationActions, type NavigationState
} from './entities/navigation';

// MIGRATION BRIDGES
export {
    useSessionsMigration, useSessionsStoreBridge, type MigrationResult
} from './migration/sessions-bridge';

export { useClubsMigration, useClubsMigrationBridge, useClubsStoreBridge, type ClubsMigrationActions, type ClubsMigrationState } from './migration/clubs-bridge';

export {
    useClubsData, useClubsStoreAdapter, useClubsStore as useLegacyClubsStore, useMembersData, useTeamsData
} from './migration/clubs-adapter';

// LEGACY NORMALIZED STORES (TO BE MIGRATED)
export { useCompetitionsStore } from './normalized/competitions';
export { useSessionsStore } from './normalized/sessions';
export { useTrainingPhasesStore } from './normalized/training-phases';

// Exportar selectores adicionales
export { competitionsSelectors } from './normalized/competitions';
export { sessionsSelectors } from './normalized/sessions';
export { trainingPhasesSelectors } from './normalized/training-phases';

// Exportar hooks de integración
export {
    useSession,
    useSessions,
    useSessionsPagination,
    useSessionsStats
} from '../hooks/use-sessions';

// =====================================================
// STORE LEGACY (DEPRECATED - PARA MIGRACIÓN GRADUAL)
// =====================================================

// Mantener temporalmente para compatibilidad
export {
    useAICoachStore,
    useAuthStore,
    useReportsStore,
    useUIStore
} from './unified';

// =====================================================
// TIPOS EXPORTADOS
// =====================================================

export type {
    AICoachAdvice,
    AICoachAnalysis,
    Competition,
    Session,
    TrainingPhase,
    TrainingReport,
    User
} from '../types/entities';

