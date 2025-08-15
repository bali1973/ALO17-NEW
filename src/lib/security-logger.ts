// Güvenlik loglama sistemi
export interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: 'login_attempt' | 'file_upload' | 'suspicious_activity' | 'rate_limit_exceeded' | 'admin_access' | 'xss_attempt' | 'sql_injection_attempt';
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip: string;
  userAgent?: string;
  userId?: string;
  details: Record<string, any>;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface SecurityThreat {
  id: string;
  timestamp: Date;
  type: string;
  ip: string;
  pattern: string;
  url: string;
  userAgent?: string;
  blocked: boolean;
  action: 'blocked' | 'logged' | 'challenged';
}

class SecurityLogger {
  private static instance: SecurityLogger;
  private events: SecurityEvent[] = [];
  private threats: SecurityThreat[] = [];
  private maxEvents = 1000; // Maksimum 1000 olay sakla
  private maxThreats = 500; // Maksimum 500 tehdit sakla

  private constructor() {
    // Singleton pattern
  }

  static getInstance(): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger();
    }
    return SecurityLogger.instance;
  }

  // Güvenlik olayı logla
  logEvent(
    type: SecurityEvent['type'],
    severity: SecurityEvent['severity'],
    ip: string,
    details: Record<string, any>,
    userAgent?: string,
    userId?: string
  ): void {
    const event: SecurityEvent = {
      id: this.generateId(),
      timestamp: new Date(),
      type,
      severity,
      ip,
      userAgent,
      userId,
      details,
      resolved: false
    };

    this.events.push(event);
    
    // Maksimum olay sayısını aş
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Console'a log (development için)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[SECURITY] ${severity.toUpperCase()}: ${type}`, {
        ip,
        userId,
        details,
        timestamp: event.timestamp.toISOString()
      });
    }

    // Production'da güvenlik servisine gönder
    if (process.env.NODE_ENV === 'production') {
      this.sendToSecurityService(event);
    }
  }

  // Tehdit tespit et ve logla
  detectThreat(
    type: string,
    ip: string,
    pattern: string,
    url: string,
    userAgent?: string
  ): SecurityThreat {
    const threat: SecurityThreat = {
      id: this.generateId(),
      timestamp: new Date(),
      type,
      ip,
      pattern,
      url,
      userAgent,
      blocked: true,
      action: 'blocked'
    };

    this.threats.push(threat);
    
    // Maksimum tehdit sayısını aş
    if (this.threats.length > this.maxThreats) {
      this.threats = this.threats.slice(-this.maxThreats);
    }

    // Güvenlik olayı olarak da logla
    this.logEvent('suspicious_activity', 'high', ip, {
      threatType: type,
      pattern,
      url,
      userAgent,
      action: 'blocked'
    });

    return threat;
  }

  // Başarısız giriş denemesi logla
  logFailedLogin(ip: string, email: string, userAgent?: string): void {
    this.logEvent('login_attempt', 'medium', ip, {
      email,
      success: false,
      reason: 'invalid_credentials'
    }, userAgent);
  }

  // Başarılı admin girişi logla
  logAdminLogin(ip: string, email: string, userAgent?: string): void {
    this.logEvent('admin_access', 'low', ip, {
      email,
      success: true,
      action: 'login'
    }, userAgent);
  }

  // Dosya yükleme güvenlik olayı logla
  logFileUpload(ip: string, filename: string, fileSize: number, success: boolean, reason?: string, userId?: string): void {
    this.logEvent('file_upload', success ? 'low' : 'medium', ip, {
      filename,
      fileSize,
      success,
      reason,
      userId
    });
  }

  // Rate limit aşımı logla
  logRateLimitExceeded(ip: string, endpoint: string, userAgent?: string): void {
    this.logEvent('rate_limit_exceeded', 'medium', ip, {
      endpoint,
      action: 'blocked'
    }, userAgent);
  }

  // XSS girişimi logla
  logXSSAttempt(ip: string, payload: string, url: string, userAgent?: string): void {
    this.logEvent('xss_attempt', 'high', ip, {
      payload,
      url,
      action: 'blocked'
    }, userAgent);
  }

  // SQL injection girişimi logla
  logSQLInjectionAttempt(ip: string, pattern: string, url: string, userAgent?: string): void {
    this.logEvent('sql_injection_attempt', 'high', ip, {
      pattern,
      url,
      action: 'blocked'
    }, userAgent);
  }

  // Olayları getir
  getEvents(limit: number = 100, severity?: SecurityEvent['severity']): SecurityEvent[] {
    let events = this.events;
    
    if (severity) {
      events = events.filter(event => event.severity === severity);
    }
    
    return events.slice(-limit).reverse();
  }

  // Tehditleri getir
  getThreats(limit: number = 100): SecurityThreat[] {
    return this.threats.slice(-limit).reverse();
  }

  // İstatistikleri getir
  getStats(): {
    totalEvents: number;
    totalThreats: number;
    eventsBySeverity: Record<SecurityEvent['severity'], number>;
    eventsByType: Record<SecurityEvent['type'], number>;
    recentThreats: number;
  } {
    const eventsBySeverity = this.events.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<SecurityEvent['severity'], number>);

    const eventsByType = this.events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<SecurityEvent['type'], number>);

    const recentThreats = this.threats.filter(
      threat => threat.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length;

    return {
      totalEvents: this.events.length,
      totalThreats: this.threats.length,
      eventsBySeverity,
      eventsByType,
      recentThreats
    };
  }

  // Olayı çözüldü olarak işaretle
  resolveEvent(eventId: string, resolvedBy: string): boolean {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.resolved = true;
      event.resolvedAt = new Date();
      event.resolvedBy = resolvedBy;
      return true;
    }
    return false;
  }

  // Güvenlik servisine gönder (production için)
  private async sendToSecurityService(event: SecurityEvent): Promise<void> {
    try {
      // Burada gerçek güvenlik servisine gönderim yapılabilir
      // Örnek: Sentry, LogRocket, custom security API
      if (process.env.SECURITY_WEBHOOK_URL) {
        await fetch(process.env.SECURITY_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event)
        });
      }
    } catch (error) {
      console.error('Failed to send security event:', error);
    }
  }

  // Benzersiz ID oluştur
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Global instance
export const securityLogger = SecurityLogger.getInstance();

// Kolay kullanım için helper fonksiyonlar
export const logSecurityEvent = (
  type: SecurityEvent['type'],
  severity: SecurityEvent['severity'],
  ip: string,
  details: Record<string, any>,
  userAgent?: string,
  userId?: string
) => securityLogger.logEvent(type, severity, ip, details, userAgent, userId);

export const logFailedLogin = (ip: string, email: string, userAgent?: string) => 
  securityLogger.logFailedLogin(ip, email, userAgent);

export const logAdminLogin = (ip: string, email: string, userAgent?: string) => 
  securityLogger.logAdminLogin(ip, email, userAgent);

export const logFileUpload = (ip: string, filename: string, fileSize: number, success: boolean, reason?: string, userId?: string) => 
  securityLogger.logFileUpload(ip, filename, fileSize, success, reason, userId);

export const logRateLimitExceeded = (ip: string, endpoint: string, userAgent?: string) => 
  securityLogger.logRateLimitExceeded(ip, endpoint, userAgent);

export const logXSSAttempt = (ip: string, payload: string, url: string, userAgent?: string) => 
  securityLogger.logXSSAttempt(ip, payload, url, userAgent);

export const logSQLInjectionAttempt = (ip: string, pattern: string, url: string, userAgent?: string) => 
  securityLogger.logSQLInjectionAttempt(ip, pattern, url, userAgent);
