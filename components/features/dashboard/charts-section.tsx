'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { lazy, Suspense } from 'react';

// OPTIMIZACIÓN: Lazy loading de componentes pesados
const VolumeBarchart = lazy(() => import('@/components/charts/barchart'));
const ChartComponent = lazy(() => import('@/components/charts/chartcomponent'));

// Skeleton para loading
function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function ChartsSection() {
  return (
    <div className="space-y-4">
      <Suspense fallback={<ChartSkeleton />}>
        <VolumeBarchart />
      </Suspense>
      <Suspense fallback={<ChartSkeleton />}>
        <ChartComponent />
      </Suspense>
    </div>
  );
}
