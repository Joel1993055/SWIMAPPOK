import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SessionsTable } from "@/components/features/dashboard/sessions-table";

export default function LogPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Log de Entrenamientos
            </h2>
            <p className="text-muted-foreground">
              Historial completo de tus sesiones de natación
            </p>
          </div>
          <SessionsTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
