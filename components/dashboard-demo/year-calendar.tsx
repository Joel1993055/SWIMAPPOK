"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useSessionsStore } from "@/lib/store/sessions";
import { getDistanceHeatmapByDay, getSessionsPerMonth } from "@/lib/aggregations";
import { getCurrentYear, getDaysInMonth, formatDate, isCurrentDate } from "@/lib/date";
import { Session } from "@/lib/types/session";
import { Calendar, ChevronLeft, ChevronRight, Plus, Activity } from "lucide-react";

interface YearCalendarProps {
  onDateSelect?: (date: string, sessions: Session[]) => void;
  silentMode?: boolean; // Para no abrir popup en Overview
}

export function YearCalendar({ onDateSelect, silentMode = false }: YearCalendarProps) {
  const { sessions } = useSessionsStore();
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);

  const heatmap = getDistanceHeatmapByDay(sessions, selectedYear);
  const monthlyStats = getSessionsPerMonth(sessions, selectedYear);

  const handleYearChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedYear(selectedYear + 1);
    }
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    
    // Solo abrir popup si NO está en modo silencioso
    if (!silentMode) {
      setIsDateDialogOpen(true);
    }
    
    // Notificar al componente padre sobre la selección
    if (onDateSelect) {
      const dateSessions = sessions.filter(s => s.date === date);
      onDateSelect(date, dateSessions);
    }
  };

  const getDayColor = (distance: number): string => {
    if (distance === 0) return "bg-muted/30";
    if (distance < 1000) return "bg-blue-200 dark:bg-blue-800";
    if (distance < 2000) return "bg-blue-300 dark:bg-blue-700";
    if (distance < 3000) return "bg-blue-400 dark:bg-blue-600";
    return "bg-blue-500 dark:bg-blue-500";
  };

  const getDayTooltip = (date: string, distance: number): string => {
    if (distance === 0) return `${formatDate(date, 'dd/MM/yyyy')} - Sin entrenamiento`;
    return `${formatDate(date, 'dd/MM/yyyy')} - ${distance}m`;
  };

  const renderMonth = (monthIndex: number) => {
    const monthName = new Date(selectedYear, monthIndex, 1).toLocaleDateString('es-ES', { month: 'short' });
    const days = getDaysInMonth(selectedYear, monthIndex + 1);
    
    return (
      <div key={monthIndex} className="space-y-2">
        <div className="text-center">
          <h4 className="font-medium text-sm">{monthName}</h4>
          <p className="text-xs text-muted-foreground">
            {monthlyStats[monthIndex]?.distance || 0}m
          </p>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-xs">
          {/* Días de la semana */}
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
            <div key={day} className="text-center text-muted-foreground p-1">
              {day}
            </div>
          ))}
          
          {/* Días del mes */}
          {days.map((day) => {
            const dateStr = formatDate(day, 'yyyy-MM-dd');
            const distance = heatmap[dateStr] || 0;
            const isToday = isCurrentDate(dateStr);
            
            return (
              <button
                key={day.getTime()}
                onClick={() => handleDateClick(dateStr)}
                className={`
                  w-6 h-6 rounded text-xs font-medium transition-colors
                  hover:ring-2 hover:ring-primary/50 focus:outline-none focus:ring-2 focus:ring-primary
                  ${getDayColor(distance)}
                  ${isToday ? 'ring-2 ring-primary' : ''}
                  ${distance > 0 ? 'cursor-pointer' : 'cursor-default'}
                `}
                title={getDayTooltip(dateStr, distance)}
                disabled={distance === 0}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const getSessionsForDate = (date: string): Session[] => {
    return sessions.filter(session => session.date === date);
  };

  return (
    <div className="space-y-4">
      {/* Header del calendario */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleYearChange('prev')}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold">{selectedYear}</h3>
          <p className="text-sm text-muted-foreground">
            {sessions.filter(s => s.date.startsWith(selectedYear.toString())).length} entrenamientos
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleYearChange('next')}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Grid de meses */}
      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 12 }, (_, i) => renderMonth(i))}
      </div>

      {/* Leyenda */}
      <div className="flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-muted/30 rounded"></div>
          <span>Sin entrenamiento</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-200 dark:bg-blue-800 rounded"></div>
          <span>&lt; 1000m</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-300 dark:bg-blue-700 rounded"></div>
          <span>1000-2000m</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-400 dark:bg-blue-600 rounded"></div>
          <span>2000-3000m</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 dark:bg-blue-500 rounded"></div>
          <span>&gt; 3000m</span>
        </div>
      </div>

      {/* Dialog para ver sesiones de un día */}
      <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Sesiones del {selectedDate ? formatDate(selectedDate, 'dd/MM/yyyy') : ''}
            </DialogTitle>
            <DialogDescription>
              Entrenamientos registrados en esta fecha
            </DialogDescription>
          </DialogHeader>
          
          {selectedDate && (
            <div className="space-y-4">
              {(() => {
                const daySessions = getSessionsForDate(selectedDate);
                
                if (daySessions.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No hay entrenamientos registrados en esta fecha</p>
                      <Button className="mt-4" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Añadir Entrenamiento
                      </Button>
                    </div>
                  );
                }
                
                return (
                  <div className="space-y-3">
                    {daySessions.map((session) => (
                      <Card key={session.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="capitalize">
                                  {session.stroke}
                                </Badge>
                                <Badge variant="secondary" className="capitalize">
                                  {session.sessionType}
                                </Badge>
                              </div>
                              <p className="font-medium">{session.distance}m</p>
                              {session.durationMin > 0 && (
                                <p className="text-sm text-muted-foreground">
                                  {session.durationMin} minutos
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <Badge variant="outline">RPE {session.RPE}/10</Badge>
                            </div>
                          </div>
                          {session.mainSet && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {session.mainSet}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    
                    <div className="pt-4 border-t">
                      <Button className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Añadir Otro Entrenamiento
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
