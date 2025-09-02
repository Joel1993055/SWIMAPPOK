import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ClubesOverview } from "@/components/clubes/clubes-overview"

export default function ClubesPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Gestión de Clubes y Grupos</h1>
          <ClubesOverview />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
