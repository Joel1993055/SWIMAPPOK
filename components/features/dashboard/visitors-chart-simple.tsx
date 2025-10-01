'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { useSessionsData } from '@/core/hooks/use-sessions-data';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

// Simple zone colors
const zoneColors = {
  Z1: '#3b82f6', // Blue
  Z2: '#10b981', // Green
  Z3: '#f59e0b', // Yellow
  Z4: '#ef4444', // Red
  Z5: '#8b5cf6', // Purple
};

// Chart configuration for shadcn
const chartConfig = {
  Z1: { label: 'Zone 1', color: '#3b82f6' },
  Z2: { label: 'Zone 2', color: '#10b981' },
  Z3: { label: 'Zone 3', color: '#f59e0b' },
  Z4: { label: 'Zone 4', color: '#ef4444' },
  Z5: { label: 'Zone 5', color: '#8b5cf6' },
} satisfies ChartConfig;

export function VisitorsChartSimple() {
  const { sessions, isLoading } = useSessionsData();
  
  console.log('VisitorsChartSimple - Sessions:', sessions.length);
  console.log('VisitorsChartSimple - Sample session:', sessions[0]);

  // Generate simple weekly data
  const generateSimpleData = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(today.getDate() - daysToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return Array.from({ length: 7 }, (_, index) => {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + index);

      const dayName = daysOfWeek[index];
      const daySessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate.toDateString() === currentDay.toDateString();
      });

      console.log(`${dayName} - Sessions:`, daySessions.length);

      const dayZones = { Z1: 0, Z2: 0, Z3: 0, Z4: 0, Z5: 0 };

      daySessions.forEach(session => {
        console.log('Session zone_volumes:', session.zone_volumes);
        if (session.zone_volumes) {
          dayZones.Z1 += session.zone_volumes.z1 || 0;
          dayZones.Z2 += session.zone_volumes.z2 || 0;
          dayZones.Z3 += session.zone_volumes.z3 || 0;
          dayZones.Z4 += session.zone_volumes.z4 || 0;
          dayZones.Z5 += session.zone_volumes.z5 || 0;
        }
      });

      const totalMeters = Object.values(dayZones).reduce((sum, m) => sum + m, 0);

      return {
        day: dayName,
        Z1: Math.round((dayZones.Z1 / 1000) * 10) / 10,
        Z2: Math.round((dayZones.Z2 / 1000) * 10) / 10,
        Z3: Math.round((dayZones.Z3 / 1000) * 10) / 10,
        Z4: Math.round((dayZones.Z4 / 1000) * 10) / 10,
        Z5: Math.round((dayZones.Z5 / 1000) * 10) / 10,
        totalMeters,
      };
    });
  };

  const chartData = generateSimpleData();
  console.log('VisitorsChartSimple - Chart data:', chartData);

  // Check if we have any data
  const hasData = chartData.some(day => 
    day.Z1 > 0 || day.Z2 > 0 || day.Z3 > 0 || day.Z4 > 0 || day.Z5 > 0
  );

  // If no data, use sample data
  const finalData = hasData ? chartData : [
    { day: 'Mon', Z1: 0.5, Z2: 0.3, Z3: 0.2, Z4: 0.1, Z5: 0.0 },
    { day: 'Tue', Z1: 0.8, Z2: 0.4, Z3: 0.3, Z4: 0.2, Z5: 0.1 },
    { day: 'Wed', Z1: 0.2, Z2: 0.6, Z3: 0.4, Z4: 0.3, Z5: 0.2 },
    { day: 'Thu', Z1: 0.6, Z2: 0.3, Z3: 0.5, Z4: 0.4, Z5: 0.3 },
    { day: 'Fri', Z1: 0.4, Z2: 0.5, Z3: 0.3, Z4: 0.2, Z5: 0.1 },
    { day: 'Sat', Z1: 0.7, Z2: 0.2, Z3: 0.4, Z4: 0.3, Z5: 0.2 },
    { day: 'Sun', Z1: 0.3, Z2: 0.4, Z3: 0.2, Z4: 0.1, Z5: 0.0 },
  ];

  console.log('VisitorsChartSimple - Final data:', finalData);

  const totalWeekly = finalData.reduce(
    (total, day) => total + day.Z1 + day.Z2 + day.Z3 + day.Z4 + day.Z5,
    0
  );

  const dailyAverage = Math.round(totalWeekly / 7);
  
  // Count sessions only from current week
  const currentWeekSessions = chartData.filter(day => 
    day.Z1 > 0 || day.Z2 > 0 || day.Z3 > 0 || day.Z4 > 0 || day.Z5 > 0
  ).length;
  
  console.log('VisitorsChartSimple - Session count:', {
    totalSessions: sessions.length,
    currentWeekSessions,
    chartDataWithSessions: chartData.filter(day => 
      day.Z1 > 0 || day.Z2 > 0 || day.Z3 > 0 || day.Z4 > 0 || day.Z5 > 0
    ),
  });

  if (isLoading) {
    return (
      <Card className='col-span-4 bg-muted/50 border-muted'>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Weekly Progress</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Distance by training zones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[300px] flex items-center justify-center'>
            <div className='animate-pulse text-muted-foreground'>
              Loading data...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='col-span-4 bg-muted/50 border-muted'>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Weekly Progress</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Distance by training zones
            </CardDescription>
          </div>
        </div>
      </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={finalData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) => `${value}km`}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="Z1"
                stackId="a"
                fill="#3b82f6"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="Z2"
                stackId="a"
                fill="#10b981"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="Z3"
                stackId="a"
                fill="#f59e0b"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="Z4"
                stackId="a"
                fill="#ef4444"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="Z5"
                stackId="a"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
          
          {/* Stats inside CardContent like other KPIs */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">{totalWeekly.toFixed(1)}km</div>
              <div className="text-xs text-muted-foreground">Total Distance</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">{dailyAverage.toFixed(1)}km</div>
              <div className="text-xs text-muted-foreground">Daily Average</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">{currentWeekSessions}</div>
              <div className="text-xs text-muted-foreground">Sessions</div>
            </div>
          </div>
        </CardContent>
    </Card>
  );
}
