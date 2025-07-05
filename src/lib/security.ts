import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput } from '@/lib/sanitize';

export class SecurityMiddleware {
  // Rate limiting middleware
  static async rateLimitMiddleware(request: NextRequest, limit: number = 100, windowMs: number = 15 * 60 * 1000) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const identifier = ip.split(',')[0].trim();
    
    // Simple rate limiting implementation
    const key = `rate_limit:${identifier}`;
    const now = Date.now();
    
    // This is a simplified version - in production, use Redis or similar
    return true; // For now, allow all requests
  }

  // Input sanitization
  static sanitizeData(data: any): any {
    if (typeof data === 'string') {
      return sanitizeInput(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeData(value);
      }
      return sanitized;
    }
    
    return data;
  }

  // CORS headers
  static addCorsHeaders(response: NextResponse): NextResponse {
    response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    return response;
  }

  // Content Security Policy
  static addCSPHeaders(response: NextResponse): NextResponse {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'"
    ].join('; ');
    
    response.headers.set('Content-Security-Policy', csp);
    return response;
  }

  // Authentication check
  static async requireAuth(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Unauthorized', status: 401 };
    }
    
    // For now, we'll rely on client-side session management
    return { success: true };
  }

  // Role-based access control
  static async requireRole(request: NextRequest, requiredRole: string) {
    const authResult = await this.requireAuth(request);
    if (authResult.error) {
      return authResult;
    }
    
    // Role check would go here
    // This would typically involve decoding the JWT and checking the role
    return { success: true };
  }
}

// Input validation schemas
export const validationSchemas = {
  listing: {
    title: { minLength: 3, maxLength: 100, required: true },
    description: { minLength: 10, maxLength: 2000, required: true },
    price: { min: 0, max: 1000000, required: true },
    category: { required: true },
    condition: { required: true },
    location: { required: true },
    images: { maxCount: 5, required: false }
  },
  
  user: {
    name: { minLength: 2, maxLength: 50, required: true },
    email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, required: true },
    password: { minLength: 8, required: true },
    phone: { pattern: /^[\+]?[1-9][\d]{0,15}$/, required: false }
  }
};

// Validation helper
export function validateData(data: any, schema: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    const ruleSet = rules as any;
    
    if (ruleSet.required && !value) {
      errors.push(`${field} alanı zorunludur`);
      continue;
    }
    
    if (value) {
      if (ruleSet.minLength && value.length < ruleSet.minLength) {
        errors.push(`${field} en az ${ruleSet.minLength} karakter olmalıdır`);
      }
      
      if (ruleSet.maxLength && value.length > ruleSet.maxLength) {
        errors.push(`${field} en fazla ${ruleSet.maxLength} karakter olmalıdır`);
      }
      
      if (ruleSet.min && Number(value) < ruleSet.min) {
        errors.push(`${field} en az ${ruleSet.min} olmalıdır`);
      }
      
      if (ruleSet.max && Number(value) > ruleSet.max) {
        errors.push(`${field} en fazla ${ruleSet.max} olmalıdır`);
      }
      
      if (ruleSet.pattern && !ruleSet.pattern.test(value)) {
        errors.push(`${field} geçerli bir format değil`);
      }
      
      if (ruleSet.maxCount && Array.isArray(value) && value.length > ruleSet.maxCount) {
        errors.push(`${field} en fazla ${ruleSet.maxCount} öğe içerebilir`);
      }
    }
  }
  
  return { valid: errors.length === 0, errors };
} 