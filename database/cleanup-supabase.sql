-- =====================================================
-- LIMPIAR TABLAS EXISTENTES EN SUPABASE
-- =====================================================

-- Eliminar políticas RLS existentes (si las hay)
DROP POLICY IF EXISTS "Users can view clubs they have access to" ON clubs;
DROP POLICY IF EXISTS "Users can create clubs" ON clubs;
DROP POLICY IF EXISTS "Club owners can update their clubs" ON clubs;
DROP POLICY IF EXISTS "Club owners can delete their clubs" ON clubs;
DROP POLICY IF EXISTS "Users can view teams from accessible clubs" ON teams;
DROP POLICY IF EXISTS "Users can create teams in accessible clubs" ON teams;
DROP POLICY IF EXISTS "Users can update teams they have access to" ON teams;
DROP POLICY IF EXISTS "Users can delete teams they created" ON teams;
DROP POLICY IF EXISTS "Users can view team members from accessible teams" ON team_members;
DROP POLICY IF EXISTS "Users can manage team members in accessible teams" ON team_members;
DROP POLICY IF EXISTS "Users can view their own permissions" ON club_permissions;
DROP POLICY IF EXISTS "Club owners can manage permissions" ON club_permissions;

-- Eliminar vistas existentes
DROP VIEW IF EXISTS clubs_with_teams;
DROP VIEW IF EXISTS teams_with_club;

-- Eliminar funciones existentes
DROP FUNCTION IF EXISTS get_user_clubs(UUID);
DROP FUNCTION IF EXISTS get_club_teams(UUID);
DROP FUNCTION IF EXISTS get_club_stats(UUID);
DROP FUNCTION IF EXISTS check_user_club_permission(UUID, UUID, VARCHAR);
DROP FUNCTION IF EXISTS get_user_clubs_simple(UUID);
DROP FUNCTION IF EXISTS get_club_teams_simple(UUID);

-- Eliminar triggers existentes
DROP TRIGGER IF EXISTS trigger_update_clubs_updated_at ON clubs;
DROP TRIGGER IF EXISTS trigger_update_teams_updated_at ON teams;
DROP TRIGGER IF EXISTS trigger_update_team_members_updated_at ON team_members;

-- Eliminar funciones de trigger
DROP FUNCTION IF EXISTS update_clubs_updated_at();
DROP FUNCTION IF EXISTS update_teams_updated_at();
DROP FUNCTION IF EXISTS update_team_members_updated_at();

-- Eliminar tablas existentes (en orden correcto por dependencias)
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS clubs CASCADE;
DROP TABLE IF EXISTS club_permissions CASCADE;

-- =====================================================
-- MENSAJE DE CONFIRMACIÓN
-- =====================================================
SELECT 'Limpieza completada. Ahora puedes ejecutar el archivo clubs-teams-final.sql' as mensaje;
