'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Session } from '@/infra/config/actions/sessions';
import { addDays, format, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowDown, ArrowUp, BarChart3, Minus, TrendingUp } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import { WeeklyBarChart } from './weekly-bar-chart';
import { WeeklyDailyChart } from './weekly-daily-chart';
import { WeeklyZoneKPIs } from './weekly-zone-kpis';

interface WeeklyData {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  sessions: Session[];
  totalDistance: number;
  sessionCount: number;
  avgRPE: number;
  zoneDistribution: ZoneDistribution[];
}

interface ZoneDistribution {
  zone: string;
  distance: number;
  percentage: number;
  color: string;
}

interface WeeklyComparisonProps {
  sessions: Session[];
}

const ZONE_COLORS = {
  z1: '#3b82f6', // Blue
  z2: '#10b981', // Green
  z3: '#f59e0b', // Yellow
  z4: '#ef4444', // Red
  z5: '#8b5cf6', // Purple
};

export const WeeklyComparison = memo(function WeeklyComparison({ sessions }: WeeklyComparisonProps) {
  const [weeksCount, setWeeksCount] = useState(4);
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  // Calcular distribución de zonas
  const calculateZoneDistribution = (weekSessions: Session[]): ZoneDistribution[] => {
    const zoneData: { [key: string]: number } = {};
    
    weekSessions.forEach(session => {
      if (session.zone_volumes) {
        Object.entries(session.zone_volumes).forEach(([zone, distance]) => {
          zoneData[zone] = (zoneData[zone] || 0) + distance;
        });
      }
    });

    const totalDistance = Object.values(zoneData).reduce((sum, dist) => sum + dist, 0);
    
    return Object.entries(zoneData)
      .map(([zone, distance]) => ({
        zone: zone.toUpperCase(),
        distance,
        percentage: totalDistance > 0 ? (distance / totalDistance) * 100 : 0,
        color: ZONE_COLORS[zone as keyof typeof ZONE_COLORS] || '#6b7280',
      }))
      .sort((a, b) => a.zone.localeCompare(b.zone));
  };

  // Agrupar sesiones por semana
  const weeklyData = useMemo(() => {
    const weeks: WeeklyData[] = [];
    const now = new Date();
    
    for (let i = weeksCount - 1; i >= 0; i--) {
      const weekStart = subWeeks(now, i);
      const weekEnd = addDays(weekStart, 6);
      
      const weekSessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      });
      
      const totalDistance = weekSessions.reduce((sum, s) => sum + (s.distance || 0), 0);
      const avgRPE = weekSessions.length > 0 
        ? weekSessions.reduce((sum, s) => sum + (s.rpe || 0), 0) / weekSessions.length 
        : 0;
      
      weeks.push({
        weekNumber: weeksCount - i,
        startDate: weekStart,
        endDate: weekEnd,
        sessions: weekSessions,
        totalDistance,
        sessionCount: weekSessions.length,
        avgRPE,
        zoneDistribution: calculateZoneDistribution(weekSessions)
      });
    }
    
    return weeks;
  }, [weeksCount, sessions]);

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Weekly Comparison</h2>
        </div>
        
        {/* Weeks selector */}
        <div className="flex gap-2">
          {[2, 4, 8, 12].map(count => (
            <Button
              key={count}
              variant={weeksCount === count ? "default" : "outline"}
              size="sm"
              onClick={() => setWeeksCount(count)}
            >
              {count} weeks
            </Button>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <Card className="bg-muted/50 border-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Weekly Comparison Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyBarChart sessions={sessions} weeksCount={weeksCount} />
        </CardContent>
      </Card>

      {/* Week by week comparison */}
      <div className="space-y-4">
        {weeklyData.map((week, index) => {
          const previousWeek = index > 0 ? weeklyData[index - 1] : null;
          const distanceChange = previousWeek 
            ? calculateChange(week.totalDistance, previousWeek.totalDistance)
            : 0;
          const sessionChange = previousWeek 
            ? calculateChange(week.sessionCount, previousWeek.sessionCount)
            : 0;

          return (
            <Card key={week.weekNumber} className="overflow-hidden bg-muted/50 border-muted">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Week {week.weekNumber}
                  </CardTitle>
                  <Badge variant="outline">
                    {format(week.startDate, 'dd/MM', { locale: es })} - {format(week.endDate, 'dd/MM', { locale: es })}
                  </Badge>
                </div>
              </CardHeader>
              
                <CardContent className="space-y-6">
                  {/* Charts Grid - Main Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Daily Volume Chart */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">Daily Volume</h4>
                        <div className="text-xs text-muted-foreground">
                          {(week.totalDistance / 1000).toFixed(1)}km total
                        </div>
                      </div>
                      <WeeklyDailyChart 
                        sessions={sessions} 
                        weekStart={week.startDate}
                        onDayHover={setHoveredDay}
                      />
                    </div>
                    
                    {/* Zone Distribution Mini KPIs */}
                    <WeeklyZoneKPIs 
                      sessions={sessions} 
                      weekStart={week.startDate}
                      hoveredDay={hoveredDay}
                    />
                  </div>

                  <Separator />

                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Distance */}
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {(week.totalDistance / 1000).toFixed(1)}km
                      </div>
                      <div className="text-sm text-muted-foreground">Total Distance</div>
                      {previousWeek && (
                        <div className={`text-xs flex items-center justify-center gap-1 mt-1 ${getChangeColor(distanceChange)}`}>
                          {getChangeIcon(distanceChange)}
                          {distanceChange >= 0 ? '+' : ''}{distanceChange.toFixed(1)}%
                        </div>
                      )}
                    </div>

                    {/* Sessions */}
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {week.sessionCount}
                      </div>
                      <div className="text-sm text-muted-foreground">Sessions</div>
                      {previousWeek && (
                        <div className={`text-xs flex items-center justify-center gap-1 mt-1 ${getChangeColor(sessionChange)}`}>
                          {getChangeIcon(sessionChange)}
                          {sessionChange >= 0 ? '+' : ''}{sessionChange.toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
});
