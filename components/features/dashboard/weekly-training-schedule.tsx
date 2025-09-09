'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getSessions, type Session } from '@/lib/actions/sessions';
import { addDays, format, isSameDay, isToday, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { Activity, Calendar, Clock, MapPin, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TrainingSession {
  id: string;
  title: string;
  time: string;
  duration: number;
  type: string;
  location: string;
  coach: string;
  group: string;
  objective: string;
  intensity: 'Z1' | 'Z2' | 'Z3' | 'Z4' | 'Z5';
  distance: number;
  isCompleted: boolean;
  timeSlot?: 'AM' | 'PM';
}

interface WeeklyTrainingScheduleProps {
  weekStart?: Date;
}

export function WeeklyTrainingSchedule({
  weekStart = new Date(),
}: WeeklyTrainingScheduleProps) {
  const [sessions, setSessions] = useState<Session[]>([]);

  const startWeek = startOfWeek(weekStart, { weekStartsOn: 1 }); // Lunes
  const days = Array.from({ length: 7 }, (_, i) => addDays(startWeek, i));

  const dayNames = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  // Cargar sesiones reales desde Supabase
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await getSessions();
        setSessions(data);
      } catch (error) {
        console.error('Error cargando sesiones:', error);
        setSessions([]);
      } finally {
        // Loading completado
      }
    };

    loadSessions();
  }, []);

  // Convertir sesiones reales a formato para el horario semanal
  const weeklyTrainings: TrainingSession[] = sessions.map(session => {
    // Calcular intensidad basada en RPE
    const getIntensityFromRPE = (
      rpe: number
    ): 'Z1' | 'Z2' | 'Z3' | 'Z4' | 'Z5' => {
      if (rpe <= 3) return 'Z1';
      if (rpe >= 4 && rpe <= 5) return 'Z2';
      if (rpe >= 6 && rpe <= 7) return 'Z3';
      if (rpe >= 8 && rpe <= 9) return 'Z4';
      if (rpe >= 10) return 'Z5';
      return 'Z2';
    };

    return {
      id: session.id,
      title: session.title,
      time:
        (session as { time_slot?: 'AM' | 'PM' }).time_slot === 'AM'
          ? '09:00'
          : '18:00', // Usar time_slot para determinar hora
      duration: session.duration || 60,
      type: session.type,
      location: session.location || 'No especificado',
      coach: session.coach || 'No especificado',
      group: session.group_name || 'No especificado',
      objective: session.objective || 'otro',
      intensity: getIntensityFromRPE(session.rpe || 5),
      distance: session.distance || 0,
      isCompleted: new Date(session.date) < new Date(),
      timeSlot: (session as { time_slot?: 'AM' | 'PM' }).time_slot || 'AM', // Agregar timeSlot para filtrar
    };
  });

  // Datos de ejemplo de entrenamientos (mantener algunos para demo)
  const sampleTrainings: TrainingSession[] = [
    {
      id: '1',
      title: 'Entrenamiento de Resistencia',
      time: '07:00',
      duration: 90,
      type: 'Aeróbico',
      location: 'Piscina Municipal',
      coach: 'María García',
      group: 'Grupo A',
      objective: 'resistencia',
      intensity: 'Z2',
      distance: 3000,
      isCompleted: true,
    },
    {
      id: '2',
      title: 'Trabajo de Técnica',
      time: '18:30',
      duration: 60,
      type: 'Técnica',
      location: 'Piscina Municipal',
      coach: 'Carlos López',
      group: 'Grupo A',
      objective: 'tecnica',
      intensity: 'Z1',
      distance: 2000,
      isCompleted: false,
    },
    {
      id: '3',
      title: 'Intervalos de Velocidad',
      time: '07:00',
      duration: 75,
      type: 'Velocidad',
      location: 'Piscina Municipal',
      coach: 'Ana Martín',
      group: 'Grupo A',
      objective: 'velocidad',
      intensity: 'Z4',
      distance: 2500,
      isCompleted: false,
    },
    {
      id: '4',
      title: 'Fondo Largo',
      time: '09:00',
      duration: 120,
      type: 'Fondo',
      location: 'Piscina Municipal',
      coach: 'María García',
      group: 'Grupo A',
      objective: 'resistencia',
      intensity: 'Z2',
      distance: 5000,
      isCompleted: false,
    },
  ];

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'Z1':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Z2':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Z3':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Z4':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'Z5':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getObjectiveColor = (objective: string) => {
    switch (objective) {
      case 'resistencia':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      case 'velocidad':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'tecnica':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'fuerza':
        return 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800';
      case 'recuperacion':
        return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
      case 'competicion':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'test':
        return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800';
      case 'otro':
        return 'bg-slate-50 border-slate-200 dark:bg-slate-900/20 dark:border-slate-800';
      default:
        return 'bg-slate-50 border-slate-200 dark:bg-slate-900/20 dark:border-slate-800';
    }
  };

  const getObjectiveBadgeColor = (objective: string) => {
    switch (objective) {
      case 'resistencia':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'velocidad':
        return 'bg-red-500 text-white hover:bg-red-600';
      case 'tecnica':
        return 'bg-green-500 text-white hover:bg-green-600';
      case 'fuerza':
        return 'bg-purple-500 text-white hover:bg-purple-600';
      case 'recuperacion':
        return 'bg-gray-500 text-white hover:bg-gray-600';
      case 'competicion':
        return 'bg-yellow-500 text-white hover:bg-yellow-600';
      case 'test':
        return 'bg-orange-500 text-white hover:bg-orange-600';
      case 'otro':
        return 'bg-slate-500 text-white hover:bg-slate-600';
      default:
        return 'bg-slate-500 text-white hover:bg-slate-600';
    }
  };

  const getTrainingsForDayAndTime = (
    day: Date,
    timeSlot: string
  ): TrainingSession[] => {
    const dayString = format(day, 'yyyy-MM-dd');

    // Filtrar entrenamientos reales para este día y horario
    const dayTrainings = weeklyTrainings.filter(training => {
      const session = sessions.find(s => s.id === training.id);
      return (
        session && session.date === dayString && training.timeSlot === timeSlot
      );
    });

    // Si no hay entrenamientos reales, mostrar algunos de ejemplo
    if (dayTrainings.length === 0) {
      return sampleTrainings.filter(training => {
        const trainingDate = new Date(2024, 0, 15); // Fecha de ejemplo
        const isAM =
          training.time.includes('07:00') || training.time.includes('09:00');
        const isPM = training.time.includes('18:30');

        return (
          isSameDay(trainingDate, day) &&
          ((timeSlot === 'AM' && isAM) || (timeSlot === 'PM' && isPM))
        );
      });
    }

    return dayTrainings;
  };

  const getDayStats = (day: Date) => {
    const amTrainings = getTrainingsForDayAndTime(day, 'AM');
    const pmTrainings = getTrainingsForDayAndTime(day, 'PM');
    const totalTrainings = amTrainings.length + pmTrainings.length;
    const completedTrainings = [...amTrainings, ...pmTrainings].filter(
      t => t.isCompleted
    ).length;
    const totalDistance = [...amTrainings, ...pmTrainings].reduce(
      (sum, t) => sum + t.distance,
      0
    );

    return { totalTrainings, completedTrainings, totalDistance };
  };

  return (
    <Card className='bg-muted/50'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Calendar className='h-5 w-5' />
          Plan Semanal
        </CardTitle>
        <CardDescription>
          {format(startWeek, 'dd MMM', { locale: es })} -{' '}
          {format(addDays(startWeek, 6), 'dd MMM yyyy', { locale: es })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Vista Desktop/Tablet - Grid 2x7 */}
        <div className='hidden lg:block'>
          {/* Headers de días */}
          <div className='grid grid-cols-8 gap-3 mb-4'>
            <div className='text-center text-sm font-medium text-muted-foreground py-3'>
              {/* Espacio vacío para alinear con las filas */}
            </div>
            {dayNames.map((dayName, index) => {
              const day = days[index];
              const stats = getDayStats(day);
              const isCurrentDay = isToday(day);

              return (
                <div key={index} className='text-center'>
                  <div
                    className={`p-3 rounded-lg ${isCurrentDay ? 'bg-primary/10 border border-primary dark:bg-primary/20' : 'bg-muted/30 dark:bg-muted/50'}`}
                  >
                    <div className='text-sm font-medium'>{dayName}</div>
                    <div className='text-xs text-muted-foreground'>
                      {format(day, 'dd/MM', { locale: es })}
                    </div>
                    {stats.totalTrainings > 0 && (
                      <div className='text-xs mt-2'>
                        <div className='flex items-center justify-center gap-1'>
                          <Activity className='h-3 w-3' />
                          <span>
                            {stats.completedTrainings}/{stats.totalTrainings}
                          </span>
                        </div>
                        <div className='text-muted-foreground'>
                          {stats.totalDistance}m
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fila AM */}
          <div className='grid grid-cols-8 gap-3 mb-4'>
            <div className='text-center text-sm font-medium text-muted-foreground py-4 flex items-center justify-center bg-muted/30 dark:bg-muted/50 rounded-lg'>
              AM
            </div>
            {days.map((day, index) => {
              const trainings = getTrainingsForDayAndTime(day, 'AM');
              const isCurrentDay = isToday(day);

              return (
                <div key={`am-${index}`} className='min-h-[180px]'>
                  <div
                    className={`h-full p-4 rounded-lg border ${isCurrentDay ? 'border-primary/50 bg-primary/5 dark:bg-primary/10' : 'border-muted bg-background/50 dark:bg-background/80'}`}
                  >
                    {trainings.length === 0 ? (
                      <div className='flex items-center justify-center h-full'>
                        <Button
                          size='sm'
                          variant='ghost'
                          className='h-12 w-12 p-0 opacity-50 hover:opacity-100'
                        >
                          <Plus className='h-6 w-6' />
                        </Button>
                      </div>
                    ) : (
                      <div className='space-y-3'>
                        {trainings.map(training => (
                          <div
                            key={training.id}
                            className={`p-3 rounded-lg text-sm border ${getObjectiveColor(training.objective)}`}
                          >
                            <div className='flex items-center justify-center mb-2'>
                              <Badge
                                className={`${getObjectiveBadgeColor(training.objective)} text-sm px-3 py-1 font-medium`}
                              >
                                {training.objective}
                              </Badge>
                            </div>
                            <div className='flex items-center justify-center'>
                              <span className='text-sm text-muted-foreground'>
                                {training.distance}m
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fila PM */}
          <div className='grid grid-cols-8 gap-3'>
            <div className='text-center text-sm font-medium text-muted-foreground py-4 flex items-center justify-center bg-muted/30 dark:bg-muted/50 rounded-lg'>
              PM
            </div>
            {days.map((day, index) => {
              const trainings = getTrainingsForDayAndTime(day, 'PM');
              const isCurrentDay = isToday(day);

              return (
                <div key={`pm-${index}`} className='min-h-[180px]'>
                  <div
                    className={`h-full p-4 rounded-lg border ${isCurrentDay ? 'border-primary/50 bg-primary/5 dark:bg-primary/10' : 'border-muted bg-background/50 dark:bg-background/80'}`}
                  >
                    {trainings.length === 0 ? (
                      <div className='flex items-center justify-center h-full'>
                        <Button
                          size='sm'
                          variant='ghost'
                          className='h-12 w-12 p-0 opacity-50 hover:opacity-100'
                        >
                          <Plus className='h-6 w-6' />
                        </Button>
                      </div>
                    ) : (
                      <div className='space-y-3'>
                        {trainings.map(training => (
                          <div
                            key={training.id}
                            className={`p-3 rounded-lg text-sm border ${getObjectiveColor(training.objective)}`}
                          >
                            <div className='flex items-center justify-center mb-2'>
                              <Badge
                                className={`${getObjectiveBadgeColor(training.objective)} text-sm px-3 py-1 font-medium`}
                              >
                                {training.objective}
                              </Badge>
                            </div>
                            <div className='flex items-center justify-center'>
                              <span className='text-sm text-muted-foreground'>
                                {training.distance}m
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vista Móvil - Lista vertical */}
        <div className='lg:hidden space-y-4'>
          {days.map((day, index) => {
            const dayName = dayNames[index];
            const amTrainings = getTrainingsForDayAndTime(day, 'AM');
            const pmTrainings = getTrainingsForDayAndTime(day, 'PM');
            const isCurrentDay = isToday(day);
            const stats = getDayStats(day);

            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${isCurrentDay ? 'border-primary/50 bg-primary/5 dark:bg-primary/10' : 'border-muted bg-background/50 dark:bg-background/80'}`}
              >
                {/* Header del día */}
                <div className='flex items-center justify-between mb-4'>
                  <div>
                    <h3 className='font-semibold text-lg'>{dayName}</h3>
                    <p className='text-sm text-muted-foreground'>
                      {format(day, 'dd MMMM yyyy', { locale: es })}
                    </p>
                  </div>
                  {stats.totalTrainings > 0 && (
                    <div className='text-right'>
                      <div className='flex items-center gap-1 text-sm'>
                        <Activity className='h-4 w-4' />
                        <span>
                          {stats.completedTrainings}/{stats.totalTrainings}
                        </span>
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        {stats.totalDistance}m
                      </div>
                    </div>
                  )}
                </div>

                {/* Entrenamientos AM */}
                {amTrainings.length > 0 && (
                  <div className='mb-4'>
                    <h4 className='text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2'>
                      <span className='w-8 h-6 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded text-xs flex items-center justify-center'>
                        AM
                      </span>
                      Mañana
                    </h4>
                    <div className='space-y-2'>
                      {amTrainings.map(training => (
                        <div
                          key={training.id}
                          className={`p-3 rounded-lg border ${getObjectiveColor(training.objective)}`}
                        >
                          <div className='flex items-start justify-between mb-2'>
                            <h5 className='font-medium text-sm'>
                              {training.title}
                            </h5>
                            <Badge
                              className={`${getIntensityColor(training.intensity)} text-xs px-2 py-1`}
                            >
                              {training.intensity}
                            </Badge>
                          </div>
                          <div className='grid grid-cols-2 gap-2 text-xs text-muted-foreground'>
                            <div className='flex items-center gap-1'>
                              <Clock className='h-3 w-3' />
                              <span>{training.time}</span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <MapPin className='h-3 w-3' />
                              <span className='truncate'>
                                {training.location}
                              </span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <span>{training.distance}m</span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <span>{training.duration}min</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Entrenamientos PM */}
                {pmTrainings.length > 0 && (
                  <div>
                    <h4 className='text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2'>
                      <span className='w-8 h-6 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 rounded text-xs flex items-center justify-center'>
                        PM
                      </span>
                      Tarde
                    </h4>
                    <div className='space-y-2'>
                      {pmTrainings.map(training => (
                        <div
                          key={training.id}
                          className={`p-3 rounded-lg border ${getObjectiveColor(training.objective)}`}
                        >
                          <div className='flex items-start justify-between mb-2'>
                            <h5 className='font-medium text-sm'>
                              {training.title}
                            </h5>
                            <Badge
                              className={`${getIntensityColor(training.intensity)} text-xs px-2 py-1`}
                            >
                              {training.intensity}
                            </Badge>
                          </div>
                          <div className='grid grid-cols-2 gap-2 text-xs text-muted-foreground'>
                            <div className='flex items-center gap-1'>
                              <Clock className='h-3 w-3' />
                              <span>{training.time}</span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <MapPin className='h-3 w-3' />
                              <span className='truncate'>
                                {training.location}
                              </span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <span>{training.distance}m</span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <span>{training.duration}min</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botón para agregar entrenamiento si no hay ninguno */}
                {amTrainings.length === 0 && pmTrainings.length === 0 && (
                  <div className='text-center py-8'>
                    <Button size='sm' variant='outline' className='gap-2'>
                      <Plus className='h-4 w-4' />
                      Agregar Entrenamiento
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Resumen semanal - Conectado a datos reales */}
        <div className='mt-6 pt-4 border-t'>
          {(() => {
            // Calcular estadísticas reales de la semana actual
            const weekStats = days.reduce(
              (acc, day) => {
                const dayStats = getDayStats(day);
                acc.totalTrainings += dayStats.totalTrainings;
                acc.completedTrainings += dayStats.completedTrainings;
                acc.totalDistance += dayStats.totalDistance;
                return acc;
              },
              { totalTrainings: 0, completedTrainings: 0, totalDistance: 0 }
            );

            return (
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                <div className='text-center p-2 bg-muted/30 dark:bg-muted/50 rounded-lg'>
                  <div className='text-lg font-semibold text-muted-foreground'>
                    {weekStats.totalTrainings}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    Entrenamientos
                  </div>
                </div>
                <div className='text-center p-2 bg-muted/30 dark:bg-muted/50 rounded-lg'>
                  <div className='text-lg font-semibold text-muted-foreground'>
                    {weekStats.completedTrainings}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    Completados
                  </div>
                </div>
                <div className='text-center p-2 bg-muted/30 dark:bg-muted/50 rounded-lg'>
                  <div className='text-lg font-semibold text-muted-foreground'>
                    {(weekStats.totalDistance / 1000).toFixed(1)}km
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    Distancia Total
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </CardContent>
    </Card>
  );
}
