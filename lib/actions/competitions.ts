'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// Tipos de datos
export interface CompetitionData {
  name: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
  location?: string;
  description?: string;
}

export interface Competition extends CompetitionData {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// CREAR COMPETICIÓN
// =====================================================
export async function createCompetition(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Usuario no autenticado');
  }

  // Extraer datos del formulario
  const competitionData: CompetitionData = {
    name: formData.get('name') as string,
    date: formData.get('date') as string,
    priority: formData.get('priority') as 'low' | 'medium' | 'high',
    location: (formData.get('location') as string) || undefined,
    description: (formData.get('description') as string) || undefined,
  };

  // Validaciones básicas
  if (!competitionData.name || !competitionData.date) {
    throw new Error('Nombre y fecha son obligatorios');
  }

  // Insertar en la base de datos
  const { data, error } = await supabase
    .from('competitions')
    .insert({
      user_id: user.id,
      ...competitionData,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creando competición:', error);
    throw new Error('Error al crear la competición');
  }

  // Revalidar páginas
  revalidatePath('/planificacion');
  revalidatePath('/dashboard');

  return data;
}

// =====================================================
// OBTENER COMPETICIONES
// =====================================================
export async function getCompetitions() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('competitions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error obteniendo competiciones:', error);
    throw new Error('Error al obtener las competiciones');
  }

  return data as Competition[];
}

// =====================================================
// OBTENER COMPETICIÓN POR ID
// =====================================================
export async function getCompetitionById(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('competitions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error obteniendo competición:', error);
    throw new Error('Error al obtener la competición');
  }

  return data as Competition;
}

// =====================================================
// ACTUALIZAR COMPETICIÓN
// =====================================================
export async function updateCompetition(id: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Usuario no autenticado');
  }

  // Extraer datos del formulario
  const competitionData: Partial<CompetitionData> = {
    name: formData.get('name') as string,
    date: formData.get('date') as string,
    priority: formData.get('priority') as 'low' | 'medium' | 'high',
    location: (formData.get('location') as string) || undefined,
    description: (formData.get('description') as string) || undefined,
  };

  // Validaciones básicas
  if (!competitionData.name || !competitionData.date) {
    throw new Error('Nombre y fecha son obligatorios');
  }

  // Actualizar en la base de datos
  const { data, error } = await supabase
    .from('competitions')
    .update(competitionData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error actualizando competición:', error);
    throw new Error('Error al actualizar la competición');
  }

  // Revalidar páginas
  revalidatePath('/planificacion');
  revalidatePath('/dashboard');

  return data;
}

// =====================================================
// ELIMINAR COMPETICIÓN
// =====================================================
export async function deleteCompetition(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Usuario no autenticado');
  }

  const { error } = await supabase
    .from('competitions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error eliminando competición:', error);
    throw new Error('Error al eliminar la competición');
  }

  // Revalidar páginas
  revalidatePath('/planificacion');
  revalidatePath('/dashboard');
}

// =====================================================
// OBTENER COMPETICIÓN PRINCIPAL (ALTA PRIORIDAD)
// =====================================================
export async function getMainCompetition() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('competitions')
    .select('*')
    .eq('user_id', user.id)
    .eq('priority', 'high')
    .gte('date', new Date().toISOString().split('T')[0]) // Solo futuras
    .order('date', { ascending: true })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows returned
    console.error('Error obteniendo competición principal:', error);
    throw new Error('Error al obtener la competición principal');
  }

  return data as Competition | null;
}

// =====================================================
// CALCULAR DÍAS HASTA COMPETICIÓN
// =====================================================
export async function getDaysToCompetition() {
  const mainCompetition = await getMainCompetition();

  if (!mainCompetition) {
    return null;
  }

  const now = new Date();
  const competitionDate = new Date(mainCompetition.date);
  const daysUntil = Math.ceil(
    (competitionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    competition: mainCompetition,
    daysUntil: Math.max(0, daysUntil),
  };
}

// =====================================================
// OBTENER COMPETICIONES POR PRIORIDAD
// =====================================================
export async function getCompetitionsByPriority(
  priority: 'low' | 'medium' | 'high'
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('competitions')
    .select('*')
    .eq('user_id', user.id)
    .eq('priority', priority)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error obteniendo competiciones por prioridad:', error);
    throw new Error('Error al obtener las competiciones');
  }

  return data as Competition[];
}

// =====================================================
// OBTENER COMPETICIONES PRÓXIMAS
// =====================================================
export async function getUpcomingCompetitions(limit: number = 5) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('competitions')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', new Date().toISOString().split('T')[0]) // Solo futuras
    .order('date', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error obteniendo competiciones próximas:', error);
    throw new Error('Error al obtener las competiciones próximas');
  }

  return data as Competition[];
}
