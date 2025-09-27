/**
 * Actions for club management
 * @fileoverview Functions for CRUD of clubs and teams
 */

import type {
    ApiResponse,
    Club,
    ClubFilters,
    ClubWithStats,
    CreateClubData,
    CreateTeamData,
    CreateTeamMemberData,
    Team,
    TeamFilters,
    TeamMember,
    TeamMemberFilters,
    TeamMemberWithUser,
    TeamWithClub,
    UpdateClubData,
    UpdateTeamData,
    UpdateTeamMemberData
} from '@/lib/types/club';
import { createClient } from '@/utils/supabase/client';

// =====================================================
// CLIENTE SUPABASE
// =====================================================

const supabase = createClient();

// =====================================================
// FUNCIONES DE CLUBES
// =====================================================

/**
 * Obtener todos los clubes del usuario
 */
export async function getClubs(filters?: ClubFilters): Promise<ApiResponse<ClubWithStats[]>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    let query = supabase
      .from('clubs_with_teams')
      .select('*')
      .eq('is_active', true);

    // Aplicar filtros
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
    }
    if (filters?.location) {
      query = query.eq('location', filters.location);
    }
    if (filters?.created_by) {
      query = query.eq('created_by', filters.created_by);
    }

    const { data, error } = await query.order('name');

    if (error) {
      throw new Error(`Error fetching clubs: ${error.message}`);
    }

    return {
      data: data || [],
      success: true,
    };
  } catch (error) {
    console.error('Error en getClubs:', error);
    return {
      data: [],
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Obtener un club por ID
 */
export async function getClubById(clubId: string): Promise<ApiResponse<ClubWithStats | null>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('clubs_with_teams')
      .select('*')
      .eq('id', clubId)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return {
          data: null,
          success: true,
          message: 'Club no encontrado',
        };
      }
      throw new Error(`Error al obtener club: ${error.message}`);
    }

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error('Error en getClubById:', error);
    return {
      data: null,
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Crear un nuevo club
 */
export async function createClub(clubData: CreateClubData): Promise<ApiResponse<Club>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('clubs')
      .insert({
        ...clubData,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear club: ${error.message}`);
    }

    // Crear permiso de propietario
    await supabase
      .from('club_permissions')
      .insert({
        club_id: data.id,
        user_id: user.id,
        permission_type: 'owner',
      });

    return {
      data,
      success: true,
      message: 'Club creado exitosamente',
    };
  } catch (error) {
    console.error('Error en createClub:', error);
    return {
      data: {} as Club,
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Actualizar un club
 */
export async function updateClub(clubData: UpdateClubData): Promise<ApiResponse<Club>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { id, ...updateData } = clubData;

    const { data, error } = await supabase
      .from('clubs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al actualizar club: ${error.message}`);
    }

    return {
      data,
      success: true,
      message: 'Club actualizado exitosamente',
    };
  } catch (error) {
    console.error('Error en updateClub:', error);
    return {
      data: {} as Club,
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Eliminar un club (soft delete)
 */
export async function deleteClub(clubId: string): Promise<ApiResponse<boolean>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('clubs')
      .update({ is_active: false })
      .eq('id', clubId);

    if (error) {
      throw new Error(`Error al eliminar club: ${error.message}`);
    }

    return {
      data: true,
      success: true,
      message: 'Club eliminado exitosamente',
    };
  } catch (error) {
    console.error('Error en deleteClub:', error);
    return {
      data: false,
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

// =====================================================
// FUNCIONES DE EQUIPOS
// =====================================================

/**
 * Obtener equipos de un club
 */
export async function getTeamsByClub(clubId: string, filters?: TeamFilters): Promise<ApiResponse<TeamWithClub[]>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    let query = supabase
      .from('teams')
      .select(`
        *,
        clubs!inner(
          id,
          name,
          location
        )
      `)
      .eq('club_id', clubId)
      .eq('is_active', true);

    // Aplicar filtros
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    if (filters?.level) {
      query = query.eq('level', filters.level);
    }
    if (filters?.created_by) {
      query = query.eq('created_by', filters.created_by);
    }

    const { data, error } = await query.order('name');

    if (error) {
      throw new Error(`Error al obtener equipos: ${error.message}`);
    }

    // Transformar los datos para que coincidan con TeamWithClub
    const teamsWithClub: TeamWithClub[] = (data || []).map(team => ({
      ...team,
      club_name: team.clubs?.name || 'Unknown club',
      club_location: team.clubs?.location || 'No location',
      member_count: 0, // For now 0, can be calculated later
    }));

    return {
      data: teamsWithClub,
      success: true,
    };
  } catch (error) {
    console.error('Error en getTeamsByClub:', error);
    return {
      data: [],
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Obtener un equipo por ID
 */
export async function getTeamById(teamId: string): Promise<ApiResponse<TeamWithClub | null>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        clubs!inner(
          id,
          name,
          location
        )
      `)
      .eq('id', teamId)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return {
          data: null,
          success: true,
          message: 'Equipo no encontrado',
        };
      }
      throw new Error(`Error al obtener equipo: ${error.message}`);
    }

    // Transformar los datos para que coincidan con TeamWithClub
    const teamWithClub: TeamWithClub = {
      ...data,
      club_name: data.clubs?.name || 'Unknown club',
      club_location: data.clubs?.location || 'No location',
      member_count: 0, // For now 0, can be calculated later
    };

    return {
      data: teamWithClub,
      success: true,
    };
  } catch (error) {
    console.error('Error en getTeamById:', error);
    return {
      data: null,
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Crear un nuevo equipo
 */
export async function createTeam(teamData: CreateTeamData): Promise<ApiResponse<Team>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('teams')
      .insert({
        ...teamData,
        max_members: teamData.max_members || 20,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear equipo: ${error.message}`);
    }

    return {
      data,
      success: true,
      message: 'Equipo creado exitosamente',
    };
  } catch (error) {
    console.error('Error en createTeam:', error);
    return {
      data: {} as Team,
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Actualizar un equipo
 */
export async function updateTeam(teamData: UpdateTeamData): Promise<ApiResponse<Team>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { id, ...updateData } = teamData;

    const { data, error } = await supabase
      .from('teams')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al actualizar equipo: ${error.message}`);
    }

    return {
      data,
      success: true,
      message: 'Equipo actualizado exitosamente',
    };
  } catch (error) {
    console.error('Error en updateTeam:', error);
    return {
      data: {} as Team,
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Eliminar un equipo (soft delete)
 */
export async function deleteTeam(teamId: string): Promise<ApiResponse<boolean>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('teams')
      .update({ is_active: false })
      .eq('id', teamId);

    if (error) {
      throw new Error(`Error al eliminar equipo: ${error.message}`);
    }

    return {
      data: true,
      success: true,
      message: 'Equipo eliminado exitosamente',
    };
  } catch (error) {
    console.error('Error en deleteTeam:', error);
    return {
      data: false,
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

// =====================================================
// FUNCIONES DE MIEMBROS
// =====================================================

/**
 * Obtener miembros de un equipo
 */
export async function getTeamMembers(teamId: string, filters?: TeamMemberFilters): Promise<ApiResponse<TeamMemberWithUser[]>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    let query = supabase
      .from('team_members')
      .select(`
        *,
        user:auth.users!team_members_user_id_fkey (
          id,
          email,
          raw_user_meta_data
        )
      `)
      .eq('team_id', teamId)
      .eq('is_active', true);

    // Aplicar filtros
    if (filters?.role) {
      query = query.eq('role', filters.role);
    }
    if (filters?.level) {
      query = query.eq('level', filters.level);
    }
    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id);
    }

    const { data, error } = await query.order('join_date', { ascending: false });

    if (error) {
      throw new Error(`Error al obtener miembros: ${error.message}`);
    }

    // Transform data to include user information
    const membersWithUser: TeamMemberWithUser[] = (data || []).map(member => ({
      ...member,
      user_name: member.user?.raw_user_meta_data?.full_name || member.user?.email?.split('@')[0] || 'Usuario',
      user_email: member.user?.email || '',
      user_avatar: member.user?.raw_user_meta_data?.avatar_url || '',
    }));

    return {
      data: membersWithUser,
      success: true,
    };
  } catch (error) {
    console.error('Error en getTeamMembers:', error);
    return {
      data: [],
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Agregar miembro a un equipo
 */
export async function addTeamMember(memberData: CreateTeamMemberData): Promise<ApiResponse<TeamMember>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('team_members')
      .insert({
        ...memberData,
        role: memberData.role || 'Miembro',
        level: memberData.level || 'Intermedio',
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('El usuario ya es miembro de este equipo');
      }
      throw new Error(`Error al agregar miembro: ${error.message}`);
    }

    return {
      data,
      success: true,
      message: 'Miembro agregado exitosamente',
    };
  } catch (error) {
    console.error('Error en addTeamMember:', error);
    return {
      data: {} as TeamMember,
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Actualizar miembro de equipo
 */
export async function updateTeamMember(memberData: UpdateTeamMemberData): Promise<ApiResponse<TeamMember>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { id, ...updateData } = memberData;

    const { data, error } = await supabase
      .from('team_members')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al actualizar miembro: ${error.message}`);
    }

    return {
      data,
      success: true,
      message: 'Miembro actualizado exitosamente',
    };
  } catch (error) {
    console.error('Error en updateTeamMember:', error);
    return {
      data: {} as TeamMember,
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Remover miembro de equipo
 */
export async function removeTeamMember(memberId: string): Promise<ApiResponse<boolean>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('team_members')
      .update({ is_active: false })
      .eq('id', memberId);

    if (error) {
      throw new Error(`Error al remover miembro: ${error.message}`);
    }

    return {
      data: true,
      success: true,
      message: 'Miembro removido exitosamente',
    };
  } catch (error) {
    console.error('Error en removeTeamMember:', error);
    return {
      data: false,
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

// =====================================================
// FUNCIONES DE UTILIDAD
// =====================================================

/**
 * Verificar si el usuario tiene acceso a un club
 */
export async function hasClubAccess(clubId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('club_permissions')
      .select('id')
      .eq('club_id', clubId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    return !error && !!data;
  } catch (error) {
    console.error('Error en hasClubAccess:', error);
    return false;
  }
}

/**
 * Get club statistics
 */
export async function getClubStats(clubId: string): Promise<ApiResponse<{
  total_teams: number;
  total_members: number;
  active_teams: number;
  active_members: number;
}>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Verificar acceso al club
    const hasAccess = await hasClubAccess(clubId);
    if (!hasAccess) {
      throw new Error('No tienes acceso a este club');
    }

    const { data, error } = await supabase
      .rpc('get_club_stats', { club_uuid: clubId });

    if (error) {
      throw new Error(`Error fetching statistics: ${error.message}`);
    }

    return {
      data: data || {
        total_teams: 0,
        total_members: 0,
        active_teams: 0,
        active_members: 0,
      },
      success: true,
    };
  } catch (error) {
    console.error('Error en getClubStats:', error);
    return {
      data: {
        total_teams: 0,
        total_members: 0,
        active_teams: 0,
        active_members: 0,
      },
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
