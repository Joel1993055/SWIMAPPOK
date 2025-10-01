'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useSessionsStore } from '@/core/stores/unified';
import { Activity, Calendar, Target, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function MobileDashboard() {
  const { sessions } = useSessionsStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <MobileDashboardSkeleton />;
  }

  // Calculate metrics
  const totalSessions = sessions.length;
  const totalDistance = sessions.reduce((sum, session) => sum + (session.distance || 0), 0);
  const avgRPE = sessions.length > 0 
    ? sessions.reduce((sum, session) => sum + (session.rpe || 0), 0) / sessions.length 
    : 0;

  // Recent sessions (last 5)
  const recentSessions = sessions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Weekly progress
  const thisWeekSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessionDate >= weekAgo;
  });

  const weeklyDistance = thisWeekSessions.reduce((sum, session) => sum + (session.distance || 0), 0);

  return (
    <div className="space-y-4 p-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Sesiones</p>
              <p className="text-lg font-semibold">{totalSessions}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Distancia</p>
              <p className="text-lg font-semibold">
                {totalDistance > 1000 
                  ? `${(totalDistance / 1000).toFixed(1)}k` 
                  : totalDistance}m
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Esta Semana
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>{thisWeekSessions.length} sesiones</span>
            <span>{weeklyDistance}m</span>
          </div>
          <Progress 
            value={Math.min((thisWeekSessions.length / 7) * 100, 100)} 
            className="h-2"
          />
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Sesiones Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSessions.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">No hay sesiones registradas</p>
                <Button size="sm" className="mt-2">
                  Crear Primera Sesión
                </Button>
              </div>
            ) : (
              recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{session.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(session.date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {session.distance}m
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      RPE {session.rpe}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button className="h-12">
          <Activity className="w-4 h-4 mr-2" />
          Nueva Sesión
        </Button>
        <Button variant="outline" className="h-12">
          <Calendar className="w-4 h-4 mr-2" />
          Ver Calendario
        </Button>
      </div>
    </div>
  );
}

function MobileDashboardSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-16 mb-2"></div>
            <div className="h-6 bg-muted rounded w-8"></div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-16 mb-2"></div>
            <div className="h-6 bg-muted rounded w-8"></div>
          </div>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="animate-pulse h-4 bg-muted rounded w-24"></div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-2 bg-muted rounded mb-2"></div>
          <div className="animate-pulse h-3 bg-muted rounded w-16"></div>
        </CardContent>
      </Card>
    </div>
  );
}
