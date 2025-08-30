"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, Target, Activity, BarChart3, Zap, TrendingDown, Minus } from "lucide-react";
import { useSessionsStore } from "@/lib/store/sessions";
import { ChartCardWrapper } from "./chart-card-wrapper";
import VolumeBarchart from "@/components/barchart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function AnalyticsContent() {
  const { sessions } = useSessionsStore();
  const [selectedMonth1, setSelectedMonth1] = useState("2024-06");
  const [selectedMonth2, setSelectedMonth2] = useState("2024-05");

  // Función helper para calcular métricas del mes anterior
  const getPreviousMonthMetrics = () => {
    const now = new Date();
    const previousMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const previousMonthStr = `${now.getFullYear()}-${(previousMonth + 1).toString().padStart(2, '0')}`;
    
    const previousMonthSessions = sessions.filter(s => s.date.startsWith(previousMonthStr));
    const previousMonthDistance = previousMonthSessions.reduce((sum, s) => sum + s.distance, 0);
    const previousMonthCount = previousMonthSessions.length;
    
    return { distance: previousMonthDistance, count: previousMonthCount };
  };

  // Función helper para calcular métricas del mes actual
  const getCurrentMonthMetrics = () => {
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    
    const currentMonthSessions = sessions.filter(s => s.date.startsWith(currentMonthStr));
    const currentMonthDistance = currentMonthSessions.reduce((sum, s) => sum + s.distance, 0);
    const currentMonthCount = currentMonthSessions.length;
    
    return { distance: currentMonthDistance, count: currentMonthCount };
  };

  // Función helper para obtener métricas de un mes específico
  const getMonthMetrics = (monthStr: string) => {
    const monthSessions = sessions.filter(s => s.date.startsWith(monthStr));
    const monthDistance = monthSessions.reduce((sum, s) => sum + s.distance, 0);
    const monthCount = monthSessions.length;
    
    return { distance: monthDistance, count: monthCount };
  };

  // Función helper para obtener métricas de los últimos 6 meses
  const getLast6MonthsMetrics = () => {
    const now = new Date();
    const months = [];
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = `${month.getFullYear()}-${(month.getMonth() + 1).toString().padStart(2, '0')}`;
      const monthSessions = sessions.filter(s => s.date.startsWith(monthStr));
      const monthDistance = monthSessions.reduce((sum, s) => sum + s.distance, 0);
      const monthCount = monthSessions.length;
      
      months.push({
        month: month.toLocaleDateString('es-ES', { month: 'short' }),
        monthStr,
        distance: monthDistance,
        count: monthCount
      });
    }
    
    return months;
  };

  const currentMetrics = getCurrentMonthMetrics();
  const previousMetrics = getPreviousMonthMetrics();
  const last6Months = getLast6MonthsMetrics();
  
  // Obtener métricas de los meses seleccionados para comparación
  const month1Metrics = getMonthMetrics(selectedMonth1);
  const month2Metrics = getMonthMetrics(selectedMonth2);

  // Calcular cambios porcentuales
  const distanceChange = previousMetrics.distance > 0 
    ? ((currentMetrics.distance - previousMetrics.distance) / previousMetrics.distance * 100).toFixed(1)
    : 0;
  
  const countChange = previousMetrics.count > 0 
    ? ((currentMetrics.count - previousMetrics.count) / previousMetrics.count * 100).toFixed(1)
    : 0;

  // Calcular comparación entre meses seleccionados
  const comparisonDistanceChange = month2Metrics.distance > 0 
    ? ((month1Metrics.distance - month2Metrics.distance) / month2Metrics.distance * 100).toFixed(1)
    : 0;
  
  const comparisonCountChange = month2Metrics.count > 0 
    ? ((month1Metrics.count - month2Metrics.count) / previousMetrics.count * 100).toFixed(1)
    : 0;

  // Calcular tendencia general (últimos 3 meses vs anteriores 3 meses)
  const recentMonths = last6Months.slice(-3);
  const olderMonths = last6Months.slice(0, 3);
  
  const recentAvgDistance = recentMonths.reduce((sum, m) => sum + m.distance, 0) / 3;
  const olderAvgDistance = olderMonths.reduce((sum, m) => sum + m.distance, 0) / 3;
  
  const overallTrend = olderAvgDistance > 0 
    ? ((recentAvgDistance - olderAvgDistance) / olderAvgDistance * 100).toFixed(1)
    : 0;

  // Generar opciones de meses para el selector
  const monthOptions = last6Months.map(month => ({
    value: month.monthStr,
    label: month.month
  }));

  // Función helper para obtener el icono de tendencia
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  // Función helper para obtener el color de la tendencia
  const getTrendColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-8">
      {/* Header Principal con Resumen Ejecutivo */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Analytics Dashboard
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Análisis profundo de tu rendimiento, tendencias y progreso a lo largo del tiempo
          </p>
        </div>
        
        {/* KPIs Principales en Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Tendencia General */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">
                {parseFloat(overallTrend) >= 0 ? '+' : ''}{overallTrend}%
              </div>
              <p className="text-sm font-medium">Tendencia General</p>
              <p className="text-xs text-muted-foreground mt-1">
                Últimos 3 meses vs anteriores
              </p>
            </CardContent>
          </Card>

          {/* Mes Actual */}
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 dark:border-green-800">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.round(currentMetrics.distance / 1000 * 10) / 10}k
              </div>
              <p className="text-sm font-medium">Este Mes</p>
              <p className="text-xs text-muted-foreground mt-1">
                {currentMetrics.count} sesiones
              </p>
            </CardContent>
          </Card>

          {/* Comparación Mensual */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 dark:border-blue-800">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {parseFloat(distanceChange) >= 0 ? '+' : ''}{distanceChange}%
              </div>
              <p className="text-sm font-medium">vs Mes Anterior</p>
              <p className="text-xs text-muted-foreground mt-1">
                Cambio en distancia
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* Sección de Comparativas Personalizadas */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold">Comparativas Personalizadas</h3>
          <p className="text-muted-foreground">
            Analiza tu rendimiento entre diferentes períodos de tiempo
          </p>
        </div>

        {/* Comparativa entre meses elegidos */}
        <Card className="border-2 border-primary/10">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Comparativa entre Meses
            </CardTitle>
            <CardDescription>
              Selecciona dos meses para comparar tu rendimiento
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Selectores de meses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Mes a Analizar
                </Label>
                <Select value={selectedMonth1} onValueChange={setSelectedMonth1}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecciona mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Mes de Referencia
                </Label>
                <Select value={selectedMonth2} onValueChange={setSelectedMonth2}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecciona mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Resultados de la comparación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Distancia */}
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">Distancia Total</h4>
                </div>
                <div className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                  {Math.round(month1Metrics.distance / 1000 * 10) / 10}k
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getTrendIcon(parseFloat(comparisonDistanceChange))}
                  <span className={`text-lg font-semibold ${getTrendColor(parseFloat(comparisonDistanceChange))}`}>
                    {parseFloat(comparisonDistanceChange) >= 0 ? '+' : ''}{comparisonDistanceChange}%
                  </span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  vs {Math.round(month2Metrics.distance / 1000 * 10) / 10}k del mes base
                </p>
              </div>

              {/* Sesiones */}
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-900 dark:text-green-100">Número de Sesiones</h4>
                </div>
                <div className="text-4xl font-bold text-green-900 dark:text-green-100 mb-2">
                  {month1Metrics.count}
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getTrendIcon(parseFloat(comparisonCountChange))}
                  <span className={`text-lg font-semibold ${getTrendColor(parseFloat(comparisonCountChange))}`}>
                    {parseFloat(comparisonCountChange) >= 0 ? '+' : ''}{comparisonCountChange}%
                  </span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  vs {month2Metrics.count} del mes base
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Sección de Análisis Temporal */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold">Análisis Temporal</h3>
          <p className="text-muted-foreground">
            Evolución de tu rendimiento a lo largo del tiempo
          </p>
        </div>

        {/* Gráfico de evolución */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Evolución de 6 Meses
            </CardTitle>
            <CardDescription>
              Tendencias de distancia y sesiones en el tiempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartCardWrapper 
              title="Evolución Mensual" 
              description="Distancia y sesiones por mes"
            >
              <VolumeBarchart />
            </ChartCardWrapper>
          </CardContent>
        </Card>

        {/* Resumen mensual en grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Resumen Mensual
            </CardTitle>
            <CardDescription>
              Desglose detallado de los últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {last6Months.map((month, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                  <div className="text-sm font-semibold text-muted-foreground mb-2">
                    {month.month}
                  </div>
                  <div className="text-xl font-bold mb-1">
                    {Math.round(month.distance / 1000 * 10) / 10}k
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {month.count} sesiones
                  </div>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {Math.round(month.distance / month.count)}m/sesión
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
