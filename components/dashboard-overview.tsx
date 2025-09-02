"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { VisitorsChart } from "@/components/dashboard/visitors-chart";
import { DashboardCalendar } from "@/components/dashboard/dashboard-calendar";
import { ChartsSection } from "@/components/dashboard/charts-section";
import { useWidgetManager } from "@/components/dashboard/widget-manager";
import { DraggableWidgetGrid } from "@/components/dashboard/draggable-widget-grid";

// Componente para renderizar widgets dinámicamente
function WidgetRenderer({ widgetId }: { widgetId: string }) {
  switch (widgetId) {
    case "kpi-cards":
      return <KPICards />;
    case "visitors-chart":
      return <VisitorsChart />;
    case "dashboard-calendar":
      return <DashboardCalendar />;
    case "swimming-charts":
      return <ChartsSection />;
    default:
      return null;
  }
}

export function DashboardOverview() {
  const { activeWidgets, reorderWidgets } = useWidgetManager();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <DashboardHeader />
      
      {/* Widgets Dinámicos con Drag & Drop */}
      <DraggableWidgetGrid
        activeWidgets={activeWidgets}
        onReorder={reorderWidgets}
        renderWidget={(widgetId) => <WidgetRenderer widgetId={widgetId} />}
      />
    </div>
  );
}
