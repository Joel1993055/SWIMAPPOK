'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Database,
  RefreshCw,
  Shield,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DetailedMetrics {
  totalRequests: number;
  blockedRequests: number;
  allowedRequests: number;
  blockRate: number;
  rateLimitHits: Record<string, number>;
  rateLimitSuccess: Record<string, number>;
  rateLimitBlocked: Record<string, number>;
  fallbackUsage: number;
  fallbackRequests: number;
  redisRequests: number;
  redisConnected: boolean;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorCount: number;
  errorRate: number;
  memoryUsage: number;
  memoryUsagePercent: number;
  maxMemoryUsage: number;
  requestsPerMinute: number;
  requestsPerHour: number;
  peakRequestsPerMinute: number;
  peakRequestsPerHour: number;
  topBlockedIPs: Array<{ ip: string; count: number }>;
  topRequestedIPs: Array<{ ip: string; count: number }>;
  timeWindow: {
    start: number;
    end: number;
    duration: number;
  };
  health: {
    redis: boolean;
    fallback: boolean;
    memory: 'healthy' | 'warning' | 'critical';
    overall: 'healthy' | 'warning' | 'critical';
  };
}

interface TimeSeriesData {
  timestamp: number;
  requests: number;
  blocked: number;
  blockRate: number;
  fallbackRate: number;
  memoryUsage: number;
}

interface AlertData {
  id: string;
  configId: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  resolved: boolean;
  resolvedAt?: number;
  data: Record<string, any>;
}

export function AdvancedMonitoringDashboard() {
  const [metrics, setMetrics] = useState<DetailedMetrics | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

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
        throw new Error('Failed to fetch monitoring data');
      }

      const data = await response.json();
      setMetrics(data.metrics);
      setTimeSeriesData(data.timeSeries || []);
      setAlerts(data.alerts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (autoRefresh) {
      const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(2)}%`;
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
    return `${(ms / 3600000).toFixed(1)}h`;
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Chart data for requests over time
  const requestsChartData = {
    labels: timeSeriesData.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Total Requests',
        data: timeSeriesData.map(d => d.requests),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Blocked Requests',
        data: timeSeriesData.map(d => d.blocked),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1,
      },
    ],
  };

  // Chart data for rate limit types
  const rateLimitTypesData = {
    labels: Object.keys(metrics?.rateLimitHits || {}),
    datasets: [
      {
        label: 'Success',
        data: Object.values(metrics?.rateLimitSuccess || {}),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
      {
        label: 'Blocked',
        data: Object.values(metrics?.rateLimitBlocked || {}),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
    ],
  };

  // Chart data for memory usage
  const memoryChartData = {
    labels: timeSeriesData.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Memory Usage',
        data: timeSeriesData.map(d => d.memoryUsage / (1024 * 1024)), // Convert to MB
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.1,
      },
    ],
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <RefreshCw className='h-6 w-6 animate-spin' />
        <span className='ml-2'>Loading monitoring data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className='h-4 w-4' />
        <AlertDescription>
          Error loading monitoring data: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!metrics) {
    return (
      <Alert>
        <AlertTriangle className='h-4 w-4' />
        <AlertDescription>No monitoring data available</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Advanced Rate Limit Monitoring</h2>
          <p className='text-muted-foreground'>
            Comprehensive monitoring and analytics for rate limiting
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            onClick={fetchData}
            variant='outline'
            size='sm'
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? 'default' : 'outline'}
            size='sm'
          >
            Auto Refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>
        </div>
      </div>

      {/* Health Status */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Overall Health
            </CardTitle>
            <div
              className={`h-2 w-2 rounded-full ${
                metrics.health.overall === 'healthy'
                  ? 'bg-green-500'
                  : metrics.health.overall === 'warning'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getHealthColor(metrics.health.overall)}`}
            >
              {metrics.health.overall.toUpperCase()}
            </div>
            <p className='text-xs text-muted-foreground'>System status</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Redis Status</CardTitle>
            {metrics.redisConnected ? (
              <CheckCircle className='h-4 w-4 text-green-500' />
            ) : (
              <AlertCircle className='h-4 w-4 text-red-500' />
            )}
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {metrics.redisConnected ? 'Connected' : 'Disconnected'}
            </div>
            <p className='text-xs text-muted-foreground'>
              {metrics.redisRequests} requests via Redis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Memory Status</CardTitle>
            <div
              className={`h-2 w-2 rounded-full ${
                metrics.health.memory === 'healthy'
                  ? 'bg-green-500'
                  : metrics.health.memory === 'warning'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatBytes(metrics.memoryUsage)}
            </div>
            <p className='text-xs text-muted-foreground'>
              {formatPercentage(metrics.memoryUsagePercent)} of max
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Error Rate</CardTitle>
            <AlertTriangle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatPercentage(metrics.errorRate)}
            </div>
            <p className='text-xs text-muted-foreground'>
              {formatNumber(metrics.errorCount)} errors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Metrics */}
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
              {formatNumber(metrics.totalRequests)}
            </div>
            <p className='text-xs text-muted-foreground'>
              {formatNumber(metrics.requestsPerMinute)}/min
            </p>
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
              {formatNumber(metrics.blockedRequests)}
            </div>
            <p className='text-xs text-muted-foreground'>
              {formatPercentage(metrics.blockRate)} block rate
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
              {formatPercentage(metrics.fallbackUsage)}
            </div>
            <p className='text-xs text-muted-foreground'>
              {formatNumber(metrics.fallbackRequests)} requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Response Time</CardTitle>
            <Zap className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatDuration(metrics.averageResponseTime)}
            </div>
            <p className='text-xs text-muted-foreground'>
              P95: {formatDuration(metrics.p95ResponseTime)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <Tabs defaultValue='overview' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='performance'>Performance</TabsTrigger>
          <TabsTrigger value='alerts'>Alerts</TabsTrigger>
          <TabsTrigger value='ips'>IP Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-4'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <Card>
              <CardHeader>
                <CardTitle>Requests Over Time</CardTitle>
                <CardDescription>
                  Request volume and blocking patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-64'>
                  <Line
                    data={requestsChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rate Limit Types</CardTitle>
                <CardDescription>Success vs blocked by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-64'>
                  <Bar
                    data={rateLimitTypesData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='performance' className='space-y-4'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <Card>
              <CardHeader>
                <CardTitle>Memory Usage</CardTitle>
                <CardDescription>Memory consumption over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-64'>
                  <Line
                    data={memoryChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Memory (MB)',
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Response time and throughput</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>Average Response Time</span>
                    <span className='font-medium'>
                      {formatDuration(metrics.averageResponseTime)}
                    </span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span>P95 Response Time</span>
                    <span className='font-medium'>
                      {formatDuration(metrics.p95ResponseTime)}
                    </span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span>P99 Response Time</span>
                    <span className='font-medium'>
                      {formatDuration(metrics.p99ResponseTime)}
                    </span>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>Peak Requests/Min</span>
                    <span className='font-medium'>
                      {formatNumber(metrics.peakRequestsPerMinute)}
                    </span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span>Peak Requests/Hour</span>
                    <span className='font-medium'>
                      {formatNumber(metrics.peakRequestsPerHour)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='alerts' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>
                Current system alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className='text-center py-8 text-muted-foreground'>
                  No active alerts
                </div>
              ) : (
                <div className='space-y-4'>
                  {alerts.map(alert => (
                    <div
                      key={alert.id}
                      className='flex items-center justify-between p-4 border rounded-lg'
                    >
                      <div className='space-y-1'>
                        <div className='flex items-center gap-2'>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className='font-medium'>{alert.message}</span>
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className='text-right'>
                        <Button size='sm' variant='outline'>
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='ips' className='space-y-4'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <Card>
              <CardHeader>
                <CardTitle>Top Requested IPs</CardTitle>
                <CardDescription>
                  IPs with highest request volume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {metrics.topRequestedIPs.map(({ ip, count }, index) => (
                    <div key={ip} className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-medium'>
                          #{index + 1}
                        </span>
                        <span className='text-sm font-mono'>{ip}</span>
                      </div>
                      <span className='text-sm text-muted-foreground'>
                        {formatNumber(count)} requests
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Blocked IPs</CardTitle>
                <CardDescription>IPs with highest block count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {metrics.topBlockedIPs.map(({ ip, count }, index) => (
                    <div key={ip} className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-medium'>
                          #{index + 1}
                        </span>
                        <span className='text-sm font-mono'>{ip}</span>
                      </div>
                      <span className='text-sm text-muted-foreground'>
                        {formatNumber(count)} blocks
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
