'use client';

import { AnalysisOverview } from '@/components/analysis/analysis-overview';
import { WeeklyComparison } from '@/components/analysis/weekly-comparison';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDeviceType } from '@/core/hooks/mobile';
import { useFilteredSessions } from '@/core/hooks/use-filtered-sessions';
import { BarChart3, TrendingUp } from 'lucide-react';
import { useState } from 'react';

function AnalysisContent() {
  const { sessions, isLoading, hasContext, contextInfo } = useFilteredSessions();
  const [selectedPeriod, setSelectedPeriod] = useState('last-30-days');
  const deviceType = useDeviceType();

  // Show message if no context is selected
  if (!hasContext) {
    return (
      <div className='flex-1 space-y-4 sm:space-y-6 p-4 md:p-8 pt-6'>
        {/* Header */}
        <div className='mb-6 sm:mb-8'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='p-2 bg-primary/10 rounded-lg'>
              <BarChart3 className='h-5 w-5 sm:h-6 sm:w-6 text-primary' />
            </div>
            <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>Analysis</h1>
          </div>
          <p className='text-sm sm:text-base text-muted-foreground'>
            Please select a club and group to view your performance analysis
          </p>
        </div>

        {/* No context message */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No club/group selected</p>
                <p className="text-xs mt-1">Select from the sidebar to view your analysis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 bg-primary/10 rounded-lg'>
            <BarChart3 className='h-6 w-6 text-primary' />
          </div>
          <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>
            Análisis Avanzado
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
            <BarChart3 className='h-5 w-5 sm:h-6 sm:w-6 text-primary' />
          </div>
          <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>Analysis</h1>
        </div>
        <p className='text-sm sm:text-base text-muted-foreground'>
          Detailed analysis of your performance and progress based on real data
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue='overview' className='space-y-4 sm:space-y-6'>
        <TabsList className={`grid w-full ${
          deviceType === 'mobile' 
            ? 'grid-cols-1 h-auto' 
            : 'grid-cols-2'
        }`}>
          <TabsTrigger value='overview' className='flex items-center gap-2 h-10 sm:h-11'>
            <BarChart3 className='h-4 w-4' />
            <span className='text-sm sm:text-base'>Overview</span>
          </TabsTrigger>
          <TabsTrigger value='comparison' className='flex items-center gap-2 h-10 sm:h-11'>
            <TrendingUp className='h-4 w-4' />
            <span className='text-sm sm:text-base'>Weekly Comparison</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value='overview' className='space-y-4'>
          <AnalysisOverview 
            sessions={sessions} 
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </TabsContent>

        {/* Weekly Comparison */}
        <TabsContent value='comparison' className='space-y-4'>
          <WeeklyComparison sessions={sessions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AnalysisPage() {
  return <AnalysisContent />;
}
