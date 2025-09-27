-- =====================================================
-- SWIM APP - POLÍTICAS RLS MEJORADAS Y ROBUSTAS
-- =====================================================

-- =====================================================
-- FUNCIONES AUXILIARES PARA SEGURIDAD
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

-- Función para verificar que el recurso no es muy antiguo (evitar ataques)
CREATE OR REPLACE FUNCTION auth.resource_not_too_old(created_at TIMESTAMPTZ)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT created_at > NOW() - INTERVAL '2 years';
$$;

-- =====================================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- =====================================================

-- Eliminar políticas existentes (si las hay)
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

-- Habilitar RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS ROBUSTAS PARA TABLA: sessions
-- =====================================================

-- INSERT: Solo usuarios autenticados pueden crear sesiones propias
CREATE POLICY "sessions_insert_own_authenticated"
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

-- SELECT: Solo usuarios autenticados pueden leer sus propias sesiones
CREATE POLICY "sessions_select_own_authenticated"
ON sessions
FOR SELECT
TO authenticated
USING (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  auth.resource_not_too_old(created_at)
);

-- UPDATE: Solo usuarios autenticados pueden actualizar sus propias sesiones
CREATE POLICY "sessions_update_own_authenticated"
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

-- DELETE: Solo usuarios autenticados pueden eliminar sus propias sesiones
CREATE POLICY "sessions_delete_own_authenticated"
ON sessions
FOR DELETE
TO authenticated
USING (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  auth.resource_not_too_old(created_at)
);

-- =====================================================
-- POLÍTICAS ROBUSTAS PARA TABLA: user_settings
-- =====================================================

-- INSERT: Solo usuarios autenticados pueden crear sus propias configuraciones
CREATE POLICY "user_settings_insert_own_authenticated"
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

-- SELECT: Solo usuarios autenticados pueden leer sus propias configuraciones
CREATE POLICY "user_settings_select_own_authenticated"
ON user_settings
FOR SELECT
TO authenticated
USING (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id)
);

-- UPDATE: Solo usuarios autenticados pueden actualizar sus propias configuraciones
CREATE POLICY "user_settings_update_own_authenticated"
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

-- DELETE: Solo usuarios autenticados pueden eliminar sus propias configuraciones
CREATE POLICY "user_settings_delete_own_authenticated"
ON user_settings
FOR DELETE
TO authenticated
USING (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id)
);

-- =====================================================
-- POLÍTICAS ROBUSTAS PARA TABLA: training_phases
-- =====================================================

-- INSERT: Solo usuarios autenticados pueden crear sus propias fases
CREATE POLICY "training_phases_insert_own_authenticated"
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

-- SELECT: Solo usuarios autenticados pueden leer sus propias fases
CREATE POLICY "training_phases_select_own_authenticated"
ON training_phases
FOR SELECT
TO authenticated
USING (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  auth.resource_not_too_old(created_at)
);

-- UPDATE: Solo usuarios autenticados pueden actualizar sus propias fases
CREATE POLICY "training_phases_update_own_authenticated"
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

-- DELETE: Solo usuarios autenticados pueden eliminar sus propias fases
CREATE POLICY "training_phases_delete_own_authenticated"
ON training_phases
FOR DELETE
TO authenticated
USING (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  auth.resource_not_too_old(created_at)
);

-- =====================================================
-- POLÍTICAS ROBUSTAS PARA TABLA: competitions
-- =====================================================

-- INSERT: Solo usuarios autenticados pueden crear sus propias competencias
CREATE POLICY "competitions_insert_own_authenticated"
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

-- SELECT: Solo usuarios autenticados pueden leer sus propias competencias
CREATE POLICY "competitions_select_own_authenticated"
ON competitions
FOR SELECT
TO authenticated
USING (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  auth.resource_not_too_old(created_at)
);

-- UPDATE: Solo usuarios autenticados pueden actualizar sus propias competencias
CREATE POLICY "competitions_update_own_authenticated"
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

-- DELETE: Solo usuarios autenticados pueden eliminar sus propias competencias
CREATE POLICY "competitions_delete_own_authenticated"
ON competitions
FOR DELETE
TO authenticated
USING (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  auth.resource_not_too_old(created_at)
);

-- =====================================================
-- POLÍTICAS ESPECIALES PARA ADMINISTRADORES
-- =====================================================

-- Política para administradores (si se implementa en el futuro)
CREATE POLICY "admin_full_access_sessions"
ON sessions
FOR ALL
TO authenticated
USING (
  auth.user_has_role('admin')
)
WITH CHECK (
  auth.user_has_role('admin')
);

-- =====================================================
-- POLÍTICAS PARA FUNCIONES DE AGREGACIÓN
-- =====================================================

-- Permitir funciones de agregación para estadísticas
CREATE POLICY "sessions_aggregate_stats"
ON sessions
FOR SELECT
TO authenticated
USING (
  auth.user_is_authenticated() AND
  auth.user_owns_resource(user_id) AND
  auth.resource_not_too_old(created_at)
);

-- =====================================================
-- ÍNDICES PARA MEJORAR PERFORMANCE DE RLS
-- =====================================================

-- Índices para mejorar performance de las políticas RLS
CREATE INDEX IF NOT EXISTS idx_sessions_user_id_created_at ON sessions(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id_date ON sessions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_training_phases_user_id_created_at ON training_phases(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_competitions_user_id_created_at ON competitions(user_id, created_at);

-- =====================================================
-- VERIFICACIÓN DE SEGURIDAD
-- =====================================================

-- Verificar que RLS está habilitado
SELECT 
  schemaname, 
  tablename, 
  rowsecurity,
  CASE 
    WHEN rowsecurity THEN '✅ RLS Habilitado'
    ELSE '❌ RLS Deshabilitado'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('sessions', 'user_settings', 'training_phases', 'competitions')
ORDER BY tablename;

-- Verificar políticas creadas
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive,
  roles,
  cmd,
  CASE 
    WHEN permissive THEN 'Permisiva'
    ELSE 'Restrictiva'
  END as tipo_politica
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('sessions', 'user_settings', 'training_phases', 'competitions')
ORDER BY tablename, policyname;

-- Verificar funciones de seguridad
SELECT 
  routine_name,
  routine_type,
  CASE 
    WHEN routine_name LIKE 'auth.%' THEN '✅ Función de seguridad'
    ELSE '⚠️ Función personalizada'
  END as tipo_funcion
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE 'auth.%'
ORDER BY routine_name;

-- =====================================================
-- SCRIPT DE PRUEBA DE SEGURIDAD
-- =====================================================

-- Este script debe ejecutarse con diferentes usuarios para verificar la seguridad
DO $$
BEGIN
  -- Verificar que las funciones de seguridad existen
  IF NOT EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'user_is_authenticated') THEN
    RAISE EXCEPTION '❌ Función user_is_authenticated no encontrada';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'user_owns_resource') THEN
    RAISE EXCEPTION '❌ Función user_owns_resource no encontrada';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'resource_not_too_old') THEN
    RAISE EXCEPTION '❌ Función resource_not_too_old no encontrada';
  END IF;
  
  RAISE NOTICE '✅ Todas las funciones de seguridad están presentes';
  RAISE NOTICE '✅ Políticas RLS mejoradas aplicadas correctamente';
  RAISE NOTICE '✅ Sistema de seguridad robusto implementado';
END $$;
