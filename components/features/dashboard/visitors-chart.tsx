'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Session } from '@/lib/actions/sessions';
import { getSessions } from '@/lib/actions/sessions';
import { ChartConfig } from '@/lib/types/chart';
import { AreaChartIcon, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

// Colores para las zonas de intensidad
const zoneColors = {
  Z1: '#3b82f6', // Azul
  Z2: '#10b981', // Verde
  Z3: '#f59e0b', // Amarillo
  Z4: '#ef4444', // Rojo
  Z5: '#8b5cf6', // Púrpura
};

// Etiquetas para las zonas
const zoneLabels = {
  Z1: 'Z1 - Recuperación',
  Z2: 'Z2 - Aeróbico Base',
  Z3: 'Z3 - Aeróbico Umbral',
  Z4: 'Z4 - Anaeróbico Láctico',
  Z5: 'Z5 - Anaeróbico Aláctico',
};

// Función para generar datos de la semana actual
const generateWeeklyData = (sessions: Session[]) => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Domingo
  startOfWeek.setHours(0, 0, 0, 0);

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  return Array.from({ length: 7 }, (_, index) => {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + index);
    
    const dayName = daysOfWeek[index];
    
    // Filtrar sesiones del día actual
    const daySessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.toDateString() === currentDay.toDateString();
    });

    // Calcular metros por zona para el día
    const dayZones = {
      Z1: 0,
      Z2: 0,
      Z3: 0,
      Z4: 0,
      Z5: 0,
    };

    daySessions.forEach(session => {
      if (session.zone_volumes) {
        dayZones.Z1 += session.zone_volumes.z1 || 0;
        dayZones.Z2 += session.zone_volumes.z2 || 0;
        dayZones.Z3 += session.zone_volumes.z3 || 0;
        dayZones.Z4 += session.zone_volumes.z4 || 0;
        dayZones.Z5 += session.zone_volumes.z5 || 0;
      }
    });

    // Convertir metros a kilómetros
    const totalDayMeters = Object.values(dayZones).reduce((sum, meters) => sum + meters, 0);

    return {
      day: dayName,
      ...Object.fromEntries(
        Object.entries(dayZones).map(([zone, meters]) => [zone, Math.round(meters / 1000 * 10) / 10])
      ),
      totalMeters: totalDayMeters,
    };
  });
};

const chartConfig = {
  Z1: {
    label: zoneLabels.Z1,
    color: zoneColors.Z1,
  },
  Z2: {
    label: zoneLabels.Z2,
    color: zoneColors.Z2,
  },
  Z3: {
    label: zoneLabels.Z3,
    color: zoneColors.Z3,
  },
  Z4: {
    label: zoneLabels.Z4,
    color: zoneColors.Z4,
  },
  Z5: {
    label: zoneLabels.Z5,
    color: zoneColors.Z5,
  },
} satisfies ChartConfig;

// Usar la misma configuración que el gráfico de barras
const areaChartConfig = chartConfig;

export function VisitorsChart() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartType, setChartType] = useState<'bar' | 'area'>('bar');

  // Cargar sesiones reales desde Supabase
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await getSessions();
        setSessions(data);
      } catch (error) {
        console.error('Error cargando sesiones:', error);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  // Generar datos de la semana actual
  const chartData = generateWeeklyData(sessions);

  // Generar datos para el área chart (con todas las zonas)
  const areaChartData = chartData.map(day => ({
    day: day.day,
    Z1: day.Z1,
    Z2: day.Z2,
    Z3: day.Z3,
    Z4: day.Z4,
    Z5: day.Z5,
    totalMeters: day.totalMeters,
  }));

  // Debug temporal (comentado para producción)
  // console.log("=== DEBUG PROGRESO SEMANAL ===");
  // console.log("Sessions cargadas:", sessions);
  // console.log("Datos del gráfico generados:", chartData);

  // Calcular total semanal
  const totalSemanal = chartData.reduce((total, day) => {
    return total + day.Z1 + day.Z2 + day.Z3 + day.Z4 + day.Z5;
  }, 0);

  // Calcular promedio diario
  const promedioDiario = Math.round(totalSemanal / 7);

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <Card className='col-span-4 bg-muted/50 border-muted'>
        <CardHeader>
          <CardTitle>Progreso Semanal</CardTitle>
          <CardDescription>
            Distancia por zonas de entrenamiento (kilómetros)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[300px] flex items-center justify-center'>
            <div className='animate-pulse text-muted-foreground'>
              Cargando datos...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='col-span-4 bg-muted/50 border-muted'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Progreso Semanal</CardTitle>
            <CardDescription>
              Distancia por zonas de entrenamiento (kilómetros)
            </CardDescription>
          </div>
          <Select
            value={chartType}
            onValueChange={value => setChartType(value as 'bar' | 'area')}
          >
            <SelectTrigger className='w-40 h-8 text-xs'>
              <SelectValue>
                <div className='flex items-center gap-1.5'>
                  {chartType === 'bar' ? (
                    <>
                      <BarChart3 className='h-3.5 w-3.5' />
                      <span>Barras</span>
                    </>
                  ) : (
                    <>
                      <AreaChartIcon className='h-3.5 w-3.5' />
                      <span>Área</span>
                    </>
                  )}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='bar'>
                <div className='flex items-center gap-1.5'>
                  <BarChart3 className='h-3.5 w-3.5' />
                  <span>Gráfico de Barras</span>
                </div>
              </SelectItem>
              <SelectItem value='area'>
                <div className='flex items-center gap-1.5'>
                  <AreaChartIcon className='h-3.5 w-3.5' />
                  <span>Gráfico de Área</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* Gráfico de Barras */}
          {chartType === 'bar' && (
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='day'
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value, index) => {
                    return value;
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => `${value}km`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => [
                        `${value}km`,
                        chartConfig[name as keyof typeof chartConfig]?.label || name,
                      ]}
                      labelFormatter={(label) => `Día: ${label}`}
                    />
                  }
                />
                <Bar dataKey='Z1' stackId='a' fill={zoneColors.Z1} />
                <Bar dataKey='Z2' stackId='a' fill={zoneColors.Z2} />
                <Bar dataKey='Z3' stackId='a' fill={zoneColors.Z3} />
                <Bar dataKey='Z4' stackId='a' fill={zoneColors.Z4} />
                <Bar dataKey='Z5' stackId='a' fill={zoneColors.Z5} />
              </BarChart>
            </ChartContainer>
          )}

          {/* Gráfico de Área */}
          {chartType === 'area' && (
            <ChartContainer config={areaChartConfig}>
              <AreaChart accessibilityLayer data={areaChartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='day'
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => `${value}km`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => [
                        `${value}km`,
                        areaChartConfig[name as keyof typeof areaChartConfig]?.label || name,
                      ]}
                      labelFormatter={(label) => `Día: ${label}`}
                    />
                  }
                />
                <Area
                  type='monotone'
                  dataKey='Z1'
                  stackId='1'
                  stroke={zoneColors.Z1}
                  fill={zoneColors.Z1}
                  fillOpacity={0.6}
                />
                <Area
                  type='monotone'
                  dataKey='Z2'
                  stackId='1'
                  stroke={zoneColors.Z2}
                  fill={zoneColors.Z2}
                  fillOpacity={0.6}
                />
                <Area
                  type='monotone'
                  dataKey='Z3'
                  stackId='1'
                  stroke={zoneColors.Z3}
                  fill={zoneColors.Z3}
                  fillOpacity={0.6}
                />
                <Area
                  type='monotone'
                  dataKey='Z4'
                  stackId='1'
                  stroke={zoneColors.Z4}
                  fill={zoneColors.Z4}
                  fillOpacity={0.6}
                />
                <Area
                  type='monotone'
                  dataKey='Z5'
                  stackId='1'
                  stroke={zoneColors.Z5}
                  fill={zoneColors.Z5}
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
          )}

          {/* Estadísticas */}
          <div className='grid grid-cols-2 gap-4 pt-4 border-t'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-primary'>
                {totalSemanal.toFixed(1)}km
              </div>
              <div className='text-sm text-muted-foreground'>
                Total Semanal
              </div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-primary'>
                {promedioDiario.toFixed(1)}km
              </div>
              <div className='text-sm text-muted-foreground'>
                Promedio Diario
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}