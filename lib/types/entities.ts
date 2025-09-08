// =====================================================
// ENTIDADES BASE NORMALIZADAS
// =====================================================

// Base entity con campos comunes
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// =====================================================
// USUARIO
// =====================================================
export interface User extends BaseEntity {
  email: string;
  name: string;
  avatar_url?: string;
  preferences: UserPreferences;
  subscription_status: 'free' | 'premium' | 'pro';
  last_login_at?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  units: 'metric' | 'imperial';
  notifications: {
    email: boolean;
    push: boolean;
    training_reminders: boolean;
    competition_alerts: boolean;
  };
}

// =====================================================
// SESIÓN DE ENTRENAMIENTO
// =====================================================
export interface Session extends BaseEntity {
  name: string;
  date: string;
  duration_minutes: number;
  distance_meters: number;
  stroke_type: StrokeType;
  session_type: SessionType;
  main_set: string;
  rpe: number; // 1-10
  notes?: string;
  training_phase_id: string;
  competition_id?: string;
  weather_conditions?: WeatherConditions;
  pool_type: PoolType;
  water_temperature?: number;
}

export type StrokeType =
  | 'freestyle'
  | 'backstroke'
  | 'breaststroke'
  | 'butterfly'
  | 'mixed';
export type SessionType =
  | 'aerobic'
  | 'threshold'
  | 'speed'
  | 'technique'
  | 'recovery';
export type PoolType = 'indoor' | 'outdoor' | 'open_water';

export interface WeatherConditions {
  temperature?: number;
  humidity?: number;
  wind_speed?: number;
  conditions: 'sunny' | 'cloudy' | 'rainy' | 'windy' | 'stormy';
}

// =====================================================
// FASE DE ENTRENAMIENTO
// =====================================================
export interface TrainingPhase extends BaseEntity {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  priority: 'low' | 'medium' | 'high';
  methodology: TrainingMethodology;
  objectives: string[];
  target_volume_km: number;
  target_sessions_per_week: number;
  is_active: boolean;
}

export type TrainingMethodology =
  | 'standard'
  | 'polarized'
  | 'pyramidal'
  | 'block';

// =====================================================
// COMPETICIÓN
// =====================================================
export interface Competition extends BaseEntity {
  name: string;
  date: string;
  location: string;
  type: CompetitionType;
  distance: number;
  stroke: StrokeType;
  priority: 'low' | 'medium' | 'high';
  status: 'upcoming' | 'completed' | 'cancelled';
  target_time?: string;
  actual_time?: string;
  position?: number;
  notes?: string;
  registration_url?: string;
}

export type CompetitionType =
  | 'local'
  | 'regional'
  | 'national'
  | 'international';

// =====================================================
// ZONAS DE ENTRENAMIENTO
// =====================================================
export interface TrainingZones {
  z1: TrainingZone;
  z2: TrainingZone;
  z3: TrainingZone;
  z4: TrainingZone;
  z5: TrainingZone;
}

export interface TrainingZone {
  name: string;
  min_percentage: number;
  max_percentage: number;
  description: string;
  color: string;
}

// =====================================================
// CONSEJO DE IA
// =====================================================
export interface AICoachAdvice extends BaseEntity {
  type: AdviceType;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  is_read: boolean;
  is_applied: boolean;
  session_id?: string;
  phase_id?: string;
  competition_id?: string;
}

export type AdviceType =
  | 'training'
  | 'nutrition'
  | 'recovery'
  | 'technique'
  | 'mental'
  | 'equipment';

// =====================================================
// ANÁLISIS DE IA
// =====================================================
export interface AICoachAnalysis extends BaseEntity {
  type: AnalysisType;
  title: string;
  summary: string;
  insights: string[];
  recommendations: string[];
  confidence_score: number; // 0-100
  data_period_start: string;
  data_period_end: string;
  session_ids: string[];
}

export type AnalysisType =
  | 'performance'
  | 'progress'
  | 'injury_risk'
  | 'overtraining'
  | 'technique';

// =====================================================
// REPORTE DE ENTRENAMIENTO
// =====================================================
export interface TrainingReport extends BaseEntity {
  type: ReportType;
  title: string;
  summary: string;
  data: ReportData;
  generated_at: string;
  period_start: string;
  period_end: string;
  is_shared: boolean;
  share_token?: string;
}

export type ReportType =
  | 'weekly'
  | 'monthly'
  | 'phase'
  | 'competition'
  | 'custom';

export interface ReportData {
  sessions_count: number;
  total_distance: number;
  total_duration: number;
  average_rpe: number;
  stroke_distribution: Record<StrokeType, number>;
  phase_progress: number;
  recommendations: string[];
  charts: ChartData[];
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'area';
  title: string;
  data: Record<string, unknown>[];
  x_axis?: string;
  y_axis?: string;
}

// =====================================================
// NOTIFICACIÓN
// =====================================================
export interface Notification extends BaseEntity {
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string;
  action_text?: string;
  expires_at?: string;
  priority: 'low' | 'medium' | 'high';
}

export type NotificationType =
  | 'training_reminder'
  | 'competition_alert'
  | 'achievement'
  | 'system'
  | 'social';

// =====================================================
// CONFIGURACIÓN DE APLICACIÓN
// =====================================================
export interface AppConfig {
  version: string;
  maintenance_mode: boolean;
  features: {
    ai_coach: boolean;
    competitions: boolean;
    reports: boolean;
    social: boolean;
    analytics: boolean;
  };
  limits: {
    max_sessions_per_month: number;
    max_competitions: number;
    max_reports: number;
  };
}
