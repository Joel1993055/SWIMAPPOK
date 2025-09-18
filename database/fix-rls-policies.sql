-- =====================================================
-- CORRECCIÓN DE POLÍTICAS RLS PARA EVITAR RECURSIÓN INFINITA
-- =====================================================

-- Eliminar políticas existentes que causan recursión
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

-- =====================================================
-- NUEVAS POLÍTICAS SIMPLIFICADAS (SIN RECURSIÓN)
-- =====================================================

-- Políticas para clubs - Simplificadas
CREATE POLICY "Users can view all active clubs" ON clubs
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can create clubs" ON clubs
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE POLICY "Club creators can update their clubs" ON clubs
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Club creators can delete their clubs" ON clubs
    FOR DELETE USING (created_by = auth.uid());

-- Políticas para teams - Simplificadas
CREATE POLICY "Users can view all active teams" ON teams
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can create teams" ON teams
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE POLICY "Team creators can update their teams" ON teams
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Team creators can delete their teams" ON teams
    FOR DELETE USING (created_by = auth.uid());

-- Políticas para team_members - Simplificadas
CREATE POLICY "Users can view all active team members" ON team_members
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage team members" ON team_members
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Políticas para club_permissions - Simplificadas
CREATE POLICY "Users can view their own permissions" ON club_permissions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can manage permissions" ON club_permissions
    FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- FUNCIÓN PARA OBTENER CLUBES DEL USUARIO (SIMPLIFICADA)
-- =====================================================

CREATE OR REPLACE FUNCTION get_user_clubs_simple(user_uuid UUID)
RETURNS TABLE (
    club_id UUID,
    club_name VARCHAR(255),
    club_location VARCHAR(255),
    team_count BIGINT,
    total_members BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        c.location,
        COUNT(t.id) as team_count,
        COUNT(tm.id) as total_members
    FROM clubs c
    LEFT JOIN teams t ON c.id = t.club_id AND t.is_active = true
    LEFT JOIN team_members tm ON t.id = tm.team_id AND tm.is_active = true
    WHERE c.is_active = true
    AND c.created_by = user_uuid
    GROUP BY c.id, c.name, c.location
    ORDER BY c.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCIÓN PARA OBTENER EQUIPOS DE UN CLUB (SIMPLIFICADA)
-- =====================================================

CREATE OR REPLACE FUNCTION get_club_teams_simple(club_uuid UUID)
RETURNS TABLE (
    team_id UUID,
    team_name VARCHAR(255),
    team_level VARCHAR(50),
    member_count BIGINT,
    coach_name VARCHAR(255)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.name,
        t.level,
        COUNT(tm.id) as member_count,
        t.coach_name
    FROM teams t
    LEFT JOIN team_members tm ON t.id = tm.team_id AND tm.is_active = true
    WHERE t.club_id = club_uuid 
    AND t.is_active = true
    GROUP BY t.id, t.name, t.level, t.coach_name
    ORDER BY t.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
