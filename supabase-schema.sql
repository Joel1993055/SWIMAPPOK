-- =====================================================
-- SWIM APP - ESQUEMA DE BASE DE DATOS
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: SESIONES DE ENTRENAMIENTO
-- =====================================================
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Aeróbico', 'Técnica', 'Umbral', 'Velocidad', 'Recuperación', 'Fuerza', 'Flexibilidad', 'Personalizado')),
  duration INTEGER DEFAULT 0, -- minutos
  distance INTEGER DEFAULT 0, -- metros totales
  stroke TEXT DEFAULT 'Libre' CHECK (stroke IN ('Libre', 'Espalda', 'Pecho', 'Mariposa', 'Combinado')),
  rpe INTEGER DEFAULT 5 CHECK (rpe >= 1 AND rpe <= 10),
  location TEXT DEFAULT 'No especificado',
  coach TEXT DEFAULT 'No especificado',
  club TEXT DEFAULT 'No especificado',
  group_name TEXT DEFAULT 'No especificado',
  content TEXT NOT NULL,
  zone_volumes JSONB DEFAULT '{"z1": 0, "z2": 0, "z3": 0, "z4": 0, "z5": 0}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: FASES DE ENTRENAMIENTO
-- =====================================================
CREATE TABLE training_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  duration_weeks INTEGER NOT NULL CHECK (duration_weeks > 0),
  description TEXT,
  focus TEXT[],
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  volume INTEGER, -- metros por semana
  color TEXT DEFAULT 'bg-blue-500',
  start_date DATE,
  end_date DATE,
  phase_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: COMPETICIONES
-- =====================================================
CREATE TABLE competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  location TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: CONFIGURACIONES DE USUARIO
-- =====================================================
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  training_zones JSONB DEFAULT '{
    "z1": {"name": "Recuperación", "min": 0, "max": 65},
    "z2": {"name": "Aeróbico Base", "min": 65, "max": 75},
    "z3": {"name": "Aeróbico Umbral", "min": 75, "max": 85},
    "z4": {"name": "Anaeróbico Láctico", "min": 85, "max": 95},
    "z5": {"name": "Anaeróbico Aláctico", "min": 95, "max": 100}
  }',
  selected_methodology TEXT DEFAULT 'standard',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- =====================================================
CREATE INDEX idx_sessions_user_date ON sessions(user_id, date DESC);
CREATE INDEX idx_sessions_user_created ON sessions(user_id, created_at DESC);
CREATE INDEX idx_training_phases_user_order ON training_phases(user_id, phase_order);
CREATE INDEX idx_competitions_user_date ON competitions(user_id, date DESC);
CREATE INDEX idx_competitions_user_priority ON competitions(user_id, priority, date);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS DE SEGURIDAD PARA SESSIONS
-- =====================================================
CREATE POLICY "Users can view own sessions" ON sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON sessions
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- POLÍTICAS DE SEGURIDAD PARA TRAINING_PHASES
-- =====================================================
CREATE POLICY "Users can view own training phases" ON training_phases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training phases" ON training_phases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own training phases" ON training_phases
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own training phases" ON training_phases
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- POLÍTICAS DE SEGURIDAD PARA COMPETITIONS
-- =====================================================
CREATE POLICY "Users can view own competitions" ON competitions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own competitions" ON competitions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own competitions" ON competitions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own competitions" ON competitions
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- POLÍTICAS DE SEGURIDAD PARA USER_SETTINGS
-- =====================================================
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings" ON user_settings
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- FUNCIONES DE ACTUALIZACIÓN AUTOMÁTICA
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_phases_updated_at BEFORE UPDATE ON training_phases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitions_updated_at BEFORE UPDATE ON competitions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- =====================================================

-- Insertar configuraciones por defecto para usuarios nuevos
CREATE OR REPLACE FUNCTION create_default_user_settings()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_settings (user_id, training_zones, selected_methodology)
    VALUES (
        NEW.id,
        '{
            "z1": {"name": "Recuperación", "min": 0, "max": 65},
            "z2": {"name": "Aeróbico Base", "min": 65, "max": 75},
            "z3": {"name": "Aeróbico Umbral", "min": 75, "max": 85},
            "z4": {"name": "Anaeróbico Láctico", "min": 85, "max": 95},
            "z5": {"name": "Anaeróbico Aláctico", "min": 95, "max": 100}
        }',
        'standard'
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para crear configuraciones por defecto
CREATE TRIGGER create_user_settings_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_default_user_settings();

-- =====================================================
-- COMENTARIOS EN TABLAS
-- =====================================================
COMMENT ON TABLE sessions IS 'Sesiones de entrenamiento de natación';
COMMENT ON TABLE training_phases IS 'Fases del ciclo de entrenamiento';
COMMENT ON TABLE competitions IS 'Competiciones y eventos importantes';
COMMENT ON TABLE user_settings IS 'Configuraciones personalizadas del usuario';

-- =====================================================
-- FIN DEL ESQUEMA
-- =====================================================
