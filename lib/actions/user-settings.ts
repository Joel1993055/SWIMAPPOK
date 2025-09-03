"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Tipos de datos
export interface TrainingZones {
  z1: { name: string; min: number; max: number };
  z2: { name: string; min: number; max: number };
  z3: { name: string; min: number; max: number };
  z4: { name: string; min: number; max: number };
  z5: { name: string; min: number; max: number };
}

export interface UserSettingsData {
  training_zones: TrainingZones;
  selected_methodology: string;
}

export interface UserSettings extends UserSettingsData {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// OBTENER CONFIGURACIONES DE USUARIO
// =====================================================
export async function getUserSettings() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Usuario no autenticado");
  }

  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error("Error obteniendo configuraciones:", error);
    throw new Error("Error al obtener las configuraciones");
  }

  // Si no existen configuraciones, crear las por defecto
  if (!data) {
    return await createDefaultUserSettings();
  }

  return data as UserSettings;
}

// =====================================================
// CREAR CONFIGURACIONES POR DEFECTO
// =====================================================
export async function createDefaultUserSettings() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Usuario no autenticado");
  }

  const defaultSettings: UserSettingsData = {
    training_zones: {
      z1: { name: "Recuperación", min: 0, max: 65 },
      z2: { name: "Aeróbico Base", min: 65, max: 75 },
      z3: { name: "Aeróbico Umbral", min: 75, max: 85 },
      z4: { name: "Anaeróbico Láctico", min: 85, max: 95 },
      z5: { name: "Anaeróbico Aláctico", min: 95, max: 100 }
    },
    selected_methodology: "standard"
  };

  const { data, error } = await supabase
    .from("user_settings")
    .insert({
      user_id: user.id,
      ...defaultSettings
    })
    .select()
    .single();

  if (error) {
    console.error("Error creando configuraciones por defecto:", error);
    throw new Error("Error al crear las configuraciones por defecto");
  }

  return data as UserSettings;
}

// =====================================================
// ACTUALIZAR CONFIGURACIONES DE USUARIO
// =====================================================
export async function updateUserSettings(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Usuario no autenticado");
  }

  // Extraer datos del formulario
  const settingsData: Partial<UserSettingsData> = {};

  // Actualizar zonas de entrenamiento si se proporcionan
  const trainingZones = formData.get("training_zones");
  if (trainingZones) {
    try {
      settingsData.training_zones = JSON.parse(trainingZones as string);
    } catch (error) {
      console.error("Error parseando training_zones:", error);
      throw new Error("Error en el formato de las zonas de entrenamiento");
    }
  }

  // Actualizar metodología si se proporciona
  const selectedMethodology = formData.get("selected_methodology");
  if (selectedMethodology) {
    settingsData.selected_methodology = selectedMethodology as string;
  }

  // Actualizar en la base de datos
  const { data, error } = await supabase
    .from("user_settings")
    .update(settingsData)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error actualizando configuraciones:", error);
    throw new Error("Error al actualizar las configuraciones");
  }

  // Revalidar páginas
  revalidatePath("/settings");
  revalidatePath("/entrenamientos");
  
  return data;
}

// =====================================================
// ACTUALIZAR ZONAS DE ENTRENAMIENTO
// =====================================================
export async function updateTrainingZones(zones: TrainingZones) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Usuario no autenticado");
  }

  const { data, error } = await supabase
    .from("user_settings")
    .update({ training_zones: zones })
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error actualizando zonas de entrenamiento:", error);
    throw new Error("Error al actualizar las zonas de entrenamiento");
  }

  // Revalidar páginas
  revalidatePath("/settings");
  revalidatePath("/entrenamientos");
  
  return data;
}

// =====================================================
// ACTUALIZAR METODOLOGÍA SELECCIONADA
// =====================================================
export async function updateSelectedMethodology(methodology: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Usuario no autenticado");
  }

  const { data, error } = await supabase
    .from("user_settings")
    .update({ selected_methodology: methodology })
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error actualizando metodología:", error);
    throw new Error("Error al actualizar la metodología");
  }

  // Revalidar páginas
  revalidatePath("/settings");
  
  return data;
}

// =====================================================
// OBTENER ZONAS DE ENTRENAMIENTO
// =====================================================
export async function getTrainingZones() {
  const settings = await getUserSettings();
  return settings.training_zones;
}

// =====================================================
// OBTENER METODOLOGÍA SELECCIONADA
// =====================================================
export async function getSelectedMethodology() {
  const settings = await getUserSettings();
  return settings.selected_methodology;
}

// =====================================================
// APLICAR METODOLOGÍA PREDEFINIDA
// =====================================================
export async function applyPredefinedMethodology(methodology: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Usuario no autenticado");
  }

  // Metodologías predefinidas
  const methodologies = {
    standard: {
      z1: { name: "Recuperación", min: 0, max: 65 },
      z2: { name: "Aeróbico Base", min: 65, max: 75 },
      z3: { name: "Aeróbico Umbral", min: 75, max: 85 },
      z4: { name: "Anaeróbico Láctico", min: 85, max: 95 },
      z5: { name: "Anaeróbico Aláctico", min: 95, max: 100 }
    },
    british_swimming: {
      z1: { name: "Recuperación", min: 0, max: 70 },
      z2: { name: "Aeróbico Base", min: 70, max: 80 },
      z3: { name: "Aeróbico Umbral", min: 80, max: 90 },
      z4: { name: "Anaeróbico Láctico", min: 90, max: 95 },
      z5: { name: "Anaeróbico Aláctico", min: 95, max: 100 }
    },
    urbanchek: {
      z1: { name: "Recuperación", min: 0, max: 60 },
      z2: { name: "Aeróbico Base", min: 60, max: 75 },
      z3: { name: "Aeróbico Umbral", min: 75, max: 85 },
      z4: { name: "Anaeróbico Láctico", min: 85, max: 95 },
      z5: { name: "Anaeróbico Aláctico", min: 95, max: 100 }
    },
    olbrecht: {
      z1: { name: "Recuperación", min: 0, max: 65 },
      z2: { name: "Aeróbico Base", min: 65, max: 75 },
      z3: { name: "Aeróbico Umbral", min: 75, max: 85 },
      z4: { name: "Anaeróbico Láctico", min: 85, max: 95 },
      z5: { name: "Anaeróbico Aláctico", min: 95, max: 100 }
    },
    research_based: {
      z1: { name: "Recuperación", min: 0, max: 70 },
      z2: { name: "Aeróbico Base", min: 70, max: 80 },
      z3: { name: "Aeróbico Umbral", min: 80, max: 90 },
      z4: { name: "Anaeróbico Láctico", min: 90, max: 95 },
      z5: { name: "Anaeróbico Aláctico", min: 95, max: 100 }
    }
  };

  const selectedMethodology = methodologies[methodology as keyof typeof methodologies];
  if (!selectedMethodology) {
    throw new Error("Metodología no válida");
  }

  const { data, error } = await supabase
    .from("user_settings")
    .update({ 
      training_zones: selectedMethodology,
      selected_methodology: methodology
    })
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error aplicando metodología:", error);
    throw new Error("Error al aplicar la metodología");
  }

  // Revalidar páginas
  revalidatePath("/settings");
  
  return data;
}
