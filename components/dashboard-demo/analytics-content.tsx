"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, Target, Activity, BarChart3 } from "lucide-react";
import { useSessionsStore } from "@/lib/store/sessions";
import { ChartCardWrapper } from "./chart-card-wrapper";
import VolumeBarchart from "@/components/barchart";

export function AnalyticsContent() {
  const { sessions } = useSessionsStore();

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
        distance: monthDistance,
        count: monthCount
      });
    }
    
    return months;
  };

  const currentMetrics = getCurrentMonthMetrics();
  const previousMetrics = getPreviousMonthMetrics();
  const last6Months = getLast6MonthsMetrics();

  // Calcular cambios porcentuales
  const distanceChange = previousMetrics.distance > 0 
    ? ((currentMetrics.distance - previousMetrics.distance) / previousMetrics.distance * 100).toFixed(1)
    : 0;
  
  const countChange = previousMetrics.count > 0 
    ? ((currentMetrics.count - previousMetrics.count) / previousMetrics.count * 100).toFixed(1)
    : 0;

  // Calcular tendencia general (últimos 3 meses vs anteriores 3 meses)
  const recentMonths = last6Months.slice(-3);
  const olderMonths = last6Months.slice(0, 3);
  
  const recentAvgDistance = recentMonths.reduce((sum, m) => sum + m.distance, 0) / 3;
  const olderAvgDistance = olderMonths.reduce((sum, m) => sum + m.distance, 0) / 3;
  
  const overallTrend = olderAvgDistance > 0 
    ? ((recentAvgDistance - olderAvgDistance) / olderAvgDistance * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header de Analytics */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Analytics</h2>
        <p className="text-muted-foreground">
          Análisis profundo de tu rendimiento y tendencias
        </p>
      </div>

      {/* Resumen de tendencia general */}
      <section>
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tendencia General
            </CardTitle>
            <CardDescription>
              Evolución de los últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {parseFloat(overallTrend) >= 0 ? '+' : ''}{overallTrend}%
              </div>
              <p className="text-muted-foreground">
                {parseFloat(overallTrend) >= 0 ? 'Mejora' : 'Descenso'} en distancia promedio 
                (últimos 3 meses vs anteriores 3 meses)
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Comparativa Mes Actual vs Mes Anterior */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Comparativa Mensual
            </CardTitle>
            <CardDescription>
              Compara tu rendimiento del mes actual con el anterior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Distancia */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground">Distancia Total</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {Math.round(currentMetrics.distance / 1000 * 10) / 10}k
                  </span>
                  <span className={`text-sm font-medium ${
                    parseFloat(distanceChange) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {parseFloat(distanceChange) >= 0 ? '+' : ''}{distanceChange}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  vs {Math.round(previousMetrics.distance / 1000 * 10) / 10}k del mes anterior
                </p>
              </div>

              {/* Sesiones */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground">Número de Sesiones</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{currentMetrics.count}</span>
                  <span className={`text-sm font-medium ${
                    parseFloat(countChange) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {parseFloat(countChange) >= 0 ? '+' : ''}{countChange}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  vs {previousMetrics.count} del mes anterior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Gráfico de evolución de 6 meses */}
      <section>
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
      </section>

      {/* Resumen de los últimos 6 meses */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Resumen de 6 Meses
            </CardTitle>
            <CardDescription>
              Desglose mensual de tu actividad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {last6Months.map((month, index) => (
                <div key={index} className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="text-sm font-semibold text-muted-foreground mb-1">
                    {month.month}
                  </div>
                  <div className="text-lg font-bold">
                    {Math.round(month.distance / 1000 * 10) / 10}k
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {month.count} sesiones
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
