import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// =====================================================
// REDIS CONFIGURATION
// =====================================================

// Production Redis configuration with fallback
const createRedisInstance = () => {
  try {
    return new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  } catch (error) {
    console.error('Failed to create Redis instance:', error);
    return null;
  }
};

// Fallback in-memory store for when Redis is unavailable
class InMemoryStore {
  private store = new Map<string, { count: number; resetTime: number }>();

  async get(key: string) {
    const item = this.store.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() > item.resetTime) {
      this.store.delete(key);
      return null;
    }

    return item.count;
  }

  async set(key: string, value: number, ttl: number) {
    this.store.set(key, {
      count: value,
      resetTime: Date.now() + ttl * 1000,
    });
  }

  async incr(key: string) {
    const current = (await this.get(key)) || 0;
    await this.set(key, current + 1, 60); // 1 minute TTL
    return current + 1;
  }
}

const inMemoryStore = new InMemoryStore();

// =====================================================
// RATE LIMIT CONFIGURATIONS
// =====================================================

export const rateLimits = {
  // General API rate limit
  api: new Ratelimit({
    redis: createRedisInstance()!,
    limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
    analytics: true,
    prefix: 'ratelimit:api',
    // Fallback to in-memory store
    fallback: async (key: string) => {
      const count = await inMemoryStore.incr(key);
      return {
        success: count <= 100,
        limit: 100,
        remaining: Math.max(0, 100 - count),
        reset: Date.now() + 60000,
      };
    },
  }),

  // Auth endpoints (more restrictive)
  auth: new Ratelimit({
    redis: createRedisInstance()!,
    limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
    analytics: true,
    prefix: 'ratelimit:auth',
    fallback: async (key: string) => {
      const count = await inMemoryStore.incr(key);
      return {
        success: count <= 10,
        limit: 10,
        remaining: Math.max(0, 10 - count),
        reset: Date.now() + 60000,
      };
    },
  }),

  // Public endpoints (less restrictive)
  public: new Ratelimit({
    redis: createRedisInstance()!,
    limiter: Ratelimit.slidingWindow(200, '1 m'), // 200 requests per minute
    analytics: true,
    prefix: 'ratelimit:public',
    fallback: async (key: string) => {
      const count = await inMemoryStore.incr(key);
      return {
        success: count <= 200,
        limit: 200,
        remaining: Math.max(0, 200 - count),
        reset: Date.now() + 60000,
      };
    },
  }),

  // Upload endpoints (very restrictive)
  upload: new Ratelimit({
    redis: createRedisInstance()!,
    limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
    analytics: true,
    prefix: 'ratelimit:upload',
    fallback: async (key: string) => {
      const count = await inMemoryStore.incr(key);
      return {
        success: count <= 5,
        limit: 5,
        remaining: Math.max(0, 5 - count),
        reset: Date.now() + 60000,
      };
    },
  }),

  // Admin endpoints (very restrictive)
  admin: new Ratelimit({
    redis: createRedisInstance()!,
    limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 requests per minute
    analytics: true,
    prefix: 'ratelimit:admin',
    fallback: async (key: string) => {
      const count = await inMemoryStore.incr(key);
      return {
        success: count <= 20,
        limit: 20,
        remaining: Math.max(0, 20 - count),
        reset: Date.now() + 60000,
      };
    },
  }),

  // WebSocket connections
  websocket: new Ratelimit({
    redis: createRedisInstance()!,
    limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 connections per minute
    analytics: true,
    prefix: 'ratelimit:websocket',
    fallback: async (key: string) => {
      const count = await inMemoryStore.incr(key);
      return {
        success: count <= 10,
        limit: 10,
        remaining: Math.max(0, 10 - count),
        reset: Date.now() + 60000,
      };
    },
  }),
};

// =====================================================
// RATE LIMIT MONITORING
// =====================================================

interface RateLimitMetrics {
  totalRequests: number;
  blockedRequests: number;
  rateLimitHits: Record<string, number>;
  fallbackUsage: number;
  lastReset: number;
}

class RateLimitMonitor {
  private metrics: RateLimitMetrics = {
    totalRequests: 0,
    blockedRequests: 0,
    rateLimitHits: {},
    fallbackUsage: 0,
    lastReset: Date.now(),
  };

  recordRequest(type: string, success: boolean, usedFallback: boolean = false) {
    this.metrics.totalRequests++;

    if (!success) {
      this.metrics.blockedRequests++;
      this.metrics.rateLimitHits[type] =
        (this.metrics.rateLimitHits[type] || 0) + 1;
    }

    if (usedFallback) {
      this.metrics.fallbackUsage++;
    }
  }

  getMetrics(): RateLimitMetrics {
    return { ...this.metrics };
  }

  resetMetrics() {
    this.metrics = {
      totalRequests: 0,
      blockedRequests: 0,
      rateLimitHits: {},
      fallbackUsage: 0,
      lastReset: Date.now(),
    };
  }

  getBlockRate(): number {
    if (this.metrics.totalRequests === 0) return 0;
    return (this.metrics.blockedRequests / this.metrics.totalRequests) * 100;
  }

  getFallbackRate(): number {
    if (this.metrics.totalRequests === 0) return 0;
    return (this.metrics.fallbackUsage / this.metrics.totalRequests) * 100;
  }
}

export const rateLimitMonitor = new RateLimitMonitor();

// =====================================================
// HELPER FUNCTIONS
// =====================================================

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
  if (pathname.startsWith('/api/admin')) return 'admin';
  if (pathname.startsWith('/api/auth')) return 'auth';
  if (pathname.startsWith('/api/upload')) return 'upload';
  if (pathname.startsWith('/api/ws')) return 'websocket';
  if (pathname.startsWith('/api/public')) return 'public';
  if (pathname.startsWith('/api/')) return 'api';

  return 'public';
}

// Enhanced rate limit check function with monitoring
export async function checkRateLimit(
  request: Request,
  type?: keyof typeof rateLimits
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  usedFallback: boolean;
  type: string;
}> {
  const clientIP = getClientIP(request);
  const rateLimitType = type || getRateLimitType(new URL(request.url).pathname);
  const ratelimit = rateLimits[rateLimitType];

  let usedFallback = false;

  try {
    const { success, limit, remaining, reset } =
      await ratelimit.limit(clientIP);

    // Record metrics
    rateLimitMonitor.recordRequest(rateLimitType, success, usedFallback);

    return {
      success,
      limit,
      remaining,
      reset,
      usedFallback,
      type: rateLimitType,
    };
  } catch (error) {
    console.error(`Rate limiting error for ${rateLimitType}:`, error);

    // Use fallback
    usedFallback = true;
    const fallbackResult = (await ratelimit.fallback?.(clientIP)) || {
      success: true, // Allow request if fallback fails
      limit: 100,
      remaining: 99,
      reset: Date.now() + 60000,
    };

    // Record metrics
    rateLimitMonitor.recordRequest(
      rateLimitType,
      fallbackResult.success,
      usedFallback
    );

    return {
      ...fallbackResult,
      usedFallback,
      type: rateLimitType,
    };
  }
}

// =====================================================
// RATE LIMIT ANALYTICS
// =====================================================

export interface RateLimitAnalytics {
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

export function getRateLimitAnalytics(): RateLimitAnalytics {
  const metrics = rateLimitMonitor.getMetrics();

  return {
    totalRequests: metrics.totalRequests,
    blockedRequests: metrics.blockedRequests,
    blockRate: rateLimitMonitor.getBlockRate(),
    fallbackRate: rateLimitMonitor.getFallbackRate(),
    rateLimitHits: metrics.rateLimitHits,
    topBlockedTypes: Object.entries(metrics.rateLimitHits)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([type, hits]) => ({ type, hits })),
    timeWindow: {
      start: metrics.lastReset,
      end: Date.now(),
    },
  };
}

// =====================================================
// RATE LIMIT HEALTH CHECK
// =====================================================

export async function checkRateLimitHealth(): Promise<{
  redis: boolean;
  fallback: boolean;
  metrics: RateLimitAnalytics;
}> {
  const redis = createRedisInstance();
  let redisHealthy = false;

  if (redis) {
    try {
      await redis.ping();
      redisHealthy = true;
    } catch (error) {
      console.error('Redis health check failed:', error);
    }
  }

  return {
    redis: redisHealthy,
    fallback: true, // In-memory fallback is always available
    metrics: getRateLimitAnalytics(),
  };
}

// =====================================================
// RATE LIMIT CONFIGURATION VALIDATION
// =====================================================

export function validateRateLimitConfig(): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required environment variables
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    errors.push('UPSTASH_REDIS_REST_URL is not set');
  }

  if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
    errors.push('UPSTASH_REDIS_REST_TOKEN is not set');
  }

  // Check rate limit configurations
  Object.entries(rateLimits).forEach(([type, config]) => {
    if (!config.redis && !config.fallback) {
      errors.push(`Rate limit ${type} has no Redis instance and no fallback`);
    }
  });

  // Warnings for production
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      warnings.push(
        'Running in production without Redis - using in-memory fallback only'
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
