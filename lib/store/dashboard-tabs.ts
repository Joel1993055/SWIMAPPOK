import { create } from 'zustand';

type DashboardTab = 'overview' | 'log' | 'insights' | 'analytics';

interface DashboardTabsState {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
}

export const useDashboardTabsStore = create<DashboardTabsState>((set) => ({
  activeTab: 'overview',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
