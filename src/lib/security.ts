import { NextRequest, NextResponse } from 'next/server';
import { hash, compare } from 'bcryptjs';

// Rate limiting için in-memory store (production'da Redis kullanılmalı)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string; // Custom key generator
}

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async checkLimit(req: NextRequest): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = this.config.keyGenerator ? this.config.keyGenerator(req) : this.getDefaultKey(req);
    const now = Date.now();
    
    const record = rateLimitStore.get(key);
    
    if (!record || now > record.resetTime) {
      // Reset or create new record
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs
      });
      
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: now + this.config.windowMs
      };
    }
    
    if (record.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime
      };
    }
    
    // Increment count
    record.count++;
    rateLimitStore.set(key, record);
    
    return {
      allowed: true,
      remaining: this.config.maxRequests - record.count,
      resetTime: record.resetTime
    };
  }

  private getDefaultKey(req: NextRequest): string {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || '';
    return `${ip}:${userAgent}`;
  }
}

// Input validation schemas
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  type?: 'email' | 'url' | 'phone' | 'number' | 'date';
  custom?: (value: any) => boolean | string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export class InputValidator {
  private schema: ValidationSchema;

  constructor(schema: ValidationSchema) {
    this.schema = schema;
  }

  validate(data: any): { isValid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};

    for (const [field, rules] of Object.entries(this.schema)) {
      const value = data[field];
      const fieldErrors: string[] = [];

      // Required check
      if (rules.required && (value === undefined || value === null || value === '')) {
        fieldErrors.push(`${field} alanı zorunludur`);
        continue;
      }

      // Skip other validations if value is empty and not required
      if (value === undefined || value === null || value === '') {
        continue;
      }

      // Type validation
      if (rules.type) {
        const typeError = this.validateType(value, rules.type);
        if (typeError) {
          fieldErrors.push(typeError);
        }
      }

      // Length validation
      if (typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          fieldErrors.push(`${field} en az ${rules.minLength} karakter olmalıdır`);
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          fieldErrors.push(`${field} en fazla ${rules.maxLength} karakter olmalıdır`);
        }
      }

      // Pattern validation
      if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
        fieldErrors.push(`${field} geçerli formatta değil`);
      }

      // Custom validation
      if (rules.custom) {
        const customResult = rules.custom(value);
        if (customResult !== true) {
          fieldErrors.push(typeof customResult === 'string' ? customResult : `${field} geçersiz`);
        }
      }

      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  private validateType(value: any, type: string): string | null {
    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : 'Geçerli bir email adresi giriniz';
      
      case 'url':
        try {
          new URL(value);
          return null;
        } catch {
          return 'Geçerli bir URL giriniz';
        }
      
      case 'phone':
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(value) ? null : 'Geçerli bir telefon numarası giriniz';
      
      case 'number':
        return !isNaN(Number(value)) ? null : 'Geçerli bir sayı giriniz';
      
      case 'date':
        const date = new Date(value);
        return !isNaN(date.getTime()) ? null : 'Geçerli bir tarih giriniz';
      
      default:
        return null;
    }
  }
}

// Security headers middleware
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.stripe.com; " +
    "frame-src https://js.stripe.com;"
  );
  
  return response;
}

// Password validation
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Şifre en az 8 karakter olmalıdır');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Şifre en az bir büyük harf içermelidir');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Şifre en az bir küçük harf içermelidir');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Şifre en az bir rakam içermelidir');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Şifre en az bir özel karakter içermelidir');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
}

// CSRF token generation and validation
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function validateCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken;
}

// SQL injection prevention
export function escapeSQL(input: string): string {
  return input
    .replace(/'/g, "''")
    .replace(/--/g, '')
    .replace(/;/g, '')
    .replace(/\b(union|select|insert|update|delete|drop|create|alter)\b/gi, '');
}

// XSS prevention
export function escapeHTML(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// File upload validation
export function validateFileUpload(file: File, allowedTypes: string[], maxSize: number): { isValid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Geçersiz dosya türü' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: `Dosya boyutu ${maxSize / 1024 / 1024}MB'dan büyük olamaz` };
  }
  
  return { isValid: true };
}

// Common validation schemas
export const commonSchemas = {
  user: {
    name: { required: true, minLength: 2, maxLength: 50 },
    email: { required: true, type: 'email' },
    password: { required: true, minLength: 8 },
    phone: { type: 'phone' }
  },
  
  listing: {
    title: { required: true, minLength: 5, maxLength: 100 },
    description: { required: true, minLength: 10, maxLength: 1000 },
    price: { required: true, type: 'number', custom: (value) => value > 0 },
    category: { required: true },
    city: { required: true }
  },
  
  contact: {
    name: { required: true, minLength: 2, maxLength: 50 },
    email: { required: true, type: 'email' },
    message: { required: true, minLength: 10, maxLength: 500 }
  }
};

// Rate limit configurations
export const rateLimitConfigs = {
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 requests per 15 minutes
  api: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 requests per minute
  upload: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 uploads per minute
  search: { windowMs: 60 * 1000, maxRequests: 50 } // 50 searches per minute
}; 

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'failed_login' | 'suspicious_activity' | 'rate_limit_exceeded' | 'sql_injection' | 'xss_attempt' | 'file_upload' | 'admin_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip: string;
  userId?: string;
  userAgent?: string;
  details: Record<string, any>;
  timestamp: number;
  resolved: boolean;
}

interface SecurityConfig {
  maxLoginAttempts: number;
  lockoutDuration: number; // dakika
  suspiciousPatterns: RegExp[];
  allowedFileTypes: string[];
  maxFileSize: number; // byte
  adminIPWhitelist: string[];
}

class SecurityService {
  private static instance: SecurityService;
  private events: SecurityEvent[] = [];
  private failedLogins = new Map<string, { count: number; lastAttempt: number; lockedUntil?: number }>();
  private config: SecurityConfig = {
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    suspiciousPatterns: [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /union\s+select/i,
      /drop\s+table/i,
      /delete\s+from/i,
      /insert\s+into/i,
      /update\s+set/i,
    ],
    allowedFileTypes: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    adminIPWhitelist: ['127.0.0.1', '::1'],
  };

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  // Güvenlik olayı kaydet
  logEvent(
    type: SecurityEvent['type'],
    severity: SecurityEvent['severity'],
    ip: string,
    details: Record<string, any>,
    userId?: string,
    userAgent?: string
  ): void {
    const event: SecurityEvent = {
      id: `security_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      ip,
      userId,
      userAgent,
      details,
      timestamp: Date.now(),
      resolved: false,
    };

    this.events.push(event);

    // Son 1000 olayı sakla
    if (this.events.length > 1000) {
      this.events.splice(0, this.events.length - 1000);
    }

    // Kritik olayları anında işle
    if (severity === 'critical') {
      this.handleCriticalEvent(event);
    }

    console.log(`[SECURITY] ${severity.toUpperCase()}: ${type} from ${ip}`, details);
  }

  // Login girişimi kontrol et
  checkLoginAttempt(ip: string, email: string): { allowed: boolean; reason?: string } {
    const record = this.failedLogins.get(ip);

    if (record && record.lockedUntil && Date.now() < record.lockedUntil) {
      const remainingMinutes = Math.ceil((record.lockedUntil - Date.now()) / (1000 * 60));
      this.logEvent('login_attempt', 'medium', ip, {
        email,
        reason: 'account_locked',
        remainingMinutes,
      });
      return { allowed: false, reason: `Account locked. Try again in ${remainingMinutes} minutes.` };
    }

    return { allowed: true };
  }

  // Başarısız login kaydet
  recordFailedLogin(ip: string, email: string, reason?: string): void {
    const record = this.failedLogins.get(ip) || { count: 0, lastAttempt: 0 };

    record.count++;
    record.lastAttempt = Date.now();

    // Maksimum deneme sayısını aştıysa kilitle
    if (record.count >= this.config.maxLoginAttempts) {
      record.lockedUntil = Date.now() + (this.config.lockoutDuration * 60 * 1000);
      this.logEvent('failed_login', 'high', ip, {
        email,
        reason: 'max_attempts_exceeded',
        attempts: record.count,
        lockoutDuration: this.config.lockoutDuration,
      });
    } else {
      this.logEvent('failed_login', 'medium', ip, {
        email,
        reason,
        attempts: record.count,
      });
    }

    this.failedLogins.set(ip, record);
  }

  // Başarılı login kaydet
  recordSuccessfulLogin(ip: string, email: string, userId: string): void {
    // Başarısız login kayıtlarını temizle
    this.failedLogins.delete(ip);

    this.logEvent('login_attempt', 'low', ip, {
      email,
      userId,
      success: true,
    });
  }

  // Şüpheli aktivite kontrol et
  checkSuspiciousActivity(input: string, ip: string): { suspicious: boolean; pattern?: string } {
    for (const pattern of this.config.suspiciousPatterns) {
      if (pattern.test(input)) {
        this.logEvent('suspicious_activity', 'high', ip, {
          input: input.substring(0, 100), // İlk 100 karakter
          pattern: pattern.source,
          type: 'pattern_match',
        });
        return { suspicious: true, pattern: pattern.source };
      }
    }

    return { suspicious: false };
  }

  // Dosya yükleme güvenlik kontrolü
  checkFileUpload(
    filename: string,
    fileSize: number,
    ip: string,
    userId?: string
  ): { allowed: boolean; reason?: string } {
    // Dosya boyutu kontrolü
    if (fileSize > this.config.maxFileSize) {
      this.logEvent('file_upload', 'medium', ip, {
        filename,
        fileSize,
        reason: 'file_too_large',
        userId,
      });
      return { allowed: false, reason: 'File size exceeds limit' };
    }

    // Dosya türü kontrolü
    const fileExtension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    if (!this.config.allowedFileTypes.includes(fileExtension)) {
      this.logEvent('file_upload', 'high', ip, {
        filename,
        fileExtension,
        reason: 'file_type_not_allowed',
        userId,
      });
      return { allowed: false, reason: 'File type not allowed' };
    }

    // Şüpheli dosya adı kontrolü
    const suspiciousName = this.checkSuspiciousActivity(filename, ip);
    if (suspiciousName.suspicious) {
      return { allowed: false, reason: 'Suspicious filename detected' };
    }

    this.logEvent('file_upload', 'low', ip, {
      filename,
      fileSize,
      fileExtension,
      userId,
      success: true,
    });

    return { allowed: true };
  }

  // Admin erişim kontrolü
  checkAdminAccess(ip: string, userId?: string): { allowed: boolean; reason?: string } {
    // IP whitelist kontrolü
    if (!this.config.adminIPWhitelist.includes(ip)) {
      this.logEvent('admin_access', 'high', ip, {
        userId,
        reason: 'ip_not_whitelisted',
      });
      return { allowed: false, reason: 'IP not in admin whitelist' };
    }

    this.logEvent('admin_access', 'low', ip, {
      userId,
      success: true,
    });

    return { allowed: true };
  }

  // Rate limiting kontrolü
  checkRateLimit(ip: string, endpoint: string): { allowed: boolean; reason?: string } {
    // Basit rate limiting - gerçek uygulamada Redis kullanılmalı
    const key = `${ip}:${endpoint}`;
    const now = Date.now();
    const window = 60 * 1000; // 1 dakika
    const maxRequests = 100;

    // Bu basit implementasyon - production'da daha gelişmiş olmalı
    return { allowed: true };
  }

  // Güvenlik olaylarını al
  getEvents(
    filters?: {
      type?: SecurityEvent['type'];
      severity?: SecurityEvent['severity'];
      ip?: string;
      userId?: string;
      resolved?: boolean;
      startDate?: number;
      endDate?: number;
    }
  ): SecurityEvent[] {
    let filteredEvents = [...this.events];

    if (filters) {
      if (filters.type) {
        filteredEvents = filteredEvents.filter(e => e.type === filters.type);
      }
      if (filters.severity) {
        filteredEvents = filteredEvents.filter(e => e.severity === filters.severity);
      }
      if (filters.ip) {
        filteredEvents = filteredEvents.filter(e => e.ip === filters.ip);
      }
      if (filters.userId) {
        filteredEvents = filteredEvents.filter(e => e.userId === filters.userId);
      }
      if (filters.resolved !== undefined) {
        filteredEvents = filteredEvents.filter(e => e.resolved === filters.resolved);
      }
      if (filters.startDate) {
        filteredEvents = filteredEvents.filter(e => e.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        filteredEvents = filteredEvents.filter(e => e.timestamp <= filters.endDate!);
      }
    }

    return filteredEvents.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Olayı çözüldü olarak işaretle
  resolveEvent(eventId: string): boolean {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.resolved = true;
      return true;
    }
    return false;
  }

  // Güvenlik istatistikleri
  getStats(): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    recentEvents: number;
    unresolvedEvents: number;
    lockedIPs: number;
  } {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    const eventsByType: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};

    this.events.forEach(event => {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
    });

    const lockedIPs = Array.from(this.failedLogins.values()).filter(
      record => record.lockedUntil && now < record.lockedUntil
    ).length;

    return {
      totalEvents: this.events.length,
      eventsByType,
      eventsBySeverity,
      recentEvents: this.events.filter(e => e.timestamp >= oneDayAgo).length,
      unresolvedEvents: this.events.filter(e => !e.resolved).length,
      lockedIPs,
    };
  }

  // Kritik olayları işle
  private handleCriticalEvent(event: SecurityEvent): void {
    // Kritik olaylar için özel işlemler
    switch (event.type) {
      case 'sql_injection':
      case 'xss_attempt':
        // IP'yi geçici olarak engelle
        this.blockIP(event.ip, 60 * 60 * 1000); // 1 saat
        break;
      case 'failed_login':
        if (event.details.attempts >= this.config.maxLoginAttempts) {
          // IP'yi daha uzun süre engelle
          this.blockIP(event.ip, 24 * 60 * 60 * 1000); // 24 saat
        }
        break;
    }
  }

  // IP engelleme (basit implementasyon)
  private blockIP(ip: string, duration: number): void {
    // Gerçek uygulamada firewall veya proxy seviyesinde engelleme yapılmalı
    console.log(`[SECURITY] Blocking IP ${ip} for ${duration / (1000 * 60)} minutes`);
  }

  // Konfigürasyonu güncelle
  updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Güvenlik olaylarını temizle
  clearEvents(olderThan?: number): void {
    if (olderThan) {
      this.events = this.events.filter(e => e.timestamp >= olderThan);
    } else {
      this.events = [];
    }
  }

  // Başarısız login kayıtlarını temizle
  clearFailedLogins(): void {
    this.failedLogins.clear();
  }
}

export const security = SecurityService.getInstance();
export default security; 