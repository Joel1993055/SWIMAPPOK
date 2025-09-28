'use client';

import { TrainingDetailModal } from '@/components/features/calendar/training-detail-modal';
import { TrainingPhases } from '@/components/features/calendar/training-phases';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useCompetitionsStore } from '@/core/stores/unified';
import { getSessions, type Session } from '@/infra/config/actions/sessions';
import {
    Activity,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
    Target,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CalendarPage() {
  // FIX: Hydration state to avoid SSR errors
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
  const [isCompetitionModalOpen, setIsCompetitionModalOpen] = useState(false);

  // KEEP: Existing context
  const { getCompetitionsByDate } = useCompetitionsStore();

  // OPTIMIZED: Only use what's needed from the store
  const { competitions: storeCompetitions } = useCompetitionsStore();

  // FIX: Effect to handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load real sessions
  useEffect(() => {
    const loadSessions = async () => {
      try {
        setIsLoading(true);
        const data = await getSessions();
        setSessions(data);
      } catch (error) {
        console.error('Error loading sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isHydrated) {
      loadSessions();
    }
  }, [isHydrated]);

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

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']; // Monday-first layout

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentMonthName = months[currentMonth].name;

  // Convert real sessions to calendar-ready format
  const dailyTrainingData = sessions.reduce(
    (acc, session) => {
      const dateKey = session.date;
      if (!acc[dateKey]) {
        acc[dateKey] = { sessions: [] };
      }

      acc[dateKey].sessions.push({
        time: '09:00', // We could add a time field to sessions
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
    const days = [];

    // Get the first day of the month and what weekday it is
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Shift so Monday is 0
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

    // Add empty leading slots
    for (let i = 0; i < adjustedStartDay; i++) {
      days.push(null);
    }

    // Add month days
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
    // Here you could navigate to an edit page or open an edit modal
    console.log('Edit training:', training);
    // For now just close the modal
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

  // FIX: Render only after hydration
  if (!isHydrated) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading calendar...</p>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Calendar & Planning</h1>
            </div>
            <p className="text-muted-foreground">
              Monthly view of your training sessions and training phases planning
            </p>
          </div>

          {/* Main layout: Calendar and panel 50/50 */}
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* Calendar - 50% width */}
            <div className="w-full lg:w-1/2">
              <Card className="bg-muted/50 border-muted">
                <CardHeader className="pb-4">
                  {/* Header with integrated navigation */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                      className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="text-center">
                      <h2 className="text-xl font-semibold capitalize text-gray-900 dark:text-white">
                        {currentMonthName} {currentYear}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {
                          sessions.filter(session => {
                            const sessionDate = new Date(session.date);
                            return (
                              sessionDate.getMonth() === currentMonth &&
                              sessionDate.getFullYear() === currentYear
                            );
                          }).length
                        }{' '}
                        training sessions
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                      className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Year navigation - subtle */}
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateYear('prev')}
                      className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {currentYear - 1}
                    </Button>

                    <div className="w-8 h-px bg-gray-200 dark:bg-gray-700"></div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateYear('next')}
                      className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {currentYear + 1}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 pb-6">
                  {/* Weekday headers - aligned with numbers */}
                  <div className="grid grid-cols-7 gap-1 mb-3">
                    {weekDays.map(day => (
                      <div
                        key={day}
                        className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Month days */}
                  <div className="grid grid-cols-7 gap-1">
                    {generateCalendarDays().map((day, index) => {
                      // Check if there are real training sessions for this day
                      const dateKey = `${currentYear}-${String(
                        currentMonth + 1
                      ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const hasTraining =
                        day !== null &&
                        dailyTrainingData[dateKey]?.sessions.length > 0;

                      // Check if there are competitions for this day
                      const competitionsOnDay =
                        day !== null ? getCompetitionsByDate(dateKey) : [];

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
                              {hasTraining && (
                                <>
                                  {Array.from(
                                    {
                                      length: Math.min(
                                        dailyTrainingData[dateKey]?.sessions
                                          .length || 0,
                                        3
                                      ),
                                    },
                                    (_, i) => (
                                      <div
                                        key={`training-${i}`}
                                        className="h-1.5 w-1.5 rounded-full bg-blue-500"
                                      ></div>
                                    )
                                  )}
                                  {(dailyTrainingData[dateKey]?.sessions.length ||
                                    0) > 3 && (
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-300"></div>
                                  )}
                                </>
                              )}

                              {/* Competition dots - only after hydration */}
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
                
                {/* Legend inside calendar card */}
                <div className="px-6 pb-6">
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Legend</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-lg"></div>
                        <span className="text-gray-600 dark:text-gray-400">Training Session</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-400">High Priority Competition</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 border-2 border-blue-500 rounded-lg"></div>
                        <span className="text-gray-600 dark:text-gray-400">Today</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-400">Medium Priority Competition</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-400">Low Priority Competition</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Info panel - 50% width */}
            <div className="w-full lg:w-1/2">
              <Card className="bg-muted/50 border-muted h-full flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    Day Details
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {selectedDate
                      ? `${selectedDate.day} of ${selectedDate.month} ${selectedDate.year}`
                      : 'Select a day to view details'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {selectedDate ? (
                    <div className="space-y-4">
                      {/* Competitions - Always show if they exist */}
                      {selectedDayCompetitions.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            Competitions ({selectedDayCompetitions.length})
                          </h4>
                          {selectedDayCompetitions.map((comp, index) => (
                            <div
                              key={index}
                              className="border border-red-200 dark:border-red-800 rounded-lg p-3 bg-red-50 dark:bg-red-900/20"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-1">
                                  <div
                                    className={`h-2 w-2 rounded-full flex-shrink-0 ${
                                      comp.priority === 'high'
                                        ? 'bg-red-500'
                                        : comp.priority === 'medium'
                                        ? 'bg-orange-500'
                                        : 'bg-green-500'
                                    }`}
                                  ></div>
                                  <div className="flex-1 min-w-0">
                                    <span className="font-medium text-gray-900 dark:text-white block truncate">
                                      {comp.name}
                                    </span>
                                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-1">
                                      {comp.location && (
                                        <span className="flex items-center gap-1">
                                          <Target className="h-3 w-3" />
                                          {comp.location}
                                        </span>
                                      )}
                                      {comp.type && (
                                        <span className="capitalize">
                                          {comp.type}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <Badge
                                  variant="secondary"
                                  className={`text-xs flex-shrink-0 ${
                                    comp.priority === 'high'
                                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                      : comp.priority === 'medium'
                                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                                      : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                  }`}
                                >
                                  {comp.priority === 'high'
                                    ? 'High'
                                    : comp.priority === 'medium'
                                    ? 'Medium'
                                    : 'Low'}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Training - Show if exists */}
                      {selectedDaySessions.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Training ({selectedDaySessions.length})
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
                                    <span className="font-medium text-gray-900 dark:text-white block">
                                      {session.distance}m
                                    </span>
                                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-1">
                                      {session.stroke && (
                                        <span>{session.stroke}</span>
                                      )}
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

                      {/* Empty state */}
                      {selectedDaySessions.length === 0 &&
                        selectedDayCompetitions.length === 0 && (
                          <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                              <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-foreground font-medium">
                              No activities recorded
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              for this day
                            </p>
                          </div>
                        )}

                      {/* Action Buttons - Always show when a day is selected */}
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          onClick={() => {
                            // TODO: Implement add training logic
                            console.log('Add training clicked');
                          }}
                          className="flex-1 gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                          Add Training
                        </Button>
                        <Button
                          onClick={() => setIsCompetitionModalOpen(true)}
                          className="flex-1 gap-2 bg-white text-gray-900 hover:bg-gray-50 border border-gray-200"
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                          Add Competition
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <CalendarIcon className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-foreground font-medium">Select a day</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        to view training details
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Training Phases Section */}
          <Card className="bg-muted/50 border-muted">
            <CardContent className="p-6">
              <TrainingPhases />
            </CardContent>
          </Card>
        </div>

        {/* Training details modal */}
        <TrainingDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          training={selectedTraining}
          onEdit={handleEditTraining}
        />

        {/* Competition Modal */}
        <Dialog open={isCompetitionModalOpen} onOpenChange={setIsCompetitionModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Competition</DialogTitle>
              <DialogDescription>
                Add a new competition for {selectedDate ? `${selectedDate.day} of ${selectedDate.month} ${selectedDate.year}` : 'selected day'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="comp-name">Competition Name</Label>
                <Input
                  id="comp-name"
                  placeholder="e.g., National Championships"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comp-location">Location</Label>
                <Input
                  id="comp-location"
                  placeholder="e.g., Madrid, Spain"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comp-type">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select competition type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="regional">Regional</SelectItem>
                    <SelectItem value="national">National</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsCompetitionModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // TODO: Implement save competition logic
                console.log('Save competition');
                setIsCompetitionModalOpen(false);
              }}>
                Add Competition
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
