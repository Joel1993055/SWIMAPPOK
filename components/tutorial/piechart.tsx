"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { estilo: "Mariposa", visitantes: 275, fill: "var(--color-mariposa)" },
  { estilo: "Espalda", visitantes: 200, fill: "var(--color-espalda)" },
  { estilo: "Braza", visitantes: 287, fill: "var(--color-braza)" },
  { estilo: "Crol", visitantes: 173, fill: "var(--color-crol)" },
];

const chartConfig = {
  visitantes: {
    label: "Visitantes",
  },
  mariposa: {
    label: "Mariposa",
    color: "hsl(var(--chart-1))",
  },
  espalda: {
    label: "Espalda",
    color: "hsl(var(--chart-2))",
  },
  braza: {
    label: "Braza",
    color: "hsl(var(--chart-3))",
  },
  crol: {
    label: "Crol",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export default function PieChartComponent() {
  const totalVisitantes = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitantes, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Estilos de Natación</CardTitle>
        <CardDescription>Distribución por estilos</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitantes"
              nameKey="estilo"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitantes.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitantes
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Distribución de estilos en los últimos 6 meses
        </div>
      </CardFooter>
    </Card>
  );
}
