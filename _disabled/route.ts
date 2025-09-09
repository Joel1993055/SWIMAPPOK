import { alertManager, checkAndTriggerAlerts } from '@/lib/monitoring/alerts';
import { metricsCollector } from '@/lib/monitoring/metrics';
import {
  checkRateLimitHealth,
  getRateLimitAnalytics,
} from '@/lib/rate-limit-enhanced';
import { NextRequest, NextResponse } from 'next/server';

// =====================================================
// RATE LIMIT ANALYTICS API
// =====================================================

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin (you can implement your own admin check)
    const isAdmin = await checkAdminAccess(request);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const analytics = getRateLimitAnalytics();
    const health = await checkRateLimitHealth();
    const detailedMetrics = metricsCollector.getMetrics();
    const timeSeriesData = metricsCollector.getTimeSeriesData();
    const alerts = alertManager.getActiveAlerts();

    // Check and trigger new alerts
    const newAlerts = await checkAndTriggerAlerts({
      blockRate: detailedMetrics.blockRate,
      fallbackRate: detailedMetrics.fallbackUsage,
      redisConnected: detailedMetrics.redisConnected,
      memoryUsage: detailedMetrics.memoryUsagePercent,
      errorCount: detailedMetrics.errorCount,
    });

    return NextResponse.json({
      analytics,
      health,
      metrics: detailedMetrics,
      timeSeries: timeSeriesData,
      alerts: [...alerts, ...newAlerts],
      alertMetrics: alertManager.getMetrics(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Rate limit analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =====================================================
// RESET RATE LIMIT METRICS
// =====================================================

export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess(request);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Reset metrics
    const { rateLimitMonitor } = await import('@/lib/rate-limit-enhanced');
    rateLimitMonitor.resetMetrics();

    return NextResponse.json({
      message: 'Rate limit metrics reset successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Rate limit reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =====================================================
// ADMIN ACCESS CHECK
// =====================================================

async function checkAdminAccess(request: NextRequest): Promise<boolean> {
  // Implement your admin access check here
  // This could be based on JWT tokens, session data, etc.

  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;

  // Example: Check for admin token
  const token = authHeader.replace('Bearer ', '');
  return token === process.env.ADMIN_API_TOKEN;
}
