/**
 * Demo Data Seeder
 * Automatically creates sample data for new users
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface DemoSession {
  title: string;
  date: string;
  type: string;
  duration: number;
  distance: number;
  stroke: string;
  rpe: number;
  location: string;
  coach: string;
  club: string;
  group_name: string;
  content: string;
  zone_volumes: {
    z1: number;
    z2: number;
    z3: number;
    z4: number;
    z5: number;
  };
}

const demoData: DemoSession[] = [
  {
    title: 'Morning Swim - Aerobic Base',
    date: '2024-01-15',
    type: 'Aeróbico',
    duration: 75,
    distance: 2500,
    stroke: 'Libre',
    rpe: 6,
    location: 'Club Natación Madrid',
    coach: 'Carlos Mendez',
    club: 'CN Madrid',
    group_name: 'Grupo A',
    content: 'Warm up: 400m easy\nMain set: 8x200m @ 80% effort (30s rest)\nCool down: 400m easy',
    zone_volumes: { z1: 400, z2: 1600, z3: 400, z4: 100, z5: 0 }
  },
  {
    title: 'Speed Training Session',
    date: '2024-01-17',
    type: 'Velocidad',
    duration: 60,
    distance: 1800,
    stroke: 'Libre',
    rpe: 8,
    location: 'Club Natación Madrid',
    coach: 'Carlos Mendez',
    club: 'CN Madrid',
    group_name: 'Grupo A',
    content: 'Warm up: 300m easy\nMain set: 10x50m sprint (1min rest)\nCool down: 300m easy',
    zone_volumes: { z1: 300, z2: 300, z3: 200, z4: 500, z5: 500 }
  },
  {
    title: 'Recovery Swim',
    date: '2024-01-19',
    type: 'Recuperación',
    duration: 45,
    distance: 1200,
    stroke: 'Libre',
    rpe: 4,
    location: 'Club Natación Madrid',
    coach: 'Carlos Mendez',
    club: 'CN Madrid',
    group_name: 'Grupo A',
    content: 'Easy pace recovery swim\nFocus on technique and breathing',
    zone_volumes: { z1: 1200, z2: 0, z3: 0, z4: 0, z5: 0 }
  },
  {
    title: 'Threshold Training',
    date: '2024-01-22',
    type: 'Umbral',
    duration: 80,
    distance: 2800,
    stroke: 'Libre',
    rpe: 7,
    location: 'Club Natación Madrid',
    coach: 'Carlos Mendez',
    club: 'CN Madrid',
    group_name: 'Grupo A',
    content: 'Warm up: 400m easy\nMain set: 4x400m @ threshold pace (45s rest)\nCool down: 400m easy',
    zone_volumes: { z1: 400, z2: 400, z3: 1600, z4: 400, z5: 0 }
  },
  {
    title: 'Technique Focus',
    date: '2024-01-24',
    type: 'Técnica',
    duration: 70,
    distance: 2000,
    stroke: 'Libre',
    rpe: 5,
    location: 'Club Natación Madrid',
    coach: 'Carlos Mendez',
    club: 'CN Madrid',
    group_name: 'Grupo A',
    content: 'Drill work: catch-up, single arm, 6-kick\nMain set: 8x100m technique focus',
    zone_volumes: { z1: 800, z2: 1000, z3: 200, z4: 0, z5: 0 }
  },
  {
    title: 'Endurance Swim',
    date: '2024-01-26',
    type: 'Aeróbico',
    duration: 90,
    distance: 3500,
    stroke: 'Libre',
    rpe: 6,
    location: 'Club Natación Madrid',
    coach: 'Carlos Mendez',
    club: 'CN Madrid',
    group_name: 'Grupo A',
    content: 'Long continuous swim\nFocus on maintaining steady pace',
    zone_volumes: { z1: 500, z2: 2500, z3: 500, z4: 0, z5: 0 }
  },
  {
    title: 'Mixed Training',
    date: '2024-01-29',
    type: 'Personalizado',
    duration: 75,
    distance: 2400,
    stroke: 'Libre',
    rpe: 7,
    location: 'Club Natación Madrid',
    coach: 'Carlos Mendez',
    club: 'CN Madrid',
    group_name: 'Grupo A',
    content: 'Warm up: 400m\nMain set: 6x200m mixed pace\nCool down: 400m',
    zone_volumes: { z1: 400, z2: 800, z3: 800, z4: 400, z5: 0 }
  },
  {
    title: 'Backstroke Session',
    date: '2024-01-31',
    type: 'Técnica',
    duration: 60,
    distance: 1800,
    stroke: 'Espalda',
    rpe: 5,
    location: 'Club Natación Madrid',
    coach: 'Carlos Mendez',
    club: 'CN Madrid',
    group_name: 'Grupo A',
    content: 'Backstroke technique work\nFocus on rotation and arm entry',
    zone_volumes: { z1: 600, z2: 1000, z3: 200, z4: 0, z5: 0 }
  },
  {
    title: 'Competition Prep',
    date: '2024-02-02',
    type: 'Velocidad',
    duration: 70,
    distance: 2200,
    stroke: 'Libre',
    rpe: 8,
    location: 'Club Natación Madrid',
    coach: 'Carlos Mendez',
    club: 'CN Madrid',
    group_name: 'Grupo A',
    content: 'Race pace training\nSimulation of competition conditions',
    zone_volumes: { z1: 200, z2: 400, z3: 600, z4: 800, z5: 200 }
  },
  {
    title: 'Recovery Week',
    date: '2024-02-05',
    type: 'Recuperación',
    duration: 50,
    distance: 1500,
    stroke: 'Libre',
    rpe: 4,
    location: 'Club Natación Madrid',
    coach: 'Carlos Mendez',
    club: 'CN Madrid',
    group_name: 'Grupo A',
    content: 'Easy recovery swim\nLight technique work',
    zone_volumes: { z1: 1500, z2: 0, z3: 0, z4: 0, z5: 0 }
  }
];

export async function seedDemoData(userId: string): Promise<void> {
  try {
    console.log(`🌱 Seeding demo data for user: ${userId}`);

    // Insert demo sessions
    const { error: sessionsError } = await supabase
      .from('sessions')
      .insert(demoData.map(session => ({ ...session, user_id: userId })));

    if (sessionsError) {
      console.error('❌ Error inserting demo sessions:', sessionsError);
      throw sessionsError;
    }

    // Insert demo competition
    const { error: competitionError } = await supabase
      .from('competitions')
      .insert({
        user_id: userId,
        name: 'Campeonato Regional Madrid',
        date: '2024-03-15',
        priority: 'high',
        location: 'Madrid',
        description: 'Regional championship - 50m, 100m, 200m freestyle'
      });

    if (competitionError) {
      console.error('❌ Error inserting demo competition:', competitionError);
      throw competitionError;
    }

    // Insert demo training phase
    const { error: phaseError } = await supabase
      .from('training_phases')
      .insert({
        user_id: userId,
        name: 'Base Training',
        duration_weeks: 8,
        description: 'Building aerobic base and technique',
        focus: ['Aerobic', 'Technique'],
        intensity: 5,
        volume: 20000,
        color: 'bg-blue-500',
        start_date: '2024-01-01',
        end_date: '2024-02-25',
        phase_order: 1
      });

    if (phaseError) {
      console.error('❌ Error inserting demo training phase:', phaseError);
      throw phaseError;
    }

    // Insert user settings
    const { error: settingsError } = await supabase
      .from('user_settings')
      .insert({
        user_id: userId,
        training_zones: {
          z1: { name: 'Recuperación', min: 0, max: 65 },
          z2: { name: 'Aeróbico Base', min: 65, max: 75 },
          z3: { name: 'Aeróbico Umbral', min: 75, max: 85 },
          z4: { name: 'Anaeróbico Láctico', min: 85, max: 95 },
          z5: { name: 'Anaeróbico Aláctico', min: 95, max: 100 }
        },
        selected_methodology: 'standard'
      });

    if (settingsError) {
      console.error('❌ Error inserting user settings:', settingsError);
      throw settingsError;
    }

    console.log('✅ Demo data seeded successfully!');
  } catch (error) {
    console.error('❌ Failed to seed demo data:', error);
    throw error;
  }
}

export async function checkIfUserHasData(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (error) {
      console.error('Error checking user data:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking user data:', error);
    return false;
  }
}
