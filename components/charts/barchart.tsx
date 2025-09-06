"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { getSessions } from "@/lib/actions/sessions";
import type { Session } from "@/lib/actions/sessions";
import { calculateZoneVolumes, metersToKm, zoneLabels, zoneColors } from "@/lib/utils/zone-detection";

// Función para generar datos reales basados en las sesiones usando sistema unificado de zonas
const generateVolumeData = (sessions: Session[], period: string) => {
  const now = new Date();
  
  if (period === 'month') {
    // Últimos 30 días
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const daySessions = sessions.filter(s => s.date === dateString);
      const zoneVolumes = calculateZoneVolumes(daySessions);
      const totalDistance = zoneVolumes.Z1 + zoneVolumes.Z2 + zoneVolumes.Z3 + zoneVolumes.Z4 + zoneVolumes.Z5;
      
      days.push({
        day: date.getDate().toString(),
        Z1: metersToKm(zoneVolumes.Z1),
        Z2: metersToKm(zoneVolumes.Z2),
        Z3: metersToKm(zoneVolumes.Z3),
        Z4: metersToKm(zoneVolumes.Z4),
        Z5: metersToKm(zoneVolumes.Z5),
        total: metersToKm(totalDistance)
      });
    }
    return days;
  } else if (period === '6months') {
    // Últimos 6 meses - por meses
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthSessions = sessions.filter(s => {
        const sessionDate = new Date(s.date);
        return sessionDate >= monthStart && sessionDate <= monthEnd;
      });
      
      const zoneVolumes = calculateZoneVolumes(monthSessions);
      const totalDistance = zoneVolumes.Z1 + zoneVolumes.Z2 + zoneVolumes.Z3 + zoneVolumes.Z4 + zoneVolumes.Z5;
      
      months.push({
        month: date.toLocaleDateString('es-ES', { month: 'short' }),
        Z1: metersToKm(zoneVolumes.Z1),
        Z2: metersToKm(zoneVolumes.Z2),
        Z3: metersToKm(zoneVolumes.Z3),
        Z4: metersToKm(zoneVolumes.Z4),
        Z5: metersToKm(zoneVolumes.Z5),
        total: metersToKm(totalDistance)
      });
    }
    return months;
  } else if (period === '3months') {
    // Últimos 3 meses - por meses
    const months = [];
    for (let i = 2; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthSessions = sessions.filter(s => {
        const sessionDate = new Date(s.date);
        return sessionDate >= monthStart && sessionDate <= monthEnd;
      });
      
      const zoneVolumes = calculateZoneVolumes(monthSessions);
      const totalDistance = zoneVolumes.Z1 + zoneVolumes.Z2 + zoneVolumes.Z3 + zoneVolumes.Z4 + zoneVolumes.Z5;
      
      months.push({
        month: date.toLocaleDateString('es-ES', { month: 'short' }),
        Z1: metersToKm(zoneVolumes.Z1),
        Z2: metersToKm(zoneVolumes.Z2),
        Z3: metersToKm(zoneVolumes.Z3),
        Z4: metersToKm(zoneVolumes.Z4),
        Z5: metersToKm(zoneVolumes.Z5),
        total: metersToKm(totalDistance)
      });
    }
    return months;
  } else {
    // Todo el año - por meses
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthSessions = sessions.filter(s => {
        const sessionDate = new Date(s.date);
        return sessionDate >= monthStart && sessionDate <= monthEnd;
      });
      
      const zoneVolumes = calculateZoneVolumes(monthSessions);
      const totalDistance = zoneVolumes.Z1 + zoneVolumes.Z2 + zoneVolumes.Z3 + zoneVolumes.Z4 + zoneVolumes.Z5;
      
      months.push({
        month: date.toLocaleDateString('es-ES', { month: 'short' }),
        Z1: metersToKm(zoneVolumes.Z1),
        Z2: metersToKm(zoneVolumes.Z2),
        Z3: metersToKm(zoneVolumes.Z3),
        Z4: metersToKm(zoneVolumes.Z4),
        Z5: metersToKm(zoneVolumes.Z5),
        total: metersToKm(totalDistance)
      });
    }
    return months;
  }
};

// Datos del gráfico corregidos para ser realistas para un nadador (fallback)
const fallbackData = [
  { week: "Semana 1", Z1: 8, Z2: 6, Z3: 4, Z4: 2, Z5: 1, total: 21 },
  { week: "Semana 2", Z1: 9, Z2: 7, Z3: 5, Z4: 3, Z5: 2, total: 26 },
  { week: "Semana 3", Z1: 10, Z2: 8, Z3: 6, Z4: 4, Z5: 2, total: 30 },
  { week: "Semana 4", Z1: 11, Z2: 9, Z3: 7, Z4: 5, Z5: 3, total: 35 },
  { week: "Semana 5", Z1: 12, Z2: 10, Z3: 8, Z4: 6, Z5: 4, total: 40 },
  { week: "Semana 6", Z1: 13, Z2: 11, Z3: 9, Z4: 7, Z5: 5, total: 45 },
  { week: "Semana 7", Z1: 14, Z2: 12, Z3: 10, Z4: 8, Z5: 6, total: 50 },
  { week: "Semana 8", Z1: 15, Z2: 13, Z3: 11, Z4: 9, Z5: 7, total: 55 },
  { week: "Semana 9", Z1: 11, Z2: 9, Z3: 7, Z4: 5, Z5: 3, total: 35 },
  { week: "Semana 10", Z1: 16, Z2: 14, Z3: 12, Z4: 10, Z5: 8, total: 60 },
  { week: "Semana 11", Z1: 15, Z2: 13, Z3: 11, Z4: 9, Z5: 7, total: 55 },
  { week: "Semana 12", Z1: 14, Z2: 12, Z3: 10, Z4: 8, Z5: 6, total: 50 },
  { week: "Semana 13", Z1: 10, Z2: 8, Z3: 6, Z4: 4, Z5: 2, total: 30 },
  { week: "Semana 14", Z1: 17, Z2: 15, Z3: 13, Z4: 11, Z5: 9, total: 65 },
  { week: "Semana 15", Z1: 18, Z2: 16, Z3: 14, Z4: 12, Z5: 10, total: 70 },
  { week: "Semana 16", Z1: 16, Z2: 14, Z3: 12, Z4: 10, Z5: 8, total: 60 },
  { week: "Semana 17", Z1: 19, Z2: 17, Z3: 15, Z4: 13, Z5: 11, total: 75 },
  { week: "Semana 18", Z1: 20, Z2: 18, Z3: 16, Z4: 14, Z5: 12, total: 80 },
  { week: "Semana 19", Z1: 17, Z2: 15, Z3: 13, Z4: 11, Z5: 9, total: 65 },
  { week: "Semana 20", Z1: 21, Z2: 19, Z3: 17, Z4: 15, Z5: 13, total: 85 },
  { week: "Semana 21", Z1: 18, Z2: 16, Z3: 14, Z4: 12, Z5: 10, total: 70 },
  { week: "Semana 22", Z1: 16, Z2: 14, Z3: 12, Z4: 10, Z5: 8, total: 60 },
  { week: "Semana 23", Z1: 15, Z2: 13, Z3: 11, Z4: 9, Z5: 7, total: 55 },
  { week: "Semana 24", Z1: 14, Z2: 12, Z3: 10, Z4: 8, Z5: 6, total: 50 },
  { week: "Semana 25", Z1: 12, Z2: 10, Z3: 8, Z4: 6, Z5: 4, total: 40 },
  { week: "Semana 26", Z1: 10, Z2: 8, Z3: 6, Z4: 4, Z5: 2, total: 30 },
  { week: "Semana 27", Z1: 13, Z2: 11, Z3: 9, Z4: 7, Z5: 5, total: 45 },
  { week: "Semana 28", Z1: 22, Z2: 20, Z3: 18, Z4: 16, Z5: 14, total: 90 },
  { week: "Semana 29", Z1: 23, Z2: 21, Z3: 19, Z4: 17, Z5: 15, total: 95 },
  { week: "Semana 30", Z1: 24, Z2: 22, Z3: 20, Z4: 18, Z5: 16, total: 100 },
  { week: "Semana 31", Z1: 20, Z2: 18, Z3: 16, Z4: 14, Z5: 12, total: 80 },
  { week: "Semana 32", Z1: 18, Z2: 16, Z3: 14, Z4: 12, Z5: 10, total: 70 },
  { week: "Semana 33", Z1: 16, Z2: 14, Z3: 12, Z4: 10, Z5: 8, total: 60 },
  { week: "Semana 34", Z1: 14, Z2: 12, Z3: 10, Z4: 8, Z5: 6, total: 50 },
  { week: "Semana 35", Z1: 12, Z2: 10, Z3: 8, Z4: 6, Z5: 4, total: 40 },
  { week: "Semana 36", Z1: 11, Z2: 9, Z3: 7, Z4: 5, Z5: 3, total: 35 },
  { week: "Semana 37", Z1: 10, Z2: 8, Z3: 6, Z4: 4, Z5: 2, total: 30 },
  { week: "Semana 38", Z1: 9, Z2: 7, Z3: 5, Z4: 3, Z5: 1, total: 25 },
  { week: "Semana 39", Z1: 8, Z2: 6, Z3: 4, Z4: 2, Z5: 1, total: 21 },
  { week: "Semana 40", Z1: 7, Z2: 5, Z3: 3, Z4: 2, Z5: 1, total: 18 },
  { week: "Semana 41", Z1: 9, Z2: 7, Z3: 5, Z4: 3, Z5: 2, total: 26 },
  { week: "Semana 42", Z1: 11, Z2: 9, Z3: 7, Z4: 5, Z5: 3, total: 35 },
  { week: "Semana 43", Z1: 13, Z2: 11, Z3: 9, Z4: 7, Z5: 5, total: 45 },
  { week: "Semana 44", Z1: 15, Z2: 13, Z3: 11, Z4: 9, Z5: 7, total: 55 },
  { week: "Semana 45", Z1: 17, Z2: 15, Z3: 13, Z4: 11, Z5: 9, total: 65 },
  { week: "Semana 46", Z1: 19, Z2: 17, Z3: 15, Z4: 13, Z5: 11, total: 75 },
  { week: "Semana 47", Z1: 21, Z2: 19, Z3: 17, Z4: 15, Z5: 13, total: 85 },
  { week: "Semana 48", Z1: 23, Z2: 21, Z3: 19, Z4: 17, Z5: 15, total: 95 },
  { week: "Semana 49", Z1: 25, Z2: 23, Z3: 21, Z4: 19, Z5: 17, total: 105 },
  { week: "Semana 50", Z1: 22, Z2: 20, Z3: 18, Z4: 16, Z5: 14, total: 90 },
  { week: "Semana 51", Z1: 19, Z2: 17, Z3: 15, Z4: 13, Z5: 11, total: 75 },
  { week: "Semana 52", Z1: 16, Z2: 14, Z3: 12, Z4: 10, Z5: 8, total: 60 },
];

// Configuración del gráfico con las 5 zonas
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
  total: {
    label: "Total",
    color: "hsl(15, 100%, 50%)", // Rojo naranja personalizado para mejor visibilidad
  },
} satisfies ChartConfig;

export default function VolumeBarchart() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("year");
  
  // Estado para la vista seleccionada
  const [selectedView, setSelectedView] = React.useState<string>("all");

  // Cargar sesiones reales desde Supabase
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await getSessions();
        setSessions(data);
      } catch (error) {
        console.error("Error cargando sesiones:", error);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  // Generar datos reales basados en el período seleccionado
  const realData = generateVolumeData(sessions, selectedPeriod);
  const chartData = realData.length > 0 ? realData : fallbackData;

  // Configuración de vistas
  const views = React.useMemo(() => ({
    Z1: {
      label: "Z1",
      zones: ['Z1'],
      description: "Zona 1 - Recuperación"
    },
    Z2: {
      label: "Z2",
      zones: ['Z2'],
      description: "Zona 2 - Aeróbico"
    },
    Z3: {
      label: "Z3",
      zones: ['Z3'],
      description: "Zona 3 - Tempo"
    },
    Z4: {
      label: "Z4",
      zones: ['Z4'],
      description: "Zona 4 - Velocidad"
    },
    Z5: {
      label: "Z5",
      zones: ['Z5'],
      description: "Zona 5 - VO2 Max"
    },
    all: {
      label: "Todas",
      zones: ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'],
      description: "Todas las zonas de entrenamiento"
    }
  }), []);

  // Calcular totales
  const totals = React.useMemo(() => {
    const result: Record<string, number> = {};
    Object.keys(chartConfig).forEach(zone => {
      result[zone] = chartData.reduce((acc, curr) => acc + (curr[zone as keyof typeof curr] as number || 0), 0);
    });
    return result;
  }, []);

  // Filtrar datos para mostrar solo las zonas de la vista seleccionada
  const filteredData = React.useMemo(() => {
    const selectedZones = views[selectedView as keyof typeof views].zones;
    return chartData.map(dataPoint => {
      // Determinar la clave del eje X basada en el período
      const xAxisKey = selectedPeriod === 'month' ? 'day' : 'month';
      const filtered: Record<string, string | number> = { [xAxisKey]: dataPoint[xAxisKey as keyof typeof dataPoint] };
      
      selectedZones.forEach(zone => {
        if (dataPoint[zone as keyof typeof dataPoint] !== undefined) {
          filtered[zone] = dataPoint[zone as keyof typeof dataPoint];
        }
      });
      return filtered;
    });
  }, [selectedView, views, selectedPeriod, chartData]);

  const currentView = views[selectedView as keyof typeof views];

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <Card className="bg-muted/50 border-muted">
        <CardHeader>
          <CardTitle>Gráfico Volumen Total</CardTitle>
          <CardDescription>
            Volumen de entrenamiento por zonas de intensidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Cargando datos...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-muted/50 border-muted">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {selectedPeriod === 'month' ? 'Volumen 30 Días' : 
                 selectedPeriod === '3months' ? 'Volumen 3 Meses' :
                 selectedPeriod === '6months' ? 'Volumen 6 Meses' :
                 'Volumen Anual'} - KM
              </CardTitle>
              <CardDescription>{currentView.description}</CardDescription>
            </div>
            
            {/* Tabs de período y vista */}
            <div className="flex gap-2">
              <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="w-auto">
                <TabsList className="grid w-full grid-cols-4 bg-muted">
                  <TabsTrigger value="year" className="text-xs">Año</TabsTrigger>
                  <TabsTrigger value="6months" className="text-xs">6 meses</TabsTrigger>
                  <TabsTrigger value="3months" className="text-xs">3 meses</TabsTrigger>
                  <TabsTrigger value="month" className="text-xs">30 días</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Tabs value={selectedView} onValueChange={setSelectedView} className="w-auto">
                <TabsList className="grid w-full grid-cols-6 bg-muted">
                  <TabsTrigger value="Z1" className="text-xs">Z1</TabsTrigger>
                  <TabsTrigger value="Z2" className="text-xs">Z2</TabsTrigger>
                  <TabsTrigger value="Z3" className="text-xs">Z3</TabsTrigger>
                  <TabsTrigger value="Z4" className="text-xs">Z4</TabsTrigger>
                  <TabsTrigger value="Z5" className="text-xs">Z5</TabsTrigger>
                  <TabsTrigger value="all" className="text-xs">Todas</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        <Separator />
        
        {/* Resumen de totales */}
        <div className="flex flex-wrap">
          {currentView.zones.map((zone) => {
            const config = chartConfig[zone as keyof typeof chartConfig];
            return (
              <div
                key={zone}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              >
                <span className="text-xs text-muted-foreground">{config.label}</span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {totals[zone]?.toLocaleString()} KM
                </span>
              </div>
            );
          })}
        </div>
      </CardHeader>
      
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={selectedPeriod === 'month' ? 'day' : 'month'}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  nameKey="volume"
                  labelFormatter={(value) => value}
                />
              }
            />
            <Legend />
            
            {/* Renderizar barras para cada zona de la vista seleccionada */}
            {currentView.zones.map((zone) => (
              <Bar 
                key={zone}
                dataKey={zone} 
                fill={chartConfig[zone as keyof typeof chartConfig]?.color}
                stackId="a"
                name={chartConfig[zone as keyof typeof chartConfig]?.label}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
