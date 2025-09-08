// Sistema unificado de detección de zonas de entrenamiento

export type ZoneType = 'Z1' | 'Z2' | 'Z3' | 'Z4' | 'Z5';

export interface ZoneData {
  Z1: number;
  Z2: number;
  Z3: number;
  Z4: number;
  Z5: number;
}

// Función para detectar zona basada en RPE (sistema principal)
export function detectZoneFromSession(session: {
  rpe?: number;
  type?: string;
  distance?: number;
}): ZoneType {
  const rpe = session.rpe || 0;

  // Detección basada en RPE (escala 1-10) - Sistema principal
  if (rpe <= 3) return 'Z1';
  if (rpe >= 4 && rpe <= 5) return 'Z2';
  if (rpe >= 6 && rpe <= 7) return 'Z3';
  if (rpe >= 8 && rpe <= 9) return 'Z4';
  if (rpe >= 10) return 'Z5';

  // Si no hay RPE, usar Z2 como default (zona aeróbica base)
  return 'Z2';
}

// Función para calcular volúmenes por zona desde sesiones
export function calculateZoneVolumes(
  sessions: Array<{ rpe?: number; type?: string; distance?: number }>
): ZoneData {
  const zones: ZoneData = {
    Z1: 0,
    Z2: 0,
    Z3: 0,
    Z4: 0,
    Z5: 0,
  };

  sessions.forEach(session => {
    const zone = detectZoneFromSession(session);
    const distance = session.distance || 0;
    zones[zone] += distance;
  });

  return zones;
}

// Función para convertir metros a kilómetros
export function metersToKm(meters: number): number {
  return Math.round((meters / 1000) * 10) / 10; // 1 decimal
}

// Configuración estándar de colores para zonas
export const zoneColors = {
  Z1: 'hsl(var(--chart-1))', // Verde claro
  Z2: 'hsl(var(--chart-2))', // Azul
  Z3: 'hsl(var(--chart-3))', // Amarillo
  Z4: 'hsl(var(--chart-4))', // Naranja
  Z5: 'hsl(var(--chart-5))', // Rojo
};

// Configuración estándar de etiquetas para zonas
export const zoneLabels = {
  Z1: 'Z1 - Recuperación',
  Z2: 'Z2 - Aeróbico',
  Z3: 'Z3 - Tempo',
  Z4: 'Z4 - Velocidad',
  Z5: 'Z5 - VO2 Max',
};
