"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Tipos de datos
export interface TrainingPhaseData {
  name: string;
  duration_weeks: number;
  description: string;
  focus: string[];
  intensity: number;
  volume: number;
  color: string;
  start_date?: string;
  end_date?: string;
  phase_order: number;
}

export interface TrainingPhase extends TrainingPhaseData {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// CREAR FASE DE ENTRENAMIENTO
// =====================================================
export async function createTrainingPhase(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Usuario no autenticado");
  }

  // Extraer datos del formulario
  const phaseData: TrainingPhaseData = {
    name: formData.get("name") as string,
    duration_weeks: parseInt(formData.get("duration_weeks") as string),
    description: formData.get("description") as string,
    focus: (formData.get("focus") as string).split(",").map(f => f.trim()),
    intensity: parseInt(formData.get("intensity") as string),
    volume: parseInt(formData.get("volume") as string),
    color: formData.get("color") as string || "bg-blue-500",
    start_date: formData.get("start_date") as string || undefined,
    end_date: formData.get("end_date") as string || undefined,
    phase_order: parseInt(formData.get("phase_order") as string)
  };

  // Validaciones básicas
  if (!phaseData.name || !phaseData.duration_weeks) {
    throw new Error("Nombre y duración son obligatorios");
  }

  // Insertar en la base de datos
  const { data, error } = await supabase
    .from("training_phases")
    .insert({
      user_id: user.id,
      ...phaseData
    })
    .select()
    .single();

  if (error) {
    console.error("Error creando fase:", error);
    throw new Error("Error al crear la fase de entrenamiento");
  }

  // Revalidar páginas
  revalidatePath("/planificacion");
  revalidatePath("/dashboard");
  
  return data;
}

// =====================================================
// OBTENER FASES DE ENTRENAMIENTO
// =====================================================
export async function getTrainingPhases() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Usuario no autenticado");
  }

  const { data, error } = await supabase
    .from("training_phases")
    .select("*")
    .eq("user_id", user.id)
    .order("phase_order", { ascending: true });

  if (error) {
    console.error("Error obteniendo fases:", error);
    throw new Error("Error al obtener las fases de entrenamiento");
  }

  return data as TrainingPhase[];
}

// =====================================================
// OBTENER FASE POR ID
// =====================================================
export async function getTrainingPhaseById(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Usuario no autenticado");
  }

  const { data, error } = await supabase
    .from("training_phases")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error obteniendo fase:", error);
    throw new Error("Error al obtener la fase de entrenamiento");
  }

  return data as TrainingPhase;
}

// =====================================================
// ACTUALIZAR FASE DE ENTRENAMIENTO
// =====================================================
export async function updateTrainingPhase(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Usuario no autenticado");
  }

  // Extraer datos del formulario
  const phaseData: Partial<TrainingPhaseData> = {
    name: formData.get("name") as string,
    duration_weeks: parseInt(formData.get("duration_weeks") as string),
    description: formData.get("description") as string,
    focus: (formData.get("focus") as string).split(",").map(f => f.trim()),
    intensity: parseInt(formData.get("intensity") as string),
    volume: parseInt(formData.get("volume") as string),
    color: formData.get("color") as string || "bg-blue-500",
    start_date: formData.get("start_date") as string || undefined,
    end_date: formData.get("end_date") as string || undefined,
    phase_order: parseInt(formData.get("phase_order") as string)
  };

  // Validaciones básicas
  if (!phaseData.name || !phaseData.duration_weeks) {
    throw new Error("Nombre y duración son obligatorios");
  }

  // Actualizar en la base de datos
  const { data, error } = await supabase
    .from("training_phases")
    .update(phaseData)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error actualizando fase:", error);
    throw new Error("Error al actualizar la fase de entrenamiento");
  }

  // Revalidar páginas
  revalidatePath("/planificacion");
  revalidatePath("/dashboard");
  
  return data;
}

// =====================================================
// ELIMINAR FASE DE ENTRENAMIENTO
// =====================================================
export async function deleteTrainingPhase(id: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Usuario no autenticado");
  }

  const { error } = await supabase
    .from("training_phases")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error eliminando fase:", error);
    throw new Error("Error al eliminar la fase de entrenamiento");
  }

  // Revalidar páginas
  revalidatePath("/planificacion");
  revalidatePath("/dashboard");
}

// =====================================================
// OBTENER FASE ACTUAL
// =====================================================
export async function getCurrentPhase() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Usuario no autenticado");
  }

  const now = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from("training_phases")
    .select("*")
    .eq("user_id", user.id)
    .lte("start_date", now)
    .gte("end_date", now)
    .order("phase_order", { ascending: true })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error("Error obteniendo fase actual:", error);
    throw new Error("Error al obtener la fase actual");
  }

  return data as TrainingPhase | null;
}

// =====================================================
// CALCULAR PROGRESO DEL CICLO
// =====================================================
export async function getCycleProgress() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Usuario no autenticado");
  }

  // Obtener todas las fases ordenadas
  const { data: phases, error } = await supabase
    .from("training_phases")
    .select("*")
    .eq("user_id", user.id)
    .order("phase_order", { ascending: true });

  if (error) {
    console.error("Error obteniendo fases para progreso:", error);
    throw new Error("Error al calcular el progreso del ciclo");
  }

  if (phases.length === 0) {
    return 0;
  }

  const firstPhase = phases[0];
  const lastPhase = phases[phases.length - 1];

  if (!firstPhase.start_date || !lastPhase.end_date) {
    return 0;
  }

  const cycleStart = new Date(firstPhase.start_date);
  const cycleEnd = new Date(lastPhase.end_date);
  const now = new Date();

  const totalCycleDays = Math.ceil((cycleEnd.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24));
  const daysPassed = Math.ceil((now.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24));

  return Math.min(Math.max((daysPassed / totalCycleDays) * 100, 0), 100);
}
