"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, TrendingUp, Users, Activity, Clock, BarChart3, Calendar, Trophy } from "lucide-react";
import { getSeedData, getAggregations } from "@/lib/seed";
import { useState } from "react";

export function KPICards() {
  const sessions = getSeedData();
  const stats = getAggregations(sessions);
  const [selectedPeriod, setSelectedPeriod] = useState<'year' | 'month' | 'week'>('year');
  const [selectedDistancePeriod, setSelectedDistancePeriod] = useState<'year' | 'month' | 'week'>('year');

  // Calcular distancia por período
  const getDistanceByPeriod = () => {
    const totalDistanceKm = stats.totalDistance / 1000;
    
    switch (selectedDistancePeriod) {
      case 'year':
        return {
          distance: totalDistanceKm.toFixed(1),
          label: 'Total acumulado este año',
          subtitle: `${stats.totalDistance.toLocaleString()} metros`
        };
      case 'month':
        // Aproximación: dividir distancia anual entre 12
        const monthlyDistance = totalDistanceKm / 12;
        return {
          distance: monthlyDistance.toFixed(1),
          label: 'Total este mes',
          subtitle: `${Math.round(monthlyDistance * 1000).toLocaleString()} metros`
        };
      case 'week':
        // Aproximación: dividir distancia anual entre 52
        const weeklyDistance = totalDistanceKm / 52;
        return {
          distance: weeklyDistance.toFixed(1),
          label: 'Total esta semana',
          subtitle: `${Math.round(weeklyDistance * 1000).toLocaleString()} metros`
        };
      default:
        return {
          distance: totalDistanceKm.toFixed(1),
          label: 'Total acumulado',
          subtitle: `${stats.totalDistance.toLocaleString()} metros`
        };
    }
  };

  // Calcular sesiones por período
  const getSessionsByPeriod = () => {
    const now = new Date();
    
    switch (selectedPeriod) {
      case 'year':
        return {
          total: stats.totalSessions,
          label: 'Total acumulado este año',
          subtitle: 'Sesiones registradas'
        };
      case 'month':
        // Aproximación: dividir sesiones anuales entre 12
        const monthlySessions = Math.round(stats.totalSessions / 12);
        return {
          total: monthlySessions,
          label: 'Total este mes',
          subtitle: 'Sesiones del mes actual'
        };
      case 'week':
        // Aproximación: dividir sesiones anuales entre 52
        const weeklySessions = Math.round(stats.totalSessions / 52);
        return {
          total: weeklySessions,
          label: 'Total esta semana',
          subtitle: 'Sesiones de la semana'
        };
      default:
        return {
          total: stats.totalSessions,
          label: 'Total acumulado',
          subtitle: 'Sesiones registradas'
        };
    }
  };

  // Calcular estado del ciclo de entrenamiento
  const getTrainingCycleStatus = () => {
    const now = new Date();
    const year = now.getFullYear();
    
    // Simular fechas de ciclo (ejemplo: ciclo de 16 semanas)
    const cycleStart = new Date(year, 0, 1); // 1 enero
    const cycleEnd = new Date(year, 3, 30); // 30 abril (16 semanas)
    const totalCycleDays = Math.ceil((cycleEnd.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((now.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24));
    const cycleProgress = Math.min(Math.max((daysPassed / totalCycleDays) * 100, 0), 100);
    
    // Determinar fase del ciclo
    let phase = '';
    let phaseColor = '';
    if (cycleProgress < 25) {
      phase = 'Base';
      phaseColor = 'text-blue-600';
    } else if (cycleProgress < 50) {
      phase = 'Construcción';
      phaseColor = 'text-green-600';
    } else if (cycleProgress < 75) {
      phase = 'Específico';
      phaseColor = 'text-orange-600';
    } else {
      phase = 'Pico';
      phaseColor = 'text-red-600';
    }
    
    return {
      phase,
      phaseColor,
      progress: Math.round(cycleProgress),
      label: 'Fase del ciclo actual',
      subtitle: `${daysPassed} días transcurridos`
    };
  };

  // Calcular días hasta campeonato
  const getDaysToChampionship = () => {
    const now = new Date();
    const championship = new Date(2025, 5, 15); // 15 junio 2025 (ejemplo)
    const daysUntil = Math.ceil((championship.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    let urgency = '';
    let urgencyColor = '';
    if (daysUntil > 60) {
      urgency = 'Preparación';
      urgencyColor = 'text-green-600';
    } else if (daysUntil > 30) {
      urgency = 'Intensificación';
      urgencyColor = 'text-orange-600';
    } else if (daysUntil > 14) {
      urgency = 'Afino';
      urgencyColor = 'text-red-600';
    } else {
      urgency = 'Taper';
      urgencyColor = 'text-purple-600';
    }
    
    return {
      days: daysUntil,
      urgency,
      urgencyColor,
      label: 'Campeonato Nacional',
      subtitle: `Fase: ${urgency}`
    };
  };

  const distanceData = getDistanceByPeriod();
  const sessionsData = getSessionsByPeriod();
  const cycleData = getTrainingCycleStatus();
  const championshipData = getDaysToChampionship();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-muted/50 border-muted">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Distancia Total</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{distanceData.distance} km</div>
          <p className="text-xs text-muted-foreground">
            {distanceData.label}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {distanceData.subtitle}
          </p>
          
          {/* Tabs para seleccionar período de distancia */}
          <div className="mt-3">
            <Tabs value={selectedDistancePeriod} onValueChange={(value) => setSelectedDistancePeriod(value as 'year' | 'month' | 'week')} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted h-8">
                <TabsTrigger value="year" className="text-xs">Año</TabsTrigger>
                <TabsTrigger value="month" className="text-xs">Mes</TabsTrigger>
                <TabsTrigger value="week" className="text-xs">Semana</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-muted/50 border-muted">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sesiones</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sessionsData.total}</div>
          <p className="text-xs text-muted-foreground">
            {sessionsData.label}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {sessionsData.subtitle}
          </p>
          
          {/* Tabs para seleccionar período de sesiones */}
          <div className="mt-3">
            <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as 'year' | 'month' | 'week')} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted h-8">
                <TabsTrigger value="year" className="text-xs">Año</TabsTrigger>
                <TabsTrigger value="month" className="text-xs">Mes</TabsTrigger>
                <TabsTrigger value="week" className="text-xs">Semana</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-muted/50 border-muted">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estado del Ciclo</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <span className={cycleData.phaseColor}>{cycleData.phase}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {cycleData.label}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {cycleData.subtitle}
          </p>
          <div className="mt-2">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${cycleData.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {cycleData.progress}% completado
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-muted/50 border-muted">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Días al Campeonato</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <span className={championshipData.urgencyColor}>{championshipData.days}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {championshipData.label}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {championshipData.subtitle}
          </p>
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                15 Junio 2025
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}