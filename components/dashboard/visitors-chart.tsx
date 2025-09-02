"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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

// Datos de ejemplo para una semana de entrenamientos por zonas
const chartData = [
  { 
    day: "Lunes", 
    aerobico: 2500, 
    umbral: 1200, 
    vo2max: 800,
    tecnica: 600
  },
  { 
    day: "Martes", 
    aerobico: 3000, 
    umbral: 0, 
    vo2max: 0,
    tecnica: 1000
  },
  { 
    day: "Miércoles", 
    aerobico: 2000, 
    umbral: 1500, 
    vo2max: 1000,
    tecnica: 500
  },
  { 
    day: "Jueves", 
    aerobico: 2800, 
    umbral: 0, 
    vo2max: 0,
    tecnica: 800
  },
  { 
    day: "Viernes", 
    aerobico: 2200, 
    umbral: 1000, 
    vo2max: 1200,
    tecnica: 400
  },
  { 
    day: "Sábado", 
    aerobico: 4000, 
    umbral: 0, 
    vo2max: 0,
    tecnica: 0
  },
  { 
    day: "Domingo", 
    aerobico: 1500, 
    umbral: 0, 
    vo2max: 0,
    tecnica: 0
  },
];

const chartConfig = {
  aerobico: {
    label: "Aeróbico",
    color: "hsl(var(--chart-1))",
  },
  umbral: {
    label: "Umbral",
    color: "hsl(var(--chart-2))",
  },
  vo2max: {
    label: "VO2 Max",
    color: "hsl(var(--chart-3))",
  },
  tecnica: {
    label: "Técnica",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function VisitorsChart() {
  // Calcular total semanal
  const totalSemanal = chartData.reduce((total, day) => {
    return total + day.aerobico + day.umbral + day.vo2max + day.tecnica;
  }, 0);

  // Calcular promedio diario
  const promedioDiario = Math.round(totalSemanal / 7);

  return (
    <Card className="col-span-4 bg-muted/50 border-muted">
      <CardHeader>
        <CardTitle>Progreso Semanal</CardTitle>
        <CardDescription>
          Distancia por zonas de entrenamiento (metros)
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
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip 
              content={<ChartTooltipContent 
                hideLabel 
                formatter={(value, name) => [
                  `${value} metros`,
                  chartConfig[name as keyof typeof chartConfig]?.label || name
                ]}
              />} 
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="aerobico"
              stackId="a"
              fill="var(--color-aerobico)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="umbral"
              stackId="a"
              fill="var(--color-umbral)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="vo2max"
              stackId="a"
              fill="var(--color-vo2max)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="tecnica"
              stackId="a"
              fill="var(--color-tecnica)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Total semanal: {totalSemanal.toLocaleString()} metros <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Promedio diario: {promedioDiario.toLocaleString()} metros
        </div>
      </CardFooter>
    </Card>
  );
}