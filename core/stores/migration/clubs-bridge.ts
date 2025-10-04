// =====================================================
// CLUBS MIGRATION BRIDGE - DUAL-WRITE COORDINATION
// =====================================================

import { useCallback } from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { ClubEntity } from '../entities/club';
import type { TeamEntity } from '../entities/team';
import type { MemberEntity } from '../entities/member';
import type { NavigationState } from '../entities/navigation';

// =====================================================
// LEGACY DATA TRANSFORMERS
// =====================================================

/**
 * Transform new entity format to legacy format for backward compatibility
 */
const transformClubToLegacy = (club: ClubEntity): any => ({
  id: club.id,
  name: club.name,
  description: club.description,
  location: club.location,
  contactEmail: club.contactEmail,
  website: club.website,
  logoUrl: club.logoUrl,
  phone: club.phone,
  address: club.address,
  isActive: club.isActive,
  isPublic: club.isPublic,
  timezone: club.timezone,
  language: club.language,
  maxTeams: club.maxTeams,
  maxMembersPerTeam: club.maxMembersPerTeam,
  subscriptionType: club.subscriptionType,
  foundedYear: club.foundedYear,
  foundedBy: club.foundedBy,
  category: club.category,
  teamCount: club.teamCount,
  memberCount: club.memberCount,
  sessionCount: club.sessionCount,
  createdAt: club.createdAt,
  updatedAt: club.updatedAt,
});

const transformTeamToLegacy = (team: TeamEntity): any => ({
  id: team.id,
  clubId: team.clubId,
  club_id: team.clubId, // Legacy format
  name: team.name,
 your description: team.description,
  category: team.category,
  gender: team.gender,
  ageRange: team.ageRange,
  age_range: team.ageRange, // Legacy format
  level: team.level,
  practiceDays: team.practiceDays,
  practice_days: team.practiceDays, // Legacy format
  practiceTimes: team.practiceTimes,
  practice_times: team.practiceTimes, // Legacy format
  practiceLocation: team.practiceLocation,
  practice_location: team.practiceLocation, // Legacy format
  coachId: team.coachId,
  coach_id: team.coachId, // Legacy format
  assistantCoachId: team.assistantCoachId,
  assistant_coach_id: team.assistantCoachId, // Legacy format
  captainId: team.captainId,
  captain_id: team.captainId, // Legacy format
  isActive: team.isActive,
  is_active: team.isActive, // Legacy format
  isAcceptingMembers: team.isAcceptingMembers,
  is_accepting_members: team.isAcceptingMembers, // Legacy format
  maxMembers: team.maxMembers,
  max_members: team.maxMembers, // Legacy format
  minAge: team.minAge,
  min_age: team.minAge, // Legacy format
  maxAge: team.maxAge,
  max_age: team.maxAge, // Legacy format
  competitionLevel: team.competitionLevel,
  competition_level: team.competitionLevel, // Legacy format
  targetCompetitions: team.targetCompetitions,
  target_competitions: team.targetCompetitions, // Legacy format
  memberCount: team.memberCount,
  member_count: team.memberCount, // Legacy format
  sessionCount: team.sessionCount,
  session_count: team.sessionCount, // Legacy format
  lastActivity: team.lastActivity,
  last_activity: team.lastActivity, // Legacy format
  createdBy: team.createdBy,
  created_by: team.createdBy, // Legacy format
  foundedDate: team.foundedDate,
  founded_date: team.foundedDate, // Legacy format
  colors: team.colors,
  createdAt: team.createdAt,
  updatedAt: team.updatedAt,
});

const transformMemberToLegacy = (member: MemberEntity): any => ({
  id: member.id,
  teamId: member.teamId,
  team_id: member.teamId, // Legacy format
  userId: member.userId,
  user_id: member.userId, // Legacy format
  clubId: member.clubId,
  club_id: member.clubId, // Legacy format
  role: member.role,
  permissions: member.permissions,
  isActive: member.isActive,
  is_active: member.is_active, // Legacy format
  joinedAt: member.joinedAt,
  joined_at: member.joinedAt, // Legacy format
  leftAt: member.leftAt,
  left_at: member.leftAt, // Legacy format
  position: member.position,
  weight: member.weight,
  height: member.height,
  firstName: member.firstName,
  first_name: member.firstName, // Legacy format
  lastName: member.lastName,
  last_name: member.lastName, // Legacy format
  email: member.email,
  phone: member.phone,
  birthDate: member.birthDate,
  birth_date: member.birthDate, // Legacy format
  gender: member.gender,
  emergencyContact: member.emergencyContact,
  emergency_contact: member.emergencyContact, // Legacy format
  skillLevel: member.skillLevel,
  skill_level: member.skillLevel, // Legacy format
  preferredEvents: member.preferredEvents,
  preferred_events: member.preferredEvents, // Legacy format
  personalBest: member.personalBest,
  personal_best: member.personalBest, // Legacy format
  trainingZones: member.trainingZones,
  training_zones: member.trainingZones, // Legacy format
  medicalInfo: member.medicalInfo,
  medical_info: member.medicalInfo, // Legacy format
  availability: member.availability,
  sessionCount: member.sessionCount,
  session_count: member.sessionCount, // Legacy format
  lastSession: member.lastSession,
  last_session: member.lastSession, // Legacy format
  attendanceRate: member.attendanceRate,
  attendance_rate: member.attendanceRate, // Legacy format
  createdAt: member.createdAt,
  updatedAt: member.updatedAt,
});

/**
 * Transform legacy format to new entity format
 */
const transformLegacyToClub = (legacyClub: any): Omit<ClubEntity, 'id' | 'createdAt' | 'updatedAt'> => ({
  name: legacyClub.name,
  description: legacyClub.description || '',
  location: legacyClub.location || '',
  contactEmail: legacyClub.contactEmail || '',
  website: legacyClub.website,
  logoUrl: legacyClub.logoUrl,
  phone: legacyClub.phone,
  address: legacyClub.address,
  isActive: legacyClub.isActive ?? true,
  isPublic: legacyClub.isPublic ?? true,
  timezone: legacyClub.timezone || 'UTC',
  language: legacyClub.language || 'es',
  maxTeams: legacyClub.maxTeams || 5,
  maxMembersPerTeam: legacyClub.maxMembersPerTeam || 20,
  subscriptionType: legacyClub.subscriptionType || 'basic',
  foundedYear: legacyClub.foundedYear,
  foundedBy: legacyClub.foundedBy,
  category: legacyClub.category || 'mixed',
  teamCount: legacyClub.teamCount,
  memberCount: legacyClub.memberCount,
  sessionCount: legacyClub.sessionCount,
});

const transformLegacyToTeam = (legacyTeam: any): Omit<TeamEntity, 'id' | 'createdAt' | 'updatedAt'> => ({
  clubId: legacyTeam.clubId
 || legacyTeam.club_id || '',
  name: legacyTeam.name,
  description: legacyTeam.description,
  category: legacyTeam.category || 'senior',
  gender: legacyTeam.gender || 'mixto',
  ageRange: legacyTeam.ageRange || legacyTeam.age_range || '18+',
  level: legacyTeam.level || 'intermediate',
  practiceDays: legacyTeam.practiceDays || legacyTeam.practice_days || [],
  practiceTimes: legacyTeam.practiceTimes || legacyTeam.practice_times || [],
  practiceLocation: legacyTeam.practiceLocation || legacyTeam.practice_location || '',
  coachId: legacyTeam.coachId || legacyTeam.coach_id,
  assistantCoachId: legacyTeam.assistantCoachId || legacyTeam.assistant_coach_id,
  captainId: legacyTeam.captainId || legacyTeam.captain_id,
  isActive: legacyTeam.isActive ?? legacyTeam.is_active ?? true,
  isAcceptingMembers: legacyTeam.isAcceptingMembers ?? legacyTeam.is_accepting_members ?? true,
  maxMembers: legacyTeam.maxMembers || legacyTeam.max_members || 20,
  minAge: legacyTeam.minAge || legacyTeam.min_age,
  maxAge: legacyTeam.dAge || legacyTeam.max_age,
  competitionLevel: legacyTeam.competitionLevel || legacyTeam.competition_level || 'local',
  targetCompetitions: legacyTeam.targetCompetitions || legacyTeam.target_competitions || [],
  memberCount: legacyTeam.memberCount || legacyTeam.member_count,
  sessionCount: legacyTeam.sessionCount || legacyTeam.session_count,
  lastActivity: legacyTeam.lastActivity || legacyTeam.last_activity,
  createdBy: legacyTeam.createdBy || legacyTeam.created_by,
  foundedDate: legacyTeam.foundedDate || legacyTeam.founded_date,
  colors: legacyTeam.colors || { primary: '#0066CC', secondary: '#FFFFFF' },
});

const transformLegacyToMember = (legacyMember: any): Omit<MemberEntity, 'id' | 'createdAt' | 'updatedAt'> => ({
  teamId: legacyMember.teamId || legacyMember.team_id || '',
  userId: legacyMember.userId || legacyMember.user_id || '',
  clubId: legacyMember.clubId || legacyMember.club_id || '',
  role: legacyMember.role || 'atleta',
  permissions: legacyMember.permissions || {
    canEditSessions: false,
    canManageTeam: false,
    canInviteMembers: false,
    canViewReports: false,
    canAccessAnalytics: false,
  },
  isActive: legacyMember.isActive ?? legacyMember.is_active ?? true,
  joinedAt: legacyMember.joinedAt || legacyMember.joined_at || new Date().toISOString(),
  leftAt: legacyMember.leftAt || legacyMember.left_at,
  position: legacyMember.position,
  weight: legacyMember.weight,
  height: legacyMember.height,
  firstName: legacyMember.firstName || legacyMember.first_name || '',
  lastName: legacyMember.lastName || legacyMember.last_name || '',
  email: legacyMember.email || '',
  phone: legacyMember.phone,
  birthDate: legacyMember.birthDate || legacyMember.birth_date,
  gender: legacyMember.gender,
  emergencyContact: legacyMember.emergencyContact || legacyMember.emergency_contact,
  skillLevel: legacyMember.skillLevel || legacyMember.skill_level || 'intermedio',
  preferredEvents: legacyMember.preferredEvents || legacyMember.preferred_events || [],
  personalBest: legacyMember.personalBest || legacyMember.personal_best,
  trainingZones: legacyMember.trainingZones || legacyMember.training_zones,
  medicalInfo: legacyMember.medicalInfo || legacyMember.medical_info,
  availability: legacyMember.availability || [],
  sessionCount: legacyMember.sessionCount || legacyMember.session_count,
  lastSession: legacyMember.lastSession || legacyMember.last_session,
  attendanceRate: legacyMember.attendanceRate || legacyMember.attendance_rate
});

// =====================================================
// BRIDGE RESULT TYPE
// =====================================================

export interface MigrationResult {
  success: boolean;
  migratedClubs: number;
  migratedTeams: number;
  migratedMembers: number;
  errors: string[];
  warnings: string[];
}

// =====================================================
// MIGRATION BRIDGE STATE
// =====================================================

interface ClubsMigrationState {
  // Migration status
  isInitialized: boolean;
  isMigrating: boolean;
  migrationProgress: number;
  migrationResult?: MigrationResult;
  
  // Dual-write control
  enableDualWrite: boolean;
  syncFromLegacy: boolean;
  syncToLegacy: boolean;
  
  // Legacy store reference (will be set during initialization)
  legacyStore: any;
}

interface ClubsMigrationActions {
  // Core migration actions
  initializeMigration: (legacyStore: any) => void;
  migrateData: () => Promise<MigrationResult>;
  fullMigration: () => Promise<void>;
  
  // Dual-write synchronization
  syncFromLegacyToNew: () => void;
  syncFromNewToLegacy: () => void;
  
  // Control methods
  setDualWriteMode: (enabled: boolean) => void;
  setSyncFromLegacy: (enabled: boolean) => void;
  setSyncToLegacy: (enabled: boolean) => void;
  
  // Utility methods
  resetMigration: () => void;
  getMigrationStatus: () => MigrationResult | null;
}

type ClubsMigrationBridge = ClubsMigrationState & ClubsMigrationActions;

// =====================================================
// MIGRATION BRIDGE IMPLEMENTATION
// =====================================================

export const useClubsMigrationBridge = create<ClubsMigrationBridge>()(
  subscribeWithSelector(
    (set, get) => ({
      // Initial state
      isInitialized: false,
      isMigrating: false,
      migrationProgress: 0,
      migrationResult: undefined,
      enableDualWrite: true,
      syncFromLegacy: true,
      syncToLegacy: true,
      legacyStore: null,

      initializeMigration: (legacyStore: any) => {
        console.log('🏗️ Initializing Clubs Migration Bridge');
        set({ legacyStore, isInitialized: true });
      },

      migrateData: async (): Promise<MigrationResult> => {
        const state = get();
        if (!state.isInitialized || !state.legacyStore) {
          throw new Error('Migration bridge not initialized');
        }

        set({ isMigrating: true, migrationProgress: 0 });

        const result: MigrationResult = {
          success: false,
          migratedClubs: 0,
          migratedTeams: 0,
          migratedMembers: 0,
          errors: [],
          warnings: [],
        };

        try {
          console.log('🔄 Starting data migration...');

          // Import new stores dynamically
          const { useClubsStore: newClubsStore } = await import('../entities/club');
          const { useTeamsStore: newTeamsStore } = await import('../entities/team');
          const { useMembersStore: newMembersStore } = await import('../entities/member');
          const { useNavigationStore } = await import('../entities/navigation');

          const legacyState = state.legacyStore.getState();

          // Migrate clubs
          console.log('📁 Migrating clubs...');
          set({ migrationProgress: 25 });
          
          if (legacyState.clubs?.length > 0) {
            const clubsEntities: ClubEntity[] = legacyState.clubs.map((club: any) => ({
              ...transformLegacyToClub(club),
              id: club.id,
              createdAt: club.createdAt || new Date().toISOString(),
              updatedAt: club.updatedAt || new Date().toISOString(),
            }));
            
            newClubsStore.getState().setEntities(clubsEntities);
            result.migratedClubs = clubsEntities.length;
          }

          // Migrate teams
          console.log('🏊 Migrating teams...');
          set({ migrationProgress: 50 });
          
          if (legacyState.teams?.length > 0) {
            const teamsEntities: TeamEntity[] = legacyState.teams.map((team: any) => ({
              ...transformLegacyToTeam(team),
              id: team.id,
              createdAt: team.createdAt || new Date().toISOString(),
              updatedAt: team.updatedAt || new Date().toISOString(),
            }));
            
            newTeamsStore.getState().setEntities(teamsEntities);
            result.migratedTeams = teamsEntities.length;
          }

          // Migrate members
          console.log('👥 Migrating members...');
          set({ migrationProgress: 75 });
          
          if (legacyState.members?.length > 0) {
            const membersEntities: MemberEntity[] = legacyState.members.map((member: any) => ({
              ...transformLegacyToMember(member),
              id: member.id,
              createdAt: member.createdAt || new Date().toISOString(),
              updatedAt: member.updatedAt || new Date().toISOString(),
            }));
            
            newMembersStore.getState().setEntities(membersEntities);
            result.migratedMembers = membersEntities.length;
          }

          // Migrate navigation state
          console.log('🧭 Migrating navigation state...');
          set({ migrationProgress: 90 });
          
          if (legacyState.navigation) {
            useNavigationStore.getState().setSelectedClub(legacyState.navigation.selectedClubId);
            useNavigationStore.getState().setSelectedTeam(legacyState.navigation.selectedTeamId);
          }

          // Complete migration
          set({ migrationProgress: 100 });
          result.success = true;
          result.warnings.push(
            `Migration completed successfully: ${result.migratedClubs} clubs, ${result.migratedTeams} teams, ${result.migratedMembers} members`
          );

          console.log('✅ Migration completed successfully!');
          set({ migrationResult: result, isMigrating: false });
          
        } catch (error) {
          console.error('❌ Migration failed:', error);
          result.errors.push(error instanceof Error ? error.message : 'Unknown migration error');
          set({ migrationResult: result, isMigrating: false });
        }

        return result;
      },

      fullMigration: async () => {
        const result = await get().migrateData();
        if (result.success) {
          console.log('🎉 Full migration completed successfully!');
        } else {
          console.error('💥 Migration failed with errors:', result.errors);
        }
      },

      syncFromLegacyToNew: () => {
        const state = get();
        if (!state.syncFromLegacy || !state.legacyStore) return;

        try {
          const legacyState = state.legacyStore.getState();
          console.log('🔄 Syncing from legacy to new stores...');

          // Sync clubs
          if (legacyState.clubs?.length > 0) {
            const { useClubsStore: newClubsStore } = require('../entities/club');
            const clubsEntities: ClubEntity[] = legacyState.clubs.map((club: any) => ({
              ...transformLegacyToClub(club),
              id: club.id,
              createdAt: club.createdAt || new Date().toISOString(),
              updatedAt: club.updatedAt || new Date().toISOString(),
            }));
            newClubsStore.getState().setEntities(clubsEntities);
          }

          // Sync teams
          if (legacyState.teams?.length > 0) {
            const { useTeamsStore: newTeamsStore } = require('../entities/team');
            const teamsEntities: TeamEntity[] = legacyState.teams.map((team: any) => ({
              ...transformLegacyToTeam(team),
              id: team.id,
              createdAt: team.createdAt || new Date().toISOString(),
              updatedAt: team.updatedAt || new Date().toISOString(),
            }));
            newTeamsStore.getState().setEntities(teamsEntities);
          }

          // Sync members
          if (legacyState.members?.length > 0) {
            const { useMembersStore: newMembersStore } = require('../entities/member');
            const membersEntities: MemberEntity[] = legacyState.members.map((member: any) => ({
              ...transformLegacyToMember(member),
              id: member.id,
              createdAt: member.createdAt || new Date().toISOString(),
              updatedAt: member.updatedAt || new Date().toISOString(),
            }));
            newMembersStore.getState().setEntities(membersEntities);
          }

          // Sync navigation
          if (legacyState.navigation) {
            const { useNavigationStore } = require('../entities/navigation');
            useNavigationStore.getState().setSelectedClub(legacyState.navigation.selectedClubId);
            useNavigationStore.getState().setSelectedTeam(legacyState.navigation.selectedTeamId);
          }

        } catch (error) {
          console.error('Sync from legacy failed:', error);
        }
      },

      syncFromNewToLegacy: () => {
        const state = get();
        if (!state.syncToLegacy || !state.legacyStore) return;

        try {
          console.log('🔄 Syncing from new to legacy stores...');

          // Import new stores
          const { useClubsStore: newClubsStore } = require('../entities/club');
          const { useTeamsStore: newTeamsStore } = require('../entities/team');
          const { useMembersStore: newMembersStore } = require('../entities/member');
          const { useNavigationStore } = require('../entities/navigation');

          const newClubsState = newClubsStore.getState();
          const newTeamsState = newTeamsStore.getState();
          const newMembersState = newMembersStore.getState();
          const newNavigationState = useNavigationStore.getState();

          // Convert new format to legacy format
          const legacyClubs = Object.values(newClubsState.entities).map(transformClubToLegacy);
          const legacyTeams = Object.values(newTeamsState.entities).map(transformTeamToLegacy);
          const legacyMembers = Object.values(newMembersState.entities).map(transformMemberToLegacy);

          // Update legacy store with new data
          state.legacyStore.setState({
            clubs: legacyClubs,
            teams: legacyTeams,
            members: legacyMembers,
            selectedClub: legacyClubs.find(c => c.id === newNavigationState.selectedClubId) || null,
            selectedTeam: legacyTeams.find(t => t.id === newNavigationState.selectedTeamId) || null,
            navigation: {
              selectedClubId: newNavigationState.selectedClubId,
              selectedTeamId: newNavigationState.selectedTeamId,
              clubs: legacyClubs,
              teams: legacyTeams,
            },
          });

        } catch (error) {
          console.error('Sync to legacy failed:', error);
        }
      },

      setDualWriteMode: (enabled: boolean) => set({ enableDualWrite: enabled }),
      setSyncFromLegacy: (enabled: boolean) => set({ syncFromLegacy: enabled }),
      setSyncToLegacy: (enabled: boolean) => set({ syncToLegacy: enabled }),

      resetMigration: () => set(() => ({
        isInitialized: false,
        isMigrating: false,
        migrationProgress: 0,
        migrationResult: undefined,
        enableDualWrite: true,
        syncFromLegacy: true,
        syncToLegacy: true,
        legacyStore: null,
      })),

      getMigrationStatus: () => get().migrationResult || null,
    })
  )
);

// =====================================================
// HOOKS FOR BRIDGE USAGE
// =====================================================

export const useClubsMigration = () => {
  const bridge = useClubsMigrationBridge();
  
  return {
    isInitialized: bridge.isInitialized,
    isMigrating: bridge.isMigrating,
    migrationProgress: bridge.migrationProgress,
    migrationResult: bridge.migrationResult,
    initializeMigration: bridge.initializeMigration,
    migrateData: bridge.migrateData,
    fullMigration: bridge.fullMigration,
    resetMigration: bridge.resetMigration,
    getMigrationStatus: bridge.getMigrationStatus,
  };
};

// Legacy compatibility exports
export const useClubsStoreBridge = useClubsMigrationBridge;
</textarea>

Let me fix the error in the member transformation file:
<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
search_replace
