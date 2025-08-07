import { NativeModules, Platform } from 'react-native';

const { PaymentModule } = NativeModules;

export interface PaymentData {
  amount: number;
  currency?: string;
  description?: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  userAddress: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  useNFC?: boolean;
}

export interface PaymentResult {
  status: 'success' | 'failed' | 'cancelled';
  token?: string;
  amount?: number;
  error?: string;
  paymentMethod?: 'paytr' | 'nfc';
  transactionId?: string;
}

export class AndroidPaymentModule {
  /**
   * PayTR ödeme işlemi başlat
   */
  static async startPayTRPayment(paymentData: PaymentData): Promise<PaymentResult> {
    if (Platform.OS !== 'android') {
      throw new Error('PayTR ödeme sadece Android\'de desteklenir');
    }

    try {
      // PayTR token al
      const token = await this.getPayTRToken(paymentData);
      
      // PayTR ödeme URL'ini oluştur
      const paymentUrl = this.buildPayTRPaymentUrl(token, paymentData);
      
      // Android Activity'yi başlat
      const result = await PaymentModule.startPayTRPayment({
        paymentUrl,
        successUrl: 'alo17://payment/success',
        failUrl: 'alo17://payment/failed',
        cancelUrl: 'alo17://payment/cancelled',
      });

      return this.parsePaymentResult(result);
    } catch (error) {
      console.error('PayTR payment error:', error);
      return {
        status: 'failed',
        error: error.message || 'PayTR ödeme başlatılamadı',
        paymentMethod: 'paytr',
      };
    }
  }

  /**
   * NFC ödeme işlemi başlat
   */
  static async startNFCPayment(paymentData: PaymentData): Promise<PaymentResult> {
    if (Platform.OS !== 'android') {
      throw new Error('NFC ödeme sadece Android\'de desteklenir');
    }

    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv) {
      throw new Error('NFC ödeme için kart bilgileri gerekli');
    }

    try {
      // Android NFC Activity'yi başlat
      const result = await PaymentModule.startNFCPayment({
        amount: paymentData.amount,
        cardNumber: paymentData.cardNumber,
        expiryDate: paymentData.expiryDate,
        cvv: paymentData.cvv,
      });

      return this.parsePaymentResult(result);
    } catch (error) {
      console.error('NFC payment error:', error);
      return {
        status: 'failed',
        error: error.message || 'NFC ödeme başlatılamadı',
        paymentMethod: 'nfc',
      };
    }
  }

  /**
   * PayTR token al
   */
  private static async getPayTRToken(paymentData: PaymentData): Promise<string> {
    const config = require('../config/paytr').PAYTR_CONFIG.getConfig();
    
    const tokenData = {
      merchant_id: config.merchantId,
      user_ip: await this.getUserIP(),
      merchant_oid: this.generateOrderId(),
      email: paymentData.userEmail,
      payment_amount: paymentData.amount * 100, // PayTR kuruş cinsinden bekler
      currency: paymentData.currency || 'TL',
      test_mode: config.testMode ? '1' : '0',
      no_installment: '0',
      max_installment: '12',
      user_name: paymentData.userName,
      user_address: paymentData.userAddress,
      user_phone: paymentData.userPhone,
      merchant_ok_url: config.callbacks.success,
      merchant_fail_url: config.callbacks.fail,
      user_basket: this.buildUserBasket(paymentData),
      timeout_limit: '30',
      debug_on: config.options.debugMode ? '1' : '0',
      lang: config.options.language,
    };

    // Hash oluştur
    const hashStr = `${tokenData.merchant_id}${tokenData.user_ip}${tokenData.merchant_oid}${tokenData.email}${tokenData.payment_amount}${tokenData.currency}${tokenData.test_mode}${tokenData.no_installment}${tokenData.max_installment}${tokenData.user_name}${tokenData.user_address}${tokenData.user_phone}${tokenData.merchant_ok_url}${tokenData.merchant_fail_url}${tokenData.user_basket}${tokenData.timeout_limit}${tokenData.debug_on}${tokenData.lang}${config.merchantSalt}`;
    
    const hash = await this.generateHash(hashStr);
    tokenData.hash = hash;

    // PayTR API'ye token isteği gönder
    const response = await fetch(`${config.apiUrl}/get-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(tokenData).toString(),
    });

    const result = await response.json();
    
    if (result.status === 'success') {
      return result.token;
    } else {
      throw new Error(result.reason || 'PayTR token alınamadı');
    }
  }

  /**
   * PayTR ödeme URL'ini oluştur
   */
  private static buildPayTRPaymentUrl(token: string, paymentData: PaymentData): string {
    const config = require('../config/paytr').PAYTR_CONFIG.getConfig();
    
    return `${config.paymentUrl}?token=${token}`;
  }

  /**
   * Kullanıcı IP adresini al
   */
  private static async getUserIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return '127.0.0.1';
    }
  }

  /**
   * Sipariş ID oluştur
   */
  private static generateOrderId(): string {
    return `ALO17_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Kullanıcı sepeti oluştur
   */
  private static buildUserBasket(paymentData: PaymentData): string {
    const basket = [
      {
        name: paymentData.description || 'Alo17 Ödeme',
        price: paymentData.amount,
        quantity: 1,
      },
    ];
    
    return btoa(JSON.stringify(basket));
  }

  /**
   * SHA256 hash oluştur
   */
  private static async generateHash(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Ödeme sonucunu parse et
   */
  private static parsePaymentResult(result: any): PaymentResult {
    if (result.status === 'success') {
      return {
        status: 'success',
        token: result.token,
        amount: result.amount,
        paymentMethod: result.payment_method || 'paytr',
        transactionId: result.transaction_id,
      };
    } else if (result.status === 'cancelled') {
      return {
        status: 'cancelled',
        paymentMethod: result.payment_method || 'paytr',
      };
    } else {
      return {
        status: 'failed',
        error: result.error || 'Ödeme başarısız',
        paymentMethod: result.payment_method || 'paytr',
      };
    }
  }

  /**
   * NFC desteğini kontrol et
   */
  static async isNFCSupported(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return false;
    }

    try {
      return await PaymentModule.isNFCSupported();
    } catch (error) {
      return false;
    }
  }

  /**
   * NFC etkin mi kontrol et
   */
  static async isNFCEnabled(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return false;
    }

    try {
      return await PaymentModule.isNFCEnabled();
    } catch (error) {
      return false;
    }
  }

  /**
   * NFC ayarlarını aç
   */
  static async openNFCSettings(): Promise<void> {
    if (Platform.OS !== 'android') {
      return;
    }

    try {
      await PaymentModule.openNFCSettings();
    } catch (error) {
      console.error('NFC settings error:', error);
    }
  }
}

export default AndroidPaymentModule; 