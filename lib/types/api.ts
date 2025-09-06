// =====================================================
// TIPOS DE API Y RESPUESTAS
// =====================================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface RequestConfig {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string>;
}

export interface ApiClient {
  get: <T>(url: string, config?: Partial<RequestConfig>) => Promise<ApiResponse<T>>;
  post: <T>(url: string, data?: unknown, config?: Partial<RequestConfig>) => Promise<ApiResponse<T>>;
  put: <T>(url: string, data?: unknown, config?: Partial<RequestConfig>) => Promise<ApiResponse<T>>;
  delete: <T>(url: string, config?: Partial<RequestConfig>) => Promise<ApiResponse<T>>;
}

// Supabase specific types
export interface SupabaseResponse<T> {
  data: T | null;
  error: {
    message: string;
    details: string;
    hint: string;
    code: string;
  } | null;
}

export interface SupabaseAuthResponse {
  user: unknown;
  session: unknown;
  error: unknown;
}

// Database table types
export interface DatabaseTable {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface UserTable extends DatabaseTable {
  email: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}

export interface SessionTable extends DatabaseTable {
  user_id: string;
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
