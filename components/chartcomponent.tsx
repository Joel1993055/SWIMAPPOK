"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Función para generar datos hasta la fecha actual
const generateDataUntilToday = () => {
  const data = [
  { date: "2024-04-01", Z1: 222, Z2: 150, Z3: 180, Z4: 120, Z5: 90 },
  { date: "2024-04-02", Z1: 97, Z2: 180, Z3: 140, Z4: 110, Z5: 80 },
  { date: "2024-04-03", Z1: 167, Z2: 120, Z3: 160, Z4: 130, Z5: 100 },
  { date: "2024-04-04", Z1: 242, Z2: 260, Z3: 200, Z4: 150, Z5: 120 },
  { date: "2024-04-05", Z1: 373, Z2: 290, Z3: 220, Z4: 180, Z5: 140 },
  { date: "2024-04-06", Z1: 301, Z2: 340, Z3: 240, Z4: 200, Z5: 160 },
  { date: "2024-04-07", Z1: 245, Z2: 180, Z3: 160, Z4: 120, Z5: 90 },
  { date: "2024-04-08", Z1: 409, Z2: 320, Z3: 280, Z4: 220, Z5: 180 },
  { date: "2024-04-09", Z1: 59, Z2: 110, Z3: 100, Z4: 80, Z5: 60 },
  { date: "2024-04-10", Z1: 261, Z2: 190, Z3: 160, Z4: 130, Z5: 100 },
  { date: "2024-04-11", Z1: 327, Z2: 350, Z3: 280, Z4: 240, Z5: 200 },
  { date: "2024-04-12", Z1: 292, Z2: 210, Z3: 180, Z4: 150, Z5: 120 },
  { date: "2024-04-13", Z1: 342, Z2: 380, Z3: 300, Z4: 260, Z5: 220 },
  { date: "2024-04-14", Z1: 137, Z2: 220, Z3: 180, Z4: 140, Z5: 110 },
  { date: "2024-04-15", Z1: 120, Z2: 170, Z3: 140, Z4: 110, Z5: 90 },
  { date: "2024-04-16", Z1: 138, Z2: 190, Z3: 160, Z4: 130, Z5: 100 },
  { date: "2024-04-17", Z1: 446, Z2: 360, Z3: 300, Z4: 260, Z5: 220 },
  { date: "2024-04-18", Z1: 364, Z2: 410, Z3: 340, Z4: 300, Z5: 260 },
  { date: "2024-04-19", Z1: 243, Z2: 180, Z3: 160, Z4: 130, Z5: 100 },
  { date: "2024-04-20", Z1: 89, Z2: 150, Z3: 120, Z4: 100, Z5: 80 },
  { date: "2024-04-21", Z1: 137, Z2: 200, Z3: 160, Z4: 130, Z5: 100 },
  { date: "2024-04-22", Z1: 224, Z2: 170, Z3: 140, Z4: 120, Z5: 90 },
  { date: "2024-04-23", Z1: 138, Z2: 230, Z3: 180, Z4: 150, Z5: 120 },
  { date: "2024-04-24", Z1: 387, Z2: 290, Z3: 240, Z4: 200, Z5: 160 },
  { date: "2024-04-25", Z1: 215, Z2: 250, Z3: 200, Z4: 170, Z5: 140 },
  { date: "2024-04-26", Z1: 75, Z2: 130, Z3: 110, Z4: 90, Z5: 70 },
  { date: "2024-04-27", Z1: 383, Z2: 420, Z3: 340, Z4: 300, Z5: 260 },
  { date: "2024-04-28", Z1: 122, Z2: 180, Z3: 150, Z4: 120, Z5: 100 },
  { date: "2024-04-29", Z1: 315, Z2: 240, Z3: 200, Z4: 170, Z5: 140 },
  { date: "2024-04-30", Z1: 454, Z2: 380, Z3: 300, Z4: 260, Z5: 220 },
  { date: "2024-05-01", Z1: 165, Z2: 220, Z3: 180, Z4: 150, Z5: 120 },
  { date: "2024-05-02", Z1: 293, Z2: 310, Z3: 260, Z4: 220, Z5: 180 },
  { date: "2024-05-03", Z1: 247, Z2: 190, Z3: 160, Z4: 130, Z5: 100 },
  { date: "2024-05-04", Z1: 385, Z2: 420, Z3: 340, Z4: 300, Z5: 260 },
  { date: "2024-05-05", Z1: 481, Z2: 390, Z3: 320, Z4: 280, Z5: 240 },
  { date: "2024-05-06", Z1: 498, Z2: 520, Z3: 420, Z4: 380, Z5: 340 },
  { date: "2024-05-07", Z1: 388, Z2: 300, Z3: 250, Z4: 220, Z5: 180 },
  { date: "2024-05-08", Z1: 149, Z2: 210, Z3: 180, Z4: 150, Z5: 120 },
  { date: "2024-05-09", Z1: 227, Z2: 180, Z3: 150, Z4: 130, Z5: 100 },
  { date: "2024-05-10", Z1: 293, Z2: 330, Z3: 280, Z4: 240, Z5: 200 },
  { date: "2024-05-11", Z1: 335, Z2: 270, Z3: 220, Z4: 190, Z5: 160 },
  { date: "2024-05-12", Z1: 197, Z2: 240, Z3: 200, Z4: 170, Z5: 140 },
  { date: "2024-05-13", Z1: 197, Z2: 160, Z3: 140, Z4: 120, Z5: 100 },
  { date: "2024-05-14", Z1: 448, Z2: 490, Z3: 400, Z4: 360, Z5: 320 },
  { date: "2024-05-15", Z1: 473, Z2: 380, Z3: 320, Z4: 280, Z5: 240 },
  { date: "2024-05-16", Z1: 338, Z2: 400, Z3: 340, Z4: 300, Z5: 260 },
  { date: "2024-05-17", Z1: 499, Z2: 420, Z3: 360, Z4: 320, Z5: 280 },
  { date: "2024-05-18", Z1: 315, Z2: 350, Z3: 300, Z4: 260, Z5: 220 },
  { date: "2024-05-19", Z1: 235, Z2: 180, Z3: 150, Z4: 130, Z5: 100 },
  { date: "2024-05-20", Z1: 177, Z2: 230, Z3: 190, Z4: 160, Z5: 130 },
  { date: "2024-05-21", Z1: 82, Z2: 140, Z3: 120, Z4: 100, Z5: 80 },
  { date: "2024-05-22", Z1: 81, Z2: 120, Z3: 100, Z4: 90, Z5: 70 },
  { date: "2024-05-23", Z1: 252, Z2: 290, Z3: 240, Z4: 200, Z5: 170 },
  { date: "2024-05-24", Z1: 294, Z2: 220, Z3: 180, Z4: 160, Z5: 130 },
  { date: "2024-05-25", Z1: 201, Z2: 250, Z3: 200, Z4: 180, Z5: 150 },
  { date: "2024-05-26", Z1: 213, Z2: 170, Z3: 150, Z4: 130, Z5: 110 },
  { date: "2024-05-27", Z1: 420, Z2: 460, Z3: 380, Z4: 340, Z5: 300 },
  { date: "2024-05-28", Z1: 233, Z2: 190, Z3: 160, Z4: 140, Z5: 120 },
  { date: "2024-05-29", Z1: 78, Z2: 130, Z3: 110, Z4: 100, Z5: 80 },
  { date: "2024-05-30", Z1: 340, Z2: 280, Z3: 240, Z4: 200, Z5: 170 },
  { date: "2024-05-31", Z1: 178, Z2: 230, Z3: 190, Z4: 160, Z5: 130 },
  { date: "2024-06-01", Z1: 178, Z2: 200, Z3: 170, Z4: 150, Z5: 120 },
  { date: "2024-06-02", Z1: 470, Z2: 410, Z3: 340, Z4: 300, Z5: 260 },
  { date: "2024-06-03", Z1: 103, Z2: 160, Z3: 140, Z4: 120, Z5: 100 },
  { date: "2024-06-04", Z1: 439, Z2: 380, Z3: 320, Z4: 280, Z5: 240 },
  { date: "2024-06-05", Z1: 88, Z2: 140, Z3: 120, Z4: 100, Z5: 80 },
  { date: "2024-06-06", Z1: 294, Z2: 250, Z3: 210, Z4: 180, Z5: 150 },
  { date: "2024-06-07", Z1: 323, Z2: 370, Z3: 300, Z4: 260, Z5: 220 },
  { date: "2024-06-08", Z1: 385, Z2: 320, Z3: 260, Z4: 230, Z5: 190 },
  { date: "2024-06-09", Z1: 438, Z2: 480, Z3: 400, Z4: 360, Z5: 320 },
  { date: "2024-06-10", Z1: 155, Z2: 200, Z3: 170, Z4: 150, Z5: 120 },
  { date: "2024-06-11", Z1: 92, Z2: 150, Z3: 130, Z4: 110, Z5: 90 },
  { date: "2024-06-12", Z1: 492, Z2: 420, Z3: 360, Z4: 320, Z5: 280 },
  { date: "2024-06-13", Z1: 81, Z2: 130, Z3: 110, Z4: 100, Z5: 80 },
  { date: "2024-06-14", Z1: 426, Z2: 380, Z3: 320, Z4: 280, Z5: 240 },
  { date: "2024-06-15", Z1: 307, Z2: 350, Z3: 300, Z4: 260, Z5: 220 },
  { date: "2024-06-16", Z1: 371, Z2: 310, Z3: 260, Z4: 230, Z5: 190 },
  { date: "2024-06-17", Z1: 475, Z2: 520, Z3: 440, Z4: 400, Z5: 360 },
  { date: "2024-06-18", Z1: 107, Z2: 170, Z3: 150, Z4: 130, Z5: 110 },
  { date: "2024-06-19", Z1: 341, Z2: 290, Z3: 250, Z4: 220, Z5: 190 },
  { date: "2024-06-20", Z1: 408, Z2: 450, Z3: 380, Z4: 340, Z5: 300 },
  { date: "2024-06-21", Z1: 169, Z2: 210, Z3: 180, Z4: 160, Z5: 130 },
  { date: "2024-06-22", Z1: 317, Z2: 270, Z3: 230, Z4: 200, Z5: 170 },
  { date: "2024-06-23", Z1: 480, Z2: 530, Z3: 450, Z4: 410, Z5: 370 },
  { date: "2024-06-24", Z1: 132, Z2: 180, Z3: 150, Z4: 130, Z5: 110 },
  { date: "2024-06-25", Z1: 141, Z2: 190, Z3: 160, Z4: 140, Z5: 120 },
  { date: "2024-06-26", Z1: 434, Z2: 380, Z3: 320, Z4: 280, Z5: 240 },
  { date: "2024-06-27", Z1: 448, Z2: 490, Z3: 400, Z4: 360, Z5: 320 },
  { date: "2024-06-28", Z1: 149, Z2: 200, Z3: 170, Z4: 150, Z5: 120 },
  { date: "2024-06-29", Z1: 103, Z2: 160, Z3: 140, Z4: 120, Z5: 100 },
  { date: "2024-06-30", Z1: 446, Z2: 400, Z3: 340, Z4: 300, Z5: 260 },
  ];

  // Extender datos hasta la fecha actual
  const lastDate = new Date("2024-06-30");
  const today = new Date();
  
  // Generar datos desde el 1 de julio de 2024 hasta hoy
  const currentDate = new Date(lastDate);
  currentDate.setDate(currentDate.getDate() + 1);
  
  while (currentDate <= today) {
    // Generar valores aleatorios realistas basados en los datos existentes
    const baseZ1 = 200 + Math.random() * 300;
    const baseZ2 = 150 + Math.random() * 250;
    const baseZ3 = 120 + Math.random() * 200;
    const baseZ4 = 100 + Math.random() * 150;
    const baseZ5 = 80 + Math.random() * 120;
    
    data.push({
      date: currentDate.toISOString().split('T')[0],
      Z1: Math.round(baseZ1),
      Z2: Math.round(baseZ2),
      Z3: Math.round(baseZ3),
      Z4: Math.round(baseZ4),
      Z5: Math.round(baseZ5),
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
};

// Generar los datos completos
const chartData = generateDataUntilToday();

// Configuración del gráfico con las 5 zonas
const chartConfig = {
  Z1: {
    label: "Z1 - Recuperación",
    color: "hsl(var(--chart-1))",
  },
  Z2: {
    label: "Z2 - Resistencia Base",
    color: "hsl(var(--chart-2))",
  },
  Z3: {
    label: "Z3 - Tempo",
    color: "hsl(var(--chart-3))",
  },
  Z4: {
    label: "Z4 - Umbral",
    color: "hsl(var(--chart-4))",
  },
  Z5: {
    label: "Z5 - VO2 Max",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export default function ChartComponent() {
  const [timeRange, setTimeRange] = React.useState("90d");

  // Función para agrupar datos por meses
  const groupDataByMonths = (data: typeof chartData) => {
    const monthlyData: Record<string, { Z1: number; Z2: number; Z3: number; Z4: number; Z5: number; count: number; month: string }> = {};
    
    // Primero, procesar los datos existentes
    data.forEach(item => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { Z1: 0, Z2: 0, Z3: 0, Z4: 0, Z5: 0, count: 0, month: monthName };
      }
      
      monthlyData[monthKey].Z1 += item.Z1;
      monthlyData[monthKey].Z2 += item.Z2;
      monthlyData[monthKey].Z3 += item.Z3;
      monthlyData[monthKey].Z4 += item.Z4;
      monthlyData[monthKey].Z5 += item.Z5;
      monthlyData[monthKey].count += 1;
    });
    
    // Generar meses faltantes según el rango
    if (timeRange === "1y") {
      // Todo el año - generar todos los meses desde enero 2024 hasta el mes actual de 2025
      const currentDate = new Date();
      const startYear = 2024;
      const endYear = currentDate.getFullYear();
      
      for (let year = startYear; year <= endYear; year++) {
        const monthsInYear = year === endYear ? currentDate.getMonth() + 1 : 12;
        
        for (let month = 0; month < monthsInYear; month++) {
          const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
          const monthName = new Date(year, month, 1).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
          
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { Z1: 0, Z2: 0, Z3: 0, Z4: 0, Z5: 0, count: 1, month: monthName };
          }
        }
      }
    } else if (timeRange === "180d" || timeRange === "90d") {
      // Para 6 y 3 meses, generar los meses del rango
      const currentDate = new Date();
      const monthsToGenerate = timeRange === "180d" ? 6 : 3;
      
      for (let i = 0; i < monthsToGenerate; i++) {
        const targetDate = new Date(currentDate);
        targetDate.setMonth(targetDate.getMonth() - i);
        
        const monthKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
        const monthName = targetDate.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { Z1: 0, Z2: 0, Z3: 0, Z4: 0, Z5: 0, count: 1, month: monthName };
        }
      }
    }
    
    // Convertir a array y calcular promedios
    return Object.entries(monthlyData)
      .map(([, data]) => ({
        month: data.month,
        Z1: data.count > 0 ? Math.round(data.Z1 / data.count) : 0,
        Z2: data.count > 0 ? Math.round(data.Z2 / data.count) : 0,
        Z3: data.count > 0 ? Math.round(data.Z3 / data.count) : 0,
        Z4: data.count > 0 ? Math.round(data.Z4 / data.count) : 0,
        Z5: data.count > 0 ? Math.round(data.Z5 / data.count) : 0,
      }))
      .sort((a, b) => {
        // Ordenar por fecha real - extraer año y mes correctamente
        const parseMonth = (monthStr: string) => {
          const [monthName, year] = monthStr.split(' ');
          const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
          return new Date(parseInt(year), monthIndex, 1);
        };
        
        const dateA = parseMonth(a.month);
        const dateB = parseMonth(b.month);
        return dateA.getTime() - dateB.getTime();
      });
  };

  // Función para formatear datos diarios
  const formatDailyData = (data: typeof chartData) => {
    return data.map(item => ({
      date: new Date(item.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      Z1: item.Z1,
      Z2: item.Z2,
      Z3: item.Z3,
      Z4: item.Z4,
      Z5: item.Z5,
    }));
  };

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    
    if (timeRange === "1y") {
      // Todo el año - mostrar todos los datos
      return true;
    }
    
    // Usar la fecha actual como referencia
    const referenceDate = new Date();
    
    if (timeRange === "180d") {
      // Últimos 6 meses - restar 6 meses
      const startDate = new Date(referenceDate);
      startDate.setMonth(startDate.getMonth() - 6);
      return date >= startDate;
    } else if (timeRange === "90d") {
      // Últimos 3 meses - restar 3 meses
      const startDate = new Date(referenceDate);
      startDate.setMonth(startDate.getMonth() - 3);
      return date >= startDate;
    } else if (timeRange === "30d") {
      // Últimos 30 días
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - 30);
      return date >= startDate;
    } else if (timeRange === "7d") {
      // Últimos 7 días
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - 7);
      return date >= startDate;
    }
    
    return true;
  });

  // Decidir si mostrar datos por meses o por días
  const shouldGroupByMonths = timeRange === "1y" || timeRange === "180d" || timeRange === "90d";
  const finalChartData = shouldGroupByMonths ? groupDataByMonths(filteredData) : formatDailyData(filteredData);

  return (
    <Card className="bg-muted/50 border-muted">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Gráfico Volumen total</CardTitle>
          <CardDescription>
            {timeRange === "1y" ? "Mostrando todo el año" :
             timeRange === "180d" ? "Mostrando los últimos 6 meses" :
             timeRange === "90d" ? "Mostrando los últimos 3 meses" :
             timeRange === "30d" ? "Mostrando los últimos 30 días" :
             "Mostrando los últimos 7 días"}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Selecciona un rango"
          >
            <SelectValue placeholder="Últimos 3 meses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="1y" className="rounded-lg">
              Todo el año
            </SelectItem>
            <SelectItem value="180d" className="rounded-lg">
              Últimos 6 meses
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              Últimos 3 meses
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Últimos 30 días
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Últimos 7 días
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={finalChartData}>
            <defs>
              <linearGradient id="fillZ1" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-Z1)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-Z1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillZ2" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-Z2)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-Z2)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillZ3" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-Z3)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-Z3)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillZ4" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-Z4)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-Z4)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillZ5" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-Z5)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-Z5)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={shouldGroupByMonths ? "month" : "date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="Z5"
              type="natural"
              fill="url(#fillZ5)"
              stroke="var(--color-Z5)"
              stackId="a"
            />
            <Area
              dataKey="Z4"
              type="natural"
              fill="url(#fillZ4)"
              stroke="var(--color-Z4)"
              stackId="a"
            />
            <Area
              dataKey="Z3"
              type="natural"
              fill="url(#fillZ3)"
              stroke="var(--color-Z3)"
              stackId="a"
            />
            <Area
              dataKey="Z2"
              type="natural"
              fill="url(#fillZ2)"
              stroke="var(--color-Z2)"
              stackId="a"
            />
            <Area
              dataKey="Z1"
              type="natural"
              fill="url(#fillZ1)"
              stroke="var(--color-Z1)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
