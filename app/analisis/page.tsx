"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Target, 
  Calendar,
  Clock,
  Zap,
  Award,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter,
  Download
} from "lucide-react";

// Datos de ejemplo para análisis
const sampleData = {
  currentPeriod: {
    totalDistance: 125000,
    totalSessions: 28,
    avgDistance: 4464,
    avgDuration: 65,
    avgRPE: 6.2,
    totalTime: 1820,
    improvement: 12.5
  },
  previousPeriod: {
    totalDistance: 110000,
    totalSessions: 25,
    avgDistance: 4400,
    avgDuration: 62,
    avgRPE: 5.8,
    totalTime: 1550,
    improvement: 8.3
  },
  monthlyData: [
    { month: "Ene", distance: 45000, sessions: 12, avgRPE: 5.5, improvement: 5.2 },
    { month: "Feb", distance: 48000, sessions: 13, avgRPE: 5.8, improvement: 6.7 },
    { month: "Mar", distance: 52000, sessions: 14, avgRPE: 6.1, improvement: 8.3 },
    { month: "Abr", distance: 55000, sessions: 15, avgRPE: 6.3, improvement: 5.8 },
    { month: "May", distance: 58000, sessions: 16, avgRPE: 6.5, improvement: 5.5 },
    { month: "Jun", distance: 62000, sessions: 17, avgRPE: 6.7, improvement: 6.9 }
  ],
  strokeAnalysis: [
    { stroke: "Libre", distance: 75000, percentage: 60, improvement: 15.2 },
    { stroke: "Espalda", distance: 25000, percentage: 20, improvement: 8.5 },
    { stroke: "Pecho", distance: 15000, percentage: 12, improvement: 12.1 },
    { stroke: "Mariposa", distance: 10000, percentage: 8, improvement: 22.3 }
  ],
  intensityDistribution: [
    { zone: "Z1 (Recuperación)", percentage: 25, sessions: 7 },
    { zone: "Z2 (Aeróbico Base)", percentage: 35, sessions: 10 },
    { zone: "Z3 (Aeróbico Umbral)", percentage: 25, sessions: 7 },
    { zone: "Z4 (VO2 Max)", percentage: 10, sessions: 3 },
    { zone: "Z5 (Neuromuscular)", percentage: 5, sessions: 1 }
  ],
  weeklyTrends: [
    { week: "S1", distance: 18000, intensity: 5.5, rpe: 6.2 },
    { week: "S2", distance: 20000, intensity: 6.0, rpe: 6.5 },
    { week: "S3", distance: 22000, intensity: 6.2, rpe: 6.8 },
    { week: "S4", distance: 19000, intensity: 5.8, rpe: 6.3 },
    { week: "S5", distance: 24000, intensity: 6.5, rpe: 7.0 },
    { week: "S6", distance: 21000, intensity: 6.1, rpe: 6.6 }
  ]
};

function AnalysisContent() {
  const [selectedPeriod, setSelectedPeriod] = useState("last-6-months");
  const [comparisonPeriod, setComparisonPeriod] = useState("previous-6-months");

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('es-ES');
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

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
          Análisis detallado de tu rendimiento y progreso
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
                <SelectItem value="previous-period">Período anterior</SelectItem>
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
            <div className="text-2xl font-bold">{formatNumber(sampleData.currentPeriod.totalDistance)}m</div>
            <div className="flex items-center gap-1 text-xs">
              {getChangeIcon(calculateChange(sampleData.currentPeriod.totalDistance, sampleData.previousPeriod.totalDistance))}
              <span className={getChangeColor(calculateChange(sampleData.currentPeriod.totalDistance, sampleData.previousPeriod.totalDistance))}>
                {Math.abs(calculateChange(sampleData.currentPeriod.totalDistance, sampleData.previousPeriod.totalDistance)).toFixed(1)}%
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
            <div className="text-2xl font-bold">{sampleData.currentPeriod.totalSessions}</div>
            <div className="flex items-center gap-1 text-xs">
              {getChangeIcon(calculateChange(sampleData.currentPeriod.totalSessions, sampleData.previousPeriod.totalSessions))}
              <span className={getChangeColor(calculateChange(sampleData.currentPeriod.totalSessions, sampleData.previousPeriod.totalSessions))}>
                {Math.abs(calculateChange(sampleData.currentPeriod.totalSessions, sampleData.previousPeriod.totalSessions)).toFixed(1)}%
              </span>
              <span className="text-muted-foreground">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(sampleData.currentPeriod.totalTime)}</div>
            <div className="flex items-center gap-1 text-xs">
              {getChangeIcon(calculateChange(sampleData.currentPeriod.totalTime, sampleData.previousPeriod.totalTime))}
              <span className={getChangeColor(calculateChange(sampleData.currentPeriod.totalTime, sampleData.previousPeriod.totalTime))}>
                {Math.abs(calculateChange(sampleData.currentPeriod.totalTime, sampleData.previousPeriod.totalTime)).toFixed(1)}%
              </span>
              <span className="text-muted-foreground">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RPE Promedio</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleData.currentPeriod.avgRPE}/10</div>
            <div className="flex items-center gap-1 text-xs">
              {getChangeIcon(calculateChange(sampleData.currentPeriod.avgRPE, sampleData.previousPeriod.avgRPE))}
              <span className={getChangeColor(calculateChange(sampleData.currentPeriod.avgRPE, sampleData.previousPeriod.avgRPE))}>
                {Math.abs(calculateChange(sampleData.currentPeriod.avgRPE, sampleData.previousPeriod.avgRPE)).toFixed(1)}%
              </span>
              <span className="text-muted-foreground">vs período anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Análisis */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="strokes">Estilos</TabsTrigger>
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
                  {sampleData.monthlyData.map((month) => (
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
                      <Progress value={(month.distance / 65000) * 100} className="h-2" />
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        <span>+{month.improvement}% vs mes anterior</span>
                      </div>
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
                    { label: "Distancia Total", current: sampleData.currentPeriod.totalDistance, previous: sampleData.previousPeriod.totalDistance, unit: "m" },
                    { label: "Sesiones", current: sampleData.currentPeriod.totalSessions, previous: sampleData.previousPeriod.totalSessions, unit: "" },
                    { label: "Tiempo Total", current: sampleData.currentPeriod.totalTime, previous: sampleData.previousPeriod.totalTime, unit: "min" },
                    { label: "RPE Promedio", current: sampleData.currentPeriod.avgRPE, previous: sampleData.previousPeriod.avgRPE, unit: "/10" }
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
                               metric.current}{metric.unit}
                            </div>
                            <div className="text-xs text-muted-foreground">Actual</div>
                          </div>
                          <div className="text-center p-2 bg-muted rounded">
                            <div className="font-bold">
                              {metric.unit === "m" ? formatNumber(metric.previous) : 
                               metric.unit === "min" ? formatTime(metric.previous) : 
                               metric.previous}{metric.unit}
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
                <CardDescription>Evolución semanal de distancia, intensidad y RPE</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleData.weeklyTrends.map((week) => (
                    <div key={week.week} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{week.week}</h4>
                        <Badge variant="outline">RPE {week.rpe}/10</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Distancia</span>
                            <span className="font-bold">{formatNumber(week.distance)}m</span>
                          </div>
                          <Progress value={(week.distance / 25000) * 100} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Intensidad</span>
                            <span className="font-bold">{week.intensity}/10</span>
                          </div>
                          <Progress value={week.intensity * 10} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Estilos */}
        <TabsContent value="strokes" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Distribución por Estilos
                </CardTitle>
                <CardDescription>Distancia y mejora por estilo de natación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleData.strokeAnalysis.map((stroke) => (
                    <div key={stroke.stroke} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{stroke.stroke}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{formatNumber(stroke.distance)}m</span>
                          <Badge variant="outline" className="text-xs">
                            {stroke.percentage}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={stroke.percentage} className="h-2" />
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        <span>+{stroke.improvement}% mejora</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Mejores Estilos
                </CardTitle>
                <CardDescription>Ranking de mejora por estilo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sampleData.strokeAnalysis
                    .sort((a, b) => b.improvement - a.improvement)
                    .map((stroke, index) => (
                    <div key={stroke.stroke} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{stroke.stroke}</div>
                        <div className="text-sm text-muted-foreground">{formatNumber(stroke.distance)}m</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600">+{stroke.improvement}%</div>
                        <div className="text-xs text-muted-foreground">mejora</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Intensidad */}
        <TabsContent value="intensity" className="space-y-6">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Distribución de Intensidad
              </CardTitle>
              <CardDescription>Porcentaje de tiempo en cada zona de intensidad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleData.intensityDistribution.map((zone) => (
                  <div key={zone.zone} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{zone.zone}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{zone.sessions} sesiones</span>
                        <Badge variant="outline" className="text-xs">
                          {zone.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={zone.percentage} className="h-3" />
                  </div>
                ))}
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
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-800 dark:text-green-200">Consistencia Excelente</div>
                      <div className="text-sm text-green-600 dark:text-green-300">Has mantenido 28 sesiones en el período actual</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-800 dark:text-green-200">Mejora en Mariposa</div>
                      <div className="text-sm text-green-600 dark:text-green-300">+22.3% de mejora en el estilo más técnico</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-800 dark:text-green-200">Distribución Equilibrada</div>
                      <div className="text-sm text-green-600 dark:text-green-300">Buena distribución entre zonas de intensidad</div>
                    </div>
                  </div>
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
                  <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-orange-800 dark:text-orange-200">Más Zona 4-5</div>
                      <div className="text-sm text-orange-600 dark:text-orange-300">Solo 15% en zonas de alta intensidad</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-orange-800 dark:text-orange-200">Tiempo de Recuperación</div>
                      <div className="text-sm text-orange-600 dark:text-orange-300">Considera más sesiones de recuperación activa</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-orange-800 dark:text-orange-200">Variedad de Estilos</div>
                      <div className="text-sm text-orange-600 dark:text-orange-300">Más trabajo en pecho y espalda</div>
                    </div>
                  </div>
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
