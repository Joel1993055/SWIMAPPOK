"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Users, Activity, Clock, BarChart3 } from "lucide-react";
import { getSeedData, getAggregations } from "@/lib/seed";

export function KPICards() {
  const sessions = getSeedData();
  const stats = getAggregations(sessions);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-muted/50 border-muted">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Distancia Total</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDistance}m</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">+20.1%</span> vs mes anterior
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Total acumulado este mes
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-muted/50 border-muted">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sesiones</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSessions}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">+3</span> esta semana
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Sesiones registradas
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-muted/50 border-muted">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDuration}h</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">+2.5h</span> vs mes anterior
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Tiempo en el agua
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-muted/50 border-muted">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">% Técnica</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.techniquePercentage}%</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-blue-600">vs Aeróbico</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Sesiones de técnica
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
