'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSessionsData } from '@/core/hooks/use-sessions-data';
import { BarChart3, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';

import { chartConfig as baseChartConfig } from '@/configs/chart';

// Colores de zonas usando configuración centralizada
const chartConfig = {
  Z1: { label: 'Zone 1', color: baseChartConfig.colors.zones[0] }, // Green - Recovery
  Z2: { label: 'Zone 2', color: baseChartConfig.colors.zones[1] }, // Blue - Aerobic Base
  Z3: { label: 'Zone 3', color: baseChartConfig.colors.zones[2] }, // Yellow - Aerobic Threshold
  Z4: { label: 'Zone 4', color: baseChartConfig.colors.zones[3] }, // Orange - VO2 Max
  Z5: { label: 'Zone 5', color: baseChartConfig.colors.zones[4] }, // Red - Neuromuscular
} satisfies ChartConfig;

// Componente helper para evitar duplicar icono + texto
const ChartTypeOption = ({ type }: { type: 'bar' | 'line' }) => (
  <div className="flex items-center gap-1.5">
    {type === 'bar' ? (
      <BarChart3 className="h-3.5 w-3.5" />
    ) : (
      <TrendingUp className="h-3.5 w-3.5" />
    )}
    <span>{type === 'bar' ? 'Bar Chart' : 'Line Chart'}</span>
  </div>
);

export function VisitorsChartSimple() {
  const { sessions, isLoading } = useSessionsData();
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  
  // Generar datos semanales
  const generateSimpleData = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(today.getDate() - daysToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return Array.from({ length: 7 }, (_, index) => {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + index);

      const dayName = daysOfWeek[index];
      const daySessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate.toDateString() === currentDay.toDateString();
      });

      const dayZones = { Z1: 0, Z2: 0, Z3: 0, Z4: 0, Z5: 0 };

      daySessions.forEach(session => {
        if (session.zone_volumes) {
          dayZones.Z1 += session.zone_volumes.z1 || 0;
          dayZones.Z2 += session.zone_volumes.z2 || 0;
          dayZones.Z3 += session.zone_volumes.z3 || 0;
          dayZones.Z4 += session.zone_volumes.z4 || 0;
          dayZones.Z5 += session.zone_volumes.z5 || 0;
        }
      });

      const totalMeters = Object.values(dayZones).reduce((sum, m) => sum + m, 0);

      return {
        day: dayName,
        Z1: +(dayZones.Z1 / 1000).toFixed(1),
        Z2: +(dayZones.Z2 / 1000).toFixed(1),
        Z3: +(dayZones.Z3 / 1000).toFixed(1),
        Z4: +(dayZones.Z4 / 1000).toFixed(1),
        Z5: +(dayZones.Z5 / 1000).toFixed(1),
        totalMeters,
      };
    });
  };

  const chartData = generateSimpleData();

  // Si no hay datos, usar sample
  const hasData = chartData.some(
    day => day.Z1 > 0 || day.Z2 > 0 || day.Z3 > 0 || day.Z4 > 0 || day.Z5 > 0
  );

  const finalData = hasData
    ? chartData
    : [
    { day: 'Mon', Z1: 0.5, Z2: 0.3, Z3: 0.2, Z4: 0.1, Z5: 0.0 },
    { day: 'Tue', Z1: 0.8, Z2: 0.4, Z3: 0.3, Z4: 0.2, Z5: 0.1 },
    { day: 'Wed', Z1: 0.2, Z2: 0.6, Z3: 0.4, Z4: 0.3, Z5: 0.2 },
    { day: 'Thu', Z1: 0.6, Z2: 0.3, Z3: 0.5, Z4: 0.4, Z5: 0.3 },
    { day: 'Fri', Z1: 0.4, Z2: 0.5, Z3: 0.3, Z4: 0.2, Z5: 0.1 },
    { day: 'Sat', Z1: 0.7, Z2: 0.2, Z3: 0.4, Z4: 0.3, Z5: 0.2 },
    { day: 'Sun', Z1: 0.3, Z2: 0.4, Z3: 0.2, Z4: 0.1, Z5: 0.0 },
  ];

  // Calcular el valor máximo y agregar margen superior del 30%
  const maxValue = Math.max(
    ...finalData.map(day => day.Z1 + day.Z2 + day.Z3 + day.Z4 + day.Z5)
  );
  const yAxisMax = maxValue > 0 ? Math.ceil(maxValue * 1.3) : 5; // Margen del 30% o mínimo 5

  // Stats
  const totalWeekly = finalData.reduce(
    (total, day) => total + day.Z1 + day.Z2 + day.Z3 + day.Z4 + day.Z5,
    0
  );
  const dailyAverage = totalWeekly / 7;
  const currentWeekSessions = chartData.filter(
    day => day.Z1 > 0 || day.Z2 > 0 || day.Z3 > 0 || day.Z4 > 0 || day.Z5 > 0
  ).length;
  
  // Renderizador de gráficos
  const renderChart = () => (
          <ChartContainer config={chartConfig}>
      {chartType === 'bar' ? (
            <BarChart accessibilityLayer data={finalData}>
              <CartesianGrid vertical={false} />
          <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={v => `${v}km`}
                domain={[0, yAxisMax]}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
          {Object.entries(chartConfig).map(([key, { color }], i) => (
              <Bar
              key={key}
              dataKey={key}
                stackId="a"
              fill={color}
              radius={i === 0 ? [0, 0, 4, 4] : i === 4 ? [4, 4, 0, 0] : 0}
            />
          ))}
        </BarChart>
      ) : (
        <LineChart accessibilityLayer data={finalData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={v => `${v}km`}
            domain={[0, yAxisMax]}
          />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <ChartLegend content={<ChartLegendContent />} />
          {Object.entries(chartConfig).map(([key, { color }]) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      )}
          </ChartContainer>
  );

  if (isLoading) {
    return (
      <Card className="col-span-4 bg-muted/50 border-muted">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
          <CardTitle className="text-lg font-semibold">Weekly Progress</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Distance by training zones
          </CardDescription>
            </div>
            <Select
              value={chartType}
              onValueChange={(value: 'bar' | 'line') => setChartType(value)}
              aria-label="Select chart type"
            >
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue>
                  <ChartTypeOption type={chartType} />
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar"><ChartTypeOption type="bar" /></SelectItem>
                <SelectItem value="line"><ChartTypeOption type="line" /></SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4 bg-muted/50 border-muted">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Weekly Progress</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Distance by training zones
            </CardDescription>
          </div>
          <Select
            value={chartType}
            onValueChange={(value: 'bar' | 'line') => setChartType(value)}
            aria-label="Select chart type"
          >
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue>
                <ChartTypeOption type={chartType} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar"><ChartTypeOption type="bar" /></SelectItem>
              <SelectItem value="line"><ChartTypeOption type="line" /></SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}
        
        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-foreground">{totalWeekly.toFixed(1)}km</div>
            <div className="text-xs text-muted-foreground">Total Distance</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-foreground">{dailyAverage.toFixed(1)}km</div>
            <div className="text-xs text-muted-foreground">Daily Average</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-foreground">{currentWeekSessions}</div>
            <div className="text-xs text-muted-foreground">Sessions</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
