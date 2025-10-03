# 🏗️ **STORE MIGRATION PLAN**

## 📋 **Overview**

This document outlines the progressive migration strategy for refactoring our Zustand stores from a monolithic, duplicated architecture to a clean, normalized entity-based structure.

## 🎯 **Migration Goals**

- **Eliminate Duplication**: Remove duplicate stores (`unified.ts`, legacy `sessions.ts`)
- **Improve Performance**: Normalized data structure with optimized selectors
- **Enhance Maintainability**: Clear separation of concerns by entity type
- **Ensure Data Consistency**: Dual-write pattern during migration
- **Minimize Risk**: Atomic commits with rollback capability

## 📊 **Current State Analysis**

### **Critical Stores (High Usage)**
1. **useSessionsStore** - 8+ components, core data layer
2. **useClubsStore** - 10+ components, navigation critical
3. **useTrainingStore** - 6+ components, configuration
4. **useCompetitionsStore** - 4+ components, calendar/planning

### **Important Stores (Moderate Usage)**
5. **useAICoachStore** - 2 components, AI functionality
6. **useAuthStore** - 1 hook, authentication

### **Low Usage Stores**
7. **useReportsStore** - Migration only
8. **useUIStore** - Tests only

## 🚀 **Migration Strategy**

### **Phase 1: Sessions Store Migration** ✅ **COMPLETED**

**Commit 1: Create New Normalized Sessions Store**
- ✅ Created `core/stores/entities/session.ts` with normalized structure
- ✅ Implemented CRUD operations with proper typing
- ✅ Added advanced selectors for common queries
- ✅ Maintained backward compatibility with legacy store

**Commit 2: Add Migration Bridge**
- ✅ Created `core/stores/migration/sessions-bridge.ts`
- ✅ Implemented dual-write pattern for data consistency
- ✅ Added validation layer to ensure data integrity
- ✅ Marked legacy store as deprecated with warnings

**Commit 3: Create Validation Tests**
- ✅ Added comprehensive test suite for migration
- ✅ Performance validation tests
- ✅ Data consistency validation
- ✅ Error handling tests

### **Phase 2: Clubs Store Migration** 🔄 **NEXT**

**Commit 4: Create Clubs Entity Store**
- Create `core/stores/entities/club.ts`
- Implement normalized club/team structure
- Add migration bridge for clubs

**Commit 5: Migrate Navigation Components**
- Update `components/layout/app-sidebar.tsx`
- Update `components/features/navigation/nav-team-selectors-real.tsx`
- Test navigation functionality

### **Phase 3: Training Store Migration** 📅 **PLANNED**

**Commit 6: Create Training Entity Store**
- Create `core/stores/entities/training.ts`
- Implement training phases and zones
- Add migration bridge

**Commit 7: Migrate Training Components**
- Update `components/settings/training-tab.tsx`
- Update `components/features/training/training-zone-detector.tsx`
- Test training configuration

### **Phase 4: Competitions Store Migration** 📅 **PLANNED**

**Commit 8: Create Competitions Entity Store**
- Create `core/stores/entities/competition.ts`
- Implement competition management
- Add migration bridge

**Commit 9: Migrate Calendar Components**
- Update `app/(dashboard)/calendar/page.tsx`
- Update `components/features/dashboard/dashboard-calendar.tsx`
- Test calendar functionality

## 🏗️ **New Architecture**

### **Entity Stores Structure**
```
core/stores/
├── entities/
│   ├── session.ts      # Sessions with normalized structure
│   ├── club.ts         # Clubs and teams
│   ├── competition.ts  # Competitions and events
│   ├── training.ts     # Training phases and zones
│   ├── user.ts         # User profiles and auth
│   ├── types.ts        # Shared entity types
│   └── index.ts        # Entity exports
├── ui/
│   ├── dashboard.ts    # Dashboard state
│   ├── modals.ts       # Modal state
│   └── tabs.ts         # Tab state
├── migration/
│   ├── sessions-bridge.ts
│   ├── clubs-bridge.ts
│   └── index.ts
└── index.ts            # Centralized exports
```

### **Entity Store Pattern**
```typescript
interface EntityState<T extends BaseEntity> {
  // Normalized data
  entities: Record<string, T>;
  ids: string[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  lastUpdated: number;
  
  // CRUD operations
  addEntity: (entity: Omit<T, 'id'>) => void;
  updateEntity: (id: string, updates: Partial<T>) => void;
  deleteEntity: (id: string) => void;
  
  // Selectors
  getEntity: (id: string) => T | undefined;
  getAllEntities: () => T[];
}
```

## 🔍 **Validation Strategy**

### **Data Consistency Validation**
- Dual-write pattern ensures both stores stay in sync
- Validation functions check data integrity
- Automatic migration when inconsistencies detected

### **Performance Monitoring**
- Render time measurements before/after migration
- Memory usage tracking
- Bundle size optimization

### **Component Testing**
- Unit tests for each migrated component
- Integration tests for store interactions
- Error boundary testing

## ⚠️ **Risk Mitigation**

### **Rollback Strategy**
- Each commit is independently reversible
- Legacy stores remain functional during migration
- Feature flags for gradual rollout

### **Testing Strategy**
- Comprehensive test suite for each store
- Performance benchmarks
- Data consistency validation

### **Monitoring**
- Error tracking for migration issues
- Performance monitoring
- User feedback collection

## 📈 **Expected Benefits**

### **Performance Improvements**
- Reduced re-renders with normalized data
- Optimized selectors with memoization
- Smaller bundle size after cleanup

### **Developer Experience**
- Clear separation of concerns
- Better TypeScript support
- Easier testing and debugging

### **Maintainability**
- Single source of truth per entity
- Consistent patterns across stores
- Easier to add new features

## 🎯 **Next Steps**

1. **Complete Sessions Migration** - Migrate remaining components
2. **Start Clubs Migration** - Begin Phase 2
3. **Performance Validation** - Measure improvements
4. **Documentation Updates** - Update component docs

---

**Last Updated**: 2024-01-XX  
**Status**: Phase 1 Complete, Phase 2 Ready  
**Next Review**: After Phase 2 completion
