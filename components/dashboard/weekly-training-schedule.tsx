"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus,
  Activity
} from "lucide-react";
import { format, startOfWeek, addDays, isToday, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

interface TrainingSession {
  id: string;
  title: string;
  time: string;
  duration: number;
  type: string;
  location: string;
  coach: string;
  group: string;
  intensity: 'Z1' | 'Z2' | 'Z3' | 'Z4' | 'Z5';
  distance: number;
  isCompleted: boolean;
}

interface WeeklyTrainingScheduleProps {
  weekStart?: Date;
}

export function WeeklyTrainingSchedule({ weekStart = new Date() }: WeeklyTrainingScheduleProps) {
  const startWeek = startOfWeek(weekStart, { weekStartsOn: 1 }); // Lunes
  const days = Array.from({ length: 7 }, (_, i) => addDays(startWeek, i));
  
  const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Datos de ejemplo de entrenamientos
  const sampleTrainings: TrainingSession[] = [
    {
      id: '1',
      title: 'Entrenamiento de Resistencia',
      time: '07:00',
      duration: 90,
      type: 'Aeróbico',
      location: 'Piscina Municipal',
      coach: 'María García',
      group: 'Grupo A',
      intensity: 'Z2',
      distance: 3000,
      isCompleted: true
    },
    {
      id: '2',
      title: 'Trabajo de Técnica',
      time: '18:30',
      duration: 60,
      type: 'Técnica',
      location: 'Piscina Municipal',
      coach: 'Carlos López',
      group: 'Grupo A',
      intensity: 'Z1',
      distance: 2000,
      isCompleted: false
    },
    {
      id: '3',
      title: 'Intervalos de Velocidad',
      time: '07:00',
      duration: 75,
      type: 'Velocidad',
      location: 'Piscina Municipal',
      coach: 'Ana Martín',
      group: 'Grupo A',
      intensity: 'Z4',
      distance: 2500,
      isCompleted: false
    },
    {
      id: '4',
      title: 'Fondo Largo',
      time: '09:00',
      duration: 120,
      type: 'Fondo',
      location: 'Piscina Municipal',
      coach: 'María García',
      group: 'Grupo A',
      intensity: 'Z2',
      distance: 5000,
      isCompleted: false
    }
  ];

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'Z1': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Z2': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Z3': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Z4': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'Z5': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };



  const getTrainingsForDayAndTime = (day: Date, timeSlot: string): TrainingSession[] => {
    return sampleTrainings.filter(training => {
      const trainingDate = new Date(2024, 0, 15); // Fecha de ejemplo
      const isAM = training.time.includes('07:00') || training.time.includes('09:00');
      const isPM = training.time.includes('18:30');
      
      return isSameDay(trainingDate, day) && 
             ((timeSlot === 'AM' && isAM) || (timeSlot === 'PM' && isPM));
    });
  };

  const getDayStats = (day: Date) => {
    const amTrainings = getTrainingsForDayAndTime(day, 'AM');
    const pmTrainings = getTrainingsForDayAndTime(day, 'PM');
    const totalTrainings = amTrainings.length + pmTrainings.length;
    const completedTrainings = [...amTrainings, ...pmTrainings].filter(t => t.isCompleted).length;
    const totalDistance = [...amTrainings, ...pmTrainings].reduce((sum, t) => sum + t.distance, 0);
    
    return { totalTrainings, completedTrainings, totalDistance };
  };

  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Horario Semanal de Entrenamientos
        </CardTitle>
        <CardDescription>
          {format(startWeek, "dd MMM", { locale: es })} - {format(addDays(startWeek, 6), "dd MMM yyyy", { locale: es })}
        </CardDescription>
      </CardHeader>
             <CardContent>
        {/* Vista Desktop/Tablet - Grid 2x7 */}
        <div className="hidden lg:block">
          {/* Headers de días */}
          <div className="grid grid-cols-8 gap-3 mb-4">
            <div className="text-center text-sm font-medium text-muted-foreground py-3">
              {/* Espacio vacío para alinear con las filas */}
            </div>
            {dayNames.map((dayName, index) => {
              const day = days[index];
              const stats = getDayStats(day);
              const isCurrentDay = isToday(day);
              
              return (
                <div key={index} className="text-center">
                  <div className={`p-3 rounded-lg ${isCurrentDay ? 'bg-primary/10 border border-primary dark:bg-primary/20' : 'bg-muted/30 dark:bg-muted/50'}`}>
                    <div className="text-sm font-medium">{dayName}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(day, "dd/MM", { locale: es })}
                    </div>
                    {stats.totalTrainings > 0 && (
                      <div className="text-xs mt-2">
                        <div className="flex items-center justify-center gap-1">
                          <Activity className="h-3 w-3" />
                          <span>{stats.completedTrainings}/{stats.totalTrainings}</span>
                        </div>
                        <div className="text-muted-foreground">
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
          <div className="grid grid-cols-8 gap-3 mb-4">
            <div className="text-center text-sm font-medium text-muted-foreground py-4 flex items-center justify-center bg-muted/30 dark:bg-muted/50 rounded-lg">
              AM
            </div>
            {days.map((day, index) => {
              const trainings = getTrainingsForDayAndTime(day, 'AM');
              const isCurrentDay = isToday(day);
              
              return (
                <div key={`am-${index}`} className="min-h-[180px]">
                  <div className={`h-full p-4 rounded-lg border ${isCurrentDay ? 'border-primary/50 bg-primary/5 dark:bg-primary/10' : 'border-muted bg-background/50 dark:bg-background/80'}`}>
                    {trainings.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-12 w-12 p-0 opacity-50 hover:opacity-100"
                        >
                          <Plus className="h-6 w-6" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {trainings.map((training) => (
                          <div
                            key={training.id}
                            className={`p-3 rounded-lg text-sm border ${
                              training.isCompleted 
                                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                                : 'bg-background border-muted dark:bg-background/80 dark:border-muted-foreground/20'
                            }`}
                          >
                            <div className="font-medium truncate mb-2">{training.title}</div>
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">{training.time}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={`${getIntensityColor(training.intensity)} text-sm px-2 py-1`}>
                                {training.intensity}
                              </Badge>
                              <span className="text-sm text-muted-foreground">{training.distance}m</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span className="text-sm truncate">{training.location}</span>
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
          <div className="grid grid-cols-8 gap-3">
            <div className="text-center text-sm font-medium text-muted-foreground py-4 flex items-center justify-center bg-muted/30 dark:bg-muted/50 rounded-lg">
              PM
            </div>
            {days.map((day, index) => {
              const trainings = getTrainingsForDayAndTime(day, 'PM');
              const isCurrentDay = isToday(day);
              
              return (
                <div key={`pm-${index}`} className="min-h-[180px]">
                  <div className={`h-full p-4 rounded-lg border ${isCurrentDay ? 'border-primary/50 bg-primary/5 dark:bg-primary/10' : 'border-muted bg-background/50 dark:bg-background/80'}`}>
                    {trainings.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-12 w-12 p-0 opacity-50 hover:opacity-100"
                        >
                          <Plus className="h-6 w-6" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {trainings.map((training) => (
                          <div
                            key={training.id}
                            className={`p-3 rounded-lg text-sm border ${
                              training.isCompleted 
                                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                                : 'bg-background border-muted dark:bg-background/80 dark:border-muted-foreground/20'
                            }`}
                          >
                            <div className="font-medium truncate mb-2">{training.title}</div>
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">{training.time}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={`${getIntensityColor(training.intensity)} text-sm px-2 py-1`}>
                                {training.intensity}
                              </Badge>
                              <span className="text-sm text-muted-foreground">{training.distance}m</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span className="text-sm truncate">{training.location}</span>
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

        {/* Vista Móvil - Lista vertical */}
        <div className="lg:hidden space-y-4">
          {days.map((day, index) => {
            const dayName = dayNames[index];
            const amTrainings = getTrainingsForDayAndTime(day, 'AM');
            const pmTrainings = getTrainingsForDayAndTime(day, 'PM');
            const isCurrentDay = isToday(day);
            const stats = getDayStats(day);
            
            return (
              <div key={index} className={`p-4 rounded-lg border ${isCurrentDay ? 'border-primary/50 bg-primary/5 dark:bg-primary/10' : 'border-muted bg-background/50 dark:bg-background/80'}`}>
                {/* Header del día */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{dayName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(day, "dd MMMM yyyy", { locale: es })}
                    </p>
                  </div>
                  {stats.totalTrainings > 0 && (
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm">
                        <Activity className="h-4 w-4" />
                        <span>{stats.completedTrainings}/{stats.totalTrainings}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stats.totalDistance}m
                      </div>
                    </div>
                  )}
                </div>

                {/* Entrenamientos AM */}
                {amTrainings.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <span className="w-8 h-6 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded text-xs flex items-center justify-center">AM</span>
                      Mañana
                    </h4>
                    <div className="space-y-2">
                      {amTrainings.map((training) => (
                        <div
                          key={training.id}
                          className={`p-3 rounded-lg border ${
                            training.isCompleted 
                              ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                              : 'bg-background border-muted'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium text-sm">{training.title}</h5>
                            <Badge className={`${getIntensityColor(training.intensity)} text-xs px-2 py-1`}>
                              {training.intensity}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{training.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{training.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{training.distance}m</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{training.duration}min</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Entrenamientos PM */}
                {pmTrainings.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <span className="w-8 h-6 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 rounded text-xs flex items-center justify-center">PM</span>
                      Tarde
                    </h4>
                    <div className="space-y-2">
                      {pmTrainings.map((training) => (
                        <div
                          key={training.id}
                          className={`p-3 rounded-lg border ${
                            training.isCompleted 
                              ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                              : 'bg-background border-muted'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium text-sm">{training.title}</h5>
                            <Badge className={`${getIntensityColor(training.intensity)} text-xs px-2 py-1`}>
                              {training.intensity}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{training.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{training.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{training.distance}m</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{training.duration}min</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botón para agregar entrenamiento si no hay ninguno */}
                {amTrainings.length === 0 && pmTrainings.length === 0 && (
                  <div className="text-center py-8">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Agregar Entrenamiento
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Resumen semanal */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-background/50 dark:bg-background/80 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {sampleTrainings.length}
              </div>
              <div className="text-sm text-muted-foreground">Entrenamientos</div>
            </div>
            <div className="text-center p-3 bg-background/50 dark:bg-background/80 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {sampleTrainings.filter(t => t.isCompleted).length}
              </div>
              <div className="text-sm text-muted-foreground">Completados</div>
            </div>
            <div className="text-center p-3 bg-background/50 dark:bg-background/80 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {sampleTrainings.reduce((sum, t) => sum + t.distance, 0).toLocaleString()}m
              </div>
              <div className="text-sm text-muted-foreground">Distancia Total</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
