import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateMap = new Map<string, { count: number; time: number }>();

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateMap) {
    if (now - val.time > 120000) rateMap.delete(key); // 2 min TTL
  }
}, 300000);

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Rate limit: chat send — max 30 requests/min per IP
  if (path === '/api/chat/send') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    const now = Date.now();
    const entry = rateMap.get(ip);

    if (entry && now - entry.time < 60000) {
      entry.count++;
      if (entry.count > 30) {
        return NextResponse.json(
          { error: 'Too many requests. Slow down.' },
          { status: 429 }
        );
      }
    } else {
      rateMap.set(ip, { count: 1, time: now });
    }
  }

  // Rate limit: upload — max 10 requests/min per IP
  if (path === '/api/upload') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    const now = Date.now();
    const key = `upload:${ip}`;
    const entry = rateMap.get(key);

    if (entry && now - entry.time < 60000) {
      entry.count++;
      if (entry.count > 10) {
        return NextResponse.json(
          { error: 'Too many uploads. Slow down.' },
          { status: 429 }
        );
      }
    } else {
      rateMap.set(key, { count: 1, time: now });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/chat/send', '/api/upload'],
};
