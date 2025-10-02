'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeviceType } from '@/core/hooks/mobile';
import { Calendar, Target, TrendingUp } from 'lucide-react';

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
          Plan your training year with strategic goals and milestones
        </p>
      </div>

      {/* Coming Soon Content */}
      <div className="space-y-6">
        {/* Main Planning Card */}
        <Card className="bg-muted/50 border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Annual Training Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're working on a comprehensive yearly planning tool that will help you set annual goals, 
                plan training phases, and track your progress throughout the year.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Feature Preview Cards */}
        <div className={`grid gap-4 ${
          deviceType === 'mobile' 
            ? 'grid-cols-1' 
            : 'md:grid-cols-2 lg:grid-cols-3'
        }`}>
          <Card className="bg-muted/50 border-muted">
            <CardHeader>
              <CardTitle className="text-base">Annual Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 border-muted">
            <CardHeader>
              <CardTitle className="text-base">Training Phases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 border-muted">
            <CardHeader>
              <CardTitle className="text-base">Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
