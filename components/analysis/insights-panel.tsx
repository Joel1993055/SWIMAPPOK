'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Session } from '@/infra/config/actions/sessions';
import {
    AlertTriangle,
    CheckCircle,
    Lightbulb,
    Target,
    TrendingUp
} from 'lucide-react';
import { useMemo } from 'react';

interface InsightsPanelProps {
  sessions: Session[];
  selectedPeriod: string;
}

export function InsightsPanel({ sessions, selectedPeriod }: InsightsPanelProps) {
  const insights = useMemo(() => {
    const result = {
      strengths: [] as string[],
      improvements: [] as string[],
      alerts: [] as string[],
      recommendations: [] as string[],
    };

    if (sessions.length === 0) {
      result.alerts.push('Insufficient data to generate insights');
      return result;
    }

    // Calculate basic metrics
    const totalDistance = sessions.reduce((sum, s) => sum + (s.distance || 0), 0);
    const totalSessions = sessions.length;
    const avgRPE = sessions.reduce((sum, s) => sum + (s.rpe || 0), 0) / totalSessions;
    const avgDistance = totalDistance / totalSessions;

    // Calculate consistency (sessions per week)
    const firstSession = new Date(Math.min(...sessions.map(s => new Date(s.date).getTime())));
    const lastSession = new Date(Math.max(...sessions.map(s => new Date(s.date).getTime())));
    const weeks = Math.max(1, Math.ceil((lastSession.getTime() - firstSession.getTime()) / (7 * 24 * 60 * 60 * 1000)));
    const consistency = totalSessions / weeks;

    // Calculate zone distribution
    const zoneData: { [key: string]: number } = {};
    sessions.forEach(session => {
      if (session.zone_volumes) {
        Object.entries(session.zone_volumes).forEach(([zone, distance]) => {
          zoneData[zone] = (zoneData[zone] || 0) + distance;
        });
      }
    });

    const totalZoneDistance = Object.values(zoneData).reduce((sum, dist) => sum + dist, 0);
    const z4z5Percentage = totalZoneDistance > 0 
      ? ((zoneData.z4 || 0) + (zoneData.z5 || 0)) / totalZoneDistance * 100 
      : 0;

    // Consistency insights
    if (consistency >= 4) {
      result.strengths.push(`Excellent consistency: ${consistency.toFixed(1)} sessions per week`);
    } else if (consistency >= 3) {
      result.strengths.push(`Good consistency: ${consistency.toFixed(1)} sessions per week`);
    } else if (consistency < 2) {
      result.improvements.push(`Increase frequency: only ${consistency.toFixed(1)} sessions per week`);
    }

    // Intensity insights
    if (avgRPE >= 7) {
      result.alerts.push(`High average intensity: RPE ${avgRPE.toFixed(1)} - consider more recovery`);
    } else if (avgRPE >= 6) {
      result.strengths.push(`Good training intensity: RPE ${avgRPE.toFixed(1)}`);
    } else if (avgRPE < 4) {
      result.improvements.push(`Increase intensity: very low average RPE (${avgRPE.toFixed(1)})`);
    }

    // Volume insights
    if (totalDistance >= 50000) {
      result.strengths.push(`High training volume: ${(totalDistance / 1000).toFixed(1)}km`);
    } else if (totalDistance < 10000) {
      result.improvements.push(`Increase volume: only ${(totalDistance / 1000).toFixed(1)}km`);
    }

    // Zone distribution insights
    if (z4z5Percentage > 30) {
      result.alerts.push(`High percentage in intense zones: ${z4z5Percentage.toFixed(1)}% in Z4-Z5`);
      result.recommendations.push('Consider increasing Z1-Z2 work for better recovery');
    } else if (z4z5Percentage < 10) {
      result.improvements.push(`More high intensity work: only ${z4z5Percentage.toFixed(1)}% in Z4-Z5`);
      result.recommendations.push('Include more speed and power sessions');
    } else {
      result.strengths.push(`Good intensity distribution: ${z4z5Percentage.toFixed(1)}% in Z4-Z5`);
    }

    // Average distance per session insights
    if (avgDistance >= 3000) {
      result.strengths.push(`Effective long sessions: ${avgDistance.toFixed(0)}m average`);
    } else if (avgDistance < 1500) {
      result.improvements.push(`Short sessions: ${avgDistance.toFixed(0)}m average - consider longer sessions`);
    }

    // General recommendations
    if (consistency < 3 && avgRPE < 5) {
      result.recommendations.push('Focus on increasing both frequency and intensity gradually');
    }

    if (totalSessions >= 20 && avgRPE >= 6) {
      result.recommendations.push('Excellent progress - maintain this routine and consider more specific goals');
    }

    return result;
  }, [sessions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Automatic Insights</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Strengths */}
        {insights.strengths.length > 0 && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {insights.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Areas for Improvement */}
        {insights.improvements.length > 0 && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Target className="h-5 w-5" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {insights.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Alerts */}
        {insights.alerts.length > 0 && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {insights.alerts.map((alert, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{alert}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        {insights.recommendations.length > 0 && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <TrendingUp className="h-5 w-5" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {insights.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-green-600">
              {insights.strengths.length} Strengths
            </Badge>
            <Badge variant="outline" className="text-orange-600">
              {insights.improvements.length} Improvements
            </Badge>
            <Badge variant="outline" className="text-red-600">
              {insights.alerts.length} Alerts
            </Badge>
            <Badge variant="outline" className="text-blue-600">
              {insights.recommendations.length} Recommendations
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
