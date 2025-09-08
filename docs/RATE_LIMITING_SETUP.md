# 🚦 Rate Limiting Setup & Configuration

## 📋 Overview

This document provides comprehensive guidance for setting up and configuring rate limiting in
production using Upstash Redis with fallback mechanisms, monitoring, and analytics.

## ✅ Success Criteria

- ✅ Rate limiting functional in production
- ✅ Monitoreo implementado
- ✅ Fallbacks configurados
- ✅ Documentación de configuración

## 🏗️ Architecture

### **Components**

- **Redis (Upstash)** - Primary rate limiting storage
- **In-Memory Fallback** - Backup when Redis is unavailable
- **Monitoring Dashboard** - Real-time analytics and metrics
- **API Endpoints** - Health checks and configuration management

### **Rate Limit Types**

- `api` - General API endpoints (100 req/min)
- `auth` - Authentication endpoints (10 req/min)
- `public` - Public endpoints (200 req/min)
- `upload` - File upload endpoints (5 req/min)
- `admin` - Admin endpoints (20 req/min)
- `websocket` - WebSocket connections (10 req/min)

## 🚀 Production Setup

### **1. Upstash Redis Configuration**

#### **Create Upstash Redis Database**

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database
3. Choose your preferred region
4. Select the appropriate plan

#### **Environment Variables**

```bash
# Required
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

# Optional - Rate Limit Configuration
RATE_LIMIT_API_REQUESTS=100
RATE_LIMIT_AUTH_REQUESTS=10
RATE_LIMIT_PUBLIC_REQUESTS=200
RATE_LIMIT_UPLOAD_REQUESTS=5
RATE_LIMIT_ADMIN_REQUESTS=20
RATE_LIMIT_WEBSOCKET_REQUESTS=10

# Optional - Monitoring
RATE_LIMIT_LOG_LEVEL=info
RATE_LIMIT_METRICS_RETENTION=24

# Optional - Fallback
RATE_LIMIT_FALLBACK_MAX_MEMORY=100

# Required - Admin API
ADMIN_API_TOKEN=your-secure-admin-token
NEXT_PUBLIC_ADMIN_API_TOKEN=your-secure-admin-token
```

### **2. Vercel Deployment**

#### **Environment Variables in Vercel**

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add all required environment variables
4. Ensure they're available in Production, Preview, and Development

#### **Vercel Configuration**

```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "UPSTASH_REDIS_REST_URL": "@upstash-redis-rest-url",
    "UPSTASH_REDIS_REST_TOKEN": "@upstash-redis-rest-token"
  }
}
```

## 🔧 Configuration

### **Rate Limit Configuration**

```typescript
// lib/config/rate-limit.ts
export const defaultRateLimitConfig = {
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
    logLevel: 'info',
    metricsRetention: 24,
  },

  fallback: {
    enabled: true,
    maxMemoryUsage: 100,
  },
};
```

### **Custom Rate Limits**

You can customize rate limits by setting environment variables:

```bash
# Custom API rate limit
RATE_LIMIT_API_REQUESTS=150

# Custom auth rate limit
RATE_LIMIT_AUTH_REQUESTS=15

# Custom monitoring settings
RATE_LIMIT_LOG_LEVEL=debug
RATE_LIMIT_METRICS_RETENTION=48
```

## 📊 Monitoring & Analytics

### **Rate Limit Dashboard**

Access the monitoring dashboard at `/admin/rate-limits`:

- **Real-time metrics** - Current request rates and block rates
- **Health status** - Redis and fallback availability
- **Historical data** - Trends and patterns
- **Top blocked types** - Most frequently blocked endpoints

### **API Endpoints**

#### **Get Analytics**

```bash
GET /api/admin/rate-limits
Authorization: Bearer your-admin-token
```

Response:

```json
{
  "analytics": {
    "totalRequests": 1500,
    "blockedRequests": 45,
    "blockRate": 3.0,
    "fallbackRate": 0.0,
    "rateLimitHits": {
      "api": 30,
      "auth": 15
    },
    "topBlockedTypes": [
      { "type": "api", "hits": 30 },
      { "type": "auth", "hits": 15 }
    ],
    "timeWindow": {
      "start": 1640995200000,
      "end": 1641081600000
    }
  },
  "health": {
    "redis": true,
    "fallback": true,
    "metrics": { ... }
  }
}
```

#### **Reset Metrics**

```bash
DELETE /api/admin/rate-limits
Authorization: Bearer your-admin-token
```

### **Health Checks**

#### **Configuration Health**

```typescript
import { checkRateLimitConfigHealth } from '@/lib/config/rate-limit';

const health = await checkRateLimitConfigHealth();
console.log(health);
```

#### **Rate Limit Health**

```typescript
import { checkRateLimitHealth } from '@/lib/rate-limit-enhanced';

const health = await checkRateLimitHealth();
console.log(health);
```

## 🛡️ Fallback Mechanisms

### **In-Memory Fallback**

When Redis is unavailable, the system automatically falls back to in-memory storage:

- **Automatic detection** - Redis connectivity is checked
- **Seamless transition** - No service interruption
- **Memory limits** - Configurable maximum memory usage
- **TTL support** - Automatic expiration of old entries

### **Fallback Configuration**

```typescript
// lib/rate-limit-enhanced.ts
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

  // ... other methods
}
```

## 🔍 Troubleshooting

### **Common Issues**

#### **1. Redis Connection Failed**

```
Error: Redis connection failed
```

**Solution:**

- Check environment variables
- Verify Upstash database is active
- Check network connectivity
- Review Upstash console for errors

#### **2. Rate Limits Not Working**

```
Rate limits not being enforced
```

**Solution:**

- Verify middleware is running
- Check rate limit configuration
- Review request paths and types
- Check fallback is working

#### **3. High Memory Usage**

```
Memory usage too high
```

**Solution:**

- Reduce `RATE_LIMIT_FALLBACK_MAX_MEMORY`
- Enable Redis for production
- Review rate limit windows
- Check for memory leaks

### **Debug Mode**

Enable debug logging:

```bash
RATE_LIMIT_LOG_LEVEL=debug
```

This will log:

- Rate limit checks
- Fallback usage
- Redis connection status
- Configuration validation

### **Monitoring Commands**

#### **Check Redis Status**

```bash
curl -H "Authorization: Bearer your-token" \
  https://your-app.vercel.app/api/admin/rate-limits
```

#### **Test Rate Limits**

```bash
# Test API rate limit
for i in {1..110}; do
  curl https://your-app.vercel.app/api/test
done
```

## 📈 Performance Optimization

### **Redis Optimization**

1. **Connection Pooling** - Reuse Redis connections
2. **Pipeline Operations** - Batch multiple operations
3. **Memory Management** - Monitor Redis memory usage
4. **Region Selection** - Choose closest Upstash region

### **Fallback Optimization**

1. **Memory Limits** - Set appropriate memory limits
2. **TTL Management** - Clean up expired entries
3. **Garbage Collection** - Monitor GC performance
4. **Monitoring** - Track fallback usage

### **Monitoring Optimization**

1. **Batch Metrics** - Collect metrics in batches
2. **Retention Policies** - Set appropriate retention
3. **Alert Thresholds** - Configure meaningful alerts
4. **Dashboard Caching** - Cache dashboard data

## 🚨 Alerting & Notifications

### **Recommended Alerts**

1. **High Block Rate** - > 10% requests blocked
2. **Redis Down** - Redis connection failed
3. **Fallback Usage** - > 50% requests using fallback
4. **Memory Usage** - > 80% fallback memory used

### **Alert Configuration**

```typescript
// Example alert configuration
const alerts = {
  blockRate: {
    threshold: 10,
    action: 'notify_team',
  },
  redisDown: {
    threshold: 1,
    action: 'page_oncall',
  },
  fallbackUsage: {
    threshold: 50,
    action: 'notify_team',
  },
};
```

## 📚 Best Practices

### **Production Deployment**

1. **Always use Redis** - Don't rely on fallback in production
2. **Monitor closely** - Set up comprehensive monitoring
3. **Test fallbacks** - Regularly test fallback mechanisms
4. **Document changes** - Keep configuration documented

### **Rate Limit Design**

1. **Start conservative** - Begin with lower limits
2. **Monitor impact** - Watch for false positives
3. **Adjust gradually** - Increase limits based on usage
4. **Document rationale** - Explain rate limit decisions

### **Security Considerations**

1. **Protect admin endpoints** - Secure rate limit management
2. **Rotate tokens** - Regularly rotate admin tokens
3. **Audit access** - Log admin access to rate limit data
4. **Limit exposure** - Don't expose sensitive metrics

## 🔄 Maintenance

### **Regular Tasks**

1. **Review metrics** - Weekly review of rate limit data
2. **Update limits** - Adjust limits based on usage patterns
3. **Test fallbacks** - Monthly fallback testing
4. **Clean up data** - Remove old metrics and logs

### **Monitoring Checklist**

- [ ] Redis connectivity
- [ ] Fallback functionality
- [ ] Rate limit accuracy
- [ ] Memory usage
- [ ] Performance impact
- [ ] Error rates
- [ ] Alert functionality

## 📞 Support

### **Upstash Support**

- [Upstash Documentation](https://docs.upstash.com/)
- [Upstash Discord](https://discord.gg/upstash)
- [Upstash Support](https://upstash.com/support)

### **Project Support**

- Check logs for error details
- Review configuration validation
- Test with debug mode enabled
- Contact development team

---

**Last Updated**: $(date) **Version**: 1.0.0 **Status**: ✅ Production Ready
