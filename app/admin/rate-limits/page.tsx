import { AdvancedMonitoringDashboard } from '@/components/admin/advanced-monitoring-dashboard';
import { RateLimitDashboard } from '@/components/admin/rate-limit-dashboard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, Shield } from 'lucide-react';

export default function AdminRateLimitsPage() {
  return (
    <div className='container mx-auto p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center space-x-2'>
        <Shield className='h-6 w-6' />
        <h1 className='text-3xl font-bold'>Rate Limit Management</h1>
      </div>

      {/* Admin Access Warning */}
      <Alert>
        <AlertTriangle className='h-4 w-4' />
        <AlertDescription>
          This page is restricted to administrators only. Rate limit data is
          sensitive and should be handled with care.
        </AlertDescription>
      </Alert>

      {/* Advanced Monitoring Dashboard */}
      <AdvancedMonitoringDashboard />

      {/* Basic Rate Limit Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Rate Limit Analytics</CardTitle>
          <CardDescription>
            Simple overview of rate limiting metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RateLimitDashboard />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-sm'>Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              View and modify rate limit configurations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-sm'>Health Check</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              Check Redis and fallback system health
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-sm'>Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              Access setup and configuration guides
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
