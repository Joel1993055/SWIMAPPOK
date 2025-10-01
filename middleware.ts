import { type NextRequest } from 'next/server';
import { validateEnvVarsOrThrow } from './utils/env-validation';
import { updateSession } from './utils/supabase/middleware';

// Validate environment variables on startup
try {
  validateEnvVarsOrThrow();
} catch (error) {
  console.error('❌ Middleware startup failed:', error);
  // Don't throw here to avoid breaking the app completely
}

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/protected/:path*',
    '/admin/:path*',
    '/settings/:path*',
    '/profile/:path*',
    '/training/:path*',
    '/calendar/:path*',
    '/reports/:path*',
    '/planning/:path*',
    '/clubs/:path*',
    '/tools/:path*',
    '/log/:path*',
    '/ai-coach/:path*',
    '/analysis/:path*',
    '/notifications/:path*'
  ],
};
