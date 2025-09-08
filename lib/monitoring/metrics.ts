// =====================================================
// RATE LIMIT MONITORING METRICS
// =====================================================

export interface DetailedMetrics {
  // Request metrics
  totalRequests: number;
  blockedRequests: number;
  allowedRequests: number;
  blockRate: number;

  // Rate limit type metrics
  rateLimitHits: Record<string, number>;
  rateLimitSuccess: Record<string, number>;
  rateLimitBlocked: Record<string, number>;

  // Fallback metrics
  fallbackUsage: number;
  fallbackRequests: number;
  redisRequests: number;
  redisConnected: boolean;

  // Performance metrics
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorCount: number;
  errorRate: number;

  // Memory metrics
  memoryUsage: number;
  memoryUsagePercent: number;
  maxMemoryUsage: number;

  // Time-based metrics
  requestsPerMinute: number;
  requestsPerHour: number;
  peakRequestsPerMinute: number;
  peakRequestsPerHour: number;

  // IP-based metrics
  topBlockedIPs: Array<{ ip: string; count: number }>;
  topRequestedIPs: Array<{ ip: string; count: number }>;

  // Time window
  timeWindow: {
    start: number;
    end: number;
    duration: number;
  };

  // Health status
  health: {
    redis: boolean;
    fallback: boolean;
    memory: 'healthy' | 'warning' | 'critical';
    overall: 'healthy' | 'warning' | 'critical';
  };
}

export interface TimeSeriesData {
  timestamp: number;
  requests: number;
  blocked: number;
  blockRate: number;
  fallbackRate: number;
  memoryUsage: number;
}

export interface MetricsConfig {
  retentionDays: number;
  aggregationInterval: number; // in minutes
  maxDataPoints: number;
  enableTimeSeries: boolean;
  enableIPTracking: boolean;
  enablePerformanceTracking: boolean;
}

// =====================================================
// METRICS COLLECTOR
// =====================================================

class MetricsCollector {
  private metrics: DetailedMetrics;
  private timeSeriesData: TimeSeriesData[] = [];
  private ipCounts: Map<string, number> = new Map();
  private blockedIPs: Map<string, number> = new Map();
  private responseTimes: number[] = [];
  private errors: Array<{ timestamp: number; error: string; type: string }> =
    [];
  private config: MetricsConfig;

  constructor(config: MetricsConfig) {
    this.config = config;
    this.metrics = this.initializeMetrics();
  }

  private initializeMetrics(): DetailedMetrics {
    return {
      totalRequests: 0,
      blockedRequests: 0,
      allowedRequests: 0,
      blockRate: 0,
      rateLimitHits: {},
      rateLimitSuccess: {},
      rateLimitBlocked: {},
      fallbackUsage: 0,
      fallbackRequests: 0,
      redisRequests: 0,
      redisConnected: true,
      averageResponseTime: 0,
      p95ResponseTime: 0,
      p99ResponseTime: 0,
      errorCount: 0,
      errorRate: 0,
      memoryUsage: 0,
      memoryUsagePercent: 0,
      maxMemoryUsage: 100 * 1024 * 1024, // 100MB default
      requestsPerMinute: 0,
      requestsPerHour: 0,
      peakRequestsPerMinute: 0,
      peakRequestsPerHour: 0,
      topBlockedIPs: [],
      topRequestedIPs: [],
      timeWindow: {
        start: Date.now(),
        end: Date.now(),
        duration: 0,
      },
      health: {
        redis: true,
        fallback: true,
        memory: 'healthy',
        overall: 'healthy',
      },
    };
  }

  // Record a request
  recordRequest(
    type: string,
    blocked: boolean,
    usedFallback: boolean,
    responseTime: number,
    clientIP: string
  ): void {
    const now = Date.now();

    // Update basic metrics
    this.metrics.totalRequests++;
    if (blocked) {
      this.metrics.blockedRequests++;
    } else {
      this.metrics.allowedRequests++;
    }

    // Update rate limit type metrics
    this.metrics.rateLimitHits[type] =
      (this.metrics.rateLimitHits[type] || 0) + 1;
    if (blocked) {
      this.metrics.rateLimitBlocked[type] =
        (this.metrics.rateLimitBlocked[type] || 0) + 1;
    } else {
      this.metrics.rateLimitSuccess[type] =
        (this.metrics.rateLimitSuccess[type] || 0) + 1;
    }

    // Update fallback metrics
    if (usedFallback) {
      this.metrics.fallbackRequests++;
    } else {
      this.metrics.redisRequests++;
    }

    // Update IP tracking
    if (this.config.enableIPTracking) {
      this.ipCounts.set(clientIP, (this.ipCounts.get(clientIP) || 0) + 1);
      if (blocked) {
        this.blockedIPs.set(clientIP, (this.blockedIPs.get(clientIP) || 0) + 1);
      }
    }

    // Update response times
    if (this.config.enablePerformanceTracking) {
      this.responseTimes.push(responseTime);
      if (this.responseTimes.length > 1000) {
        this.responseTimes = this.responseTimes.slice(-1000); // Keep last 1000
      }
    }

    // Update time series data
    if (this.config.enableTimeSeries) {
      this.updateTimeSeriesData(now);
    }

    // Update calculated metrics
    this.updateCalculatedMetrics();
  }

  // Record an error
  recordError(error: string, type: string): void {
    this.errors.push({
      timestamp: Date.now(),
      error,
      type,
    });
    this.metrics.errorCount++;
    this.updateCalculatedMetrics();
  }

  // Update Redis connection status
  updateRedisStatus(connected: boolean): void {
    this.metrics.redisConnected = connected;
    this.metrics.health.redis = connected;
    this.updateOverallHealth();
  }

  // Update memory usage
  updateMemoryUsage(usage: number): void {
    this.metrics.memoryUsage = usage;
    this.metrics.memoryUsagePercent =
      (usage / this.metrics.maxMemoryUsage) * 100;

    // Update memory health
    if (this.metrics.memoryUsagePercent > 90) {
      this.metrics.health.memory = 'critical';
    } else if (this.metrics.memoryUsagePercent > 70) {
      this.metrics.health.memory = 'warning';
    } else {
      this.metrics.health.memory = 'healthy';
    }

    this.updateOverallHealth();
  }

  // Update time series data
  private updateTimeSeriesData(timestamp: number): void {
    const now = Date.now();
    const intervalMs = this.config.aggregationInterval * 60 * 1000;
    const currentInterval = Math.floor(timestamp / intervalMs) * intervalMs;

    // Find or create data point for current interval
    let dataPoint = this.timeSeriesData.find(
      d => d.timestamp === currentInterval
    );
    if (!dataPoint) {
      dataPoint = {
        timestamp: currentInterval,
        requests: 0,
        blocked: 0,
        blockRate: 0,
        fallbackRate: 0,
        memoryUsage: this.metrics.memoryUsage,
      };
      this.timeSeriesData.push(dataPoint);
    }

    // Update data point
    dataPoint.requests++;
    if (this.metrics.blockedRequests > 0) {
      dataPoint.blocked++;
    }
    dataPoint.blockRate =
      dataPoint.requests > 0
        ? (dataPoint.blocked / dataPoint.requests) * 100
        : 0;
    dataPoint.fallbackRate = this.metrics.fallbackUsage;
    dataPoint.memoryUsage = this.metrics.memoryUsage;

    // Clean up old data
    this.cleanupTimeSeriesData();
  }

  // Clean up old time series data
  private cleanupTimeSeriesData(): void {
    const cutoff = Date.now() - this.config.retentionDays * 24 * 60 * 60 * 1000;
    this.timeSeriesData = this.timeSeriesData.filter(d => d.timestamp > cutoff);

    // Limit data points
    if (this.timeSeriesData.length > this.config.maxDataPoints) {
      this.timeSeriesData = this.timeSeriesData.slice(
        -this.config.maxDataPoints
      );
    }
  }

  // Update calculated metrics
  private updateCalculatedMetrics(): void {
    // Block rate
    this.metrics.blockRate =
      this.metrics.totalRequests > 0
        ? (this.metrics.blockedRequests / this.metrics.totalRequests) * 100
        : 0;

    // Fallback usage
    this.metrics.fallbackUsage =
      this.metrics.totalRequests > 0
        ? (this.metrics.fallbackRequests / this.metrics.totalRequests) * 100
        : 0;

    // Error rate
    this.metrics.errorRate =
      this.metrics.totalRequests > 0
        ? (this.metrics.errorCount / this.metrics.totalRequests) * 100
        : 0;

    // Response time metrics
    if (this.responseTimes.length > 0) {
      this.metrics.averageResponseTime =
        this.responseTimes.reduce((a, b) => a + b, 0) /
        this.responseTimes.length;

      const sorted = [...this.responseTimes].sort((a, b) => a - b);
      const p95Index = Math.floor(sorted.length * 0.95);
      const p99Index = Math.floor(sorted.length * 0.99);

      this.metrics.p95ResponseTime = sorted[p95Index] || 0;
      this.metrics.p99ResponseTime = sorted[p99Index] || 0;
    }

    // Requests per minute/hour
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    const oneHourAgo = now - 60 * 60 * 1000;

    this.metrics.requestsPerMinute = this.timeSeriesData
      .filter(d => d.timestamp > oneMinuteAgo)
      .reduce((sum, d) => sum + d.requests, 0);

    this.metrics.requestsPerHour = this.timeSeriesData
      .filter(d => d.timestamp > oneHourAgo)
      .reduce((sum, d) => sum + d.requests, 0);

    // Update peak values
    this.metrics.peakRequestsPerMinute = Math.max(
      this.metrics.peakRequestsPerMinute,
      this.metrics.requestsPerMinute
    );
    this.metrics.peakRequestsPerHour = Math.max(
      this.metrics.peakRequestsPerHour,
      this.metrics.requestsPerHour
    );

    // Update IP metrics
    this.updateIPMetrics();

    // Update time window
    this.metrics.timeWindow.end = now;
    this.metrics.timeWindow.duration = now - this.metrics.timeWindow.start;

    // Update overall health
    this.updateOverallHealth();
  }

  // Update IP metrics
  private updateIPMetrics(): void {
    // Top requested IPs
    this.metrics.topRequestedIPs = Array.from(this.ipCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([ip, count]) => ({ ip, count }));

    // Top blocked IPs
    this.metrics.topBlockedIPs = Array.from(this.blockedIPs.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([ip, count]) => ({ ip, count }));
  }

  // Update overall health
  private updateOverallHealth(): void {
    const { redis, memory } = this.metrics.health;

    if (!redis || memory === 'critical') {
      this.metrics.health.overall = 'critical';
    } else if (memory === 'warning' || this.metrics.blockRate > 20) {
      this.metrics.health.overall = 'warning';
    } else {
      this.metrics.health.overall = 'healthy';
    }
  }

  // Get current metrics
  getMetrics(): DetailedMetrics {
    return { ...this.metrics };
  }

  // Get time series data
  getTimeSeriesData(): TimeSeriesData[] {
    return [...this.timeSeriesData];
  }

  // Get metrics for specific time range
  getMetricsForRange(startTime: number, endTime: number): DetailedMetrics {
    const filteredData = this.timeSeriesData.filter(
      d => d.timestamp >= startTime && d.timestamp <= endTime
    );

    const totalRequests = filteredData.reduce((sum, d) => sum + d.requests, 0);
    const totalBlocked = filteredData.reduce((sum, d) => sum + d.blocked, 0);

    return {
      ...this.metrics,
      totalRequests,
      blockedRequests: totalBlocked,
      allowedRequests: totalRequests - totalBlocked,
      blockRate: totalRequests > 0 ? (totalBlocked / totalRequests) * 100 : 0,
      timeWindow: {
        start: startTime,
        end: endTime,
        duration: endTime - startTime,
      },
    };
  }

  // Reset metrics
  reset(): void {
    this.metrics = this.initializeMetrics();
    this.timeSeriesData = [];
    this.ipCounts.clear();
    this.blockedIPs.clear();
    this.responseTimes = [];
    this.errors = [];
  }

  // Export metrics for external systems
  exportMetrics(): any {
    return {
      metrics: this.getMetrics(),
      timeSeries: this.getTimeSeriesData(),
      config: this.config,
      exportedAt: new Date().toISOString(),
    };
  }
}

// =====================================================
// EXPORT SINGLETON
// =====================================================

const defaultConfig: MetricsConfig = {
  retentionDays: 7,
  aggregationInterval: 5, // 5 minutes
  maxDataPoints: 1000,
  enableTimeSeries: true,
  enableIPTracking: true,
  enablePerformanceTracking: true,
};

export const metricsCollector = new MetricsCollector(defaultConfig);

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
}

export function getHealthStatusColor(status: string): string {
  switch (status) {
    case 'healthy':
      return 'green';
    case 'warning':
      return 'yellow';
    case 'critical':
      return 'red';
    default:
      return 'gray';
  }
}
