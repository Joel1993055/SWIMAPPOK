'use client';

import { FinaPointsCalculator } from '@/components/features/tools/fina-points-calculator';
import { RelativeSpeedCalculator } from '@/components/features/tools/relative-speed-calculator';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SiteHeader } from '@/components/layout/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Timer, Wrench } from 'lucide-react';

export default function ToolsPage() {
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
                <Wrench className='h-6 w-6 text-primary' />
              </div>
              <h1 className='text-3xl font-bold text-foreground'>
                Tools
              </h1>
            </div>
            <p className='text-muted-foreground'>
              Calculators and tools for performance analysis
            </p>
          </div>

          {/* Tabs de herramientas */}
          <Tabs defaultValue='fina-points' className='space-y-4'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger
                value='fina-points'
                className='flex items-center gap-2'
              >
                <Calculator className='h-4 w-4' />
                Puntos FINA
              </TabsTrigger>
              <TabsTrigger
                value='relative-speed'
                className='flex items-center gap-2'
              >
                <Timer className='h-4 w-4' />
                Relative Speed
              </TabsTrigger>
            </TabsList>

            <TabsContent value='fina-points' className='space-y-4'>
              <FinaPointsCalculator />
            </TabsContent>

            <TabsContent value='relative-speed' className='space-y-4'>
              <RelativeSpeedCalculator />
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
