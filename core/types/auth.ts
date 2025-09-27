// =====================================================
// TIPOS DE AUTENTICACIÓN
// =====================================================

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User;
}

export interface PasswordResetData {
  email: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}
