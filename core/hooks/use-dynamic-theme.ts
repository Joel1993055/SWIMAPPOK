'use client';

import { useTheme } from '@/core/contexts/theme-context';

// =====================================================
// HOOK PARA USAR TEMA DINÁMICO EN CHARTS
// =====================================================

export function useDynamicTheme() {
  const { theme, isLoading } = useTheme();

  // Configuración de chart compatible con Chart.js y Recharts
  const chartConfig = {
    colors: {
      zones: theme.colors.zones,
      background: 'rgba(255, 255, 255, 0.1)',
      text: {
        primary: '#1f2937', // text-gray-900
        secondary: '#6b7280', // text-gray-500
      },
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: '#6b7280', // text-gray-500
          },
        },
        tooltip: {
          titleColor: '#1f2937', // text-gray-900
          bodyColor: '#1f2937', // text-gray-900
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#e5e7eb', // border-gray-200
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#6b7280', // text-gray-500
          },
          grid: {
            color: '#e5e7eb', // border-gray-200
          },
        },
        y: {
          ticks: {
            color: '#6b7280', // text-gray-500
          },
          grid: {
            color: '#e5e7eb', // border-gray-200
          },
        },
      },
    },
  };

  // Configuración específica para cada zona
  const zoneConfig = {
    Z1: {
      label: theme.zones.Z1.name,
      color: theme.colors.zones[0],
      hex: theme.zones.Z1.hex,
    },
    Z2: {
      label: theme.zones.Z2.name,
      color: theme.colors.zones[1],
      hex: theme.zones.Z2.hex,
    },
    Z3: {
      label: theme.zones.Z3.name,
      color: theme.colors.zones[2],
      hex: theme.zones.Z3.hex,
    },
    Z4: {
      label: theme.zones.Z4.name,
      color: theme.colors.zones[3],
      hex: theme.zones.Z4.hex,
    },
    Z5: {
      label: theme.zones.Z5.name,
      color: theme.colors.zones[4],
      hex: theme.zones.Z5.hex,
    },
  };

  return {
    theme,
    chartConfig,
    zoneConfig,
    isLoading,
    // Utilidades
    getZoneColor: (zone: keyof typeof theme.zones) => theme.zones[zone].hex,
    getZoneName: (zone: keyof typeof theme.zones) => theme.zones[zone].name,
    getZoneConfig: (zone: keyof typeof theme.zones) => zoneConfig[zone],
  };
}

export default useDynamicTheme;
