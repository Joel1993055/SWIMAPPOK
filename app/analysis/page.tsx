'use client';

import { WeeklyTrendsChart } from '@/components/charts/lazy-charts';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SiteHeader } from '@/components/layout/site-header';
import {
  Card,
  CardContent,
  CardHeader
} from '@/components/ui/card';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSessionsData } from '@/lib/hooks/use-sessions-data';
import { format, subDays, subMonths, subWeeks } from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Minus
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

// Colors for intensity zones
const ZONE_COLORS = {
  z1: '#3b82f6', // Blue
  z2: '#10b981', // Green
  z3: '#f59e0b', // Yellow
  z4: '#ef4444', // Red
  z5: '#8b5cf6', // Purple
};

function AnalysisContent() {
  const {
    sessions,
    metrics,
    zoneAnalysis,
    weeklyAnalysis,
    isLoading,
    getFilteredSessions,
  } = useSessionsData();

  const [selectedPeriod, setSelectedPeriod] = useState('last-30-days');
  const [comparisonPeriod, setComparisonPeriod] = useState('previous-week');

  // Optimized session filter by period
  const getFilteredSessionsByPeriod = useMemo(() => {
    return (period: string) => {
      const now = new Date();
      let startDate: Date;
      const endDate = now;

      switch (period) {
        case 'last-7-days':
          startDate = subDays(now, 7);
          break;
        case 'last-30-days':
          startDate = subDays(now, 30);
          break;
        case 'last-3-months':
          startDate = subMonths(now, 3);
          break;
        case 'last-6-months':
          startDate = subMonths(now, 6);
          break;
        case 'last-year':
          startDate = subMonths(now, 12);
          break;
        default:
          startDate = subDays(now, 30);
      }

      return getFilteredSessions({
        startDate,
        endDate,
      });
    };
  }, [getFilteredSessions]);

  // Get comparison sessions
  const getComparisonSessions = (period: string) => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case 'previous-week':
        endDate = subWeeks(now, 1);
        startDate = subWeeks(now, 2);
        break;
      case 'previous-month':
        endDate = subMonths(now, 1);
        startDate = subMonths(now, 2);
        break;
      case 'previous-3-months':
        endDate = subMonths(now, 3);
        startDate = subMonths(now, 6);
        break;
      case 'previous-6-months':
        endDate = subMonths(now, 6);
        startDate = subMonths(now, 12);
        break;
      case 'same-week-last-year':
        endDate = subMonths(now, 12);
        startDate = subWeeks(subMonths(now, 12), 1);
        break;
      case 'same-month-last-year':
        endDate = subMonths(now, 12);
        startDate = subMonths(now, 13);
        break;
      case 'best-week': {
        const allSessions = sessions.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        let bestDistance = 0;
        let bestStart = 0;

        for (let i = 0; i < allSessions.length - 7; i++) {
          const weekSessions = allSessions.slice(i, i + 7);
          const totalDistance = weekSessions.reduce(
            (sum, s) => sum + (s.distance || 0),
            0
          );
          if (totalDistance > bestDistance) {
            bestDistance = totalDistance;
            bestStart = i;
          }
        }

        return allSessions.slice(bestStart, bestStart + 7);
      }
      case 'best-month': {
        const allSessionsMonth = sessions.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        let bestMonthDistance = 0;
        let bestMonthStart = 0;

        for (let i = 0; i < allSessionsMonth.length - 30; i++) {
          const monthSessions = allSessionsMonth.slice(i, i + 30);
          const totalDistance = monthSessions.reduce(
            (sum, s) => sum + (s.distance || 0),
            0
          );
          if (totalDistance > bestMonthDistance) {
            bestMonthDistance = totalDistance;
            bestMonthStart = i;
          }
        }

        return allSessionsMonth.slice(bestMonthStart, bestMonthStart + 30);
      }
      default:
        endDate = subWeeks(now, 1);
        startDate = subWeeks(now, 2);
    }

    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  };

  // Current sessions
  const currentSessions = useMemo(
    () => getFilteredSessionsByPeriod(selectedPeriod),
    [getFilteredSessionsByPeriod, selectedPeriod]
  );

  const comparisonSessions = useMemo(
    () => getComparisonSessions(comparisonPeriod),
    [comparisonPeriod, sessions]
  );

  // Current metrics
  const currentMetrics = useMemo(() => {
    if (currentSessions.length === 0) {
      return {
        totalDistance: 0,
        totalSessions: 0,
        avgDistance: 0,
        avgDuration: 0,
        avgRPE: 0,
        totalTime: 0,
      };
    }

    const totals = currentSessions.reduce(
      (acc, s) => ({
        distance: acc.distance + (s.distance || 0),
        duration: acc.duration + (s.duration || 0),
        rpe: acc.rpe + (s.rpe || 0),
        sessions: acc.sessions + 1,
      }),
      { distance: 0, duration: 0, rpe: 0, sessions: 0 }
    );

    return {
      totalDistance: totals.distance,
      totalSessions: totals.sessions,
      avgDistance: totals.sessions > 0 ? totals.distance / totals.sessions : 0,
      avgDuration: totals.sessions > 0 ? totals.duration / totals.sessions : 0,
      avgRPE: totals.sessions > 0 ? totals.rpe / totals.sessions : 0,
      totalTime: totals.duration,
    };
  }, [currentSessions]);

  // Comparison metrics
  const comparisonMetrics = useMemo(() => {
    if (comparisonSessions.length === 0) {
      return {
        totalDistance: 0,
        totalSessions: 0,
        avgDistance: 0,
        avgDuration: 0,
        avgRPE: 0,
        totalTime: 0,
      };
    }

    const totals = comparisonSessions.reduce(
      (acc, s) => ({
        distance: acc.distance + (s.distance || 0),
        duration: acc.duration + (s.duration || 0),
        rpe: acc.rpe + (s.rpe || 0),
        sessions: acc.sessions + 1,
      }),
      { distance: 0, duration: 0, rpe: 0, sessions: 0 }
    );

    return {
      totalDistance: totals.distance,
      totalSessions: totals.sessions,
      avgDistance: totals.sessions > 0 ? totals.distance / totals.sessions : 0,
      avgDuration: totals.sessions > 0 ? totals.duration / totals.sessions : 0,
      avgRPE: totals.sessions > 0 ? totals.rpe / totals.sessions : 0,
      totalTime: totals.duration,
    };
  }, [comparisonSessions]);

  // Comparison zone analysis
  const comparisonZoneAnalysis = useMemo(() => {
    if (comparisonSessions.length === 0) {
      return [];
    }

    const zoneData: { [key: string]: { distance: number; sessions: number } } =
      {};

    comparisonSessions.forEach(session => {
      const zone = session.zone || 'Z1';
      if (!zoneData[zone]) {
        zoneData[zone] = { distance: 0, sessions: 0 };
      }
      zoneData[zone].distance += session.distance || 0;
      zoneData[zone].sessions += 1;
    });

    const totalDistance = Object.values(zoneData).reduce(
      (sum, z) => sum + z.distance,
      0
    );

    return Object.entries(zoneData)
      .map(([zone, data]) => ({
        zone,
        distance: data.distance,
        sessions: data.sessions,
        percentage:
          totalDistance > 0 ? (data.distance / totalDistance) * 100 : 0,
        color: ZONE_COLORS[zone as keyof typeof ZONE_COLORS] || '#6b7280',
      }))
      .sort((a, b) => a.zone.localeCompare(b.zone));
  }, [comparisonSessions]);

  // Utility functions
  const calculateChange = useCallback((current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }, []);

  const getChangeIcon = useCallback((change: number) => {
    if (change > 0) return <ArrowUp className='h-4 w-4 text-green-600' />;
    if (change < 0) return <ArrowDown className='h-4 w-4 text-red-600' />;
    return <Minus className='h-4 w-4 text-gray-600' />;
  }, []);

  const getChangeColor = useCallback((change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  }, []);

  const formatNumber = useCallback((num: number) => {
    return num.toLocaleString('en-US');
  }, []);

  const formatTime = useCallback((minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }, []);

  // Monthly analysis
  const monthlyAnalysis = useMemo(() => {
    const monthlyData: {
      [key: string]: { distance: number; sessions: number; avgRPE: number };
    } = {};

    currentSessions.forEach(session => {
      const sessionDate = new Date(session.date);
      const monthKey = format(sessionDate, 'MMM yyyy', { locale: enUS });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { distance: 0, sessions: 0, avgRPE: 0 };
      }

      monthlyData[monthKey].distance += session.distance || 0;
      monthlyData[monthKey].sessions += 1;
      monthlyData[monthKey].avgRPE += session.rpe || 0;
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        distance: data.distance,
        sessions: data.sessions,
        avgRPE: data.sessions > 0 ? data.avgRPE / data.sessions : 0,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [currentSessions]);

  // Automatic insights
  const insights = useMemo(() => {
    const result = {
      strengths: [] as string[],
      improvements: [] as string[],
    };

    // Consistency
    const avgSessionsPerWeek = currentSessions.length / 4;
    if (avgSessionsPerWeek >= 4) {
      result.strengths.push(
        `Excellent consistency: ${avgSessionsPerWeek.toFixed(
          1
        )} sessions per week`
      );
    } else if (avgSessionsPerWeek < 2) {
      result.improvements.push(
        `Increase frequency: only ${avgSessionsPerWeek.toFixed(
          1
        )} sessions per week`
      );
    }

    // Intensity
    const currentZoneAnalysis = zoneAnalysis;
    const z4z5Percentage = currentZoneAnalysis
      .filter(z => z.zone === 'Z4' || z.zone === 'Z5')
      .reduce((sum, z) => sum + z.percentage, 0);

    if (z4z5Percentage < 10) {
      result.improvements.push(
        `More high intensity work: only ${z4z5Percentage.toFixed(1)}% in Z4-Z5`
      );
    } else if (z4z5Percentage > 30) {
      result.improvements.push(
        `Balance intensity: ${z4z5Percentage.toFixed(
          1
        )}% in Z4-Z5 may be excessive`
      );
    }

    // Progress
    const distanceChange = calculateChange(
      currentMetrics.totalDistance,
      comparisonMetrics.totalDistance
    );
    if (distanceChange > 20) {
      result.strengths.push(
        `Excellent progress: +${distanceChange.toFixed(1)}% in distance`
      );
    } else if (distanceChange < -10) {
      result.improvements.push(
        `Review volume: -${Math.abs(distanceChange).toFixed(1)}% in distance`
      );
    }

    return result;
  }, [
    currentSessions,
    zoneAnalysis,
    currentMetrics,
    comparisonMetrics,
    calculateChange,
  ]);

  if (isLoading) {
    return (
      <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 bg-primary/10 rounded-lg'>
            <BarChart3 className='h-6 w-6 text-primary' />
          </div>
          <h1 className='text-3xl font-bold text-foreground'>
            Advanced Analysis
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
    <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
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
      <Tabs defaultValue='overview' className='space-y-4'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='trends'>Trends</TabsTrigger>
          <TabsTrigger value='intensity'>Intensity</TabsTrigger>
          <TabsTrigger value='insights'>Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value='overview'>
          {/* Example: monthly progress & comparisons here */}
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value='trends'>
          <WeeklyTrendsChart data={weeklyAnalysis} />
        </TabsContent>

        {/* Intensity Tab */}
        <TabsContent value='intensity'>
          {/* Example: intensity distribution */}
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value='insights'>
          {/* Example: strengths & improvements */}
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
