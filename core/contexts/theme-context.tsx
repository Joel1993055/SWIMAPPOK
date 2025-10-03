'use client';

import { theme as defaultTheme } from '@/configs/theme';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// =====================================================
// TIPOS PARA EL CONTEXTO DINÁMICO
// =====================================================

export interface DynamicZoneConfig {
  name: string;
  hex: string;
  bg: string;
  text: string;
  border: string;
  description: string;
}

export interface DynamicTheme {
  zones: {
    Z1: DynamicZoneConfig;
    Z2: DynamicZoneConfig;
    Z3: DynamicZoneConfig;
    Z4: DynamicZoneConfig;
    Z5: DynamicZoneConfig;
  };
  colors: {
    zones: string[];
  };
}

interface ThemeContextType {
  theme: DynamicTheme;
  updateZoneName: (zone: keyof DynamicTheme['zones'], name: string) => void;
  updateZoneColor: (zone: keyof DynamicTheme['zones'], hex: string) => void;
  resetToDefault: () => void;
  isLoading: boolean;
}

// =====================================================
// CONTEXTO
// =====================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// =====================================================
// HOOK PERSONALIZADO
// =====================================================

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// =====================================================
// PROVIDER COMPONENT
// =====================================================

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<DynamicTheme>(() => {
    // Inicializar con tema por defecto
    return {
      zones: {
        Z1: { ...defaultTheme.zones.Z1 },
        Z2: { ...defaultTheme.zones.Z2 },
        Z3: { ...defaultTheme.zones.Z3 },
        Z4: { ...defaultTheme.zones.Z4 },
        Z5: { ...defaultTheme.zones.Z5 },
      },
      colors: {
        zones: [
          defaultTheme.zones.Z1.hex,
          defaultTheme.zones.Z2.hex,
          defaultTheme.zones.Z3.hex,
          defaultTheme.zones.Z4.hex,
          defaultTheme.zones.Z5.hex,
        ],
      },
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  // Cargar configuración guardada al inicializar
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        setIsLoading(true);
        const savedTheme = localStorage.getItem('swim-app-theme');
        if (savedTheme) {
          const parsedTheme = JSON.parse(savedTheme);
          setTheme(parsedTheme);
        }
      } catch (error) {
        console.error('Error loading saved theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedTheme();
  }, []);

  // Guardar configuración cuando cambie
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('swim-app-theme', JSON.stringify(theme));
    }
  }, [theme, isLoading]);

  const updateZoneName = (zone: keyof DynamicTheme['zones'], name: string) => {
    setTheme(prev => ({
      ...prev,
      zones: {
        ...prev.zones,
        [zone]: {
          ...prev.zones[zone],
          name,
        },
      },
    }));
  };

  const updateZoneColor = (zone: keyof DynamicTheme['zones'], hex: string) => {
    // Actualizar el color de la zona
    const updatedTheme = {
      ...theme,
      zones: {
        ...theme.zones,
        [zone]: {
          ...theme.zones[zone],
          hex,
          bg: `bg-${getColorClass(hex)}-500`,
          text: `text-${getColorClass(hex)}-700`,
          border: `border-${getColorClass(hex)}-500`,
        },
      },
    };

    // Actualizar el array de colores para charts
    const zoneIndex = parseInt(zone.slice(1)) - 1; // Z1 -> 0, Z2 -> 1, etc.
    const newColors = [...updatedTheme.colors.zones];
    newColors[zoneIndex] = hex;

    setTheme({
      ...updatedTheme,
      colors: {
        zones: newColors,
      },
    });
  };

  const resetToDefault = () => {
    setTheme({
      zones: {
        Z1: { ...defaultTheme.zones.Z1 },
        Z2: { ...defaultTheme.zones.Z2 },
        Z3: { ...defaultTheme.zones.Z3 },
        Z4: { ...defaultTheme.zones.Z4 },
        Z5: { ...defaultTheme.zones.Z5 },
      },
      colors: {
        zones: [
          defaultTheme.zones.Z1.hex,
          defaultTheme.zones.Z2.hex,
          defaultTheme.zones.Z3.hex,
          defaultTheme.zones.Z4.hex,
          defaultTheme.zones.Z5.hex,
        ],
      },
    });
  };

  const value: ThemeContextType = {
    theme,
    updateZoneName,
    updateZoneColor,
    resetToDefault,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// =====================================================
// UTILIDADES
// =====================================================

function getColorClass(hex: string): string {
  // Mapear colores hex a clases de Tailwind
  const colorMap: Record<string, string> = {
    '#10b981': 'green',
    '#3b82f6': 'blue',
    '#eab308': 'yellow',
    '#f97316': 'orange',
    '#ef4444': 'red',
    '#8b5cf6': 'purple',
    '#06b6d4': 'cyan',
    '#84cc16': 'lime',
    '#f59e0b': 'amber',
    '#ec4899': 'pink',
  };

  return colorMap[hex] || 'gray';
}

// =====================================================
// EXPORTS
// =====================================================

export default ThemeProvider;
