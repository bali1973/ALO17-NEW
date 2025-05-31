import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // CSRF token kontrolü
  const csrfToken = request.headers.get('x-csrf-token')
  if (request.method !== 'GET' && !csrfToken) {
    return new NextResponse('CSRF token missing', { status: 403 })
  }

  // Rate limiting
  const ip = request.ip ?? '127.0.0.1'
  const rateLimit = request.headers.get('x-rate-limit')
  if (rateLimit && parseInt(rateLimit) > 100) {
    return new NextResponse('Too many requests', { status: 429 })
  }

  // JWT token kontrolü
  const token = request.headers.get('authorization')?.split(' ')[1]
  if (!token && request.nextUrl.pathname.startsWith('/api/')) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/profil/:path*',
    '/ilan-ver/:path*',
    '/admin/:path*'
  ]
} 