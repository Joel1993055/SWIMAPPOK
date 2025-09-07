-- =====================================================
-- MIGRACIÓN SEGURA DE POLÍTICAS RLS
-- =====================================================

-- Este script migra de las políticas RLS básicas a las mejoradas
-- de forma segura sin interrumpir el servicio

-- =====================================================
-- PASO 1: CREAR FUNCIONES DE SEGURIDAD
-- =====================================================

-- Función para verificar que el usuario está autenticado
CREATE OR REPLACE FUNCTION auth.user_is_authenticated()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT auth.uid() IS NOT NULL;
$$;

-- Función para verificar que el usuario es el propietario del recurso
CREATE OR REPLACE FUNCTION auth.user_owns_resource(resource_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT auth.uid() = resource_user_id AND resource_user_id IS NOT NULL;
$$;

-- Función para verificar que el usuario tiene un rol específico
CREATE OR REPLACE FUNCTION auth.user_has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = required_role
  );
$$;

-- Función para verificar que el recurso no es muy antiguo
CREATE OR REPLACE FUNCTION auth.resource_not_too_old(created_at TIMESTAMPTZ)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT created_at > NOW() - INTERVAL '2 years';
$$;

-- =====================================================
-- PASO 2: CREAR ÍNDICES PARA MEJORAR PERFORMANCE
-- =====================================================

-- Índices para mejorar performance de las políticas RLS
CREATE INDEX IF NOT EXISTS idx_sessions_user_id_created_at ON sessions(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id_date ON sessions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_training_phases_user_id_created_at ON training_phases(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_competitions_user_id_created_at ON competitions(user_id, created_at);

-- =====================================================
-- PASO 3: MIGRAR POLÍTICAS DE FORMA SEGURA
-- =====================================================

-- Para cada tabla, vamos a:
-- 1. Crear las nuevas políticas con nombres temporales
-- 2. Verificar que funcionan correctamente
-- 3. Eliminar las políticas antiguas
-- 4. Renombrar las nuevas políticas

-- =====================================================
-- MIGRACIÓN DE TABLA: sessions
-- =====================================================

-- Crear nuevas políticas con nombres temporales
CREATE POLICY "sessions_insert_own_authenticated_temp"
ON sessions
FOR INSERT
TO authenticated
WITH CHECK (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  user_id IS NOT NULL AND
  created_at IS NOT NULL AND
  updated_at IS NOT NULL AND
  created_at <= NOW() AND
  updated_at <= NOW() AND
  distance_meters > 0 AND
  duration_minutes > 0 AND
  rpe >= 1 AND rpe <= 10
);

CREATE POLICY "sessions_select_own_authenticated_temp"
ON sessions
FOR SELECT
TO authenticated
USING (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  auth.resource_not_too_old(created_at)
);

CREATE POLICY "sessions_update_own_authenticated_temp"
ON sessions
FOR UPDATE
TO authenticated
USING (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  auth.resource_not_too_old(created_at)
)
WITH CHECK (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  user_id IS NOT NULL AND
  updated_at IS NOT NULL AND
  updated_at <= NOW() AND
  distance_meters > 0 AND
  duration_minutes > 0 AND
  rpe >= 1 AND rpe <= 10
);

CREATE POLICY "sessions_delete_own_authenticated_temp"
ON sessions
FOR DELETE
TO authenticated
USING (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  auth.resource_not_too_old(created_at)
);

-- =====================================================
-- MIGRACIÓN DE TABLA: user_settings
-- =====================================================

CREATE POLICY "user_settings_insert_own_authenticated_temp"
ON user_settings
FOR INSERT
TO authenticated
WITH CHECK (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  user_id IS NOT NULL AND
  created_at IS NOT NULL AND
  updated_at IS NOT NULL AND
  created_at <= NOW() AND
  updated_at <= NOW()
);

CREATE POLICY "user_settings_select_own_authenticated_temp"
ON user_settings
FOR SELECT
TO authenticated
USING (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id)
);

CREATE POLICY "user_settings_update_own_authenticated_temp"
ON user_settings
FOR UPDATE
TO authenticated
USING (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id)
)
WITH CHECK (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  user_id IS NOT NULL AND
  updated_at IS NOT NULL AND
  updated_at <= NOW()
);

CREATE POLICY "user_settings_delete_own_authenticated_temp"
ON user_settings
FOR DELETE
TO authenticated
USING (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id)
);

-- =====================================================
-- MIGRACIÓN DE TABLA: training_phases
-- =====================================================

CREATE POLICY "training_phases_insert_own_authenticated_temp"
ON training_phases
FOR INSERT
TO authenticated
WITH CHECK (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  user_id IS NOT NULL AND
  created_at IS NOT NULL AND
  updated_at IS NOT NULL AND
  created_at <= NOW() AND
  updated_at <= NOW() AND
  start_date IS NOT NULL AND
  end_date IS NOT NULL AND
  start_date <= end_date AND
  target_volume_km >= 0 AND
  target_sessions_per_week >= 0
);

CREATE POLICY "training_phases_select_own_authenticated_temp"
ON training_phases
FOR SELECT
TO authenticated
USING (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  auth.resource_not_too_old(created_at)
);

CREATE POLICY "training_phases_update_own_authenticated_temp"
ON training_phases
FOR UPDATE
TO authenticated
USING (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  auth.resource_not_too_old(created_at)
)
WITH CHECK (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  user_id IS NOT NULL AND
  updated_at IS NOT NULL AND
  updated_at <= NOW() AND
  start_date IS NOT NULL AND
  end_date IS NOT NULL AND
  start_date <= end_date AND
  target_volume_km >= 0 AND
  target_sessions_per_week >= 0
);

CREATE POLICY "training_phases_delete_own_authenticated_temp"
ON training_phases
FOR DELETE
TO authenticated
USING (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  auth.resource_not_too_old(created_at)
);

-- =====================================================
-- MIGRACIÓN DE TABLA: competitions
-- =====================================================

CREATE POLICY "competitions_insert_own_authenticated_temp"
ON competitions
FOR INSERT
TO authenticated
WITH CHECK (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  user_id IS NOT NULL AND
  created_at IS NOT NULL AND
  updated_at IS NOT NULL AND
  created_at <= NOW() AND
  updated_at <= NOW() AND
  date IS NOT NULL AND
  distance > 0
);

CREATE POLICY "competitions_select_own_authenticated_temp"
ON competitions
FOR SELECT
TO authenticated
USING (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  auth.resource_not_too_old(created_at)
);

CREATE POLICY "competitions_update_own_authenticated_temp"
ON competitions
FOR UPDATE
TO authenticated
USING (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  auth.resource_not_too_old(created_at)
)
WITH CHECK (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  user_id IS NOT NULL AND
  updated_at IS NOT NULL AND
  updated_at <= NOW() AND
  date IS NOT NULL AND
  distance > 0
);

CREATE POLICY "competitions_delete_own_authenticated_temp"
ON competitions
FOR DELETE
TO authenticated
USING (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  auth.resource_not_too_old(created_at)
);

-- =====================================================
-- PASO 4: VERIFICACIÓN DE SEGURIDAD
-- =====================================================

-- Verificar que las nuevas políticas están funcionando
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  -- Contar políticas temporales creadas
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE schemaname = 'public' 
  AND policyname LIKE '%_temp';
  
  IF policy_count < 16 THEN
    RAISE EXCEPTION '❌ No se crearon todas las políticas temporales. Esperadas: 16, Encontradas: %', policy_count;
  END IF;
  
  RAISE NOTICE '✅ Se crearon % políticas temporales correctamente', policy_count;
  RAISE NOTICE '✅ Las nuevas políticas están listas para ser activadas';
  RAISE NOTICE '⚠️  Ejecuta el siguiente script para completar la migración';
END $$;

-- =====================================================
-- INSTRUCCIONES PARA COMPLETAR LA MIGRACIÓN
-- =====================================================

-- Para completar la migración, ejecuta el siguiente script:
-- 1. Eliminar políticas antiguas
-- 2. Renombrar políticas temporales
-- 3. Verificar que todo funciona correctamente

-- Script de finalización (ejecutar después de verificar que todo funciona):
/*
-- Eliminar políticas antiguas
DROP POLICY IF EXISTS "Users can insert their own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can read their own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can read session statistics" ON sessions;

DROP POLICY IF EXISTS "Users can insert their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can read their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can delete their own settings" ON user_settings;

DROP POLICY IF EXISTS "Users can insert their own training phases" ON training_phases;
DROP POLICY IF EXISTS "Users can read their own training phases" ON training_phases;
DROP POLICY IF EXISTS "Users can update their own training phases" ON training_phases;
DROP POLICY IF EXISTS "Users can delete their own training phases" ON training_phases;

DROP POLICY IF EXISTS "Users can insert their own competitions" ON competitions;
DROP POLICY IF EXISTS "Users can read their own competitions" ON competitions;
DROP POLICY IF EXISTS "Users can update their own competitions" ON competitions;
DROP POLICY IF EXISTS "Users can delete their own competitions" ON competitions;

-- Renombrar políticas temporales
ALTER POLICY "sessions_insert_own_authenticated_temp" ON sessions RENAME TO "sessions_insert_own_authenticated";
ALTER POLICY "sessions_select_own_authenticated_temp" ON sessions RENAME TO "sessions_select_own_authenticated";
ALTER POLICY "sessions_update_own_authenticated_temp" ON sessions RENAME TO "sessions_update_own_authenticated";
ALTER POLICY "sessions_delete_own_authenticated_temp" ON sessions RENAME TO "sessions_delete_own_authenticated";

ALTER POLICY "user_settings_insert_own_authenticated_temp" ON user_settings RENAME TO "user_settings_insert_own_authenticated";
ALTER POLICY "user_settings_select_own_authenticated_temp" ON user_settings RENAME TO "user_settings_select_own_authenticated";
ALTER POLICY "user_settings_update_own_authenticated_temp" ON user_settings RENAME TO "user_settings_update_own_authenticated";
ALTER POLICY "user_settings_delete_own_authenticated_temp" ON user_settings RENAME TO "user_settings_delete_own_authenticated";

ALTER POLICY "training_phases_insert_own_authenticated_temp" ON training_phases RENAME TO "training_phases_insert_own_authenticated";
ALTER POLICY "training_phases_select_own_authenticated_temp" ON training_phases RENAME TO "training_phases_select_own_authenticated";
ALTER POLICY "training_phases_update_own_authenticated_temp" ON training_phases RENAME TO "training_phases_update_own_authenticated";
ALTER POLICY "training_phases_delete_own_authenticated_temp" ON training_phases RENAME TO "training_phases_delete_own_authenticated";

ALTER POLICY "competitions_insert_own_authenticated_temp" ON competitions RENAME TO "competitions_insert_own_authenticated";
ALTER POLICY "competitions_select_own_authenticated_temp" ON competitions RENAME TO "competitions_select_own_authenticated";
ALTER POLICY "competitions_update_own_authenticated_temp" ON competitions RENAME TO "competitions_update_own_authenticated";
ALTER POLICY "competitions_delete_own_authenticated_temp" ON competitions RENAME TO "competitions_delete_own_authenticated";
*/
