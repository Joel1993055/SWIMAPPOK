/**
 * Tipos para la gestión de clubes y equipos
 * @fileoverview Definiciones de tipos para el sistema de clubes y equipos
 */

// =====================================================
// TIPOS BASE
// =====================================================

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

// =====================================================
// TIPOS DE CLUB
// =====================================================

export interface Club extends BaseEntity {
  name: string;
  description?: string;
  location: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  established_date?: string;
  created_by: string;
}

export interface ClubWithStats extends Club {
  team_count: number;
  total_members: number;
}

export interface CreateClubData {
  name: string;
  description?: string;
  location: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  established_date?: string;
}

export interface UpdateClubData extends Partial<CreateClubData> {
  id: string;
}

// =====================================================
// TIPOS DE EQUIPO
// =====================================================

export type TeamLevel = 'Principiante' | 'Intermedio' | 'Avanzado' | 'Elite' | 'Mixto';

export interface Team extends BaseEntity {
  club_id: string;
  name: string;
  description?: string;
  level: TeamLevel;
  age_range?: string;
  max_members: number;
  coach_name?: string;
  coach_email?: string;
  coach_phone?: string;
  schedule?: string;
  focus_area?: string;
  created_by: string;
}

export interface TeamWithClub extends Team {
  club_name: string;
  club_location: string;
  member_count: number;
}

export interface CreateTeamData {
  club_id: string;
  name: string;
  description?: string;
  level: TeamLevel;
  age_range?: string;
  max_members?: number;
  coach_name?: string;
  coach_email?: string;
  coach_phone?: string;
  schedule?: string;
  focus_area?: string;
}

export interface UpdateTeamData extends Partial<CreateTeamData> {
  id: string;
}

// =====================================================
// TIPOS DE MIEMBROS
// =====================================================

export type TeamRole = 'Capitán' | 'Vice-Capitán' | 'Miembro' | 'Entrenador';

export interface TeamMember extends BaseEntity {
  team_id: string;
  user_id: string;
  role: TeamRole;
  level: TeamLevel;
  join_date: string;
}

export interface TeamMemberWithUser extends TeamMember {
  user_name?: string;
  user_email?: string;
  user_avatar?: string;
}

export interface CreateTeamMemberData {
  team_id: string;
  user_id: string;
  role?: TeamRole;
  level?: TeamLevel;
}

export interface UpdateTeamMemberData {
  id: string;
  role?: TeamRole;
  level?: TeamLevel;
  is_active?: boolean;
}

// =====================================================
// TIPOS DE PERMISOS
// =====================================================

export type ClubPermissionType = 'owner' | 'admin' | 'coach' | 'member';

export interface ClubPermission extends BaseEntity {
  club_id: string;
  user_id: string;
  permission_type: ClubPermissionType;
  granted_by?: string;
  granted_at: string;
  expires_at?: string;
}

export interface CreateClubPermissionData {
  club_id: string;
  user_id: string;
  permission_type: ClubPermissionType;
  expires_at?: string;
}

// =====================================================
// TIPOS DE RESPUESTA DE API
// =====================================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// =====================================================
// TIPOS DE FILTROS Y BÚSQUEDA
// =====================================================

export interface ClubFilters {
  search?: string;
  location?: string;
  is_active?: boolean;
  created_by?: string;
}

export interface TeamFilters {
  club_id?: string;
  search?: string;
  level?: TeamLevel;
  is_active?: boolean;
  created_by?: string;
}

export interface TeamMemberFilters {
  team_id?: string;
  user_id?: string;
  role?: TeamRole;
  level?: TeamLevel;
  is_active?: boolean;
}

// =====================================================
// TIPOS DE ESTADÍSTICAS
// =====================================================

export interface ClubStats {
  total_clubs: number;
  total_teams: number;
  total_members: number;
  active_clubs: number;
  active_teams: number;
  active_members: number;
}

export interface TeamStats {
  total_members: number;
  active_members: number;
  members_by_level: Record<TeamLevel, number>;
  members_by_role: Record<TeamRole, number>;
  average_age?: number;
}

// =====================================================
// TIPOS DE FORMULARIOS
// =====================================================

export interface ClubFormData {
  name: string;
  description: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  established_date: string;
}

export interface TeamFormData {
  name: string;
  description: string;
  level: TeamLevel;
  age_range: string;
  max_members: number;
  coach_name: string;
  coach_email: string;
  coach_phone: string;
  schedule: string;
  focus_area: string;
}

export interface TeamMemberFormData {
  user_id: string;
  role: TeamRole;
  level: TeamLevel;
}

// =====================================================
// TIPOS DE VALIDACIÓN
// =====================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: ValidationError[];
}

// =====================================================
// TIPOS DE NAVEGACIÓN
// =====================================================

export interface ClubContext {
  selectedClub: string | null;
  selectedTeam: string | null;
  availableClubs: Club[];
  availableTeams: Team[];
}

export interface NavigationState {
  clubs: Club[];
  teams: Team[];
  selectedClubId: string | null;
  selectedTeamId: string | null;
  isLoading: boolean;
  error: string | null;
}

// =====================================================
// TIPOS DE EVENTOS
// =====================================================

export interface ClubEvent {
  type: 'club_created' | 'club_updated' | 'club_deleted';
  club_id: string;
  data: Club;
  timestamp: string;
}

export interface TeamEvent {
  type: 'team_created' | 'team_updated' | 'team_deleted';
  team_id: string;
  club_id: string;
  data: Team;
  timestamp: string;
}

export interface TeamMemberEvent {
  type: 'member_added' | 'member_updated' | 'member_removed';
  member_id: string;
  team_id: string;
  club_id: string;
  data: TeamMember;
  timestamp: string;
}

export type AppEvent = ClubEvent | TeamEvent | TeamMemberEvent;
