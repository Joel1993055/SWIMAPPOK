'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// Data types
export interface SessionData {
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

export interface Session extends SessionData {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// CREAR SESIÓN
// =====================================================
export async function createSession(formData: FormData) {
  const supabase = await createClient();

  // Verify authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  // Extract form data
  const sessionData: SessionData = {
    title: formData.get('title') as string,
    date: formData.get('date') as string,
    type: formData.get('type') as string,
    duration: parseInt(formData.get('duration') as string) || 0,
    distance: parseInt(formData.get('distance') as string) || 0,
    stroke: (formData.get('stroke') as string) || 'Libre',
    rpe: parseInt(formData.get('rpe') as string) || 5,
    location: (formData.get('location') as string) || 'Not specified',
    coach: (formData.get('coach') as string) || 'Not specified',
    club: (formData.get('club') as string) || 'Not specified',
    group_name: (formData.get('group_name') as string) || 'Not specified',
    objective: (formData.get('objective') as string) || 'other',
    time_slot: (formData.get('time_slot') as string) || 'AM',
    content: formData.get('content') as string,
    zone_volumes: {
      z1: parseInt(formData.get('z1') as string) || 0,
      z2: parseInt(formData.get('z2') as string) || 0,
      z3: parseInt(formData.get('z3') as string) || 0,
      z4: parseInt(formData.get('z4') as string) || 0,
      z5: parseInt(formData.get('z5') as string) || 0,
    },
  };

  // Validaciones básicas
  if (!sessionData.title || !sessionData.content) {
    throw new Error('Title and content are required');
  }

  // Insert into database
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      user_id: user.id,
      ...sessionData,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creando sesión:', error);
    throw new Error('Error al crear la sesión');
  }

  // Revalidar páginas
  revalidatePath('/dashboard');
  revalidatePath('/training');

  return data;
}

// =====================================================
// OBTENER SESIONES
// =====================================================
export async function getSessions() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error obteniendo sesiones:', error);
    throw new Error('Error al obtener las sesiones');
  }

  return data as Session[];
}

// =====================================================
// OBTENER SESIÓN POR ID
// =====================================================
export async function getSessionById(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error obteniendo sesión:', error);
    throw new Error('Error al obtener la sesión');
  }

  return data as Session;
}

// =====================================================
// ACTUALIZAR SESIÓN
// =====================================================
export async function updateSession(id: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  // Extract form data
  const sessionData: Partial<SessionData> = {
    title: formData.get('title') as string,
    date: formData.get('date') as string,
    type: formData.get('type') as string,
    duration: parseInt(formData.get('duration') as string) || 0,
    distance: parseInt(formData.get('distance') as string) || 0,
    stroke: (formData.get('stroke') as string) || 'Libre',
    rpe: parseInt(formData.get('rpe') as string) || 5,
    location: (formData.get('location') as string) || 'Not specified',
    coach: (formData.get('coach') as string) || 'Not specified',
    club: (formData.get('club') as string) || 'Not specified',
    group_name: (formData.get('group_name') as string) || 'Not specified',
    objective: (formData.get('objective') as string) || 'other',
    time_slot: (formData.get('time_slot') as string) || 'AM',
    content: formData.get('content') as string,
    zone_volumes: {
      z1: parseInt(formData.get('z1') as string) || 0,
      z2: parseInt(formData.get('z2') as string) || 0,
      z3: parseInt(formData.get('z3') as string) || 0,
      z4: parseInt(formData.get('z4') as string) || 0,
      z5: parseInt(formData.get('z5') as string) || 0,
    },
  };

  // Validaciones básicas
  if (!sessionData.title || !sessionData.content) {
    throw new Error('Title and content are required');
  }

  // Update in database
  const { data, error } = await supabase
    .from('sessions')
    .update(sessionData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating session:', error);
    throw new Error('Error updating session');
  }

  // Revalidar páginas
  revalidatePath('/dashboard');
  revalidatePath('/training');

  return data;
}

// =====================================================
// ELIMINAR SESIÓN
// =====================================================
export async function deleteSession(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error eliminando sesión:', error);
    throw new Error('Error al eliminar la sesión');
  }

  // Revalidar páginas
  revalidatePath('/dashboard');
  revalidatePath('/training');
}

// =====================================================
// OBTENER SESIONES POR RANGO DE FECHAS
// =====================================================
export async function getSessionsByDateRange(
  startDate: string,
  endDate: string
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error obteniendo sesiones por rango:', error);
    throw new Error('Error al obtener las sesiones');
  }

  return data as Session[];
}

// =====================================================
// OBTENER ESTADÍSTICAS DE SESIONES
// =====================================================
export async function getSessionStats() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  // Obtener todas las sesiones del usuario
  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error getting statistics:', error);
    throw new Error('Error getting statistics');
  }

  // Calculate statistics
  const totalSessions = sessions.length;
  const totalDistance = sessions.reduce(
    (sum, session) => sum + session.distance,
    0
  );
  const totalDuration = sessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );
  const avgRPE =
    sessions.length > 0
      ? sessions.reduce((sum, session) => sum + session.rpe, 0) /
        sessions.length
      : 0;

  // Calculate zone volumes
  const zoneStats = {
    z1: sessions.reduce(
      (sum, session) => sum + (session.zone_volumes?.z1 || 0),
      0
    ),
    z2: sessions.reduce(
      (sum, session) => sum + (session.zone_volumes?.z2 || 0),
      0
    ),
    z3: sessions.reduce(
      (sum, session) => sum + (session.zone_volumes?.z3 || 0),
      0
    ),
    z4: sessions.reduce(
      (sum, session) => sum + (session.zone_volumes?.z4 || 0),
      0
    ),
    z5: sessions.reduce(
      (sum, session) => sum + (session.zone_volumes?.z5 || 0),
      0
    ),
  };

  return {
    totalSessions,
    totalDistance,
    totalDuration,
    avgRPE: Math.round(avgRPE * 10) / 10,
    zoneStats,
  };
}
