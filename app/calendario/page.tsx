"use client";

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Target, Activity } from "lucide-react"
import { useState } from "react"

export default function CalendarioPage() {
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState<{ day: number; month: string; year: number } | null>(null);

  // Datos de ejemplo para los entrenamientos
  const trainingData: Record<number, Record<string, { distance: number; sessions: number }>> = {
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
      diciembre: { distance: 0, sessions: 0 }
    }
  };

  // Datos de ejemplo para entrenamientos específicos por día
  const dailyTrainingData = {
    "2025-01-15": {
      sessions: [
        { time: "07:00", type: "Aeróbico", distance: 2000, duration: 45, stroke: "Libre", rpe: 6 },
        { time: "19:30", type: "Técnica", distance: 1500, duration: 30, stroke: "Espalda", rpe: 4 }
      ]
    },
    "2025-02-20": {
      sessions: [
        { time: "08:00", type: "Umbral", distance: 3000, duration: 60, stroke: "Libre", rpe: 8 }
      ]
    },
    "2025-03-10": {
      sessions: [
        { time: "07:30", type: "Velocidad", distance: 1200, duration: 25, stroke: "Mariposa", rpe: 9 },
        { time: "18:00", type: "Recuperación", distance: 800, duration: 20, stroke: "Pecho", rpe: 3 }
      ]
    }
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
    { name: "diciembre", short: "dic", days: 31 }
  ];

  const weekDays = ["L", "M", "X", "J", "V", "S", "D"];

  const totalTrainings = trainingData[currentYear] 
    ? Object.values(trainingData[currentYear]).reduce((sum, month) => sum + month.sessions, 0)
    : 0;

  const generateCalendarDays = (monthIndex: number) => {
    const month = months[monthIndex];
    const days = [];
    
    // Generar días del mes
    for (let day = 1; day <= month.days; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentYear(prev => direction === 'prev' ? prev - 1 : prev + 1);
  };

  const handleDayClick = (day: number, month: string) => {
    setSelectedDate({ day, month, year: currentYear });
  };

  const getSelectedDayData = () => {
    if (!selectedDate) return null;
    
    const dateKey = `${selectedDate.year}-${String(months.findIndex(m => m.name === selectedDate.month) + 1).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
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
                <h1 className="text-2xl font-bold">Calendario 2025</h1>
                <p className="text-sm text-muted-foreground">Vista anual de todos tus entrenamientos</p>
              </div>
            </div>
          </div>

          {/* Año y estadísticas */}
          <div className="flex items-center justify-center gap-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateYear('prev')}
              className="rounded-full w-10 h-10 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-center">
              <h2 className="text-4xl font-bold">{currentYear}</h2>
              <p className="text-lg text-muted-foreground">{totalTrainings} entrenamientos</p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateYear('next')}
              className="rounded-full w-10 h-10 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Layout principal: Calendario a la izquierda, Panel de información a la derecha */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Calendario - 2/3 del ancho */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {months.map((month, index) => {
                  const monthData = trainingData[currentYear]?.[month.name];
                  const days = generateCalendarDays(index);
                  
                  return (
                    <Card key={month.name} className="bg-muted/50 border-muted">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg capitalize">{month.short}</CardTitle>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {monthData?.distance.toLocaleString()}m
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {monthData?.sessions} sesiones
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Días de la semana */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {weekDays.map((day) => (
                            <div key={day} className="text-center text-xs font-medium text-muted-foreground p-1">
                              {day}
                            </div>
                          ))}
                        </div>
                        
                        {/* Días del mes */}
                        <div className="grid grid-cols-7 gap-1">
                          {days.map((day) => (
                            <div
                              key={day}
                              onClick={() => handleDayClick(day, month.name)}
                              className={`aspect-square flex items-center justify-center text-xs font-medium rounded-sm transition-colors cursor-pointer ${
                                day !== null && (month.name === "enero" || month.name === "febrero" || month.name === "marzo")
                                  ? "bg-blue-500 text-white hover:bg-blue-600"
                                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                              }`}
                            >
                              {day}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Panel de información - 1/3 del ancho */}
            <div className="lg:col-span-1">
              <Card className="bg-muted/50 border-muted h-fit">
                <CardHeader>
                  <CardTitle>Información del Día</CardTitle>
                  <CardDescription>
                    {selectedDate 
                      ? `${selectedDate.day} de ${selectedDate.month} de ${selectedDate.year}`
                      : "Selecciona un día para ver los detalles"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDate && selectedDayData ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        <span className="font-medium">{selectedDayData.sessions.length} sesión(es)</span>
                      </div>
                      
                      {selectedDayData.sessions.map((session, index) => (
                        <div key={index} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{session.time}</span>
                            </div>
                            <Badge variant="outline">{session.type}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Target className="h-3 w-3 text-muted-foreground" />
                              <span>{session.distance}m</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>{session.duration}min</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{session.stroke}</span>
                            <Badge variant="secondary">RPE {session.rpe}/10</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : selectedDate ? (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        No hay entrenamientos registrados para este día
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        Haz click en un día del calendario para ver los detalles
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Leyenda */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
              <span>Día con entrenamiento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted rounded-sm border"></div>
              <span>Día sin entrenamiento</span>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
