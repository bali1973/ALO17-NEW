// PayTR Production Configuration
export const PAYTR_CONFIG = {
  // Production credentials (gerçek hesap bilgileri)
  PRODUCTION: {
    merchantId: process.env.PAYTR_MERCHANT_ID || 'YOUR_MERCHANT_ID',
    merchantKey: process.env.PAYTR_MERCHANT_KEY || 'YOUR_MERCHANT_KEY',
    merchantSalt: process.env.PAYTR_MERCHANT_SALT || 'YOUR_MERCHANT_SALT',
    testMode: false,
    apiUrl: 'https://www.paytr.com/odeme/api',
    paymentUrl: 'https://www.paytr.com/odeme/guvenli',
  },
  
  // Test credentials (test hesabı bilgileri)
  TEST: {
    merchantId: process.env.PAYTR_TEST_MERCHANT_ID || 'TEST_MERCHANT_ID',
    merchantKey: process.env.PAYTR_TEST_MERCHANT_KEY || 'TEST_MERCHANT_KEY',
    merchantSalt: process.env.PAYTR_TEST_MERCHANT_SALT || 'TEST_MERCHANT_SALT',
    testMode: true,
    apiUrl: 'https://www.paytr.com/odeme/api',
    paymentUrl: 'https://www.paytr.com/odeme/guvenli',
  },
  
  // Environment detection
  getConfig() {
    return process.env.NODE_ENV === 'production' 
      ? this.PRODUCTION 
      : this.TEST;
  },
  
  // Callback URLs
  callbacks: {
    success: 'alo17://payment/success',
    fail: 'alo17://payment/failed',
    cancel: 'alo17://payment/cancelled',
  },
  
  // Payment options
  options: {
    currency: 'TRY',
    language: 'tr',
    maxInstallment: 12,
    noInstallment: 0,
    debugMode: process.env.NODE_ENV !== 'production',
  },
};

// PayTR API endpoints
export const PAYTR_ENDPOINTS = {
  getToken: '/get-token',
  paymentDetail: '/payment-detail',
  refund: '/refund',
  cancel: '/cancel',
};

// PayTR error codes
export const PAYTR_ERROR_CODES = {
  '1': 'Bilgiler eksik',
  '2': 'Hash doğrulaması başarısız',
  '3': 'Merchant ID bulunamadı',
  '4': 'Merchant Key bulunamadı',
  '5': 'Merchant Salt bulunamadı',
  '6': 'Test modu aktif',
  '7': 'IP adresi güvenli değil',
  '8': 'Tutar 0\'dan büyük olmalı',
  '9': 'Sepet boş olamaz',
  '10': 'E-posta adresi geçersiz',
  '11': 'Kullanıcı adı boş olamaz',
  '12': 'Adres boş olamaz',
  '13': 'Telefon boş olamaz',
  '14': 'Sepet formatı hatalı',
  '15': 'Merchant ID aktif değil',
  '16': 'Merchant Key aktif değil',
  '17': 'Merchant Salt aktif değil',
  '18': 'Test modu kapalı',
  '19': 'IP adresi güvenli',
  '20': 'Tutar 0\'dan büyük',
  '21': 'Sepet dolu',
  '22': 'E-posta adresi geçerli',
  '23': 'Kullanıcı adı dolu',
  '24': 'Adres dolu',
  '25': 'Telefon dolu',
  '26': 'Sepet formatı doğru',
  '27': 'Merchant ID aktif',
  '28': 'Merchant Key aktif',
  '29': 'Merchant Salt aktif',
  '30': 'Test modu açık',
};

// PayTR payment status codes
export const PAYTR_STATUS_CODES = {
  'success': 'Başarılı',
  'failed': 'Başarısız',
  'pending': 'Beklemede',
  'cancelled': 'İptal Edildi',
  'refunded': 'İade Edildi',
}; 