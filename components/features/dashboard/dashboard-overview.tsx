'use client';

import { ChartsSection } from '@/components/features/dashboard/charts-section';
import { DashboardCalendar } from '@/components/features/dashboard/dashboard-calendar';
import { DashboardHeader } from '@/components/features/dashboard/dashboard-header';
import { KPICards } from '@/components/features/dashboard/kpi-cards';
import { VisitorsChartSimple } from '@/components/features/dashboard/visitors-chart-simple';
import { WeeklyTrainingSchedule } from '@/components/features/dashboard/weekly-training-schedule';
import { useLoadSessionsFromSupabase } from '@/core/hooks/data/use-load-sessions';
import { useDeviceType } from '@/core/hooks/mobile';

export function DashboardOverview() {
  const deviceType = useDeviceType();
  
  // Load sessions from Supabase into the normalized store
  useLoadSessionsFromSupabase();

  return (
    <div className='space-y-4'>
      {/* Header */}
      <DashboardHeader />

      {/* KPIs Cards - Responsive grid */}
      <KPICards />

      {/* Charts Section - Responsive layout */}
      <div className={`grid gap-4 ${
        deviceType === 'mobile' 
          ? 'grid-cols-1' 
          : deviceType === 'tablet' 
            ? 'grid-cols-1 lg:grid-cols-2' 
            : 'md:grid-cols-2 lg:grid-cols-7'
      }`}>
        <VisitorsChartSimple />
        <DashboardCalendar />
      </div>

      {/* Weekly Training Schedule */}
      <WeeklyTrainingSchedule />

      {/* Swimming Charts Section - Stacked on mobile */}
      <div className='space-y-4'>
        <ChartsSection />
      </div>
    </div>
  );
}
