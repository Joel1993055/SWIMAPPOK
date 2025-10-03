'use client';

import { MacrocyclePlanner } from '@/components/macrocycle/MacrocyclePlanner';
import { useDeviceType } from '@/core/hooks/mobile';
import { Calendar } from 'lucide-react';

export default function YearlyPlanningPage() {
  const deviceType = useDeviceType();

  return (
    <div className='flex-1 space-y-4 sm:space-y-6 p-4 md:p-8 pt-6'>
      {/* Header */}
      <div className='mb-6 sm:mb-8'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 bg-primary/10 rounded-lg'>
            <Calendar className='h-5 w-5 sm:h-6 sm:w-6 text-primary' />
          </div>
          <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>Yearly Planning</h1>
        </div>
        <p className='text-sm sm:text-base text-muted-foreground'>
          Annual training plan with competition schedule and periodization
        </p>
      </div>

      {/* Macrocycle Planner Content */}
      <MacrocyclePlanner />
    </div>
  );
}
