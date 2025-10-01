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
import { useCompetitionsStore } from '@/core/stores/unified';
import { useFilteredSessions } from '@/core/hooks/use-filtered-sessions';
import {
    Activity,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Target,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

export function DashboardCalendar() {
  // Hydration state to avoid SSR issues
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

  // Use filtered sessions
  const { sessions: filteredSessions, hasContext, contextInfo } = useFilteredSessions();

  // Existing context
  const { getCompetitionsByDate } = useCompetitionsStore();

  // Only what we need from the store
  const { competitions: storeCompetitions } = useCompetitionsStore();

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Sync context data to store (placeholder – parent handles actual sync)
  React.useEffect(() => {
    if (storeCompetitions.length === 0) {
      // No-op for now
    }
  }, [storeCompetitions]);

  const months = [
    { name: 'january', short: 'jan', days: 31 },
    { name: 'february', short: 'feb', days: 28 },
    { name: 'march', short: 'mar', days: 31 },
    { name: 'april', short: 'apr', days: 30 },
    { name: 'may', short: 'may', days: 31 },
    { name: 'june', short: 'jun', days: 30 },
    { name: 'july', short: 'jul', days: 31 },
    { name: 'august', short: 'aug', days: 31 },
    { name: 'september', short: 'sep', days: 30 },
    { name: 'october', short: 'oct', days: 31 },
    { name: 'november', short: 'nov', days: 30 },
    { name: 'december', short: 'dec', days: 31 },
  ];

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Load sessions from filtered hook
  useEffect(() => {
    setSessions(filteredSessions);
  }, [filteredSessions]);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentMonthName = months[currentMonth].name;

  // Show message if no context is selected
  if (!hasContext) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Training Calendar</CardTitle>
          <CardDescription>
            Please select a club and group to view your training schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No club/group selected</p>
              <p className="text-xs mt-1">Select from the sidebar to view your calendar</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Convert sessions to calendar daily map
  const dailyTrainingData = sessions.reduce(
    (acc, session) => {
      const dateKey = session.date;
      if (!acc[dateKey]) {
        acc[dateKey] = { sessions: [] };
      }

      acc[dateKey].sessions.push({
        time: '09:00', // Could add time to sessions later
        type: session.type,
        distance: session.distance || 0,
        duration: session.duration || 0,
        stroke: session.stroke || 'Freestyle',
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
    const days: Array<number | null> = [];

    // First day of month and weekday (0=Sunday, 1=Monday, ...)
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDay = firstDay.getDay();

    // Make Monday index 0
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

    // Leading empty days
    for (let i = 0; i < adjustedStartDay; i++) {
      days.push(null);
    }

    // Actual month days
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
    // Could navigate to edit page or open edit modal
    console.log('Edit training:', training);
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

  // Render skeleton until hydrated
  if (!isHydrated) {
    return (
      <Card className="bg-muted/50 border-muted">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <h2 className="text-xl font-semibold capitalize text-gray-900 dark:text-white">
                Loading...
              </h2>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-6">
          <div className="grid grid-cols-7 gap-1 mb-3">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <div
                key={`day-${index}`}
                className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }, (_, i) => (
              <div
                key={i}
                className="h-10 w-10 flex items-center justify-center text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-800"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-muted/50 border-muted col-span-3 h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendar
              </CardTitle>
              <CardDescription>Monthly view of your sessions</CardDescription>
            </div>

            {/* Month navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="min-w-[120px] text-center">
                <p className="text-sm font-medium capitalize">
                  {currentMonthName} {currentYear}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          {/* Weekdays */}
          <div className="mb-3 grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => (
              <div
                key={`weekday-${index}`}
                className="text-muted-foreground flex h-10 items-center justify-center text-sm font-medium"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Month days */}
          <div className="grid flex-1 grid-cols-7 gap-2">
            {generateCalendarDays().map((day, index) => {
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
                  <div className="flex flex-col items-center">
                    <span>{day}</span>
                    <div className="mt-1 flex gap-0.5">
                      {/* Training dots */}
                      {trainingCount > 0 && (
                        <>
                          {Array.from(
                            { length: Math.min(trainingCount, 3) },
                            (_, i) => (
                              <div
                                key={`training-${i}`}
                                className="h-1.5 w-1.5 rounded-full bg-blue-500"
                              ></div>
                            )
                          )}
                          {trainingCount > 3 && (
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-300"></div>
                          )}
                        </>
                      )}

                      {/* Competition dots */}
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

          {/* Calendar legend */}
          <div className="border-border mt-4 border-t pt-4">
            <div className="text-muted-foreground flex flex-col gap-3 text-xs">
              {/* Training - simplified */}
              <div className="space-y-2">
                <h4 className="text-foreground mb-2 text-sm font-medium">
                  Training Sessions
                </h4>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  <span>Day with training</span>
                </div>
              </div>

              {/* Competitions */}
              <div className="space-y-2">
                <h4 className="text-foreground mb-2 text-sm font-medium">
                  Competitions
                </h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                    <span>High priority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
                    <span>Medium priority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    <span>Low priority</span>
                  </div>
                </div>
              </div>

              {/* Indicators */}
              <div className="space-y-2">
                <h4 className="text-foreground mb-2 text-sm font-medium">
                  Indicators
                </h4>
                <div className="flex items-center gap-2">
                  <div className="bg-accent border-primary h-3 w-3 rounded-full border"></div>
                  <span>Today</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDate
                ? `${selectedDate.month} ${selectedDate.day}, ${selectedDate.year}`
                : 'Day Details'}
            </DialogTitle>
            <DialogDescription>
              Training information for this day
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedDate &&
            (selectedDaySessions.length > 0 ||
              selectedDayCompetitions.length > 0) ? (
              <>
                {/* Training Sessions */}
                {selectedDaySessions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Training Sessions ({selectedDaySessions.length})
                    </h4>
                    {selectedDaySessions.map(session => (
                      <div
                        key={session.id}
                        onClick={() => handleTrainingClick(session)}
                        className="border border-blue-200 dark:border-blue-800 rounded-lg p-3 bg-blue-50 dark:bg-blue-900/20 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-foreground block">
                                {session.distance}m
                              </span>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                {session.mainSet && (
                                  <span className="truncate">
                                    {session.mainSet}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs flex-shrink-0"
                          >
                            {session.sessionType}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Competitions */}
                {selectedDayCompetitions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Competitions ({selectedDayCompetitions.length})
                    </h4>
                    {selectedDayCompetitions.map((competition, index) => (
                      <div
                        key={index}
                        className="border border-red-200 dark:border-red-800 rounded-lg p-3 bg-red-50 dark:bg-red-900/20"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <div
                              className={`h-2 w-2 rounded-full flex-shrink-0 ${
                                competition.priority === 'high'
                                  ? 'bg-red-500'
                                  : competition.priority === 'medium'
                                  ? 'bg-orange-500'
                                  : 'bg-green-500'
                              }`}
                            ></div>
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-foreground block truncate">
                                {competition.name}
                              </span>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                {competition.location && (
                                  <span className="flex items-center gap-1">
                                    <Target className="h-3 w-3" />
                                    {competition.location}
                                  </span>
                                )}
                                {competition.type && (
                                  <span className="capitalize">
                                    {competition.type}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className={`text-xs flex-shrink-0 ${
                              competition.priority === 'high'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                : competition.priority === 'medium'
                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                                : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            }`}
                          >
                            {competition.priority === 'high'
                              ? 'High'
                              : competition.priority === 'medium'
                              ? 'Medium'
                              : 'Low'}
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <p className="text-muted-foreground text-xs font-medium">
                            Events:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {competition.events.map((event, eventIndex) => (
                              <Badge
                                key={eventIndex}
                                variant="secondary"
                                className="text-xs"
                              >
                                {event}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <p className="text-muted-foreground text-sm">
                          {competition.objectives}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : selectedDate ? (
              <div className="py-8 text-center">
                <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full p-4">
                  <CalendarIcon className="text-muted-foreground h-8 w-8" />
                </div>
                <p className="text-foreground font-medium">
                  No activities recorded
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  for this day
                </p>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {/* Training details modal */}
      <TrainingDetailModal
        isOpen={isTrainingModalOpen}
        onClose={handleCloseTrainingModal}
        training={selectedTraining}
        onEdit={handleEditTraining}
      />
    </>
  );
}
