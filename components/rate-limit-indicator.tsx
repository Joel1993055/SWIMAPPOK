'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useRateLimit } from '@/lib/hooks/use-rate-limit';
import { AlertCircle, Clock, Zap } from 'lucide-react';

interface RateLimitIndicatorProps {
  className?: string;
}

export function RateLimitIndicator({ className }: RateLimitIndicatorProps) {
  const {
    rateLimitInfo,
    isRateLimited,
    getRetryAfter,
    getRemainingRequests,
    getLimitPercentage,
  } = useRateLimit();

  if (!rateLimitInfo) return null;

  const retryAfter = getRetryAfter();
  const remaining = getRemainingRequests();
  const percentage = getLimitPercentage();

  if (isRateLimited) {
    return (
      <Alert className={`border-destructive ${className}`}>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>
          Rate limit exceeded. Please wait {retryAfter} seconds before trying
          again.
        </AlertDescription>
      </Alert>
    );
  }

  if (percentage > 80) {
    return (
      <Alert className={`border-yellow-500 ${className}`}>
        <Clock className='h-4 w-4' />
        <AlertDescription>
          Approaching rate limit. {remaining} requests remaining.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}
    >
      <Zap className='h-4 w-4' />
      <span>{remaining} requests remaining</span>
      <Progress value={percentage} className='w-20 h-2' />
    </div>
  );
}
