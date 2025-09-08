'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Session as SupabaseSession } from '@/lib/actions/sessions';
import { getSessions } from '@/lib/actions/sessions';
import { useCompetitionsStore, useTrainingStore } from '@/lib/store/unified';
import { Activity, Calendar, Target, Trophy, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
// NUEVO: Importar el store unificado
import { useSessionsStore } from '@/lib/store/unified';
import type { Session } from '@/lib/types/session';

// Función para mapear SupabaseSession a Session
const mapSupabaseToSession = (supabaseSession: SupabaseSession): Session => ({
  id: supabaseSession.id,
  date: supabaseSession.date,
  swimmer: supabaseSession.coach || 'N/A',
  distance: supabaseSession.distance,
  durationMin: supabaseSession.duration,
  stroke: supabaseSession.stroke as
    | 'freestyle'
    | 'backstroke'
    | 'breaststroke'
    | 'butterfly'
    | 'mixed',
  sessionType: supabaseSession.type as
    | 'aerobic'
    | 'threshold'
    | 'speed'
    | 'technique'
    | 'recovery',
  mainSet: supabaseSession.content || '',
  RPE: supabaseSession.rpe as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
  notes: supabaseSession.objective || '',
});

export function KPICards() {
  // OPTIMIZADO: Usar solo el store unificado
  const { sessions, isLoading, setSessions } = useSessionsStore();

  // Cargar sesiones reales desde Supabase
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await getSessions();
        const mappedSessions = data.map(mapSupabaseToSession);
        // OPTIMIZADO: Usar directamente el store
        setSessions(mappedSessions);
      } catch (error) {
        console.error('Error cargando sesiones:', error);
        setSessions([]);
      }
    };

    loadSessions();
  }, [setSessions]);

  // Calcular estadísticas desde datos reales
  // const stats = {
  //   totalSessions: sessions.length,
  //   totalDistance: sessions.reduce((sum, session) => sum + (session.distance || 0), 0),
  //   totalDuration: sessions.reduce((sum, session) => sum + (session.duration || 0), 0),
  //   averageRPE: sessions.length > 0 ? sessions.reduce((sum, session) => sum + (session.rpe || 0), 0) / sessions.length : 0
  // };
  const [selectedPeriod, setSelectedPeriod] = useState<
    'year' | 'month' | 'week'
  >('year');
  const [selectedDistancePeriod, setSelectedDistancePeriod] = useState<
    'year' | 'month' | 'week'
  >('year');
  const { getCurrentPhase } = useTrainingStore();
  const { competitions } = useCompetitionsStore();

  // Calcular distancia por período usando datos reales
  const getDistanceByPeriod = () => {
    const now = new Date();
    let filteredSessions = sessions;

    // Filtrar sesiones por período
    switch (selectedDistancePeriod) {
      case 'year':
        filteredSessions = sessions.filter(session => {
          const sessionDate = new Date(session.date);
          return sessionDate.getFullYear() === now.getFullYear();
        });
        break;
      case 'month':
        filteredSessions = sessions.filter(session => {
          const sessionDate = new Date(session.date);
          return (
            sessionDate.getFullYear() === now.getFullYear() &&
            sessionDate.getMonth() === now.getMonth()
          );
        });
        break;
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        filteredSessions = sessions.filter(session => {
          const sessionDate = new Date(session.date);
          return sessionDate >= weekStart && sessionDate <= weekEnd;
        });
        break;
    }

    const periodDistance = filteredSessions.reduce(
      (sum, session) => sum + (session.distance || 0),
      0
    );
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

  // Calcular sesiones por período usando datos reales
  const getSessionsByPeriod = () => {
    const now = new Date();
    let filteredSessions = sessions;

    // Filtrar sesiones por período
    switch (selectedPeriod) {
      case 'year':
        filteredSessions = sessions.filter(session => {
          const sessionDate = new Date(session.date);
          return sessionDate.getFullYear() === now.getFullYear();
        });
        break;
      case 'month':
        filteredSessions = sessions.filter(session => {
          const sessionDate = new Date(session.date);
          return (
            sessionDate.getFullYear() === now.getFullYear() &&
            sessionDate.getMonth() === now.getMonth()
          );
        });
        break;
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        filteredSessions = sessions.filter(session => {
          const sessionDate = new Date(session.date);
          return sessionDate >= weekStart && sessionDate <= weekEnd;
        });
        break;
    }

    const periodSessions = filteredSessions.length;

    switch (selectedPeriod) {
      case 'year':
        return {
          total: periodSessions,
          label: 'Total acumulado este año',
          subtitle: 'Sesiones registradas',
        };
      case 'month':
        return {
          total: periodSessions,
          label: 'Total este mes',
          subtitle: 'Sesiones del mes actual',
        };
      case 'week':
        return {
          total: periodSessions,
          label: 'Total esta semana',
          subtitle: 'Sesiones de la semana',
        };
      default:
        return {
          total: periodSessions,
          label: 'Total acumulado',
          subtitle: 'Sesiones registradas',
        };
    }
  };

  // Calcular estado del ciclo de entrenamiento usando las fases reales
  const getTrainingCycleStatus = () => {
    const currentPhase = getCurrentPhase();

    if (!currentPhase) {
      return {
        phase: 'Sin fase activa',
        phaseColor: 'text-gray-600',
        progress: 0,
        label: 'Estado del ciclo',
        subtitle: 'No hay fase activa en este momento',
      };
    }

    // Determinar color basado en la fase actual
    let phaseColor = '';
    switch (currentPhase.name.toLowerCase()) {
      case 'base':
        phaseColor = 'text-blue-600';
        break;
      case 'construcción':
        phaseColor = 'text-green-600';
        break;
      case 'específico':
        phaseColor = 'text-orange-600';
        break;
      case 'pico':
        phaseColor = 'text-red-600';
        break;
      default:
        phaseColor = 'text-purple-600';
    }

    // Calcular progreso de la fase actual
    const now = new Date();
    const phaseStart = new Date(currentPhase.startDate!);
    const phaseEnd = new Date(currentPhase.endDate!);
    const totalPhaseDays = Math.ceil(
      (phaseEnd.getTime() - phaseStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysInPhase = Math.ceil(
      (now.getTime() - phaseStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    const phaseProgress = Math.min(
      Math.max((daysInPhase / totalPhaseDays) * 100, 0),
      100
    );

    return {
      phase: currentPhase.name,
      phaseColor,
      progress: Math.round(phaseProgress),
      label: 'Fase del ciclo actual',
      subtitle: `Semana ${Math.ceil(daysInPhase / 7)} de ${currentPhase.duration} - ${Math.round(phaseProgress)}% completado`,
    };
  };

  // Calcular días hasta campeonato usando competiciones reales
  const getDaysToChampionship = () => {
    const now = new Date();

    // Obtener la próxima competición (más cercana en el tiempo)
    const upcomingCompetitions = competitions
      .filter(comp => comp.status === 'upcoming' && new Date(comp.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (upcomingCompetitions.length === 0) {
      return {
        days: 0,
        urgency: 'Sin eventos',
        urgencyColor: 'text-gray-600',
        label: 'Sin competiciones',
        subtitle: 'No hay eventos programados',
      };
    }

    const nextCompetition = upcomingCompetitions[0];
    const competitionDate = new Date(nextCompetition.date);
    const daysUntil = Math.ceil(
      (competitionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Determinar urgencia basada en prioridad y días restantes
    let urgency = '';
    let urgencyColor = '';

    if (nextCompetition.priority === 'high') {
      if (daysUntil > 60) {
        urgency = 'Preparación';
        urgencyColor = 'text-red-600';
      } else if (daysUntil > 30) {
        urgency = 'Intensificación';
        urgencyColor = 'text-red-500';
      } else if (daysUntil > 14) {
        urgency = 'Afino';
        urgencyColor = 'text-red-400';
      } else {
        urgency = 'Taper';
        urgencyColor = 'text-red-300';
      }
    } else if (nextCompetition.priority === 'medium') {
      if (daysUntil > 60) {
        urgency = 'Preparación';
        urgencyColor = 'text-yellow-600';
      } else if (daysUntil > 30) {
        urgency = 'Intensificación';
        urgencyColor = 'text-yellow-500';
      } else if (daysUntil > 14) {
        urgency = 'Afino';
        urgencyColor = 'text-yellow-400';
      } else {
        urgency = 'Taper';
        urgencyColor = 'text-yellow-300';
      }
    } else {
      if (daysUntil > 60) {
        urgency = 'Preparación';
        urgencyColor = 'text-green-600';
      } else if (daysUntil > 30) {
        urgency = 'Intensificación';
        urgencyColor = 'text-green-500';
      } else if (daysUntil > 14) {
        urgency = 'Afino';
        urgencyColor = 'text-green-400';
      } else {
        urgency = 'Taper';
        urgencyColor = 'text-green-300';
      }
    }

    return {
      days: daysUntil,
      urgency,
      urgencyColor,
      label: nextCompetition.name,
      subtitle: competitionDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };
  };

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className='bg-muted/50 border-muted'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <div className='h-4 w-24 bg-muted animate-pulse rounded'></div>
              <div className='h-4 w-4 bg-muted animate-pulse rounded'></div>
            </CardHeader>
            <CardContent>
              <div className='h-8 w-16 bg-muted animate-pulse rounded mb-2'></div>
              <div className='h-3 w-32 bg-muted animate-pulse rounded'></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const distanceData = getDistanceByPeriod();
  const sessionsData = getSessionsByPeriod();
  const cycleData = getTrainingCycleStatus();
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

          {/* Tabs para seleccionar período de distancia */}
          <div className='mt-3'>
            <Tabs
              value={selectedDistancePeriod}
              onValueChange={value =>
                setSelectedDistancePeriod(value as 'year' | 'month' | 'week')
              }
              className='w-full'
            >
              <TabsList className='grid w-full grid-cols-3 bg-muted h-8'>
                <TabsTrigger value='year' className='text-xs'>
                  Año
                </TabsTrigger>
                <TabsTrigger value='month' className='text-xs'>
                  Mes
                </TabsTrigger>
                <TabsTrigger value='week' className='text-xs'>
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

          {/* Tabs para seleccionar período de sesiones */}
          <div className='mt-3'>
            <Tabs
              value={selectedPeriod}
              onValueChange={value =>
                setSelectedPeriod(value as 'year' | 'month' | 'week')
              }
              className='w-full'
            >
              <TabsList className='grid w-full grid-cols-3 bg-muted h-8'>
                <TabsTrigger value='year' className='text-xs'>
                  Año
                </TabsTrigger>
                <TabsTrigger value='month' className='text-xs'>
                  Mes
                </TabsTrigger>
                <TabsTrigger value='week' className='text-xs'>
                  Semana
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Card className='bg-muted/50 border-muted'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Estado del Ciclo
          </CardTitle>
          <Activity className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            <span className={cycleData.phaseColor}>{cycleData.phase}</span>
          </div>
          <p className='text-xs text-muted-foreground'>{cycleData.label}</p>
          <p className='text-xs text-muted-foreground mt-1'>
            {cycleData.subtitle}
          </p>
          <div className='mt-2'>
            <div className='w-full bg-muted rounded-full h-2'>
              <div
                className='bg-primary h-2 rounded-full transition-all duration-300'
                style={{ width: `${cycleData.progress}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='bg-muted/50 border-muted'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Días al Campeonato
          </CardTitle>
          <Trophy className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            <span className={championshipData.urgencyColor}>
              {championshipData.days}
            </span>
          </div>
          <p className='text-xs text-muted-foreground'>
            {championshipData.label}
          </p>
          <div className='mt-2'>
            <div className='flex items-center gap-2'>
              <Calendar className='h-3 w-3 text-muted-foreground' />
              <span className='text-xs text-muted-foreground'>
                {championshipData.subtitle}
              </span>
            </div>
          </div>

          {/* Leyenda de prioridades */}
          <div className='mt-3 pt-2 border-t border-muted'>
            <div className='text-xs text-muted-foreground mb-2'>Prioridad:</div>
            <div className='flex gap-3 text-xs'>
              <div className='flex items-center gap-1'>
                <div className='w-2 h-2 rounded-full bg-red-500'></div>
                <span className='text-muted-foreground'>Alta</span>
              </div>
              <div className='flex items-center gap-1'>
                <div className='w-2 h-2 rounded-full bg-yellow-500'></div>
                <span className='text-muted-foreground'>Media</span>
              </div>
              <div className='flex items-center gap-1'>
                <div className='w-2 h-2 rounded-full bg-green-500'></div>
                <span className='text-muted-foreground'>Baja</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
