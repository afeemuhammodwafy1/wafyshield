import { NextResponse } from 'next/server';

const rateLimit = new Map();

export function middleware(req) {
  if (req.nextUrl.pathname === '/api/scan') {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const window = 60000;
    const limit = 5;

    const data = rateLimit.get(ip) || [];
    const recent = data.filter(t => now - t < window);

    if (recent.length >= limit) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please wait a moment.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    recent.push(now);
    rateLimit.set(ip, recent);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};