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
    color: "#3b82f6",
  },
  sessions: {
    label: "Sessions Count",
    color: "#10b981",
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

  // Calculate totals
  const totalDistance = weeklyData.reduce((sum, week) => sum + week.totalDistance, 0);
  const totalSessions = weeklyData.reduce((sum, week) => sum + week.sessionCount, 0);

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <ComposedChart accessibilityLayer data={weeklyData}>
        <CartesianGrid vertical={false} />
        <XAxis 
          dataKey="weekLabel" 
          tickLine={false} 
          tickMargin={10} 
          axisLine={false} 
        />
        <YAxis
          yAxisId="distance"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) => `${value.toFixed(1)}km`}
        />
        <YAxis
          yAxisId="sessions"
          orientation="right"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar 
          yAxisId="distance"
          dataKey="totalDistance" 
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
        />
        <Line 
          yAxisId="sessions"
          type="monotone"
          dataKey="sessionCount" 
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </ComposedChart>
    </ChartContainer>
  );
});