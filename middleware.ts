import { metricsCollector } from '@/lib/monitoring/metrics';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit-enhanced';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const clientIP = getClientIP(request);
  let rateLimitResult: any = null;
  let error: any = null;

  // Rate limiting check
  try {
    rateLimitResult = await checkRateLimit(request);

    if (!rateLimitResult.success) {
      // Log rate limit hit for monitoring
      console.warn(`Rate limit exceeded for ${rateLimitResult.type}:`, {
        ip: clientIP,
        type: rateLimitResult.type,
        usedFallback: rateLimitResult.usedFallback,
        limit: rateLimitResult.limit,
        remaining: rateLimitResult.remaining,
      });

      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.round((rateLimitResult.reset - Date.now()) / 1000),
          type: rateLimitResult.type,
          usedFallback: rateLimitResult.usedFallback,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.round(
              (rateLimitResult.reset - Date.now()) / 1000
            ).toString(),
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            'X-RateLimit-Type': rateLimitResult.type,
            'X-RateLimit-Fallback': rateLimitResult.usedFallback.toString(),
          },
        }
      );
    }
  } catch (err) {
    error = err;
    // If rate limiting fails, log error but don't block request
    console.error('Rate limiting error:', err);
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Rutas que requieren autenticación
  const protectedRoutes = [
    '/dashboard',
    '/entrenamientos',
    '/planificacion',
    '/analisis',
    '/equipo',
    '/reports',
    '/herramientas',
    '/settings',
  ];

  // Rutas de autenticación (solo accesibles si NO estás autenticado)
  const authRoutes = ['/auth/signin', '/auth/signup'];

  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Si es una ruta protegida y no hay usuario, redirigir a login
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/auth/signin', request.url);
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Si es una ruta de auth y ya hay usuario, redirigir a dashboard
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Add rate limit headers to response
  try {
    if (rateLimitResult) {
      response.headers.set(
        'X-RateLimit-Limit',
        rateLimitResult.limit.toString()
      );
      response.headers.set(
        'X-RateLimit-Remaining',
        rateLimitResult.remaining.toString()
      );
      response.headers.set(
        'X-RateLimit-Reset',
        rateLimitResult.reset.toString()
      );
    }
  } catch (err) {
    // Ignore rate limit header errors
  }

  // Record metrics for monitoring
  try {
    const responseTime = Date.now() - startTime;
    const pathname = new URL(request.url).pathname;
    const rateLimitType = rateLimitResult?.type || 'unknown';
    const blocked = !rateLimitResult?.success || false;
    const usedFallback = rateLimitResult?.usedFallback || false;

    // Record the request in metrics
    metricsCollector.recordRequest(
      rateLimitType,
      blocked,
      usedFallback,
      responseTime,
      clientIP
    );

    // Record errors if any
    if (error) {
      metricsCollector.recordError(
        error.message || 'Unknown error',
        'rate_limiting'
      );
    }

    // Update Redis status
    metricsCollector.updateRedisStatus(!usedFallback);

    // Update memory usage (simplified - in real implementation you'd get actual memory usage)
    const memoryUsage = process.memoryUsage?.()?.heapUsed || 0;
    metricsCollector.updateMemoryUsage(memoryUsage);
  } catch (metricsError) {
    // Don't let metrics collection errors affect the request
    console.error('Metrics collection error:', metricsError);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
