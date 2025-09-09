import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create Redis instance
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limit configurations
export const rateLimits = {
  // General API rate limit
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
    analytics: true,
    prefix: 'ratelimit:api',
  }),

  // Auth endpoints (more restrictive)
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
    analytics: true,
    prefix: 'ratelimit:auth',
  }),

  // Public endpoints (less restrictive)
  public: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(200, '1 m'), // 200 requests per minute
    analytics: true,
    prefix: 'ratelimit:public',
  }),

  // Upload endpoints (very restrictive)
  upload: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
    analytics: true,
    prefix: 'ratelimit:upload',
  }),
};

// Helper function to get client IP
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();

  return 'unknown';
}

// Helper function to determine rate limit type based on path
export function getRateLimitType(pathname: string): keyof typeof rateLimits {
  if (pathname.startsWith('/api/auth')) return 'auth';
  if (pathname.startsWith('/api/upload')) return 'upload';
  if (pathname.startsWith('/api/public')) return 'public';
  if (pathname.startsWith('/api/')) return 'api';

  return 'public';
}

// Rate limit check function
export async function checkRateLimit(
  request: Request,
  type?: keyof typeof rateLimits
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const clientIP = getClientIP(request);
  const rateLimitType = type || getRateLimitType(new URL(request.url).pathname);
  const ratelimit = rateLimits[rateLimitType];

  const { success, limit, remaining, reset } = await ratelimit.limit(clientIP);

  return { success, limit, remaining, reset };
}
