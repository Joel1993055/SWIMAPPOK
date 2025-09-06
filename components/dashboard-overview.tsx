"use client";

import { DashboardHeader } from "@/components/features/dashboard/dashboard-header";
import { KPICards } from "@/components/features/dashboard/kpi-cards";
import { VisitorsChart } from "@/components/features/dashboard/visitors-chart";
import { DashboardCalendar } from "@/components/features/dashboard/dashboard-calendar";
import { ChartsSection } from "@/components/features/dashboard/charts-section";
import { WeeklyTrainingSchedule } from "@/components/features/dashboard/weekly-training-schedule";

export function DashboardOverview() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <DashboardHeader />
      
      {/* KPIs Cards - 4 tarjetas arriba */}
      <KPICards />
      
      {/* Charts Section - Gráfico de visitantes y calendario */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <VisitorsChart />
        <DashboardCalendar />
      </div>

      {/* Weekly Training Schedule */}
      <WeeklyTrainingSchedule />

      {/* Swimming Charts Section - Los dos gráficos debajo uno del otro */}
      <div className="space-y-4">
        <ChartsSection />
      </div>
    </div>
  );
}
