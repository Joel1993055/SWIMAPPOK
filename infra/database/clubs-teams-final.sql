-- =====================================================
-- FINAL CLUBS AND TEAMS SCHEMA
-- =====================================================

-- =====================================================
-- CLUBS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS clubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL DEFAULT 'No location',
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    logo_url VARCHAR(500),
    established_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    
    -- Constraints
    CONSTRAINT clubs_name_not_empty CHECK (LENGTH(TRIM(name)) > 0),
    CONSTRAINT clubs_email_valid CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- =====================================================
-- TEAMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    level VARCHAR(50) NOT NULL DEFAULT 'Mixed',
    age_range VARCHAR(50),
    max_members INTEGER DEFAULT 20,
    coach_name VARCHAR(255),
    coach_email VARCHAR(255),
    coach_phone VARCHAR(50),
    schedule TEXT,
    focus_area VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    
    -- Constraints
    CONSTRAINT teams_name_not_empty CHECK (LENGTH(TRIM(name)) > 0),
    CONSTRAINT teams_level_valid CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Elite', 'Mixed')),
    CONSTRAINT teams_max_members_positive CHECK (max_members > 0),
    CONSTRAINT teams_coach_email_valid CHECK (coach_email IS NULL OR coach_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- =====================================================
-- TEAM MEMBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'Member',
    level VARCHAR(50) NOT NULL DEFAULT 'Intermediate',
    join_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT team_members_role_valid CHECK (role IN ('Captain', 'Vice-Captain', 'Member', 'Coach')),
    CONSTRAINT team_members_level_valid CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Elite')),
    CONSTRAINT team_members_unique_user_team UNIQUE (team_id, user_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Indexes for clubs
CREATE INDEX IF NOT EXISTS idx_clubs_created_by ON clubs(created_by);
CREATE INDEX IF NOT EXISTS idx_clubs_is_active ON clubs(is_active);

-- Indexes for teams
CREATE INDEX IF NOT EXISTS idx_teams_club_id ON teams(club_id);
CREATE INDEX IF NOT EXISTS idx_teams_created_by ON teams(created_by);
CREATE INDEX IF NOT EXISTS idx_teams_is_active ON teams(is_active);

-- Indexes for team_members
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_is_active ON team_members(is_active);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Trigger for clubs
CREATE OR REPLACE FUNCTION update_clubs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_clubs_updated_at
    BEFORE UPDATE ON clubs
    FOR EACH ROW
    EXECUTE FUNCTION update_clubs_updated_at();

-- Trigger for teams
CREATE OR REPLACE FUNCTION update_teams_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_teams_updated_at
    BEFORE UPDATE ON teams
    FOR EACH ROW
    EXECUTE FUNCTION update_teams_updated_at();

-- Trigger for team_members
CREATE OR REPLACE FUNCTION update_team_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_team_members_updated_at();

-- =====================================================
-- RLS (ROW LEVEL SECURITY) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Simplified policies for clubs
CREATE POLICY "Users can view all active clubs" ON clubs
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can create clubs" ON clubs
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE POLICY "Club creators can update their clubs" ON clubs
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Club creators can delete their clubs" ON clubs
    FOR DELETE USING (created_by = auth.uid());

-- Simplified policies for teams
CREATE POLICY "Users can view all active teams" ON teams
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can create teams" ON teams
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE POLICY "Team creators can update their teams" ON teams
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Team creators can delete their teams" ON teams
    FOR DELETE USING (created_by = auth.uid());

-- Simplified policies for team_members
CREATE POLICY "Users can view all active team members" ON team_members
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage team members" ON team_members
    FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- USEFUL VIEWS
-- =====================================================

-- View for clubs with team information
CREATE OR REPLACE VIEW clubs_with_teams AS
SELECT 
    c.*,
    COUNT(t.id) as team_count,
    COUNT(tm.id) as total_members
FROM clubs c
LEFT JOIN teams t ON c.id = t.club_id AND t.is_active = true
LEFT JOIN team_members tm ON t.id = tm.team_id AND tm.is_active = true
WHERE c.is_active = true
GROUP BY c.id;

-- View for teams with club information
CREATE OR REPLACE VIEW teams_with_club AS
SELECT 
    t.*,
    c.name as club_name,
    c.location as club_location,
    COUNT(tm.id) as member_count
FROM teams t
JOIN clubs c ON t.club_id = c.id
LEFT JOIN team_members tm ON t.id = tm.team_id AND tm.is_active = true
WHERE t.is_active = true AND c.is_active = true
GROUP BY t.id, c.id;
