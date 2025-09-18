-- =====================================================
-- SCRIPT DE CONFIGURACIÓN DE CLUBES Y EQUIPOS
-- =====================================================
-- Este script configura la base de datos para el sistema
-- de clubes y equipos de la aplicación de natación

-- Ejecutar el esquema principal
\i database/clubs-teams-schema.sql

-- =====================================================
-- CONFIGURACIÓN ADICIONAL
-- =====================================================

-- Crear función para obtener estadísticas de club
CREATE OR REPLACE FUNCTION get_club_stats(club_uuid UUID)
RETURNS TABLE (
    total_teams BIGINT,
    total_members BIGINT,
    active_teams BIGINT,
    active_members BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(t.id) as total_teams,
        COUNT(tm.id) as total_members,
        COUNT(CASE WHEN t.is_active THEN t.id END) as active_teams,
        COUNT(CASE WHEN tm.is_active THEN tm.id END) as active_members
    FROM teams t
    LEFT JOIN team_members tm ON t.id = tm.team_id
    WHERE t.club_id = club_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear función para verificar permisos de usuario
CREATE OR REPLACE FUNCTION check_user_club_permission(
    user_uuid UUID,
    club_uuid UUID,
    required_permission VARCHAR(50)
)
RETURNS BOOLEAN AS $$
DECLARE
    user_permission VARCHAR(50);
BEGIN
    SELECT permission_type INTO user_permission
    FROM club_permissions
    WHERE user_id = user_uuid 
    AND club_id = club_uuid 
    AND is_active = true;
    
    IF user_permission IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Jerarquía de permisos: owner > admin > coach > member
    CASE required_permission
        WHEN 'owner' THEN
            RETURN user_permission = 'owner';
        WHEN 'admin' THEN
            RETURN user_permission IN ('owner', 'admin');
        WHEN 'coach' THEN
            RETURN user_permission IN ('owner', 'admin', 'coach');
        WHEN 'member' THEN
            RETURN user_permission IN ('owner', 'admin', 'coach', 'member');
        ELSE
            RETURN FALSE;
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- =====================================================

-- Insertar usuario de ejemplo (solo si no existe)
INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    'admin@swimapp.com',
    '{"full_name": "Administrador", "avatar_url": ""}',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insertar club de ejemplo
INSERT INTO clubs (id, name, description, location, address, phone, email, established_date, created_by)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Club Natación Madrid',
    'Club de natación profesional en Madrid con más de 10 años de experiencia',
    'Madrid, España',
    'Calle de la Natación, 123, 28001 Madrid',
    '+34 91 123 4567',
    'info@clubnatacionmadrid.com',
    '2015-01-15',
    '550e8400-e29b-41d4-a716-446655440001'
) ON CONFLICT (id) DO NOTHING;

-- Insertar equipos de ejemplo
INSERT INTO teams (id, club_id, name, description, level, age_range, max_members, coach_name, coach_email, schedule, focus_area, created_by)
VALUES 
    (
        '660e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440000',
        'Grupo Elite',
        'Equipo de competición de alto nivel para nadadores experimentados',
        'Elite',
        '16-25 años',
        15,
        'María González',
        'maria.gonzalez@clubnatacionmadrid.com',
        'Lun, Mié, Vie 18:00-20:00',
        'Competición',
        '550e8400-e29b-41d4-a716-446655440001'
    ),
    (
        '660e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440000',
        'Grupo Desarrollo',
        'Equipo de desarrollo técnico para nadadores en formación',
        'Intermedio',
        '14-18 años',
        20,
        'Carlos Ruiz',
        'carlos.ruiz@clubnatacionmadrid.com',
        'Mar, Jue 17:00-19:00',
        'Técnica',
        '550e8400-e29b-41d4-a716-446655440001'
    ),
    (
        '660e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440000',
        'Grupo Principiantes',
        'Equipo para nadadores que están comenzando',
        'Principiante',
        '8-14 años',
        25,
        'Ana Martín',
        'ana.martin@clubnatacionmadrid.com',
        'Sáb 10:00-12:00',
        'Aprendizaje',
        '550e8400-e29b-41d4-a716-446655440001'
    )
ON CONFLICT (id) DO NOTHING;

-- Insertar miembros de ejemplo
INSERT INTO team_members (id, team_id, user_id, role, level, join_date, is_active)
VALUES 
    (
        '770e8400-e29b-41d4-a716-446655440000',
        '660e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440001',
        'Capitán',
        'Elite',
        '2024-01-15',
        true
    ),
    (
        '770e8400-e29b-41d4-a716-446655440001',
        '660e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440001',
        'Entrenador',
        'Avanzado',
        '2024-01-15',
        true
    )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verificar que todo se creó correctamente
SELECT 
    'Clubes creados' as tipo,
    COUNT(*) as cantidad
FROM clubs
WHERE is_active = true

UNION ALL

SELECT 
    'Equipos creados' as tipo,
    COUNT(*) as cantidad
FROM teams
WHERE is_active = true

UNION ALL

SELECT 
    'Miembros creados' as tipo,
    COUNT(*) as cantidad
FROM team_members
WHERE is_active = true;

-- Mostrar resumen de datos
SELECT 
    c.name as club,
    COUNT(t.id) as equipos,
    COUNT(tm.id) as miembros
FROM clubs c
LEFT JOIN teams t ON c.id = t.club_id AND t.is_active = true
LEFT JOIN team_members tm ON t.id = tm.team_id AND tm.is_active = true
WHERE c.is_active = true
GROUP BY c.id, c.name
ORDER BY c.name;
