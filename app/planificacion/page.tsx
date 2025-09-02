import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { PlanificacionOverview } from "@/components/planificacion/planificacion-overview"

export default function PlanificacionPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Planificación de Entrenamientos</h1>
          <PlanificacionOverview />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
