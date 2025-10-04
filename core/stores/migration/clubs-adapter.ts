// =====================================================
// CLUBS MIGRATION ADAPTER - BACKWARD COMPATIBILITY
// =====================================================

import { useCallback, useMemo } from 'react';

// Import new entity stores
import { useClubsStore as useNewClubsStore } from '../entities/club';
import { useMembersStore as useNewMembersStore } from '../entities/member';
import { useNavigationStore } from '../entities/navigation';
import { useTeamsStore as useNewTeamsStore } from '../entities/team';

// =====================================================
// LEGACY COMPATIBILITY TYPES
// =====================================================

interface LegacyClubWithStats {
  id: string;
  name: string;
  description: string;
  location: string;
  contactEmail: string;
  website?: string;
  logoUrl?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  isPublic: boolean;
  timezone: string;
  language: string;
  maxTeams: number;
  maxMembersPerTeam: number;
  subscriptionType: string;
  foundedYear?: number;
  foundedBy?: string;
  category: string;
  teamCount?: number;
  memberCount?: number;
  sessionCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface LegacyTeamWithClub {
  id: string;
  clubId: string;
  club_id: string;
  name: string;
  description?: string;
  category: string;
  gender: string;
  ageRange: string;
  age_range: string;
  level: string;
  practiceDays: string[];
  practice_days: string[];
  practiceTimes: string[];
  practice_times: string[];
  practiceLocation: string;
  practice_location: string;
  coachId?: string;
  coach_id?: string;
  assistantCoachId?: string;
  assistant_coach_id?: string;
  captainId?: string;
  captain_id?: string;
  isActive: boolean;
  is_active: boolean;
  isAcceptingMembers: boolean;
  is_accepting_members: boolean;
  maxMembers: number;
  max_members: number;
  minAge?: number;
  min_age?: number;
  maxAge?: number;
  max_age?: number;
  competitionLevel: string;
  competition_level: string;
  targetCompetitions?: string[];
  target_competitions?: string[];
  memberCount?: number;
  member_count?: number;
  sessionCount?: number;
  session_count?: number;
  lastActivity?: string;
  last_activity?: string;
  createdBy?: string;
  created_by?: string;
  foundedDate?: string;
  founded_date?: string;
  colors: { primary: string; secondary: string };
  createdAt: string;
  updatedAt: string;
}

interface LegacyTeamMemberWithUser {
  id: string;
  teamId: string;
  team_id: string;
  userId: string;
  user_id: string;
  clubId: string;
  club_id: string;
  role: string;
  permissions: any;
  isActive: boolean;
  is_active: boolean;
  joinedAt: string;
  joined_at: string;
  leftAt?: string;
  left_at?: string;
  position?: string;
  weight?: number;
  height?: number;
  firstName: string;
  first_name: string;
  lastName: string;
  last_name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  birth_date?: string;
  gender?: string;
  emergencyContact?: any;
  emergency_contact?: any;
  skillLevel: string;
  skill_level: string;
  preferredEvents?: string[];
  preferred_events?: string[];
  personalBest?: any;
  personal_best?: any;
  trainingZones?: any;
  training_zones?: any;
  medicalInfo?: any;
  medical_info?: any;
  availability: string[];
  sessionCount?: number;
  session_count?: number;
  lastSession?: string;
  last_session?: string;
  attendanceRate?: number;
  attendance_rate?: number;
  createdAt: string;
  updatedAt: string;
}

interface LegacyNavigationState {
  clubs: LegacyClubWithStats[];
  teams: LegacyTeamWithClub[];
  selectedClubId: string | null;
  selectedTeamId: string | null;
  isLoading: boolean;
  error: string | null;
}

// =====================================================
// DATA TRANSFORMATION UTILITIES
// =====================================================

const transformClubToLegacy = (club: any): LegacyClubWithStats => ({
  id: club.id,
  name: club.name,
  description: club.description || '',
  location: club.location || '',
  contactEmail: club.contactEmail || '',
  website: club.website,
  logoUrl: club.logoUrl,
  phone: club.phone,
  address: club.address,
  isActive: club.isActive ?? true,
  isPublic: club.isPublic ?? true,
  timezone: club.timezone || 'UTC',
  language: club.language || 'es',
  maxTeams: club.maxTeams || 5,
  maxMembersPerTeam: club.maxMembersPerTeam || 20,
  subscriptionType: club.subscriptionType || 'basic',
  foundedYear: club.foundedYear,
  foundedBy: club.foundedBy,
  category: club.category || 'mixed',
  teamCount: club.teamCount,
  memberCount: club.memberCount,
  sessionCount: club.sessionCount,
  createdAt: club.createdAt,
  updatedAt: club.updatedAt,
});

const transformTeamToLegacy = (team: any): LegacyTeamWithClub => ({
  id: team.id,
  clubId: team.clubId,
  club_id: team.clubId,
  name: team.name,
  description: team.description,
  category: team.category,
  gender: team.gender,
  ageRange: team.ageRange,
  age_range: team.ageRange,
  level: team.level,
  practiceDays: team.practiceDays,
  practice_days: team.practiceDays,
  practiceTimes: team.practiceTimes,
  practice_times: team.practiceTimes,
  practiceLocation: team.practiceLocation,
  practice_location: team.practiceLocation,
  coachId: team.coachId,
  coach_id: team.coachId,
  assistantCoachId: team.assistantCoachId,
  assistant_coach_id: team.assistantCoachId,
  captainId: team.captainId,
  captain_id: team.captainId,
  isActive: team.isActive,
  is_active: team.isActive,
  isAcceptingMembers: team.isAcceptingMembers,
  is_accepting_members: team.isAcceptingMembers,
  maxMembers: team.maxMembers,
  max_members: team.maxMembers,
  minAge: team.minAge,
  min_age: team.minAge,
  maxAge: team.maxAge,
  max_age: team.maxAge,
  competitionLevel: team.competitionLevel,
  competition_level: team.competitionLevel,
  targetCompetitions: team.targetCompetitions,
  target_competitions: team.targetCompetitions,
  memberCount: team.memberCount,
  member_count: team.memberCount,
  sessionCount: team.sessionCount,
  session_count: team.sessionCount,
  lastActivity: team.lastActivity,
  last_activity: team.lastActivity,
  createdBy: team.createdBy,
  created_by: team.createdBy,
  foundedDate: team.foundedDate,
  founded_date: team.foundedDate,
  colors: team.colors,
  createdAt: team.createdAt,
  updatedAt: team.updatedAt,
});

const transformMemberToLegacy = (member: any): LegacyTeamMemberWithUser => ({
  id: member.id,
  teamId: member.teamId,
  team_id: member.teamId,
  userId: member.userId,
  user_id: member.userId,
  clubId: member.clubId,
  club_id: member.clubId,
  role: member.role,
  permissions: member.permissions,
  isActive: member.isActive,
  is_active: member.isActive,
  joinedAt: member.joinedAt,
  joined_at: member.joinedAt,
  leftAt: member.leftAt,
  left_at: member.leftAt,
  position: member.position,
  weight: member.weight,
  height: member.height,
  firstName: member.firstName,
  first_name: member.firstName,
  lastName: member.lastName,
  last_name: member.lastName,
  email: member.email,
  phone: member.phone,
  birthDate: member.birthDate,
  birth_date: member.birthDate,
  gender: member.gender,
  emergencyContact: member.emergencyContact,
  emergency_contact: member.emergencyContact,
  skillLevel: member.skillLevel,
  skill_level: member.skillLevel,
  preferredEvents: member.preferredEvents,
  preferred_events: member.preferredEvents,
  personalBest: member.personalBest,
  personal_best: member.personalBest,
  trainingZones: member.trainingZones,
  training_zones: member.trainingZones,
  medicalInfo: member.medicalInfo,
  medical_info: member.medicalInfo,
  availability: member.availability,
  sessionCount: member.sessionCount,
  session_count: member.sessionCount,
  lastSession: member.lastSession,
  last_session: member.lastSession,
  attendanceRate: member.attendanceRate,
  attendance_rate: member.attendanceRate,
  createdAt: member.createdAt,
  updatedAt: member.updatedAt,
});

// =====================================================
// LEGACY COMPATIBILITY HOOK
// =====================================================

/**
 * Main adapter hook that provides the legacy ClubsStore API
 * while using the new normalized entity stores underneath
 */
export const useClubsStoreAdapter = () => {
  // Get data from new normalized stores
  const clubsStore = useNewClubsStore();
  const teamsStore = useNewTeamsStore();
  const membersStore = useNewMembersStore();
  const navigationStore = useNavigationStore();

  // Transform data to legacy format
  const clubs = useMemo(() => 
    Object.values(clubsStore.entities).map(transformClubToLegacy),
    [clubsStore.entities]
  );

  const teams = useMemo(() => 
    Object.values(teamsStore.entities).map(transformTeamToLegacy),
    [teamsStore.entities]
  );

  const members = useMemo(() => 
    Object.values(membersStore.entities).map(transformMemberToLegacy),
    [membersStore.entities]
  );

  const selectedClub = useMemo(() => 
    clubs.find(c => c.id === navigationStore.selectedClubId) || null,
    [clubs, navigationStore.selectedClubId]
  );

  const selectedTeam = useMemo(() => 
    teams.find(t => t.id === navigationStore.selectedTeamId) || null,
    [teams, navigationStore.selectedTeamId]
  );

  const navigation: LegacyNavigationState = useMemo(() => ({
    clubs,
    teams,
    selectedClubId: navigationStore.selectedClubId,
    selectedTeamId: navigationStore.selectedTeamId,
    isLoading: clubsStore.isLoading || teamsStore.isLoading || membersStore.isLoading,
    error: clubsStore.error || teamsStore.error || membersStore.error,
  }), [clubs, teams, navigationStore.selectedClubId, navigationStore.selectedTeamId, 
       clubsStore.isLoading, teamsStore.isLoading, membersStore.isLoading,
       clubsStore.error, teamsStore.error, membersStore.error]);

  // Create dual-write actions that work with both legacy API and new stores
  const createNewClub = useCallback(async (clubData: any) => {
    return await clubsStore.createNewClub(clubData);
  }, [clubsStore]);

  const updateExistingClub = useCallback(async (clubData: any) => {
    return await clubsStore.updateExistingClub(clubData);
  }, [clubsStore]);

  const deleteExistingClub = useCallback(async (clubId: string) => {
    return await clubsStore.deleteExistingClub(clubId);
  }, [clubsStore]);

  const loadClubs = useCallback(async (filters?: any) => {
    await clubsStore.loadClubs(filters);
  }, [clubsStore]);

  const loadClubById = useCallback(async (clubId: string) => {
    await clubsStore.loadClubById(clubId);
  }, [clubsStore]);

  const createNewTeam = useCallback(async (teamData: any) => {
    return await teamsStore.createNewTeam(teamData);
  }, [teamsStore]);

  const updateExistingTeam = useCallback(async (teamData: any) => {
    return await teamsStore.updateExistingTeam(teamData);
  }, [teamsStore]);

  const deleteExistingTeam = useCallback(async (teamId: string) => {
    return await teamsStore.deleteExistingTeam(teamId);
  }, [teamsStore]);

  const loadTeamsByClub = useCallback(async (clubId: string, filters?: any) => {
    await teamsStore.loadTeamsByClub(clubId, filters);
  }, [teamsStore]);

  const loadTeamById = useCallback(async (teamId: string) => {
    await teamsStore.loadTeamById(teamId);
  }, [teamsStore]);

  const addNewMember = useCallback(async (memberData: any) => {
    return await membersStore.addNewMember(memberData);
  }, [membersStore]);

  const updateExistingMember = useCallback(async (memberData: any) => {
    return await membersStore.updateExistingMember(memberData);
  }, [membersStore]);

  const removeExistingMember = useCallback(async (memberId: string) => {
    return await membersStore.removeExistingMember(memberId);
  }, [membersStore]);

  const loadTeamMembers = useCallback(async (teamId: string, filters?: any) => {
    await membersStore.loadTeamMembers(teamId, filters);
  }, [membersStore]);

  const setSelectedClub = useCallback(async (clubId: string | null) => {
    navigationStore.setSelectedClub(clubId);
  }, [navigationStore]);

  const setSelectedTeam = useCallback(async (teamId: string | null) => {
    navigationStore.setSelectedTeam(teamId);
  }, [navigationStore]);

  const clearSelection = useCallback(() => {
    navigationStore.clearSelection();
  }, [navigationStore]);

  const clearError = useCallback(() => {
    clubsStore.clearError();
    teamsStore.clearError();
    membersStore.clearError();
  }, [clubsStore, teamsStore, membersStore]);

  const checkClubAccess = useCallback(async (clubId: string) => {
    return await clubsStore.checkClubAccess(clubId);
  }, [clubsStore]);

  // Return legacy-compatible interface
  return {
    // Data (legacy format)
    clubs,
    teams,
    members,
    selectedClub,
    selectedTeam,
    navigation,
    isLoading: navigation.isLoading,
    error: navigation.error,

    // Club actions
    createNewClub,
    updateExistingClub,
    deleteExistingClub,
    loadClubs,
    loadClubById,

    // Team actions
    createNewTeam,
    updateExistingTeam,
    deleteExistingTeam,
    loadTeamsByClub,
    loadTeamById,

    // Member actions
    addNewMember,
    updateExistingMember,
    removeExistingMember,
    loadTeamMembers,

    // Navigation actions
    setSelectedClub,
    setSelectedTeam,
    clearSelection,

    // Utility actions
    clearError,
    checkClubAccess,

    // Additional helpers (exposed from new stores)
    clubsActions: clubsStore,
    teamsActions: teamsStore,
    membersActions: membersStore,
    navigationActions: navigationStore,
  };
};

// =====================================================
// HOOK-SPECIFIC ADAPTERS (for granular usage)
// =====================================================

/**
 * Hook adapter for club-related functionality
 */
export const useClubsData = () => {
  const { clubs, selectedClub, isLoading, error } = useClubsStoreAdapter();
  
  return {
    clubs,
    selectedClub,
    isLoading,
    error,
    getClubById: (id: string) => clubs.find(club => club.id === id),
    getActiveClubs: () => clubs.filter(club => club.isActive),
    getClubsByCategory: (category: string) => clubs.filter(club => club.category === category),
  };
};

/**
 * Hook adapter for team-related functionality
 */
export const useTeamsData = () => {
  const { teams, selectedTeam, isLoading, error } = useClubsStoreAdapter();
  
  return {
    teams,
    selectedTeam,
    isLoading,
    error,
    getTeamById: (id: string) => teams.find(team => team.id === id),
    getTeamsByClub: (clubId: string) => teams.filter(team => team.clubId === clubId || team.club_id === clubId),
    getActiveTeams: () => teams.filter(team => team.isActive),
  };
};

/**
 * Hook adapter for member-related functionality
 */
export const useMembersData = () => {
  const { members, isLoading, error } = useClubsStoreAdapter();
  
  return {
    members,
    isLoading,
    error,
    getMemberById: (id: string) => members.find(member => member.id === id),
    getMembersByTeam: (teamId: string) => members.filter(member => member.teamId === teamId || member.team_id === teamId),
    getActiveMembers: () => members.filter(member => member.isActive),
  };
};

// =====================================================
// EXPORTS FOR BACKWARD COMPATIBILITY
// =====================================================

// Main adapter - direct replacement for legacy useClubsStore
export const useClubsStore = useClubsStoreAdapter;

// Individual adapters for specific data
export { useClubsData, useMembersData, useTeamsData };

