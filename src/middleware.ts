import { RateLimiter } from 'limiter';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Create a store for limiters by IP address
const limiters: Record<string, RateLimiter> = {};

// Configure rate limits
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const RATE_LIMIT_MAX = 60; // 60 requests per minute

export function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Get IP from x-forwarded-for header or use a fallback
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'anonymous';

  // Create a new rate limiter for this IP if one doesn't exist
  if (!limiters[ip]) {
    limiters[ip] = new RateLimiter({
      tokensPerInterval: RATE_LIMIT_MAX,
      interval: RATE_LIMIT_WINDOW,
      fireImmediately: true, // Important for synchronous token removal
    });
  }

  // Try to remove a token (returns true if successful, false if rate limited)
  const hasRemainingTokens = limiters[ip].tryRemoveTokens(1);

  // If no tokens remaining, rate limit has been hit
  if (!hasRemainingTokens) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: 'Too many requests, please try again later.',
        error: 'TOO_MANY_REQUESTS',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
          'X-RateLimit-Remaining': '0',
          'Retry-After': '60', // Suggest retry after a minute
        },
      }
    );
  }

  // Allow the request and set rate limit headers
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX.toString());

  // Get the current count - may not be perfectly accurate but provides an estimate
  const tokensRemaining = limiters[ip].getTokensRemaining();
  response.headers.set(
    'X-RateLimit-Remaining',
    Math.floor(tokensRemaining).toString()
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
