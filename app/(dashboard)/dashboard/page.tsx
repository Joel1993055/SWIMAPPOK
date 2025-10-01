'use client';

import { DashboardOverview } from '@/components/features/dashboard/dashboard-overview';
import { MobileDashboard } from '@/components/features/mobile';
import { WelcomeTour } from '@/components/onboarding/welcome-tour';
import { useDeviceType } from '@/core/hooks/mobile';
import { useOnboarding } from '@/core/hooks/use-onboarding';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const deviceType = useDeviceType();
  const { shouldShowWelcomeTour, isLoading } = useOnboarding(userId);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };

    getUser();
  }, []);

  const handleOnboardingComplete = () => {
    // Onboarding completed, user can now use the app normally
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Welcome Tour */}
      {shouldShowWelcomeTour && userId && (
        <WelcomeTour 
          userId={userId} 
          onComplete={handleOnboardingComplete}
        />
      )}

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
      
      {/* Conditional rendering based on device type */}
      {deviceType === 'mobile' ? (
        <MobileDashboard />
      ) : (
        <DashboardOverview />
      )}
    </>
  );
}