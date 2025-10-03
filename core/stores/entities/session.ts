// =====================================================
// SESSION ENTITY STORE - NORMALIZED ARCHITECTURE
// =====================================================

import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { BaseEntity, EntityState, createEntityId, createTimestamp, normalizeEntities } from './types';

// =====================================================
// SESSION ENTITY TYPE
// =====================================================

export interface SessionEntity extends BaseEntity {
  // Core session data
  date: string;
  swimmer: string;
  distance: number;
  stroke: 'freestyle' | 'backstroke' | 'breaststroke' | 'butterfly' | 'mixed';
  sessionType: 'aerobic' | 'threshold' | 'speed' | 'technique' | 'recovery';
  mainSet: string;
  notes?: string;
  
  // Zone volumes (if available)
  zoneVolumes?: {
    z1: number;
    z2: number;
    z3: number;
    z4: number;
    z5: number;
  };
  
  // Additional metadata
  location?: string;
  coach?: string;
  objective?: string;
  timeSlot?: 'AM' | 'PM';
  
  // Computed fields
  totalVolume?: number;
  averageRPE?: number;
}

// =====================================================
// SESSION STORE STATE
// =====================================================

interface SessionsState extends EntityState<SessionEntity> {
  // Additional session-specific state
  selectedDate: string | null;
  selectedSwimmer: string | null;
  selectedPhase: string | null;
  
  // CRUD operations (from EntityActions)
  addEntity: (entity: Omit<SessionEntity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntity: (id: string, updates: Partial<SessionEntity>) => void;
  deleteEntity: (id: string) => void;
  setEntities: (entities: SessionEntity[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearEntities: () => void;
  getEntity: (id: string) => SessionEntity | undefined;
  hasEntity: (id: string) => boolean;
  
  // Legacy aliases
  addSession: (sessionData: Omit<SessionEntity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSession: (id: string, updates: Partial<SessionEntity>) => void;
  deleteSession: (id: string) => void;
  
  // Session-specific actions
  setSelectedDate: (date: string | null) => void;
  setSelectedSwimmer: (swimmer: string | null) => void;
  setSelectedPhase: (phase: string | null) => void;
  
  // Advanced selectors
  getSessionsByDate: (date: string) => SessionEntity[];
  getSessionsByDateRange: (startDate: string, endDate: string) => SessionEntity[];
  getSessionsBySwimmer: (swimmer: string) => SessionEntity[];
  getSessionsByPhase: (phase: string) => SessionEntity[];
  getSessionsByType: (type: SessionEntity['sessionType']) => SessionEntity[];
  
  // Statistics
  getTotalDistance: () => number;
  getTotalDistanceByDate: (date: string) => number;
  getTotalDistanceByRange: (startDate: string, endDate: string) => number;
  getAverageDistance: () => number;
  getSessionCount: () => number;
  
  // Zone analysis
  getZoneDistribution: () => Record<string, number>;
  getZoneDistributionByDate: (date: string) => Record<string, number>;
}

// =====================================================
// INITIAL STATE
// =====================================================

const initialState: Omit<SessionsState, 'addEntity' | 'updateEntity' | 'deleteEntity' | 'setEntities' | 'setLoading' | 'setError' | 'clearEntities' | 'getEntity' | 'hasEntity' | 'addSession' | 'updateSession' | 'deleteSession' | 'setSelectedDate' | 'setSelectedSwimmer' | 'setSelectedPhase' | 'getSessionsByDate' | 'getSessionsByDateRange' | 'getSessionsBySwimmer' | 'getSessionsByPhase' | 'getSessionsByType' | 'getTotalDistance' | 'getTotalDistanceByDate' | 'getTotalDistanceByRange' | 'getAverageDistance' | 'getSessionCount' | 'getZoneDistribution' | 'getZoneDistributionByDate'> = {
  // Entity state
  entities: {},
  ids: [],
  isLoading: false,
  error: null,
  lastUpdated: 0,
  totalCount: 0,
  hasMore: false,
  
  // Session-specific state
  selectedDate: null,
  selectedSwimmer: null,
  selectedPhase: null,
};

// =====================================================
// SESSION STORE IMPLEMENTATION
// =====================================================

export const useSessionsStore = create<SessionsState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...initialState,
        
        // =====================================================
        // CRUD OPERATIONS
        // =====================================================
        
        addEntity: (sessionData) => {
          const now = createTimestamp();
          const newSession: SessionEntity = {
            ...sessionData,
            id: createEntityId(),
            createdAt: now,
            updatedAt: now,
          };
          
          set((state) => ({
            entities: { ...state.entities, [newSession.id]: newSession },
            ids: [...state.ids, newSession.id],
            totalCount: state.totalCount + 1,
            lastUpdated: Date.now(),
            error: null,
          }));
        },
        
        updateEntity: (id, updates) => {
          set((state) => {
            const existingSession = state.entities[id];
            if (!existingSession) return state;
            
            const updatedSession: SessionEntity = {
              ...existingSession,
              ...updates,
              updatedAt: createTimestamp(),
            };
            
            return {
              entities: { ...state.entities, [id]: updatedSession },
              lastUpdated: Date.now(),
              error: null,
            };
          });
        },
        
        deleteEntity: (id) => {
          set((state) => {
            const { [id]: deleted, ...remainingEntities } = state.entities;
            return {
              entities: remainingEntities,
              ids: state.ids.filter(sessionId => sessionId !== id),
              totalCount: state.totalCount - 1,
              lastUpdated: Date.now(),
              error: null,
            };
          });
        },
        
        setEntities: (sessions: SessionEntity[]) => {
          const { entities, ids } = normalizeEntities(sessions);
          set({
            entities,
            ids,
            totalCount: sessions.length,
            lastUpdated: Date.now(),
            error: null,
          });
        },
        
        // =====================================================
        // STATE MANAGEMENT
        // =====================================================
        
        setLoading: (isLoading: boolean) => set({ isLoading }),
        setError: (error: string | null) => set({ error }),
        
        clearEntities: () => set({
          entities: {},
          ids: [],
          totalCount: 0,
          hasMore: false,
          lastUpdated: Date.now(),
          error: null,
        }),
        
        // =====================================================
        // UTILITY FUNCTIONS
        // =====================================================
        
        getEntity: (id: string) => get().entities[id],
        hasEntity: (id: string) => id in get().entities,
        
        // =====================================================
        // SESSION-SPECIFIC ACTIONS
        // =====================================================
        
        setSelectedDate: (selectedDate) => set({ selectedDate }),
        setSelectedSwimmer: (selectedSwimmer) => set({ selectedSwimmer }),
        setSelectedPhase: (selectedPhase) => set({ selectedPhase }),
        
        // =====================================================
        // ADVANCED SELECTORS
        // =====================================================
        
        getSessionsByDate: (date) => {
          const { entities, ids } = get();
          return ids
            .map(id => entities[id])
            .filter(session => session.date === date);
        },
        
        getSessionsByDateRange: (startDate, endDate) => {
          const { entities, ids } = get();
          return ids
            .map(id => entities[id])
            .filter(session => session.date >= startDate && session.date <= endDate);
        },
        
        getSessionsBySwimmer: (swimmer) => {
          const { entities, ids } = get();
          return ids
            .map(id => entities[id])
            .filter(session => session.swimmer === swimmer);
        },
        
        getSessionsByPhase: (phase) => {
          const { entities, ids } = get();
          return ids
            .map(id => entities[id])
            .filter(session => session.sessionType === phase);
        },
        
        getSessionsByType: (type) => {
          const { entities, ids } = get();
          return ids
            .map(id => entities[id])
            .filter(session => session.sessionType === type);
        },
        
        // =====================================================
        // STATISTICS
        // =====================================================
        
        getTotalDistance: () => {
          const { entities, ids } = get();
          return ids.reduce((total, id) => total + (entities[id].distance || 0), 0);
        },
        
        getTotalDistanceByDate: (date) => {
          const sessions = get().getSessionsByDate(date);
          return sessions.reduce((total, session) => total + (session.distance || 0), 0);
        },
        
        getTotalDistanceByRange: (startDate, endDate) => {
          const sessions = get().getSessionsByDateRange(startDate, endDate);
          return sessions.reduce((total, session) => total + (session.distance || 0), 0);
        },
        
        getAverageDistance: () => {
          const { ids } = get();
          if (ids.length === 0) return 0;
          return get().getTotalDistance() / ids.length;
        },
        
        getSessionCount: () => get().ids.length,
        
        // =====================================================
        // ZONE ANALYSIS
        // =====================================================
        
        getZoneDistribution: () => {
          const { entities, ids } = get();
          const distribution = { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 };
          
          ids.forEach(id => {
            const session = entities[id];
            if (session.zoneVolumes) {
              Object.entries(session.zoneVolumes).forEach(([zone, volume]) => {
                distribution[zone as keyof typeof distribution] += volume;
              });
            }
          });
          
          return distribution;
        },
        
        getZoneDistributionByDate: (date) => {
          const sessions = get().getSessionsByDate(date);
          const distribution = { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 };
          
          sessions.forEach(session => {
            if (session.zoneVolumes) {
              Object.entries(session.zoneVolumes).forEach(([zone, volume]) => {
                distribution[zone as keyof typeof distribution] += volume;
              });
            }
          });
          
          return distribution;
        },
        
        // =====================================================
        // LEGACY ALIASES FOR COMPATIBILITY
        // =====================================================
        
        addSession: (sessionData: Omit<SessionEntity, 'id' | 'createdAt' | 'updatedAt'>) => get().addEntity(sessionData),
        updateSession: (id: string, updates: Partial<SessionEntity>) => get().updateEntity(id, updates),
        deleteSession: (id: string) => get().deleteEntity(id),
      }),
      {
        name: 'sessions-store',
        partialize: (state) => ({
          entities: state.entities,
          ids: state.ids,
          totalCount: state.totalCount,
          lastUpdated: state.lastUpdated,
        }),
      }
    )
  )
);

// =====================================================
// SELECTOR HOOKS FOR PERFORMANCE
// =====================================================

export const useSessions = () => useSessionsStore((state) => 
  state.ids.map(id => state.entities[id])
);

export const useSession = (id: string) => useSessionsStore((state) => 
  state.entities[id]
);

export const useSessionsByDate = (date: string) => useSessionsStore((state) => 
  state.getSessionsByDate(date)
);

export const useSessionsByDateRange = (startDate: string, endDate: string) => useSessionsStore((state) => 
  state.getSessionsByDateRange(startDate, endDate)
);

export const useSessionsLoading = () => useSessionsStore((state) => state.isLoading);
export const useSessionsError = () => useSessionsStore((state) => state.error);
export const useSessionsCount = () => useSessionsStore((state) => state.totalCount);

// =====================================================
// ACTION HOOKS
// =====================================================

export const useSessionsActions = () => useSessionsStore((state) => ({
  addSession: state.addSession,
  updateSession: state.updateSession,
  deleteSession: state.deleteSession,
  setEntities: state.setEntities,
  setLoading: state.setLoading,
  setError: state.setError,
  clearEntities: state.clearEntities,
}));

export const useSessionsSelectors = () => useSessionsStore((state) => ({
  getSessionsByDate: state.getSessionsByDate,
  getSessionsByDateRange: state.getSessionsByDateRange,
  getSessionsBySwimmer: state.getSessionsBySwimmer,
  getSessionsByPhase: state.getSessionsByPhase,
  getSessionsByType: state.getSessionsByType,
  getTotalDistance: state.getTotalDistance,
  getTotalDistanceByDate: state.getTotalDistanceByDate,
  getTotalDistanceByRange: state.getTotalDistanceByRange,
  getAverageDistance: state.getAverageDistance,
  getSessionCount: state.getSessionCount,
  getZoneDistribution: state.getZoneDistribution,
  getZoneDistributionByDate: state.getZoneDistributionByDate,
}));

// =====================================================
// MIGRATION ALIASES
// =====================================================

// Alias for migration compatibility
export { useSessionsStore as useNewSessionsStore };

// Export the state interface for external use
    export type { SessionsState };

