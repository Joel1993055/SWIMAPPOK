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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDynamicTheme } from '@/core/hooks/use-dynamic-theme';
import { calculateZoneVolumes, metersToKm } from '@/core/utils/zone-detection';
import { useSessions } from '@/core/stores/entities/session';
import * as React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';

// =====================================================
// GENERATE VOLUME DATA BASED ON SESSIONS
// =====================================================
const generateVolumeData = (sessions: any[], period: string) => {
  const now = new Date();

  if (period === 'month') {
    // Last 30 days
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const daySessions = sessions.filter(
        (s) => new Date(s.date).toISOString().split('T')[0] === dateString
      );
      const zoneVolumes = calculateZoneVolumes(daySessions);
      const totalDistance =
        zoneVolumes.Z1 +
        zoneVolumes.Z2 +
        zoneVolumes.Z3 +
        zoneVolumes.Z4 +
        zoneVolumes.Z5;

      days.push({
        day: date.getDate().toString(),
        Z1: metersToKm(zoneVolumes.Z1),
        Z2: metersToKm(zoneVolumes.Z2),
        Z3: metersToKm(zoneVolumes.Z3),
        Z4: metersToKm(zoneVolumes.Z4),
        Z5: metersToKm(zoneVolumes.Z5),
        total: metersToKm(totalDistance),
      });
    }
    return days;
  } else if (period === '6months') {
    // Last 6 months
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthSessions = sessions.filter((s) => {
        const sessionDate = new Date(s.date);
        return sessionDate >= monthStart && sessionDate <= monthEnd;
      });

      const zoneVolumes = calculateZoneVolumes(monthSessions);
      const totalDistance =
        zoneVolumes.Z1 +
        zoneVolumes.Z2 +
        zoneVolumes.Z3 +
        zoneVolumes.Z4 +
        zoneVolumes.Z5;

      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        Z1: metersToKm(zoneVolumes.Z1),
        Z2: metersToKm(zoneVolumes.Z2),
        Z3: metersToKm(zoneVolumes.Z3),
        Z4: metersToKm(zoneVolumes.Z4),
        Z5: metersToKm(zoneVolumes.Z5),
        total: metersToKm(totalDistance),
      });
    }
    return months;
  } else if (period === '3months') {
    // Last 3 months
    const months = [];
    for (let i = 2; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthSessions = sessions.filter((s) => {
        const sessionDate = new Date(s.date);
        return sessionDate >= monthStart && sessionDate <= monthEnd;
      });

      const zoneVolumes = calculateZoneVolumes(monthSessions);
      const totalDistance =
        zoneVolumes.Z1 +
        zoneVolumes.Z2 +
        zoneVolumes.Z3 +
        zoneVolumes.Z4 +
        zoneVolumes.Z5;

      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        Z1: metersToKm(zoneVolumes.Z1),
        Z2: metersToKm(zoneVolumes.Z2),
        Z3: metersToKm(zoneVolumes.Z3),
        Z4: metersToKm(zoneVolumes.Z4),
        Z5: metersToKm(zoneVolumes.Z5),
        total: metersToKm(totalDistance),
      });
    }
    return months;
  } else {
    // Last 12 months
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthSessions = sessions.filter((s) => {
        const sessionDate = new Date(s.date);
        return sessionDate >= monthStart && sessionDate <= monthEnd;
      });

      const zoneVolumes = calculateZoneVolumes(monthSessions);
      const totalDistance =
        zoneVolumes.Z1 +
        zoneVolumes.Z2 +
        zoneVolumes.Z3 +
        zoneVolumes.Z4 +
        zoneVolumes.Z5;

      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        Z1: metersToKm(zoneVolumes.Z1),
        Z2: metersToKm(zoneVolumes.Z2),
        Z3: metersToKm(zoneVolumes.Z3),
        Z4: metersToKm(zoneVolumes.Z4),
        Z5: metersToKm(zoneVolumes.Z5),
        total: metersToKm(totalDistance),
      });
    }
    return months;
  }
};

// =====================================================
// COMPONENT
// =====================================================
export default function VolumeBarchart() {
  const sessions = useSessions();
  const { zoneConfig, isLoading: themeLoading } = useDynamicTheme();

  const [selectedPeriod, setSelectedPeriod] = React.useState<string>('year');
  const [selectedView, setSelectedView] = React.useState<string>('all');

  // Chart configuration (uses dynamic theme)
  const chartConfig = {
    Z1: { label: zoneConfig.Z1.label, color: zoneConfig.Z1.color },
    Z2: { label: zoneConfig.Z2.label, color: zoneConfig.Z2.color },
    Z3: { label: zoneConfig.Z3.label, color: zoneConfig.Z3.color },
    Z4: { label: zoneConfig.Z4.label, color: zoneConfig.Z4.color },
    Z5: { label: zoneConfig.Z5.label, color: zoneConfig.Z5.color },
    total: { label: 'Total', color: 'hsl(15, 100%, 50%)' },
  } satisfies ChartConfig;

  const realData = generateVolumeData(sessions, selectedPeriod);
  const chartData = realData.length > 0 ? realData : [];

  const views = React.useMemo(
    () => ({
      Z1: { label: 'Z1', zones: ['Z1'], description: zoneConfig.Z1.label },
      Z2: { label: 'Z2', zones: ['Z2'], description: zoneConfig.Z2.label },
      Z3: { label: 'Z3', zones: ['Z3'], description: zoneConfig.Z3.label },
      Z4: { label: 'Z4', zones: ['Z4'], description: zoneConfig.Z4.label },
      Z5: { label: 'Z5', zones: ['Z5'], description: zoneConfig.Z5.label },
      all: {
        label: 'All',
        zones: ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'],
        description: 'All training zones',
      },
    }),
    [zoneConfig]
  );

  const totals = React.useMemo(() => {
    const result: Record<string, number> = {};
    Object.keys(chartConfig).forEach((zone) => {
      result[zone] = chartData.reduce(
        (acc, curr) =>
          acc + ((curr[zone as keyof typeof curr] as number) || 0),
        0
      );
    });
    return result;
  }, [chartData]);

  const filteredData = React.useMemo(() => {
    const selectedZones = views[selectedView as keyof typeof views].zones;
    return chartData.map((dataPoint) => {
      const xAxisKey = selectedPeriod === 'month' ? 'day' : 'month';
      const filtered: Record<string, string | number> = {
        [xAxisKey]: dataPoint[xAxisKey as keyof typeof dataPoint],
      };
      selectedZones.forEach((zone) => {
        if (dataPoint[zone as keyof typeof dataPoint] !== undefined) {
          filtered[zone] = dataPoint[zone as keyof typeof dataPoint];
        }
      });
      return filtered;
    });
  }, [selectedView, views, selectedPeriod, chartData]);

  const currentView = views[selectedView as keyof typeof views];

  if (themeLoading) {
    return (
      <Card className="bg-muted/50 border-muted">
        <CardHeader>
          <CardTitle>Total Volume Chart</CardTitle>
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
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {selectedPeriod === 'month'
                  ? '30-Day Volume'
                  : selectedPeriod === '3months'
                  ? '3-Month Volume'
                  : selectedPeriod === '6months'
                  ? '6-Month Volume'
                  : 'Annual Volume'}{' '}
                - KM
              </CardTitle>
              <CardDescription>{currentView.description}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <TabsList className="grid w-full grid-cols-4 bg-muted">
                  <TabsTrigger value="year" className="text-xs">
                    Year
                  </TabsTrigger>
                  <TabsTrigger value="6months" className="text-xs">
                    6M
                  </TabsTrigger>
                  <TabsTrigger value="3months" className="text-xs">
                    3M
                  </TabsTrigger>
                  <TabsTrigger value="month" className="text-xs">
                    30D
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Tabs value={selectedView} onValueChange={setSelectedView}>
                <TabsList className="grid w-full grid-cols-6 bg-muted">
                  <TabsTrigger value="Z1" className="text-xs">
                    Z1
                  </TabsTrigger>
                  <TabsTrigger value="Z2" className="text-xs">
                    Z2
                  </TabsTrigger>
                  <TabsTrigger value="Z3" className="text-xs">
                    Z3
                  </TabsTrigger>
                  <TabsTrigger value="Z4" className="text-xs">
                    Z4
                  </TabsTrigger>
                  <TabsTrigger value="Z5" className="text-xs">
                    Z5
                  </TabsTrigger>
                  <TabsTrigger value="all" className="text-xs">
                    All
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-wrap">
          {currentView.zones.map((zone) => {
            const config = chartConfig[zone as keyof typeof chartConfig];
            return (
              <div
                key={zone}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left"
              >
                <span className="text-xs text-muted-foreground">
                  {config.label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {totals[zone]?.toLocaleString()} KM
                </span>
              </div>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={filteredData}
            margin={{ left: 12, right: 12, top: 20, bottom: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={selectedPeriod === 'month' ? 'day' : 'month'}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  nameKey="volume"
                  labelFormatter={(value) => value}
                />
              }
            />
            <Legend />
            {currentView.zones.map((zone) => (
              <Bar
                key={zone}
                dataKey={zone}
                fill={chartConfig[zone as keyof typeof chartConfig]?.color}
                stackId="a"
                name={chartConfig[zone as keyof typeof chartConfig]?.label}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
