// =====================================================
// ENTITY TYPES - SHARED ACROSS ALL ENTITY STORES
// =====================================================

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntityState<T extends BaseEntity> {
  // Normalized data structure
  entities: Record<string, T>;
  ids: string[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  lastUpdated: number;
  
  // Metadata
  totalCount: number;
  hasMore: boolean;
}

export interface EntityActions<T extends BaseEntity> {
  // CRUD operations
  addEntity: (entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntity: (id: string, updates: Partial<T>) => void;
  deleteEntity: (id: string) => void;
  setEntities: (entities: T[]) => void;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearEntities: () => void;
  
  // Utility
  getEntity: (id: string) => T | undefined;
  hasEntity: (id: string) => boolean;
}

// =====================================================
// SELECTOR TYPES
// =====================================================

export interface EntitySelectors<T extends BaseEntity> {
  getAllEntities: () => T[];
  getEntitiesByIds: (ids: string[]) => T[];
  getEntityCount: () => number;
  getLoadingState: () => boolean;
  getErrorState: () => string | null;
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

export const createEntityId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const createTimestamp = (): string => {
  return new Date().toISOString();
};

export const normalizeEntities = <T extends BaseEntity>(
  entities: T[]
): { entities: Record<string, T>; ids: string[] } => {
  const normalized: Record<string, T> = {};
  const ids: string[] = [];
  
  entities.forEach(entity => {
    normalized[entity.id] = entity;
    ids.push(entity.id);
  });
  
  return { entities: normalized, ids };
};
