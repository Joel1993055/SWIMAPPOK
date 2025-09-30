'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Session } from '@/infra/config/actions/sessions';
import { subDays, subMonths } from 'date-fns';
import {
    Activity,
    Calendar,
    Clock,
    Target,
    TrendingUp,
    Zap
} from 'lucide-react';
import { memo, useMemo } from 'react';

interface AnalysisOverviewProps {
  sessions: Session[];
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

export const AnalysisOverview = memo(function AnalysisOverview({ sessions, selectedPeriod, onPeriodChange }: AnalysisOverviewProps) {
  // Filtrar sesiones por período
  const filteredSessions = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (selectedPeriod) {
      case 'last-7-days':
        startDate = subDays(now, 7);
        break;
      case 'last-30-days':
        startDate = subDays(now, 30);
        break;
      case 'last-3-months':
        startDate = subMonths(now, 3);
        break;
      case 'last-6-months':
        startDate = subMonths(now, 6);
        break;
      case 'last-year':
        startDate = subMonths(now, 12);
        break;
      default:
        startDate = subDays(now, 30);
    }

    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startDate && sessionDate <= now;
    });
  }, [sessions, selectedPeriod]);

  // Calcular métricas
  const metrics = useMemo(() => {
    if (filteredSessions.length === 0) {
      return {
        totalDistance: 0,
        totalSessions: 0,
        avgDistance: 0,
        avgRPE: 0,
        totalTime: 0,
        consistency: 0,
        zoneDistribution: []
      };
    }

    const totals = filteredSessions.reduce(
      (acc, session) => ({
        distance: acc.distance + (session.distance || 0),
        duration: acc.duration + (session.duration || 0),
        rpe: acc.rpe + (session.rpe || 0),
        sessions: acc.sessions + 1,
      }),
      { distance: 0, duration: 0, rpe: 0, sessions: 0 }
    );

    // Calcular distribución de zonas
    const zoneData: { [key: string]: number } = {};
    filteredSessions.forEach(session => {
      if (session.zone_volumes) {
        Object.entries(session.zone_volumes).forEach(([zone, distance]) => {
          zoneData[zone] = (zoneData[zone] || 0) + distance;
        });
      }
    });

    const totalZoneDistance = Object.values(zoneData).reduce((sum, dist) => sum + dist, 0);
    const zoneDistribution = Object.entries(zoneData)
      .map(([zone, distance]) => ({
        zone: zone.toUpperCase(),
        distance,
        percentage: totalZoneDistance > 0 ? (distance / totalZoneDistance) * 100 : 0,
      }))
      .sort((a, b) => a.zone.localeCompare(b.zone));

    // Calcular consistencia (sesiones por semana)
    const weeks = Math.max(1, Math.ceil((new Date().getTime() - new Date(filteredSessions[0]?.date || new Date()).getTime()) / (7 * 24 * 60 * 60 * 1000)));
    const consistency = totals.sessions / weeks;

    return {
      totalDistance: totals.distance,
      totalSessions: totals.sessions,
      avgDistance: totals.sessions > 0 ? totals.distance / totals.sessions : 0,
      avgRPE: totals.sessions > 0 ? totals.rpe / totals.sessions : 0,
      totalTime: totals.duration,
      consistency,
      zoneDistribution
    };
  }, [filteredSessions]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'last-7-days': return 'Last 7 days';
      case 'last-30-days': return 'Last 30 days';
      case 'last-3-months': return 'Last 3 months';
      case 'last-6-months': return 'Last 6 months';
      case 'last-year': return 'Last year';
      default: return 'Last 30 days';
    }
  };

  const periods = [
    { value: 'last-7-days', label: '7d' },
    { value: 'last-30-days', label: '30d' },
    { value: 'last-3-months', label: '3m' },
    { value: 'last-6-months', label: '6m' },
    { value: 'last-year', label: '1y' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Overview</h2>
          <Badge variant="outline">{getPeriodLabel()}</Badge>
        </div>
        
        {/* Period Selector */}
        <div className="flex gap-1">
          {periods.map(period => (
            <Button
              key={period.value}
              variant={selectedPeriod === period.value ? "default" : "outline"}
              size="sm"
              onClick={() => onPeriodChange(period.value)}
              className="h-8 px-3 text-xs"
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Main KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Distance */}
        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalDistance.toLocaleString()}m</div>
            <p className="text-xs text-muted-foreground">
              Average: {metrics.avgDistance.toFixed(0)}m/session
            </p>
          </CardContent>
        </Card>

        {/* Total Sessions */}
        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              Consistency: {metrics.consistency.toFixed(1)} sessions/week
            </p>
          </CardContent>
        </Card>

        {/* Average RPE */}
        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg RPE</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgRPE.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Average intensity
            </p>
          </CardContent>
        </Card>

        {/* Total Time */}
        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(metrics.totalTime)}</div>
            <p className="text-xs text-muted-foreground">
              Training time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Zone Distribution */}
      {metrics.zoneDistribution.length > 0 && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Training Zone Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.zoneDistribution.map(zone => (
                <div key={zone.zone} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{zone.zone}</span>
                    <span className="text-muted-foreground">
                      {zone.distance.toLocaleString()}m ({zone.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${zone.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Summary */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Strengths</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {metrics.consistency >= 4 && (
                  <li>• Excellent training consistency</li>
                )}
                {metrics.avgRPE >= 6 && (
                  <li>• Good training intensity</li>
                )}
                {metrics.totalSessions >= 20 && (
                  <li>• High training volume</li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Areas for Improvement</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {metrics.consistency < 3 && (
                  <li>• Increase training frequency</li>
                )}
                {metrics.avgRPE < 5 && (
                  <li>• Increase training intensity</li>
                )}
                {metrics.zoneDistribution.length === 0 && (
                  <li>• Record zone distribution</li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
