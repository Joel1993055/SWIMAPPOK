'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useSessions,
  useSessionsCount,
  useSessionsSelectors,
} from '@/core/stores/entities/session';
import {
  useCompetitionsStore,
  useTrainingStore,
} from '@/core/stores/unified';
import { endOfWeek, startOfWeek } from 'date-fns';
import { Activity, Target, Trophy, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export function KPICards() {
  // MIGRATED: Use new entity store directly
  const sessions = useSessions();
  const sessionsSelectors = useSessionsSelectors();
  const sessionsCount = useSessionsCount();
  const { getCurrentPhase } = useTrainingStore();
  const { getMainCompetition } = useCompetitionsStore();
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

  // Calculate distance data based on selected period
  const getDistanceData = () => {
    const now = new Date();
    let periodStart: Date;
    let periodEnd: Date;

    switch (selectedDistancePeriod) {
      case 'year':
        periodStart = new Date(now.getFullYear(), 0, 1);
        periodEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        break;
      case 'month':
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        break;
      case 'week':
      default:
        periodStart = startOfWeek(now, { weekStartsOn: 1 });
        periodEnd = endOfWeek(now, { weekStartsOn: 1 });
        break;
    }

    const periodSessions = sessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= periodStart && sessionDate <= periodEnd;
    });

    const periodDistance = periodSessions.reduce(
      (total, session) => total + (session.distance || 0),
      0
    );

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
      default:
        return {
          distance: periodDistanceKm.toFixed(1),
          label: 'Total this week',
          subtitle: `${periodDistance.toLocaleString()} meters`,
        };
    }
  };

  // Calculate session data based on selected period
  const getSessionsData = () => {
    const now = new Date();
    let periodStart: Date;
    let periodEnd: Date;

    switch (selectedPeriod) {
      case 'year':
        periodStart = new Date(now.getFullYear(), 0, 1);
        periodEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        break;
      case 'month':
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        break;
      case 'week':
      default:
        periodStart = startOfWeek(now, { weekStartsOn: 1 });
        periodEnd = endOfWeek(now, { weekStartsOn: 1 });
        break;
    }

    const periodSessions = sessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= periodStart && sessionDate <= periodEnd;
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
      default:
        return {
          total: periodSessionsCount,
          label: 'Total this week',
          subtitle: 'Sessions this week',
        };
    }
  };

  // Training cycle status
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
    const phaseEnd = currentPhase.endDate ? new Date(currentPhase.endDate) : now;

    let status: 'upcoming' | 'active' | 'completed' = 'upcoming';
    if (phaseStart <= now && phaseEnd >= now) {
      status = 'active';
    } else if (phaseEnd < now) {
      status = 'completed';
    }

    const totalDuration = phaseEnd.getTime() - phaseStart.getTime();
    const elapsed = now.getTime() - phaseStart.getTime();
    const progress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
    const daysRemaining = Math.max(
      0,
      Math.ceil((phaseEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );

    let color = 'bg-gray-500';
    if (status === 'active') color = 'bg-green-500';
    else if (status === 'upcoming') color = 'bg-blue-500';
    else if (status === 'completed') color = 'bg-purple-500';

    return {
      phase: currentPhase.name || 'Training Phase',
      progress: Math.round(progress),
      description: currentPhase.description || 'Training phase in progress',
      additionalInfo: currentPhase.focus
        ? `Focus: ${
            Array.isArray(currentPhase.focus)
              ? currentPhase.focus.join(', ')
              : currentPhase.focus
          }`
        : '',
      color,
      status,
      daysRemaining,
    };
  };

  // Competition data
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
    const daysUntil = Math.ceil(
      (competitionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

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
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {/* Distance Card */}
      <Card className="bg-muted/50 border-muted">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
            Distance
          </CardTitle>
          <Target className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-lg sm:text-2xl font-bold text-foreground">
            {distanceData.distance} km
          </div>
          <p className="text-xs text-muted-foreground leading-tight">
            {distanceData.label}
          </p>
          <p className="text-xs text-muted-foreground">
            {distanceData.subtitle}
          </p>
          <Tabs
            value={selectedDistancePeriod}
            onValueChange={(value) =>
              setSelectedDistancePeriod(value as 'year' | 'month' | 'week')
            }
            className="mt-2"
          >
            <TabsList className="grid w-full grid-cols-3 h-6 sm:h-8">
              <TabsTrigger value="week" className="text-xs">
                Week
              </TabsTrigger>
              <TabsTrigger value="month" className="text-xs">
                Month
              </TabsTrigger>
              <TabsTrigger value="year" className="text-xs">
                Year
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Sessions Card */}
      <Card className="bg-muted/50 border-muted">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
            Sessions
          </CardTitle>
          <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-lg sm:text-2xl font-bold text-foreground">
            {sessionsData.total}
          </div>
          <p className="text-xs text-muted-foreground leading-tight">
            {sessionsData.label}
          </p>
          <p className="text-xs text-muted-foreground">
            {sessionsData.subtitle}
          </p>
          <Tabs
            value={selectedPeriod}
            onValueChange={(value) =>
              setSelectedPeriod(value as 'year' | 'month' | 'week')
            }
            className="mt-2"
          >
            <TabsList className="grid w-full grid-cols-3 h-6 sm:h-8">
              <TabsTrigger value="week" className="text-xs">
                Week
              </TabsTrigger>
              <TabsTrigger value="month" className="text-xs">
                Month
              </TabsTrigger>
              <TabsTrigger value="year" className="text-xs">
                Year
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Training Phase Card */}
      <Card className="bg-muted/50 border-muted">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
            Training Phase
          </CardTitle>
          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-lg sm:text-2xl font-bold text-foreground">
            {trainingCycleData.phase}
          </div>
          <p className="text-xs text-muted-foreground leading-tight">
            {trainingCycleData.description}
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-muted-foreground">
                {trainingCycleData.progress}%
              </span>
            </div>
            <Progress value={trainingCycleData.progress} className="h-1 sm:h-2" />
          </div>
          {trainingCycleData.additionalInfo && (
            <p className="text-xs text-muted-foreground">
              {trainingCycleData.additionalInfo}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Competition Card */}
      <Card className="bg-muted/50 border-muted">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
            Next Competition
          </CardTitle>
          <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-lg sm:text-2xl font-bold text-foreground">
            {competitionData.nextCompetition}
          </div>
          <p className="text-xs text-muted-foreground leading-tight">
            {competitionData.description}
          </p>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              {competitionData.daysUntil > 0
                ? `${competitionData.daysUntil} days remaining`
                : 'Competition completed'}
            </p>
            {competitionData.location && (
              <p className="text-xs text-muted-foreground">
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
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="bg-muted/50">
          <CardHeader className="space-y-0 pb-2">
            <div className="h-3 sm:h-4 bg-muted rounded w-16 sm:w-20" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-6 sm:h-8 bg-muted rounded w-12 sm:w-16" />
            <div className="h-3 bg-muted rounded w-20 sm:w-24" />
            <div className="h-3 bg-muted rounded w-16 sm:w-20" />
            <div className="h-6 sm:h-8 bg-muted rounded w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
