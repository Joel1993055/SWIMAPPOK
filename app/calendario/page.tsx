"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Target,
  Activity,
} from "lucide-react";
import { useState } from "react";

export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<{
    day: number;
    month: string;
    year: number;
  } | null>(null);

  // Datos de ejemplo para los entrenamientos
  const trainingData: Record<
    number,
    Record<string, { distance: number; sessions: number }>
  > = {
    2025: {
      enero: { distance: 25100, sessions: 31 },
      febrero: { distance: 16300, sessions: 28 },
      marzo: { distance: 16700, sessions: 31 },
      abril: { distance: 0, sessions: 0 },
      mayo: { distance: 0, sessions: 0 },
      junio: { distance: 0, sessions: 0 },
      julio: { distance: 0, sessions: 0 },
      agosto: { distance: 0, sessions: 0 },
      septiembre: { distance: 0, sessions: 0 },
      octubre: { distance: 0, sessions: 0 },
      noviembre: { distance: 0, sessions: 0 },
      diciembre: { distance: 0, sessions: 0 },
    },
  };

  // Datos de ejemplo para entrenamientos específicos por día
  const dailyTrainingData = {
    "2025-01-15": {
      sessions: [
        {
          time: "07:00",
          type: "Aeróbico",
          distance: 2000,
          duration: 45,
          stroke: "Libre",
          rpe: 6,
        },
        {
          time: "19:30",
          type: "Técnica",
          distance: 1500,
          duration: 30,
          stroke: "Espalda",
          rpe: 4,
        },
      ],
    },
    "2025-02-20": {
      sessions: [
        {
          time: "08:00",
          type: "Umbral",
          distance: 3000,
          duration: 60,
          stroke: "Libre",
          rpe: 8,
        },
      ],
    },
    "2025-03-10": {
      sessions: [
        {
          time: "07:30",
          type: "Velocidad",
          distance: 1200,
          duration: 25,
          stroke: "Mariposa",
          rpe: 9,
        },
        {
          time: "18:00",
          type: "Recuperación",
          distance: 800,
          duration: 20,
          stroke: "Pecho",
          rpe: 3,
        },
      ],
    },
  };

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

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentMonthName = months[currentMonth].name;

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

  const navigateYear = (direction: "prev" | "next") => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === "prev") {
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

  const getSelectedDayData = () => {
    if (!selectedDate) return null;

    const dateKey = `${selectedDate.year}-${String(months.findIndex(m => m.name === selectedDate.month) + 1).padStart(2, "0")}-${String(selectedDate.day).padStart(2, "0")}`;
    return dailyTrainingData[dateKey as keyof typeof dailyTrainingData] || null;
  };

  const selectedDayData = getSelectedDayData();

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Calendario</h1>
                <p className="text-sm text-muted-foreground">
                  Vista mensual de tus entrenamientos
                </p>
              </div>
            </div>
          </div>

          {/* Layout principal: Calendario y panel 50/50 */}
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* Calendario - 50% del ancho */}
            <div className="w-full lg:w-1/2">
              <Card className="bg-muted/50 border-muted">
                <CardHeader className="pb-4">
                  {/* Header con navegación integrada */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateMonth("prev")}
                      className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="text-center">
                      <h2 className="text-xl font-semibold capitalize text-gray-900 dark:text-white">
                        {currentMonthName} {currentYear}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {trainingData[currentYear]?.[currentMonthName]
                          ?.sessions || 0}{" "}
                        entrenamientos
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateMonth("next")}
                      className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Navegación de año - más sutil */}
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateYear("prev")}
                      className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {currentYear - 1}
                    </Button>

                    <div className="w-8 h-px bg-gray-200 dark:bg-gray-700"></div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateYear("next")}
                      className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {currentYear + 1}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 pb-6">
                  {/* Días de la semana - alineados con los números */}
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

                  {/* Días del mes - mejor diseño */}
                  <div className="grid grid-cols-7 gap-1">
                    {generateCalendarDays().map((day, index) => {
                      const hasTraining =
                        day !== null &&
                        (currentMonthName === "enero" ||
                          currentMonthName === "febrero" ||
                          currentMonthName === "marzo");
                      const isToday =
                        day === new Date().getDate() &&
                        currentMonth === new Date().getMonth() &&
                        currentYear === new Date().getFullYear();

                      return (
                        <div
                          key={index}
                          onClick={() => day && handleDayClick(day)}
                          className={`h-10 w-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 ${
                            day === null
                              ? "invisible"
                              : hasTraining
                                ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer shadow-sm"
                                : isToday
                                  ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-blue-500 cursor-pointer"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panel de información - 50% del ancho */}
            <div className="w-full lg:w-1/2">
              <Card className="bg-muted/50 border-muted h-full flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    Detalles del Día
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {selectedDate
                      ? `${selectedDate.day} de ${selectedDate.month} de ${selectedDate.year}`
                      : "Selecciona un día para ver los detalles"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {selectedDate && selectedDayData ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="p-2 bg-blue-500 rounded-full">
                          <Activity className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {selectedDayData.sessions.length} sesión
                            {selectedDayData.sessions.length !== 1 ? "es" : ""}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Entrenamientos programados
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {selectedDayData.sessions.map((session, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3 bg-gray-50 dark:bg-gray-800/50"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  {session.time}
                                </span>
                              </div>
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                              >
                                {session.type}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Target className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-700 dark:text-gray-300">
                                  {session.distance}m
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-700 dark:text-gray-300">
                                  {session.duration}min
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400 font-medium">
                                {session.stroke}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                RPE {session.rpe}/10
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : selectedDate ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-foreground font-medium">
                        No hay entrenamientos registrados
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        para este día
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <CalendarIcon className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-foreground font-medium">
                        Selecciona un día
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        para ver los detalles de entrenamiento
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Leyenda mejorada */}
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-blue-500 rounded-lg shadow-sm"></div>
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                Con entrenamiento
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 border-2 border-blue-500 rounded-lg"></div>
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                Hoy
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"></div>
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                Día normal
              </span>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
