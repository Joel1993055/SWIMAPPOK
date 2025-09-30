'use client';

import { AnalysisOverview } from '@/components/analysis/analysis-overview';
import { WeeklyComparison } from '@/components/analysis/weekly-comparison';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SiteHeader } from '@/components/layout/site-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSessionsData } from '@/core/hooks/use-sessions-data';
import { BarChart3, TrendingUp } from 'lucide-react';
import { useState } from 'react';

function AnalysisContent() {
  const { sessions, isLoading } = useSessionsData();
  const [selectedPeriod, setSelectedPeriod] = useState('last-30-days');

  if (isLoading) {
    return (
      <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 bg-primary/10 rounded-lg'>
            <BarChart3 className='h-6 w-6 text-primary' />
          </div>
          <h1 className='text-3xl font-bold text-foreground'>
            Análisis Avanzado
          </h1>
        </div>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
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
    <div className='flex-1 space-y-6 p-4 md:p-8 pt-6'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 bg-primary/10 rounded-lg'>
            <BarChart3 className='h-6 w-6 text-primary' />
          </div>
          <h1 className='text-3xl font-bold text-foreground'>Analysis</h1>
        </div>
        <p className='text-muted-foreground'>
          Detailed analysis of your performance and progress based on real data
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue='overview' className='space-y-6'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='overview' className='flex items-center gap-2'>
            <BarChart3 className='h-4 w-4' />
            Overview
          </TabsTrigger>
          <TabsTrigger value='comparison' className='flex items-center gap-2'>
            <TrendingUp className='h-4 w-4' />
            Weekly Comparison
          </TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value='overview'>
          <AnalysisOverview 
            sessions={sessions} 
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </TabsContent>

        {/* Weekly Comparison */}
        <TabsContent value='comparison'>
          <WeeklyComparison sessions={sessions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <AnalysisContent />
      </SidebarInset>
    </SidebarProvider>
  );
}
