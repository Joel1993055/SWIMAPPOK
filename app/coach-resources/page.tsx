'use client';

import { CoachResourcesOverview } from '@/components/features/coach-resources/coach-resources-overview';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SiteHeader } from '@/components/layout/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function CoachResourcesPage() {
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
                <svg className='h-6 w-6 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' />
                </svg>
              </div>
              <h1 className='text-3xl font-bold text-foreground'>Coach Resources</h1>
            </div>
            <p className='text-muted-foreground'>
              Metodologías y recursos para optimizar el entrenamiento
            </p>
          </div>
          <CoachResourcesOverview />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
