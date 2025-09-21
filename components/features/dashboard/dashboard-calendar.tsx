'use client';

import { TrainingDetailModal } from '@/components/features/calendar/training-detail-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { getSessions, type Session } from '@/lib/actions/sessions';
import { useCompetitionsStore } from '@/lib/store/unified';
import {
    Activity,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    Target,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
// NUEVO: Importar el store unificado

export function DashboardCalendar() {
  // SOLUCIÓN: Estado de hidratación para evitar errores SSR
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<{
    day: number;
    month: string;
    year: number;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedTraining, setSelectedTraining] = useState<Session | null>(null);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);

  // MANTENER: Context existente
  const { getCompetitionsByDate } = useCompetitionsStore();

  // OPTIMIZADO: Solo usar lo necesario del store
  const { competitions: storeCompetitions } = useCompetitionsStore();

  // SOLUCIÓN: Efecto para manejar la hidratación
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // NUEVO: Sincronizar datos del context al store
  React.useEffect(() => {
    if (storeCompetitions.length === 0) {
      // Si el store está vacío, no hacer nada por ahora
      // La sincronización se maneja en el componente padre
    }
  }, [storeCompetitions]);

  const months = [
    { name: 'enero', short: 'ene', days: 31 },
    { name: 'febrero', short: 'feb', days: 28 },
    { name: 'marzo', short: 'mar', days: 31 },
    { name: 'abril', short: 'abr', days: 30 },
    { name: 'mayo', short: 'may', days: 31 },
    { name: 'junio', short: 'jun', days: 30 },
    { name: 'julio', short: 'jul', days: 31 },
    { name: 'agosto', short: 'ago', days: 31 },
    { name: 'septiembre', short: 'sep', days: 30 },
    { name: 'octubre', short: 'oct', days: 31 },
    { name: 'noviembre', short: 'nov', days: 30 },
    { name: 'diciembre', short: 'dic', days: 31 },
  ];

  const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

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
        // setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentMonthName = months[currentMonth].name;

  // Convertir sesiones reales a formato para el calendario
  const dailyTrainingData = sessions.reduce(
    (acc, session) => {
      const dateKey = session.date;
      if (!acc[dateKey]) {
        acc[dateKey] = { sessions: [] };
      }

      acc[dateKey].sessions.push({
        time: '09:00', // Podríamos agregar un campo de hora a las sesiones
        type: session.type,
        distance: session.distance || 0,
        duration: session.duration || 0,
        stroke: session.stroke || 'Libre',
        rpe: session.rpe || 5,
      });

      return acc;
    },
    {} as Record<
      string,
      {
        sessions: Array<{
          time: string;
          type: string;
          distance: number;
          duration: number;
          stroke: string;
          rpe: number;
        }>;
      }
    >
  );

  // Debug temporal (comentado para producción)
  // console.log("Sessions en calendario:", sessions);
  // console.log("Datos diarios del calendario:", dailyTrainingData);

  const generateCalendarDays = () => {
    const month = months[currentMonth];
    const days = [];

    // Obtener el primer día del mes y qué día de la semana es
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDay = firstDay.getDay(); // 0 = domingo, 1 = lunes, etc.

    // Ajustar para que lunes sea 0
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

    // Agregar días vacíos al inicio
    for (let i = 0; i < adjustedStartDay; i++) {
      days.push(null);
    }

    // Generar días del mes
    for (let day = 1; day <= month.days; day++) {
      days.push(day);
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDayClick = (day: number) => {
    setSelectedDate({ day, month: currentMonthName, year: currentYear });
    setIsDialogOpen(true);
  };

  const handleTrainingClick = (training: Session) => {
    setSelectedTraining(training);
    setIsTrainingModalOpen(true);
  };

  const handleCloseTrainingModal = () => {
    setIsTrainingModalOpen(false);
    setSelectedTraining(null);
  };

  const handleEditTraining = (training: Session) => {
    // Aquí podrías navegar a la página de edición o abrir un modal de edición
    console.log('Editar entrenamiento:', training);
    // Por ahora solo cerramos el modal
    handleCloseTrainingModal();
  };

  const getSelectedDayData = () => {
    if (!selectedDate) return null;

    const dateKey = `${selectedDate.year}-${String(
      months.findIndex(m => m.name === selectedDate.month) + 1
    ).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
    return dailyTrainingData[dateKey as keyof typeof dailyTrainingData] || null;
  };

  const getSelectedDayCompetitions = () => {
    if (!selectedDate) return [];

    const dateKey = `${selectedDate.year}-${String(
      months.findIndex(m => m.name === selectedDate.month) + 1
    ).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
    return getCompetitionsByDate(dateKey);
  };

  const getSelectedDaySessions = () => {
    if (!selectedDate) return [];

    const dateKey = `${selectedDate.year}-${String(
      months.findIndex(m => m.name === selectedDate.month) + 1
    ).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
    
    return sessions.filter(session => session.date === dateKey);
  };

  const selectedDayData = getSelectedDayData();
  const selectedDaySessions = getSelectedDaySessions();
  const selectedDayCompetitions = getSelectedDayCompetitions();

  // SOLUCIÓN: Renderizar solo después de la hidratación
  if (!isHydrated) {
    return (
      <Card className="bg-muted/50 border-muted">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <h2 className="text-xl font-semibold capitalize text-gray-900 dark:text-white">
                Cargando...
              </h2>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-6">
          <div className="grid grid-cols-7 gap-1 mb-3">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
              <div
                key={day}
                className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }, (_, i) => (
              <div key={i} className="h-10 w-10 flex items-center justify-center text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-800" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className='bg-muted/50 border-muted col-span-3 h-full'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <CalendarIcon className='h-5 w-5' />
                Calendario
              </CardTitle>
              <CardDescription>Vista mensual de tus sesiones</CardDescription>
            </div>

            {/* Navegación del mes */}
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => navigateMonth('prev')}
                className='h-8 w-8 p-0'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>

              <div className='min-w-[120px] text-center'>
                <p className='text-sm font-medium capitalize'>
                  {currentMonthName} {currentYear}
                </p>
              </div>

              <Button
                variant='ghost'
                size='sm'
                onClick={() => navigateMonth('next')}
                className='h-8 w-8 p-0'
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className='flex flex-1 flex-col'>
          {/* Días de la semana */}
          <div className='mb-3 grid grid-cols-7 gap-2'>
            {weekDays.map(day => (
              <div
                key={day}
                className='text-muted-foreground flex h-10 items-center justify-center text-sm font-medium'
              >
                {day}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div className='grid flex-1 grid-cols-7 gap-2'>
            {generateCalendarDays().map((day, index) => {
              // Obtener el número de entrenamientos en este día
              const trainingCount =
                day !== null
                  ? (() => {
                      const dateKey = `${currentYear}-${String(
                        currentMonth + 1
                      ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      return dailyTrainingData[dateKey]
                        ? dailyTrainingData[dateKey].sessions.length
                        : 0;
                    })()
                  : 0;

              // Obtener competiciones en este día
              const competitionsOnDay =
                day !== null
                  ? (() => {
                      const dateKey = `${currentYear}-${String(
                        currentMonth + 1
                      ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      return getCompetitionsByDate(dateKey);
                    })()
                  : [];

              const isToday =
                day === new Date().getDate() &&
                currentMonth === new Date().getMonth() &&
                currentYear === new Date().getFullYear();

              return (
                <div
                  key={index}
                  onClick={() => day && handleDayClick(day)}
                  className={`relative flex h-12 w-full items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
                    day === null
                      ? 'invisible'
                      : isToday
                      ? 'bg-accent text-accent-foreground border-primary cursor-pointer border-2'
                      : 'text-foreground hover:bg-accent cursor-pointer'
                  }`}
                >
                  <div className='flex flex-col items-center'>
                    <span>{day}</span>
                    <div className='mt-1 flex gap-0.5'>
                      {/* Puntos de entrenamientos */}
                      {trainingCount > 0 && (
                        <>
                          {Array.from(
                            { length: Math.min(trainingCount, 3) },
                            (_, i) => (
                              <div
                                key={`training-${i}`}
                                className='h-1.5 w-1.5 rounded-full bg-blue-500'
                              ></div>
                            )
                          )}
                          {trainingCount > 3 && (
                            <div className='h-1.5 w-1.5 rounded-full bg-blue-300'></div>
                          )}
                        </>
                      )}

                      {/* Puntos de competiciones - Solo después de hidratación */}
                      {competitionsOnDay.length > 0 && isHydrated && (
                        <>
                          {competitionsOnDay.map(comp => (
                            <div
                              key={`comp-${comp.id}`}
                              className={`h-1.5 w-1.5 rounded-full ${
                                comp.priority === 'high'
                                  ? 'bg-red-500'
                                  : comp.priority === 'medium'
                                  ? 'bg-orange-500'
                                  : 'bg-green-500'
                              }`}
                              title={comp.name}
                            ></div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Leyenda del calendario */}
          <div className='border-border mt-4 border-t pt-4'>
            <div className='text-muted-foreground flex flex-col gap-3 text-xs'>
               {/* Entrenamientos - SIMPLIFICADO */}
               <div className='space-y-2'>
                 <h4 className='text-foreground mb-2 text-sm font-medium'>
                   Entrenamientos
                 </h4>
                 <div className='flex items-center gap-2'>
                   <div className='h-1.5 w-1.5 rounded-full bg-blue-500'></div>
                   <span>Día con entrenamiento</span>
                 </div>
               </div>

              {/* Competiciones */}
              <div className='space-y-2'>
                <h4 className='text-foreground mb-2 text-sm font-medium'>
                  Competiciones
                </h4>
                <div className='flex items-center gap-4'>
                  <div className='flex items-center gap-2'>
                    <div className='h-1.5 w-1.5 rounded-full bg-red-500'></div>
                    <span>Alta prioridad</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='h-1.5 w-1.5 rounded-full bg-orange-500'></div>
                    <span>Media prioridad</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='h-1.5 w-1.5 rounded-full bg-green-500'></div>
                    <span>Baja prioridad</span>
                  </div>
                </div>
              </div>

              {/* Día actual */}
              <div className='space-y-2'>
                <h4 className='text-foreground mb-2 text-sm font-medium'>
                  Indicadores
                </h4>
                <div className='flex items-center gap-2'>
                  <div className='bg-accent border-primary h-3 w-3 rounded-full border'></div>
                  <span>Hoy</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog con detalles del día */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {selectedDate
                ? `${selectedDate.day} de ${selectedDate.month} de ${selectedDate.year}`
                : 'Detalles del Día'}
            </DialogTitle>
            <DialogDescription>
              Información de entrenamientos para este día
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            {selectedDate &&
            (selectedDaySessions.length > 0 || selectedDayCompetitions.length > 0) ? (
              <>
                {/* Entrenamientos */}
                {selectedDaySessions.length > 0 && (
                  <>
                    <div className='bg-primary/10 flex items-center gap-3 rounded-lg p-3'>
                      <div className='bg-primary rounded-full p-2'>
                        <Activity className='text-primary-foreground h-4 w-4' />
                      </div>
                      <div>
                        <p className='text-foreground font-semibold'>
                          {selectedDaySessions.length} sesión
                          {selectedDaySessions.length !== 1 ? 'es' : ''}
                        </p>
                        <p className='text-muted-foreground text-sm'>
                          Entrenamientos programados
                        </p>
                      </div>
                    </div>

                    <div className='space-y-3'>
                      {selectedDaySessions.map((session) => (
                        <div
                          key={session.id}
                          onClick={() => handleTrainingClick(session)}
                          className='bg-muted/50 space-y-3 rounded-xl border p-4 cursor-pointer hover:bg-muted/70 transition-colors'
                        >
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              <Target className='text-muted-foreground h-4 w-4' />
                              <span className='text-foreground font-semibold'>
                                {session.mainSet}
                              </span>
                            </div>
                            <Badge variant='secondary'>{session.sessionType}</Badge>
                          </div>

                          <div className='grid grid-cols-2 gap-3'>
                            <div className='flex items-center gap-2 text-sm'>
                              <Target className='text-muted-foreground h-4 w-4' />
                              <span className='text-foreground'>
                                {session.distance}m
                              </span>
                            </div>
                            <div className='flex items-center gap-2 text-sm'>
                              <Target className='text-muted-foreground h-4 w-4' />
                              <span className='text-foreground'>
                                {session.stroke}
                              </span>
                            </div>
                          </div>

                          <div className='text-sm text-muted-foreground'>
                            <p className='truncate'>{session.mainSet}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Competiciones */}
                {selectedDayCompetitions.length > 0 && (
                  <>
                    <div className='flex items-center gap-3 rounded-lg bg-orange-100 p-3 dark:bg-orange-900/20'>
                      <div className='rounded-full bg-orange-500 p-2'>
                        <CalendarIcon className='h-4 w-4 text-white' />
                      </div>
                      <div>
                        <p className='text-foreground font-semibold'>
                          {selectedDayCompetitions.length} competición
                          {selectedDayCompetitions.length !== 1 ? 'es' : ''}
                        </p>
                        <p className='text-muted-foreground text-sm'>
                          Eventos programados
                        </p>
                      </div>
                    </div>

                    <div className='space-y-3'>
                      {selectedDayCompetitions.map((competition, index) => (
                        <div
                          key={index}
                          className='bg-muted/50 space-y-3 rounded-xl border p-4'
                        >
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              <CalendarIcon className='text-muted-foreground h-4 w-4' />
                              <span className='text-foreground font-semibold'>
                                {competition.name}
                              </span>
                            </div>
                            <Badge
                              variant='outline'
                              className={`${
                                competition.priority === 'high'
                                  ? 'bg-red-500 text-white'
                                  : competition.priority === 'medium'
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-green-500 text-white'
                              }`}
                            >
                              {competition.priority === 'high'
                                ? 'Alta'
                                : competition.priority === 'medium'
                                ? 'Media'
                                : 'Baja'}
                            </Badge>
                          </div>

                          <div className='space-y-2'>
                            <div className='flex items-center gap-2 text-sm'>
                              <Target className='text-muted-foreground h-4 w-4' />
                              <span className='text-foreground'>
                                {competition.location}
                              </span>
                            </div>
                            <div className='flex items-center gap-2 text-sm'>
                              <Clock className='text-muted-foreground h-4 w-4' />
                              <span className='text-foreground'>
                                {competition.type}
                              </span>
                            </div>
                          </div>

                          <div className='space-y-1'>
                            <p className='text-muted-foreground text-xs font-medium'>
                              Eventos:
                            </p>
                            <div className='flex flex-wrap gap-1'>
                              {competition.events.map((event, eventIndex) => (
                                <Badge
                                  key={eventIndex}
                                  variant='secondary'
                                  className='text-xs'
                                >
                                  {event}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <p className='text-muted-foreground text-sm'>
                            {competition.objectives}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : selectedDate ? (
              <div className='py-8 text-center'>
                <div className='bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full p-4'>
                  <CalendarIcon className='text-muted-foreground h-8 w-8' />
                </div>
                <p className='text-foreground font-medium'>
                  No hay actividades registradas
                </p>
                <p className='text-muted-foreground mt-1 text-sm'>
                  para este día
                </p>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de detalles del entrenamiento */}
      <TrainingDetailModal
        isOpen={isTrainingModalOpen}
        onClose={handleCloseTrainingModal}
        training={selectedTraining}
        onEdit={handleEditTraining}
      />
    </>
  );
}
