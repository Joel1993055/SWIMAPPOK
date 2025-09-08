import { DashboardOverview } from '@/components/features/dashboard/dashboard-overview';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SiteHeader } from '@/components/layout/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
// NUEVO: Componente de prueba de migración
import { MigrationTest } from '@/components/examples/migration-test';

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
          {/* NUEVO: Componente de prueba de migración */}
          <MigrationTest />
          <DashboardOverview />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
