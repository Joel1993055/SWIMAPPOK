'use client';

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import type { Session } from '@/infra/config/actions/sessions';
import { addDays, subWeeks } from 'date-fns';
import { memo, useMemo } from 'react';
import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Line,
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

const chartConfig = {
  distance: {
    label: "Distance (km)",
    color: "hsl(var(--primary))",
  },
  sessions: {
    label: "Sessions Count",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

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
      
      const totalDistance = weekSessions.reduce((sum, s) => sum + (s.distance || 0), 0) / 1000; // Convert to km
      
      weeks.push({
        weekNumber: weeksCount - i,
        startDate: weekStart,
        endDate: weekEnd,
        totalDistance,
        sessionCount: weekSessions.length,
        avgRPE: 0, // Keep for interface compatibility
        weekLabel: `Week ${weeksCount - i}`,
      });
    }
    
    return weeks;
  }, [weeksCount, sessions]);

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

  // Calculate totals
  const totalDistance = weeklyData.reduce((sum, week) => sum + week.totalDistance, 0);
  const totalSessions = weeklyData.reduce((sum, week) => sum + week.sessionCount, 0);

  return (
    <div className="space-y-6">
      <ChartContainer config={chartConfig} className="h-96 w-full">
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
            axisLine={false}
          />
          <YAxis 
            yAxisId="distance"
            orientation="left"
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => `${value.toFixed(1)}km`}
            axisLine={false}
          />
          <YAxis 
            yAxisId="sessions"
            orientation="right"
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          
          {/* Distance Bar */}
          <Bar 
            yAxisId="distance"
            dataKey="totalDistance" 
            name="Distance (km)"
            fill="var(--color-distance)"
            opacity={0.8}
            radius={[2, 2, 0, 0]}
          />
          
          {/* Sessions Line */}
          <Line 
            yAxisId="sessions"
            type="monotone"
            dataKey="sessionCount" 
            name="Sessions Count"
            stroke="var(--color-sessions)"
            strokeWidth={2}
            dot={{ fill: 'var(--color-sessions)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'var(--color-sessions)', strokeWidth: 2 }}
          />
        </ComposedChart>
      </ChartContainer>
      
      {/* Stats below legend */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="space-y-1">
          <div className="text-2xl font-bold text-foreground">{totalDistance.toFixed(1)}km</div>
          <div className="text-xs text-muted-foreground">Total Distance</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-foreground">{totalSessions}</div>
          <div className="text-xs text-muted-foreground">Total Sessions</div>
        </div>
      </div>
    </div>
  );
});