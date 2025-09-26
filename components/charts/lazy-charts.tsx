'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { lazy, Suspense } from 'react';

// =====================================================
// LAZY LOADING FOR HEAVY CHARTS
// =====================================================

// Lazy load Recharts to avoid large initial bundle
const LineChart = lazy(() =>
  import('recharts').then(module => ({
    default: module.LineChart,
  }))
);

const CartesianGrid = lazy(() =>
  import('recharts').then(module => ({
    default: module.CartesianGrid,
  }))
);

const XAxis = lazy(() =>
  import('recharts').then(module => ({
    default: module.XAxis,
  }))
);

const YAxis = lazy(() =>
  import('recharts').then(module => ({
    default: module.YAxis,
  }))
);

const Line = lazy(() =>
  import('recharts').then(module => ({
    default: module.Line,
  }))
);

// =====================================================
// LOADING COMPONENT
// =====================================================
function ChartSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='h-4 w-48 bg-muted animate-pulse rounded' />
      <div className='h-4 w-32 bg-muted animate-pulse rounded' />
      <div className='h-80 w-full bg-muted animate-pulse rounded' />
    </div>
  );
}

// =====================================================
// WEEKLY TRENDS CHART
// =====================================================
interface WeeklyTrendsChartProps {
  data: Array<{
    week: string;
    distance: number;
    sessions: number;
    avgRPE: number;
  }>;
}

export function WeeklyTrendsChart({ data }: WeeklyTrendsChartProps) {
  return (
    <Card className='bg-muted/50'>
      <CardHeader>
        <CardTitle>Weekly Trends</CardTitle>
        <CardDescription>Weekly evolution of distance and RPE</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='h-80'>
          <Suspense fallback={<ChartSkeleton />}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='week' />
              <YAxis yAxisId='left' />
              <YAxis yAxisId='right' orientation='right' />
              <Line
                yAxisId='left'
                type='monotone'
                dataKey='distance'
                stroke='#3b82f6'
                strokeWidth={2}
              />
              <Line
                yAxisId='right'
                type='monotone'
                dataKey='avgRPE'
                stroke='#ef4444'
                strokeWidth={2}
              />
            </LineChart>
          </Suspense>
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// ZONE DISTRIBUTION CHART
// =====================================================
interface ZoneDistributionChartProps {
  data: Array<{
    zone: string;
    distance: number;
    percentage: number;
  }>;
}

export function ZoneDistributionChart({ data }: ZoneDistributionChartProps) {
  return (
    <Card className='bg-muted/50'>
      <CardHeader>
        <CardTitle>Zone Distribution</CardTitle>
        <CardDescription>
          Training volume by intensity zone
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='h-80'>
          <Suspense fallback={<ChartSkeleton />}>
            <div className='space-y-4'>
              {data.map(zone => (
                <div key={zone.zone} className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>{zone.zone}</span>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-muted-foreground'>
                        {zone.distance.toLocaleString()}m
                      </span>
                      <span className='text-xs bg-muted px-2 py-1 rounded'>
                        {zone.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className='w-full bg-muted rounded-full h-2'>
                    <div
                      className='bg-primary h-2 rounded-full transition-all duration-300'
                      style={{ width: `${zone.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Suspense>
        </div>
      </CardContent>
    </Card>
  );
}
