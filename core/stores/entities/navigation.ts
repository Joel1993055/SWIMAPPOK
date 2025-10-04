// =====================================================
// NAVIGATION STORE - UI STATE MANAGEMENT
// =====================================================

import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

// =====================================================
// NAVIGATION STATE TYPE
// =====================================================

interface NavigationState {
  // Current selections
  selectedClubId: string | null;
  selectedTeamId: string | null;
  selectedMemberId: string | null;
  
  // Navigation history
  breadcrumb: Array<{
    id: string;
    name: string;
    type: 'club' | 'team' | 'member' | 'page';
    path?: string;
    timestamp: string;
  }>;
  
  // UI state
  lastVisitDate: string;
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  
  // Session data
  sessionData: {
    startTime: string;
    lastActivity: string;
    pageViews: number;
    visitedPages: string[];
  };
  
  // Settings
  preferences: {
    defaultView: 'dashboard' | 'calendar' | 'members' | 'reports';
    autoLoadTeams: boolean;
    autoLoadMembers: boolean;
    showNotifications: boolean;
  };
}

interface NavigationActions {
  // Selection actions
  setSelectedClub? (clubId: string | null) => void;
  setSelectedTeam? (teamId: string | null) => void;
  setSelectedMember? (memberId: string | null) => void;
  setSelection? (clubId: string | null, teamId?: string | null, memberId?: string | null) => void;
  clearSelection? () => void;
  
  // Breadcrumb actions
  addBreadcrumb? (item: Omit<NavigationState['breadcrumb'][0], 'timestamp'>) => void;
  removeBreadcrumb? (id: string) => void;
  clearBreadcrumb? () => void;
  backToPrevious? () => void;
  
  // UI state actions
  setSidebarCollapsed? (collapsed: boolean) => void;
  setSidebarWidth? (width: number) => void;
  toggleSidebar? () => void;
  
  // Session actions
  updateLastActivity? () => void;
  incrementPageView? () => void;
  addVisitedPage? (page: string) => void;
  
  // Preference actions
  setPreference? <K extends keyof NavigationState['preferences']>(
    key: K,
    value: NavigationState['preferences'][K]
  ) => void;
  
  // Utility actions
  resetNavigation? () => void;
  exportState? () => NavigationState;
}

type NavigationStore = NavigationState & NavigationActions;

// =====================================================
// INITIAL STATE
// =====================================================

const initialState: NavigationState = {
  // Current selections
  selectedClubId: null,
  selectedTeamId: null,
  selectedMemberId: null,
  
  // Navigation history
  breadcrumb: [
    {
      id: 'dashboard',
      name: 'Dashboard',
      type: 'page',
      path: '/dashboard',
      timestamp: new Date().toISOString(),
    },
  ],
  
  // UI state
  lastVisitDate: new Date().toISOString(),
  sidebarCollapsed: false,
  sidebarWidth: 280,
  
  // Session data
  sessionData: {
    startTime: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    pageViews: 1,
    visitedPages: ['dashboard'],
  },
  
  // Settings
  preferences: {
    defaultView: 'dashboard',
    autoLoadTeams: true,
    autoLoadMembers: true,
    showNotifications: true,
  },
};

// =====================================================
// NAVIGATION STORE
// =====================================================

export const useNavigationStore = create<NavigationStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...initialState,

        // =====================================================
        // SELECTION ACTIONS
        // =====================================================

        setSelectedClub: (clubId: string | null) => set((state) => {
          // Auto-clear team and member selections when club changes
          return {
            selectedClubId: clubId,
            selectedTeamId: clubId !== state.selectedClubId ? null : state.selectedTeamId,
            selectedMemberId: clubId !== state.selectedClubId ? null : state.selectedMemberId,
          };
        }),

        setSelectedTeam: (teamId: string | null) => set((state) => {
          // Auto-clear member selection when team changes
          return {
            selectedTeamId: teamId,
            selectedMemberId: teamId !== state.selectedTeamId ? null : state.selectedMemberId,
          };
        }),

        setSelectedMember: (memberId: string | null) => set({
          selectedMemberId: memberId,
        }),

        setSelection: (clubId: string | null, teamId?: string | null, memberId?: string | null) => set({
          selectedClubId: clubId,
          selectedTeamId: teamId ?? null,
          selectedMemberId: memberId ?? null,
        }),

        clearSelection: () => set({
          selectedClubId: null,
          selectedTeamId: null,
          selectedMemberId: null,
        }),

        // =====================================================
        // BREADCRUMB ACTIONS
        // =====================================================

        addBreadcrumb: (item: Omit<NavigationState['breadcrumb'][0], 'timestamp'>) => set((state) => {
          const newItem = {
            ...item,
            timestamp: new Date().toISOString(),
            id: item.id.startsWith('temp-') ? item.id : `temp-${item.id}-${Date.now()}`,
          };
          
          // Limit breadcrumb to 10 items to prevent memory bloat
          const newBreadcrumb = [...state.breadcrumb, newItem].slice(-10);
          
          return {
            breadcrumb: newBreadcrumb,
          };
        }),

        removeBreadcrumb: (id: string) => set((state) => ({
          breadcrumb: state.breadcrumb.filter(item => item.id !== id),
        })),

        clearBreadcrumb: () => set((state) => ({
          breadcrumb: [
            {
              id: 'dashboard',
              name: 'Dashboard',
              type: 'page',
              path: '/dashboard',
              timestamp: new Date().toISOString(),
            },
          ],
        })),

        backToPrevious: () => set((state) => {
          if (state.breadcrumb.length <= 1) return state;
          
          const newBreadcrumb = state.breadcrumb.slice(0, -1);
          const previousItem = newBreadcrumb[newBreadcrumb.length - 1];
          
          if (!previousItem) return state;
          
          // Update selections based on previous breadcrumb item
          const updates: Partial<NavigationState> = { breadcrumb: newBreadcrumb };
          
          if (previousItem.type === 'club') {
            updates.selectedClubId = previousItem.id;
            updates.selectedTeamId = null;
            updates.selectedMemberId = null;
          } else if (previousItem.type === 'team') {
            updates.selectedTeamId = previousItem.id;
            updates.selectedMemberId = null;
          } else if (previousItem.type === 'member') {
            updates.selectedMemberId = previousItem.id;
          }
          
          return updates;
        }),

        // =====================================================
        // UI STATE ACTIONS
        // =====================================================

        setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),

        setSidebarWidth: (width: number) => set({ sidebarWidth: width }),

        toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

        // =====================================================
        // SESSION ACTIONS
        // =====================================================

        updateLastActivity: () => set((state) => ({
          sessionData: {
            ...state.sessionData,
            lastActivity: new Date().toISOString(),
          },
          lastVisitDate: new Date().toISOString(),
        })),

        incrementPageView: () => set((state) => ({
          sessionData: {
            ...state.sessionData,
            pageViews: state.sessionData.pageViews + 1,
            lastActivity: new Date().toISOString(),
          },
        })),

        addVisitedPage: (page: string) => set((state) => ({
          sessionData: {
            ...state.sessionData,
            visitedPages: [...state.sessionData.visitedPages.filter(p => p !== page), page].slice(-50), // Keep last 50
            lastActivity: new Date().toISOString(),
          },
        })),

        // =====================================================
        // PREFERENCE ACTIONS
        // =====================================================

        setPreference: <K extends keyof NavigationState['preferences']>(
          key: K,
          value: NavigationState['preferences'][K]
        ) => set((state) => ({
          preferences: {
            ...state.preferences,
            [key]: value,
          },
        })),

        // =====================================================
        // UTILITY ACTIONS
        // =====================================================

        resetNavigation: () => set(() => initialState),

        exportState: () => get(),
      }),
      {
        name: 'navigation-store',
        partialize: (state) => ({
          // Persist UI preferences and selections, but exclude session data
          selectedClubId: state.selectedClubId,
          selectedTeamId: state.selectedTeamId,
          selectedMemberId: state.selectedMemberId,
          sidebarCollapsed: state.sidebarCollapsed,
          sidebarWidth: state.sidebarWidth,
          preferences: state.preferences,
          breadcrumb: state.breadcrumb.slice(-5), // Only persist last 5 breadcrumb items
        }),
      }
    ),
    {
      name: 'navigation-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// =====================================================
// OPTIMIZED SELECTOR HOOKS
// =====================================================

export const useSelectedClubId = () => useNavigationStore((state) => state.selectedClubId);
export const useSelectedTeamId = () => useNavigationStore((state) => state.selectedTeamId);
export const useSelectedMemberId = () => useNavigationStore((state) => state.selectedMemberId);

export const useSidebarCollapsed = () => useNavigationStore((state) => state.sidebarCollapsed);
export const useSidebarWidth = () => useNavigationStore((state) => state.sidebarWidth);

export const useBreadcrumb = () => useNavigationStore((state) => state.breadcrumb);
export const usePreferences = () => useNavigationStore((state) => state.preferences);

export const useNavigationActions = () => useNavigationStore((state) => ({
  setSelectedClub: state.setSelectedClub,
  setSelectedTeam: state.setSelectedTeam,
  setSelectedMember: state.setSelectedMember,
  setSelection: state.setSelection,
  clearSelection: state.clearSelection,
  addBreadcrumb: state.addBreadcrumb,
  removeBreadcrumb: state.removeBreadcrumb,
  clearBreadcrumb: state.clearBreadcrumb,
  backToPrevious: state.backToPrevious,
  setSidebarCollapsed: state.setSidebarCollapsed,
  setSidebarWidth: state.setSidebarWidth,
  toggleSidebar: state.toggleSidebar,
  updateLastActivity: state.updateLastActivity,
  incrementPageView: state.incrementPageView,
  addVisitedPage: state.addVisitedPage,
  setPreference: state.setPreference,
  resetNavigation: state.resetNavigation,
}));

// Export types
export type { NavigationState, NavigationActions };

// Legacy compatibility alias - for migration bridge
export const useNewNavigationStore = useNavigationStore;
