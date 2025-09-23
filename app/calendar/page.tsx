'use client';

import { TrainingDetailModal } from '@/components/features/calendar/training-detail-modal';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SiteHeader } from '@/components/layout/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getSessions, type Session } from '@/lib/actions/sessions';
import { useCompetitionsStore } from '@/lib/store/unified';
import {
    Activity,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Target
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CalendarioPage() {
  // SOLUCIÓN: Estado de hidratación para evitar errores SSR
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<{
    day: number;
    month: string;
    year: number;
  } | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTraining, setSelectedTraining] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // MANTENER: Context existente
  const { getCompetitionsByDate } = useCompetitionsStore();

  // OPTIMIZADO: Solo usar lo necesario del store
  const { competitions: storeCompetitions } = useCompetitionsStore();

  // SOLUCIÓN: Efecto para manejar la hidratación
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Cargar sesiones reales
  useEffect(() => {
    const loadSessions = async () => {
      try {
        setIsLoading(true);
        const data = await getSessions();
        setSessions(data);
      } catch (error) {
        console.error('Error cargando sesiones:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isHydrated) {
      loadSessions();
    }
  }, [isHydrated]);

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

  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setFullYear(prev.getFullYear() - 1);
      } else {
        newDate.setFullYear(prev.getFullYear() + 1);
      }
      return newDate;
    });
  };

  const handleDayClick = (day: number) => {
    setSelectedDate({ day, month: currentMonthName, year: currentYear });
  };

  const handleTrainingClick = (training: Session) => {
    setSelectedTraining(training);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTraining(null);
  };

  const handleEditTraining = (training: Session) => {
    // Aquí podrías navegar a la página de edición o abrir un modal de edición
    console.log('Editar entrenamiento:', training);
    // Por ahora solo cerramos el modal
    handleCloseModal();
  };

  const getSelectedDayData = () => {
    if (!selectedDate) return null;

    const dateKey = `${selectedDate.year}-${String(
      months.findIndex(m => m.name === selectedDate.month) + 1
    ).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
    return dailyTrainingData[dateKey as keyof typeof dailyTrainingData] || null;
  };

  const getSelectedDaySessions = () => {
    if (!selectedDate) return [];

    const dateKey = `${selectedDate.year}-${String(
      months.findIndex(m => m.name === selectedDate.month) + 1
    ).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
    
    return sessions.filter(session => session.date === dateKey);
  };

  const getSelectedDayCompetitions = () => {
    if (!selectedDate) return [];

    const dateKey = `${selectedDate.year}-${String(
      months.findIndex(m => m.name === selectedDate.month) + 1
    ).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
    return getCompetitionsByDate(dateKey);
  };

  const selectedDayData = getSelectedDayData();
  const selectedDaySessions = getSelectedDaySessions();
  const selectedDayCompetitions = getSelectedDayCompetitions();

  // SOLUCIÓN: Renderizar solo después de la hidratación
  if (!isHydrated) {
    return (
      <SidebarProvider>
        <AppSidebar variant='inset' />
        <SidebarInset>
          <SiteHeader />
          <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
            <div className='flex items-center justify-center min-h-[400px]'>
              <div className='text-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
                <p className='text-muted-foreground'>Cargando calendario...</p>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
          {/* Header */}
          <div className='mb-8'>
            <div className='flex items-center gap-3 mb-2'>
              <div className='p-2 bg-primary/10 rounded-lg'>
                <CalendarIcon className='h-6 w-6 text-primary' />
              </div>
              <h1 className='text-3xl font-bold text-foreground'>Calendario</h1>
            </div>
            <p className='text-muted-foreground'>
              Vista mensual de tus entrenamientos
            </p>
          </div>

          {/* Layout principal: Calendario y panel 50/50 */}
          <div className='flex flex-col lg:flex-row gap-6 w-full'>
            {/* Calendario - 50% del ancho */}
            <div className='w-full lg:w-1/2'>
              <Card className='bg-muted/50 border-muted'>
                <CardHeader className='pb-4'>
                  {/* Header con navegación integrada */}
                  <div className='flex items-center justify-between'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => navigateMonth('prev')}
                      className='h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full'
                    >
                      <ChevronLeft className='h-4 w-4' />
                    </Button>

                    <div className='text-center'>
                      <h2 className='text-xl font-semibold capitalize text-gray-900 dark:text-white'>
                        {currentMonthName} {currentYear}
                      </h2>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        {sessions.filter(session => {
                          const sessionDate = new Date(session.date);
                          return sessionDate.getMonth() === currentMonth && 
                                 sessionDate.getFullYear() === currentYear;
                        }).length}{' '}
                        entrenamientos
                      </p>
                    </div>

                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => navigateMonth('next')}
                      className='h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full'
                    >
                      <ChevronRight className='h-4 w-4' />
                    </Button>
                  </div>

                  {/* Navegación de año - más sutil */}
                  <div className='flex items-center justify-center gap-1 mt-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => navigateYear('prev')}
                      className='h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    >
                      {currentYear - 1}
                    </Button>

                    <div className='w-8 h-px bg-gray-200 dark:bg-gray-700'></div>

                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => navigateYear('next')}
                      className='h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    >
                      {currentYear + 1}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className='pt-0 pb-6'>
                  {/* Días de la semana - alineados con los números */}
                  <div className='grid grid-cols-7 gap-1 mb-3'>
                    {weekDays.map(day => (
                      <div
                        key={day}
                        className='h-10 flex items-center justify-center text-sm font-medium text-muted-foreground'
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Días del mes - mejor diseño */}
                  <div className='grid grid-cols-7 gap-1'>
                    {generateCalendarDays().map((day, index) => {
                      // Verificar si hay entrenamientos reales para este día
                      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const hasTraining = day !== null && dailyTrainingData[dateKey]?.sessions.length > 0;
                      
                      // Verificar si hay competiciones para este día
                      const competitionsOnDay = day !== null ? getCompetitionsByDate(dateKey) : [];
                      
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
                              {hasTraining && (
                                <>
                                  {Array.from(
                                    { length: Math.min(dailyTrainingData[dateKey]?.sessions.length || 0, 3) },
                                    (_, i) => (
                                      <div
                                        key={`training-${i}`}
                                        className='h-1.5 w-1.5 rounded-full bg-blue-500'
                                      ></div>
                                    )
                                  )}
                                  {(dailyTrainingData[dateKey]?.sessions.length || 0) > 3 && (
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
                </CardContent>
              </Card>
            </div>

            {/* Panel de información - 50% del ancho */}
            <div className='w-full lg:w-1/2'>
              <Card className='bg-muted/50 border-muted h-full flex flex-col'>
                <CardHeader className='pb-4'>
                  <CardTitle className='text-lg font-semibold text-gray-900 dark:text-white'>
                    Detalles del Día
                  </CardTitle>
                  <CardDescription className='text-gray-600 dark:text-gray-400'>
                    {selectedDate
                      ? `${selectedDate.day} de ${selectedDate.month} de ${selectedDate.year}`
                      : 'Selecciona un día para ver los detalles'}
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex-1 flex flex-col'>
                  {selectedDate ? (
                    <div className='space-y-4'>
                      {/* Competiciones - Mostrar siempre si existen */}
                      {selectedDayCompetitions.length > 0 && (
                        <div className='space-y-3'>
                          <h4 className='font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
                            <CalendarIcon className='h-4 w-4' />
                            Competiciones ({selectedDayCompetitions.length})
                          </h4>
                          {selectedDayCompetitions.map((comp, index) => (
                            <div
                              key={index}
                              className='border border-red-200 dark:border-red-800 rounded-lg p-3 bg-red-50 dark:bg-red-900/20'
                            >
                              <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2 flex-1'>
                                  <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                                    comp.priority === 'high'
                                      ? 'bg-red-500'
                                      : comp.priority === 'medium'
                                      ? 'bg-orange-500'
                                      : 'bg-green-500'
                                  }`}></div>
                                  <div className='flex-1 min-w-0'>
                                    <span className='font-medium text-gray-900 dark:text-white block truncate'>
                                      {comp.name}
                                    </span>
                                    <div className='flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-1'>
                                      {comp.location && (
                                        <span className='flex items-center gap-1'>
                                          <Target className='h-3 w-3' />
                                          {comp.location}
                                        </span>
                                      )}
                                      {comp.type && (
                                        <span className='capitalize'>
                                          {comp.type}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <Badge
                                  variant='secondary'
                                  className={`text-xs flex-shrink-0 ${
                                    comp.priority === 'high'
                                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                      : comp.priority === 'medium'
                                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                                      : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                  }`}
                                >
                                  {comp.priority === 'high' ? 'Alta' : comp.priority === 'medium' ? 'Media' : 'Baja'}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Entrenamientos - Mostrar si existen */}
                      {selectedDaySessions.length > 0 && (
                        <div className='space-y-3'>
                          <h4 className='font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
                            <Activity className='h-4 w-4' />
                            Entrenamientos ({selectedDaySessions.length})
                          </h4>
                          {selectedDaySessions.map((session) => (
                            <div
                              key={session.id}
                              onClick={() => handleTrainingClick(session)}
                              className='border border-blue-200 dark:border-blue-800 rounded-lg p-3 bg-blue-50 dark:bg-blue-900/20 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors'
                            >
                              <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2 flex-1'>
                                  <div className='h-2 w-2 rounded-full bg-blue-500 flex-shrink-0'></div>
                                  <div className='flex-1 min-w-0'>
                                    <span className='font-medium text-gray-900 dark:text-white block'>
                                      {session.distance}m
                                    </span>
                                    <div className='flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-1'>
                                      {session.stroke && (
                                        <span>{session.stroke}</span>
                                      )}
                                      {session.mainSet && (
                                        <span className='truncate'>{session.mainSet}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <Badge
                                  variant='secondary'
                                  className='bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs flex-shrink-0'
                                >
                                  {session.sessionType}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Mensaje cuando no hay nada */}
                      {selectedDaySessions.length === 0 && selectedDayCompetitions.length === 0 && (
                        <div className='flex-1 flex flex-col items-center justify-center text-center'>
                          <div className='p-4 bg-muted rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center'>
                            <CalendarIcon className='h-8 w-8 text-muted-foreground' />
                          </div>
                          <p className='text-foreground font-medium'>
                            No hay actividades registradas
                          </p>
                          <p className='text-sm text-muted-foreground mt-1'>
                            para este día
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className='flex-1 flex flex-col items-center justify-center text-center'>
                      <div className='p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center'>
                        <CalendarIcon className='h-8 w-8 text-primary' />
                      </div>
                      <p className='text-foreground font-medium'>
                        Selecciona un día
                      </p>
                      <p className='text-sm text-muted-foreground mt-1'>
                        para ver los detalles de entrenamiento
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Leyenda actualizada */}
          <div className='flex flex-wrap items-center justify-center gap-6 text-sm'>
            <div className='flex items-center gap-3'>
              <div className='w-4 h-4 bg-blue-500 rounded-lg shadow-sm'></div>
              <span className='text-gray-600 dark:text-gray-400 font-medium'>
                Entrenamiento
              </span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-4 h-4 bg-red-500 rounded-full'></div>
              <span className='text-gray-600 dark:text-gray-400 font-medium'>
                Competición Alta
              </span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-4 h-4 bg-orange-500 rounded-full'></div>
              <span className='text-gray-600 dark:text-gray-400 font-medium'>
                Competición Media
              </span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-4 h-4 bg-green-500 rounded-full'></div>
              <span className='text-gray-600 dark:text-gray-400 font-medium'>
                Competición Baja
              </span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-4 h-4 bg-gray-100 dark:bg-gray-800 border-2 border-blue-500 rounded-lg'></div>
              <span className='text-gray-600 dark:text-gray-400 font-medium'>
                Hoy
              </span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'></div>
              <span className='text-gray-600 dark:text-gray-400 font-medium'>
                Día normal
              </span>
            </div>
          </div>
        </div>

        {/* Modal de detalles del entrenamiento */}
        <TrainingDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          training={selectedTraining}
          onEdit={handleEditTraining}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
