// =====================================================
// CHART TYPES - CONFIGURACIÓN DE GRÁFICOS
// =====================================================

export interface ChartConfig {
  // Configuración de colores
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    destructive: string;
  };
  
  // Configuración de ejes
  axes: {
    x: {
      label: string;
      type: 'category' | 'time' | 'value';
    };
    y: {
      label: string;
      type: 'value' | 'category';
      min?: number;
      max?: number;
    };
  };
  
  // Configuración de datos
  data: {
    labels: string[];
    datasets: ChartDataset[];
  };
  
  // Configuración de opciones
  options: {
    responsive: boolean;
    maintainAspectRatio: boolean;
    plugins: {
      legend: {
        display: boolean;
        position: 'top' | 'bottom' | 'left' | 'right';
      };
      tooltip: {
        enabled: boolean;
        mode: 'index' | 'point' | 'nearest' | 'dataset';
      };
    };
    scales: {
      x: {
        display: boolean;
        title: {
          display: boolean;
          text: string;
        };
      };
      y: {
        display: boolean;
        title: {
          display: boolean;
          text: string;
        };
      };
    };
  };
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      display: boolean;
      position: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip: {
      enabled: boolean;
      mode: 'index' | 'point' | 'nearest' | 'dataset';
    };
  };
  scales: {
    x: {
      display: boolean;
      title: {
        display: boolean;
        text: string;
      };
    };
    y: {
      display: boolean;
      title: {
        display: boolean;
        text: string;
      };
    };
  };
}

// Configuraciones predefinidas
export const defaultChartConfig: ChartConfig = {
  colors: {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    accent: 'hsl(var(--accent))',
    muted: 'hsl(var(--muted))',
    destructive: 'hsl(var(--destructive))',
  },
  axes: {
    x: {
      label: 'Tiempo',
      type: 'time',
    },
    y: {
      label: 'Valor',
      type: 'value',
    },
  },
  data: {
    labels: [],
    datasets: [],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
        mode: 'index',
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Tiempo',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Valor',
        },
      },
    },
  },
};

// Tipos para diferentes tipos de gráficos
export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter';

export interface LineChartConfig extends ChartConfig {
  type: 'line';
  options: ChartOptions & {
    elements: {
      line: {
        tension: number;
      };
      point: {
        radius: number;
      };
    };
  };
}

export interface BarChartConfig extends ChartConfig {
  type: 'bar';
  options: ChartOptions & {
    elements: {
      bar: {
        borderRadius: number;
      };
    };
  };
}

export interface PieChartConfig extends ChartConfig {
  type: 'pie';
  options: ChartOptions & {
    cutout: number;
  };
}

// Utilidades para crear configuraciones
export function createLineChartConfig(
  data: ChartData,
  options?: Partial<ChartOptions>
): LineChartConfig {
  return {
    ...defaultChartConfig,
    type: 'line',
    data,
    options: {
      ...defaultChartConfig.options,
      ...options,
      elements: {
        line: {
          tension: 0.4,
        },
        point: {
          radius: 4,
        },
      },
    },
  };
}

export function createBarChartConfig(
  data: ChartData,
  options?: Partial<ChartOptions>
): BarChartConfig {
  return {
    ...defaultChartConfig,
    type: 'bar',
    data,
    options: {
      ...defaultChartConfig.options,
      ...options,
      elements: {
        bar: {
          borderRadius: 4,
        },
      },
    },
  };
}

export function createPieChartConfig(
  data: ChartData,
  options?: Partial<ChartOptions>
): PieChartConfig {
  return {
    ...defaultChartConfig,
    type: 'pie',
    data,
    options: {
      ...defaultChartConfig.options,
      ...options,
      cutout: 0,
    },
  };
}
