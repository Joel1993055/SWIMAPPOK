'use client';

import { useSessionsStore, useTrainingStore } from '@/lib/store/unified';
import { useEffect } from 'react';

// Datos de demo para las sesiones (últimos 30 días)
const demoSessions = [
  // Esta semana
  {
    id: '1',
    date: new Date().toISOString(),
    distance: 2500,
    duration: 45,
    type: 'Entrenamiento',
    notes: 'Sesión de técnica y resistencia',
    swimmer: 'María González',
    title: 'Técnica de crol y espalda',
    zone_volumes: { z1: 500, z2: 1200, z3: 600, z4: 200, z5: 0 }
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString(), // Ayer
    distance: 3000,
    duration: 50,
    type: 'Entrenamiento',
    notes: 'Series de velocidad',
    swimmer: 'Carlos Ruiz',
    title: 'Series de 100m velocidad',
    zone_volumes: { z1: 200, z2: 800, z3: 1000, z4: 800, z5: 200 }
  },
  {
    id: '3',
    date: new Date(Date.now() - 172800000).toISOString(), // Hace 2 días
    distance: 2000,
    duration: 35,
    type: 'Técnica',
    notes: 'Ejercicios de brazada',
    swimmer: 'Ana Martín',
    title: 'Técnica de brazada crol',
    zone_volumes: { z1: 800, z2: 1000, z3: 200, z4: 0, z5: 0 }
  },
  {
    id: '4',
    date: new Date(Date.now() - 259200000).toISOString(), // Hace 3 días
    distance: 4000,
    duration: 60,
    type: 'Resistencia',
    notes: 'Nado continuo largo',
    swimmer: 'David López',
    title: 'Fondo de resistencia',
    zone_volumes: { z1: 1000, z2: 2500, z3: 500, z4: 0, z5: 0 }
  },
  {
    id: '5',
    date: new Date(Date.now() - 345600000).toISOString(), // Hace 4 días
    distance: 1500,
    duration: 25,
    type: 'Velocidad',
    notes: 'Series cortas de velocidad',
    swimmer: 'Sofia García',
    title: 'Series de 50m velocidad',
    zone_volumes: { z1: 100, z2: 200, z3: 400, z4: 600, z5: 200 }
  },
  {
    id: '6',
    date: new Date(Date.now() - 432000000).toISOString(), // Hace 5 días
    distance: 3500,
    duration: 55,
    type: 'Entrenamiento',
    notes: 'Combinado de técnicas',
    swimmer: 'Miguel Torres',
    title: 'Combinado 4 estilos',
    zone_volumes: { z1: 500, z2: 1500, z3: 1000, z4: 400, z5: 100 }
  },
  {
    id: '7',
    date: new Date(Date.now() - 518400000).toISOString(), // Hace 6 días
    distance: 2800,
    duration: 42,
    type: 'Técnica',
    notes: 'Perfeccionamiento de estilo',
    swimmer: 'Laura Fernández',
    title: 'Técnica de mariposa',
    zone_volumes: { z1: 600, z2: 1200, z3: 800, z4: 200, z5: 0 }
  },
  // Semana anterior
  {
    id: '8',
    date: new Date(Date.now() - 604800000).toISOString(), // Hace 7 días
    distance: 3200,
    duration: 48,
    type: 'Resistencia',
    notes: 'Fondo de resistencia',
    swimmer: 'Javier Moreno',
    title: 'Fondo de 3km',
    zone_volumes: { z1: 800, z2: 2000, z3: 400, z4: 0, z5: 0 }
  },
  {
    id: '9',
    date: new Date(Date.now() - 691200000).toISOString(), // Hace 8 días
    distance: 1800,
    duration: 30,
    type: 'Velocidad',
    notes: 'Series de 25m velocidad',
    swimmer: 'Elena Castro',
    title: 'Sprint de 25m',
    zone_volumes: { z1: 50, z2: 100, z3: 200, z4: 800, z5: 650 }
  },
  {
    id: '10',
    date: new Date(Date.now() - 777600000).toISOString(), // Hace 9 días
    distance: 2200,
    duration: 38,
    type: 'Técnica',
    notes: 'Técnica de espalda',
    swimmer: 'Roberto Silva',
    title: 'Técnica de espalda',
    zone_volumes: { z1: 700, z2: 1000, z3: 500, z4: 0, z5: 0 }
  },
  {
    id: '11',
    date: new Date(Date.now() - 864000000).toISOString(), // Hace 10 días
    distance: 3600,
    duration: 58,
    type: 'Entrenamiento',
    notes: 'Combinado de resistencia',
    swimmer: 'Carmen Vega',
    title: 'Resistencia combinada',
    zone_volumes: { z1: 600, z2: 2000, z3: 800, z4: 200, z5: 0 }
  },
  {
    id: '12',
    date: new Date(Date.now() - 950400000).toISOString(), // Hace 11 días
    distance: 1900,
    duration: 32,
    type: 'Velocidad',
    notes: 'Series de 200m',
    swimmer: 'Antonio Ruiz',
    title: 'Series de 200m',
    zone_volumes: { z1: 100, z2: 300, z3: 600, z4: 700, z5: 200 }
  },
  {
    id: '13',
    date: new Date(Date.now() - 1036800000).toISOString(), // Hace 12 días
    distance: 2400,
    duration: 40,
    type: 'Técnica',
    notes: 'Técnica de braza',
    swimmer: 'Isabel Morales',
    title: 'Técnica de braza',
    zone_volumes: { z1: 800, z2: 1200, z3: 400, z4: 0, z5: 0 }
  },
  {
    id: '14',
    date: new Date(Date.now() - 1123200000).toISOString(), // Hace 13 días
    distance: 2800,
    duration: 45,
    type: 'Resistencia',
    notes: 'Fondo de 2.8km',
    swimmer: 'Fernando Herrera',
    title: 'Fondo de resistencia',
    zone_volumes: { z1: 700, z2: 1800, z3: 300, z4: 0, z5: 0 }
  },
  // Más sesiones para completar el mes
  {
    id: '15',
    date: new Date(Date.now() - 1209600000).toISOString(), // Hace 14 días
    distance: 1600,
    duration: 28,
    type: 'Velocidad',
    notes: 'Series de 100m',
    swimmer: 'Patricia López',
    title: 'Series de 100m velocidad',
    zone_volumes: { z1: 50, z2: 200, z3: 500, z4: 600, z5: 250 }
  },
  {
    id: '16',
    date: new Date(Date.now() - 1296000000).toISOString(), // Hace 15 días
    distance: 3000,
    duration: 50,
    type: 'Entrenamiento',
    notes: 'Combinado de técnicas',
    swimmer: 'Manuel García',
    title: 'Combinado 4 estilos',
    zone_volumes: { z1: 400, z2: 1400, z3: 800, z4: 300, z5: 100 }
  },
  {
    id: '17',
    date: new Date(Date.now() - 1382400000).toISOString(), // Hace 16 días
    distance: 2100,
    duration: 35,
    type: 'Técnica',
    notes: 'Técnica de crol',
    swimmer: 'Rosa Martínez',
    title: 'Técnica de crol',
    zone_volumes: { z1: 600, z2: 1000, z3: 500, z4: 0, z5: 0 }
  },
  {
    id: '18',
    date: new Date(Date.now() - 1468800000).toISOString(), // Hace 17 días
    distance: 3800,
    duration: 62,
    type: 'Resistencia',
    notes: 'Fondo largo',
    swimmer: 'Alberto Sánchez',
    title: 'Fondo de 3.8km',
    zone_volumes: { z1: 800, z2: 2500, z3: 500, z4: 0, z5: 0 }
  },
  {
    id: '19',
    date: new Date(Date.now() - 1555200000).toISOString(), // Hace 18 días
    distance: 1700,
    duration: 30,
    type: 'Velocidad',
    notes: 'Series de 50m',
    swimmer: 'Cristina Díaz',
    title: 'Series de 50m',
    zone_volumes: { z1: 100, z2: 200, z3: 400, z4: 700, z5: 300 }
  },
  {
    id: '20',
    date: new Date(Date.now() - 1641600000).toISOString(), // Hace 19 días
    distance: 2600,
    duration: 44,
    type: 'Técnica',
    notes: 'Técnica de mariposa',
    swimmer: 'Jorge Muñoz',
    title: 'Técnica de mariposa',
    zone_volumes: { z1: 500, z2: 1200, z3: 700, z4: 200, z5: 0 }
  },
  {
    id: '21',
    date: new Date(Date.now() - 1728000000).toISOString(), // Hace 20 días
    distance: 3200,
    duration: 52,
    type: 'Entrenamiento',
    notes: 'Combinado de resistencia',
    swimmer: 'Mónica Rodríguez',
    title: 'Resistencia combinada',
    zone_volumes: { z1: 600, z2: 1800, z3: 600, z4: 200, z5: 0 }
  },
  {
    id: '22',
    date: new Date(Date.now() - 1814400000).toISOString(), // Hace 21 días
    distance: 1900,
    duration: 32,
    type: 'Velocidad',
    notes: 'Series de 200m',
    swimmer: 'Pablo Jiménez',
    title: 'Series de 200m',
    zone_volumes: { z1: 100, z2: 300, z3: 600, z4: 700, z5: 200 }
  },
  {
    id: '23',
    date: new Date(Date.now() - 1900800000).toISOString(), // Hace 22 días
    distance: 2400,
    duration: 40,
    type: 'Técnica',
    notes: 'Técnica de espalda',
    swimmer: 'Natalia Fernández',
    title: 'Técnica de espalda',
    zone_volumes: { z1: 700, z2: 1200, z3: 500, z4: 0, z5: 0 }
  },
  {
    id: '24',
    date: new Date(Date.now() - 1987200000).toISOString(), // Hace 23 días
    distance: 2900,
    duration: 47,
    type: 'Resistencia',
    notes: 'Fondo de 2.9km',
    swimmer: 'Héctor Vargas',
    title: 'Fondo de resistencia',
    zone_volumes: { z1: 700, z2: 1800, z3: 400, z4: 0, z5: 0 }
  },
  {
    id: '25',
    date: new Date(Date.now() - 2073600000).toISOString(), // Hace 24 días
    distance: 1800,
    duration: 30,
    type: 'Velocidad',
    notes: 'Series de 100m',
    swimmer: 'Silvia Moreno',
    title: 'Series de 100m',
    zone_volumes: { z1: 50, z2: 200, z3: 500, z4: 700, z5: 350 }
  },
  {
    id: '26',
    date: new Date(Date.now() - 2160000000).toISOString(), // Hace 25 días
    distance: 3300,
    duration: 55,
    type: 'Entrenamiento',
    notes: 'Combinado de técnicas',
    swimmer: 'Raúl Castillo',
    title: 'Combinado 4 estilos',
    zone_volumes: { z1: 500, z2: 1600, z3: 800, z4: 300, z5: 100 }
  },
  {
    id: '27',
    date: new Date(Date.now() - 2246400000).toISOString(), // Hace 26 días
    distance: 2200,
    duration: 37,
    type: 'Técnica',
    notes: 'Técnica de braza',
    swimmer: 'Beatriz Ramos',
    title: 'Técnica de braza',
    zone_volumes: { z1: 600, z2: 1100, z3: 500, z4: 0, z5: 0 }
  },
  {
    id: '28',
    date: new Date(Date.now() - 2332800000).toISOString(), // Hace 27 días
    distance: 3700,
    duration: 60,
    type: 'Resistencia',
    notes: 'Fondo largo',
    swimmer: 'Víctor Ortega',
    title: 'Fondo de 3.7km',
    zone_volumes: { z1: 800, z2: 2400, z3: 500, z4: 0, z5: 0 }
  },
  {
    id: '29',
    date: new Date(Date.now() - 2419200000).toISOString(), // Hace 28 días
    distance: 1600,
    duration: 28,
    type: 'Velocidad',
    notes: 'Series de 50m',
    swimmer: 'Lorena Peña',
    title: 'Series de 50m',
    zone_volumes: { z1: 100, z2: 200, z3: 400, z4: 600, z5: 300 }
  },
  {
    id: '30',
    date: new Date(Date.now() - 2505600000).toISOString(), // Hace 29 días
    distance: 2500,
    duration: 42,
    type: 'Técnica',
    notes: 'Técnica de crol',
    swimmer: 'Óscar Delgado',
    title: 'Técnica de crol',
    zone_volumes: { z1: 600, z2: 1200, z3: 700, z4: 0, z5: 0 }
  },
  {
    id: '31',
    date: new Date(Date.now() - 2592000000).toISOString(), // Hace 30 días
    distance: 3000,
    duration: 50,
    type: 'Entrenamiento',
    notes: 'Combinado de resistencia',
    swimmer: 'Eva Cabrera',
    title: 'Resistencia combinada',
    zone_volumes: { z1: 500, z2: 1700, z3: 600, z4: 200, z5: 0 }
  }
];

// Datos de demo para las fases de entrenamiento
const demoPhases = [
  {
    id: '1',
    name: 'Base',
    description: 'Fase de construcción de base aeróbica',
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // Hace 14 días
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // En 7 días
    duration: 3,
    color: 'bg-green-500',
    intensity: 'Media',
    focus: 'Resistencia aeróbica'
  },
  {
    id: '2',
    name: 'Construcción',
    description: 'Fase de aumento de intensidad',
    startDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // En 8 días
    endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(), // En 28 días
    duration: 3,
    color: 'bg-blue-500',
    intensity: 'Alta',
    focus: 'Velocidad y potencia'
  },
  {
    id: '3',
    name: 'Pico',
    description: 'Fase de máxima intensidad',
    startDate: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(), // En 29 días
    endDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString(), // En 42 días
    duration: 2,
    color: 'bg-red-500',
    intensity: 'Máxima',
    focus: 'Competencia'
  }
];

// Datos de demo para eventos del calendario
const demoEvents = [
  {
    id: '1',
    title: 'Entrenamiento matutino',
    date: new Date().toISOString(),
    type: 'training',
    description: 'Sesión de técnica y resistencia',
    time: '07:00',
    duration: 60
  },
  {
    id: '2',
    title: 'Competición local',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // En 7 días
    type: 'competition',
    description: 'Campeonato regional de natación',
    time: '10:00',
    duration: 180
  },
  {
    id: '3',
    title: 'Entrenamiento de velocidad',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // En 2 días
    type: 'training',
    description: 'Series de velocidad y técnica',
    time: '18:00',
    duration: 90
  },
  {
    id: '4',
    title: 'Reunión de equipo',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // En 3 días
    type: 'meeting',
    description: 'Planificación de la próxima fase',
    time: '19:00',
    duration: 60
  },
  {
    id: '5',
    title: 'Entrenamiento de fondo',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // En 5 días
    type: 'training',
    description: 'Fondo de resistencia larga',
    time: '08:00',
    duration: 120
  }
];

// Datos de demo para el horario semanal
const demoWeeklySchedule = [
  {
    id: '1',
    day: 'Lunes',
    sessions: [
      { time: '07:00', type: 'Técnica', duration: 60, pool: 'Piscina A' },
      { time: '18:00', type: 'Velocidad', duration: 45, pool: 'Piscina B' }
    ]
  },
  {
    id: '2',
    day: 'Martes',
    sessions: [
      { time: '07:00', type: 'Resistencia', duration: 90, pool: 'Piscina A' }
    ]
  },
  {
    id: '3',
    day: 'Miércoles',
    sessions: [
      { time: '07:00', type: 'Técnica', duration: 60, pool: 'Piscina A' },
      { time: '18:00', type: 'Velocidad', duration: 45, pool: 'Piscina B' }
    ]
  },
  {
    id: '4',
    day: 'Jueves',
    sessions: [
      { time: '07:00', type: 'Resistencia', duration: 90, pool: 'Piscina A' }
    ]
  },
  {
    id: '5',
    day: 'Viernes',
    sessions: [
      { time: '07:00', type: 'Técnica', duration: 60, pool: 'Piscina A' },
      { time: '18:00', type: 'Velocidad', duration: 45, pool: 'Piscina B' }
    ]
  },
  {
    id: '6',
    day: 'Sábado',
    sessions: [
      { time: '09:00', type: 'Fondo', duration: 120, pool: 'Piscina A' }
    ]
  },
  {
    id: '7',
    day: 'Domingo',
    sessions: [
      { time: '10:00', type: 'Recuperación', duration: 45, pool: 'Piscina A' }
    ]
  }
];

// Datos de demo para métricas adicionales
const demoMetrics = {
  totalDistance: 87500, // metros totales
  totalSessions: 31,
  averageDistance: 2822, // metros por sesión
  totalDuration: 1395, // minutos totales
  averageDuration: 45, // minutos por sesión
  weeklyDistance: 18750, // metros esta semana
  monthlyDistance: 75000, // metros este mes
  yearlyDistance: 87500, // metros este año
  zoneDistribution: {
    z1: 35, // porcentaje
    z2: 40,
    z3: 15,
    z4: 8,
    z5: 2
  },
  improvementRate: 12.5, // porcentaje de mejora
  consistencyScore: 85, // puntuación de consistencia
  nextGoal: '50km este mes',
  currentStreak: 7 // días consecutivos
};

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const { setSessions } = useSessionsStore();
  const { setPhases } = useTrainingStore();

  useEffect(() => {
    // Cargar datos de demo
    setSessions(demoSessions);
    setPhases(demoPhases);
    
    // También podríamos cargar otros datos si fuera necesario
    // setEvents(demoEvents);
    // setWeeklySchedule(demoWeeklySchedule);
    // setMetrics(demoMetrics);
  }, [setSessions, setPhases]);

  return <>{children}</>;
}
