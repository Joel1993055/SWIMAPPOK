// =====================================================
// MEMBER ENTITY STORE - NORMALIZED ARCHITECTURE
// =====================================================

import { useMemo } from 'react';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { BaseEntity, EntityState, createEntityId, createTimestamp, normalizeEntities } from './types';

// =====================================================
// MEMBER ENTITY TYPE
// =====================================================

export interface MemberEntity extends BaseEntity {
  // Core member data
  teamId: string;            // Foreign key to team
  userId: string;            // Foreign key to user
  clubId: string;           // Foreign key to club (denormalized for efficiency)
  
  // Role and permissions
  role: 'atleta' | 'entrenador' | 'manager' | 'asistente' | 'capitan' | 'gerente';
  permissions: {
    canEditSessions: boolean;
    canManageTeam: boolean;
    canInviteMembers: boolean;
    canViewReports: boolean;
    canAccessAnalytics: boolean;
  };
  
  // Membership details
  isActive: boolean;
  joinedAt: string;
  leftAt?: string;
  position?: string;         // Team position/specialty
  weight?: number;            // Weight for performance analysis
  height?: number;            // Height for performance analysis
  
  // Personal data (denormalized from user)
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  gender?: 'masculino' | 'femenino' | 'otro';
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  
  // Training and performance
  skillLevel: 'principiante' | 'intermedio' | 'avanzado' | 'elite';
  preferredEvents: string[];      // swimming events
  personalBest?: Record<string, any>; // PBs by event
  trainingZones?: {
    z1: { min: number; max: number };
    z2: { min: number; max: number };
    z3: { min: number; max: number };
    z4: { min: number; max: number };
    z5: { min: number; max: number };
  };
  
  // Medical and availability
  medicalInfo?: {
    allergies: string[];
    injuries: string[];
    medications: string[];
    doctorContact: string;
  };
  availability: string[];          // Days of week available
  
  // Statistics (computed fields)
  sessionCount?: number;
  lastSession?: string;
  attendanceRate?: number;        // percentage
}

// =====================================================
// MEMBER STORE STATE
// =====================================================

interface MembersState extends EntityState<MemberEntity> {
  // String-based indexers for efficient lookups
  byTeam: Record<string, string[]>;              // teamId -> memberIds[]
  byClub: Record<string, string[]>;            // clubId -> memberIds[]
  byRole: Record<string, string[]>;            // role -> memberIds[]
  bySkillLevel: Record<string, string[]>;     // skillLevel -> memberIds[]
  byUser: Record<string, string[]>;           // userId -> memberIds[]
  byStatus: { active: string[], inactive: string[] };
  
  // CRUD operations (from EntityActions)
  addEntity: (entity: Omit<MemberEntity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntity: (id: string, updates: Partial<MemberEntity>) => void;
  deleteEntity: (id: string) => void;
  setEntities: (entities: MemberEntity[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearEntities: () => void;
  getEntity: (id: string) => MemberEntity | undefined;
  hasEntity: (id: string) => boolean;
  
  // Legacy aliases for backward compatibility
  addNewMember: (memberData: any) => Promise<boolean>;
  updateExistingMember: (memberData: any) => Promise<boolean>;
  removeExistingMember: (memberId: string) => Promise<boolean>;
  loadTeamMembers: (teamId: string, filters?: any) => Promise<void>;
  loadMemberById: (memberId: string) => Promise<void>;
  
  // Member-specific selectors
  getMembersByTeam: (teamId: string) => MemberEntity[];
  getMembersByClub: (clubId: string) => MemberEntity[];
  getMembersByRole: (role: string) => MemberEntity[];
  getMembersBySkillLevel: (skillLevel: string) => MemberEntity[];
  getActiveMembers: () => MemberEntity[];
  getInactiveMembers: () => MemberEntity[];
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

const initialState: Omit<MembersState, 'addEntity' | 'updateEntity' | 'deleteEntity' | 'setEntities' | 'setLoading' | 'setError' | 'clearEntities' | 'getEntity' | 'hasEntity' | 'addNewMember' | 'updateExistingMember' | 'removeExistingMember' | 'loadTeamMembers' | 'loadMemberById' | 'getMembersByTeam' | 'getMembersByClub' | 'getMembersByRole' | 'getMembersBySkillLevel' | 'getActiveMembers' | 'getInactiveMembers'> = {
  // Entity state
  entities: {},
  ids: [],
  isLoading: false,
  error: null,
  
  // Member-specific indexers
  byTeam: {},
  byClub: {},
  byRole: {},
  bySkillLevel: {},
  byUser: {},
  byStatus: { active: [], inactive: [] },
};

// =====================================================
// MEMBERS STORE
// =====================================================

export const useMembersStore = create<MembersState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...initialState,

        // =====================================================
        // ENTITY CRUD OPERATIONS
        // =====================================================

        addEntity: (memberData: Omit<MemberEntity, 'id' | 'createdAt' | 'updatedAt'>) => set((state) => {
          const member: MemberEntity = {
            ...memberData,
            id: createEntityId(),
            createdAt: createTimestamp(),
            updatedAt: createTimestamp(),
          };

          const newState = addEntityToState(state, member);
          
          // Update indexers
          const teamMembers = state.byTeam[member.teamId] || [];
          const clubMembers = state.byClub[member.clubId] || [];
          const roleMembers = state.byRole[member.role] || [];
          const skillLevelMembers = state.bySkillLevel[member.skillLevel] || [];
          const userMembers = state.byUser[member.userId] || [];
          const statusMembers = member.isActive ? state.byStatus.active : state.byStatus.inactive;
          
          return {
            ...newState,
            byTeam: { ...state.byTeam, [member.teamId]: [...teamMembers, member.id] },
            byClub: { ...state.byClub, [member.clubId]: [...clubMembers, member.id] },
            byRole: { ...state.byRole, [member.role]: [...roleMembers, member.id] },
            bySkillLevel: { ...state.bySkillLevel, [member.skillLevel]: [...skillLevelMembers, member.id] },
            byUser: { ...state.byUser, [member.userId]: member.id }, // User should only be in one team
            byStatus: {
              ...state.byStatus,
              [member.isActive ? 'active' : 'inactive']: [...statusMembers, member.id]
            },
          };
        }),

        updateEntity: (id, updates) => set((state) => {
          const member = state.entities[id];
          if (!member) return state;
          
          const newState = updateEntityInState(state, id, updates);
          if (newState === state) return state; // No changes

          let updatedIndexers = {};
          
          // Update team indexer if team changed
          if (updates.teamId && updates.teamId !== member.teamId) {
            updatedIndexers = {
              ...updatedIndexers,
              byTeam: {
                ...state.byTeam,
                [member.teamId]: state.byTeam[member.teamId]?.filter(memberId => memberId !== id) || [],
                [updates.teamId]: [...(state.byTeam[updates.teamId] || []), id]
              },
              byClub: {
                ...state.byClub,
                [member.clubId]: state.byClub[member.clubId]?.filter(memberId => memberId !== id) || [],
                [updates.clubId]: [...(state.byClub[updates.clubId] || []), id]
              }
            };
          }
          
          // Update club indexer if club changed (direct update)
          if (updates.clubId && updates.clubId !== member.clubId) {
            updatedIndexers = {
              ...updatedIndexers,
              byClub: {
                ...state.byClub,
                [member.clubId]: state.byClub[member.clubId]?.filter(memberId => memberId !== id) || [],
                [updates.clubId]: [...(state.byClub[updates.clubId] || []), id]
              }
            };
          }
          
          // Update role indexer if role changed
          if (updates.role && updates.role !== member.role) {
            updatedIndexers = {
              ...updatedIndexers,
              byRole: {
                ...state.byRole,
                [member.skillLevel]: state.byRole[member.role]?.filter(memberId => memberId !== id) || [],
                [updates.role]: [...(state.byRole[updates.role] || []), id]
              }
            };
          }
          
          // Update skill level indexer if level changed
          if (updates.skillLevel && updates.skillLevel !== member.skillLevel) {
            updatedIndexers = {
              ...updatedIndexers,
              bySkillLevel: {
                ...state.bySkillLevel,
                [member.skillLevel]: state.bySkillLevel[member.skillLevel]?.filter(memberId => memberId !== id) || [],
                [updates.skillLevel]: [...(state.bySkillLevel[updates.skillLevel] || []), id]
              }
            };
          }
          
          // Update user indexer if user changed
          if (updates.userId && updates.userId !== member.userId) {
            // Remove from old user
            const oldUserMembers = state.byUser[member.userId]?.filter(memberId => memberId !== id) || [];
            const newUserMembers = [...(state.byUser[updates.userId] || []), id];
            
            updatedIndexers = {
              ...updatedIndexers,
              byUser: {
                ...state.byUser,
                [member.userId]: oldUserMembers,
                [updates.userId]: newUserMembers
              }
            };
          }
          
          // Update status indexer if active status changed
          if (updates.isActive !== undefined && updates.isActive !== member.isActive) {
            updatedIndexers = {
              ...updatedIndexers,
              byStatus: {
                ...state.byStatus,
                active: updates.isActive 
                  ? [...state.byStatus.active.filter(memberId => memberId !== id), id]
                  : state.byStatus.active.filter(memberId => memberId !== id),
                inactive: updates.isActive 
                  ? state.byStatus.inactive.filter(memberId => memberId !== id)
                  : [...state.byStatus.inactive.filter(memberId => memberId !== id), id]
              }
            };
          }

          return {
            ...newState,
            ...updatedIndexers,
          };
        }),

        deleteEntity: (id) => set((state) => {
          const member = state.entities[id];
          if (!member) return state;

          const newState = deleteEntityFromState(state, id);
          
          // Clean up indexers
          return {
            ...newState,
            byTeam: {
              ...state.byTeam,
              [member.teamId]: state.byTeam[member.teamId]?.filter(memberId => memberId !== id) || []
            },
            byClub: {
              ...state.byClub,
              [member.clubId]: state.byClub[member.clubId]?.filter(memberId => memberId !== id) || []
            },
            byRole: {
              ...state.byRole,
              [member.role]: state.byRole[member.role]?.filter(memberId => memberId !== id) || []
            },
            bySkillLevel: {
              ...state.bySkillLevel,
              [member.skillLevel]: state.bySkillLevel[member.skillLevel]?.filter(memberId => memberId !== id) || []
            },
            byUser: {
              ...state.byUser,
              [member.userId]: state.byUser[member.userId]?.filter(memberId => memberId !== id) || []
            },
            byStatus: {
              active: state.byStatus.active.filter(memberId => memberId !== id),
              inactive: state.byStatus.inactive.filter(memberId => memberId !== id)
            },
          };
        }),

        setEntities: (members) => set(() => {
          const normalized = normalizeEntities(members);
          
          // Rebuild indexers
          const byTeam: Record<string, string[]> = {};
          const byClub: Record<string, string[]> = {};
          const byRole: Record<string, string[]> = {};
          const bySkillLevel: Record<string, string[]> = {};
          const byUser: Record<string, string[]> = {};
          const byStatus = { active: [] as string[], inactive: [] as string[] };

          members.forEach(member => {
            // Team indexer
            if (!byTeam[member.teamId]) byTeam[member.teamId] = [];
            byTeam[member.teamId].push(member.id);
            
            // Club indexer
            if (!byClub[member.clubId]) byClub[member.clubId] = [];
            byClub[member.clubId].push(member.id);
            
            // Role indexer
            if (!byRole[member.role]) byRole[member.role] = [];
            byRole[member.role].push(member.id);
            
            // Skill level indexer
            if (!bySkillLevel[member.skillLevel]) bySkillLevel[member.skillLevel] = [];
            bySkillLevel[member.skillLevel].push(member.id);
            
            // User indexer (membership is unique per user)
            byUser[member.userId] = [member.id];
            
            // Status indexer
            if (member.isActive) {
              byStatus.active.push(member.id);
            } else {
              byStatus.inactive.push(member.id);
            }
          });

          return {
            ...normalized,
            byTeam,
            byClub,
            byRole,
            bySkillLevel,
            byUser,
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

        addNewMember: async (memberData: any) => {
          try {
            const { addTeamMember } = await import('@/infra/config/actions/clubs');
            
            set({ isLoading: true, error: null });
            const response = await addTeamMember(memberData);
            
            if (response.success && response.data) {
              // Transform to entity format and add
              const memberEntity: Omit<MemberEntity, 'id' | 'createdAt' | 'updatedAt'> = {
                teamId: response.data.teamId || response.data.team_id,
                userId: response.data.userId || response.data.user_id,
                clubId: response.data.clubId || response.data.club_id,
                role: response.data.role || 'atleta',
                permissions: response.data.permissions || {
                  canEditSessions: false,
                  canManageTeam: false,
                  canInviteMembers: false,
                  canViewReports: false,
                  canAccessAnalytics: false,
                },
                isActive: response.data.isActive ?? response.data.is_active ?? true,
                joinedAt: response.data.joinedAt || response.data.joined_at || createTimestamp(),
                leftAt: response.data.leftAt || response.data.left_at,
                position: response.data.position,
                weight: response.data.weight,
                height: response.data.height,
                firstName: response.data.firstName || response.data.first_name || response.data.name?.split(' ')[0] || '',
                lastName: response.data.lastName || response.data.last_name || response.data.name?.split(' ')[1] || '',
                email: response.data.email || '',
                phone: response.data.phone,
                birthDate: response.data.birthDate || response.data.birth_date,
                gender: response.data.gender,
                emergencyContact: response.data.emergencyContact || response.data.emergency_contact,
                skillLevel: response.data.skillLevel || response.data.skill_level || 'intermedio',
                preferredEvents: response.data.preferredEvents || response.data.preferred_events || [],
                personalBest: response.data.personalBest || response.data.personal_best,
                trainingZones: response.data.trainingZones || response.data.training_zones,
                medicalInfo: response.data.medicalInfo || response.data.medical_info,
                availability: response.data.availability || [],
                sessionCount: response.data.sessionCount || response.data.session_count,
                lastSession: response.data.lastSession || response.data.last_session,
                attendanceRate: response.data.attendanceRate || response.data.attendance_rate
              };
              
              get().addEntity(memberEntity);
              set({ isLoading: false });
              return true;
            } else {
              throw new Error(response.error || 'Error al agregar miembro');
            }
          } catch (error) {
            console.error('Add member error:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
            return false;
          }
        },

        updateExistingMember: async (memberData: any) => {
          try {
            const { updateTeamMember } = await import('@/infra/config/actions/clubs');
            
            set({ isLoading: true, error: null });
            const response = await updateTeamMember(memberData);
            
            if (response.success && response.data) {
              // Create updates object based on response
              const updates: Partial<MemberEntity> = {};
              
              // Map response fields to entity fields
              if (response.data.role !== undefined) updates.role = response.data.role;
              if (response.data.permissions !== undefined) updates.permissions = response.data.permissions;
              if (response.data.isActive !== undefined) updates.isActive = response.data.isActive;
              if (response.data.position !== undefined) updates.position = response.data.position;
              if (response.data.weight !== undefined) updates.weight = response.data.weight;
              if (response.data.height !== undefined) updates.height = response.data.height;
              if (response.data.skillLevel !== undefined) updates.skillLevel = response.data.skillLevel;
              if (response.data.preferredEvents !== undefined) updates.preferredEvents = response.data.preferredEvents;
              if (response.data.personalBest !== undefined) updates.personalBest = response.data.personalBest;
              if (response.data.trainingZones !== undefined) updates.trainingZones = response.data.trainingZones;
              if (response.data.medicalInfo !== undefined) updates.medicalInfo = response.data.medicalInfo;
              if (response.data.availability !== undefined) updates.availability = response.data.availability;
              
              get().updateEntity(memberData.id, updates);
              set({ isLoading: false });
              return true;
            } else {
              throw new Error(response.error || 'Error al actualizar miembro');
            }
          } catch (error) {
            console.error('Update member error:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
            return false;
          }
        },

        removeExistingMember: async (memberId: string) => {
          try {
            const { removeTeamMember } = await import('@/infra/config/actions/clubs');
            
            set({ isLoading: true, error: null });
            const response = await removeTeamMember(memberId);
            
            if (response.success) {
              get().deleteEntity(memberId);
              set({ isLoading: false });
              return true;
            } else {
              throw new Error(response.error || 'Error al remover miembro');
            }
          } catch (error) {
            console.error('Remove member error:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
            return false;
          }
        },

        loadTeamMembers: async (teamId: string, filters?: any) => {
          try {
            const { getTeamMembers } = await import('@/infra/config/actions/clubs');
            
            set({ isLoading: true, error: null });
            const response = await getTeamMembers(teamId, filters);
            
            if (response.success && response.data) {
              // Transform to entity format
              const membersEntities: MemberEntity[] = response.data.map((member: any, _index) => ({
                id: member.id,
                teamId: member.teamId || member.team_id,
                userId: member.userId || member.user_id,
                clubId: member.clubId || member.club_id,
                role: member.role || 'atleta',
                permissions: member.permissions || {
                  canEditSessions: false,
                  canManageTeam: false,
                  canInviteMembers: false,
                  canViewReports: false,
                  canAccessAnalytics: false,
                },
                isActive: member.isActive ?? member.is_active ?? true,
                joinedAt: member.joinedAt || member.joined_at || createTimestamp(),
                leftAt: member.leftAt || member.left_at,
                position: member.position,
                weight: member.weight,
                height: member.height,
                firstName: member.firstName || member.first_name || member.name?.split(' ')[0] || '',
                lastName: member.lastName || member.last_name || member.name?.split(' ')[1] || '',
                email: member.email || '',
                phone: member.phone,
                birthDate: member.birthDate || member.birth_date,
                gender: member.gender,
                emergencyContact: member.emergencyContact || member.emergency_contact,
                skillLevel: member.skillLevel || member.skill_level || 'intermedio',
                preferredEvents: member.preferredEvents || member.preferred_events || [],
                personalBest: member.personalBest || member.personal_best,
                trainingZones: member.trainingZones || member.training_zones,
                medicalInfo: member.medicalInfo || member.medical_info,
                availability: member.availability || [],
                sessionCount: member.sessionCount || member.session_count,
                lastSession: member.lastSession || member.last_session,
                attendanceRate: member.attendanceRate || member.attendance_rate,
                createdAt: member.createdAt || createTimestamp(),
                updatedAt: member.updatedAt || createTimestamp(),
              }));
              
              get().setEntities(membersEntities);
              set({ isLoading: false });
            } else {
              throw new Error(response.error || 'Error al cargar miembros');
            }
          } catch (error) {
            console.error('Load team members error:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
          }
        },

        loadMemberById: async (memberId: string) => {
          try {
            // This would need to be implemented in the actions if not already
            const { getTeamMembers } = await import('@/infra/config/actions/clubs');
            
            set({ isLoading: true, error: null });
            // Note: This assumes we can find the member by searching through team members
            // A dedicated getMemberById would be better
            const member = get().entities[memberId];
            if (member) {
              set({ isLoading: false });
              return;
            }
            
            // Fallback: throw error since we don't have a direct API
            throw new Error('Member no encontrado');
          } catch (error) {
            console.error('Load member by ID error:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
          }
        },

        // =====================================================
        // MEMBER-SPECIFIC SELECTORS
        // =====================================================

        getMembersByTeam: (teamId) => {
          const state = get();
          const memberIds = state.byTeam[teamId] || [];
          return memberIds.map(id => state.entities[id]).filter(Boolean);
        },

        getMembersByClub: (clubId) => {
          const state = get();
          const memberIds = state.byClub[clubId] || [];
          return memberIds.map(id => state.entities[id]).filter(Boolean);
        },

        getMembersByRole: (role) => {
          const state = get();
          const memberIds = state.byRole[role] || [];
          return memberIds.map(id => state.entities[id]).filter(Boolean);
        },

        getMembersBySkillLevel: (skillLevel) => {
          const state = get();
          const memberIds = state.bySkillLevel[skillLevel] || [];
          return memberIds.map(id => state.entities[id]).filter(Boolean);
        },

        getActiveMembers: () => {
          const state = get();
          const memberIds = state.byStatus.active || [];
          return memberIds.map(id => state.entities[id]).filter(Boolean);
        },

        getInactiveMembers: () => {
          const state = get();
          const memberIds = state.byStatus.inactive || [];
          return memberIds.map(id => state.entities[id]).filter(Boolean);
        },
      }),
      {
        name: 'members-store',
        partialize: (state) => ({
          entities: state.entities,
          ids: state.ids,
          byTeam: state.byTeam,
          byClub: state.byClub,
          byRole: state.byRole,
          bySkillLevel: state.bySkillLevel,
          byUser: state.byUser,
          byStatus: state.byStatus,
        }),
      }
    ),
    {
      name: 'members-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// =====================================================
// OPTIMIZED HOOKS WITH MEMOIZATION
// =====================================================

export const useMembers = () => {
  const ids = useMembersStore((state) => state.ids);
  const entities = useMembersStore((state) => state.entities);
  
  return useMemo(() => 
    ids.map(id => entities[id]), 
    [ids, entities]
  );
};

export const useMember = (id: string) => useMembersStore((state) => state.entities[id]);

export const useMembersByTeam = (teamId: string) => {
  const memberIds = useMembersStore((state) => state.byTeam[teamId] || []);
  const entities = useMembersStore((state) => state.entities);
  
  return useMemo(() => 
    memberIds.map(id => entities[id]).filter(Boolean),
    [memberIds, entities]
  );
};

export const useMembersByClub = (clubId: string) => {
  const memberIds = useMembersStore((state) => state.byClub[clubId] || []);
  const entities = useMembersStore((state) => state.entities);
  
  return useMemo(() => 
    memberIds.map(id => entities[id]).filter(Boolean),
    [memberIds, entities]
  );
};

export const useMembersByRole = (role: string) => {
  const memberIds = useMembersStore((state) => state.byRole[role] || []);
  const entities = useMembersStore((state) => state.entities);
  
  return useMemo(() => 
    memberIds.map(id => entities[id]).filter(Boolean),
    [memberIds, entities]
  );
};

export const useActiveMembers = () => {
  const memberIds = useMembersStore((state) => state.byStatus.active);
  const entities = useMembersStore((state) => state.entities);
  
  return useMemo(() => 
    memberIds.map(id => entities[id]).filter(Boolean),
    [memberIds, entities]
  );
};

export const useMembersActions = () => useMembersStore((state) => ({
  addEntity: state.addEntity,
  updateEntity: state.updateEntity,
  deleteEntity: state.deleteEntity,
  setEntities: state.setEntities,
  addNewMember: state.addNewMember,
  updateExistingMember: state.updateExistingMember,
  removeExistingMember: state.removeExistingMember,
  loadTeamMembers: state.loadTeamMembers,
  loadMemberById: state.loadMemberById,
}));

export const useMembersSelectors = () => useMembersStore((state) => ({
  getMembersByTeam: state.getMembersByTeam,
  getMembersByClub: state.getMembersByClub,
  getMembersByRole: state.getMembersByRole,
  getMembersBySkillLevel: state.getMembersBySkillLevel,
  getActiveMembers: state.getActiveMembers,
  getInactiveMembers: state.getInactiveMembers,
}));

export const useMembersLoading = () => useMembersStore((state) => state.isLoading);
export const useMembersError = () => useMembersStore((state) => state.error);

// Export types
export type { MembersState };

// Legacy compatibility alias
export const useNewMembersStore = useMembersStore;
