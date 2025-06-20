import { authMiddleware } from './middleware/auth';
import { NextRequest, NextResponse } from 'next/server';
import logger from './lib/logger';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = [
    '/review-session',
    '/account',
    '/review',
    '/vocabulary-learning'
  ];

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    return authMiddleware(request);
  }

  // Only log API requests
  if (request.nextUrl.pathname.startsWith('/api/')) {
    logger.info(`API Request: ${request.method} ${request.nextUrl.pathname}`);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|public/|api/).*)',
    // Apply to all API routes
    '/api/:path*',
  ],
};
