// =====================================================
// DESIGN TOKENS CENTRALIZADOS - SWIM APP PRO
// =====================================================

export const theme = {
  // Colores de zonas de entrenamiento
  zones: {
    Z1: {
      bg: 'bg-green-500',
      text: 'text-green-700',
      border: 'border-green-500',
      hex: '#10b981',
      name: 'Recovery',
      description: 'Zona de recuperación activa'
    },
    Z2: {
      bg: 'bg-blue-500',
      text: 'text-blue-700',
      border: 'border-blue-500',
      hex: '#3b82f6',
      name: 'Aerobic Base',
      description: 'Base aeróbica'
    },
    Z3: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-700',
      border: 'border-yellow-500',
      hex: '#eab308',
      name: 'Aerobic Threshold',
      description: 'Umbral aeróbico'
    },
    Z4: {
      bg: 'bg-orange-500',
      text: 'text-orange-700',
      border: 'border-orange-500',
      hex: '#f97316',
      name: 'VO2 Max',
      description: 'Máximo consumo de oxígeno'
    },
    Z5: {
      bg: 'bg-red-500',
      text: 'text-red-700',
      border: 'border-red-500',
      hex: '#ef4444',
      name: 'Neuromuscular',
      description: 'Zona neuromuscular'
    }
  },

  // Colores de componentes
  components: {
    cards: {
      background: 'bg-card',
      border: 'border-border',
      hover: 'hover:bg-muted/50',
      shadow: 'shadow-sm',
      radius: 'rounded-lg'
    },
    buttons: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input hover:bg-accent hover:text-accent-foreground'
    },
    inputs: {
      background: 'bg-background',
      border: 'border-input',
      focus: 'focus:ring-2 focus:ring-ring focus:ring-offset-2',
      disabled: 'disabled:cursor-not-allowed disabled:opacity-50'
    }
  },

  // Espaciado consistente
  spacing: {
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8'
  },

  // Tipografía
  typography: {
    headings: {
      h1: 'text-3xl font-bold tracking-tight',
      h2: 'text-2xl font-semibold tracking-tight',
      h3: 'text-xl font-semibold tracking-tight',
      h4: 'text-lg font-semibold tracking-tight'
    },
    body: {
      base: 'text-sm leading-6',
      large: 'text-base leading-7',
      small: 'text-xs leading-5'
    }
  },

  // Estados de la aplicación
  states: {
    success: {
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: 'text-green-600'
    },
    warning: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      icon: 'text-yellow-600'
    },
    error: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: 'text-red-600'
    },
    info: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      icon: 'text-blue-600'
    }
  },

  // Métricas y KPIs
  metrics: {
    positive: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: 'text-green-600'
    },
    negative: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: 'text-red-600'
    },
    neutral: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      icon: 'text-gray-600'
    }
  }
} as const;

// =====================================================
// UTILIDADES PARA USAR LOS TOKENS
// =====================================================

/**
 * Obtiene los colores de una zona específica
 */
export function getZoneColors(zone: keyof typeof theme.zones) {
  return theme.zones[zone];
}

/**
 * Obtiene los colores de un estado específico
 */
export function getStateColors(state: keyof typeof theme.states) {
  return theme.states[state];
}

/**
 * Obtiene los colores de una métrica específica
 */
export function getMetricColors(metric: keyof typeof theme.metrics) {
  return theme.metrics[metric];
}

/**
 * Combina clases de Tailwind de forma segura
 */
export function combineClasses(...classes: (string | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// =====================================================
// TIPOS TYPESCRIPT PARA LOS TOKENS
// =====================================================

export type ZoneKey = keyof typeof theme.zones;
export type StateKey = keyof typeof theme.states;
export type MetricKey = keyof typeof theme.metrics;
export type SpacingKey = keyof typeof theme.spacing;

// =====================================================
// EXPORT DEFAULT PARA IMPORTS SIMPLES
// =====================================================

export default theme;
