// =====================================================
// SESSIONS STORE MIGRATION BRIDGE
// =====================================================

import { useSessionsStore as useNewSessionsStore } from '../entities/session';
import { useSessionsStore as useLegacySessionsStore } from '../unified';

// =====================================================
// MIGRATION TYPES
// =====================================================

export interface MigrationResult {
  success: boolean;
  message?: string;
  error?: string;
  migrated?: number;
  validation?: {
    isConsistent: boolean;
    newCount: number;
    legacyCount: number;
    differences: string[];
  };
}

interface MigrationState {
  isMigrating: boolean;
  migrationProgress: number;
  lastMigrationCheck: number;
  errors: string[];
}

// =====================================================
// DUAL-WRITE BRIDGE STORE
// =====================================================

export const useSessionsStoreBridge = () => {
  const newStore = useNewSessionsStore();
  const legacyStore = useLegacySessionsStore();
  
  // =====================================================
  // DATA CONSISTENCY VALIDATION
  // =====================================================
  
  const validateDataConsistency = () => {
    const newSessions = newStore.ids.map(id => newStore.entities[id]);
    const legacySessions = legacyStore.sessions;
    
    // Check if data is consistent
    const isConsistent = newSessions.length === legacySessions.length &&
      newSessions.every(newSession => 
        legacySessions.some(legacySession => 
          legacySession.id === newSession.id &&
          legacySession.date === newSession.date &&
          legacySession.distance === newSession.distance
        )
      );
    
    return {
      isConsistent,
      newCount: newSessions.length,
      legacyCount: legacySessions.length,
      differences: findDataDifferences(newSessions, legacySessions),
    };
  };
  
  const findDataDifferences = (newSessions: any[], legacySessions: any[]) => {
    const differences = [];
    
    // Find sessions in legacy but not in new
    const missingInNew = legacySessions.filter(legacy => 
      !newSessions.some(newSession => newSession.id === legacy.id)
    );
    
    // Find sessions in new but not in legacy
    const missingInLegacy = newSessions.filter(newSession => 
      !legacySessions.some(legacy => legacy.id === newSession.id)
    );
    
    if (missingInNew.length > 0) {
      differences.push(`Missing in new store: ${missingInNew.length} sessions`);
    }
    
    if (missingInLegacy.length > 0) {
      differences.push(`Missing in legacy store: ${missingInLegacy.length} sessions`);
    }
    
    return differences;
  };
  
  // =====================================================
  // DUAL-WRITE OPERATIONS
  // =====================================================
  
  const addSession = (sessionData: any) => {
    try {
      // Add to new store
      newStore.addSession(sessionData);
      
      // Add to legacy store for compatibility
      legacyStore.addSession(sessionData);
      
      return { success: true, error: null };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to add session: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  };
  
  const updateSession = (id: string, updates: any) => {
    try {
      // Update new store
      newStore.updateSession(id, updates);
      
      // Update legacy store for compatibility
      legacyStore.updateSession(id, updates);
      
      return { success: true, error: null };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to update session: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  };
  
  const deleteSession = (id: string) => {
    try {
      // Delete from new store
      newStore.deleteSession(id);
      
      // Delete from legacy store for compatibility
      legacyStore.deleteSession(id);
      
      return { success: true, error: null };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to delete session: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  };
  
  const setSessions = (sessions: any[]) => {
    try {
      // Set in new store
      newStore.setEntities(sessions);
      
      // Set in legacy store for compatibility
      legacyStore.setSessions(sessions);
      
      return { success: true, error: null };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to set sessions: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  };
  
  // =====================================================
  // MIGRATION UTILITIES
  // =====================================================
  
  const migrateLegacyData = () => {
    try {
      const legacySessions = legacyStore.sessions;
      const newSessions = newStore.ids.map(id => newStore.entities[id]);
      
      // Only migrate if new store is empty or has fewer sessions
      if (newSessions.length < legacySessions.length) {
        newStore.setEntities(legacySessions);
        return { 
          success: true, 
          migrated: legacySessions.length - newSessions.length,
          error: null 
        };
      }
      
      return { 
        success: true, 
        migrated: 0, 
        error: null,
        message: 'No migration needed - new store is up to date'
      };
    } catch (error) {
      return { 
        success: false, 
        migrated: 0, 
        error: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  };
  
  const syncStores = () => {
    const validation = validateDataConsistency();
    
    if (!validation.isConsistent) {
      // Attempt to sync by migrating legacy data
      return migrateLegacyData();
    }
    
    return { 
      success: true, 
      synced: true, 
      error: null,
      message: 'Stores are already in sync'
    };
  };
  
  // =====================================================
  // BRIDGE API
  // =====================================================
  
  return {
    // New store (primary)
    ...newStore,
    
    // Legacy compatibility
    sessions: legacyStore.sessions, // For backward compatibility
    
    // Bridge operations
    addSession,
    updateSession,
    deleteSession,
    setSessions,
    
    // Migration utilities
    validateDataConsistency,
    migrateLegacyData,
    syncStores,
    
    // Migration state
    isMigrating: false, // Will be managed by migration hook
    migrationProgress: 0,
    lastMigrationCheck: Date.now(),
    errors: [],
  };
};

// =====================================================
// MIGRATION HOOK
// =====================================================

export const useSessionsMigration = () => {
  const bridge = useSessionsStoreBridge();
  
  const performMigration = async () => {
    try {
      bridge.setLoading(true);
      
      // Validate current state
      const validation = bridge.validateDataConsistency();
      
      if (!validation.isConsistent) {
        // Perform migration
        const result = bridge.migrateLegacyData();
        
        if (!result.success) {
          throw new Error(result.error);
        }
        
        return {
          success: true,
          message: `Migration completed. Migrated ${result.migrated} sessions.`,
          validation: bridge.validateDataConsistency(),
        };
      }
      
      return {
        success: true,
        message: 'No migration needed - stores are consistent.',
        validation,
      };
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown migration error',
        validation: bridge.validateDataConsistency(),
      };
    } finally {
      bridge.setLoading(false);
    }
  };
  
  return {
    performMigration,
    validateConsistency: bridge.validateDataConsistency,
    syncStores: bridge.syncStores,
    isMigrating: bridge.isLoading,
  };
};
