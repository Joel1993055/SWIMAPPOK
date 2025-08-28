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

const chartData = [
  { month: "January", aerobico: 186, anaerobico: 80 },
  { month: "February", aerobico: 305, anaerobico: 200 },
  { month: "March", aerobico: 237, anaerobico: 120 },
  { month: "April", aerobico: 73, anaerobico: 190 },
  { month: "May", aerobico: 209, anaerobico: 130 },
  { month: "June", aerobico: 214, anaerobico: 140 },
];

const chartConfig = {
  aerobico: {
    label: "Aeróbico",
    color: "hsl(var(--chart-1))",
  },
  anaerobico: {
    label: "Anaeróbico",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function BarStackedChartLegend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Stacked + Legend</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="aerobico"
              stackId="a"
              fill="var(--color-aerobico)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="anaerobico"
              stackId="a"
              fill="var(--color-anaerobico)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
