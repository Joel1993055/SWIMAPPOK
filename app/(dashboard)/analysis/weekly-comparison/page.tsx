'use client';

import { WeeklyComparison } from '@/components/analysis/weekly-comparison';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeviceType } from '@/core/hooks/mobile';
import { useSessionsData } from '@/core/hooks/use-sessions-data';
import { TrendingUp } from 'lucide-react';

export default function WeeklyComparisonPage() {
  const { sessions, isLoading } = useSessionsData();
  const deviceType = useDeviceType();

  if (isLoading) {
    return (
      <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 bg-primary/10 rounded-lg'>
            <TrendingUp className='h-6 w-6 text-primary' />
          </div>
          <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>
            Weekly Comparison
          </h1>
        </div>
        <div className={`grid gap-4 ${
          deviceType === 'mobile' 
            ? 'grid-cols-1' 
            : 'md:grid-cols-2 lg:grid-cols-4'
        }`}>
          {[...Array(4)].map((_, i) => (
            <Card key={i} className='bg-muted/50'>
              <CardHeader className='space-y-0 pb-2'>
                <Skeleton className='h-4 w-24' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-8 w-16 mb-2' />
                <Skeleton className='h-3 w-32' />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 space-y-4 sm:space-y-6 p-4 md:p-8 pt-6'>
      {/* Header */}
      <div className='mb-6 sm:mb-8'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 bg-primary/10 rounded-lg'>
            <TrendingUp className='h-5 w-5 sm:h-6 sm:w-6 text-primary' />
          </div>
          <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>Weekly Comparison</h1>
        </div>
        <p className='text-sm sm:text-base text-muted-foreground'>
          Compare your weekly performance and track progress over time
        </p>
      </div>

      {/* Weekly Comparison Content */}
      <WeeklyComparison sessions={sessions} />
    </div>
  );
}
