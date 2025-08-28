import { Session } from './types/session';
import { startOfYear, endOfYear, eachMonthOfInterval, eachWeekOfInterval, format, isWithinInterval } from 'date-fns';

export interface Aggregations {
  totalDistance: number;
  avgDistance: number;
  totalSessions: number;
  techniquePercentage: number;
  sessionsPerStroke: Record<string, number>;
  minutesPerType: Record<string, number>;
  distanceByWeek: Array<{ week: string; distance: number }>;
  distanceByMonth: Array<{ month: string; distance: number; sessions: number }>;
}

export interface FilteredAggregations extends Aggregations {
  filteredSessions: Session[];
  dateRange: { start: string; end: string };
}

export function getAggregations(sessions: Session[]): Aggregations {
  const totalDistance = sessions.reduce((sum, session) => sum + session.distance, 0);
  const avgDistance = Math.round(totalDistance / sessions.length) || 0;
  const totalSessions = sessions.length;
  
  const techniqueSessions = sessions.filter(s => s.sessionType === 'technique').length;
  const techniquePercentage = Math.round((techniqueSessions / totalSessions) * 100) || 0;
  
  const sessionsPerStroke = sessions.reduce((acc, session) => {
    acc[session.stroke] = (acc[session.stroke] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const minutesPerType = sessions.reduce((acc, session) => {
    acc[session.sessionType] = (acc[session.sessionType] || 0) + session.durationMin;
    return acc;
  }, {} as Record<string, number>);
  
  // Datos semanales para el gráfico existente
  const distanceByWeek = [
    { week: "Semana 1", distance: 3500 },
    { week: "Semana 2", distance: 4200 },
    { week: "Semana 3", distance: 3800 },
    { week: "Semana 4", distance: 4500 }
  ];

  // Datos mensuales para el calendario
  const currentYear = new Date().getFullYear();
  const yearStart = startOfYear(new Date(currentYear, 0, 1));
  const yearEnd = endOfYear(new Date(currentYear, 11, 31));
  
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });
  const distanceByMonth = months.map(month => {
    const monthStr = format(month, 'yyyy-MM');
    const monthSessions = sessions.filter(s => s.date.startsWith(monthStr));
    const monthDistance = monthSessions.reduce((sum, s) => sum + s.distance, 0);
    
    return {
      month: format(month, 'MMM yyyy'),
      distance: monthDistance,
      sessions: monthSessions.length
    };
  });
  
  return {
    totalDistance,
    avgDistance,
    totalSessions,
    techniquePercentage,
    sessionsPerStroke,
    minutesPerType,
    distanceByWeek,
    distanceByMonth
  };
}

export function getFilteredAggregations(
  sessions: Session[], 
  startDate: string, 
  endDate: string
): FilteredAggregations {
  const filteredSessions = sessions.filter(session => 
    session.date >= startDate && session.date <= endDate
  );
  
  const baseAggregations = getAggregations(filteredSessions);
  
  return {
    ...baseAggregations,
    filteredSessions,
    dateRange: { start: startDate, end: endDate }
  };
}

export function getDistanceHeatmapByDay(sessions: Session[], year: number): Record<string, number> {
  const heatmap: Record<string, number> = {};
  
  sessions.forEach(session => {
    if (session.date.startsWith(year.toString())) {
      heatmap[session.date] = (heatmap[session.date] || 0) + session.distance;
    }
  });
  
  return heatmap;
}

export function getSessionsPerWeek(sessions: Session[], year: number) {
  const yearStart = startOfYear(new Date(year, 0, 1));
  const yearEnd = endOfYear(new Date(year, 11, 31));
  
  const weeks = eachWeekOfInterval({ start: yearStart, end: yearEnd });
  
  return weeks.map(weekStart => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const weekSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return isWithinInterval(sessionDate, { start: weekStart, end: weekEnd });
    });
    
    const weekDistance = weekSessions.reduce((sum, s) => sum + s.distance, 0);
    
    return {
      week: format(weekStart, 'yyyy-MM-dd'),
      label: `Semana ${format(weekStart, 'w')}`,
      distance: weekDistance,
      sessions: weekSessions.length
    };
  });
}

export function getSessionsPerMonth(sessions: Session[], year: number) {
  const yearStart = startOfYear(new Date(year, 0, 1));
  const yearEnd = endOfYear(new Date(year, 11, 31));
  
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });
  
  return months.map(month => {
    const monthStr = format(month, 'yyyy-MM');
    const monthSessions = sessions.filter(s => s.date.startsWith(monthStr));
    const monthDistance = monthSessions.reduce((sum, s) => sum + s.distance, 0);
    
    return {
      month: format(month, 'yyyy-MM'),
      label: format(month, 'MMM yyyy'),
      distance: monthDistance,
      sessions: monthSessions.length
    };
  });
}
