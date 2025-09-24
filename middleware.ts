import { updateSession } from '@/utils/supabase/middleware';
import { type NextRequest } from 'next/server';

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
