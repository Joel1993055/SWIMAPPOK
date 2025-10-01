-- =====================================================
-- DEMO DATA FOR SWIM APP
-- =====================================================
-- This script creates sample data for demonstration purposes
-- Run this after creating a new user account

-- =====================================================
-- SAMPLE TRAINING SESSIONS
-- =====================================================

-- Note: Replace 'YOUR_USER_ID' with actual user ID from auth.users table
-- You can get this by running: SELECT id FROM auth.users LIMIT 1;

INSERT INTO sessions (
  user_id,
  title,
  date,
  type,
  duration,
  distance,
  stroke,
  rpe,
  location,
  coach,
  club,
  group_name,
  content,
  zone_volumes
) VALUES 
-- Week 1 - January 2024
('YOUR_USER_ID', 'Morning Swim - Aerobic Base', '2024-01-15', 'Aeróbico', 75, 2500, 'Libre', 6, 'Club Natación Madrid', 'Carlos Mendez', 'CN Madrid', 'Grupo A', 'Warm up: 400m easy\nMain set: 8x200m @ 80% effort (30s rest)\nCool down: 400m easy', '{"z1": 400, "z2": 1600, "z3": 400, "z4": 100, "z5": 0}'),

('YOUR_USER_ID', 'Speed Training Session', '2024-01-17', 'Velocidad', 60, 1800, 'Libre', 8, 'Club Natación Madrid', 'Carlos Mendez', 'CN Madrid', 'Grupo A', 'Warm up: 300m easy\nMain set: 10x50m sprint (1min rest)\nCool down: 300m easy', '{"z1": 300, "z2": 300, "z3": 200, "z4": 500, "z5": 500}'),

('YOUR_USER_ID', 'Recovery Swim', '2024-01-19', 'Recuperación', 45, 1200, 'Libre', 4, 'Club Natación Madrid', 'Carlos Mendez', 'CN Madrid', 'Grupo A', 'Easy pace recovery swim\nFocus on technique and breathing', '{"z1": 1200, "z2": 0, "z3": 0, "z4": 0, "z5": 0}'),

-- Week 2 - January 2024
('YOUR_USER_ID', 'Threshold Training', '2024-01-22', 'Umbral', 80, 2800, 'Libre', 7, 'Club Natación Madrid', 'Carlos Mendez', 'CN Madrid', 'Grupo A', 'Warm up: 400m easy\nMain set: 4x400m @ threshold pace (45s rest)\nCool down: 400m easy', '{"z1": 400, "z2": 400, "z3": 1600, "z4": 400, "z5": 0}'),

('YOUR_USER_ID', 'Technique Focus', '2024-01-24', 'Técnica', 70, 2000, 'Libre', 5, 'Club Natación Madrid', 'Carlos Mendez', 'CN Madrid', 'Grupo A', 'Drill work: catch-up, single arm, 6-kick\nMain set: 8x100m technique focus', '{"z1": 800, "z2": 1000, "z3": 200, "z4": 0, "z5": 0}'),

('YOUR_USER_ID', 'Endurance Swim', '2024-01-26', 'Aeróbico', 90, 3500, 'Libre', 6, 'Club Natación Madrid', 'Carlos Mendez', 'CN Madrid', 'Grupo A', 'Long continuous swim\nFocus on maintaining steady pace', '{"z1": 500, "z2": 2500, "z3": 500, "z4": 0, "z5": 0}'),

-- Week 3 - January 2024
('YOUR_USER_ID', 'Mixed Training', '2024-01-29', 'Personalizado', 75, 2400, 'Libre', 7, 'Club Natación Madrid', 'Carlos Mendez', 'CN Madrid', 'Grupo A', 'Warm up: 400m\nMain set: 6x200m mixed pace\nCool down: 400m', '{"z1": 400, "z2": 800, "z3": 800, "z4": 400, "z5": 0}'),

('YOUR_USER_ID', 'Backstroke Session', '2024-01-31', 'Técnica', 60, 1800, 'Espalda', 5, 'Club Natación Madrid', 'Carlos Mendez', 'CN Madrid', 'Grupo A', 'Backstroke technique work\nFocus on rotation and arm entry', '{"z1": 600, "z2": 1000, "z3": 200, "z4": 0, "z5": 0}'),

-- February 2024
('YOUR_USER_ID', 'Competition Prep', '2024-02-02', 'Velocidad', 70, 2200, 'Libre', 8, 'Club Natación Madrid', 'Carlos Mendez', 'CN Madrid', 'Grupo A', 'Race pace training\nSimulation of competition conditions', '{"z1": 200, "z2": 400, "z3": 600, "z4": 800, "z5": 200}'),

('YOUR_USER_ID', 'Recovery Week', '2024-02-05', 'Recuperación', 50, 1500, 'Libre', 4, 'Club Natación Madrid', 'Carlos Mendez', 'CN Madrid', 'Grupo A', 'Easy recovery swim\nLight technique work', '{"z1": 1500, "z2": 0, "z3": 0, "z4": 0, "z5": 0}'),

('YOUR_USER_ID', 'Breaststroke Focus', '2024-02-07', 'Técnica', 65, 1900, 'Pecho', 6, 'Club Natación Madrid', 'Carlos Mendez', 'CN Madrid', 'Grupo A', 'Breaststroke technique\nPull and kick timing', '{"z1": 400, "z2": 1200, "z3": 300, "z4": 0, "z5": 0}'),

('YOUR_USER_ID', 'Long Distance', '2024-02-09', 'Aeróbico', 100, 4000, 'Libre', 6, 'Club Natación Madrid', 'Carlos Mendez', 'CN Madrid', 'Grupo A', 'Long continuous swim\nBuilding aerobic base', '{"z1": 600, "z2": 2800, "z3": 600, "z4": 0, "z5": 0}'),

-- Recent sessions
('YOUR_USER_ID', 'Sprint Training', '2024-02-12', 'Velocidad', 55, 1600, 'Libre', 9, 'Club Natación Madrid', 'Carlos Mendez', 'CN Madrid', 'Grupo A', 'High intensity sprint work\n25m and 50m repeats', '{"z1": 200, "z2": 200, "z3": 400, "z4": 600, "z5": 200}'),

('YOUR_USER_ID', 'Mixed Strokes', '2024-02-14', 'Personalizado', 70, 2300, 'Combinado', 6, 'Club Natación Madrid', 'Carlos Mendez', 'CN Madrid', 'Grupo A', 'All four strokes\nIM training', '{"z1": 500, "z2": 1400, "z3": 400, "z4": 0, "z5": 0}'),

('YOUR_USER_ID', 'Easy Recovery', '2024-02-16', 'Recuperación', 40, 1200, 'Libre', 3, 'Club Natación Madrid', 'Carlos Mendez', 'CN Madrid', 'Grupo A', 'Very easy pace\nFocus on relaxation', '{"z1": 1200, "z2": 0, "z3": 0, "z4": 0, "z5": 0}');

-- =====================================================
-- SAMPLE COMPETITIONS
-- =====================================================

INSERT INTO competitions (
  user_id,
  name,
  date,
  priority,
  location,
  description
) VALUES 
('YOUR_USER_ID', 'Campeonato Regional Madrid', '2024-03-15', 'high', 'Madrid', 'Regional championship - 50m, 100m, 200m freestyle'),
('YOUR_USER_ID', 'Trofeo Primavera', '2024-04-20', 'medium', 'Barcelona', 'Spring trophy - 100m, 200m freestyle and backstroke'),
('YOUR_USER_ID', 'Copa Nacional', '2024-06-10', 'high', 'Valencia', 'National cup - all distances'),
('YOUR_USER_ID', 'Meeting Internacional', '2024-07-25', 'low', 'Lisboa', 'International meet - preparation competition');

-- =====================================================
-- SAMPLE TRAINING PHASES
-- =====================================================

INSERT INTO training_phases (
  user_id,
  name,
  duration_weeks,
  description,
  focus,
  intensity,
  volume,
  color,
  start_date,
  end_date,
  phase_order
) VALUES 
('YOUR_USER_ID', 'Base Training', 8, 'Building aerobic base and technique', ARRAY['Aerobic', 'Technique'], 5, 20000, 'bg-blue-500', '2024-01-01', '2024-02-25', 1),
('YOUR_USER_ID', 'Build Phase', 6, 'Increasing intensity and volume', ARRAY['Threshold', 'Speed'], 7, 25000, 'bg-green-500', '2024-02-26', '2024-04-07', 2),
('YOUR_USER_ID', 'Peak Phase', 4, 'Race preparation and tapering', ARRAY['Speed', 'Race Pace'], 8, 18000, 'bg-red-500', '2024-04-08', '2024-05-05', 3),
('YOUR_USER_ID', 'Recovery Phase', 2, 'Active recovery and maintenance', ARRAY['Recovery', 'Technique'], 4, 12000, 'bg-yellow-500', '2024-05-06', '2024-05-19', 4);

-- =====================================================
-- SAMPLE USER SETTINGS
-- =====================================================

INSERT INTO user_settings (
  user_id,
  training_zones,
  selected_methodology
) VALUES 
('YOUR_USER_ID', '{
  "z1": {"name": "Recuperación", "min": 0, "max": 65},
  "z2": {"name": "Aeróbico Base", "min": 65, "max": 75},
  "z3": {"name": "Aeróbico Umbral", "min": 75, "max": 85},
  "z4": {"name": "Anaeróbico Láctico", "min": 85, "max": 95},
  "z5": {"name": "Anaeróbico Aláctico", "min": 95, "max": 100}
}', 'standard');

-- =====================================================
-- INSTRUCTIONS FOR USE
-- =====================================================
-- 1. Replace 'YOUR_USER_ID' with your actual user ID
-- 2. Run this script after creating your user account
-- 3. The data will populate your dashboard with realistic training data
-- 4. You can modify dates, distances, and other values as needed
