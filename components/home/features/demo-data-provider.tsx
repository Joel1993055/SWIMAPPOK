'use client';

import { useSessionsStore, useTrainingStore } from '@/lib/store/unified';
import { useEffect } from 'react';

// Demo data for sessions (last 30 days)
const demoSessions = [
  // This week
  {
    id: '1',
    date: new Date().toISOString(),
    distance: 2500,
    duration: 45,
    type: 'Training',
    notes: 'Technique and endurance session',
    swimmer: 'Maria Gonzalez',
    title: 'Freestyle and backstroke technique',
    zone_volumes: { z1: 500, z2: 1200, z3: 600, z4: 200, z5: 0 }
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    distance: 3000,
    duration: 50,
    type: 'Training',
    notes: 'Speed sets',
    swimmer: 'Carlos Ruiz',
    title: '100m speed sets',
    zone_volumes: { z1: 200, z2: 800, z3: 1000, z4: 800, z5: 200 }
  },
  {
    id: '3',
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    distance: 2000,
    duration: 35,
    type: 'Technique',
    notes: 'Stroke exercises',
    swimmer: 'Ana Martin',
    title: 'Freestyle stroke technique',
    zone_volumes: { z1: 800, z2: 1000, z3: 200, z4: 0, z5: 0 }
  },
  {
    id: '4',
    date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    distance: 4000,
    duration: 60,
    type: 'Endurance',
    notes: 'Long continuous swim',
    swimmer: 'David Lopez',
    title: 'Endurance base',
    zone_volumes: { z1: 1000, z2: 2500, z3: 500, z4: 0, z5: 0 }
  },
  {
    id: '5',
    date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    distance: 1500,
    duration: 25,
    type: 'Speed',
    notes: 'Short speed sets',
    swimmer: 'Sofia Garcia',
    title: '50m speed sets',
    zone_volumes: { z1: 100, z2: 200, z3: 400, z4: 600, z5: 200 }
  },
  {
    id: '6',
    date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    distance: 3500,
    duration: 55,
    type: 'Training',
    notes: 'Combined techniques',
    swimmer: 'Miguel Torres',
    title: '4 strokes combined',
    zone_volumes: { z1: 500, z2: 1500, z3: 1000, z4: 400, z5: 100 }
  },
  {
    id: '7',
    date: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
    distance: 2800,
    duration: 42,
    type: 'Technique',
    notes: 'Style improvement',
    swimmer: 'Laura Fernandez',
    title: 'Butterfly technique',
    zone_volumes: { z1: 600, z2: 1200, z3: 800, z4: 200, z5: 0 }
  },
  // Previous week
  {
    id: '8',
    date: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    distance: 3200,
    duration: 48,
    type: 'Endurance',
    notes: 'Endurance base',
    swimmer: 'Javier Moreno',
    title: '3km endurance',
    zone_volumes: { z1: 800, z2: 2000, z3: 400, z4: 0, z5: 0 }
  },
  {
    id: '9',
    date: new Date(Date.now() - 691200000).toISOString(), // 8 days ago
    distance: 1800,
    duration: 30,
    type: 'Speed',
    notes: '25m speed sets',
    swimmer: 'Elena Castro',
    title: '25m sprints',
    zone_volumes: { z1: 50, z2: 100, z3: 200, z4: 800, z5: 650 }
  },
  {
    id: '10',
    date: new Date(Date.now() - 777600000).toISOString(), // 9 days ago
    distance: 2200,
    duration: 38,
    type: 'Technique',
    notes: 'Backstroke technique',
    swimmer: 'Roberto Silva',
    title: 'Backstroke technique',
    zone_volumes: { z1: 700, z2: 1000, z3: 500, z4: 0, z5: 0 }
  },
  {
    id: '11',
    date: new Date(Date.now() - 864000000).toISOString(), // 10 days ago
    distance: 3600,
    duration: 58,
    type: 'Training',
    notes: 'Combined endurance',
    swimmer: 'Carmen Vega',
    title: 'Combined endurance',
    zone_volumes: { z1: 600, z2: 2000, z3: 800, z4: 200, z5: 0 }
  },
  {
    id: '12',
    date: new Date(Date.now() - 950400000).toISOString(), // 11 days ago
    distance: 1900,
    duration: 32,
    type: 'Speed',
    notes: '200m sets',
    swimmer: 'Antonio Ruiz',
    title: '200m sets',
    zone_volumes: { z1: 100, z2: 300, z3: 600, z4: 700, z5: 200 }
  },
  {
    id: '13',
    date: new Date(Date.now() - 1036800000).toISOString(), // 12 days ago
    distance: 2400,
    duration: 40,
    type: 'Technique',
    notes: 'Breaststroke technique',
    swimmer: 'Isabel Morales',
    title: 'Breaststroke technique',
    zone_volumes: { z1: 800, z2: 1200, z3: 400, z4: 0, z5: 0 }
  },
  {
    id: '14',
    date: new Date(Date.now() - 1123200000).toISOString(), // 13 days ago
    distance: 2800,
    duration: 45,
    type: 'Endurance',
    notes: '2.8km endurance',
    swimmer: 'Fernando Herrera',
    title: 'Endurance base',
    zone_volumes: { z1: 700, z2: 1800, z3: 300, z4: 0, z5: 0 }
  },
  // More sessions to complete the month
  {
    id: '15',
    date: new Date(Date.now() - 1209600000).toISOString(), // 14 days ago
    distance: 1600,
    duration: 28,
    type: 'Speed',
    notes: '100m sets',
    swimmer: 'Patricia Lopez',
    title: '100m speed sets',
    zone_volumes: { z1: 50, z2: 200, z3: 500, z4: 600, z5: 250 }
  },
  {
    id: '16',
    date: new Date(Date.now() - 1296000000).toISOString(), // 15 days ago
    distance: 3000,
    duration: 50,
    type: 'Training',
    notes: 'Combined techniques',
    swimmer: 'Manuel Garcia',
    title: '4 strokes combined',
    zone_volumes: { z1: 400, z2: 1400, z3: 800, z4: 300, z5: 100 }
  },
  {
    id: '17',
    date: new Date(Date.now() - 1382400000).toISOString(), // 16 days ago
    distance: 2100,
    duration: 35,
    type: 'Technique',
    notes: 'Freestyle technique',
    swimmer: 'Rosa Martinez',
    title: 'Freestyle technique',
    zone_volumes: { z1: 600, z2: 1000, z3: 500, z4: 0, z5: 0 }
  },
  {
    id: '18',
    date: new Date(Date.now() - 1468800000).toISOString(), // 17 days ago
    distance: 3800,
    duration: 62,
    type: 'Endurance',
    notes: 'Long endurance',
    swimmer: 'Alberto Sanchez',
    title: '3.8km endurance',
    zone_volumes: { z1: 800, z2: 2500, z3: 500, z4: 0, z5: 0 }
  },
  {
    id: '19',
    date: new Date(Date.now() - 1555200000).toISOString(), // 18 days ago
    distance: 1700,
    duration: 30,
    type: 'Speed',
    notes: '50m sets',
    swimmer: 'Cristina Diaz',
    title: '50m sets',
    zone_volumes: { z1: 100, z2: 200, z3: 400, z4: 700, z5: 300 }
  },
  {
    id: '20',
    date: new Date(Date.now() - 1641600000).toISOString(), //  19 days ago
    distance: 2600,
    duration: 44,
    type: 'Technique',
    notes: 'Butterfly technique',
    swimmer: 'Jorge Munoz',
    title: 'Butterfly technique',
    zone_volumes: { z1: 500, z2: 1200, z3: 700, z4: 200, z5: 0 }
  },
  {
    id: '21',
    date: new Date(Date.now() - 1728000000).toISOString(), //  20 days ago
    distance: 3200,
    duration: 52,
    type: 'Training',
    notes: 'Combined endurance',
    swimmer: 'Monica Rodriguez',
    title: 'Combined endurance',
    zone_volumes: { z1: 600, z2: 1800, z3: 600, z4: 200, z5: 0 }
  },
  {
    id: '22',
    date: new Date(Date.now() - 1814400000).toISOString(), //  21 days ago
    distance: 1900,
    duration: 32,
    type: 'Speed',
    notes: '200m sets',
    swimmer: 'Pablo Jimenez',
    title: '200m sets',
    zone_volumes: { z1: 100, z2: 300, z3: 600, z4: 700, z5: 200 }
  },
  {
    id: '23',
    date: new Date(Date.now() - 1900800000).toISOString(), //  22 days ago
    distance: 2400,
    duration: 40,
    type: 'Technique',
    notes: 'Backstroke technique',
    swimmer: 'Natalia Fernandez',
    title: 'Backstroke technique',
    zone_volumes: { z1: 700, z2: 1200, z3: 500, z4: 0, z5: 0 }
  },
  {
    id: '24',
    date: new Date(Date.now() - 1987200000).toISOString(), //  23 days ago
    distance: 2900,
    duration: 47,
    type: 'Endurance',
    notes: '2.9km endurance',
    swimmer: 'Hector Vargas',
    title: 'Endurance base',
    zone_volumes: { z1: 700, z2: 1800, z3: 400, z4: 0, z5: 0 }
  },
  {
    id: '25',
    date: new Date(Date.now() - 2073600000).toISOString(), //  24 days ago
    distance: 1800,
    duration: 30,
    type: 'Speed',
    notes: '100m sets',
    swimmer: 'Silvia Moreno',
    title: '100m sets',
    zone_volumes: { z1: 50, z2: 200, z3: 500, z4: 700, z5: 350 }
  },
  {
    id: '26',
    date: new Date(Date.now() - 2160000000).toISOString(), //  25 days ago
    distance: 3300,
    duration: 55,
    type: 'Training',
    notes: 'Combined techniques',
    swimmer: 'Raúl Castillo',
    title: '4 strokes combined',
    zone_volumes: { z1: 500, z2: 1600, z3: 800, z4: 300, z5: 100 }
  },
  {
    id: '27',
    date: new Date(Date.now() - 2246400000).toISOString(), //  26 days ago
    distance: 2200,
    duration: 37,
    type: 'Technique',
    notes: 'Breaststroke technique',
    swimmer: 'Beatriz Ramos',
    title: 'Breaststroke technique',
    zone_volumes: { z1: 600, z2: 1100, z3: 500, z4: 0, z5: 0 }
  },
  {
    id: '28',
    date: new Date(Date.now() - 2332800000).toISOString(), //  27 days ago
    distance: 3700,
    duration: 60,
    type: 'Endurance',
    notes: 'Long endurance',
    swimmer: 'Víctor Ortega',
    title: '3.7km endurance',
    zone_volumes: { z1: 800, z2: 2400, z3: 500, z4: 0, z5: 0 }
  },
  {
    id: '29',
    date: new Date(Date.now() - 2419200000).toISOString(), //  28 days ago
    distance: 1600,
    duration: 28,
    type: 'Speed',
    notes: '50m sets',
    swimmer: 'Lorena Peña',
    title: '50m sets',
    zone_volumes: { z1: 100, z2: 200, z3: 400, z4: 600, z5: 300 }
  },
  {
    id: '30',
    date: new Date(Date.now() - 2505600000).toISOString(), //  29 days ago
    distance: 2500,
    duration: 42,
    type: 'Technique',
    notes: 'Freestyle technique',
    swimmer: 'Óscar Delgado',
    title: 'Freestyle technique',
    zone_volumes: { z1: 600, z2: 1200, z3: 700, z4: 0, z5: 0 }
  },
  {
    id: '31',
    date: new Date(Date.now() - 2592000000).toISOString(), //  30 days ago
    distance: 3000,
    duration: 50,
    type: 'Training',
    notes: 'Combined endurance',
    swimmer: 'Eva Cabrera',
    title: 'Combined endurance',
    zone_volumes: { z1: 500, z2: 1700, z3: 600, z4: 200, z5: 0 }
  }
];

// Demo data for training phases
const demoPhases = [
  {
    id: '1',
    name: 'Base',
    description: 'Aerobic base building phase',
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), //  14 days ago
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // En 7 days ago
    duration: 3,
    color: 'bg-green-500',
    intensity: 'Medium',
    focus: 'Aerobic endurance'
  },
  {
    id: '2',
    name: 'Build',
    description: 'Intensity increase phase',
    startDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // En 8 days ago
    endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(), // En 28 days ago
    duration: 3,
    color: 'bg-blue-500',
    intensity: 'High',
    focus: 'Speed and power'
  },
  {
    id: '3',
    name: 'Peak',
    description: 'Maximum intensity phase',
    startDate: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(), // En 29 days ago
    endDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString(), // En 42 days ago
    duration: 2,
    color: 'bg-red-500',
    intensity: 'Maximum',
    focus: 'Competition'
  }
];

// Demo data for calendar events
const demoEvents = [
  {
    id: '1',
    title: 'Morning training',
    date: new Date().toISOString(),
    type: 'training',
    description: 'Technique and endurance session',
    time: '07:00',
    duration: 60
  },
  {
    id: '2',
    title: 'Local competition',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // En 7 days ago
    type: 'competition',
    description: 'Regional swimming championship',
    time: '10:00',
    duration: 180
  },
  {
    id: '3',
    title: 'Speed training',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // En 2 days ago
    type: 'training',
    description: 'Speed and technique sets',
    time: '18:00',
    duration: 90
  },
  {
    id: '4',
    title: 'Team meeting',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // En 3 days ago
    type: 'meeting',
    description: 'Next phase planning',
    time: '19:00',
    duration: 60
  },
  {
    id: '5',
    title: 'Endurance training',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // En 5 days ago
    type: 'training',
    description: 'Long endurance training',
    time: '08:00',
    duration: 120
  }
];

// Demo data for weekly schedule
const demoWeeklySchedule = [
  {
    id: '1',
    day: 'Monday',
    sessions: [
      { time: '07:00', type: 'Technique', duration: 60, pool: 'Pool A' },
      { time: '18:00', type: 'Speed', duration: 45, pool: 'Pool B' }
    ]
  },
  {
    id: '2',
    day: 'Tuesday',
    sessions: [
      { time: '07:00', type: 'Endurance', duration: 90, pool: 'Pool A' }
    ]
  },
  {
    id: '3',
    day: 'Wednesday',
    sessions: [
      { time: '07:00', type: 'Technique', duration: 60, pool: 'Pool A' },
      { time: '18:00', type: 'Speed', duration: 45, pool: 'Pool B' }
    ]
  },
  {
    id: '4',
    day: 'Thursday',
    sessions: [
      { time: '07:00', type: 'Endurance', duration: 90, pool: 'Pool A' }
    ]
  },
  {
    id: '5',
    day: 'Friday',
    sessions: [
      { time: '07:00', type: 'Technique', duration: 60, pool: 'Pool A' },
      { time: '18:00', type: 'Speed', duration: 45, pool: 'Pool B' }
    ]
  },
  {
    id: '6',
    day: 'Saturday',
    sessions: [
      { time: '09:00', type: 'Endurance', duration: 120, pool: 'Pool A' }
    ]
  },
  {
    id: '7',
    day: 'Sunday',
    sessions: [
      { time: '10:00', type: 'Recovery', duration: 45, pool: 'Pool A' }
    ]
  }
];

// Demo data for additional metrics
const demoMetrics = {
  totalDistance: 87500, // total meters
  totalSessions: 31,
  averageDistance: 2822, // meters per session
  totalDuration: 1395, // total minutes
  averageDuration: 45, // minutes per session
  weeklyDistance: 18750, // meters this week
  monthlyDistance: 75000, // meters this month
  yearlyDistance: 87500, // meters this year
  zoneDistribution: {
    z1: 35, // percentage
    z2: 40,
    z3: 15,
    z4: 8,
    z5: 2
  },
  improvementRate: 12.5, // improvement percentage
  consistencyScore: 85, // consistency score
  nextGoal: '50km this month',
  currentStreak: 7 // consecutive days
};

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const { setSessions } = useSessionsStore();
  const { setPhases } = useTrainingStore();

  useEffect(() => {
    // Load demo data
    setSessions(demoSessions);
    setPhases(demoPhases);
    
    // We could also load other data if necessary
    // setEvents(demoEvents);
    // setWeeklySchedule(demoWeeklySchedule);
    // setMetrics(demoMetrics);
  }, [setSessions, setPhases]);

  return <>{children}</>;
}
