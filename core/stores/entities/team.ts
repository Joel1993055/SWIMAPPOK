// =====================================================
// TEAM ENTITY STORE - NORMALIZED ARCHITECTURE
// =====================================================

import { useMemo } from 'react';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { BaseEntity, EntityState, createEntityId, createTimestamp, normalizeEntities } from './types';

// =====================================================
// TEAM ENTITY TYPE
// =====================================================

export interface TeamEntity extends BaseEntity {
  // Core team data
  clubId: string;            // Foreign key to club
  name: string;
  description?: string;
  
  // Team characteristics
  category: 'senior' | 'junior' | 'masters' | 'novice' | 'competitive';
  gender: 'masculino' | 'femenino' | 'mixto';
  ageRange: string;          // e.g., "18-25", "16-20", "50+"
  level: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  
  // Scheduling
  practiceDays: string[];    // ['monday', 'wednesday', 'friday']
  practiceTimes: string[];   // ['18:00', '19:30']
  practiceLocation: string;
  
  // Coach and leadership
  coachId?: string;          // Foreign key to user/coach
  assistantCoachId?: string;
  captainId?: string;         // Foreign key to member
  
  // Status and settings
  isActive: boolean;
  isAcceptingMembers: boolean;
  maxMembers: number;
  minAge?: number;
  maxAge?: number;
  
  // Competition settings
  competitionLevel: 'local' | 'regional' | 'national' | 'international';
  targetCompetitions: string[];
  
  // Statistics (computed fields)
  memberCount?: number;
  sessionCount?: number;
  lastActivity?: string;
  
  // Additional metadata
  createdBy?: string;        // Foreign key to user
  foundedDate?: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

// =====================================================
// TEAM STORE STATE
// =====================================================

interface TeamsState extends EntityState<TeamEntity> {
  // String-based indexers for efficient lookups
  byClub: Record<string, string[]>;              // clubId -> teamIds[]
  byCategory: Record<string, string[]>;        // category -> teamIds[]
  byGender: Record<string, string[]>;           // gender -> teamIds[]
  byLevel: Record<string, string[]>;            // level -> teamIds[]
  byCoach: Record<string, string[]>;            // coachId -> teamIds[]
  byStatus: { active: string[], inactive: string[] };
  
  // CRUD operations (from EntityActions)
  addEntity: (entity: Omit<TeamEntity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntity: (id: string, updates: Partial<TeamEntity>) => void;
  deleteEntity: (id: string) => void;
  setEntities: (entities: TeamEntity[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearEntities: () => void;
  getEntity: (id: string) => TeamEntity | undefined;
  hasEntity: (id: string) => boolean;
  
  // Legacy aliases for backward compatibility
  createNewTeam: (teamData: any) => Promise<boolean>;
  updateExistingTeam: (teamData: any) => Promise<boolean>;
  deleteExistingTeam: (teamId: string) => Promise<boolean>;
  loadTeamsByClub: (clubId: string, filters?: any) => Promise<void>;
  loadTeamById: (teamId: string) => Promise<void>;
  
  // Team-specific selectors
  getTeamsByClub: (clubId: string) => TeamEntity[];
  getTeamsByCategory: (category: string) => TeamEntity[];
  getTeamsByGender: (gender: string) => TeamEntity[];
  getTeamsByLevel: (level: string) => TeamEntity[];
  getTeamsByCoach: (coachId: string) => TeamEntity[];
  getActiveTeams: () => TeamEntity[];
  getInactiveTeams: () => TeamEntity[];
}

// =====================================================
// HELPERS
// =====================================================

const addEntityToState = <T extends BaseEntity>(
  state: EntityState<T>,
  entity: T
): EntityState<T> => ({
  ...state,
  entities: { ...state.entities, [entity.id]: entity },
  ids: [...state.ids, entity.id],
});

const updateEntityInState = <T extends BaseEntity>(
  state: EntityState<T>,
  id: string,
  updates: Partial<T>
): EntityState<T> => {
  if (!state.entities[id]) return state;
  
  return {
    ...state,
    entities: {
      ...state.entities,
      [id]: { ...state.entities[id], ...updates, updatedAt: createTimestamp() },
    },
  };
};

const deleteEntityFromState = <T extends BaseEntity>(
  state: EntityState<T>,
  id: string
): EntityState<T> => {
  const { [id]: deleted, ...remainingEntities } = state.entities;
  return {
    ...state,
    entities: remainingEntities,
    ids: state.ids.filter(entityId => entityId !== id),
  };
};

// =====================================================
// INITIAL STATE
// =====================================================

const initialState: Omit<TeamsState, 'addEntity' | 'updateEntity' | 'deleteEntity' | 'setEntities' | 'setLoading' | 'setError' | 'clearEntities' | 'getEntity' | 'hasEntity' | 'createNewTeam' | 'updateExistingTeam' | 'deleteExistingTeam' | 'loadTeamsByClub' | 'loadTeamById' | 'getTeamsByClub' | 'getTeamsByCategory' | 'getTeamsByGender' | 'getTeamsByLevel' | 'getTeamsByCoach' | 'getActiveTeams' | 'getInactiveTeams'> = {
  // Entity state
  entities: {},
  ids: [],
  isLoading: false,
  error: null,
  
  // Team-specific indexers
  byClub: {},
  byCategory: {},
  byGender: {},
  byLevel: {},
  byCoach: {},
  byStatus: { active: [], inactive: [] },
};

// =====================================================
// TEAMS STORE
// =====================================================

export const useTeamsStore = create<TeamsState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...initialState,

        // =====================================================
        // ENTITY CRUD OPERATIONS
        // =====================================================

        addEntity: (teamData: Omit<TeamEntity, 'id' | 'createdAt' | 'updatedAt'>) => set((state) => {
          const team: TeamEntity = {
            ...teamData,
            id: createEntityId(),
            createdAt: createTimestamp(),
            updatedAt: createTimestamp(),
          };

          const newState = addEntityToState(state, team);
          
          // Update indexers
          const clubTeams = state.byClub[team.clubId] || [];
          const categoryTeams = state.byCategory[team.category] || [];
          const genderTeams = state.byGender[team.gender] || [];
          const levelTeams = state.byLevel[team.level] || [];
          const coachTeams = team.coachId ? (state.byCoach[team.coachId] || []) : [];
          const statusTeams = team.isActive ? state.byStatus.active : state.byStatus.inactive;
          
          return {
            ...newState,
            byClub: { ...state.byClub, [team.clubId]: [...clubTeams, team.id] },
            byCategory: { ...state.byCategory, [team.category]: [...categoryTeams, team.id] },
            byGender: { ...state.byGender, [team.gender]: [...genderTeams, team.id] },
            byLevel: { ...state.byLevel, [team.level]: [...levelTeams, team.id] },
            byCoach: team.coachId ? { ...state.byCoach, [team.coachId]: [...coachTeams, team.id] } : state.byCoach,
            byStatus: {
              ...state.byStatus,
              [team.isActive ? 'active' : 'inactive']: [...statusTeams, team.id]
            },
          };
        }),

        updateEntity: (id, updates) => set((state) => {
          const team = state.entities[id];
          if (!team) return state;
          
          const newState = updateEntityInState(state, id, updates);
          if (newState === state) return state; // No changes

          let updatedIndexers = {};
          
          // Update club indexer if club changed
          if (updates.clubId && updates.clubId !== team.clubId) {
            updatedIndexers = {
              ...updatedIndexers,
              byClub: {
                ...state.byClub,
                [team.clubId]: state.byClub[team.clubId]?.filter(teamId => teamId !== id) || [],
                [updates.clubId]: [...(state.byClub[updates.clubId] || []), id]
              }
            };
          }
          
          // Update category indexer if category changed
          if (updates.category && updates.category !== team.category) {
            updatedIndexers = {
              ...updatedIndexers,
              byCategory: {
                ...state.byCategory,
                [team.category]: state.byCategory[team.category]?.filter(teamId => teamId !== id) || [],
                [updates.category]: [...(state.byCategory[updates.category] || []), id]
              }
            };
          }
          
          // Update gender indexer if gender changed
          if (updates.gender && updates.gender !== team.gender) {
            updatedIndexers = {
              ...updatedIndexers,
              byGender: {
                ...state.byGender,
                [team.gender]: state.byGender[team.gender]?.filter(teamId => teamId !== id) || [],
                [updates.gender]: [...(state.byGender[updates.gender] || []), id]
              }
            };
          }
          
          // Update level indexer if level changed
          if (updates.level && updates.level !== team.level) {
            updatedIndexers = {
              ...updatedIndexers,
              byLevel: {
                ...state.byLevel,
                [team.level]: state.byLevel[team.level]?.filter(teamId => teamId !== id) || [],
                [updates.level]: [...(state.byLevel[updates.level] || []), id]
              }
            };
          }
          
          // Update coach indexer if coach changed
          if (updates.coachId !== undefined && updates.coachId !== team.coachId) {
            updatedIndexers = {
              ...updatedIndexers,
              byCoach: {
                ...state.byCoach,
                // Remove from old coach
                ...(team.coachId ? {
                  [team.coachId]: state.byCoach[team.coachId]?.filter(teamId => teamId !== id) || []
                } : {}),
                // Add to new coach
                ...(updates.coachId ? {
                  [updates.coachId]: [...(state.byCoach[updates.coachId] || []), id]
                } : {})
              }
            };
          }
          
          // Update status indexer if active status changed
          if (updates.isActive !== undefined && updates.isActive !== team.isActive) {
            updatedIndexers = {
              ...updatedIndexers,
              byStatus: {
                ...state.byStatus,
                active: updates.isActive 
                  ? [...state.byStatus.active.filter(teamId => teamId !== id), id]
                  : state.byStatus.active.filter(teamId => teamId !== id),
                inactive: updates.isActive 
                  ? state.byStatus.inactive.filter(teamId => teamId !== id)
                  : [...state.byStatus.inactive.filter(teamId => teamId !== id), id]
              }
            };
          }

          return {
            ...newState,
            ...updatedIndexers,
          };
        }),

        deleteEntity: (id) => set((state) => {
          const team = state.entities[id];
          if (!team) return state;

          const newState = deleteEntityFromState(state, id);
          
          // Clean up indexers
          return {
            ...newState,
            byClub: {
              ...state.byClub,
              [team.clubId]: state.byClub[team.clubId]?.filter(teamId => teamId !== id) || []
            },
            byCategory: {
              ...state.byCategory,
              [team.category]: state.byCategory[team.category]?.filter(teamId => teamId !== id) || []
            },
            byGender: {
              ...state.byGender,
              [team.gender]: state.byGender[team.gender]?.filter(teamId => teamId !== id) || []
            },
            byLevel: {
              ...state.byLevel,
              [team.level]: state.byLevel[team.level]?.filter(teamId => teamId !== id) || []
            },
            byCoach: team.coachId ? {
              ...state.byCoach,
              [team.coachId]: state.byCoach[team.coachId]?.filter(teamId => teamId !== id) || []
            } : state.byCoach,
            byStatus: {
              active: state.byStatus.active.filter(teamId => teamId !== id),
              inactive: state.byStatus.inactive.filter(teamId => teamId !== id)
            },
          };
        }),

        setEntities: (teams) => set(() => {
          const normalized = normalizeEntities(teams);
          
          // Rebuild indexers
          const byClub: Record<string, string[]> = {};
          const byCategory: Record<string, string[]> = {};
          const byGender: Record<string, string[]> = {};
          const byLevel: Record<string, string[]> = {};
          const byCoach: Record<string, string[]> = {};
          const byStatus = { active: [] as string[], inactive: [] as string[] };

          teams.forEach(team => {
            // Club indexer
            if (!byClub[team.clubId]) byClub[team.clubId] = [];
            byClub[team.clubId].push(team.id);
            
            // Category indexer
            if (!byCategory[team.category]) byCategory[team.category] = [];
            byCategory[team.category].push(team.id);
            
            // Gender indexer
            if (!byGender[team.gender]) byGender[team.gender] = [];
            byGender[team.gender].push(team.id);
            
            // Level indexer
            if (!byLevel[team.level]) byLevel[team.level] = [];
            byLevel[team.level].push(team.id);
            
            // Coach indexer
            if (team.coachId) {
              if (!byCoach[team.coachId]) byCoach[team.coachId] = [];
              byCoach[team.coachId].push(team.id);
            }
            
            // Status indexer
            if (team.isActive) {
              byStatus.active.push(team.id);
            } else {
              byStatus.inactive.push(team.id);
            }
          });

          return {
            ...normalized,
            byClub,
            byCategory,
            byGender,
            byLevel,
            byCoach,
            byStatus,
          };
        }),

        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        clearEntities: () => set(() => initialState),

        getEntity: (id) => get().entities[id],
        hasEntity: (id) => id in get().entities,

        // =====================================================
        // LEGACY API COMPATIBILITY
        // =====================================================

        createNewTeam: async (teamData: any) => {
          try {
            const { createTeam } = await import('@/infra/config/actions/clubs');
            
            set({ isLoading: true, error: null });
            const response = await createTeam(teamData);
            
            if (response.success && response.data) {
              // Transform to entity format and add
              const teamEntity: Omit<TeamEntity, 'id' | 'createdAt' | 'updatedAt'> = {
                clubId: response.data.clubId || response.data.club_id,
                name: response.data.name,
                description: response.data.description,
                category: response.data.category || 'senior',
                gender: response.data.gender || 'mixto',
                ageRange: response.data.ageRange || response.data.age_range || '18+',
                level: response.data.level || 'intermediate',
                practiceDays: response.data.practiceDays || response.data.practice_days || [],
                practiceTimes: response.data.practiceTimes || response.data.practice_times || [],
                practiceLocation: response.data.practiceLocation || response.data.practice_location || '',
                coachId: response.data.coachId || response.data.coach_id,
                assistantCoachId: response.data.assistantCoachId || response.data.assistant_coach_id,
                captainId: response.data.captainId || response.data.captain_id,
                isActive: response.data.isActive ?? response.data.is_active ?? true,
                isAcceptingMembers: response.data.isAcceptingMembers ?? response.data.is_accepting_members ?? true,
                maxMembers: response.data.maxMembers || response.data.max_members || 20,
                minAge: response.data.minAge || response.data.min_age,
                maxAge: response.data.maxAge || response.data.max_age,
                competitionLevel: response.data.competitionLevel || response.data.competition_level || 'local',
                targetCompetitions: response.data.targetCompetitions || response.data.target_competitions || [],
                memberCount: response.data.memberCount || response.data.member_count,
                sessionCount: response.data.sessionCount || response.data.session_count,
                lastActivity: response.data.lastActivity || response.data.last_activity,
                createdBy: response.data.createdBy || response.data.created_by,
                foundedDate: response.data.foundedDate || response.data.founded_date,
                colors: response.data.colors || { primary: '#0066CC', secondary: '#FFFFFF' },
              };
              
              get().addEntity(teamEntity);
              set({ isLoading: false });
              return true;
            } else {
              throw new Error(response.error || 'Error al crear equipo');
            }
          } catch (error) {
            console.error('Create team error:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
            return false;
          }
        },

        updateExistingTeam: async (teamData: any) => {
          try {
            const { updateTeam } = await import('@/infra/config/actions/clubs');
            
            set({ isLoading: true, error: null });
            const response = await updateTeam(teamData);
            
            if (response.success && response.data) {
              // Create updates object
              const updates: Partial<TeamEntity> = {};
              
              // Map response fields to entity fields
              if (response.data.name !== undefined) updates.name = response.data.name;
              if (response.data.description !== undefined) updates.description = response.data.description;
              if (response.data.category !== undefined) updates.category = response.data.category;
              if (response.data.gender !== undefined) updates.gender = response.data.gender;
              if (response.data.ageRange !== undefined) updates.ageRange = response.data.ageRange;
              if (response.data.level !== undefined) updates.level = response.data.level;
              if (response.data.practiceDays !== undefined) updates.practiceDays = response.data.practiceDays;
              if (response.data.practiceTimes !== undefined) updates.practiceTimes = response.data.practiceTimes;
              if (response.data.practiceLocation !== undefined) updates.practiceLocation = response.data.practiceLocation;
              if (response.data.coachId !== undefined) updates.coachId = response.data.coachId;
              if (response.data.assistantCoachId !== undefined) updates.assistantCoachId = response.data.assistantCoachId;
              if (response.data.captainId !== undefined) updates.captainId = response.data.captainId;
              if (response.data.isActive !== undefined) updates.isActive = response.data.isActive;
              if (response.data.isAcceptingMembers !== undefined) updates.isAcceptingMembers = response.data.isAcceptingMembers;
              if (response.data.maxMembers !== undefined) updates.maxMembers = response.data.maxMembers;
              if (response.data.minAge !== undefined) updates.minAge = response.data.minAge;
              if (response.data.maxAge !== undefined) updates.maxAge = response.data.maxAge;
              if (response.data.competitionLevel !== undefined) updates.competitionLevel = response.data.competitionLevel;
              if (response.data.targetCompetitions !== undefined) updates.targetCompetitions = response.data.targetCompetitions;
              
              get().updateEntity(teamData.id, updates);
              set({ isLoading: false });
              return true;
            } else {
              throw new Error(response.error || 'Error al actualizar equipo');
            }
          } catch (error) {
            console.error('Update team error:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
            return false;
          }
        },

        deleteExistingTeam: async (teamId: string) => {
          try {
            const { deleteTeam } = await import('@/infra/config/actions/clubs');
            
            set({ isLoading: true, error: null });
            const response = await deleteTeam(teamId);
            
            if (response.success) {
              get().deleteEntity(teamId);
              set({ isLoading: false });
              return true;
            } else {
              throw new Error(response.error || 'Error al eliminar equipo');
            }
          } catch (error) {
            console.error('Delete team error:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
            return false;
          }
        },

        loadTeamsByClub: async (clubId: string, filters?: any) => {
          try {
            const { getTeamsByClub } = await import('@/infra/config/actions/clubs');
            
            set({ isLoading: true, error: null });
            const response = await getTeamsByClub(clubId, filters);
            
            if (response.success && response.data) {
              // Transform to entity format
              const teamsEntities: TeamEntity[] = response.data.map((team: any) => ({
                id: team.id,
                clubId: team.clubId || team.club_id,
                name: team.name,
                description: team.description,
                category: team.category || 'senior',
                gender: team.gender || 'mixto',
                ageRange: team.ageRange || team.age_range || '18+',
                level: team.level || 'intermediate',
                practiceDays: team.practiceDays || team.practice_days || [],
                practiceTimes: team.practiceTimes || team.practice_times || [],
                practiceLocation: team.practiceLocation || team.practice_location || '',
                coachId: team.coachId || team.coach_id,
                assistantCoachId: team.assistantCoachId || team.assistant_coach_id,
                captainId: team.captainId || team.captain_id,
                isActive: team.isActive ?? team.is_active ?? true,
                isAcceptingMembers: team.isAcceptingMembers ?? team.is_accepting_members ?? true,
                maxMembers: team.maxMembers || team.max_members || 20,
                minAge: team.minAge || team.min_age,
                maxAge: team.maxAge || team.max_age,
                competitionLevel: team.competitionLevel || team.competition_level || 'local',
                targetCompetitions: team.targetCompetitions || team.target_competitions || [],
                memberCount: team.memberCount || team.member_count,
                sessionCount: team.sessionCount || team.session_count,
                lastActivity: team.lastActivity || team.last_activity,
                createdBy: team.createdBy || team.created_by,
                foundedDate: team.foundedDate || team.founded_date,
                colors: team.colors || { primary: '#0066CC', secondary: '#FFFFFF' },
                createdAt: team.createdAt || createTimestamp(),
                updatedAt: team.updatedAt || createTimestamp(),
              }));
              
              get().setEntities(teamsEntities);
              set({ isLoading: false });
            } else {
              throw new Error(response.error || 'Error al cargar equipos');
            }
          } catch (error) {
            console.error('Load teams by club error:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
          }
        },

        loadTeamById: async (teamId: string) => {
          try {
            const { getTeamById } = await import('@/infra/config/actions/clubs');
            
            set({ isLoading: true, error: null });
            const response = await getTeamById(teamId);
            
            if (response.success && response.data) {
              const team = response.data;
              const teamEntity: TeamEntity = {
                id: team.id,
                clubId: team.clubId || team.club_id,
                name: team.name,
                description: team.description,
                category: team.category || 'senior',
                gender: team.gender || 'mixto',
                ageRange: team.ageRange || team.age_range || '18+',
                level: team.level || 'intermediate',
                practiceDays: team.practiceDays || team.practice_days || [],
                practiceTimes: team.practiceTimes || team.practice_times || [],
                practiceLocation: team.practiceLocation || team.practice_location || '',
                coachId: team.coachId || team.coach_id,
                assistantCoachId: team.assistantCoachId || team.assistant_coach_id,
                captainId: team.captainId || team.captain_id,
                isActive: team.isActive ?? team.is_active ?? true,
                isAcceptingMembers: team.isAcceptingMembers ?? team.is_accepting_members ?? true,
                maxMembers: team.maxMembers || team.max_members || 20,
                minAge: team.minAge || team.min_age,
                maxAge: team.maxAge || team.max_age,
                competitionLevel: team.competitionLevel || team.competition_level || 'local',
                targetCompetitions: team.targetCompetitions || team.target_competitions || [],
                memberCount: team.memberCount || team.member_count,
                sessionCount: team.sessionCount || team.session_count,
                lastActivity: team.lastActivity || team.last_activity,
                createdBy: team.createdBy || team.created_by,
                foundedDate: team.foundedDate || team.founded_date,
                colors: team.colors || { primary: '#0066CC', secondary: '#FFFFFF' },
                createdAt: team.createdAt || createTimestamp(),
                updatedAt: team.updatedAt || createTimestamp(),
              };
              
              // Add or update the single team
              get().addEntity(teamEntity);
              set({ isLoading: false });
            } else {
              throw new Error(response.error || 'Equipo no encontrado');
            }
          } catch (error) {
            console.error('Load team by ID error:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
          }
        },

        // =====================================================
        // TEAM-SPECIFIC SELECTORS
        // =====================================================

        getTeamsByClub: (clubId) => {
          const state = get();
          const teamIds = state.byClub[clubId] || [];
          return teamIds.map(id => state.entities[id]).filter(Boolean);
        },

        getTeamsByCategory: (category) => {
          const state = get();
          const teamIds = state.byCategory[category] || [];
          return teamIds.map(id => state.entities[id]).filter(Boolean);
        },

        getTeamsByGender: (gender) => {
          const state = get();
          const teamIds = state.byGender[gender] || [];
          return teamIds.map(id => state.entities[id]).filter(Boolean);
        },

        getTeamsByLevel: (level) => {
          const state = get();
          const teamIds = state.byLevel[level] || [];
          return teamIds.map(id => state.entities[id]).filter(Boolean);
        },

        getTeamsByCoach: (coachId) => {
          const state = get();
          const teamIds = state.byCoach[coachId] || [];
          return teamIds.map(id => state.entities[id]).filter(Boolean);
        },

        getActiveTeams: () => {
          const state = get();
          const teamIds = state.byStatus.active || [];
          return teamIds.map(id => state.entities[id]).filter(Boolean);
        },

        getInactiveTeams: () => {
          const state = get();
          const teamIds = state.byStatus.inactive || [];
          return teamIds.map(id => state.entities[id]).filter(Boolean);
        },
      }),
      {
        name: 'teams-store',
        partialize: (state) => ({
          entities: state.entities,
          ids: state.ids,
          byClub: state.byClub,
          byCategory: state.byCategory,
          byGender: state.byGender,
          byLevel: state.byLevel,
          byCoach: state.byCoach,
          byStatus: state.byStatus,
        }),
      }
    ),
    {
      name: 'teams-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// =====================================================
// OPTIMIZED HOOKS WITH MEMOIZATION
// =====================================================

export const useTeams = () => {
  const ids = useTeamsStore((state) => state.ids);
  const entities = useTeamsStore((state) => state.entities);
  
  return useMemo(() => 
    ids.map(id => entities[id]), 
    [ids, entities]
  );
};

export const useTeam = (id: string) => useTeamsStore((state) => state.entities[id]);

export const useTeamsByClub = (clubId: string) => {
  const teamIds = useTeamsStore((state) => state.byClub[clubId] || []);
  const entities = useTeamsStore((state) => state.entities);
  
  return useMemo(() => 
    teamIds.map(id => entities[id]).filter(Boolean),
    [teamIds, entities]
  );
};

export const useTeamsByCategory = (category: string) => {
  const teamIds = useTeamsStore((state) => state.byCategory[category] || []);
  const entities = useTeamsStore((state) => state.entities);
  
  return useMemo(() => 
    teamIds.map(id => entities[id]).filter(Boolean),
    [teamIds, entities]
  );
};

export const useTeamsByGender = (gender: string) => {
  const teamIds = useTeamsStore((state) => state.byGender[gender] || []);
  const entities = useTeamsStore((state) => state.entities);
  
  return useMemo(() => 
    teamIds.map(id => entities[id]).filter(Boolean),
    [teamIds, entities]
  );
};

export const useTeamsByLevel = (level: string) => {
  const teamIds = useTeamsStore((state) => state.byLevel[level] || []);
  const entities = useTeamsStore((state) => state.entities);
  
  return useMemo(() => 
    teamIds.map(id => entities[id]).filter(Boolean),
    [teamIds, entities]
  );
};

export const useActiveTeams = () => {
  const teamIds = useTeamsStore((state) => state.byStatus.active);
  const entities = useTeamsStore((state) => state.entities);
  
  return useMemo(() => 
    teamIds.map(id => entities[id]).filter(Boolean),
    [teamIds, entities]
  );
};

export const useTeamsActions = () => useTeamsStore((state) => ({
  addEntity: state.addEntity,
  updateEntity: state.updateEntity,
  deleteEntity: state.deleteEntity,
  setEntities: state.setEntities,
  createNewTeam: state.createNewTeam,
  updateExistingTeam: state.updateExistingTeam,
  deleteExistingTeam: state.deleteExistingTeam,
  loadTeamsByClub: state.loadTeamsByClub,
  loadTeamById: state.loadTeamById,
}));

export const useTeamsSelectors = () => useTeamsStore((state) => ({
  getTeamsByClub: state.getTeamsByClub,
  getTeamsByCategory: state.getTeamsByCategory,
  getTeamsByGender: state.getTeamsByGender,
  getTeamsByLevel: state.getTeamsByLevel,
  getTeamsByCoach: state.getTeamsByCoach,
  getActiveTeams: state.getActiveTeams,
  getInactiveTeams: state.getInactiveTeams,
}));

export const useTeamsLoading = () => useTeamsStore((state) => state.isLoading);
export const useTeamsError = () => useTeamsStore((state) => state.error);

// Export types
export type { TeamsState };

// Legacy compatibility alias
export const useNewTeamsStore = useTeamsStore;
