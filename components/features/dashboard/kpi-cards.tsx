'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCompetitionsStore, useSessionsStore, useTrainingStore } from '@/core/stores/unified';
import { Activity, Target, Trophy, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export function KPICards() {
  // OPTIMIZED: Use only unified store
  const { sessions, setSessions } = useSessionsStore();
  const { getCurrentPhase } = useTrainingStore();
  const { competitions, getMainCompetition } = useCompetitionsStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // States for selected periods
  const [selectedDistancePeriod, setSelectedDistancePeriod] = useState<
    'year' | 'month' | 'week'
  >('week');
  const [selectedPeriod, setSelectedPeriod] = useState<
    'year' | 'month' | 'week'
  >('week');

  // Initialize after hydration to avoid SSR errors
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load sessions when component mounts
  useEffect(() => {
    const loadSessions = async () => {
      try {
        // Here would go the real session loading if necessary
        // For now we use sessions from the store
      } catch (error) {
        console.error('Error loading sessions:', error);
      }
    };

    loadSessions();
  }, [setSessions]);

  // Calculate distance data based on selected period
  const getDistanceData = () => {
    const now = new Date();
    let periodStart: Date;
    let periodDistance = 0;

    switch (selectedDistancePeriod) {
      case 'year':
        periodStart = new Date(now.getFullYear(), 0, 1);
        break;
      case 'month':
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'week':
        periodStart = new Date(now);
        periodStart.setDate(now.getDate() - now.getDay());
        break;
    }

    // Filter sessions for the period
    const periodSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= periodStart && sessionDate <= now;
    });

    // Calcular distancia total del período
    periodDistance = periodSessions.reduce((total, session) => {
      return total + (session.distance || 0);
    }, 0);

    const periodDistanceKm = periodDistance / 1000;

    switch (selectedDistancePeriod) {
      case 'year':
        return {
          distance: periodDistanceKm.toFixed(1),
          label: 'Total accumulated this year',
          subtitle: `${periodDistance.toLocaleString()} meters`,
        };
      case 'month':
        return {
          distance: periodDistanceKm.toFixed(1),
          label: 'Total this month',
          subtitle: `${periodDistance.toLocaleString()} meters`,
        };
      case 'week':
        return {
          distance: periodDistanceKm.toFixed(1),
          label: 'Total this week',
          subtitle: `${periodDistance.toLocaleString()} meters`,
        };
      default:
        return {
          distance: periodDistanceKm.toFixed(1),
          label: 'Total accumulated',
          subtitle: `${periodDistance.toLocaleString()} meters`,
        };
    }
  };

  // Calculate session data based on selected period
  const getSessionsData = () => {
    const now = new Date();
    let periodStart: Date;

    switch (selectedPeriod) {
      case 'year':
        periodStart = new Date(now.getFullYear(), 0, 1);
        break;
      case 'month':
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'week':
        periodStart = new Date(now);
        periodStart.setDate(now.getDate() - now.getDay());
        break;
    }

    // Filter sessions for the period
    const periodSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= periodStart && sessionDate <= now;
    });

    const periodSessionsCount = periodSessions.length;

    switch (selectedPeriod) {
      case 'year':
        return {
          total: periodSessionsCount,
          label: 'Total accumulated this year',
          subtitle: 'Registered sessions',
        };
      case 'month':
        return {
          total: periodSessionsCount,
          label: 'Total this month',
          subtitle: 'Sessions this month',
        };
      case 'week':
        return {
          total: periodSessionsCount,
          label: 'Total this week',
          subtitle: 'Sessions this week',
        };
      default:
        return {
          total: periodSessionsCount,
          label: 'Total accumulated',
          subtitle: 'Registered sessions',
        };
    }
  };

  // Calculate training cycle status using real phases
  const getTrainingCycleStatus = () => {
    if (!isHydrated) {
      return {
        phase: 'Loading...',
        progress: 0,
        description: 'Calculating progress',
        additionalInfo: '',
        color: 'bg-gray-500',
        status: 'inactive',
        daysRemaining: 0,
      };
    }

    const currentPhase = getCurrentPhase();

    if (!currentPhase) {
      return {
        phase: 'No active phase',
        progress: 0,
        description: 'No active training phase',
        additionalInfo: '',
        color: 'bg-gray-500',
        status: 'inactive',
        daysRemaining: 0,
      };
    }

    const now = new Date();
    const phaseStart = currentPhase.startDate
      ? new Date(currentPhase.startDate)
      : now;
    const phaseEnd = currentPhase.endDate
      ? new Date(currentPhase.endDate)
      : now;
    
    // Determine phase status
    let status: 'upcoming' | 'active' | 'completed' = 'upcoming';
    if (phaseStart <= now && phaseEnd >= now) {
      status = 'active';
    } else if (phaseEnd < now) {
      status = 'completed';
    }

    // Calculate progress percentage
    const totalDuration = phaseEnd.getTime() - phaseStart.getTime();
    const elapsed = now.getTime() - phaseStart.getTime();
    const progress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));

    // Calculate days remaining
    const daysRemaining = Math.max(0, Math.ceil((phaseEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    // Determine color based on status
    let color = 'bg-gray-500';
    if (status === 'active') {
      color = 'bg-green-500';
    } else if (status === 'upcoming') {
      color = 'bg-blue-500';
    } else if (status === 'completed') {
      color = 'bg-purple-500';
    }

    return {
      phase: currentPhase.name || 'Training Phase',
      progress: Math.round(progress),
      description: currentPhase.description || 'Training phase in progress',
      additionalInfo: currentPhase.focus ? `Focus: ${Array.isArray(currentPhase.focus) ? currentPhase.focus.join(', ') : currentPhase.focus}` : '',
      color,
      status,
      daysRemaining,
    };
  };

  // Calculate competition data
  const getCompetitionData = () => {
    if (!isHydrated) {
      return {
        nextCompetition: 'Loading...',
        daysUntil: 0,
        location: '',
        priority: 'medium',
        description: 'Calculating next competition',
      };
    }

    const mainCompetition = getMainCompetition();

    if (!mainCompetition) {
      return {
        nextCompetition: 'No competitions',
        daysUntil: 0,
        location: '',
        priority: 'medium',
        description: 'No competitions scheduled',
      };
    }

    const now = new Date();
    const competitionDate = new Date(mainCompetition.date);
    const daysUntil = Math.ceil((competitionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
      nextCompetition: mainCompetition.name || 'Upcoming Competition',
      daysUntil: Math.max(0, daysUntil),
      location: mainCompetition.location || 'Location TBD',
      priority: mainCompetition.priority || 'medium',
      description: mainCompetition.description || 'Competition details',
    };
  };

  if (!isHydrated) {
    return <KPICardsSkeleton />;
  }

  const distanceData = getDistanceData();
  const sessionsData = getSessionsData();
  const trainingCycleData = getTrainingCycleStatus();
  const competitionData = getCompetitionData();

  return (
    <div className='grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4'>
      {/* Distance Card */}
      <Card className='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300'>
            Distance
          </CardTitle>
          <Target className='h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400' />
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='text-lg sm:text-2xl font-bold text-blue-900 dark:text-blue-100'>
            {distanceData.distance} km
          </div>
          <p className='text-xs text-blue-600 dark:text-blue-400 leading-tight'>
            {distanceData.label}
          </p>
          <p className='text-xs text-blue-500 dark:text-blue-500'>
            {distanceData.subtitle}
          </p>
          <Tabs value={selectedDistancePeriod} onValueChange={setSelectedDistancePeriod} className='mt-2'>
            <TabsList className='grid w-full grid-cols-3 h-6 sm:h-8'>
              <TabsTrigger value='week' className='text-xs'>Week</TabsTrigger>
              <TabsTrigger value='month' className='text-xs'>Month</TabsTrigger>
              <TabsTrigger value='year' className='text-xs'>Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Sessions Card */}
      <Card className='bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-xs sm:text-sm font-medium text-green-700 dark:text-green-300'>
            Sessions
          </CardTitle>
          <Activity className='h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400' />
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='text-lg sm:text-2xl font-bold text-green-900 dark:text-green-100'>
            {sessionsData.total}
          </div>
          <p className='text-xs text-green-600 dark:text-green-400 leading-tight'>
            {sessionsData.label}
          </p>
          <p className='text-xs text-green-500 dark:text-green-500'>
            {sessionsData.subtitle}
          </p>
          <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className='mt-2'>
            <TabsList className='grid w-full grid-cols-3 h-6 sm:h-8'>
              <TabsTrigger value='week' className='text-xs'>Week</TabsTrigger>
              <TabsTrigger value='month' className='text-xs'>Month</TabsTrigger>
              <TabsTrigger value='year' className='text-xs'>Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Training Phase Card */}
      <Card className='bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-xs sm:text-sm font-medium text-purple-700 dark:text-purple-300'>
            Training Phase
          </CardTitle>
          <Users className='h-3 w-3 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400' />
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='text-lg sm:text-2xl font-bold text-purple-900 dark:text-purple-100'>
            {trainingCycleData.phase}
          </div>
          <p className='text-xs text-purple-600 dark:text-purple-400 leading-tight'>
            {trainingCycleData.description}
          </p>
          <div className='space-y-1'>
            <div className='flex items-center justify-between text-xs'>
              <span className='text-purple-500 dark:text-purple-500'>Progress</span>
              <span className='text-purple-500 dark:text-purple-500'>{trainingCycleData.progress}%</span>
            </div>
            <Progress value={trainingCycleData.progress} className='h-1 sm:h-2' />
          </div>
          {trainingCycleData.additionalInfo && (
            <p className='text-xs text-purple-500 dark:text-purple-500'>
              {trainingCycleData.additionalInfo}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Competition Card */}
      <Card className='bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-xs sm:text-sm font-medium text-orange-700 dark:text-orange-300'>
            Next Competition
          </CardTitle>
          <Trophy className='h-3 w-3 sm:h-4 sm:w-4 text-orange-600 dark:text-orange-400' />
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='text-lg sm:text-2xl font-bold text-orange-900 dark:text-orange-100'>
            {competitionData.nextCompetition}
          </div>
          <p className='text-xs text-orange-600 dark:text-orange-400 leading-tight'>
            {competitionData.description}
          </p>
          <div className='space-y-1'>
            <p className='text-xs text-orange-500 dark:text-orange-500'>
              {competitionData.daysUntil > 0 
                ? `${competitionData.daysUntil} days remaining`
                : 'Competition completed'
              }
            </p>
            {competitionData.location && (
              <p className='text-xs text-orange-500 dark:text-orange-500'>
                📍 {competitionData.location}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KPICardsSkeleton() {
  return (
    <div className='grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4'>
      {[...Array(4)].map((_, i) => (
        <Card key={i} className='bg-muted/50'>
          <CardHeader className='space-y-0 pb-2'>
            <div className='h-3 sm:h-4 bg-muted rounded w-16 sm:w-20'></div>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='h-6 sm:h-8 bg-muted rounded w-12 sm:w-16'></div>
            <div className='h-3 bg-muted rounded w-20 sm:w-24'></div>
            <div className='h-3 bg-muted rounded w-16 sm:w-20'></div>
            <div className='h-6 sm:h-8 bg-muted rounded w-full'></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}