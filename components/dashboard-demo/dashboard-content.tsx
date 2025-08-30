"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Calendar, Activity, Target } from "lucide-react";
import { useSessionsStore } from "@/lib/store/sessions";
import { useDashboardTabsStore } from "@/lib/store/dashboard-tabs";
import { getAggregations } from "@/lib/aggregations";
import { getCurrentYear } from "@/lib/date";
import { KPICards } from "./kpi-cards";
import { ChartCardWrapper } from "./chart-card-wrapper";
import VolumeBarchart from "@/components/barchart";
import ChartComponent from "@/components/chartcomponent";
import { QuickAddForm } from "./quick-add-form";
import { YearCalendar } from "./year-calendar";
import { SessionsTable } from "./sessions-table";
import { TotalsFilters } from "./totals-filters";
import { AnalyticsContent } from "./analytics-content";

export function DashboardContent() {
  const { sessions } = useSessionsStore();
  const { activeTab } = useDashboardTabsStore();
  const currentYear = getCurrentYear();
  
  // Calcular métricas del mes actual (kept for potential future use or if other parts need it, but widget removed from UI)
  const currentMonth = new Date().getMonth() + 1;
  const currentMonthStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
  const currentMonthSessions = sessions.filter(s => s.date.startsWith(currentMonthStr));
  const currentMonthDistance = currentMonthSessions.reduce((sum, s) => sum + s.distance, 0);
  const currentMonthCount = currentMonthSessions.length;

  return (
    <div className="w-full">
      {/* Overview Tab - Mantiene tus gráficos existentes */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPIs - Tus métricas existentes */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Métricas Clave</h2>
            <KPICards stats={getAggregations(sessions)} />
          </section>
          
          {/* Charts - REUTILIZANDO TUS COMPONENTES EXISTENTES */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Gráficos de Rendimiento</h2>
            <div className="space-y-8">
              <ChartCardWrapper 
                title="Volumen Semanal" 
                description="Distancia por semana en kilómetros"
              >
                <VolumeBarchart />
              </ChartCardWrapper>
              
              <ChartCardWrapper 
                title="Progreso Z1 vs Z2 vs Z3 vs Z4 vs Z5" 
                description="Análisis temporal de intensidades"
              >
                <ChartComponent />
              </ChartCardWrapper>
            </div>
          </section>
        </div>
      )}

      {/* Log Tab - Nueva funcionalidad */}
      {activeTab === 'log' && (
        <div className="space-y-8">
          {/* Formulario rápido de añadir sesión */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Añadir Entrenamiento Rápido
                </CardTitle>
                <CardDescription>
                  Registra tu entrenamiento de hoy en segundos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuickAddForm />
              </CardContent>
            </Card>
          </section>

          {/* Layout de 2 columnas en desktop, 1 en móvil */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna izquierda: Calendario anual */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Calendario {currentYear}
                  </CardTitle>
                  <CardDescription>
                    Vista anual de todos tus entrenamientos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <YearCalendar />
                </CardContent>
              </Card>
            </section>

            {/* Columna derecha: Totales y filtros */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Totales y Filtros
                  </CardTitle>
                  <CardDescription>
                    Métricas y filtros para analizar tus datos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TotalsFilters />
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Tabla de sesiones completa */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Historial de Sesiones
                </CardTitle>
                <CardDescription>
                  Todas tus sesiones con opciones de edición y eliminación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SessionsTable />
              </CardContent>
            </Card>
          </section>
        </div>
      )}

      {/* Analytics Tab - NUEVA PESTAÑA */}
      {activeTab === 'analytics' && (
        <AnalyticsContent />
      )}
    </div>
  );
}
