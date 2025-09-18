import { PlanificacionOverview } from '@/components/features/planificacion/planificacion-overview';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SiteHeader } from '@/components/layout/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Target } from 'lucide-react';

export default function PlanificacionPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
          {/* Header */}
          <div className='mb-8'>
            <div className='flex items-center gap-3 mb-2'>
              <div className='p-2 bg-primary/10 rounded-lg'>
                <Target className='h-6 w-6 text-primary' />
              </div>
              <h1 className='text-3xl font-bold text-foreground'>
                Planificación de Entrenamientos
              </h1>
            </div>
            <p className='text-muted-foreground'>
              Planifica y organiza tus entrenamientos de manera eficiente
            </p>
          </div>
          <PlanificacionOverview />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
