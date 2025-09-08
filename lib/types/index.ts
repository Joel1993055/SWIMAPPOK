// =====================================================
// TIPOS CENTRALIZADOS - EXPORTS PRINCIPALES
// =====================================================

// Session Types
export type { Session } from './session';

// Auth Types
export type {
  AuthResponse,
  Session as AuthSession,
  AuthState,
  PasswordResetData,
  SignInData,
  SignUpData,
  User,
} from './auth';

// Competition Types
export type {
  Competition,
  CompetitionContextType,
  CompetitionFormData,
  CompetitionResult,
} from './competition';

// Training Types
export type {
  TrainingMetrics,
  TrainingPhase,
  TrainingPhaseFormData,
  TrainingPhasesContextType,
  TrainingZones,
  TrainingZonesContextType,
  ZoneDetection,
  ZoneDetectionResult,
} from './training';

// AI Coach Types
export type {
  AICoachAdvice,
  AICoachAnalysis,
  AICoachContextType,
  AICoachRequest,
  AICoachResponse,
} from './ai-coach';

// Reports Types
export type {
  ChartData,
  ReportFilters,
  ReportGenerationRequest,
  ReportTemplate,
  ReportsContextType,
  TrainingReport,
} from './reports';

// API Types
export type {
  ApiClient,
  ApiError,
  ApiResponse,
  DatabaseTable,
  PaginatedResponse,
  RequestConfig,
  SessionTable,
  SupabaseAuthResponse,
  SupabaseResponse,
  UserTable,
} from './api';

// Form Types
export interface SessionFormData {
  title: string;
  date: string;
  type: string;
  duration: number;
  distance: number;
  stroke: string;
  rpe: number;
  location: string;
  coach: string;
  club: string;
  group_name: string;
  objective: string;
  time_slot: string;
  content: string;
  zone_volumes: {
    z1: number;
    z2: number;
    z3: number;
    z4: number;
    z5: number;
  };
}

// Store Types
export interface StoreState {
  isLoading: boolean;
  error: string | null;
}

export interface SessionsStoreState extends StoreState {
  sessions: import('./session').Session[];
  addSession: (session: Omit<import('./session').Session, 'id'>) => void;
  updateSession: (
    id: string,
    updates: Partial<import('./session').Session>
  ) => void;
  deleteSession: (id: string) => void;
  getSessionsByDate: (date: string) => import('./session').Session[];
  getSessionsByRange: (
    startDate: string,
    endDate: string
  ) => import('./session').Session[];
}

// UI Types
export type Theme = 'light' | 'dark' | 'system';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
