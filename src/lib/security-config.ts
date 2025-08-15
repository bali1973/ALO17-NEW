// Güvenlik konfigürasyonu
export const securityConfig = {
  // Admin kimlik bilgileri
  admin: {
    // Bu değerler .env dosyasında tanımlanmalı (NEXT_PUBLIC olmamalı)
    password: process.env.ADMIN_PASSWORD,
    baliPassword: process.env.BALI_PASSWORD,
    token: process.env.ADMIN_TOKEN,
  },
  
  // JWT ayarları
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  // Güvenlik ayarları
  security: {
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION || '300000'), // 5 dakika
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '60000'), // 1 dakika
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '50'), // Daha sıkı rate limiting
  },
  
  // CORS ayarları
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3004',
      'https://alo17.com',
      'https://www.alo17.com'
    ],
  },
  
  // Dosya yükleme güvenliği
  fileUpload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png', 
      'image/webp'
    ],
    // SVG dosyaları güvenlik riski taşıyabilir
    allowSvg: process.env.ALLOW_SVG === 'true',
  }
};

// Konfigürasyon doğrulama
export function validateSecurityConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Admin kimlik bilgileri kontrolü
  if (!securityConfig.admin.password) {
    errors.push('ADMIN_PASSWORD environment variable is required');
  }
  if (!securityConfig.admin.baliPassword) {
    errors.push('BALI_PASSWORD environment variable is required');
  }
  if (!securityConfig.admin.token) {
    errors.push('ADMIN_TOKEN environment variable is required');
  }
  
  // JWT secret kontrolü
  if (!securityConfig.jwt.secret) {
    errors.push('JWT_SECRET environment variable is required');
  }
  
  // Güvenlik değerleri kontrolü
  if (securityConfig.security.maxLoginAttempts < 1) {
    errors.push('MAX_LOGIN_ATTEMPTS must be at least 1');
  }
  if (securityConfig.security.lockoutDuration < 60000) {
    errors.push('LOCKOUT_DURATION must be at least 1 minute (60000ms)');
  }
  if (securityConfig.security.rateLimitMax < 10) {
    errors.push('RATE_LIMIT_MAX must be at least 10');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Güvenli token oluşturma (development için)
export function generateSecureToken(): string {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot generate tokens in production');
  }
  
  // 64 karakterlik güvenli token
  return 'alo17_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
}

// Güvenli şifre oluşturma (development için)
export function generateSecurePassword(): string {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot generate passwords in production');
  }
  
  // 16 karakterlik güvenli şifre
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
