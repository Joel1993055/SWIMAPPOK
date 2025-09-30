'use client';

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import type { Session } from '@/infra/config/actions/sessions';
import { addDays } from 'date-fns';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

interface WeeklyDailyChartProps {
  sessions: Session[];
  weekStart: Date;
}

interface DailyData {
  day: string;
  dayShort: string;
  volume: number;
  sessions: number;
  zones: { [key: string]: number };
}

const chartConfig = {
  volume: {
    label: 'Volume (km)',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function WeeklyDailyChart({ sessions, weekStart }: WeeklyDailyChartProps) {
  // Calculate daily data for the week
  const dailyData: DailyData[] = [];
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayNamesShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  for (let i = 0; i < 7; i++) {
    const dayDate = addDays(weekStart, i);
    const daySessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.toDateString() === dayDate.toDateString();
    });

    const totalVolume = daySessions.reduce((sum, s) => sum + (s.distance || 0), 0);
    
    // Calculate zone distribution for this day
    const zones: { [key: string]: number } = {};
    daySessions.forEach(session => {
      if (session.zone_volumes) {
        Object.entries(session.zone_volumes).forEach(([zone, distance]) => {
          zones[zone] = (zones[zone] || 0) + distance;
        });
      }
    });
    
    dailyData.push({
      day: dayNames[i],
      dayShort: dayNamesShort[i],
      volume: totalVolume / 1000, // Convert to km
      sessions: daySessions.length,
      zones,
    });
  }

  return (
    <div className="space-y-2">
      <ChartContainer config={chartConfig} className="h-56 w-full">
        <BarChart data={dailyData} width="100%" height="100%">
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="dayShort"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip 
            content={<ChartTooltipContent 
              formatter={(value, name) => [
                name === 'volume' ? `${value}km` : value,
                name === 'volume' ? 'Volume' : 'Sessions'
              ]}
            />} 
          />
          <Bar
            dataKey="volume"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
      
      {/* Daily totals */}
      <div className="flex justify-center text-xs px-4">
        <div className="flex justify-between w-full max-w-3xl">
          {dailyData.map((day) => (
            <div key={day.dayShort} className="flex flex-col items-center justify-center w-28">
              <div className="font-medium text-foreground">
                {day.volume.toFixed(1)}km
              </div>
              <div className="flex gap-1 mt-1 justify-center">
                {day.sessions > 0 && Array.from({ length: Math.min(day.sessions, 3) }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1.5 h-1.5 bg-primary rounded-full"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
