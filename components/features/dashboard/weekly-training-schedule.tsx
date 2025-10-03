'use client';

import { QuickCreate } from '@/components/features/forms/quick-create';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useSessions } from '@/core/stores/entities/session';
import { addDays, format, isSameDay, isToday, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { Activity, Calendar, Clock, MapPin, Plus } from 'lucide-react';

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
  // MIGRATED: Use new normalized store instead of legacy getSessions
  const sessions = useSessions();

  const startWeek = startOfWeek(weekStart, { weekStartsOn: 1 }); // Monday
  const days = Array.from({ length: 7 }, (_, i) => addDays(startWeek, i));

  const dayNames = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  // Convert new store sessions to weekly schedule format
  const weeklyTrainings: TrainingSession[] = sessions.map(session => {
    // Calculate intensity based on RPE
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
      title: session.mainSet || 'Training Session', // Use mainSet as title
      time:
        session.timeSlot === 'AM'
          ? '09:00'
          : '18:00', // Use timeSlot from new store
      duration: session.totalVolume || 60, // Use totalVolume as duration
      type: session.sessionType, // Use sessionType from new store
      location: session.location || 'Not specified',
      coach: session.coach || 'Not specified',
      group: session.objective || 'Training', // Use objective field for group
      objective: session.objective || 'other',
      intensity: getIntensityFromRPE(session.averageRPE || 5), // Use averageRPE
      distance: session.distance || 0,
      isCompleted: new Date(session.date) < new Date(),
      timeSlot: session.timeSlot || 'AM', // Use timeSlot from new store
    };
  });

  // Sample training data (keep some for demo)
  const sampleTrainings: TrainingSession[] = [
    {
      id: '1',
      title: 'Endurance Training',
      time: '07:00',
      type: 'Aerobic',
      location: 'Municipal Pool',
      coach: 'Maria Garcia',
      group: 'Group A',
      objective: 'endurance',
      intensity: 'Z2',
      distance: 3000,
      isCompleted: true,
    },
    {
      id: '2',
      title: 'Technique Work',
      time: '18:30',
      duration: 60,
      type: 'Technique',
      location: 'Municipal Pool',
      coach: 'Carlos Lopez',
      group: 'Group A',
      objective: 'technique',
      intensity: 'Z1',
      distance: 2000,
      isCompleted: false,
    },
    {
      id: '3',
      title: 'Speed Intervals',
      time: '07:00',
      duration: 75,
      type: 'Speed',
      location: 'Municipal Pool',
      coach: 'Ana Martin',
      group: 'Group A',
      objective: 'speed',
      intensity: 'Z4',
      distance: 2500,
      isCompleted: false,
    },
    {
      id: '4',
      title: 'Long Distance',
      time: '09:00',
      duration: 120,
      type: 'Distance',
      location: 'Municipal Pool',
      coach: 'Maria Garcia',
      group: 'Group A',
      objective: 'endurance',
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
      case 'endurance':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      case 'speed':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'technique':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'strength':
        return 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800';
      case 'recovery':
        return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
      case 'competition':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'test':
        return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800';
      case 'other':
        return 'bg-slate-50 border-slate-200 dark:bg-slate-900/20 dark:border-slate-800';
      default:
        return 'bg-slate-50 border-slate-200 dark:bg-slate-900/20 dark:border-slate-800';
    }
  };

  const getObjectiveBadgeColor = (objective: string) => {
    switch (objective) {
      case 'endurance':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'speed':
        return 'bg-red-500 text-white hover:bg-red-600';
      case 'technique':
        return 'bg-green-500 text-white hover:bg-green-600';
      case 'strength':
        return 'bg-purple-500 text-white hover:bg-purple-600';
      case 'recovery':
        return 'bg-gray-500 text-white hover:bg-gray-600';
      case 'competition':
        return 'bg-yellow-500 text-white hover:bg-yellow-600';
      case 'test':
        return 'bg-orange-500 text-white hover:bg-orange-600';
      case 'other':
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

    // Filter real training sessions for this day and schedule
    const dayTrainings = weeklyTrainings.filter(training => {
      const session = sessions.find(s => s.id === training.id);
      return (
        session && session.date === dayString && training.timeSlot === timeSlot
      );
    });

    // If no real trainings, show some examples
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
          Weekly Plan
        </CardTitle>
        <CardDescription>
          {format(startWeek, 'dd MMM', { locale: es })} -{' '}
          {format(addDays(startWeek, 6), 'dd MMM yyyy', { locale: es })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Vista Desktop/Tablet - Grid 2x7 */}
        <div className='hidden lg:block'>
          {/* Day headers */}
          <div className='grid grid-cols-8 gap-3 mb-4'>
            <div className='text-center text-sm font-medium text-muted-foreground py-3'>
              {/* Empty space to align with rows */}
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
                <div key={`am-${index}`} className='min-h-[120px]'>
                  <div
                    className={`h-full p-2 rounded-lg border ${isCurrentDay ? 'border-primary/50 bg-primary/5 dark:bg-primary/10' : 'border-muted bg-background/50 dark:bg-background/80'}`}
                  >
                    {trainings.length === 0 ? (
                      <div className='flex items-center justify-center h-full'>
                        <QuickCreate
                          defaultDate={format(day, 'yyyy-MM-dd')}
                          defaultTimeSlot="AM"
                          trigger={
                            <Button
                              size='sm'
                              variant='ghost'
                              className='h-12 w-12 p-0 opacity-50 hover:opacity-100'
                            >
                              <Plus className='h-6 w-6' />
                            </Button>
                          }
                        />
                      </div>
                    ) : (
                      <div className='h-full flex flex-col'>
                        {trainings.map(training => (
                          <div
                            key={training.id}
                            className={`flex-1 p-3 rounded-lg text-sm border ${getObjectiveColor(training.objective)} flex flex-col justify-center items-center`}
                          >
                            <div className='flex items-center justify-center mb-2'>
                              <Badge
                                className={`${getObjectiveBadgeColor(training.objective)} text-xs px-3 py-1 font-medium`}
                              >
                                {training.objective}
                              </Badge>
                            </div>
                            <div className='text-center space-y-1'>
                              <div className='text-sm text-muted-foreground font-medium'>
                                {training.distance}m
                              </div>
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
                <div key={`pm-${index}`} className='min-h-[120px]'>
                  <div
                    className={`h-full p-2 rounded-lg border ${isCurrentDay ? 'border-primary/50 bg-primary/5 dark:bg-primary/10' : 'border-muted bg-background/50 dark:bg-background/80'}`}
                  >
                    {trainings.length === 0 ? (
                      <div className='flex items-center justify-center h-full'>
                        <QuickCreate
                          defaultDate={format(day, 'yyyy-MM-dd')}
                          defaultTimeSlot="PM"
                          trigger={
                            <Button
                              size='sm'
                              variant='ghost'
                              className='h-12 w-12 p-0 opacity-50 hover:opacity-100'
                            >
                              <Plus className='h-6 w-6' />
                            </Button>
                          }
                        />
                      </div>
                    ) : (
                      <div className='h-full flex flex-col'>
                        {trainings.map(training => (
                          <div
                            key={training.id}
                            className={`flex-1 p-3 rounded-lg text-sm border ${getObjectiveColor(training.objective)} flex flex-col justify-center items-center`}
                          >
                            <div className='flex items-center justify-center mb-2'>
                              <Badge
                                className={`${getObjectiveBadgeColor(training.objective)} text-xs px-3 py-1 font-medium`}
                              >
                                {training.objective}
                              </Badge>
                            </div>
                            <div className='text-center space-y-1'>
                              <div className='text-sm text-muted-foreground font-medium'>
                                {training.distance}m
                              </div>
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

        {/* Mobile View - Vertical list */}
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
                {/* Day header */}
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

                {/* AM Training */}
                {amTrainings.length > 0 && (
                  <div className='mb-4'>
                    <h4 className='text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2'>
                      <span className='w-8 h-6 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded text-xs flex items-center justify-center'>
                        AM
                      </span>
                      Morning
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
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PM Training */}
                {pmTrainings.length > 0 && (
                  <div>
                    <h4 className='text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2'>
                      <span className='w-8 h-6 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 rounded text-xs flex items-center justify-center'>
                        PM
                      </span>
                      Afternoon
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
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Button to add training if there's none */}
                {amTrainings.length === 0 && pmTrainings.length === 0 && (
                  <div className='text-center py-8'>
                    <Button size='sm' variant='outline' className='gap-2'>
                      <Plus className='h-4 w-4' />
                      Add Training
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Weekly summary - Connected to real data */}
        <div className='mt-6 pt-4 border-t'>
          {(() => {
            // Calculate real statistics for current week
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
                    Training Sessions
                  </div>
                </div>
                <div className='text-center p-2 bg-muted/30 dark:bg-muted/50 rounded-lg'>
                  <div className='text-lg font-semibold text-muted-foreground'>
                    {weekStats.completedTrainings}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    Completed
                  </div>
                </div>
                <div className='text-center p-2 bg-muted/30 dark:bg-muted/50 rounded-lg'>
                  <div className='text-lg font-semibold text-muted-foreground'>
                    {(weekStats.totalDistance / 1000).toFixed(1)}km
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    Total Distance
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
