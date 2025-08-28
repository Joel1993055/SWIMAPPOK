"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { week: "Week 1", total: 25, ga1: 20, ga2: 3 },
  { week: "Week 2", total: 25, ga1: 22, ga2: 6 },
  { week: "Week 3", total: 28, ga1: 21, ga2: 7 },
  { week: "Week 4", total: 32, ga1: 24, ga2: 8 },
  { week: "Week 5", total: 34, ga1: 19, ga2: 8 },
  { week: "Week 6", total: 33, ga1: 26, ga2: 9 },
  { week: "Week 7", total: 33, ga1: 25, ga2: 8 },
  { week: "Week 8", total: 33, ga1: 22, ga2: 9 },
  { week: "Week 9", total: 30, ga1: 21, ga2: 8 },
  { week: "Week 10", total: 32, ga1: 27, ga2: 12 },
  { week: "Week 11", total: 30, ga1: 28, ga2: 8 },
  { week: "Week 12", total: 29, ga1: 23, ga2: 9 },
  { week: "Week 13", total: 20, ga1: 22, ga2: 8 },
  { week: "Week 14", total: 30, ga1: 26, ga2: 9 },
  { week: "Week 15", total: 33, ga1: 29, ga2: 8 },
  { week: "Week 16", total: 32, ga1: 30, ga2: 8 },
  { week: "Week 17", total: 39, ga1: 32, ga2: 8 },
  { week: "Week 18", total: 40, ga1: 33, ga2: 8 },
  { week: "Week 19", total: 39, ga1: 31, ga2: 8 },
  { week: "Week 20", total: 42, ga1: 34, ga2: 8 },
  { week: "Week 21", total: 40, ga1: 32, ga2: 8 },
  { week: "Week 22", total: 33, ga1: 28, ga2: 9 },
  { week: "Week 23", total: 30, ga1: 26, ga2: 9 },
  { week: "Week 24", total: 29, ga1: 27, ga2: 9 },
  { week: "Week 25", total: 23, ga1: 30, ga2: 8 },
  { week: "Week 26", total: 19, ga1: 31, ga2: 8 },
  { week: "Week 27", total: 20, ga1: 32, ga2: 8 },
  { week: "Week 28", total: 32, ga1: 34, ga2: 8 },
  { week: "Week 29", total: 34, ga1: 35, ga2: 9 },
  { week: "Week 30", total: 41, ga1: 33, ga2: 8 },
  { week: "Week 31", total: 39, ga1: 31, ga2: 8 },
  { week: "Week 32", total: 38, ga1: 30, ga2: 8 },
  { week: "Week 33", total: 36, ga1: 28, ga2: 10 },
  { week: "Week 34", total: 35, ga1: 27, ga2: 12 },
  { week: "Week 35", total: 34, ga1: 26, ga2: 14 },
  { week: "Week 36", total: 33, ga1: 25, ga2: 14 },
  { week: "Week 37", total: 32, ga1: 24, ga2: 15 },
  { week: "Week 38", total: 30, ga1: 22, ga2: 8 },
  { week: "Week 39", total: 29, ga1: 21, ga2: 8 },
  { week: "Week 40", total: 34, ga1: 21, ga2: 7 },
  { week: "Week 41", total: 27, ga1: 20, ga2: 7 },
  { week: "Week 42", total: 23, ga1: 19, ga2: 7 },
  { week: "Week 43", total: 20, ga1: 18, ga2: 7 },
  { week: "Week 44", total: 18, ga1: 17, ga2: 7 },
  { week: "Week 45", total: 23, ga1: 16, ga2: 7 },
  { week: "Week 46", total: 26, ga1: 15, ga2: 7 },
  { week: "Week 47", total: 29, ga1: 14, ga2: 7 },
  { week: "Week 48", total: 33, ga1: 13, ga2: 7 },
  { week: "Week 49", total: 36, ga1: 12, ga2: 7 },
  { week: "Week 50", total: 29, ga1: 11, ga2: 7 },
  { week: "Week 51", total: 20, ga1: 10, ga2: 7 },
  { week: "Week 52", total: 16, ga1: 9, ga2: 7 },
];

const chartConfig = {
  total: {
    label: "Total Volume (KM)",
    color: "hsl(var(--chart-1))",
  },
  ga1: {
    label: "GA1 Volume (KM)",
    color: "hsl(var(--chart-2))",
  },
  ga2: {
    label: "GA2 Volume (KM)",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function VolumeBarchart() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("total");

  const total = React.useMemo(
    () => ({
      total: chartData.reduce((acc, curr) => acc + curr.total, 0),
      ga1: chartData.reduce((acc, curr) => acc + curr.ga1, 0),
      ga2: chartData.reduce((acc, curr) => acc + curr.ga2, 0),
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Weekly Volume - KM</CardTitle>
          <CardDescription>Showing training volume for each week</CardDescription>
        </div>
        <div className="flex">
          {["total", "ga1", "ga2"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">{chartConfig[chart].label}</span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()} KM
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="volume"
                  labelFormatter={(value) => value}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}