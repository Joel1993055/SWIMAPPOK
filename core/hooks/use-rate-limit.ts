import { useCallback, useState } from 'react';

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

interface RateLimitError {
  error: string;
  message: string;
  retryAfter: number;
}

export function useRateLimit() {
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(
    null
  );
  const [isRateLimited, setIsRateLimited] = useState(false);

  const checkRateLimit = useCallback(
    async (url: string, options?: RequestInit) => {
      try {
        const response = await fetch(url, options);

        // Extract rate limit headers
        const limit = response.headers.get('X-RateLimit-Limit');
        const remaining = response.headers.get('X-RateLimit-Remaining');
        const reset = response.headers.get('X-RateLimit-Reset');

        if (limit && remaining && reset) {
          setRateLimitInfo({
            limit: parseInt(limit),
            remaining: parseInt(remaining),
            reset: parseInt(reset),
          });
        }

        if (response.status === 429) {
          const errorData: RateLimitError = await response.json();
          setIsRateLimited(true);

          // Auto-reset after retry time
          setTimeout(() => {
            setIsRateLimited(false);
          }, errorData.retryAfter * 1000);

          throw new Error(
            `Rate limit exceeded. Try again in ${errorData.retryAfter} seconds.`
          );
        }

        return response;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('Rate limit exceeded')
        ) {
          throw error;
        }
        throw new Error('Network error occurred');
      }
    },
    []
  );

  const getRetryAfter = useCallback(() => {
    if (!rateLimitInfo) return 0;
    return Math.max(0, Math.ceil((rateLimitInfo.reset - Date.now()) / 1000));
  }, [rateLimitInfo]);

  const getRemainingRequests = useCallback(() => {
    return rateLimitInfo?.remaining || 0;
  }, [rateLimitInfo]);

  const getLimitPercentage = useCallback(() => {
    if (!rateLimitInfo) return 0;
    return (
      ((rateLimitInfo.limit - rateLimitInfo.remaining) / rateLimitInfo.limit) *
      100
    );
  }, [rateLimitInfo]);

  return {
    rateLimitInfo,
    isRateLimited,
    checkRateLimit,
    getRetryAfter,
    getRemainingRequests,
    getLimitPercentage,
  };
}
