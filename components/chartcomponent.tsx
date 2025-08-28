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

// Datos del gráfico con GA1 y GA2
const chartData = [
  { date: "2024-04-01", GA1: 222, GA2: 150 },
  { date: "2024-04-02", GA1: 97, GA2: 180 },
  { date: "2024-04-03", GA1: 167, GA2: 120 },
  { date: "2024-04-04", GA1: 242, GA2: 260 },
  { date: "2024-04-05", GA1: 373, GA2: 290 },
  { date: "2024-04-06", GA1: 301, GA2: 340 },
  { date: "2024-04-07", GA1: 245, GA2: 180 },
  { date: "2024-04-08", GA1: 409, GA2: 320 },
  { date: "2024-04-09", GA1: 59, GA2: 110 },
  { date: "2024-04-10", GA1: 261, GA2: 190 },
  { date: "2024-04-11", GA1: 327, GA2: 350 },
  { date: "2024-04-12", GA1: 292, GA2: 210 },
  { date: "2024-04-13", GA1: 342, GA2: 380 },
  { date: "2024-04-14", GA1: 137, GA2: 220 },
  { date: "2024-04-15", GA1: 120, GA2: 170 },
  { date: "2024-04-16", GA1: 138, GA2: 190 },
  { date: "2024-04-17", GA1: 446, GA2: 360 },
  { date: "2024-04-18", GA1: 364, GA2: 410 },
  { date: "2024-04-19", GA1: 243, GA2: 180 },
  { date: "2024-04-20", GA1: 89, GA2: 150 },
  { date: "2024-04-21", GA1: 137, GA2: 200 },
  { date: "2024-04-22", GA1: 224, GA2: 170 },
  { date: "2024-04-23", GA1: 138, GA2: 230 },
  { date: "2024-04-24", GA1: 387, GA2: 290 },
  { date: "2024-04-25", GA1: 215, GA2: 250 },
  { date: "2024-04-26", GA1: 75, GA2: 130 },
  { date: "2024-04-27", GA1: 383, GA2: 420 },
  { date: "2024-04-28", GA1: 122, GA2: 180 },
  { date: "2024-04-29", GA1: 315, GA2: 240 },
  { date: "2024-04-30", GA1: 454, GA2: 380 },
  { date: "2024-05-01", GA1: 165, GA2: 220 },
  { date: "2024-05-02", GA1: 293, GA2: 310 },
  { date: "2024-05-03", GA1: 247, GA2: 190 },
  { date: "2024-05-04", GA1: 385, GA2: 420 },
  { date: "2024-05-05", GA1: 481, GA2: 390 },
  { date: "2024-05-06", GA1: 498, GA2: 520 },
  { date: "2024-05-07", GA1: 388, GA2: 300 },
  { date: "2024-05-08", GA1: 149, GA2: 210 },
  { date: "2024-05-09", GA1: 227, GA2: 180 },
  { date: "2024-05-10", GA1: 293, GA2: 330 },
  { date: "2024-05-11", GA1: 335, GA2: 270 },
  { date: "2024-05-12", GA1: 197, GA2: 240 },
  { date: "2024-05-13", GA1: 197, GA2: 160 },
  { date: "2024-05-14", GA1: 448, GA2: 490 },
  { date: "2024-05-15", GA1: 473, GA2: 380 },
  { date: "2024-05-16", GA1: 338, GA2: 400 },
  { date: "2024-05-17", GA1: 499, GA2: 420 },
  { date: "2024-05-18", GA1: 315, GA2: 350 },
  { date: "2024-05-19", GA1: 235, GA2: 180 },
  { date: "2024-05-20", GA1: 177, GA2: 230 },
  { date: "2024-05-21", GA1: 82, GA2: 140 },
  { date: "2024-05-22", GA1: 81, GA2: 120 },
  { date: "2024-05-23", GA1: 252, GA2: 290 },
  { date: "2024-05-24", GA1: 294, GA2: 220 },
  { date: "2024-05-25", GA1: 201, GA2: 250 },
  { date: "2024-05-26", GA1: 213, GA2: 170 },
  { date: "2024-05-27", GA1: 420, GA2: 460 },
  { date: "2024-05-28", GA1: 233, GA2: 190 },
  { date: "2024-05-29", GA1: 78, GA2: 130 },
  { date: "2024-05-30", GA1: 340, GA2: 280 },
  { date: "2024-05-31", GA1: 178, GA2: 230 },
  { date: "2024-06-01", GA1: 178, GA2: 200 },
  { date: "2024-06-02", GA1: 470, GA2: 410 },
  { date: "2024-06-03", GA1: 103, GA2: 160 },
  { date: "2024-06-04", GA1: 439, GA2: 380 },
  { date: "2024-06-05", GA1: 88, GA2: 140 },
  { date: "2024-06-06", GA1: 294, GA2: 250 },
  { date: "2024-06-07", GA1: 323, GA2: 370 },
  { date: "2024-06-08", GA1: 385, GA2: 320 },
  { date: "2024-06-09", GA1: 438, GA2: 480 },
  { date: "2024-06-10", GA1: 155, GA2: 200 },
  { date: "2024-06-11", GA1: 92, GA2: 150 },
  { date: "2024-06-12", GA1: 492, GA2: 420 },
  { date: "2024-06-13", GA1: 81, GA2: 130 },
  { date: "2024-06-14", GA1: 426, GA2: 380 },
  { date: "2024-06-15", GA1: 307, GA2: 350 },
  { date: "2024-06-16", GA1: 371, GA2: 310 },
  { date: "2024-06-17", GA1: 475, GA2: 520 },
  { date: "2024-06-18", GA1: 107, GA2: 170 },
  { date: "2024-06-19", GA1: 341, GA2: 290 },
  { date: "2024-06-20", GA1: 408, GA2: 450 },
  { date: "2024-06-21", GA1: 169, GA2: 210 },
  { date: "2024-06-22", GA1: 317, GA2: 270 },
  { date: "2024-06-23", GA1: 480, GA2: 530 },
  { date: "2024-06-24", GA1: 132, GA2: 180 },
  { date: "2024-06-25", GA1: 141, GA2: 190 },
  { date: "2024-06-26", GA1: 434, GA2: 380 },
  { date: "2024-06-27", GA1: 448, GA2: 490 },
  { date: "2024-06-28", GA1: 149, GA2: 200 },
  { date: "2024-06-29", GA1: 103, GA2: 160 },
  { date: "2024-06-30", GA1: 446, GA2: 400 },
];

// Configuración del gráfico
const chartConfig = {
  GA1: {
    label: "GA1",
    color: "hsl(var(--chart-1))",
  },
  GA2: {
    label: "GA2",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function ChartComponent() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Gráfico Volumen total</CardTitle>
          <CardDescription>
            Mostrando los últimos 3 meses
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
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillGA1" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-GA1)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-GA1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillGA2" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-GA2)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-GA2)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("es-ES", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("es-ES", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="GA2"
              type="natural"
              fill="url(#fillGA2)"
              stroke="var(--color-GA2)"
              stackId="a"
            />
            <Area
              dataKey="GA1"
              type="natural"
              fill="url(#fillGA1)"
              stroke="var(--color-GA1)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
