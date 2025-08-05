import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface RateLimitConfig {
  windowMs: number; // Zaman penceresi (milisaniye)
  maxRequests: number; // Maksimum istek sayısı
  message: string;
  statusCode: number;
}

interface SecurityConfig {
  rateLimits: {
    [key: string]: RateLimitConfig;
  };
  cors: {
    origin: string[];
    methods: string[];
    allowedHeaders: string[];
  };
  headers: {
    [key: string]: string;
  };
}

// Rate limiting için basit in-memory store
class RateLimitStore {
  private store: Map<string, { count: number; resetTime: number }> = new Map();

  increment(key: string, windowMs: number): { count: number; resetTime: number } {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || now > record.resetTime) {
      // Yeni kayıt veya süresi dolmuş kayıt
      const newRecord = { count: 1, resetTime: now + windowMs };
      this.store.set(key, newRecord);
      return newRecord;
    } else {
      // Mevcut kayıt
      record.count++;
      return record;
    }
  }

  get(key: string): { count: number; resetTime: number } | undefined {
    return this.store.get(key);
  }

  reset(key: string): void {
    this.store.delete(key);
  }

  // Eski kayıtları temizle
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

class SecurityMiddleware {
  private static instance: SecurityMiddleware;
  private rateLimitStore: RateLimitStore;
  private config: SecurityConfig;

  private constructor() {
    this.rateLimitStore = new RateLimitStore();
    this.config = this.getDefaultConfig();
    
    // Periyodik temizlik
    setInterval(() => {
      this.rateLimitStore.cleanup();
    }, 60000); // Her dakika
  }

  static getInstance(): SecurityMiddleware {
    if (!SecurityMiddleware.instance) {
      SecurityMiddleware.instance = new SecurityMiddleware();
    }
    return SecurityMiddleware.instance;
  }

  private getDefaultConfig(): SecurityConfig {
    return {
      rateLimits: {
        default: {
          windowMs: 15 * 60 * 1000, // 15 dakika
          maxRequests: 100,
          message: 'Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.',
          statusCode: 429
        },
        auth: {
          windowMs: 15 * 60 * 1000, // 15 dakika
          maxRequests: 5,
          message: 'Çok fazla giriş denemesi. Lütfen daha sonra tekrar deneyin.',
          statusCode: 429
        },
        api: {
          windowMs: 60 * 1000, // 1 dakika
          maxRequests: 60,
          message: 'API rate limit aşıldı. Lütfen daha sonra tekrar deneyin.',
          statusCode: 429
        },
        search: {
          windowMs: 60 * 1000, // 1 dakika
          maxRequests: 30,
          message: 'Arama rate limit aşıldı. Lütfen daha sonra tekrar deneyin.',
          statusCode: 429
        }
      },
      cors: {
        origin: [
          'https://alo17.netlify.app',
          'https://alo17.vercel.app',
          'http://localhost:3000',
          'http://localhost:3001'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
          'Content-Type',
          'Authorization',
          'X-Requested-With',
          'Accept',
          'Origin'
        ]
      },
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
      }
    };
  }

  // Rate limiting kontrolü
  checkRateLimit(request: NextRequest, type: string = 'default'): { allowed: boolean; message?: string; statusCode?: number } {
    const config = this.config.rateLimits[type] || this.config.rateLimits.default;
    const key = this.generateRateLimitKey(request, type);
    
    const record = this.rateLimitStore.increment(key, config.windowMs);
    
    if (record.count > config.maxRequests) {
      return {
        allowed: false,
        message: config.message,
        statusCode: config.statusCode
      };
    }
    
    return { allowed: true };
  }

  // Rate limit key oluştur
  private generateRateLimitKey(request: NextRequest, type: string): string {
    const ip = this.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';
    const userId = this.getUserId(request);
    
    return `${type}:${ip}:${userId}:${crypto.createHash('md5').update(userAgent).digest('hex')}`;
  }

  // Client IP'sini al
  private getClientIP(request: NextRequest): string {
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

  // Kullanıcı ID'sini al
  private getUserId(request: NextRequest): string {
    // JWT token'dan veya session'dan user ID al
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Token'dan user ID çıkar (gerçek uygulamada JWT decode edilmeli)
      return 'authenticated';
    }
    
    return 'anonymous';
  }

  // CORS kontrolü
  checkCORS(request: NextRequest): { allowed: boolean; headers?: { [key: string]: string } } {
    const origin = request.headers.get('origin');
    const method = request.method;
    
    // Origin kontrolü
    if (origin && !this.config.cors.origin.includes(origin)) {
      return { allowed: false };
    }
    
    // Method kontrolü
    if (!this.config.cors.methods.includes(method)) {
      return { allowed: false };
    }
    
    // CORS header'ları
    const headers: { [key: string]: string } = {};
    
    if (origin) {
      headers['Access-Control-Allow-Origin'] = origin;
    }
    
    headers['Access-Control-Allow-Methods'] = this.config.cors.methods.join(', ');
    headers['Access-Control-Allow-Headers'] = this.config.cors.allowedHeaders.join(', ');
    headers['Access-Control-Allow-Credentials'] = 'true';
    
    return { allowed: true, headers };
  }

  // Input validation
  validateInput(data: any, schema: any): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];
    
    // Basit validation (gerçek uygulamada Joi veya Zod kullanılabilir)
    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} alanı gerekli`);
        continue;
      }
      
      if (value !== undefined && value !== null) {
        if (rules.type && typeof value !== rules.type) {
          errors.push(`${field} alanı ${rules.type} tipinde olmalı`);
        }
        
        if (rules.minLength && value.length < rules.minLength) {
          errors.push(`${field} alanı en az ${rules.minLength} karakter olmalı`);
        }
        
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${field} alanı en fazla ${rules.maxLength} karakter olmalı`);
        }
        
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push(`${field} alanı geçersiz format`);
        }
        
        if (rules.enum && !rules.enum.includes(value)) {
          errors.push(`${field} alanı geçerli değerlerden biri olmalı`);
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  // SQL Injection koruması
  sanitizeInput(input: string): string {
    // Basit SQL injection koruması
    const dangerousPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
      /(--|;|'|"|`)/g,
      /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/gi,
      /(\b(OR|AND)\b\s+['"]\w+['"]\s*=\s*['"]\w+['"])/gi
    ];
    
    let sanitized = input;
    dangerousPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[BLOCKED]');
    });
    
    return sanitized;
  }

  // XSS koruması
  sanitizeHTML(input: string): string {
    // Basit XSS koruması
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Güvenlik header'larını ekle
  addSecurityHeaders(response: NextResponse): NextResponse {
    Object.entries(this.config.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  }

  // CSRF token oluştur
  generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // CSRF token doğrula
  validateCSRFToken(token: string, storedToken: string): boolean {
    return token === storedToken;
  }

  // Güvenli hash oluştur
  hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  // Hash doğrula
  verifyPassword(password: string, hashedPassword: string): boolean {
    const [salt, hash] = hashedPassword.split(':');
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
  }

  // Güvenli token oluştur
  generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Request'i güvenlik kontrolünden geçir
  async processRequest(request: NextRequest, type: string = 'default'): Promise<{ 
    allowed: boolean; 
    response?: NextResponse; 
    sanitizedData?: any;
  }> {
    // Rate limiting kontrolü
    const rateLimitResult = this.checkRateLimit(request, type);
    if (!rateLimitResult.allowed) {
      return {
        allowed: false,
        response: new NextResponse(
          JSON.stringify({ error: rateLimitResult.message }),
          { 
            status: rateLimitResult.statusCode,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      };
    }

    // CORS kontrolü
    const corsResult = this.checkCORS(request);
    if (!corsResult.allowed) {
      return {
        allowed: false,
        response: new NextResponse(
          JSON.stringify({ error: 'CORS policy violation' }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      };
    }

    // OPTIONS request için CORS header'ları ekle
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 200 });
      Object.entries(corsResult.headers || {}).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return { allowed: true, response };
    }

    // POST/PUT/PATCH request'ler için input validation
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      try {
        const body = await request.json();
        const sanitizedData = this.sanitizeData(body);
        
        return {
          allowed: true,
          sanitizedData
        };
      } catch (error) {
        return {
          allowed: false,
          response: new NextResponse(
            JSON.stringify({ error: 'Invalid request body' }),
            { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            }
          )
        };
      }
    }

    return { allowed: true };
  }

  // Veriyi sanitize et
  private sanitizeData(data: any): any {
    if (typeof data === 'string') {
      return this.sanitizeInput(data);
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = Array.isArray(data) ? [] : {};
      
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeData(value);
      }
      
      return sanitized;
    }
    
    return data;
  }

  // Konfigürasyonu güncelle
  updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Rate limit istatistikleri
  getRateLimitStats(): any {
    const stats: any = {};
    
    for (const [type, config] of Object.entries(this.config.rateLimits)) {
      stats[type] = {
        windowMs: config.windowMs,
        maxRequests: config.maxRequests,
        activeKeys: 0
      };
    }
    
    return stats;
  }
}

// Global güvenlik middleware instance'ı
export const securityMiddleware = SecurityMiddleware.getInstance();

// Kolay kullanım için helper fonksiyonlar
export const withSecurity = (handler: Function, type: string = 'default') => {
  return async (request: NextRequest) => {
    const result = await securityMiddleware.processRequest(request, type);
    
    if (!result.allowed) {
      return result.response;
    }
    
    // Sanitized data'yı request'e ekle
    if (result.sanitizedData) {
      (request as any).sanitizedData = result.sanitizedData;
    }
    
    return handler(request);
  };
};

export const validateInput = (data: any, schema: any) => {
  return securityMiddleware.validateInput(data, schema);
};

export const sanitizeInput = (input: string) => {
  return securityMiddleware.sanitizeInput(input);
};

export const sanitizeHTML = (input: string) => {
  return securityMiddleware.sanitizeHTML(input);
};

export const hashPassword = (password: string) => {
  return securityMiddleware.hashPassword(password);
};

export const verifyPassword = (password: string, hashedPassword: string) => {
  return securityMiddleware.verifyPassword(password, hashedPassword);
};

export const generateSecureToken = () => {
  return securityMiddleware.generateSecureToken();
};

export default securityMiddleware; 