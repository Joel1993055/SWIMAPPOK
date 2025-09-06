import { DashboardOverview } from "@/components/features/dashboard/dashboard-overview";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <DashboardOverview />
      </SidebarInset>
    </SidebarProvider>
  );
}
