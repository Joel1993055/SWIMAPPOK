'use client';

import type { Session } from '@/infra/config/actions/sessions';
import { addDays } from 'date-fns';

interface WeeklyZoneKPIsProps {
  sessions: Session[];
  weekStart: Date;
  hoveredDay?: Date | null;
}

interface ZoneData {
  zone: string;
  volume: number;
  volumeKm: number;
  percentage: number;
  color: string;
}

const ZONE_COLORS = {
  z1: '#6b7280', // Gray-blue
  z2: '#6b7280', // Gray-green
  z3: '#6b7280', // Gray-yellow
  z4: '#6b7280', // Gray-red
  z5: '#6b7280', // Gray-purple
};

const ZONE_ACCENT_COLORS = {
  z1: '#3b82f6', // Blue accent
  z2: '#10b981', // Green accent
  z3: '#f59e0b', // Yellow accent
  z4: '#ef4444', // Red accent
  z5: '#8b5cf6', // Purple accent
};

const ZONE_LABELS = {
  z1: 'Zone 1',
  z2: 'Zone 2',
  z3: 'Zone 3',
  z4: 'Zone 4',
  z5: 'Zone 5',
};

export function WeeklyZoneKPIs({ sessions, weekStart, hoveredDay }: WeeklyZoneKPIsProps) {
  // Calculate zone distribution for the week or specific day
  const weekEnd = addDays(weekStart, 6);
  
  // Filter sessions based on hovered day or entire week
  const targetSessions = hoveredDay 
    ? sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate.toDateString() === hoveredDay.toDateString();
      })
    : sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      });

  const zoneVolumes: { [key: string]: number } = {};
  
  targetSessions.forEach(session => {
    if (session.zone_volumes) {
      Object.entries(session.zone_volumes).forEach(([zone, distance]) => {
        zoneVolumes[zone] = (zoneVolumes[zone] || 0) + distance;
      });
    }
  });

  const totalVolume = Object.values(zoneVolumes).reduce((sum, vol) => sum + vol, 0);
  
  // Create data for all 5 zones, even if they have 0 volume
  const zoneData: ZoneData[] = ['z1', 'z2', 'z3', 'z4', 'z5'].map(zone => {
    const volume = zoneVolumes[zone] || 0;
    const hasData = volume > 0;
    return {
      zone: zone.toUpperCase(),
      volume: volume,
      volumeKm: volume / 1000,
      percentage: totalVolume > 0 ? (volume / totalVolume) * 100 : 0,
      color: hasData ? ZONE_ACCENT_COLORS[zone as keyof typeof ZONE_ACCENT_COLORS] : '#9ca3af',
    };
  });

  const totalKm = zoneData.reduce((sum, zone) => sum + zone.volumeKm, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">
          Zone Distribution {hoveredDay ? `- ${hoveredDay.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}` : ''}
        </h4>
        <div className="text-xs text-muted-foreground">
          {targetSessions.length} sessions • {totalKm.toFixed(1)}km total
        </div>
      </div>
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="grid grid-cols-5 gap-3 max-w-sm">
          {zoneData.map((zone) => (
          <div
            key={zone.zone}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 ${
              zone.volumeKm > 0 
                ? 'border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800' 
                : 'border-gray-100 bg-gray-25 dark:border-gray-800 dark:bg-gray-900/30'
            }`}
          >
            {/* Zone Label */}
            <div className="text-xs font-medium mb-2 text-muted-foreground">
              {zone.zone}
            </div>
            
            {/* Volume in meters */}
            <div 
              className={`text-lg font-semibold mb-1 ${
                zone.volumeKm > 0 ? 'text-foreground' : 'text-muted-foreground'
              }`}
              style={{ color: zone.volumeKm > 0 ? zone.color : undefined }}
            >
              {zone.volumeKm > 0 ? zone.volumeKm.toFixed(1) : '0.0'}
            </div>
            
            {/* Unit */}
            <div className="text-xs text-muted-foreground mb-2">km</div>
            
            {/* Percentage */}
            <div 
              className={`text-xs font-medium ${
                zone.volumeKm > 0 ? 'text-foreground' : 'text-muted-foreground'
              }`}
              style={{ color: zone.volumeKm > 0 ? zone.color : undefined }}
            >
              {zone.percentage.toFixed(1)}%
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
