"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Target, 
  Calendar,
  Zap,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter,
  Download
} from "lucide-react";
import { getSessions } from "@/lib/actions/sessions";
import type { Session } from "@/lib/actions/sessions";
import { format, subDays, subMonths, subWeeks, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

// Colores para las zonas de intensidad
const ZONE_COLORS = {
  z1: "#3b82f6", // Azul
  z2: "#10b981", // Verde
  z3: "#f59e0b", // Amarillo
  z4: "#ef4444", // Rojo
  z5: "#8b5cf6", // Púrpura
};


function AnalysisContent() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("last-30-days");
  const [comparisonPeriod, setComparisonPeriod] = useState("previous-week");

  // Cargar sesiones reales
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

  // Función para filtrar sesiones por período
  const getFilteredSessions = (period: string) => {
    const now = new Date();
    let startDate: Date;
    const endDate = now;

    switch (period) {
      case "last-7-days":
        startDate = subDays(now, 7);
        break;
      case "last-30-days":
        startDate = subDays(now, 30);
        break;
      case "last-3-months":
        startDate = subMonths(now, 3);
        break;
      case "last-6-months":
        startDate = subMonths(now, 6);
        break;
      case "last-year":
        startDate = subMonths(now, 12);
        break;
      default:
        startDate = subDays(now, 30);
    }

    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  };

  // Función para obtener período de comparación
  const getComparisonSessions = (period: string) => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case "previous-week":
        endDate = subWeeks(now, 1);
        startDate = subWeeks(now, 2);
        break;
      case "previous-month":
        endDate = subMonths(now, 1);
        startDate = subMonths(now, 2);
        break;
      case "previous-3-months":
        endDate = subMonths(now, 3);
        startDate = subMonths(now, 6);
        break;
      case "previous-6-months":
        endDate = subMonths(now, 6);
        startDate = subMonths(now, 12);
        break;
      case "same-week-last-year":
        endDate = subMonths(now, 12);
        startDate = subWeeks(subMonths(now, 12), 1);
        break;
      case "same-month-last-year":
        endDate = subMonths(now, 12);
        startDate = subMonths(now, 13);
        break;
      case "best-week":
        // Encontrar la mejor semana
        const allSessions = sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        let bestDistance = 0;
        let bestStart = 0;
        
        for (let i = 0; i < allSessions.length - 7; i++) {
          const weekSessions = allSessions.slice(i, i + 7);
          const totalDistance = weekSessions.reduce((sum, s) => sum + (s.distance || 0), 0);
          if (totalDistance > bestDistance) {
            bestDistance = totalDistance;
            bestStart = i;
          }
        }
        
        return allSessions.slice(bestStart, bestStart + 7);
      case "best-month":
        // Encontrar el mejor mes
        const allSessionsMonth = sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        let bestMonthDistance = 0;
        let bestMonthStart = 0;
        
        for (let i = 0; i < allSessionsMonth.length - 30; i++) {
          const monthSessions = allSessionsMonth.slice(i, i + 30);
          const totalDistance = monthSessions.reduce((sum, s) => sum + (s.distance || 0), 0);
          if (totalDistance > bestMonthDistance) {
            bestMonthDistance = totalDistance;
            bestMonthStart = i;
          }
        }
        
        return allSessionsMonth.slice(bestMonthStart, bestMonthStart + 30);
      default:
        endDate = subWeeks(now, 1);
        startDate = subWeeks(now, 2);
    }

    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  };

  const currentSessions = getFilteredSessions(selectedPeriod);
  const comparisonSessions = getComparisonSessions(comparisonPeriod);

  // Calcular métricas del período actual
  const currentMetrics = {
    totalDistance: currentSessions.reduce((sum, s) => sum + (s.distance || 0), 0),
    totalSessions: currentSessions.length,
    avgDistance: currentSessions.length > 0 ? currentSessions.reduce((sum, s) => sum + (s.distance || 0), 0) / currentSessions.length : 0,
    avgDuration: currentSessions.length > 0 ? currentSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / currentSessions.length : 0,
    avgRPE: currentSessions.length > 0 ? currentSessions.reduce((sum, s) => sum + (s.rpe || 0), 0) / currentSessions.length : 0,
    totalTime: currentSessions.reduce((sum, s) => sum + (s.duration || 0), 0),
  };

  // Calcular métricas del período de comparación
  const comparisonMetrics = {
    totalDistance: comparisonSessions.reduce((sum, s) => sum + (s.distance || 0), 0),
    totalSessions: comparisonSessions.length,
    avgDistance: comparisonSessions.length > 0 ? comparisonSessions.reduce((sum, s) => sum + (s.distance || 0), 0) / comparisonSessions.length : 0,
    avgDuration: comparisonSessions.length > 0 ? comparisonSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / comparisonSessions.length : 0,
    avgRPE: comparisonSessions.length > 0 ? comparisonSessions.reduce((sum, s) => sum + (s.rpe || 0), 0) / comparisonSessions.length : 0,
    totalTime: comparisonSessions.reduce((sum, s) => sum + (s.duration || 0), 0),
  };

  // Función para calcular cambio porcentual
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  // Función para obtener icono de cambio
  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  // Función para obtener color de cambio
  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  };

  // Función para formatear números
  const formatNumber = (num: number) => {
    return num.toLocaleString('es-ES');
  };

  // Función para formatear tiempo
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Análisis por zonas de intensidad
  const getZoneAnalysis = (sessions: Session[]) => {
    const zoneTotals = { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 };
    let totalDistance = 0;

    sessions.forEach(session => {
      if (session.zone_volumes) {
        Object.entries(session.zone_volumes).forEach(([zone, volume]) => {
          if (zone in zoneTotals) {
            zoneTotals[zone as keyof typeof zoneTotals] += volume;
            totalDistance += volume;
          }
        });
      }
    });

    return Object.entries(zoneTotals).map(([zone, distance]) => ({
      zone: `Z${zone.slice(1)}`,
      distance,
      percentage: totalDistance > 0 ? (distance / totalDistance) * 100 : 0,
      color: ZONE_COLORS[zone as keyof typeof ZONE_COLORS]
    }));
  };


  // Análisis semanal
  const getWeeklyAnalysis = (sessions: Session[]) => {
    const weeklyData: { [key: string]: { distance: number; sessions: number; avgRPE: number } } = {};

    sessions.forEach(session => {
      const sessionDate = new Date(session.date);
      const weekStart = startOfWeek(sessionDate, { weekStartsOn: 1 });
      const weekKey = format(weekStart, 'dd/MM', { locale: es });

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { distance: 0, sessions: 0, avgRPE: 0 };
      }

      weeklyData[weekKey].distance += session.distance || 0;
      weeklyData[weekKey].sessions += 1;
      weeklyData[weekKey].avgRPE += session.rpe || 0;
    });

    return Object.entries(weeklyData).map(([week, data]) => ({
      week,
      distance: data.distance,
      sessions: data.sessions,
      avgRPE: data.sessions > 0 ? data.avgRPE / data.sessions : 0
    })).sort((a, b) => a.week.localeCompare(b.week));
  };

  // Análisis de tendencias mensuales
  const getMonthlyAnalysis = (sessions: Session[]) => {
    const monthlyData: { [key: string]: { distance: number; sessions: number; avgRPE: number } } = {};

    sessions.forEach(session => {
      const sessionDate = new Date(session.date);
      const monthKey = format(sessionDate, 'MMM yyyy', { locale: es });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { distance: 0, sessions: 0, avgRPE: 0 };
      }

      monthlyData[monthKey].distance += session.distance || 0;
      monthlyData[monthKey].sessions += 1;
      monthlyData[monthKey].avgRPE += session.rpe || 0;
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      distance: data.distance,
      sessions: data.sessions,
      avgRPE: data.sessions > 0 ? data.avgRPE / data.sessions : 0
    })).sort((a, b) => a.month.localeCompare(b.month));
  };

  // Generar insights automáticos
  const generateInsights = () => {
    const insights = {
      strengths: [] as string[],
      improvements: [] as string[]
    };

    // Análisis de consistencia
    const avgSessionsPerWeek = currentSessions.length / 4; // Aproximado para 30 días
    if (avgSessionsPerWeek >= 4) {
      insights.strengths.push(`Excelente consistencia: ${avgSessionsPerWeek.toFixed(1)} sesiones por semana`);
    } else if (avgSessionsPerWeek < 2) {
      insights.improvements.push(`Aumenta la frecuencia: solo ${avgSessionsPerWeek.toFixed(1)} sesiones por semana`);
    }

    // Análisis de zonas de intensidad
    const zoneAnalysis = getZoneAnalysis(currentSessions);
    const z4z5Percentage = zoneAnalysis.filter(z => z.zone === 'Z4' || z.zone === 'Z5').reduce((sum, z) => sum + z.percentage, 0);
    
    if (z4z5Percentage < 10) {
      insights.improvements.push(`Más trabajo de alta intensidad: solo ${z4z5Percentage.toFixed(1)}% en Z4-Z5`);
    } else if (z4z5Percentage > 30) {
      insights.improvements.push(`Equilibra la intensidad: ${z4z5Percentage.toFixed(1)}% en Z4-Z5 puede ser excesivo`);
    }


    // Análisis de progreso
    const distanceChange = calculateChange(currentMetrics.totalDistance, comparisonMetrics.totalDistance);
    if (distanceChange > 20) {
      insights.strengths.push(`Excelente progreso: +${distanceChange.toFixed(1)}% en distancia`);
    } else if (distanceChange < -10) {
      insights.improvements.push(`Revisa el volumen: -${Math.abs(distanceChange).toFixed(1)}% en distancia`);
    }

    return insights;
  };

  const insights = generateInsights();
  const zoneAnalysis = getZoneAnalysis(currentSessions);
  const weeklyAnalysis = getWeeklyAnalysis(currentSessions);
  const monthlyAnalysis = getMonthlyAnalysis(currentSessions);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Análisis Avanzado</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-muted/50">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Análisis Avanzado</h1>
        </div>
        <p className="text-muted-foreground">
          Análisis detallado de tu rendimiento y progreso basado en datos reales
        </p>
        
        {/* Filtros */}
        <div className="flex gap-4 mt-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-7-days">Últimos 7 días</SelectItem>
                <SelectItem value="last-30-days">Últimos 30 días</SelectItem>
                <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
                <SelectItem value="last-6-months">Últimos 6 meses</SelectItem>
                <SelectItem value="last-year">Último año</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Comparar con:</span>
            <Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="previous-30-days">Período anterior</SelectItem>
                <SelectItem value="same-period-last-year">Mismo período año anterior</SelectItem>
                <SelectItem value="best-period">Mejor período</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distancia Total</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(currentMetrics.totalDistance)}m</div>
            <div className="flex items-center gap-1 text-xs">
              {getChangeIcon(calculateChange(currentMetrics.totalDistance, comparisonMetrics.totalDistance))}
              <span className={getChangeColor(calculateChange(currentMetrics.totalDistance, comparisonMetrics.totalDistance))}>
                {Math.abs(calculateChange(currentMetrics.totalDistance, comparisonMetrics.totalDistance)).toFixed(1)}%
              </span>
              <span className="text-muted-foreground">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiones</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.totalSessions}</div>
            <div className="flex items-center gap-1 text-xs">
              {getChangeIcon(calculateChange(currentMetrics.totalSessions, comparisonMetrics.totalSessions))}
              <span className={getChangeColor(calculateChange(currentMetrics.totalSessions, comparisonMetrics.totalSessions))}>
                {Math.abs(calculateChange(currentMetrics.totalSessions, comparisonMetrics.totalSessions)).toFixed(1)}%
              </span>
              <span className="text-muted-foreground">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intensidad Promedio</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(() => {
                const zoneAnalysis = getZoneAnalysis(currentSessions);
                const weightedIntensity = zoneAnalysis.reduce((sum, zone) => {
                  const zoneNumber = parseInt(zone.zone.replace('Z', ''));
                  return sum + (zone.percentage * zoneNumber);
                }, 0) / 100;
                return weightedIntensity.toFixed(1);
              })()}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-muted-foreground">Volumen total por zona</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frecuencia</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(() => {
                const daysDiff = Math.ceil((new Date().getTime() - new Date(selectedPeriod === "last-7-days" ? subDays(new Date(), 7) : selectedPeriod === "last-30-days" ? subDays(new Date(), 30) : subMonths(new Date(), 3)).getTime()) / (1000 * 60 * 60 * 24));
                return (currentMetrics.totalSessions / daysDiff * 7).toFixed(1);
              })()}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-muted-foreground">sesiones/semana</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Análisis */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="intensity">Intensidad</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Tab: Resumen */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Progreso Mensual */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Progreso Mensual
                </CardTitle>
                <CardDescription>Evolución de la distancia y sesiones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyAnalysis.map((month) => (
                    <div key={month.month} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{month.month}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{formatNumber(month.distance)}m</span>
                          <Badge variant="outline" className="text-xs">
                            {month.sessions} sesiones
                          </Badge>
                        </div>
                      </div>
                      <Progress value={(month.distance / Math.max(...monthlyAnalysis.map(m => m.distance))) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comparación de Períodos */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Comparación de Períodos
                </CardTitle>
                <CardDescription>Período actual vs período anterior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Distancia Total", current: currentMetrics.totalDistance, previous: comparisonMetrics.totalDistance, unit: "m" },
                    { label: "Sesiones", current: currentMetrics.totalSessions, previous: comparisonMetrics.totalSessions, unit: "" },
                    { label: "Tiempo Total", current: currentMetrics.totalTime, previous: comparisonMetrics.totalTime, unit: "min" },
                    { label: "RPE Promedio", current: currentMetrics.avgRPE, previous: comparisonMetrics.avgRPE, unit: "/10" }
                  ].map((metric) => {
                    const change = calculateChange(metric.current, metric.previous);
                    return (
                      <div key={metric.label} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{metric.label}</span>
                          <div className="flex items-center gap-2">
                            {getChangeIcon(change)}
                            <span className={`text-sm font-bold ${getChangeColor(change)}`}>
                              {Math.abs(change).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="text-center p-2 bg-muted rounded">
                            <div className="font-bold">
                              {metric.unit === "m" ? formatNumber(metric.current) : 
                               metric.unit === "min" ? formatTime(metric.current) : 
                               metric.current.toFixed(1)}{metric.unit}
                            </div>
                            <div className="text-xs text-muted-foreground">Actual</div>
                          </div>
                          <div className="text-center p-2 bg-muted rounded">
                            <div className="font-bold">
                              {metric.unit === "m" ? formatNumber(metric.previous) : 
                               metric.unit === "min" ? formatTime(metric.previous) : 
                               metric.previous.toFixed(1)}{metric.unit}
                            </div>
                            <div className="text-xs text-muted-foreground">Anterior</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Tendencias */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6">
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Tendencias Semanales
                </CardTitle>
                <CardDescription>Evolución semanal de distancia y RPE</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      distance: {
                        label: "Distancia (m)",
                      },
                      avgRPE: {
                        label: "RPE Promedio",
                      },
                    }}
                    className="h-full w-full"
                  >
                    <LineChart data={weeklyAnalysis}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line yAxisId="left" type="monotone" dataKey="distance" stroke="#3b82f6" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="avgRPE" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>


        {/* Tab: Intensidad */}
        <TabsContent value="intensity" className="space-y-6">
          {/* Filtros de comparación */}
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Comparar con:</span>
            </div>
            <Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="previous-week">Semana anterior</SelectItem>
                <SelectItem value="previous-month">Mes anterior</SelectItem>
                <SelectItem value="previous-3-months">3 meses anteriores</SelectItem>
                <SelectItem value="previous-6-months">6 meses anteriores</SelectItem>
                <SelectItem value="same-week-last-year">Misma semana año anterior</SelectItem>
                <SelectItem value="same-month-last-year">Mismo mes año anterior</SelectItem>
                <SelectItem value="best-week">Mejor semana</SelectItem>
                <SelectItem value="best-month">Mejor mes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Distribución actual */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Distribución Actual
                </CardTitle>
                <CardDescription>Período seleccionado: {selectedPeriod.replace('last-', 'Últimos ').replace('-', ' ')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {zoneAnalysis.map((zone) => (
                    <div key={zone.zone} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{zone.zone}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{formatNumber(zone.distance)}m</span>
                          <Badge variant="outline" className="text-xs" style={{ backgroundColor: zone.color + '20', color: zone.color }}>
                            {zone.percentage.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={zone.percentage} className="h-3" style={{ backgroundColor: zone.color + '20' }} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Distribución de comparación */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Distribución de Comparación
                </CardTitle>
                <CardDescription>
                  {comparisonPeriod === "previous-week" && "Semana anterior"}
                  {comparisonPeriod === "previous-month" && "Mes anterior"}
                  {comparisonPeriod === "previous-3-months" && "3 meses anteriores"}
                  {comparisonPeriod === "previous-6-months" && "6 meses anteriores"}
                  {comparisonPeriod === "same-week-last-year" && "Misma semana año anterior"}
                  {comparisonPeriod === "same-month-last-year" && "Mismo mes año anterior"}
                  {comparisonPeriod === "best-week" && "Mejor semana"}
                  {comparisonPeriod === "best-month" && "Mejor mes"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    const comparisonZoneAnalysis = getZoneAnalysis(comparisonSessions);
                    return comparisonZoneAnalysis.map((zone) => (
                      <div key={zone.zone} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{zone.zone}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{formatNumber(zone.distance)}m</span>
                            <Badge variant="outline" className="text-xs" style={{ backgroundColor: zone.color + '20', color: zone.color }}>
                              {zone.percentage.toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                        <Progress value={zone.percentage} className="h-3" style={{ backgroundColor: zone.color + '20' }} />
                      </div>
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comparación visual */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Comparación de Intensidad
              </CardTitle>
              <CardDescription>Cambios en la distribución de intensidad entre períodos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(() => {
                  const comparisonZoneAnalysis = getZoneAnalysis(comparisonSessions);
                  return zoneAnalysis.map((currentZone) => {
                    const comparisonZone = comparisonZoneAnalysis.find(z => z.zone === currentZone.zone);
                    const change = comparisonZone ? calculateChange(currentZone.percentage, comparisonZone.percentage) : 0;
                    
                    return (
                      <div key={currentZone.zone} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{currentZone.zone}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {currentZone.percentage.toFixed(1)}% vs {comparisonZone?.percentage.toFixed(1) || 0}%
                            </span>
                            <div className="flex items-center gap-1">
                              {getChangeIcon(change)}
                              <span className={`text-xs font-medium ${getChangeColor(change)}`}>
                                {Math.abs(change).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Actual</div>
                            <Progress value={currentZone.percentage} className="h-2" style={{ backgroundColor: currentZone.color + '20' }} />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Comparación</div>
                            <Progress value={comparisonZone?.percentage || 0} className="h-2" style={{ backgroundColor: currentZone.color + '20' }} />
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </CardContent>
          </Card>

          {/* Análisis por fases de ciclo */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Análisis por Fases de Ciclo
              </CardTitle>
              <CardDescription>Distribución de intensidad por fases de entrenamiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  💡 <strong>Próximamente:</strong> Esta funcionalidad se conectará con las fases de entrenamiento creadas en Planificación para mostrar cómo varía la intensidad según la fase del ciclo (Base, Construcción, Pico, Taper).
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <div className="text-sm font-medium mb-2">Fase Base</div>
                    <div className="text-xs text-muted-foreground">Mayor volumen en Z1-Z2</div>
                  </div>
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <div className="text-sm font-medium mb-2">Fase Construcción</div>
                    <div className="text-xs text-muted-foreground">Incremento en Z3-Z4</div>
                  </div>
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <div className="text-sm font-medium mb-2">Fase Pico</div>
                    <div className="text-xs text-muted-foreground">Máximo en Z4-Z5</div>
                  </div>
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <div className="text-sm font-medium mb-2">Fase Taper</div>
                    <div className="text-xs text-muted-foreground">Reducción gradual</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Insights */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Fortalezas
                </CardTitle>
                <CardDescription>Aspectos positivos de tu entrenamiento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.strengths.length > 0 ? insights.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-green-800 dark:text-green-200">{strength}</div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center text-muted-foreground py-4">
                      No hay fortalezas identificadas en este período
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Áreas de Mejora
                </CardTitle>
                <CardDescription>Oportunidades para optimizar tu entrenamiento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.improvements.length > 0 ? insights.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-orange-800 dark:text-orange-200">{improvement}</div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center text-muted-foreground py-4">
                      ¡Excelente! No se identificaron áreas de mejora
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <AnalysisContent />
      </SidebarInset>
    </SidebarProvider>
  );
}