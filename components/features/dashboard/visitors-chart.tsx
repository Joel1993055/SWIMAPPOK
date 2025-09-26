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
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSessionsData } from '@/lib/hooks/use-sessions-data';
import { AreaChartIcon, BarChart3 } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';

// =====================================================
// OPTIMIZATION: Lazy loading for Recharts
// =====================================================
const Area = lazy(() => import('recharts').then(module => ({ default: module.Area })));
const AreaChart = lazy(() => import('recharts').then(module => ({ default: module.AreaChart })));
const Bar = lazy(() => import('recharts').then(module => ({ default: module.Bar })));
const BarChart = lazy(() => import('recharts').then(module => ({ default: module.BarChart })));
const CartesianGrid = lazy(() => import('recharts').then(module => ({ default: module.CartesianGrid })));
const XAxis = lazy(() => import('recharts').then(module => ({ default: module.XAxis })));
const YAxis = lazy(() => import('recharts').then(module => ({ default: module.YAxis })));

// =====================================================
// ZONE COLORS & LABELS
// =====================================================
const zoneColors = {
  Z1: '#3b82f6', // Blue
  Z2: '#10b981', // Green
  Z3: '#f59e0b', // Yellow
  Z4: '#ef4444', // Red
  Z5: '#8b5cf6', // Purple
};

const zoneLabels = {
  Z1: 'Z1 - Recovery',
  Z2: 'Z2 - Aerobic Base',
  Z3: 'Z3 - Aerobic Threshold',
  Z4: 'Z4 - Anaerobic Lactic',
  Z5: 'Z5 - Anaerobic Alactic',
};

// =====================================================
// HELPER: Generate current week data
// =====================================================
const generateWeeklyData = (sessions: any[]) => {
  const today = new Date();
  const startOfWeek = new Date(today);
  const dayOfWeek = today.getDay(); // 0 = Sunday
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

    const dayZones = { Z1: 0, Z2: 0, Z3: 0, Z4: 0, Z5: 0 };

    daySessions.forEach(session => {
      if (session.zone_volumes) {
        dayZones.Z1 += session.zone_volumes.z1 || 0;
        dayZones.Z2 += session.zone_volumes.z2 || 0;
        dayZones.Z3 += session.zone_volumes.z3 || 0;
        dayZones.Z4 += session.zone_volumes.z4 || 0;
        dayZones.Z5 += session.zone_volumes.z5 || 0;
      }
    });

    const totalDayMeters = Object.values(dayZones).reduce((sum, m) => sum + m, 0);

    return {
      day: dayName,
      ...Object.fromEntries(
        Object.entries(dayZones).map(([zone, meters]) => [
          zone,
          Math.round((meters / 1000) * 10) / 10,
        ])
      ),
      totalMeters: totalDayMeters,
    };
  });
};

const chartConfig: ChartConfig = {
  Z1: { label: zoneLabels.Z1, color: zoneColors.Z1 },
  Z2: { label: zoneLabels.Z2, color: zoneColors.Z2 },
  Z3: { label: zoneLabels.Z3, color: zoneColors.Z3 },
  Z4: { label: zoneLabels.Z4, color: zoneColors.Z4 },
  Z5: { label: zoneLabels.Z5, color: zoneColors.Z5 },
};

export function VisitorsChart() {
  const { sessions, isLoading } = useSessionsData();
  const [chartType, setChartType] = useState<'bar' | 'area'>('bar');

  const chartData = generateWeeklyData(sessions);
  const areaChartData = chartData.map(day => ({
    day: day.day,
    Z1: (day as any).Z1 || 0,
    Z2: (day as any).Z2 || 0,
    Z3: (day as any).Z3 || 0,
    Z4: (day as any).Z4 || 0,
    Z5: (day as any).Z5 || 0,
    totalMeters: day.totalMeters,
  }));

  const totalWeekly = chartData.reduce(
    (total, day) =>
      total +
      ((day as any).Z1 || 0) +
      ((day as any).Z2 || 0) +
      ((day as any).Z3 || 0) +
      ((day as any).Z4 || 0) +
      ((day as any).Z5 || 0),
    0
  );
  const dailyAverage = Math.round(totalWeekly / 7);

  if (isLoading) {
    return (
      <Card className='col-span-4 bg-muted/50 border-muted'>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
          <CardDescription>
            Distance by training zones (kilometers)
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

  if (sessions.length === 0) {
    return (
      <Card className='col-span-4 bg-muted/50 border-muted'>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
          <CardDescription>
            Distance by training zones (kilometers)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[300px] flex items-center justify-center'>
            <div className='text-center text-muted-foreground'>
              <div className='text-lg font-medium mb-2'>No trainings</div>
              <div className='text-sm'>
                Create your first training session to see weekly progress
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='col-span-4 bg-muted/50 border-muted'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Weekly Progress</CardTitle>
            <CardDescription>
              Distance by training zones (kilometers)
            </CardDescription>
          </div>
          <Select
            value={chartType}
            onValueChange={value => setChartType(value as 'bar' | 'area')}
          >
            <SelectTrigger className='w-40 h-8 text-xs'>
              <SelectValue>
                <div className='flex items-center gap-1.5'>
                  {chartType === 'bar' ? (
                    <>
                      <BarChart3 className='h-3.5 w-3.5' />
                      <span>Bar Chart</span>
                    </>
                  ) : (
                    <>
                      <AreaChartIcon className='h-3.5 w-3.5' />
                      <span>Area Chart</span>
                    </>
                  )}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='bar'>
                <div className='flex items-center gap-1.5'>
                  <BarChart3 className='h-3.5 w-3.5' />
                  <span>Bar Chart</span>
                </div>
              </SelectItem>
              <SelectItem value='area'>
                <div className='flex items-center gap-1.5'>
                  <AreaChartIcon className='h-3.5 w-3.5' />
                  <span>Area Chart</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* BAR CHART */}
          {chartType === 'bar' && (
            <Suspense
              fallback={
                <div className='h-[300px] flex items-center justify-center'>
                  <div className='animate-pulse text-muted-foreground'>
                    Loading chart...
                  </div>
                </div>
              }
            >
              <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey='day' tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={10} tickFormatter={v => `${v}km`} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => [
                          `${value}km`,
                          chartConfig[name as keyof typeof chartConfig]?.label || name,
                        ]}
                        labelFormatter={label => `Day: ${label}`}
                      />
                    }
                  />
                  <Bar dataKey='Z1' stackId='a' fill={zoneColors.Z1} />
                  <Bar dataKey='Z2' stackId='a' fill={zoneColors.Z2} />
                  <Bar dataKey='Z3' stackId='a' fill={zoneColors.Z3} />
                  <Bar dataKey='Z4' stackId='a' fill={zoneColors.Z4} />
                  <Bar dataKey='Z5' stackId='a' fill={zoneColors.Z5} />
                </BarChart>
              </ChartContainer>
            </Suspense>
          )}

          {/* AREA CHART */}
          {chartType === 'area' && (
            <Suspense
              fallback={
                <div className='h-[300px] flex items-center justify-center'>
                  <div className='animate-pulse text-muted-foreground'>
                    Loading chart...
                  </div>
                </div>
              }
            >
              <ChartContainer config={chartConfig}>
                <AreaChart accessibilityLayer data={areaChartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey='day' tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={10} tickFormatter={v => `${v}km`} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => [
                          `${value}km`,
                          chartConfig[name as keyof typeof chartConfig]?.label || name,
                        ]}
                        labelFormatter={label => `Day: ${label}`}
                      />
                    }
                  />
                  <Area type='monotone' dataKey='Z1' stackId='1' stroke={zoneColors.Z1} fill={zoneColors.Z1} fillOpacity={0.6} />
                  <Area type='monotone' dataKey='Z2' stackId='1' stroke={zoneColors.Z2} fill={zoneColors.Z2} fillOpacity={0.6} />
                  <Area type='monotone' dataKey='Z3' stackId='1' stroke={zoneColors.Z3} fill={zoneColors.Z3} fillOpacity={0.6} />
                  <Area type='monotone' dataKey='Z4' stackId='1' stroke={zoneColors.Z4} fill={zoneColors.Z4} fillOpacity={0.6} />
                  <Area type='monotone' dataKey='Z5' stackId='1' stroke={zoneColors.Z5} fill={zoneColors.Z5} fillOpacity={0.6} />
                </AreaChart>
              </ChartContainer>
            </Suspense>
          )}

          {/* STATS */}
          <div className='grid grid-cols-2 gap-4 pt-4 border-t'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-primary'>
                {totalWeekly.toFixed(1)}km
              </div>
              <div className='text-sm text-muted-foreground'>Weekly Total</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-primary'>
                {dailyAverage.toFixed(1)}km
              </div>
              <div className='text-sm text-muted-foreground'>Daily Average</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
