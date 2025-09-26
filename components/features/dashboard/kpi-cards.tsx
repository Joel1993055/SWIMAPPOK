'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCompetitionsStore, useSessionsStore, useTrainingStore } from '@/lib/store/unified';
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
          subtitle: `${periodDistance.toLocaleString()} metros`,
        };
      case 'month':
        return {
          distance: periodDistanceKm.toFixed(1),
          label: 'Total this month',
          subtitle: `${periodDistance.toLocaleString()} metros`,
        };
      case 'week':
        return {
          distance: periodDistanceKm.toFixed(1),
          label: 'Total this week',
          subtitle: `${periodDistance.toLocaleString()} metros`,
        };
      default:
        return {
          distance: periodDistanceKm.toFixed(1),
          label: 'Total accumulated',
          subtitle: `${periodDistance.toLocaleString()} metros`,
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
          subtitle: 'Sesiones registradas',
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
          subtitle: 'Sesiones registradas',
        };
    }
  };

  // Calculate training cycle status using real phases
  const getTrainingCycleStatus = () => {
    if (!isHydrated) {
      return {
        phase: 'Cargando...',
        progress: 0,
        description: 'Calculando progreso',
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

    // Calculate current phase progress
    const totalPhaseDays = Math.ceil(
      (phaseEnd.getTime() - phaseStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysPassed = Math.ceil(
      (now.getTime() - phaseStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysRemaining = Math.ceil(
      (phaseEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const progress = status === 'active' 
      ? Math.min(Math.max((daysPassed / totalPhaseDays) * 100, 0), 100)
      : status === 'completed' ? 100 : 0;

    // Generar descripción basada en el estado
    let description = currentPhase.description;
    let additionalInfo = '';
    
    if (status === 'upcoming') {
      description = `Starts in ${Math.max(0, daysRemaining)} days`;
      additionalInfo = `Duration: ${currentPhase.duration} weeks`;
    } else if (status === 'active') {
      const daysInPhase = Math.ceil((now.getTime() - phaseStart.getTime()) / (1000 * 60 * 60 * 24));
      description = `${Math.max(0, daysRemaining)} days remaining`;
      additionalInfo = `${Math.max(0, daysInPhase)} days in phase`;
    } else if (status === 'completed') {
      description = `Completed ${Math.abs(daysRemaining)} days ago`;
      additionalInfo = `Duration: ${currentPhase.duration} weeks`;
    }

    return {
      phase: currentPhase.name,
      progress: Math.round(progress),
      description,
      additionalInfo,
      color: currentPhase.color,
      status,
      daysRemaining: Math.max(0, daysRemaining),
    };
  };

  // Calcular días hasta la próxima competición
  const getDaysToChampionship = () => {
    if (!isHydrated || !competitions || competitions.length === 0) {
      return {
        days: 0,
        event: 'Sin competiciones',
        location: 'No hay eventos programados',
      };
    }

    // Obtener la competición principal (prioridad alta) o la más próxima
    const mainCompetition = getMainCompetition();
    const nextCompetition = mainCompetition || competitions
      .filter(comp => comp.status === 'upcoming')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

    if (!nextCompetition) {
      return {
        days: 0,
        event: 'Sin competiciones',
        location: 'No hay eventos programados',
      };
    }

    const today = new Date();
    const competitionDate = new Date(nextCompetition.date);
    const timeDiff = competitionDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return {
      days: Math.max(0, daysDiff),
      event: nextCompetition.name,
      location: nextCompetition.location,
      date: nextCompetition.date,
    };
  };

  const distanceData = getDistanceData();
  const sessionsData = getSessionsData();
  const cycleStatus = getTrainingCycleStatus();
  const championshipData = getDaysToChampionship();

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card className='bg-muted/50 border-muted'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Distance</CardTitle>
          <Target className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{distanceData.distance} km</div>
          <p className='text-xs text-muted-foreground'>{distanceData.label}</p>
          <p className='text-xs text-muted-foreground mt-1'>
            {distanceData.subtitle}
          </p>

          {/* Subtle tabs to select distance period */}
          <div className='mt-3'>
            <Tabs
              value={selectedDistancePeriod}
              onValueChange={value =>
                setSelectedDistancePeriod(value as 'year' | 'month' | 'week')
              }
              className='w-full'
            >
              <TabsList className='grid w-full grid-cols-3 bg-muted/50 h-7'>
                <TabsTrigger value='year' className='text-xs px-2 py-1'>
                  Year
                </TabsTrigger>
                <TabsTrigger value='month' className='text-xs px-2 py-1'>
                  Month
                </TabsTrigger>
                <TabsTrigger value='week' className='text-xs px-2 py-1'>
                  Week
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Card className='bg-muted/50 border-muted'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Sessions</CardTitle>
          <Users className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{sessionsData.total}</div>
          <p className='text-xs text-muted-foreground'>{sessionsData.label}</p>
          <p className='text-xs text-muted-foreground mt-1'>
            {sessionsData.subtitle}
          </p>

          {/* Tabs sutiles para seleccionar período de sesiones */}
          <div className='mt-3'>
            <Tabs
              value={selectedPeriod}
              onValueChange={value =>
                setSelectedPeriod(value as 'year' | 'month' | 'week')
              }
              className='w-full'
            >
              <TabsList className='grid w-full grid-cols-3 bg-muted/50 h-7'>
                <TabsTrigger value='year' className='text-xs px-2 py-1'>
                  Year
                </TabsTrigger>
                <TabsTrigger value='month' className='text-xs px-2 py-1'>
                  Month
                </TabsTrigger>
                <TabsTrigger value='week' className='text-xs px-2 py-1'>
                  Week
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Card className='bg-muted/50 border-muted'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Current Phase</CardTitle>
          <Activity className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-2 mb-2'>
            <div className={`w-3 h-3 rounded-full ${cycleStatus.color}`}></div>
            <span className='text-sm font-medium'>{cycleStatus.phase}</span>
            {cycleStatus.status === 'upcoming' && (
              <span className='text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>
                Próxima
              </span>
            )}
            {cycleStatus.status === 'completed' && (
              <span className='text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full'>
                Completada
              </span>
            )}
          </div>
          <Progress value={cycleStatus.progress} className='h-2 mb-2' />
          <p className='text-xs text-muted-foreground'>
            {cycleStatus.progress}% completado
          </p>
          <p className='text-xs text-muted-foreground mt-1'>
            {cycleStatus.description}
          </p>
          {cycleStatus.additionalInfo && (
            <p className='text-xs text-muted-foreground mt-1'>
              {cycleStatus.additionalInfo}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className='bg-muted/50 border-muted'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Next Competition
          </CardTitle>
          <Trophy className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {championshipData.days === 0 ? 'Sin eventos' : `${championshipData.days} días`}
          </div>
          <p className='text-xs text-muted-foreground'>
            {championshipData.event}
          </p>
          <p className='text-xs text-muted-foreground mt-1'>
            {championshipData.location}
          </p>
          {championshipData.date && (
            <p className='text-xs text-muted-foreground mt-1'>
              {new Date(championshipData.date).toLocaleDateString('es-ES')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
