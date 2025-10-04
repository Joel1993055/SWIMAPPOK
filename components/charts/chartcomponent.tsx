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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { chartConfig as baseChartConfig } from '@/configs/chart';
import { theme } from '@/configs/theme';
import { useSessions } from '@/core/stores/entities/session'; // ✅ nuevo store Supabase
import {
  calculateZoneVolumes,
  metersToKm,
} from '@/core/utils/zone-detection';
import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

// Genera datos reales a partir de sesiones
const generateRealData = (sessions: any[], period: string) => {
  const now = new Date();

  if (period === '7days') {
    const days: any[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const daySessions = sessions.filter((s) => s.date === dateString);
      const zoneVolumes = calculateZoneVolumes(daySessions);

      days.push({
        date: dateString,
        Z1: metersToKm(zoneVolumes.Z1),
        Z2: metersToKm(zoneVolumes.Z2),
        Z3: metersToKm(zoneVolumes.Z3),
        Z4: metersToKm(zoneVolumes.Z4),
        Z5: metersToKm(zoneVolumes.Z5),
      });
    }
    return days;
  } else if (period === '30days') {
    const days: any[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const daySessions = sessions.filter((s) => s.date === dateString);
      const zoneVolumes = calculateZoneVolumes(daySessions);

      days.push({
        date: dateString,
        Z1: metersToKm(zoneVolumes.Z1),
        Z2: metersToKm(zoneVolumes.Z2),
        Z3: metersToKm(zoneVolumes.Z3),
        Z4: metersToKm(zoneVolumes.Z4),
        Z5: metersToKm(zoneVolumes.Z5),
      });
    }
    return days;
  } else {
    // Year view → agrupar por mes
    const months: any[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthSessions = sessions.filter((s) => {
        const sessionDate = new Date(s.date);
        return sessionDate >= monthStart && sessionDate <= monthEnd;
      });

      const zoneVolumes = calculateZoneVolumes(monthSessions);

      months.push({
        date: date.toISOString().split('T')[0],
        Z1: metersToKm(zoneVolumes.Z1),
        Z2: metersToKm(zoneVolumes.Z2),
        Z3: metersToKm(zoneVolumes.Z3),
        Z4: metersToKm(zoneVolumes.Z4),
        Z5: metersToKm(zoneVolumes.Z5),
      });
    }
    return months;
  }
};

// Configuración de colores desde theme central
const chartConfig = {
  Z1: { label: theme.zones.Z1.name, color: baseChartConfig.colors.zones[0] },
  Z2: { label: theme.zones.Z2.name, color: baseChartConfig.colors.zones[1] },
  Z3: { label: theme.zones.Z3.name, color: baseChartConfig.colors.zones[2] },
  Z4: { label: theme.zones.Z4.name, color: baseChartConfig.colors.zones[3] },
  Z5: { label: theme.zones.Z5.name, color: baseChartConfig.colors.zones[4] },
} satisfies ChartConfig;

export default function ZoneChart() {
  const sessions = useSessions(); // ✅ Supabase data desde la nueva store
  const [timeRange, setTimeRange] = useState('30days');

  // Procesar datos de sesiones
  const chartData = useMemo(() => {
    if (!sessions || sessions.length === 0) return [];
    return generateRealData(sessions, timeRange);
  }, [sessions, timeRange]);

  // Loading state
  if (!sessions) {
    return (
      <Card className="bg-muted/50 border-muted">
        <CardHeader>
          <CardTitle>Zone Distribution</CardTitle>
          <CardDescription>Training volume by intensity zones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">
              Loading data...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-muted/50 border-muted">
      <CardHeader className="flex items-center gap-2 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>
            {timeRange === '7days'
              ? '7-Day Volume'
              : timeRange === '30days'
              ? '30-Day Volume'
              : 'Annual Volume'}{' '}
            - Zone Distribution
          </CardTitle>
          <CardDescription>
            {timeRange === 'year'
              ? 'Whole year'
              : timeRange === '30days'
              ? 'Last 30 days'
              : 'Last 7 days'}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a range"
          >
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="year" className="rounded-lg">
              Whole year
            </SelectItem>
            <SelectItem value="30days" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7days" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData}>
            <defs>
              {Object.keys(chartConfig).map((zone) => (
                <linearGradient
                  key={zone}
                  id={`fill${zone}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                <stop
                    offset="5%"
                    stopColor={`var(--color-${zone})`}
                  stopOpacity={0.8}
                />
                <stop
                    offset="95%"
                    stopColor={`var(--color-${zone})`}
                  stopOpacity={0.1}
                />
              </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  indicator="dot"
                />
              }
            />
            {Object.keys(chartConfig).map((zone) => (
            <Area
                key={zone}
                dataKey={zone}
                type="natural"
                fill={`url(#fill${zone})`}
                stroke={`var(--color-${zone})`}
                stackId="a"
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
