'use client';

import type { Session } from '@/infra/config/actions/sessions';
import { addDays, subWeeks } from 'date-fns';
import { memo, useMemo } from 'react';
import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

interface WeeklyBarChartProps {
  sessions: Session[];
  weeksCount: number;
}

interface WeeklyData {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  totalDistance: number;
  sessionCount: number;
  avgRPE: number;
  weekLabel: string;
}

export const WeeklyBarChart = memo(function WeeklyBarChart({ sessions, weeksCount }: WeeklyBarChartProps) {
  // Calcular datos semanales
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
        totalDistance,
        sessionCount: weekSessions.length,
        avgRPE,
        weekLabel: `S${weeksCount - i}`,
      });
    }
    
    return weeks;
  }, [weeksCount, sessions]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Distance (km)' ? `${(entry.value / 1000).toFixed(1)}km` : 
                           entry.name === 'Sessions' ? `${entry.value}` : 
                           `${entry.value.toFixed(1)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (weeklyData.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-muted/50 rounded-lg">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">No data available</p>
          <p className="text-sm">Add training sessions to see weekly comparison</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={weeklyData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="weekLabel" 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              yAxisId="distance"
              orientation="left"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(1)}km`}
            />
            <YAxis 
              yAxisId="sessions"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Distance Bar */}
            <Bar 
              yAxisId="distance"
              dataKey="totalDistance" 
              name="Distance (km)"
              fill="hsl(var(--primary))"
              opacity={0.8}
              radius={[2, 2, 0, 0]}
            />
            
            {/* Sessions Line */}
            <Line 
              yAxisId="sessions"
              type="monotone" 
              dataKey="sessionCount" 
              name="Sessions"
              stroke="hsl(var(--chart-2))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(var(--chart-2))', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* Statistical Summary */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="font-semibold text-primary">
            {(weeklyData.reduce((sum, week) => sum + week.totalDistance, 0) / 1000).toFixed(1)}km
          </div>
          <div className="text-muted-foreground">Total Distance</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-primary">
            {weeklyData.reduce((sum, week) => sum + week.sessionCount, 0)}
          </div>
          <div className="text-muted-foreground">Total Sessions</div>
        </div>
      </div>
    </div>
  );
});
