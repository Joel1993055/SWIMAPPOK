import { DashboardOverview } from '@/components/features/dashboard/dashboard-overview';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SiteHeader } from '@/components/layout/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/signin');
  }
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
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                </svg>
              </div>
              <h1 className='text-3xl font-bold text-foreground'>Dashboard</h1>
            </div>
            <p className='text-muted-foreground'>
              Overview of your performance and activities
            </p>
          </div>
          <DashboardOverview />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
