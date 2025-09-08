import { z } from 'zod';

// =====================================================
// SCHEMAS BASE
// =====================================================

const baseEntitySchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  user_id: z.string().uuid(),
});

// =====================================================
// SCHEMAS DE USUARIO
// =====================================================

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string().min(2).max(5),
  timezone: z.string(),
  units: z.enum(['metric', 'imperial']),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    training_reminders: z.boolean(),
    competition_alerts: z.boolean(),
  }),
});

export const userSchema = baseEntitySchema.extend({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  avatar_url: z.string().url().optional(),
  preferences: userPreferencesSchema,
  subscription_status: z.enum(['free', 'premium', 'pro']),
  last_login_at: z.string().datetime().optional(),
});

export const createUserSchema = userSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  user_id: true,
});

export const updateUserSchema = createUserSchema.partial();

// =====================================================
// SCHEMAS DE SESIÓN
// =====================================================

export const sessionSchema = baseEntitySchema.extend({
  name: z.string().min(1).max(200),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  duration_minutes: z.number().int().min(1).max(1440), // Max 24 hours
  distance_meters: z.number().int().min(1).max(100000), // Max 100km
  stroke_type: z.enum([
    'freestyle',
    'backstroke',
    'breaststroke',
    'butterfly',
    'mixed',
  ]),
  session_type: z.enum([
    'aerobic',
    'threshold',
    'speed',
    'technique',
    'recovery',
  ]),
  main_set: z.string().min(1).max(500),
  rpe: z.number().int().min(1).max(10),
  notes: z.string().max(1000).optional(),
  training_phase_id: z.string().uuid(),
  competition_id: z.string().uuid().optional(),
  weather_conditions: z
    .object({
      temperature: z.number().min(-50).max(50).optional(),
      humidity: z.number().min(0).max(100).optional(),
      wind_speed: z.number().min(0).max(200).optional(),
      conditions: z.enum(['sunny', 'cloudy', 'rainy', 'windy', 'stormy']),
    })
    .optional(),
  pool_type: z.enum(['indoor', 'outdoor', 'open_water']),
  water_temperature: z.number().min(0).max(40).optional(),
});

export const createSessionSchema = sessionSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  user_id: true,
});

export const updateSessionSchema = createSessionSchema.partial();

// =====================================================
// SCHEMAS DE FASE DE ENTRENAMIENTO
// =====================================================

export const trainingPhaseSchema = baseEntitySchema
  .extend({
    name: z.string().min(1).max(200),
    description: z.string().min(1).max(1000),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    priority: z.enum(['low', 'medium', 'high']),
    methodology: z.enum(['standard', 'polarized', 'pyramidal', 'block']),
    objectives: z.array(z.string().min(1).max(200)).min(1).max(10),
    target_volume_km: z.number().min(0).max(1000),
    target_sessions_per_week: z.number().int().min(1).max(14),
    is_active: z.boolean(),
  })
  .refine(data => new Date(data.start_date) <= new Date(data.end_date), {
    message: 'End date must be after start date',
    path: ['end_date'],
  });

export const createTrainingPhaseSchema = trainingPhaseSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  user_id: true,
});

export const updateTrainingPhaseSchema = createTrainingPhaseSchema.partial();

// =====================================================
// SCHEMAS DE COMPETICIÓN
// =====================================================

export const competitionSchema = baseEntitySchema.extend({
  name: z.string().min(1).max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location: z.string().min(1).max(200),
  type: z.enum(['local', 'regional', 'national', 'international']),
  distance: z.number().int().min(25).max(10000), // 25m to 10km
  stroke: z.enum([
    'freestyle',
    'backstroke',
    'breaststroke',
    'butterfly',
    'mixed',
  ]),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['upcoming', 'completed', 'cancelled']),
  target_time: z
    .string()
    .regex(/^\d{1,2}:\d{2}(:\d{2})?$/)
    .optional(),
  actual_time: z
    .string()
    .regex(/^\d{1,2}:\d{2}(:\d{2})?$/)
    .optional(),
  position: z.number().int().min(1).optional(),
  notes: z.string().max(1000).optional(),
  registration_url: z.string().url().optional(),
});

export const createCompetitionSchema = competitionSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  user_id: true,
});

export const updateCompetitionSchema = createCompetitionSchema.partial();

// =====================================================
// SCHEMAS DE ZONAS DE ENTRENAMIENTO
// =====================================================

export const trainingZoneSchema = z
  .object({
    name: z.string().min(1).max(50),
    min_percentage: z.number().min(0).max(100),
    max_percentage: z.number().min(0).max(100),
    description: z.string().min(1).max(200),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  })
  .refine(data => data.min_percentage < data.max_percentage, {
    message: 'Min percentage must be less than max percentage',
    path: ['min_percentage'],
  });

export const trainingZonesSchema = z.object({
  z1: trainingZoneSchema,
  z2: trainingZoneSchema,
  z3: trainingZoneSchema,
  z4: trainingZoneSchema,
  z5: trainingZoneSchema,
});

// =====================================================
// SCHEMAS DE CONSEJO DE IA
// =====================================================

export const aiCoachAdviceSchema = baseEntitySchema.extend({
  type: z.enum([
    'training',
    'nutrition',
    'recovery',
    'technique',
    'mental',
    'equipment',
  ]),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(2000),
  priority: z.enum(['low', 'medium', 'high']),
  category: z.string().min(1).max(50),
  is_read: z.boolean(),
  is_applied: z.boolean(),
  session_id: z.string().uuid().optional(),
  phase_id: z.string().uuid().optional(),
  competition_id: z.string().uuid().optional(),
});

export const createAICoachAdviceSchema = aiCoachAdviceSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  user_id: true,
});

// =====================================================
// SCHEMAS DE REPORTE
// =====================================================

export const chartDataSchema = z.object({
  type: z.enum(['line', 'bar', 'pie', 'area']),
  title: z.string().min(1).max(100),
  data: z.array(z.any()),
  x_axis: z.string().optional(),
  y_axis: z.string().optional(),
});

export const reportDataSchema = z.object({
  sessions_count: z.number().int().min(0),
  total_distance: z.number().min(0),
  total_duration: z.number().min(0),
  average_rpe: z.number().min(0).max(10),
  stroke_distribution: z.record(z.string(), z.number().int().min(0)),
  phase_progress: z.number().min(0).max(100),
  recommendations: z.array(z.string().min(1).max(500)),
  charts: z.array(chartDataSchema),
});

export const trainingReportSchema = baseEntitySchema
  .extend({
    type: z.enum(['weekly', 'monthly', 'phase', 'competition', 'custom']),
    title: z.string().min(1).max(200),
    summary: z.string().min(1).max(1000),
    data: reportDataSchema,
    generated_at: z.string().datetime(),
    period_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    period_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    is_shared: z.boolean(),
    share_token: z.string().uuid().optional(),
  })
  .refine(data => new Date(data.period_start) <= new Date(data.period_end), {
    message: 'Period end must be after period start',
    path: ['period_end'],
  });

export const createTrainingReportSchema = trainingReportSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  user_id: true,
});

// =====================================================
// SCHEMAS DE FILTROS
// =====================================================

export const sessionFiltersSchema = z
  .object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    training_phase_id: z.string().uuid().optional(),
    competition_id: z.string().uuid().optional(),
    stroke_type: z
      .enum(['freestyle', 'backstroke', 'breaststroke', 'butterfly', 'mixed'])
      .optional(),
    session_type: z
      .enum(['aerobic', 'threshold', 'speed', 'technique', 'recovery'])
      .optional(),
  })
  .refine(
    data => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  );

export const paginationSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
});

// =====================================================
// SCHEMAS DE BÚSQUEDA
// =====================================================

export const searchSchema = z.object({
  query: z.string().min(1).max(100),
  filters: z.record(z.string(), z.any()).optional(),
});

// =====================================================
// SCHEMAS ADICIONALES PARA FORMULARIOS
// =====================================================

// Schema para formularios de sesión (versión simplificada)
export const sessionFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  date: z
    .string()
    .min(1, 'Date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  startTime: z
    .string()
    .min(1, 'Start time is required')
    .regex(/^\d{2}:\d{2}$/, 'Start time must be in HH:MM format'),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'End time must be in HH:MM format')
    .optional(),
  distance: z
    .number()
    .min(0, 'Distance must be positive')
    .max(100000, 'Distance must be less than 100km'),
  duration: z
    .number()
    .min(0, 'Duration must be positive')
    .max(1440, 'Duration must be less than 24 hours'),
  rpe: z
    .number()
    .min(1, 'RPE must be at least 1')
    .max(10, 'RPE must be at most 10'),
  location: z
    .string()
    .max(200, 'Location must be less than 200 characters')
    .optional(),
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
});

// Schema para búsqueda de sesiones
export const sessionSearchSchema = z.object({
  query: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  minDistance: z.number().min(0).optional(),
  maxDistance: z.number().min(0).optional(),
  minDuration: z.number().min(0).optional(),
  maxDuration: z.number().min(0).optional(),
  minRpe: z.number().min(1).max(10).optional(),
  maxRpe: z.number().min(1).max(10).optional(),
  location: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

// Schema para estadísticas de sesiones
export const sessionStatsSchema = z.object({
  totalSessions: z.number().min(0),
  totalDistance: z.number().min(0),
  totalDuration: z.number().min(0),
  averageRpe: z.number().min(1).max(10),
  averageDistance: z.number().min(0),
  averageDuration: z.number().min(0),
  period: z.object({
    start: z.string(),
    end: z.string(),
  }),
});

// =====================================================
// TIPOS DERIVADOS
// =====================================================

export type SessionFormData = z.infer<typeof sessionFormSchema>;
export type SessionSearchData = z.infer<typeof sessionSearchSchema>;
export type SessionStatsData = z.infer<typeof sessionStatsSchema>;

// =====================================================
// UTILIDADES DE VALIDACIÓN
// =====================================================

export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Validation error: ${error.issues.map(e => e.message).join(', ')}`
      );
    }
    throw error;
  }
}

export function validateDataSafe<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): {
  success: boolean;
  data?: T;
  error?: string;
} {
  try {
    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return {
        success: false,
        error: result.error.issues.map(e => e.message).join(', '),
      };
    }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Unknown validation error',
    };
  }
}
