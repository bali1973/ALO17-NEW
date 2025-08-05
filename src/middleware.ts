import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Güvenlik başlıkları
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://www.paytr.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob: https://images.unsplash.com https://*.unsplash.com",
    "media-src 'self' https:",
    "connect-src 'self' https://api.stripe.com https://www.paytr.com https://images.unsplash.com ws: wss:",
    "frame-src 'self' https://js.stripe.com https://www.paytr.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; '),
};

// Rate limiting için basit in-memory store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting ayarları
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 dakika
const RATE_LIMIT_MAX_REQUESTS = 1000; // 1 dakikada maksimum 1000 istek (geliştirme için)

// IP adresini al
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return 'unknown';
}

// Rate limiting kontrolü
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    // Yeni pencere başlat
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

// Rate limiting temizleme (her 5 dakikada bir)
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Güvenlik middleware'i
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Güvenlik başlıklarını ekle
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // IP adresini al
  const clientIP = getClientIP(request);
  
  // Rate limiting kontrolü (geliştirme modunda devre dışı)
  if (process.env.NODE_ENV === 'production' && !checkRateLimit(clientIP)) {
    return new NextResponse(
      JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
        },
      }
    );
  }
  
  // API endpoint'leri için ek güvenlik kontrolleri
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // CORS başlıkları
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // OPTIONS istekleri için
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200 });
    }
    
    // Admin endpoint'leri için ek güvenlik
    if (request.nextUrl.pathname.startsWith('/api/admin/')) {
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized' }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }
    
    // Dosya yükleme endpoint'leri için boyut kontrolü
    if (request.nextUrl.pathname.includes('/upload') || request.nextUrl.pathname.includes('/image')) {
      const contentLength = request.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB limit
        return new NextResponse(
          JSON.stringify({ error: 'File size too large' }),
          {
            status: 413,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }
  }
  
  // XSS koruması için input sanitization
  const url = request.nextUrl.clone();
  const searchParams = url.searchParams;
  
  for (const [key, value] of searchParams.entries()) {
    // Potansiyel XSS payload'larını kontrol et
    const sanitizedValue = value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    
    if (sanitizedValue !== value) {
      searchParams.set(key, sanitizedValue);
    }
  }
  
  // SQL injection koruması için basit kontrol
  const sqlInjectionPatterns = [
    /(\b(union|select|insert|update|delete|drop|create|alter)\b)/i,
    /(\b(or|and)\b\s+\d+\s*=\s*\d+)/i,
    /(\b(union|select|insert|update|delete|drop|create|alter)\b.*\b(union|select|insert|update|delete|drop|create|alter)\b)/i,
  ];
  
  const requestUrl = request.url.toLowerCase();
  for (const pattern of sqlInjectionPatterns) {
    if (pattern.test(requestUrl)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid request' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }
  
  return response;
}

// Middleware'in çalışacağı path'ler
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 