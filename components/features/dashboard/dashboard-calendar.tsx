"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Session } from "@/lib/actions/sessions";
import { getSessions } from "@/lib/actions/sessions";
import { useCompetitions } from "@/lib/contexts/competitions-context";
import {
    Activity,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    Target,
} from "lucide-react";
import React, { useEffect, useState } from "react";
// NUEVO: Importar el store unificado
import { useCompetitionsStore } from "@/lib/store/unified";

export function DashboardCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<{
    day: number;
    month: string;
    year: number;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  
  // MANTENER: Context existente
  const { getCompetitionsByDate } = useCompetitions();
  
  // OPTIMIZADO: Solo usar lo necesario del store
  const { competitions: storeCompetitions } = useCompetitionsStore();

  // NUEVO: Sincronizar datos del context al store
  React.useEffect(() => {
    if (storeCompetitions.length === 0) {
      // Si el store está vacío, no hacer nada por ahora
      // La sincronización se maneja en el componente padre
    }
  }, [storeCompetitions]);

  const months = [
    { name: "enero", short: "ene", days: 31 },
    { name: "febrero", short: "feb", days: 28 },
    { name: "marzo", short: "mar", days: 31 },
    { name: "abril", short: "abr", days: 30 },
    { name: "mayo", short: "may", days: 31 },
    { name: "junio", short: "jun", days: 30 },
    { name: "julio", short: "jul", days: 31 },
    { name: "agosto", short: "ago", days: 31 },
    { name: "septiembre", short: "sep", days: 30 },
    { name: "octubre", short: "oct", days: 31 },
    { name: "noviembre", short: "nov", days: 30 },
    { name: "diciembre", short: "dic", days: 31 },
  ];

  const weekDays = ["L", "M", "X", "J", "V", "S", "D"];

  // Cargar sesiones reales desde Supabase
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await getSessions();
        setSessions(data);
      } catch (error) {
        console.error("Error cargando sesiones:", error);
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
        time: "09:00", // Podríamos agregar un campo de hora a las sesiones
        type: session.type,
        distance: session.distance || 0,
        duration: session.duration || 0,
        stroke: session.stroke || "Libre",
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

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === "prev") {
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

  const getSelectedDayData = () => {
    if (!selectedDate) return null;

    const dateKey = `${selectedDate.year}-${String(months.findIndex(m => m.name === selectedDate.month) + 1).padStart(2, "0")}-${String(selectedDate.day).padStart(2, "0")}`;
    return dailyTrainingData[dateKey as keyof typeof dailyTrainingData] || null;
  };

  const getSelectedDayCompetitions = () => {
    if (!selectedDate) return [];

    const dateKey = `${selectedDate.year}-${String(months.findIndex(m => m.name === selectedDate.month) + 1).padStart(2, "0")}-${String(selectedDate.day).padStart(2, "0")}`;
    return getCompetitionsByDate(dateKey);
  };

  const selectedDayData = getSelectedDayData();
  const selectedDayCompetitions = getSelectedDayCompetitions();

  return (
    <>
      <Card className="col-span-3 bg-muted/50 border-muted h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendario
              </CardTitle>
              <CardDescription>Vista mensual de tus sesiones</CardDescription>
            </div>

            {/* Navegación del mes */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth("prev")}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-center min-w-[120px]">
                <p className="text-sm font-medium capitalize">
                  {currentMonthName} {currentYear}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth("next")}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {weekDays.map(day => (
              <div
                key={day}
                className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="grid grid-cols-7 gap-2 flex-1">
            {generateCalendarDays().map((day, index) => {
              // Obtener el número de entrenamientos en este día
              const trainingCount =
                day !== null
                  ? (() => {
                      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      return dailyTrainingData[dateKey]
                        ? dailyTrainingData[dateKey].sessions.length
                        : 0;
                    })()
                  : 0;

              // Obtener competiciones en este día
              const competitionsOnDay =
                day !== null
                  ? (() => {
                      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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
                  className={`h-12 w-full flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 relative ${
                    day === null
                      ? "invisible"
                      : isToday
                        ? "bg-accent text-accent-foreground border-2 border-primary cursor-pointer"
                        : "text-foreground hover:bg-accent cursor-pointer"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span>{day}</span>
                    <div className="flex gap-0.5 mt-1">
                      {/* Puntos de entrenamientos */}
                      {trainingCount > 0 && (
                        <>
                          {Array.from(
                            { length: Math.min(trainingCount, 3) },
                            (_, i) => (
                              <div
                                key={`training-${i}`}
                                className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                              ></div>
                            )
                          )}
                          {trainingCount > 3 && (
                            <div className="w-1.5 h-1.5 bg-blue-300 rounded-full"></div>
                          )}
                        </>
                      )}

                      {/* Puntos de competiciones */}
                      {competitionsOnDay.length > 0 && (
                        <>
                          {competitionsOnDay.map((comp) => (
                            <div
                              key={`comp-${comp.id}`}
                              className={`w-1.5 h-1.5 rounded-full ${
                                comp.priority === "high"
                                  ? "bg-red-500"
                                  : comp.priority === "medium"
                                    ? "bg-orange-500"
                                    : "bg-green-500"
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
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex flex-col gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  </div>
                  <span>2 entrenamientos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent border border-primary rounded-full"></div>
                  <span>Hoy</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-blue-300 rounded-full"></div>
                  </div>
                  <span>4+ entrenamientos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <span>Competición alta prioridad</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span>Competición media prioridad</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Competición baja prioridad</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog con detalles del día */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDate
                ? `${selectedDate.day} de ${selectedDate.month} de ${selectedDate.year}`
                : "Detalles del Día"}
            </DialogTitle>
            <DialogDescription>
              Información de entrenamientos para este día
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedDate &&
            (selectedDayData || selectedDayCompetitions.length > 0) ? (
              <>
                {/* Entrenamientos */}
                {selectedDayData && selectedDayData.sessions.length > 0 && (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                      <div className="p-2 bg-primary rounded-full">
                        <Activity className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {selectedDayData.sessions.length} sesión
                          {selectedDayData.sessions.length !== 1 ? "es" : ""}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Entrenamientos programados
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedDayData.sessions.map((session, index) => (
                        <div
                          key={index}
                          className="border rounded-xl p-4 space-y-3 bg-muted/50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold text-foreground">
                                {session.time}
                              </span>
                            </div>
                            <Badge variant="secondary">{session.type}</Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Target className="h-4 w-4 text-muted-foreground" />
                              <span className="text-foreground">
                                {session.distance}m
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-foreground">
                                {session.duration}min
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-medium">
                              {session.stroke}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              RPE {session.rpe}/10
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Competiciones */}
                {selectedDayCompetitions.length > 0 && (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                      <div className="p-2 bg-orange-500 rounded-full">
                        <CalendarIcon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {selectedDayCompetitions.length} competición
                          {selectedDayCompetitions.length !== 1 ? "es" : ""}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Eventos programados
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedDayCompetitions.map((competition, index) => (
                        <div
                          key={index}
                          className="border rounded-xl p-4 space-y-3 bg-muted/50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold text-foreground">
                                {competition.name}
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className={`${
                                competition.priority === "high"
                                  ? "bg-red-500 text-white"
                                  : competition.priority === "medium"
                                    ? "bg-orange-500 text-white"
                                    : "bg-green-500 text-white"
                              }`}
                            >
                              {competition.priority === "high"
                                ? "Alta"
                                : competition.priority === "medium"
                                  ? "Media"
                                  : "Baja"}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Target className="h-4 w-4 text-muted-foreground" />
                              <span className="text-foreground">
                                {competition.location}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-foreground">
                                {competition.type}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                              Eventos:
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

                          <p className="text-sm text-muted-foreground">
                            {competition.objectives}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : selectedDate ? (
              <div className="text-center py-8">
                <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium">
                  No hay actividades registradas
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  para este día
                </p>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
