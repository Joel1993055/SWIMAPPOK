// =====================================================
// CLUB ENTITY STORE - NORMALIZED ARCHITECTURE
// =====================================================

import { useMemo } from 'react';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { BaseEntity, EntityState, createEntityId, createTimestamp, normalizeEntities } from './types';

// =====================================================
// CLUB ENTITY TYPE
// =====================================================

export interface ClubEntity extends BaseEntity {
  // Core club data
  name: string;
  description: string;
  location: string;
  contactEmail: string;
  website?: string;
  logoUrl?: string;
  phone?: string;
  address?: string;
  
  // Status and settings
  isActive: boolean;
  isPublic: boolean;
  timezone: string;
  language: string;
  
  // Subscription and limits
  maxTeams: number;
  maxMembersPerTeam: number;
  subscriptionType: 'basic' | 'premium' | 'enterprise';
  
  // Additional metadata
  foundedYear?: number;
  foundedBy?: string;
  category: 'competitive' | 'recreational' | 'school' | 'mixed';
  
  // Stats (computed fields)
  teamCount?: number;
  memberCount?: number;
  sessionCount?: number;
}

// =====================================================
// CLUB STORE STATE
// =====================================================

interface ClubsState extends EntityState<ClubEntity> {
  // String-based indexers for efficient lookups
  byLocation: Record<string, string[]>;      // location -> clubIds[]
  byCategory: Record<string, string[]>;      // category -> clubIds[]
  bySubscription: Record<string, string[]>;  // subscriptionType -> clubIds[]
  byStatus: { active: string[], inactive: string[] };
  
  // CRUD operations (from EntityActions)
  addEntity: (entity: Omit<ClubEntity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntity: (id: string, updates: Partial<ClubEntity>) => void;
  deleteEntity: (id: string) => void;
  setEntities: (entities: ClubEntity[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearEntities: () => void;
  getEntity: (id: string) => ClubEntity | undefined;
  hasEntity: (id: string) => boolean;
  
  // Legacy aliases for backward compatibility
  createNewClub: (clubData: any) => Promise<boolean>;
  updateExistingClub: (clubData: any) => Promise<boolean>;
  deleteExistingClub: (clubId: string) => Promise<boolean>;
  loadClubs: (filters?: any) => Promise<void>;
  loadClubById: (clubId: string) => Promise<void>;
  
  // Club-specific selectors
  getClubsByLocation: (location: string) => ClubEntity[];
  getClubsByCategory: (category: string) => ClubEntity[];
  getClubsBySubscription: (subscription: string) => ClubEntity[];
  getActiveClubs: () => ClubEntity[];
  getInactiveClubs: () => ClubEntity[];
  
  // Access control
  checkClubAccess: (clubId: string) => Promise<boolean>;
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

const initialState: Omit<ClubsState, 'addEntity' | 'updateEntity' | 'deleteEntity' | 'setEntities' | 'setLoading' | 'setError' | 'clearEntities' | 'getEntity' | 'hasEntity' | 'createNewClub' | 'updateExistingClub' | 'deleteExistingClub' | 'loadClubs' | 'loadClubById' | 'getClubsByLocation' | 'getClubsByCategory' | 'getClubsBySubscription' | 'getActiveClubs' | 'getInactiveClubs' | 'checkClubAccess'> = {
  // Entity state
  entities: {},
  ids: [],
  isLoading: false,
  error: null,
  
  // Club-specific indexers
  byLocation: {},
  byCategory: {},
  bySubscription: {},
  byStatus: { active: [], inactive: [] },
};

// =====================================================
// CLUBS STORE
// =====================================================

export const useClubsStore = create<ClubsState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...initialState,

        // =====================================================
        // ENTITY CRUD OPERATIONS
        // =====================================================

        addEntity: (clubData: Omit<ClubEntity, 'id' | 'createdAt' | 'updatedAt'>) => set((state) => {
          const club: ClubEntity = {
            ...clubData,
            id: createEntityId(),
            createdAt: createTimestamp(),
            updatedAt: createTimestamp(),
          };

          const newState = addEntityToState(state, club);
          
          // Update indexers
          return {
            ...newState,
            byLocation: {
              ...state.byLocation,
              [club.location]: [...(state.byLocation[club.location] || []), club.id]
            },
            byCategory: {
              ...state.byCategory,
              [club.category]: [...(state.byCategory[club.category] || []), club.id]
            },
            bySubscription: {
              ...state.bySubscription,
              [club.subscriptionType]: [...(state.bySubscription[club.subscriptionType] || []), club.id]
            },
            byStatus: {
              ...state.byStatus,
              [club.isActive ? 'active' : 'inactive']: [
                ...state.byStatus[club.isActive ? 'active' : 'inactive'],
                club.id
              ]
            },
          };
        }),

        updateEntity: (id, updates) => set((state) => {
          const newState = updateEntityInState(state, id, updates);


          if (newState === state) return state; // No changes

          // Update indexers if relevant fields changed
          const club = state.entities[id];
          if (!club) return newState;

          let updatedIndexers = {};
          
          if (updates.location && updates.location !== club.location) {
            updatedIndexers = {
              ...updatedIndexers,
              byLocation: {
                ...state.byLocation,
                [club.location]: state.byLocation[club.location]?.filter(clubId => clubId !== id) || [],
                [updates.location]: [...(state.byLocation[updates.location] || []), id]
              }
            };
          }
          
          if (updates.category && updates.category !== club.category) {
            updatedIndexers = {
              ...updatedIndexers,
              byCategory: {
                ...state.byCategory,
                [club.category]: state.byCategory[club.category]?.filter(clubId => clubId !== id) || [],
                [updates.category]: [...(state.byCategory[updates.category] || []), id]
              }
            };
          }
          
          if (updates.subscriptionType && updates.subscriptionType !== club.subscriptionType) {
            updatedIndexers = {
              ...updatedIndexers,
              bySubscription: {
                ...state.bySubscription,
                [club.subscriptionType]: state.bySubscription[club.subscriptionType]?.filter(clubId => clubId !== id) || [],
                [updates.subscriptionType]: [...(state.bySubscription[updates.subscriptionType] || []), id]
              }
            };
          }
          
          if (updates.isActive !== undefined && updates.isActive !== club.isActive) {
            updatedIndexers = {
              ...updatedIndexers,
              byStatus: {
                ...state.byStatus,
                active: updates.isActive 
                  ? [...state.byStatus.active.filter(id => id !== club.id), id]
                  : state.byStatus.active.filter(id => id !== club.id),
                inactive: updates.isActive 
                  ? state.byStatus.inactive.filter(id => id !== club.id)
                  : [...state.byStatus.inactive.filter(id => id !== club.id), id]
              }
            };
          }

          return {
            ...newState,
            ...updatedIndexers,
          };
        }),

        deleteEntity: (id) => set((state) => {
          const club = state.entities[id];
          if (!club) return state;

          const newState = deleteEntityFromState(state, id);
          
          // Clean up indexers
          return {
            ...newState,
            byLocation: {
              ...state.byLocation,
              [club.location]: state.byLocation[club.location]?.filter(clubId => clubId !== id) || []
            },
            byCategory: {
              ...state.byCategory,
              [club.category]: state.byCategory[club.category]?.filter(clubId => clubId !== id) || []
            },
            bySubscription: {
              ...state.bySubscription,
              [club.subscriptionType]: state.bySubscription[club.subscriptionType]?.filter(clubId => clubId !== id) || []
            },
            byStatus: {
              active: state.byStatus.active.filter(clubId => clubId !== id),
              inactive: state.byStatus.inactive.filter(clubId => clubId !== id)
            },
          };
        }),

        setEntities: (clubs) => set(() => {
          const normalized = normalizeEntities(clubs);
          
          // Rebuild indexers
          const byLocation: Record<string, string[]> = {};
          const byCategory: Record<string, string[]> = {};
          const bySubscription: Record<string, string[]> = {};
          const byStatus = { active: [] as string[], inactive: [] as string[] };

          clubs.forEach(club => {
            // Location indexer
            if (!byLocation[club.location]) byLocation[club.location] = [];
            byLocation[club.location].push(club.id);
            
            // Category indexer
            if (!byCategory[club.category]) byCategory[club.category] = [];
            byCategory[club.category].push(club.id);
            
            // Subscription indexer
            if (!bySubscription[club.subscriptionType]) bySubscription[club.subscriptionType] = [];
            bySubscription[club.subscriptionType].push(club.id);
            
            // Status indexer
            if (club.isActive) {
              byStatus.active.push(club.id);
            } else {
              byStatus.inactive.push(club.id);
            }
          });

          return {
            ...normalized,
            byLocation,
            byCategory,
            bySubscription,
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

        createNewClub: async (clubData: any) => {
          try {
            // Import the action dynamically to avoid circular imports
            const { createClub } = await import('@/infra/config/actions/clubs');
            
            set({ isLoading: true, error: null });
            const response = await createClub(clubData);
            
            if (response.success && response.data) {
              // Transform to entity format and add
              const clubEntity: Omit<ClubEntity, 'id' | 'createdAt' | 'updatedAt'> = {
                name: response.data.name,
                description: response.data.description || '',
                location: response.data.location || '',
                contactEmail: response.data.contactEmail || '',
                website: response.data.website,
                logoUrl: response.data.logoUrl,
                phone: response.data.phone,
                address: response.data.address,
                isActive: response.data.isActive ?? true,
                isPublic: response.data.isPublic ?? true,
                timezone: response.data.timezone || 'UTC',
                language: response.data.language || 'es',
                maxTeams: response.data.maxTeams || 5,
                maxMembersPerTeam: response.data.maxMembersPerTeam || 20,
                subscriptionType: response.data.subscriptionType || 'basic',
                foundedYear: response.data.foundedYear,
                foundedBy: response.data.foundedBy,
                category: response.data.category || 'mixed',
                teamCount: response.data.teamCount,
                memberCount: response.data.memberCount,
                sessionCount: response.data.sessionCount,
              };
              
              get().addEntity(clubEntity);
              set({ isLoading: false });
              return true;
            } else {
              throw new Error(response.error || 'Error al crear club');
            }
          } catch (error) {
            console.error('Create club error:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
            return false;
          }
        },

        updateExistingClub: async (clubData: any) => {
          try {
            const { updateClub } = await import('@/infra/config/actions/clubs');
            
            set({ isLoading: true, error: null });
            const response = await updateClub(clubData);
            
            if (response.success && response.data) {
              // Transform to entity format and update
              const updates: Partial<ClubEntity> = {
                name: response.data.name,
                description: response.data.description,
                location: response.data.location,
                contactEmail: response.data.contactEmail,
                website: response.data.website,
                logoUrl: response.data.logoUrl,
                phone: response.data.phone,
                address: response.data.address,
                isActive: response.data.isActive,
                isPublic: response.data.isPublic,
                timezone: response.data.timezone,
                language: response.data.language,
                maxTeams: response.data.maxTeams,
                maxMembersPerTeam: response.data.maxMembersPerTeam,
                subscriptionType: response.data.subscriptionType,
                foundedYear: response.data.foundedYear,
                foundedBy: response.data.foundedBy,
                category: response.data.category,
                teamCount: response.data.teamCount,
                memberCount: response.data.memberCount,
                sessionCount: response.data.sessionCount,
              };
              
              get().updateEntity(clubData.id, updates);
              set({ isLoading: false });
              return true;
            } else {
              throw new Error(response.error || 'Error al actualizar club');
            }
          } catch (error) {
            console.error('Update club error:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
            return false;
          }
        },

        deleteExistingClub: async (clubId: string) => {
          try {
            const { deleteClub } = await import('@/infra/config/actions/clubs');
            
            set({ isLoading: true, error: null });
            const response = await deleteClub(clubId);
            
            if (response.success) {
              get().deleteEntity(clubId);
              set({ isLoading: false });
              return true;
            } else {
              throw new Error(response.error || 'Error al eliminar club');
            }
          } catch (error) {
            console.error('Delete club error:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
            return false;
          }
        },

        loadClubs: async (filters?: any) => {
          try {
            const { getClubs } = await import('@/infra/config/actions/clubs');
            
            set({ isLoading: true, error: null });
            const response = await getClubs(filters);
            
            if (response.success && response.data) {
              // Transform to entity format
              const clubsEntities: ClubEntity[] = response.data.map((club: any) => ({
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
                createdAt: club.createdAt || createTimestamp(),
                updatedAt: club.updatedAt || createTimestamp(),
              }));
              
              get().setEntities(clubsEntities);
              set({ isLoading: false });
            } else {
              throw new Error(response.error || 'Error al cargar clubes');
            }
          } catch (error) {
            console.error('Load clubs error:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
          }
        },

        loadClubById: async (clubId: string) => {
          try {
            const { getClubById } = await import('@/infra/config/actions/clubs');
            
            set({ isLoading: true, error: null });
            const response = await getClubById(clubId);
            
            if (response.success && response.data) {
              const club = response.data;
              const clubEntity: ClubEntity = {
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
                createdAt: club.createdAt || createTimestamp(),
                updatedAt: club.updatedAt || createTimestamp(),
              };
              
              // Add or update the single club
              get().addEntity(clubEntity);
              set({ isLoading: false });
            } else {
              throw new Error(response.error || 'Club no encontrado');
            }
          } catch (error) {
            console.error('Load club by ID error:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
          }
        },

        // =====================================================
        // CLUB-SPECIFIC SELECTORS
        // =====================================================

        getClubsByLocation: (location) => {
          const state = get();
          const clubIds = state.byLocation[location] || [];
          return clubIds.map(id => state.entities[id]).filter(Boolean);
        },

        getClubsByCategory: (category) => {
          const state = get();
          const clubIds = state.byCategory[category] || [];
          return clubIds.map(id => state.entities[id]).filter(Boolean);
        },

        getClubsBySubscription: (subscription) => {
          const state = get();
          const clubIds = state.bySubscription[subscription] || [];
          return clubIds.map(id => state.entities[id]).filter(Boolean);
        },

        getActiveClubs: () => {
          const state = get();
          const clubIds = state.byStatus.active || [];
          return clubIds.map(id => state.entities[id]).filter(Boolean);
        },

        getInactiveClubs: () => {
          const state = get();
          const clubIds = state.byStatus.inactive || [];
          return clubIds.map(id => state.entities[id]).filter(Boolean);
        },

        // =====================================================
        // ACCESS CONTROL
        // =====================================================

        checkClubAccess: async (clubId: string) => {
          try {
            const { hasClubAccess } = await import('@/infra/config/actions/clubs');
            return await hasClubAccess(clubId);
          } catch (error) {
            console.error('Check club access error:', error);
            return false;
          }
        },
      }),
      {
        name: 'clubs-entity-store',
        partialize: (state) => ({
          entities: state.entities,
          ids: state.ids,
          byLocation: state.byLocation,
          byCategory: state.byCategory,
          bySubscription: state.bySubscription,
          byStatus: state.byStatus,
        }),
      }
    ),
    {
      name: 'clubs-entity-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// =====================================================
// OPTIMIZED HOOKS WITH MEMOIZATION
// =====================================================

export const useClubs = () => {
  const ids = useClubsStore((state) => state.ids);
  const entities = useClubsStore((state) => state.entities);
  
  return useMemo(() => 
    ids.map(id => entities[id]), 
    [ids, entities]
  );
};

export const useClub = (id: string) => useClubsStore((state) => state.entities[id]);

export const useClubsByLocation = (location: string) => {
  const clubIds = useClubsStore((state) => state.byLocation[location] || []);
  const entities = useClubsStore((state) => state.entities);
  
  return useMemo(() => 
    clubIds.map(id => entities[id]).filter(Boolean),
    [clubIds, entities]
  );
};

export const useClubsByCategory = (category: string) => {
  const clubIds = useClubsStore((state) => state.byCategory[category] || []);
  const entities = useClubsStore((state) => state.entities);
  
  return useMemo(() => 
    clubIds.map(id => entities[id]).filter(Boolean),
    [clubIds, entities]
  );
};

export const useActiveClubs = () => {
  const clubIds = useClubsStore((state) => state.byStatus.active);
  const entities = useClubsStore((state) => state.entities);
  
  return useMemo(() => 
    clubIds.map(id => entities[id]).filter(Boolean),
    [clubIds, entities]
  );
};

export const useClubsActions = () => useClubsStore((state) => ({
  addEntity: state.addEntity,
  updateEntity: state.updateEntity,
  deleteEntity: state.deleteEntity,
  setEntities: state.setEntities,
  createNewClub: state.createNewClub,
  updateExistingClub: state.updateExistingClub,
  deleteExistingClub: state.deleteExistingClub,
  loadClubs: state.loadClubs,
  loadClubById: state.loadClubById,
  checkClubAccess: state.checkClubAccess,
}));

export const useClubsSelectors = () => useClubsStore((state) => ({
  getClubsByLocation: state.getClubsByLocation,
  getClubsByCategory: state.getClubsByCategory,
  getClubsBySubscription: state.getClubsBySubscription,
  getActiveClubs: state.getActiveClubs,
  getInactiveClubs: state.getClubsByCategory,
}));

export const useClubsLoading = () => useClubsStore((state) => state.isLoading);
export const useClubsError = () => useClubsStore((state) => state.error);

// Export types
export type { ClubsState };

// Legacy compatibility alias
export const useNewClubsStore = useClubsStore;
