"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Target, Activity } from "lucide-react";

export function DashboardCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<{ day: number; month: string; year: number } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentMonthName = months[currentMonth].name;

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

  const getSelectedDayData = () => {
    if (!selectedDate) return null;
    
    const dateKey = `${selectedDate.year}-${String(months.findIndex(m => m.name === selectedDate.month) + 1).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
    return dailyTrainingData[dateKey as keyof typeof dailyTrainingData] || null;
  };

  const selectedDayData = getSelectedDayData();

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
               <CardDescription>
                 Vista mensual de tus sesiones
               </CardDescription>
             </div>
             
             {/* Navegación del mes */}
             <div className="flex items-center gap-2">
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => navigateMonth('prev')}
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
                 onClick={() => navigateMonth('next')}
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
             {weekDays.map((day) => (
               <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground">
                 {day}
               </div>
             ))}
           </div>
           
           {/* Días del mes */}
           <div className="grid grid-cols-7 gap-2 flex-1">
             {generateCalendarDays().map((day, index) => {
               const hasTraining = day !== null && (currentMonthName === "enero" || currentMonthName === "febrero" || currentMonthName === "marzo");
               const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
               
               return (
                 <div
                   key={index}
                   onClick={() => day && handleDayClick(day)}
                   className={`h-12 w-full flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 ${
                     day === null 
                       ? "invisible" 
                       : hasTraining
                         ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-sm"
                         : isToday
                           ? "bg-accent text-accent-foreground border-2 border-primary cursor-pointer"
                           : "text-foreground hover:bg-accent cursor-pointer"
                   }`}
                 >
                   {day}
                 </div>
               );
             })}
           </div>
           
           {/* Leyenda del calendario */}
           <div className="mt-4 pt-4 border-t border-border">
             <div className="flex items-center gap-4 text-xs text-muted-foreground">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-primary rounded-full"></div>
                 <span>Días con entrenamiento</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-accent border border-primary rounded-full"></div>
                 <span>Hoy</span>
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
                : "Detalles del Día"
              }
            </DialogTitle>
            <DialogDescription>
              Información de entrenamientos para este día
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedDate && selectedDayData ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                  <div className="p-2 bg-primary rounded-full">
                    <Activity className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {selectedDayData.sessions.length} sesión{selectedDayData.sessions.length !== 1 ? 'es' : ''}
                    </p>
                    <p className="text-sm text-muted-foreground">Entrenamientos programados</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {selectedDayData.sessions.map((session, index) => (
                    <div key={index} className="border rounded-xl p-4 space-y-3 bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold text-foreground">{session.time}</span>
                        </div>
                        <Badge variant="secondary">
                          {session.type}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{session.distance}m</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{session.duration}min</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium">{session.stroke}</span>
                        <Badge variant="outline" className="text-xs">
                          RPE {session.rpe}/10
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : selectedDate ? (
              <div className="text-center py-8">
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
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
