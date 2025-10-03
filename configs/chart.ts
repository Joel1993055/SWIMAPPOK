// =====================================================
// CONFIGURACIÓN CENTRALIZADA DE CHARTS - SWIM APP PRO
// =====================================================

import { theme } from './theme';

// =====================================================
// CONFIGURACIÓN BASE DE CHARTS
// =====================================================

export const chartConfig = {
  // Colores consistentes con el tema
  colors: {
    zones: [
      theme.zones.Z1.hex, // Verde - Recovery
      theme.zones.Z2.hex, // Azul - Aerobic Base
      theme.zones.Z3.hex, // Amarillo - Aerobic Threshold
      theme.zones.Z4.hex, // Naranja - VO2 Max
      theme.zones.Z5.hex  // Rojo - Neuromuscular
    ],
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(255, 255, 255, 0.2)',
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
      muted: '#9ca3af'
    }
  },

  // Configuración base para todos los charts
  baseOptions: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          },
          color: '#6b7280'
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          },
          color: '#6b7280'
        }
      }
    }
  },

  // Configuraciones específicas por tipo de chart
  types: {
    bar: {
      options: {
        scales: {
          x: {
            stacked: false,
            grid: { display: false }
          },
          y: {
            stacked: false,
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            }
          }
        }
      }
    },
    barStacked: {
      options: {
        scales: {
          x: {
            stacked: true,
            grid: { display: false }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            }
          }
        }
      }
    },
    line: {
      options: {
        scales: {
          x: {
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            }
          }
        }
      }
    },
    area: {
      options: {
        scales: {
          x: {
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            }
          }
        }
      }
    },
    radial: {
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              stepSize: 20,
              font: {
                size: 10,
                family: 'Inter, sans-serif'
              }
            }
          }
        }
      }
    }
  }
} as const;

// =====================================================
// CONFIGURACIONES ESPECÍFICAS PARA SWIM APP
// =====================================================

export const swimChartConfigs = {
  // Chart de distribución de zonas
  zoneDistribution: {
    type: 'doughnut' as const,
    options: {
      ...chartConfig.baseOptions,
      plugins: {
        ...chartConfig.baseOptions.plugins,
        legend: {
          ...chartConfig.baseOptions.plugins.legend,
          position: 'bottom' as const
        }
      },
      cutout: '60%'
    }
  },

  // Chart de progreso semanal
  weeklyProgress: {
    type: 'bar' as const,
    options: {
      ...chartConfig.baseOptions,
      ...chartConfig.types.bar.options,
      plugins: {
        ...chartConfig.baseOptions.plugins,
        title: {
          display: true,
          text: 'Progreso Semanal',
          font: {
            size: 16,
            weight: 'bold' as const,
            family: 'Inter, sans-serif'
          },
          color: '#1f2937'
        }
      }
    }
  },

  // Chart de volumen por zonas (stacked)
  zoneVolume: {
    type: 'bar' as const,
    options: {
      ...chartConfig.baseOptions,
      ...chartConfig.types.barStacked.options,
      plugins: {
        ...chartConfig.baseOptions.plugins,
        title: {
          display: true,
          text: 'Volumen por Zonas',
          font: {
            size: 16,
            weight: 'bold' as const,
            family: 'Inter, sans-serif'
          },
          color: '#1f2937'
        }
      }
    }
  },

  // Chart de tendencias (line)
  trends: {
    type: 'line' as const,
    options: {
      ...chartConfig.baseOptions,
      ...chartConfig.types.line.options,
      plugins: {
        ...chartConfig.baseOptions.plugins,
        title: {
          display: true,
          text: 'Tendencias de Rendimiento',
          font: {
            size: 16,
            weight: 'bold' as const,
            family: 'Inter, sans-serif'
          },
          color: '#1f2937'
        }
      }
    }
  },

  // Chart de métricas radiales
  radialMetrics: {
    type: 'radar' as const,
    options: {
      ...chartConfig.baseOptions,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            stepSize: 20,
            font: {
              size: 10,
              family: 'Inter, sans-serif'
            }
          }
        }
      }
    }
  }
} as const;

// =====================================================
// UTILIDADES PARA CHARTS
// =====================================================

/**
 * Combina la configuración base con configuraciones específicas
 */
export function mergeChartOptions(base: any, specific: any) {
  return {
    ...base,
    ...specific,
    plugins: {
      ...base.plugins,
      ...specific.plugins
    },
    scales: {
      ...base.scales,
      ...specific.scales
    }
  };
}

/**
 * Obtiene los colores de las zonas para usar en charts
 */
export function getZoneColors() {
  return chartConfig.colors.zones;
}

/**
 * Crea un dataset con colores de zonas
 */
export function createZoneDataset(label: string, data: number[], zoneIndex: number) {
  return {
    label,
    data,
    backgroundColor: chartConfig.colors.zones[zoneIndex] + '80', // 50% opacity
    borderColor: chartConfig.colors.zones[zoneIndex],
    borderWidth: 2,
    fill: false
  };
}

/**
 * Crea un dataset para charts apilados
 */
export function createStackedDataset(label: string, data: number[], zoneIndex: number) {
  return {
    label,
    data,
    backgroundColor: chartConfig.colors.zones[zoneIndex],
    borderColor: chartConfig.colors.zones[zoneIndex],
    borderWidth: 1
  };
}

// =====================================================
// TIPOS TYPESCRIPT
// =====================================================

export type ChartType = 'bar' | 'line' | 'area' | 'doughnut' | 'radar';
export type ChartConfig = typeof chartConfig;
export type SwimChartConfig = typeof swimChartConfigs;

// =====================================================
// EXPORT DEFAULT
// =====================================================

export default chartConfig;
