'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Shield,
  TrendingUp,
  Database,
  Clock,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface RateLimitAnalytics {
  totalRequests: number;
  blockedRequests: number;
  blockRate: number;
  fallbackRate: number;
  rateLimitHits: Record<string, number>;
  topBlockedTypes: Array<{ type: string; hits: number }>;
  timeWindow: {
    start: number;
    end: number;
  };
}

interface RateLimitHealth {
  redis: boolean;
  fallback: boolean;
  metrics: RateLimitAnalytics;
}

export function RateLimitDashboard() {
  const [analytics, setAnalytics] = useState<RateLimitAnalytics | null>(null);
  const [health, setHealth] = useState<RateLimitHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/rate-limits', {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch rate limit data');
      }

      const data = await response.json();
      setAnalytics(data.analytics);
      setHealth(data.health);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const resetMetrics = async () => {
    try {
      const response = await fetch('/api/admin/rate-limits', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reset metrics');
      }

      await fetchData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset metrics');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <RefreshCw className='h-6 w-6 animate-spin' />
        <span className='ml-2'>Loading rate limit data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className='h-4 w-4' />
        <AlertDescription>
          Error loading rate limit data: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!analytics || !health) {
    return (
      <Alert>
        <AlertTriangle className='h-4 w-4' />
        <AlertDescription>No rate limit data available</AlertDescription>
      </Alert>
    );
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(2)}%`;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Rate Limit Dashboard</h2>
          <p className='text-muted-foreground'>
            Monitor and manage rate limiting across your application
          </p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={fetchData} variant='outline' size='sm'>
            <RefreshCw className='h-4 w-4 mr-2' />
            Refresh
          </Button>
          <Button onClick={resetMetrics} variant='outline' size='sm'>
            Reset Metrics
          </Button>
        </div>
      </div>

      {/* Health Status */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Redis Status</CardTitle>
            {health.redis ? (
              <CheckCircle className='h-4 w-4 text-green-500' />
            ) : (
              <AlertTriangle className='h-4 w-4 text-red-500' />
            )}
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {health.redis ? 'Connected' : 'Disconnected'}
            </div>
            <p className='text-xs text-muted-foreground'>
              {health.redis ? 'Redis is operational' : 'Using fallback storage'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Fallback Status
            </CardTitle>
            {health.fallback ? (
              <CheckCircle className='h-4 w-4 text-green-500' />
            ) : (
              <AlertTriangle className='h-4 w-4 text-red-500' />
            )}
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {health.fallback ? 'Available' : 'Unavailable'}
            </div>
            <p className='text-xs text-muted-foreground'>
              In-memory fallback storage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Requests
            </CardTitle>
            <Activity className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatNumber(analytics.totalRequests)}
            </div>
            <p className='text-xs text-muted-foreground'>Since last reset</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Blocked Requests
            </CardTitle>
            <Shield className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatNumber(analytics.blockedRequests)}
            </div>
            <p className='text-xs text-muted-foreground'>
              {formatPercentage(analytics.blockRate)} block rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Fallback Usage
            </CardTitle>
            <Database className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatPercentage(analytics.fallbackRate)}
            </div>
            <p className='text-xs text-muted-foreground'>
              Using in-memory storage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Time Window</CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-sm font-bold'>
              {formatTime(analytics.timeWindow.start)}
            </div>
            <p className='text-xs text-muted-foreground'>
              to {formatTime(analytics.timeWindow.end)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Block Rate Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Block Rate</CardTitle>
          <CardDescription>
            Percentage of requests blocked by rate limiting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Block Rate</span>
              <span>{formatPercentage(analytics.blockRate)}</span>
            </div>
            <Progress value={analytics.blockRate} className='h-2' />
            <div className='flex justify-between text-xs text-muted-foreground'>
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Blocked Types */}
      <Card>
        <CardHeader>
          <CardTitle>Top Blocked Rate Limit Types</CardTitle>
          <CardDescription>
            Rate limit types with the most blocked requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {analytics.topBlockedTypes.map(({ type, hits }, index) => (
              <div key={type} className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <Badge variant='outline'>{type}</Badge>
                  <span className='text-sm text-muted-foreground'>
                    {formatNumber(hits)} blocks
                  </span>
                </div>
                <div className='text-sm font-medium'>
                  {formatPercentage((hits / analytics.blockedRequests) * 100)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rate Limit Hits by Type */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Limit Hits by Type</CardTitle>
          <CardDescription>
            Detailed breakdown of blocked requests by rate limit type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {Object.entries(analytics.rateLimitHits).map(([type, hits]) => (
              <div key={type} className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <Badge variant='secondary'>{type}</Badge>
                </div>
                <div className='text-sm font-medium'>
                  {formatNumber(hits)} hits
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
