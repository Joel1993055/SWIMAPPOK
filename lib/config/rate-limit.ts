// =====================================================
// RATE LIMIT CONFIGURATION
// =====================================================

export interface RateLimitConfig {
  // Redis Configuration
  redis: {
    url: string;
    token: string;
    enabled: boolean;
  };

  // Rate Limit Settings
  limits: {
    api: { requests: number; window: string };
    auth: { requests: number; window: string };
    public: { requests: number; window: string };
    upload: { requests: number; window: string };
    admin: { requests: number; window: string };
    websocket: { requests: number; window: string };
  };

  // Monitoring
  monitoring: {
    enabled: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    metricsRetention: number; // in hours
  };

  // Fallback
  fallback: {
    enabled: boolean;
    maxMemoryUsage: number; // in MB
  };
}

// =====================================================
// DEFAULT CONFIGURATION
// =====================================================

export const defaultRateLimitConfig: RateLimitConfig = {
  redis: {
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    enabled: !!process.env.UPSTASH_REDIS_REST_URL,
  },

  limits: {
    api: { requests: 100, window: '1m' },
    auth: { requests: 10, window: '1m' },
    public: { requests: 200, window: '1m' },
    upload: { requests: 5, window: '1m' },
    admin: { requests: 20, window: '1m' },
    websocket: { requests: 10, window: '1m' },
  },

  monitoring: {
    enabled: process.env.NODE_ENV === 'production',
    logLevel: (process.env.RATE_LIMIT_LOG_LEVEL as any) || 'info',
    metricsRetention: 24,
  },

  fallback: {
    enabled: true,
    maxMemoryUsage: 100, // 100MB
  },
};

// =====================================================
// CONFIGURATION VALIDATION
// =====================================================

export function validateRateLimitConfig(config: RateLimitConfig): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate Redis configuration
  if (config.redis.enabled) {
    if (!config.redis.url) {
      errors.push('Redis URL is required when Redis is enabled');
    }

    if (!config.redis.token) {
      errors.push('Redis token is required when Redis is enabled');
    }

    // Validate URL format
    if (config.redis.url && !isValidUrl(config.redis.url)) {
      errors.push('Invalid Redis URL format');
    }
  }

  // Validate rate limits
  Object.entries(config.limits).forEach(([type, limit]) => {
    if (limit.requests <= 0) {
      errors.push(`Rate limit for ${type} must be greater than 0`);
    }

    if (limit.requests > 10000) {
      warnings.push(`Rate limit for ${type} is very high (${limit.requests})`);
    }

    if (!isValidTimeWindow(limit.window)) {
      errors.push(`Invalid time window for ${type}: ${limit.window}`);
    }
  });

  // Validate monitoring configuration
  if (config.monitoring.enabled) {
    if (
      !['debug', 'info', 'warn', 'error'].includes(config.monitoring.logLevel)
    ) {
      errors.push('Invalid log level');
    }

    if (config.monitoring.metricsRetention <= 0) {
      errors.push('Metrics retention must be greater than 0');
    }
  }

  // Validate fallback configuration
  if (config.fallback.enabled) {
    if (config.fallback.maxMemoryUsage <= 0) {
      errors.push('Max memory usage must be greater than 0');
    }

    if (config.fallback.maxMemoryUsage > 1000) {
      warnings.push('Max memory usage is very high (consider using Redis)');
    }
  }

  // Production warnings
  if (process.env.NODE_ENV === 'production') {
    if (!config.redis.enabled) {
      warnings.push(
        'Running in production without Redis - using fallback only'
      );
    }

    if (config.monitoring.logLevel === 'debug') {
      warnings.push('Debug logging enabled in production');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidTimeWindow(window: string): boolean {
  const timeWindowRegex = /^\d+[smhd]$/;
  return timeWindowRegex.test(window);
}

// =====================================================
// CONFIGURATION LOADER
// =====================================================

export function loadRateLimitConfig(): RateLimitConfig {
  const config = { ...defaultRateLimitConfig };

  // Override with environment variables
  if (process.env.RATE_LIMIT_API_REQUESTS) {
    config.limits.api.requests = parseInt(process.env.RATE_LIMIT_API_REQUESTS);
  }

  if (process.env.RATE_LIMIT_AUTH_REQUESTS) {
    config.limits.auth.requests = parseInt(
      process.env.RATE_LIMIT_AUTH_REQUESTS
    );
  }

  if (process.env.RATE_LIMIT_PUBLIC_REQUESTS) {
    config.limits.public.requests = parseInt(
      process.env.RATE_LIMIT_PUBLIC_REQUESTS
    );
  }

  if (process.env.RATE_LIMIT_UPLOAD_REQUESTS) {
    config.limits.upload.requests = parseInt(
      process.env.RATE_LIMIT_UPLOAD_REQUESTS
    );
  }

  if (process.env.RATE_LIMIT_ADMIN_REQUESTS) {
    config.limits.admin.requests = parseInt(
      process.env.RATE_LIMIT_ADMIN_REQUESTS
    );
  }

  if (process.env.RATE_LIMIT_WEBSOCKET_REQUESTS) {
    config.limits.websocket.requests = parseInt(
      process.env.RATE_LIMIT_WEBSOCKET_REQUESTS
    );
  }

  if (process.env.RATE_LIMIT_LOG_LEVEL) {
    config.monitoring.logLevel = process.env.RATE_LIMIT_LOG_LEVEL as any;
  }

  if (process.env.RATE_LIMIT_METRICS_RETENTION) {
    config.monitoring.metricsRetention = parseInt(
      process.env.RATE_LIMIT_METRICS_RETENTION
    );
  }

  if (process.env.RATE_LIMIT_FALLBACK_MAX_MEMORY) {
    config.fallback.maxMemoryUsage = parseInt(
      process.env.RATE_LIMIT_FALLBACK_MAX_MEMORY
    );
  }

  return config;
}

// =====================================================
// CONFIGURATION HEALTH CHECK
// =====================================================

export async function checkRateLimitConfigHealth(): Promise<{
  config: RateLimitConfig;
  validation: ReturnType<typeof validateRateLimitConfig>;
  redis: boolean;
  fallback: boolean;
}> {
  const config = loadRateLimitConfig();
  const validation = validateRateLimitConfig(config);

  // Check Redis connectivity
  let redis = false;
  if (config.redis.enabled) {
    try {
      const { Redis } = await import('@upstash/redis');
      const redisClient = new Redis({
        url: config.redis.url,
        token: config.redis.token,
      });
      await redisClient.ping();
      redis = true;
    } catch (error) {
      console.error('Redis health check failed:', error);
    }
  }

  // Fallback is always available (in-memory)
  const fallback = config.fallback.enabled;

  return {
    config,
    validation,
    redis,
    fallback,
  };
}
