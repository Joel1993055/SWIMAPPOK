// =====================================================
// NEW SESSIONS HOOKS (RE-EXPORTS FROM NORMALIZED STORE)
// =====================================================

export {
  useSession, useSessions, // selectores avanzados
  useSessionsActions, // una sesión por id
  useSessionsByDate,
  useSessionsByDateRange, // acciones CRUD
  useSessionsCount, useSessionsError, useSessionsLoading, useSessionsSelectors
} from '@/core/stores/entities/session';

