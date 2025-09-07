// =====================================================
// STORE UNIFICADO - PUNTO DE ENTRADA ÚNICO
// =====================================================

// Exportar solo los stores normalizados
export { useCompetitionsStore } from './normalized/competitions'
export { useSessionsStore } from './normalized/sessions'
export { useTrainingPhasesStore } from './normalized/training-phases'

// Exportar selectores adicionales
export { competitionsSelectors } from './normalized/competitions'
export { sessionsSelectors } from './normalized/sessions'
export { trainingPhasesSelectors } from './normalized/training-phases'

// Exportar hooks de integración
export { useSession, useSessions, useSessionsPagination, useSessionsStats } from '../hooks/use-sessions'

// =====================================================
// STORE LEGACY (DEPRECATED - PARA MIGRACIÓN GRADUAL)
// =====================================================

// Mantener temporalmente para compatibilidad
export { useAICoachStore, useAuthStore, useReportsStore, useUIStore } from './unified'

// =====================================================
// TIPOS EXPORTADOS
// =====================================================

export type { AICoachAdvice, AICoachAnalysis, Competition, Session, TrainingPhase, TrainingReport, User } from '../types/entities'

