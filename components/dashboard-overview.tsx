"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { VisitorsChart } from "@/components/dashboard/visitors-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { ChartsSection } from "@/components/dashboard/charts-section";

export function DashboardOverview() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <DashboardHeader />
      
      {/* KPIs Cards - 4 tarjetas arriba */}
      <KPICards />
      
      {/* Charts Section - Gráfico de visitantes y actividad */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <VisitorsChart />
        <RecentActivity />
      </div>

      {/* Swimming Charts Section - Los dos gráficos debajo uno del otro */}
      <div className="space-y-4">
        <ChartsSection />
      </div>
    </div>
  );
}
