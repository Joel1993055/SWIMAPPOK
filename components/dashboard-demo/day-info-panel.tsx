"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Activity, Target, Clock, MapPin, TrendingUp, Zap } from "lucide-react";
import { Session } from "@/lib/types/session";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DayInfoPanelProps {
  selectedDate: string | null;
  sessions: Session[];
}

export function DayInfoPanel({ selectedDate, sessions }: DayInfoPanelProps) {
  if (!selectedDate) {
    return (
      <div className="text-center p-6 rounded-xl bg-gradient-to-br from-muted/50 to-muted/80 border-2 border-dashed border-muted-foreground/20">
        <Calendar className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
        <h4 className="text-lg font-semibold text-muted-foreground mb-2">
          Selecciona un día
        </h4>
        <p className="text-sm text-muted-foreground">
          Haz clic en cualquier día del calendario para ver los detalles de entrenamiento
        </p>
      </div>
    );
  }

  const totalDistance = sessions.reduce((sum, s) => sum + s.distance, 0);
  const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const avgIntensity = sessions.length > 0 
    ? sessions.reduce((sum, s) => sum + (s.intensity || 0), 0) / sessions.length 
    : 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 2) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    if (intensity <= 3) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (intensity <= 4) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity <= 2) return "Z1 - Recuperación";
    if (intensity <= 3) return "Z2 - Aeróbico";
    if (intensity <= 4) return "Z3 - Umbral";
    if (intensity <= 5) return "Z4 - VO2 Max";
    return "Z5 - Anaeróbico";
  };

  return (
    <div className="space-y-4">
      {/* Header del día */}
      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20">
        <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
        <h3 className="text-xl font-bold text-primary mb-1">
          {formatDate(selectedDate)}
        </h3>
        <p className="text-sm text-muted-foreground">
          {sessions.length} {sessions.length === 1 ? 'sesión' : 'sesiones'}
        </p>
      </div>

      {/* Resumen del día */}
      {sessions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Distancia total */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 dark:border-blue-800">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {Math.round(totalDistance / 1000 * 10) / 10}k
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300">Distancia Total</p>
            </CardContent>
          </Card>

          {/* Duración total */}
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 dark:border-green-800">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {Math.round(totalDuration / 60)}m
              </div>
              <p className="text-xs text-green-700 dark:text-green-300">Duración Total</p>
            </CardContent>
          </Card>

          {/* Intensidad promedio */}
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 dark:border-purple-800">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {avgIntensity.toFixed(1)}
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-300">Intensidad Promedio</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lista de sesiones */}
      {sessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Sesiones del Día
            </CardTitle>
            <CardDescription>
              Detalle de cada entrenamiento realizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div>
                      <p className="font-medium">
                        Sesión {index + 1}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{Math.round(session.distance / 1000 * 10) / 10}k</span>
                        <span>•</span>
                        <span>{Math.round((session.duration || 0) / 60)}m</span>
                        {session.technique && (
                          <>
                            <span>•</span>
                            <span>Técnica</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="secondary" 
                    className={getIntensityColor(session.intensity || 0)}
                  >
                    {getIntensityLabel(session.intensity || 0)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mensaje cuando no hay sesiones */}
      {sessions.length === 0 && (
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 dark:border-amber-800">
          <CardContent className="p-6 text-center">
            <Target className="w-12 h-12 text-amber-600 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Día de Descanso
            </h4>
            <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
              No se registraron entrenamientos en esta fecha
            </p>
            <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100">
              <Plus className="w-4 h-4 mr-2" />
              Añadir Entrenamiento
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
