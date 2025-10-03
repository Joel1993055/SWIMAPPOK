'use client';

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { chartConfig as baseChartConfig } from '@/configs/chart';
import type { Session } from '@/infra/config/actions/sessions';
import { addDays } from 'date-fns';

interface WeeklyZoneHorizontalBarProps {
  sessions: Session[];
  weekStart: Date;
}

interface ZoneData {
  zone: string;
  volume: number;
  volumeKm: number;
  percentage: number;
  fill: string;
}

// Colores de zonas usando configuración centralizada
const ZONE_COLORS = {
  z1: baseChartConfig.colors.zones[0], // Verde - Recovery
  z2: baseChartConfig.colors.zones[1], // Azul - Aerobic Base
  z3: baseChartConfig.colors.zones[2], // Amarillo - Aerobic Threshold
  z4: baseChartConfig.colors.zones[3], // Naranja - VO2 Max
  z5: baseChartConfig.colors.zones[4], // Rojo - Neuromuscular
};

const chartConfig = {
  volume: {
    label: "Volume (km)",
    color: "var(--chart-1)",
  },
  z1: {
    label: "Zone 1",
    color: "var(--chart-1)",
  },
  z2: {
    label: "Zone 2",
    color: "var(--chart-2)",
  },
  z3: {
    label: "Zone 3",
    color: "var(--chart-3)",
  },
  z4: {
    label: "Zone 4",
    color: "var(--chart-4)",
  },
  z5: {
    label: "Zone 5",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function WeeklyZoneHorizontalBar({ sessions, weekStart }: WeeklyZoneHorizontalBarProps) {
  // Calculate zone distribution for the week
  const zoneData: ZoneData[] = [];
  const weekEnd = addDays(weekStart, 6);
  
  const weekSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= weekStart && sessionDate <= weekEnd;
  });

  const zoneVolumes: { [key: string]: number } = {};
  
  weekSessions.forEach(session => {
    if (session.zone_volumes) {
      Object.entries(session.zone_volumes).forEach(([zone, distance]) => {
        zoneVolumes[zone] = (zoneVolumes[zone] || 0) + distance;
      });
    }
  });

  const totalVolume = Object.values(zoneVolumes).reduce((sum, vol) => sum + vol, 0);
  
  Object.entries(zoneVolumes).forEach(([zone, volume]) => {
    if (volume > 0) {
      zoneData.push({
        zone: zone.toUpperCase(),
        volume: volume / 1000, // Convert to km for display
        volumeKm: volume / 1000,
        percentage: (volume / totalVolume) * 100,
        fill: ZONE_COLORS[zone as keyof typeof ZONE_COLORS] || 'var(--chart-1)',
      });
    }
  });

  // Sort zones by volume (highest first)
  zoneData.sort((a, b) => b.volume - a.volume);

  if (zoneData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-sm">No zone data</p>
          <p className="text-xs">Record zone volumes</p>
        </div>
      </div>
    );
  }

  const totalKm = zoneData.reduce((sum, zone) => sum + zone.volumeKm, 0);
  const avgPercentage = zoneData.length > 0 ? zoneData.reduce((sum, zone) => sum + zone.percentage, 0) / zoneData.length : 0;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Zone Distribution</CardTitle>
        <CardDescription className="text-xs">
          {weekSessions.length} sessions • {totalKm.toFixed(1)}km total
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <ChartContainer config={chartConfig} className="h-48">
          <BarChart
            accessibilityLayer
            data={zoneData}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <XAxis type="number" dataKey="volume" hide />
            <YAxis
              dataKey="zone"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                hideLabel 
                formatter={(value, name, props) => [
                  `${props.payload?.volumeKm?.toFixed(1)}km (${props.payload?.percentage?.toFixed(1)}%)`,
                  'Volume'
                ]}
              />}
            />
            <Bar 
              dataKey="volume" 
              fill={(entry: any) => entry.fill}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-xs pt-2">
        <div className="flex gap-2 leading-none font-medium">
          {zoneData.length} zones active <TrendingUp className="h-3 w-3" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing zone distribution for this week
        </div>
      </CardFooter>
    </Card>
  );
}