import { PlanificacionOverview } from "@/components/features/planificacion/planificacion-overview";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function PlanificacionPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">
            Planificación de Entrenamientos
          </h1>
          <PlanificacionOverview />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
