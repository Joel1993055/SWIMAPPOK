-- =====================================================
-- SWIM APP - POLÍTICAS DE ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS PARA TABLA: sessions
-- =====================================================

-- Política para INSERT (crear sesiones)
CREATE POLICY "Users can insert their own sessions" 
ON "public"."sessions"
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id);

-- Política para SELECT (leer sesiones)
CREATE POLICY "Users can read their own sessions" 
ON "public"."sessions"
AS PERMISSIVE
FOR SELECT
TO public
USING (auth.uid() = user_id);

-- Política para UPDATE (actualizar sesiones)
CREATE POLICY "Users can update their own sessions" 
ON "public"."sessions"
AS PERMISSIVE
FOR UPDATE
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política para DELETE (eliminar sesiones)
CREATE POLICY "Users can delete their own sessions" 
ON "public"."sessions"
AS PERMISSIVE
FOR DELETE
TO public
USING (auth.uid() = user_id);

-- =====================================================
-- POLÍTICAS PARA TABLA: user_settings
-- =====================================================

-- Política para INSERT (crear configuraciones)
CREATE POLICY "Users can insert their own settings" 
ON "public"."user_settings"
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id);

-- Política para SELECT (leer configuraciones)
CREATE POLICY "Users can read their own settings" 
ON "public"."user_settings"
AS PERMISSIVE
FOR SELECT
TO public
USING (auth.uid() = user_id);

-- Política para UPDATE (actualizar configuraciones)
CREATE POLICY "Users can update their own settings" 
ON "public"."user_settings"
AS PERMISSIVE
FOR UPDATE
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política para DELETE (eliminar configuraciones)
CREATE POLICY "Users can delete their own settings" 
ON "public"."user_settings"
AS PERMISSIVE
FOR DELETE
TO public
USING (auth.uid() = user_id);

-- =====================================================
-- POLÍTICAS PARA TABLA: training_phases
-- =====================================================

-- Política para INSERT (crear fases)
CREATE POLICY "Users can insert their own training phases" 
ON "public"."training_phases"
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id);

-- Política para SELECT (leer fases)
CREATE POLICY "Users can read their own training phases" 
ON "public"."training_phases"
AS PERMISSIVE
FOR SELECT
TO public
USING (auth.uid() = user_id);

-- Política para UPDATE (actualizar fases)
CREATE POLICY "Users can update their own training phases" 
ON "public"."training_phases"
AS PERMISSIVE
FOR UPDATE
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política para DELETE (eliminar fases)
CREATE POLICY "Users can delete their own training phases" 
ON "public"."training_phases"
AS PERMISSIVE
FOR DELETE
TO public
USING (auth.uid() = user_id);

-- =====================================================
-- POLÍTICAS PARA TABLA: competitions
-- =====================================================

-- Política para INSERT (crear competiciones)
CREATE POLICY "Users can insert their own competitions" 
ON "public"."competitions"
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id);

-- Política para SELECT (leer competiciones)
CREATE POLICY "Users can read their own competitions" 
ON "public"."competitions"
AS PERMISSIVE
FOR SELECT
TO public
USING (auth.uid() = user_id);

-- Política para UPDATE (actualizar competiciones)
CREATE POLICY "Users can update their own competitions" 
ON "public"."competitions"
AS PERMISSIVE
FOR UPDATE
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política para DELETE (eliminar competiciones)
CREATE POLICY "Users can delete their own competitions" 
ON "public"."competitions"
AS PERMISSIVE
FOR DELETE
TO public
USING (auth.uid() = user_id);

-- =====================================================
-- POLÍTICAS ADICIONALES PARA FUNCIONES ESPECIALES
-- =====================================================

-- Permitir que los usuarios vean estadísticas agregadas (para gráficos)
CREATE POLICY "Users can read session statistics" 
ON "public"."sessions"
AS PERMISSIVE
FOR SELECT
TO public
USING (auth.uid() = user_id);

-- =====================================================
-- VERIFICACIÓN DE POLÍTICAS
-- =====================================================

-- Verificar que RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('sessions', 'user_settings', 'training_phases', 'competitions');

-- Verificar políticas creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('sessions', 'user_settings', 'training_phases', 'competitions')
ORDER BY tablename, policyname;
