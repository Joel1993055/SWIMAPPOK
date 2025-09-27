// Unified training zone detection system

export type ZoneType = 'Z1' | 'Z2' | 'Z3' | 'Z4' | 'Z5';

export interface ZoneData {
  Z1: number;
  Z2: number;
  Z3: number;
  Z4: number;
  Z5: number;
}

// Function to detect zone based on RPE (main system)
export function detectZoneFromSession(session: {
  rpe?: number;
  type?: string;
  distance?: number;
}): ZoneType {
  const rpe = session.rpe || 0;

  // RPE-based detection (scale 1-10) - Main system
  if (rpe <= 3) return 'Z1';
  if (rpe >= 4 && rpe <= 5) return 'Z2';
  if (rpe >= 6 && rpe <= 7) return 'Z3';
  if (rpe >= 8 && rpe <= 9) return 'Z4';
  if (rpe >= 10) return 'Z5';

  // If no RPE, use Z2 as default (aerobic base zone)
  return 'Z2';
}

// Function to calculate zone volumes from sessions
export function calculateZoneVolumes(
  sessions: Array<{ 
    rpe?: number; 
    type?: string; 
    distance?: number;
    zone_volumes?: {
      z1?: number;
      z2?: number;
      z3?: number;
      z4?: number;
      z5?: number;
    };
  }>
): ZoneData {
  const zones: ZoneData = {
    Z1: 0,
    Z2: 0,
    Z3: 0,
    Z4: 0,
    Z5: 0,
  };

  sessions.forEach(session => {
    // If there's saved zone_volumes data, use it directly
    if (session.zone_volumes) {
      zones.Z1 += session.zone_volumes.z1 || 0;
      zones.Z2 += session.zone_volumes.z2 || 0;
      zones.Z3 += session.zone_volumes.z3 || 0;
      zones.Z4 += session.zone_volumes.z4 || 0;
      zones.Z5 += session.zone_volumes.z5 || 0;
    } else {
      // Fallback: usar detección por RPE si no hay zone_volumes
      const zone = detectZoneFromSession(session);
      const distance = session.distance || 0;
      zones[zone] += distance;
    }
  });

  return zones;
}

// Function to convert meters to kilometers
export function metersToKm(meters: number): number {
  return Math.round((meters / 1000) * 10) / 10; // 1 decimal
}

// Standard color configuration for zones
export const zoneColors = {
  Z1: 'hsl(var(--chart-1))', // Light green
  Z2: 'hsl(var(--chart-2))', // Blue
  Z3: 'hsl(var(--chart-3))', // Yellow
  Z4: 'hsl(var(--chart-4))', // Orange
  Z5: 'hsl(var(--chart-5))', // Red
};

// Standard label configuration for zones
export const zoneLabels = {
  Z1: 'Z1 - Recovery',
  Z2: 'Z2 - Aerobic',
  Z3: 'Z3 - Tempo',
  Z4: 'Z4 - Speed',
  Z5: 'Z5 - VO2 Max',
};
