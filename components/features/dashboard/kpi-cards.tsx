'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCompetitionsStore, useSessionsStore, useTrainingStore } from '@/lib/store/unified';
import { Activity, Target, Trophy, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export function KPICards() {
  // OPTIMIZADO: Usar solo el store unificado
  const { sessions, setSessions } = useSessionsStore();
  const { getCurrentPhase } = useTrainingStore();
  const { competitions, getMainCompetition } = useCompetitionsStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Estados para los períodos seleccionados
  const [selectedDistancePeriod, setSelectedDistancePeriod] = useState<
    'year' | 'month' | 'week'
  >('week');
  const [selectedPeriod, setSelectedPeriod] = useState<
    'year' | 'month' | 'week'
  >('week');

  // Inicializar después de la hidratación para evitar errores de SSR
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Cargar sesiones al montar el componente
  useEffect(() => {
    const loadSessions = async () => {
      try {
        // Aquí iría la carga real de sesiones si fuera necesario
        // Por ahora usamos las sesiones del store
      } catch (error) {
        console.error('Error cargando sesiones:', error);
      }
    };

    loadSessions();
  }, [setSessions]);

  // Calcular datos de distancia basados en el período seleccionado
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

    // Filtrar sesiones del período
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
          label: 'Total acumulado este año',
          subtitle: `${periodDistance.toLocaleString()} metros`,
        };
      case 'month':
        return {
          distance: periodDistanceKm.toFixed(1),
          label: 'Total este mes',
          subtitle: `${periodDistance.toLocaleString()} metros`,
        };
      case 'week':
        return {
          distance: periodDistanceKm.toFixed(1),
          label: 'Total esta semana',
          subtitle: `${periodDistance.toLocaleString()} metros`,
        };
      default:
        return {
          distance: periodDistanceKm.toFixed(1),
          label: 'Total acumulado',
          subtitle: `${periodDistance.toLocaleString()} metros`,
        };
    }
  };

  // Calcular datos de sesiones basados en el período seleccionado
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

    // Filtrar sesiones del período
    const periodSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= periodStart && sessionDate <= now;
    });

    const periodSessionsCount = periodSessions.length;

    switch (selectedPeriod) {
      case 'year':
        return {
          total: periodSessionsCount,
          label: 'Total acumulado este año',
          subtitle: 'Sesiones registradas',
        };
      case 'month':
        return {
          total: periodSessionsCount,
          label: 'Total este mes',
          subtitle: 'Sesiones del mes actual',
        };
      case 'week':
        return {
          total: periodSessionsCount,
          label: 'Total esta semana',
          subtitle: 'Sesiones de esta semana',
        };
      default:
        return {
          total: periodSessionsCount,
          label: 'Total acumulado',
          subtitle: 'Sesiones registradas',
        };
    }
  };

  // Calcular estado del ciclo de entrenamiento usando las fases reales
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
        phase: 'Sin fase activa',
        progress: 0,
        description: 'No hay fase de entrenamiento activa',
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
    
    // Determinar el estado de la fase
    let status: 'upcoming' | 'active' | 'completed' = 'upcoming';
    if (phaseStart <= now && phaseEnd >= now) {
      status = 'active';
    } else if (phaseEnd < now) {
      status = 'completed';
    }

    // Calcular progreso de la fase actual
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
      description = `Inicia en ${Math.max(0, daysRemaining)} días`;
      additionalInfo = `Duración: ${currentPhase.duration} semanas`;
    } else if (status === 'active') {
      const daysInPhase = Math.ceil((now.getTime() - phaseStart.getTime()) / (1000 * 60 * 60 * 24));
      description = `${Math.max(0, daysRemaining)} días restantes`;
      additionalInfo = `${Math.max(0, daysInPhase)} días en la fase`;
    } else if (status === 'completed') {
      description = `Completada hace ${Math.abs(daysRemaining)} días`;
      additionalInfo = `Duración: ${currentPhase.duration} semanas`;
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
          <CardTitle className='text-sm font-medium'>Distancia Total</CardTitle>
          <Target className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{distanceData.distance} km</div>
          <p className='text-xs text-muted-foreground'>{distanceData.label}</p>
          <p className='text-xs text-muted-foreground mt-1'>
            {distanceData.subtitle}
          </p>

          {/* Tabs sutiles para seleccionar período de distancia */}
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
                  Año
                </TabsTrigger>
                <TabsTrigger value='month' className='text-xs px-2 py-1'>
                  Mes
                </TabsTrigger>
                <TabsTrigger value='week' className='text-xs px-2 py-1'>
                  Semana
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Card className='bg-muted/50 border-muted'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Sesiones</CardTitle>
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
                  Año
                </TabsTrigger>
                <TabsTrigger value='month' className='text-xs px-2 py-1'>
                  Mes
                </TabsTrigger>
                <TabsTrigger value='week' className='text-xs px-2 py-1'>
                  Semana
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Card className='bg-muted/50 border-muted'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Fase Actual</CardTitle>
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
            Próxima Competición
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
