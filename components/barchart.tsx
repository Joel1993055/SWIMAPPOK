"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Datos del gráfico con las 5 zonas de intensidad
const chartData = [
  { week: "Semana 1", Z1: 15, Z2: 8, Z3: 4, Z4: 2, Z5: 1, total: 30 },
  { week: "Semana 2", Z1: 18, Z2: 9, Z3: 5, Z4: 3, Z5: 2, total: 37 },
  { week: "Semana 3", Z1: 16, Z2: 10, Z3: 6, Z4: 4, Z5: 2, total: 38 },
  { week: "Semana 4", Z1: 20, Z2: 12, Z3: 7, Z4: 5, Z5: 3, total: 47 },
  { week: "Semana 5", Z1: 22, Z2: 14, Z3: 8, Z4: 6, Z5: 4, total: 54 },
  { week: "Semana 6", Z1: 19, Z2: 13, Z3: 9, Z4: 7, Z5: 5, total: 53 },
  { week: "Semana 7", Z1: 21, Z2: 15, Z3: 10, Z4: 8, Z5: 6, total: 60 },
  { week: "Semana 8", Z1: 24, Z2: 16, Z3: 11, Z4: 9, Z5: 7, total: 67 },
  { week: "Semana 9", Z1: 17, Z2: 12, Z3: 8, Z4: 6, Z5: 4, total: 47 },
  { week: "Semana 10", Z1: 25, Z2: 18, Z3: 12, Z4: 10, Z5: 8, total: 73 },
  { week: "Semana 11", Z1: 23, Z2: 17, Z3: 11, Z4: 9, Z5: 7, total: 67 },
  { week: "Semana 12", Z1: 20, Z2: 14, Z3: 9, Z4: 7, Z5: 5, total: 55 },
  { week: "Semana 13", Z1: 15, Z2: 10, Z3: 6, Z4: 4, Z5: 2, total: 37 },
  { week: "Semana 14", Z1: 26, Z2: 19, Z3: 13, Z4: 11, Z5: 9, total: 78 },
  { week: "Semana 15", Z1: 28, Z2: 21, Z3: 15, Z4: 13, Z5: 11, total: 88 },
  { week: "Semana 16", Z1: 25, Z2: 18, Z3: 12, Z4: 10, Z5: 8, total: 73 },
  { week: "Semana 17", Z1: 30, Z2: 22, Z3: 16, Z4: 14, Z5: 12, total: 94 },
  { week: "Semana 18", Z1: 32, Z2: 24, Z3: 18, Z4: 16, Z5: 14, total: 104 },
  { week: "Semana 19", Z1: 29, Z2: 21, Z3: 15, Z4: 13, Z5: 11, total: 89 },
  { week: "Semana 20", Z1: 35, Z2: 26, Z3: 20, Z4: 18, Z5: 16, total: 115 },
  { week: "Semana 21", Z1: 31, Z2: 23, Z3: 17, Z4: 15, Z5: 13, total: 99 },
  { week: "Semana 22", Z1: 27, Z2: 20, Z3: 14, Z4: 12, Z5: 10, total: 83 },
  { week: "Semana 23", Z1: 24, Z2: 17, Z3: 11, Z4: 9, Z5: 7, total: 68 },
  { week: "Semana 24", Z1: 22, Z2: 16, Z3: 10, Z4: 8, Z5: 6, total: 62 },
  { week: "Semana 25", Z1: 18, Z2: 13, Z3: 8, Z4: 6, Z5: 4, total: 49 },
  { week: "Semana 26", Z1: 16, Z2: 11, Z3: 7, Z4: 5, Z5: 3, total: 42 },
  { week: "Semana 27", Z1: 19, Z2: 14, Z3: 9, Z4: 7, Z5: 5, total: 54 },
  { week: "Semana 28", Z1: 33, Z2: 25, Z3: 19, Z4: 17, Z5: 15, total: 109 },
  { week: "Semana 29", Z1: 36, Z2: 27, Z3: 21, Z4: 19, Z5: 17, total: 120 },
  { week: "Semana 30", Z1: 38, Z2: 29, Z3: 23, Z4: 21, Z5: 19, total: 130 },
  { week: "Semana 31", Z1: 34, Z2: 26, Z3: 20, Z4: 18, Z5: 16, total: 114 },
  { week: "Semana 32", Z1: 31, Z2: 24, Z3: 18, Z4: 16, Z5: 14, total: 103 },
  { week: "Semana 33", Z1: 28, Z2: 21, Z3: 15, Z4: 13, Z5: 11, total: 88 },
  { week: "Semana 34", Z1: 25, Z2: 19, Z3: 13, Z4: 11, Z5: 9, total: 77 },
  { week: "Semana 35", Z1: 22, Z2: 17, Z3: 11, Z4: 9, Z5: 7, total: 66 },
  { week: "Semana 36", Z1: 20, Z2: 15, Z3: 9, Z4: 7, Z5: 5, total: 56 },
  { week: "Semana 37", Z1: 18, Z2: 14, Z3: 8, Z4: 6, Z5: 4, total: 50 },
  { week: "Semana 38", Z1: 16, Z2: 12, Z3: 7, Z4: 5, Z5: 3, total: 43 },
  { week: "Semana 39", Z1: 14, Z2: 10, Z3: 6, Z4: 4, Z5: 2, total: 36 },
  { week: "Semana 40", Z1: 12, Z2: 8, Z3: 4, Z4: 2, Z5: 1, total: 27 },
  { week: "Semana 41", Z1: 15, Z2: 11, Z3: 7, Z4: 5, Z5: 3, total: 41 },
  { week: "Semana 42", Z1: 17, Z2: 13, Z3: 9, Z4: 7, Z5: 5, total: 51 },
  { week: "Semana 43", Z1: 19, Z2: 15, Z3: 11, Z4: 9, Z5: 7, total: 61 },
  { week: "Semana 44", Z1: 21, Z2: 17, Z3: 13, Z4: 11, Z5: 9, total: 71 },
  { week: "Semana 45", Z1: 23, Z2: 19, Z3: 15, Z4: 13, Z5: 11, total: 81 },
  { week: "Semana 46", Z1: 26, Z2: 21, Z3: 17, Z4: 15, Z5: 13, total: 92 },
  { week: "Semana 47", Z1: 28, Z2: 23, Z3: 19, Z4: 17, Z5: 15, total: 102 },
  { week: "Semana 48", Z1: 30, Z2: 25, Z3: 21, Z4: 19, Z5: 17, total: 112 },
  { week: "Semana 49", Z1: 32, Z2: 27, Z3: 23, Z4: 21, Z5: 19, total: 122 },
  { week: "Semana 50", Z1: 29, Z2: 24, Z3: 20, Z4: 18, Z5: 16, total: 107 },
  { week: "Semana 51", Z1: 26, Z2: 21, Z3: 17, Z4: 15, Z5: 13, total: 92 },
  { week: "Semana 52", Z1: 23, Z2: 18, Z3: 14, Z4: 12, Z5: 10, total: 77 },
];

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
  total: {
    label: "Total",
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig;

export default function VolumeBarchart() {
  // Estado para las zonas seleccionadas
  const [selectedZones, setSelectedZones] = React.useState<Set<string>>(new Set(['total', 'Z1', 'Z2']));

  // Función para alternar zona seleccionada
  const toggleZone = (zone: string) => {
    const newSelected = new Set(selectedZones);
    if (newSelected.has(zone)) {
      newSelected.delete(zone);
    } else {
      newSelected.add(zone);
    }
    setSelectedZones(newSelected);
  };

  // Calcular totales
  const totals = React.useMemo(() => {
    const result: Record<string, number> = {};
    Object.keys(chartConfig).forEach(zone => {
      result[zone] = chartData.reduce((acc, curr) => acc + (curr[zone as keyof typeof curr] as number || 0), 0);
    });
    return result;
  }, []);

  // Filtrar datos para mostrar solo las zonas seleccionadas
  const filteredData = React.useMemo(() => {
    return chartData.map(week => {
      const filtered: any = { week };
      selectedZones.forEach(zone => {
        filtered[zone] = week[zone as keyof typeof week];
      });
      return filtered;
    });
  }, [selectedZones]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Weekly Volume - KM</CardTitle>
          <CardDescription>Showing training volume for each week</CardDescription>
        </div>
        
        {/* Selector de zonas */}
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-4">
            {Object.entries(chartConfig).map(([zone, config]) => (
              <div key={zone} className="flex items-center space-x-2">
                <Checkbox
                  id={zone}
                  checked={selectedZones.has(zone)}
                  onCheckedChange={() => toggleZone(zone)}
                />
                <Label 
                  htmlFor={zone} 
                  className="text-sm font-medium cursor-pointer flex items-center gap-2"
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: config.color }}
                  />
                  {config.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />
        
        {/* Resumen de totales */}
        <div className="flex flex-wrap">
          {Array.from(selectedZones).map((zone) => {
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
              dataKey="week"
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
            
            {/* Renderizar barras para cada zona seleccionada */}
            {Array.from(selectedZones).map((zone, index) => (
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