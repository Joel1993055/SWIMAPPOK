"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// =====================================================
// REGISTRAR USUARIO
// =====================================================
export async function signUpAction(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validaciones básicas
  if (!email || !password) {
    return { error: "Email y contraseña son obligatorios" };
  }

  if (password !== confirmPassword) {
    return { error: "Las contraseñas no coinciden" };
  }

  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres" };
  }

  // Registrar usuario
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Error registrando usuario:", error);
    return { error: error.message };
  }

  if (data.user) {
    revalidatePath("/");
    return {
      success:
        "Usuario registrado correctamente. Revisa tu email para confirmar la cuenta.",
    };
  }

  return { error: "Error desconocido al registrar usuario" };
}

// =====================================================
// INICIAR SESIÓN
// =====================================================
export async function signInAction(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validaciones básicas
  if (!email || !password) {
    return { error: "Email y contraseña son obligatorios" };
  }

  // Iniciar sesión
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error iniciando sesión:", error);
    return { error: error.message };
  }

  if (data.user) {
    revalidatePath("/");
    redirect("/dashboard");
  }

  return { error: "Error desconocido al iniciar sesión" };
}

// =====================================================
// CERRAR SESIÓN
// =====================================================
export async function signOutAction() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error cerrando sesión:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  redirect("/");
}

// =====================================================
// OBTENER USUARIO ACTUAL
// =====================================================
export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error obteniendo usuario:", error);
    return null;
  }

  return user;
}

// =====================================================
// RESTABLECER CONTRASEÑA
// =====================================================
export async function resetPasswordAction(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email es obligatorio" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });

  if (error) {
    console.error("Error enviando email de restablecimiento:", error);
    return { error: error.message };
  }

  return { success: "Se ha enviado un email para restablecer tu contraseña" };
}
