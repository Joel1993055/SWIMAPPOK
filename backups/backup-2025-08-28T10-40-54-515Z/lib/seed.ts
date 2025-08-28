import { Session } from "./types/session";

export const sessions: Session[] = [
  {
    id: "1",
    date: "2024-01-15",
    swimmer: "María García",
    distance: 2000,
    durationMin: 45,
    stroke: "freestyle",
    sessionType: "aerobic",
    mainSet: "10x200m @2:30",
    RPE: 7
  },
  {
    id: "2",
    date: "2024-01-16",
    swimmer: "Carlos López",
    distance: 1500,
    durationMin: 35,
    stroke: "butterfly",
    sessionType: "technique",
    mainSet: "8x100m fly @1:45",
    RPE: 8
  },
  {
    id: "3",
    date: "2024-01-17",
    swimmer: "Ana Martínez",
    distance: 3000,
    durationMin: 60,
    stroke: "freestyle",
    sessionType: "aerobic",
    mainSet: "3x1000m @15:00",
    RPE: 6
  },
  {
    id: "4",
    date: "2024-01-18",
    swimmer: "Luis Rodríguez",
    distance: 1200,
    durationMin: 30,
    stroke: "backstroke",
    sessionType: "technique",
    mainSet: "6x200m back @4:00",
    RPE: 7
  },
  {
    id: "5",
    date: "2024-01-19",
    swimmer: "Sofia Herrera",
    distance: 2500,
    durationMin: 50,
    stroke: "breaststroke",
    sessionType: "aerobic",
    mainSet: "5x500m breast @8:00",
    RPE: 6
  },
  {
    id: "6",
    date: "2024-01-20",
    swimmer: "Diego Silva",
    distance: 1800,
    durationMin: 40,
    stroke: "freestyle",
    sessionType: "technique",
    mainSet: "9x200m free @2:15",
    RPE: 8
  },
  {
    id: "7",
    date: "2024-01-21",
    swimmer: "Valentina Torres",
    distance: 2200,
    durationMin: 48,
    stroke: "butterfly",
    sessionType: "aerobic",
    mainSet: "11x200m fly @2:00",
    RPE: 7
  },
  {
    id: "8",
    date: "2024-01-22",
    swimmer: "Mateo Vargas",
    distance: 1600,
    durationMin: 38,
    stroke: "backstroke",
    sessionType: "technique",
    mainSet: "8x200m back @3:45",
    RPE: 6
  },
  {
    id: "9",
    date: "2024-01-23",
    swimmer: "Isabella Morales",
    distance: 2800,
    durationMin: 55,
    stroke: "freestyle",
    sessionType: "aerobic",
    mainSet: "4x700m free @12:00",
    RPE: 5
  },
  {
    id: "10",
    date: "2024-01-24",
    swimmer: "Sebastián Castro",
    distance: 1400,
    durationMin: 32,
    stroke: "breaststroke",
    sessionType: "technique",
    mainSet: "7x200m breast @3:30",
    RPE: 8
  },
  {
    id: "11",
    date: "2024-01-25",
    swimmer: "Camila Rojas",
    distance: 2400,
    durationMin: 52,
    stroke: "freestyle",
    sessionType: "aerobic",
    mainSet: "6x400m free @6:30",
    RPE: 6
  },
  {
    id: "12",
    date: "2024-01-26",
    swimmer: "Nicolás Mendoza",
    distance: 1700,
    durationMin: 42,
    stroke: "butterfly",
    sessionType: "technique",
    mainSet: "8x200m fly @1:50",
    RPE: 7
  }
];

export function getSeedData(): Session[] {
  return sessions;
}

export interface Aggregations {
  totalDistance: number;
  avgDistance: number;
  totalSessions: number;
  techniquePercentage: number;
  sessionsPerStroke: Record<string, number>;
  minutesPerType: Record<string, number>;
  distanceByWeek: Array<{ week: string; distance: number }>;
}

export function getAggregations(sessions: Session[]): Aggregations {
  const totalDistance = sessions.reduce((sum, session) => sum + session.distance, 0);
  const avgDistance = Math.round(totalDistance / sessions.length);
  const totalSessions = sessions.length;
  
  const techniqueSessions = sessions.filter(s => s.sessionType === 'technique').length;
  const techniquePercentage = Math.round((techniqueSessions / totalSessions) * 100);
  
  const sessionsPerStroke = sessions.reduce((acc, session) => {
    acc[session.stroke] = (acc[session.stroke] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const minutesPerType = sessions.reduce((acc, session) => {
    acc[session.sessionType] = (acc[session.sessionType] || 0) + session.durationMin;
    return acc;
  }, {} as Record<string, number>);
  
  // Simular datos semanales para el gráfico
  const distanceByWeek = [
    { week: "Semana 1", distance: 3500 },
    { week: "Semana 2", distance: 4200 },
    { week: "Semana 3", distance: 3800 },
    { week: "Semana 4", distance: 4500 }
  ];
  
  return {
    totalDistance,
    avgDistance,
    totalSessions,
    techniquePercentage,
    sessionsPerStroke,
    minutesPerType,
    distanceByWeek
  };
}
