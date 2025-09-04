"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getSessions } from "@/lib/actions/sessions";
import type { Session } from "@/lib/actions/sessions";
import { calculateZoneVolumes, metersToKm, zoneLabels, zoneColors } from "@/lib/utils/zone-detection";

// Función para generar datos de la semana actual usando volúmenes manuales
const generateWeeklyData = (sessions: Session[]) => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Lunes
  
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  return days.map((dayName, index) => {
    const dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + index);
    const dayString = dayDate.toISOString().split('T')[0];
    
    // Filtrar sesiones de este día
    const daySessions = sessions.filter(session => session.date === dayString);
    
    // Sumar volúmenes manuales por zona (no detección automática)
    const zoneVolumes = {
      Z1: 0,
      Z2: 0,
      Z3: 0,
      Z4: 0,
      Z5: 0
    };
    
    daySessions.forEach(session => {
      // Usar los volúmenes manuales que introduces en el formulario
      zoneVolumes.Z1 += session.zone_volumes?.z1 || 0;
      zoneVolumes.Z2 += session.zone_volumes?.z2 || 0;
      zoneVolumes.Z3 += session.zone_volumes?.z3 || 0;
      zoneVolumes.Z4 += session.zone_volumes?.z4 || 0;
      zoneVolumes.Z5 += session.zone_volumes?.z5 || 0;
    });
    
    // Calcular total del día en metros
    const totalDayMeters = zoneVolumes.Z1 + zoneVolumes.Z2 + zoneVolumes.Z3 + zoneVolumes.Z4 + zoneVolumes.Z5;
    
    return {
      day: dayName,
      Z1: metersToKm(zoneVolumes.Z1),
      Z2: metersToKm(zoneVolumes.Z2),
      Z3: metersToKm(zoneVolumes.Z3),
      Z4: metersToKm(zoneVolumes.Z4),
      Z5: metersToKm(zoneVolumes.Z5),
      totalMeters: totalDayMeters
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

export function VisitorsChart() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Generar datos de la semana actual
  const chartData = generateWeeklyData(sessions);
  
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
      <Card className="col-span-4 bg-muted/50 border-muted">
        <CardHeader>
          <CardTitle>Progreso Semanal</CardTitle>
                  <CardDescription>
          Distancia por zonas de entrenamiento (kilómetros)
        </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Cargando datos...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4 bg-muted/50 border-muted">
      <CardHeader>
        <CardTitle>Progreso Semanal</CardTitle>
        <CardDescription>
          Distancia por zonas de entrenamiento (kilómetros)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value, index) => {
                const data = chartData[index];
                const totalKm = data ? (data.totalMeters / 1000).toFixed(1) : '0';
                return `${value.slice(0, 3)}\n${totalKm}km`;
              }}
            />
            <ChartTooltip 
              content={<ChartTooltipContent 
                hideLabel 
                formatter={(value, name) => [
                  `${value} km`,
                  chartConfig[name as keyof typeof chartConfig]?.label || name
                ]}
              />} 
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="Z1"
              stackId="a"
              fill="var(--color-Z1)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="Z2"
              stackId="a"
              fill="var(--color-Z2)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="Z3"
              stackId="a"
              fill="var(--color-Z3)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="Z4"
              stackId="a"
              fill="var(--color-Z4)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="Z5"
              stackId="a"
              fill="var(--color-Z5)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Total semanal: {totalSemanal.toLocaleString()} km <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Promedio diario: {promedioDiario.toLocaleString()} km
        </div>
      </CardFooter>
    </Card>
  );
}