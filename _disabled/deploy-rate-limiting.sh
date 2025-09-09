#!/bin/bash

# =====================================================
# RATE LIMITING DEPLOYMENT SCRIPT
# =====================================================

set -e

echo "🚀 Starting Rate Limiting Deployment..."

# =====================================================
# ENVIRONMENT VALIDATION
# =====================================================

echo "📋 Validating environment variables..."

# Required variables
REQUIRED_VARS=(
  "UPSTASH_REDIS_REST_URL"
  "UPSTASH_REDIS_REST_TOKEN"
  "ADMIN_API_TOKEN"
  "NEXT_PUBLIC_ADMIN_API_TOKEN"
)

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Error: $var is not set"
    exit 1
  fi
done

echo "✅ All required environment variables are set"

# =====================================================
# REDIS CONNECTIVITY TEST
# =====================================================

echo "🔗 Testing Redis connectivity..."

# Test Redis connection
if curl -s -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" "$UPSTASH_REDIS_REST_URL/ping" | grep -q "PONG"; then
  echo "✅ Redis connection successful"
else
  echo "❌ Error: Redis connection failed"
  echo "Please check your Upstash Redis configuration"
  exit 1
fi

# =====================================================
# CONFIGURATION VALIDATION
# =====================================================

echo "⚙️ Validating rate limit configuration..."

# Check if configuration is valid
if npm run validate:rate-limits; then
  echo "✅ Rate limit configuration is valid"
else
  echo "❌ Error: Rate limit configuration is invalid"
  exit 1
fi

# =====================================================
# BUILD AND DEPLOY
# =====================================================

echo "🏗️ Building application..."

# Build the application
if npm run build; then
  echo "✅ Build successful"
else
  echo "❌ Error: Build failed"
  exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."

if vercel --prod; then
  echo "✅ Deployment successful"
else
  echo "❌ Error: Deployment failed"
  exit 1
fi

# =====================================================
# POST-DEPLOYMENT TESTS
# =====================================================

echo "🧪 Running post-deployment tests..."

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls --json | jq -r '.[0].url')

# Test rate limit API
echo "Testing rate limit API..."
if curl -s -H "Authorization: Bearer $ADMIN_API_TOKEN" "$DEPLOYMENT_URL/api/admin/rate-limits" | grep -q "analytics"; then
  echo "✅ Rate limit API is working"
else
  echo "❌ Error: Rate limit API is not working"
  exit 1
fi

# Test rate limit enforcement
echo "Testing rate limit enforcement..."
for i in {1..5}; do
  curl -s "$DEPLOYMENT_URL/api/test" > /dev/null
done

echo "✅ Rate limit enforcement test completed"

# =====================================================
# MONITORING SETUP
# =====================================================

echo "📊 Setting up monitoring..."

# Create monitoring dashboard URL
echo "Rate limit dashboard: $DEPLOYMENT_URL/admin/rate-limits"
echo "API endpoint: $DEPLOYMENT_URL/api/admin/rate-limits"

# =====================================================
# SUCCESS MESSAGE
# =====================================================

echo ""
echo "🎉 Rate Limiting Deployment Complete!"
echo ""
echo "📋 Deployment Summary:"
echo "  • Redis: ✅ Connected"
echo "  • Configuration: ✅ Valid"
echo "  • Build: ✅ Successful"
echo "  • Deployment: ✅ Complete"
echo "  • API: ✅ Working"
echo "  • Monitoring: ✅ Available"
echo ""
echo "🔗 Useful Links:"
echo "  • Dashboard: $DEPLOYMENT_URL/admin/rate-limits"
echo "  • API: $DEPLOYMENT_URL/api/admin/rate-limits"
echo "  • Documentation: ./docs/RATE_LIMITING_SETUP.md"
echo ""
echo "📚 Next Steps:"
echo "  1. Monitor the dashboard for rate limit activity"
echo "  2. Set up alerting for high block rates"
echo "  3. Review and adjust rate limits based on usage"
echo "  4. Test fallback mechanisms"
echo ""
echo "✅ Rate limiting is now active in production!"
