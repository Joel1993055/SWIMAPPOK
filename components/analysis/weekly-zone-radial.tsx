'use client';

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { chartConfig as baseChartConfig } from '@/configs/chart';
import type { Session } from '@/infra/config/actions/sessions';
import { addDays } from 'date-fns';
import { PolarGrid, RadialBar, RadialBarChart } from 'recharts';

interface WeeklyZoneRadialProps {
  sessions: Session[];
  weekStart: Date;
}

interface ZoneData {
  zone: string;
  volume: number; // percentage for radial chart
  volumeKm: number; // actual km for legend
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
    label: 'Volume (km)',
  },
  z1: {
    label: 'Zone 1',
    color: 'var(--chart-1)',
  },
  z2: {
    label: 'Zone 2', 
    color: 'var(--chart-2)',
  },
  z3: {
    label: 'Zone 3',
    color: 'var(--chart-3)',
  },
  z4: {
    label: 'Zone 4',
    color: 'var(--chart-4)',
  },
  z5: {
    label: 'Zone 5',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig;

export function WeeklyZoneRadial({ sessions, weekStart }: WeeklyZoneRadialProps) {
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
        volume: (volume / totalVolume) * 100, // Use percentage for radial chart
        volumeKm: volume / 1000, // actual km for legend
        percentage: (volume / totalVolume) * 100,
        fill: ZONE_COLORS[zone as keyof typeof ZONE_COLORS] || 'var(--chart-1)',
      });
    }
  });

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

  return (
    <div className="flex gap-4 h-64">
      {/* Radial Chart */}
      <div className="flex-1">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <RadialBarChart data={zoneData} innerRadius={40} outerRadius={100}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                hideLabel 
                nameKey="zone"
                formatter={(value, name, props) => [
                  `${props.payload?.volumeKm?.toFixed(1)}km`,
                  'Volume'
                ]}
              />}
            />
            <PolarGrid gridType="circle" />
            <RadialBar dataKey="volume" />
          </RadialBarChart>
        </ChartContainer>
      </div>
      
      {/* Legend */}
      <div className="flex flex-col justify-center space-y-2 min-w-[120px]">
        {zoneData.map((zone) => (
          <div key={zone.zone} className="flex items-center gap-2 text-xs">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: zone.fill }}
            />
            <div className="flex flex-col">
              <span className="font-medium">{zone.zone}</span>
              <span className="text-muted-foreground">
                {zone.percentage.toFixed(1)}% • {zone.volumeKm.toFixed(1)}km
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}