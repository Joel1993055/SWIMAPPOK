'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Session } from '@/infra/config/actions/sessions';
import { addDays, format, subWeeks } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { WeeklyDailyChart } from '../analysis/weekly-daily-chart';
import { WeeklyZoneKPIs } from '../analysis/weekly-zone-kpis';

interface WeekDetailProps {
  week: any; // MacrocycleWeek
  onClose: () => void;
}

export function WeekDetail({ week, onClose }: WeekDetailProps) {
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  // Calculate week data exactly like weekly-comparison
  const weekData = useMemo(() => {
    const now = new Date();
    const weeksFromNow = 16 - week.week; // Assuming 16 weeks total
    const weekStart = subWeeks(now, weeksFromNow);
    const weekEnd = addDays(weekStart, 6);

    // Use demo sessions for this specific week
    const demoSessions: Session[] = [
      {
        id: '1',
        date: weekStart.toISOString(),
        distance: 3000,
        duration: 60,
        rpe: 6,
        zone_volumes: { z1: 1000, z2: 1500, z3: 500, z4: 0, z5: 0 },
        title: 'Training Session',
        type: 'swimming',
        location: 'Pool',
        coach: 'Coach',
        group_name: 'Group',
        objective: 'endurance',
      },
      {
        id: '2',
        date: addDays(weekStart, 1).toISOString(),
        distance: 2500,
        duration: 45,
        rpe: 7,
        zone_volumes: { z1: 500, z2: 1000, z3: 800, z4: 200, z5: 0 },
        title: 'Training Session',
        type: 'swimming',
        location: 'Pool',
        coach: 'Coach',
        group_name: 'Group',
        objective: 'endurance',
      },
      {
        id: '3',
        date: addDays(weekStart, 3).toISOString(),
        distance: 4000,
        duration: 75,
        rpe: 8,
        zone_volumes: { z1: 1000, z2: 2000, z3: 800, z4: 200, z5: 0 },
        title: 'Training Session',
        type: 'swimming',
        location: 'Pool',
        coach: 'Coach',
        group_name: 'Group',
        objective: 'endurance',
      },
    ];

    const totalDistance = demoSessions.reduce((sum, s) => sum + (s.distance || 0), 0);
    const avgRPE = demoSessions.length > 0 
      ? demoSessions.reduce((sum, s) => sum + (s.rpe || 0), 0) / demoSessions.length 
      : 0;

    return {
      weekNumber: week.week,
      startDate: weekStart,
      endDate: weekEnd,
      sessions: demoSessions,
      totalDistance,
      sessionCount: demoSessions.length,
      avgRPE,
    };
  }, [week.week]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Timeline
          </Button>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Week {week.week} Detail</h2>
          </div>
        </div>
        <Badge variant="outline">
          {format(weekData.startDate, 'MM/dd', { locale: enUS })} - {format(weekData.endDate, 'MM/dd', { locale: enUS })}
        </Badge>
      </div>

      {/* Week Card - Exact copy from weekly-comparison */}
      <Card className="overflow-hidden bg-muted/50 border-muted">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Week {weekData.weekNumber}
            </CardTitle>
            <Badge variant="outline">
              {format(weekData.startDate, 'MM/dd', { locale: enUS })} - {format(weekData.endDate, 'MM/dd', { locale: enUS })}
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
                  {(weekData.totalDistance / 1000).toFixed(1)}km total
                </div>
              </div>
              <WeeklyDailyChart 
                sessions={weekData.sessions} 
                weekStart={weekData.startDate}
                onDayHover={setHoveredDay}
              />
            </div>
            
            {/* Zone Distribution Mini KPIs */}
            <WeeklyZoneKPIs 
              sessions={weekData.sessions} 
              weekStart={weekData.startDate}
              hoveredDay={hoveredDay}
            />
          </div>

          <Separator />

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            {/* Distance */}
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {(weekData.totalDistance / 1000).toFixed(1)}km
              </div>
              <div className="text-sm text-muted-foreground">Total Distance</div>
            </div>

            {/* Sessions */}
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {weekData.sessionCount}
              </div>
              <div className="text-sm text-muted-foreground">Sessions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
