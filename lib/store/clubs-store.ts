/**
 * Store para la gestión de clubes y equipos
 * @fileoverview Estado global para clubes, equipos y miembros
 */

import {
    addTeamMember,
    createClub,
    createTeam,
    deleteClub,
    deleteTeam,
    getClubById,
    getClubs,
    getTeamById,
    getTeamMembers,
    getTeamsByClub,
    hasClubAccess,
    removeTeamMember,
    updateClub,
    updateTeam,
    updateTeamMember
} from '@/lib/actions/clubs';
import type {
    ClubFilters,
    ClubWithStats,
    NavigationState,
    TeamFilters,
    TeamMemberFilters,
    TeamMemberWithUser,
    TeamWithClub
} from '@/lib/types/club';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// =====================================================
// INTERFACES DEL STORE
// =====================================================

interface ClubsState {
  // Estado de navegación
  navigation: NavigationState;
  
  // Estado de clubes
  clubs: ClubWithStats[];
  selectedClub: ClubWithStats | null;
  clubStats: Record<string, any>;
  
  // Estado de equipos
  teams: TeamWithClub[];
  selectedTeam: TeamWithClub | null;
  
  // Estado de miembros
  members: TeamMemberWithUser[];
  
  // Estado de carga y errores
  isLoading: boolean;
  error: string | null;
  
  // Filtros activos
  clubFilters: ClubFilters;
  teamFilters: TeamFilters;
  memberFilters: TeamMemberFilters;
}

interface ClubsActions {
  // Acciones de navegación
  setSelectedClub: (clubId: string | null) => Promise<void>;
  setSelectedTeam: (teamId: string | null) => Promise<void>;
  clearSelection: () => void;
  
  // Acciones de clubes
  loadClubs: (filters?: ClubFilters) => Promise<void>;
  loadClubById: (clubId: string) => Promise<void>;
  createNewClub: (clubData: any) => Promise<boolean>;
  updateExistingClub: (clubData: any) => Promise<boolean>;
  deleteExistingClub: (clubId: string) => Promise<boolean>;
  
  // Acciones de equipos
  loadTeamsByClub: (clubId: string, filters?: TeamFilters) => Promise<void>;
  loadTeamById: (teamId: string) => Promise<void>;
  createNewTeam: (teamData: any) => Promise<boolean>;
  updateExistingTeam: (teamData: any) => Promise<boolean>;
  deleteExistingTeam: (teamId: string) => Promise<boolean>;
  
  // Acciones de miembros
  loadTeamMembers: (teamId: string, filters?: TeamMemberFilters) => Promise<void>;
  addNewMember: (memberData: any) => Promise<boolean>;
  updateExistingMember: (memberData: any) => Promise<boolean>;
  removeExistingMember: (memberId: string) => Promise<boolean>;
  
  // Acciones de filtros
  setClubFilters: (filters: ClubFilters) => void;
  setTeamFilters: (filters: TeamFilters) => void;
  setMemberFilters: (filters: TeamMemberFilters) => void;
  clearFilters: () => void;
  
  // Acciones de utilidad
  refreshData: () => Promise<void>;
  clearError: () => void;
  checkClubAccess: (clubId: string) => Promise<boolean>;
}

type ClubsStore = ClubsState & ClubsActions;

// =====================================================
// ESTADO INICIAL
// =====================================================

const initialState: ClubsState = {
  navigation: {
    clubs: [],
    teams: [],
    selectedClubId: null,
    selectedTeamId: null,
    isLoading: false,
    error: null,
  },
  clubs: [],
  selectedClub: null,
  clubStats: {},
  teams: [],
  selectedTeam: null,
  members: [],
  isLoading: false,
  error: null,
  clubFilters: {},
  teamFilters: {},
  memberFilters: {},
};

// =====================================================
// STORE PRINCIPAL
// =====================================================

export const useClubsStore = create<ClubsStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // =====================================================
        // ACCIONES DE NAVEGACIÓN
        // =====================================================

        setSelectedClub: async (clubId: string | null) => {
          set({ isLoading: true, error: null });
          
          try {
            if (!clubId) {
              set({
                selectedClub: null,
                selectedTeam: null,
                teams: [],
                members: [],
                navigation: {
                  ...get().navigation,
                  selectedClubId: null,
                  selectedTeamId: null,
                },
                isLoading: false,
              });
              return;
            }

            // Cargar club
            const clubResponse = await getClubById(clubId);
            if (!clubResponse.success || !clubResponse.data) {
              throw new Error(clubResponse.error || 'Club no encontrado');
            }

            // Cargar equipos del club
            const teamsResponse = await getTeamsByClub(clubId);
            if (!teamsResponse.success) {
              throw new Error(teamsResponse.error || 'Error al cargar equipos');
            }

            set({
              selectedClub: clubResponse.data,
              teams: teamsResponse.data,
              selectedTeam: null,
              members: [],
              navigation: {
                ...get().navigation,
                selectedClubId: clubId,
                selectedTeamId: null,
              },
              isLoading: false,
            });
          } catch (error) {
            console.error('Error en setSelectedClub:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
          }
        },

        setSelectedTeam: async (teamId: string | null) => {
          set({ isLoading: true, error: null });
          
          try {
            if (!teamId) {
              set({
                selectedTeam: null,
                members: [],
                navigation: {
                  ...get().navigation,
                  selectedTeamId: null,
                },
                isLoading: false,
              });
              return;
            }

            // Cargar equipo
            const teamResponse = await getTeamById(teamId);
            if (!teamResponse.success || !teamResponse.data) {
              throw new Error(teamResponse.error || 'Equipo no encontrado');
            }

            // Cargar miembros del equipo
            const membersResponse = await getTeamMembers(teamId);
            if (!membersResponse.success) {
              throw new Error(membersResponse.error || 'Error al cargar miembros');
            }

            set({
              selectedTeam: teamResponse.data,
              members: membersResponse.data,
              navigation: {
                ...get().navigation,
                selectedTeamId: teamId,
              },
              isLoading: false,
            });
          } catch (error) {
            console.error('Error en setSelectedTeam:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
          }
        },

        clearSelection: () => {
          set({
            selectedClub: null,
            selectedTeam: null,
            teams: [],
            members: [],
            navigation: {
              ...get().navigation,
              selectedClubId: null,
              selectedTeamId: null,
            },
          });
        },

        // =====================================================
        // ACCIONES DE CLUBES
        // =====================================================

        loadClubs: async (filters?: ClubFilters) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await getClubs(filters);
            if (!response.success) {
              throw new Error(response.error || 'Error al cargar clubes');
            }

            set({
              clubs: response.data,
              navigation: {
                ...get().navigation,
                clubs: response.data,
              },
              isLoading: false,
            });
          } catch (error) {
            console.error('Error en loadClubs:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
          }
        },

        loadClubById: async (clubId: string) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await getClubById(clubId);
            if (!response.success) {
              throw new Error(response.error || 'Error al cargar club');
            }

            set({
              selectedClub: response.data,
              isLoading: false,
            });
          } catch (error) {
            console.error('Error en loadClubById:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
          }
        },

        createNewClub: async (clubData: any) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await createClub(clubData);
            if (!response.success) {
              throw new Error(response.error || 'Error al crear club');
            }

            // Recargar lista de clubes
            await get().loadClubs(get().clubFilters);

            set({ isLoading: false });
            return true;
          } catch (error) {
            console.error('Error en createNewClub:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
            return false;
          }
        },

        updateExistingClub: async (clubData: any) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await updateClub(clubData);
            if (!response.success) {
              throw new Error(response.error || 'Error al actualizar club');
            }

            // Actualizar club seleccionado si es el mismo
            if (get().selectedClub?.id === clubData.id) {
              set({ selectedClub: response.data });
            }

            // Recargar lista de clubes
            await get().loadClubs(get().clubFilters);

            set({ isLoading: false });
            return true;
          } catch (error) {
            console.error('Error en updateExistingClub:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
            return false;
          }
        },

        deleteExistingClub: async (clubId: string) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await deleteClub(clubId);
            if (!response.success) {
              throw new Error(response.error || 'Error al eliminar club');
            }

            // Limpiar selección si el club eliminado estaba seleccionado
            if (get().selectedClub?.id === clubId) {
              get().clearSelection();
            }

            // Recargar lista de clubes
            await get().loadClubs(get().clubFilters);

            set({ isLoading: false });
            return true;
          } catch (error) {
            console.error('Error en deleteExistingClub:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
            return false;
          }
        },

        // =====================================================
        // ACCIONES DE EQUIPOS
        // =====================================================

        loadTeamsByClub: async (clubId: string, filters?: TeamFilters) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await getTeamsByClub(clubId, filters);
            if (!response.success) {
              throw new Error(response.error || 'Error al cargar equipos');
            }

            set({
              teams: response.data,
              navigation: {
                ...get().navigation,
                teams: response.data,
              },
              isLoading: false,
            });
          } catch (error) {
            console.error('Error en loadTeamsByClub:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
          }
        },

        loadTeamById: async (teamId: string) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await getTeamById(teamId);
            if (!response.success) {
              throw new Error(response.error || 'Error al cargar equipo');
            }

            set({
              selectedTeam: response.data,
              isLoading: false,
            });
          } catch (error) {
            console.error('Error en loadTeamById:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
          }
        },

        createNewTeam: async (teamData: any) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await createTeam(teamData);
            if (!response.success) {
              throw new Error(response.error || 'Error al crear equipo');
            }

            // Recargar equipos del club actual
            if (get().selectedClub) {
              await get().loadTeamsByClub(get().selectedClub.id, get().teamFilters);
            }

            set({ isLoading: false });
            return true;
          } catch (error) {
            console.error('Error en createNewTeam:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
            return false;
          }
        },

        updateExistingTeam: async (teamData: any) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await updateTeam(teamData);
            if (!response.success) {
              throw new Error(response.error || 'Error al actualizar equipo');
            }

            // Actualizar equipo seleccionado si es el mismo
            if (get().selectedTeam?.id === teamData.id) {
              set({ selectedTeam: response.data });
            }

            // Recargar equipos del club actual
            if (get().selectedClub) {
              await get().loadTeamsByClub(get().selectedClub.id, get().teamFilters);
            }

            set({ isLoading: false });
            return true;
          } catch (error) {
            console.error('Error en updateExistingTeam:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
            return false;
          }
        },

        deleteExistingTeam: async (teamId: string) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await deleteTeam(teamId);
            if (!response.success) {
              throw new Error(response.error || 'Error al eliminar equipo');
            }

            // Limpiar selección si el equipo eliminado estaba seleccionado
            if (get().selectedTeam?.id === teamId) {
              set({
                selectedTeam: null,
                members: [],
                navigation: {
                  ...get().navigation,
                  selectedTeamId: null,
                },
              });
            }

            // Recargar equipos del club actual
            if (get().selectedClub) {
              await get().loadTeamsByClub(get().selectedClub.id, get().teamFilters);
            }

            set({ isLoading: false });
            return true;
          } catch (error) {
            console.error('Error en deleteExistingTeam:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
            return false;
          }
        },

        // =====================================================
        // ACCIONES DE MIEMBROS
        // =====================================================

        loadTeamMembers: async (teamId: string, filters?: TeamMemberFilters) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await getTeamMembers(teamId, filters);
            if (!response.success) {
              throw new Error(response.error || 'Error al cargar miembros');
            }

            set({
              members: response.data,
              isLoading: false,
            });
          } catch (error) {
            console.error('Error en loadTeamMembers:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
          }
        },

        addNewMember: async (memberData: any) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await addTeamMember(memberData);
            if (!response.success) {
              throw new Error(response.error || 'Error al agregar miembro');
            }

            // Recargar miembros del equipo actual
            if (get().selectedTeam) {
              await get().loadTeamMembers(get().selectedTeam.id, get().memberFilters);
            }

            set({ isLoading: false });
            return true;
          } catch (error) {
            console.error('Error en addNewMember:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
            return false;
          }
        },

        updateExistingMember: async (memberData: any) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await updateTeamMember(memberData);
            if (!response.success) {
              throw new Error(response.error || 'Error al actualizar miembro');
            }

            // Recargar miembros del equipo actual
            if (get().selectedTeam) {
              await get().loadTeamMembers(get().selectedTeam.id, get().memberFilters);
            }

            set({ isLoading: false });
            return true;
          } catch (error) {
            console.error('Error en updateExistingMember:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
            return false;
          }
        },

        removeExistingMember: async (memberId: string) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await removeTeamMember(memberId);
            if (!response.success) {
              throw new Error(response.error || 'Error al remover miembro');
            }

            // Recargar miembros del equipo actual
            if (get().selectedTeam) {
              await get().loadTeamMembers(get().selectedTeam.id, get().memberFilters);
            }

            set({ isLoading: false });
            return true;
          } catch (error) {
            console.error('Error en removeExistingMember:', error);
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              isLoading: false,
            });
            return false;
          }
        },

        // =====================================================
        // ACCIONES DE FILTROS
        // =====================================================

        setClubFilters: (filters: ClubFilters) => {
          set({ clubFilters: filters });
        },

        setTeamFilters: (filters: TeamFilters) => {
          set({ teamFilters: filters });
        },

        setMemberFilters: (filters: TeamMemberFilters) => {
          set({ memberFilters: filters });
        },

        clearFilters: () => {
          set({
            clubFilters: {},
            teamFilters: {},
            memberFilters: {},
          });
        },

        // =====================================================
        // ACCIONES DE UTILIDAD
        // =====================================================

        refreshData: async () => {
          const { selectedClub, selectedTeam, clubFilters, teamFilters, memberFilters } = get();
          
          // Recargar clubes
          await get().loadClubs(clubFilters);
          
          // Recargar club seleccionado
          if (selectedClub) {
            await get().setSelectedClub(selectedClub.id);
          }
          
          // Recargar equipo seleccionado
          if (selectedTeam) {
            await get().setSelectedTeam(selectedTeam.id);
          }
        },

        clearError: () => {
          set({ error: null });
        },

        checkClubAccess: async (clubId: string) => {
          try {
            return await hasClubAccess(clubId);
          } catch (error) {
            console.error('Error en checkClubAccess:', error);
            return false;
          }
        },
      }),
      {
        name: 'clubs-store',
        partialize: (state) => ({
          navigation: {
            selectedClubId: state.navigation.selectedClubId,
            selectedTeamId: state.navigation.selectedTeamId,
          },
          clubFilters: state.clubFilters,
          teamFilters: state.teamFilters,
          memberFilters: state.memberFilters,
        }),
      }
    ),
    {
      name: 'clubs-store',
    }
  )
);

// =====================================================
// SELECTORES ÚTILES
// =====================================================

export const useSelectedClub = () => useClubsStore((state) => state.selectedClub);
export const useSelectedTeam = () => useClubsStore((state) => state.selectedTeam);
export const useClubs = () => useClubsStore((state) => state.clubs);
export const useTeams = () => useClubsStore((state) => state.teams);
export const useMembers = () => useClubsStore((state) => state.members);
export const useIsLoading = () => useClubsStore((state) => state.isLoading);
export const useError = () => useClubsStore((state) => state.error);
export const useNavigation = () => useClubsStore((state) => state.navigation);
