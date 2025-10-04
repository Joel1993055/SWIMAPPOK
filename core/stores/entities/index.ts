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

// Clubs Entity Store (NEW - DEPLOYED)
export { useActiveClubs, useClub, useClubs, useClubsActions, useClubsByCategory, useClubsByLocation, useClubsError, useClubsLoading, useClubsSelectors, useClubsStore, useNewClubsStore, type ClubEntity, type ClubsState } from './club';

// Teams Entity Store (NEW - DEPLOYED)
export {
    useActiveTeams, useNewTeamsStore, useTeam, useTeams, useTeamsActions, useTeamsByCategory, useTeamsByClub, useTeamsByCoach, useTeamsByGender, useTeamsByLevel, useTeamsError, useTeamsLoading, useTeamsSelectors, useTeamsStore, type TeamEntity, type TeamsState
} from './team';

// Members Entity Store (NEW - DEPLOYED)
export { useActiveMembers, useMember, useMembers, useMembersActions, useMembersByClub, useMembersByRole, useMembersByTeam, useMembersError, useMembersLoading, useMembersSelectors, useMembersStore, useNewMembersStore, type MemberEntity, type MembersState } from './member';

// Navigation Entity Store (NEW - DEPLOYED)
export { useBreadcrumb, useNavigationActions, useNavigationStore, useNewNavigationStore, usePreferences, useSelectedClubId, useSelectedMemberId, useSelectedTeamId, useSidebarCollapsed, useSidebarWidth, type NavigationActions, type NavigationState } from './navigation';

// TODO: Implement these in future commits
// export { useCompetitionsStore, type CompetitionEntity } from './competition';
// export { useTrainingStore, type TrainingEntity } from './training';
// export { useUsersStore, type UserEntity } from './user';
