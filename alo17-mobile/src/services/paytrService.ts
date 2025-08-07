import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

export interface PayTRConfig {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  testMode: boolean;
}

export interface PayTRPaymentRequest {
  merchant_id: string;
  user_ip: string;
  merchant_oid: string;
  email: string;
  payment_amount: number;
  currency: string;
  test_mode: number;
  no_installment: number;
  max_installment: number;
  user_name: string;
  user_address: string;
  user_phone: string;
  merchant_ok_url: string;
  merchant_fail_url: string;
  user_basket: string;
  debug_on: number;
  lang: string;
  hash_str: string;
  hash: string;
}

export interface PayTRPaymentResponse {
  status: string;
  reason: string;
  token: string;
  payment_url?: string;
}

export interface NFCPaymentData {
  cardNumber: string;
  expiryDate: string;
  cardHolderName: string;
  amount: number;
  currency: string;
}

class PayTRService {
  private config: PayTRConfig = {
    merchantId: '123456', // Test merchant ID
    merchantKey: 'test_key_123456',
    merchantSalt: 'test_salt_123456',
    testMode: true,
  };

  private isNfcSupported = false;
  private isNfcEnabled = false;

  // PayTR servisini başlat
  async initialize() {
    try {
      // NFC desteğini kontrol et
      await this.checkNfcSupport();
      
      // PayTR konfigürasyonunu yükle
      await this.loadConfig();
      
      console.log('PayTR servisi başlatıldı');
    } catch (error) {
      console.error('PayTR servisi başlatılamadı:', error);
    }
  }

  // NFC desteğini kontrol et
  private async checkNfcSupport() {
    try {
      if (Platform.OS === 'ios') {
        // iOS için NFC desteği kontrolü
        const isSupported = await NfcManager.isSupported();
        if (isSupported) {
          await NfcManager.start();
          this.isNfcSupported = true;
          this.isNfcEnabled = true;
          console.log('NFC desteği aktif');
        }
      } else if (Platform.OS === 'android') {
        // Android için NFC desteği kontrolü
        const isSupported = await NfcManager.isSupported();
        if (isSupported) {
          await NfcManager.start();
          this.isNfcSupported = true;
          this.isNfcEnabled = true;
          console.log('NFC desteği aktif');
        }
      }
    } catch (error) {
      console.error('NFC desteği kontrol edilemedi:', error);
      this.isNfcSupported = false;
      this.isNfcEnabled = false;
    }
  }

  // PayTR konfigürasyonunu yükle
  private async loadConfig() {
    try {
      const savedConfig = await AsyncStorage.getItem('paytr-config');
      if (savedConfig) {
        this.config = { ...this.config, ...JSON.parse(savedConfig) };
      }
    } catch (error) {
      console.error('PayTR konfigürasyonu yüklenemedi:', error);
    }
  }

  // PayTR konfigürasyonunu kaydet
  async saveConfig(config: Partial<PayTRConfig>) {
    try {
      this.config = { ...this.config, ...config };
      await AsyncStorage.setItem('paytr-config', JSON.stringify(this.config));
    } catch (error) {
      console.error('PayTR konfigürasyonu kaydedilemedi:', error);
    }
  }

  // PayTR ödeme başlat
  async startPayment(paymentData: {
    amount: number;
    currency: string;
    email: string;
    userName: string;
    userAddress: string;
    userPhone: string;
    basket: Array<{ name: string; price: number; quantity: number }>;
  }): Promise<PayTRPaymentResponse> {
    try {
      const merchantOid = this.generateMerchantOid();
      const userIp = await this.getUserIP();
      
      // Sepet verilerini hazırla
      const basketStr = paymentData.basket
        .map(item => `${item.name}:${item.price}:${item.quantity}`)
        .join(';');

      // Hash oluştur
      const hashStr = `${this.config.merchantId}${userIp}${merchantOid}${paymentData.email}${paymentData.amount}${paymentData.basket.map(item => item.name).join(';')}${paymentData.userName}${paymentData.userAddress}${paymentData.userPhone}${basketStr}${this.config.testMode ? '1' : '0'}${this.config.merchantSalt}`;
      
      const hash = this.generateHash(hashStr);

      const paymentRequest: PayTRPaymentRequest = {
        merchant_id: this.config.merchantId,
        user_ip: userIp,
        merchant_oid: merchantOid,
        email: paymentData.email,
        payment_amount: paymentData.amount * 100, // Kuruş cinsinden
        currency: paymentData.currency,
        test_mode: this.config.testMode ? 1 : 0,
        no_installment: 0,
        max_installment: 12,
        user_name: paymentData.userName,
        user_address: paymentData.userAddress,
        user_phone: paymentData.userPhone,
        merchant_ok_url: 'alo17://payment/success',
        merchant_fail_url: 'alo17://payment/failed',
        user_basket: basketStr,
        debug_on: 1,
        lang: 'tr',
        hash_str: hashStr,
        hash: hash,
      };

      // PayTR API'ye gönder
      const response = await this.sendToPayTR(paymentRequest);
      
      return response;
    } catch (error) {
      console.error('PayTR ödeme başlatılamadı:', error);
      throw error;
    }
  }

  // PayTR API'ye istek gönder
  private async sendToPayTR(request: PayTRPaymentRequest): Promise<PayTRPaymentResponse> {
    try {
      const formData = new FormData();
      
      Object.entries(request).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        return {
          status: 'success',
          reason: result.reason,
          token: result.token,
          payment_url: `https://www.paytr.com/odeme/guvenli/${result.token}`,
        };
      } else {
        throw new Error(result.reason || 'Ödeme başlatılamadı');
      }
    } catch (error) {
      console.error('PayTR API hatası:', error);
      throw error;
    }
  }

  // NFC ile ödeme yap
  async processNfcPayment(paymentData: NFCPaymentData): Promise<boolean> {
    try {
      if (!this.isNfcSupported) {
        throw new Error('NFC desteği bulunamadı');
      }

      if (!this.isNfcEnabled) {
        throw new Error('NFC etkin değil');
      }

      // NFC kartını oku
      const cardData = await this.readNfcCard();
      
      // Kart verilerini doğrula
      if (!this.validateCardData(cardData, paymentData)) {
        throw new Error('Kart verileri doğrulanamadı');
      }

      // PayTR ile ödeme işlemini başlat
      const paymentResponse = await this.startPayment({
        amount: paymentData.amount,
        currency: paymentData.currency,
        email: 'nfc@alo17.com', // NFC ödemeler için özel e-posta
        userName: paymentData.cardHolderName,
        userAddress: 'NFC Ödeme',
        userPhone: 'NFC',
        basket: [{
          name: 'NFC Ödeme',
          price: paymentData.amount,
          quantity: 1,
        }],
      });

      if (paymentResponse.status === 'success') {
        Alert.alert('Başarılı', 'NFC ödeme işlemi tamamlandı');
        return true;
      } else {
        throw new Error(paymentResponse.reason);
      }
    } catch (error) {
      console.error('NFC ödeme hatası:', error);
      Alert.alert('Hata', `NFC ödeme başarısız: ${error.message}`);
      return false;
    }
  }

  // NFC kartını oku
  private async readNfcCard(): Promise<any> {
    try {
      await NfcManager.requestTechnology(NfcTech.IsoDep);
      
      // Kart verilerini oku
      const response = await NfcManager.transceive([0x00, 0xA4, 0x04, 0x00, 0x07, 0xA0, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00]);
      
      // Kart numarasını oku
      const cardNumberResponse = await NfcManager.transceive([0x00, 0xB2, 0x01, 0x0C, 0x00]);
      
      // Son kullanma tarihini oku
      const expiryResponse = await NfcManager.transceive([0x00, 0xB2, 0x02, 0x0C, 0x00]);
      
      await NfcManager.cancelTechnologyRequest();
      
      return {
        cardNumber: this.parseCardNumber(cardNumberResponse),
        expiryDate: this.parseExpiryDate(expiryResponse),
        cardHolderName: 'NFC Kart',
      };
    } catch (error) {
      console.error('NFC kart okuma hatası:', error);
      throw error;
    }
  }

  // Kart verilerini doğrula
  private validateCardData(cardData: any, paymentData: NFCPaymentData): boolean {
    // Kart numarası kontrolü
    if (cardData.cardNumber !== paymentData.cardNumber) {
      return false;
    }
    
    // Son kullanma tarihi kontrolü
    if (cardData.expiryDate !== paymentData.expiryDate) {
      return false;
    }
    
    // Luhn algoritması ile kart numarası kontrolü
    if (!this.validateLuhn(cardData.cardNumber)) {
      return false;
    }
    
    return true;
  }

  // Luhn algoritması ile kart numarası doğrulama
  private validateLuhn(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }

  // Kart numarasını parse et
  private parseCardNumber(response: number[]): string {
    // NFC yanıtından kart numarasını çıkar
    const hexString = response.map(byte => byte.toString(16).padStart(2, '0')).join('');
    // Bu basit bir örnek, gerçek uygulamada daha karmaşık parsing gerekebilir
    return hexString.substring(0, 16);
  }

  // Son kullanma tarihini parse et
  private parseExpiryDate(response: number[]): string {
    // NFC yanıtından son kullanma tarihini çıkar
    const hexString = response.map(byte => byte.toString(16).padStart(2, '0')).join('');
    // Bu basit bir örnek, gerçek uygulamada daha karmaşık parsing gerekebilir
    return hexString.substring(0, 4);
  }

  // Kullanıcı IP adresini al
  private async getUserIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('IP adresi alınamadı:', error);
      return '127.0.0.1';
    }
  }

  // Merchant OID oluştur
  private generateMerchantOid(): string {
    return `ALO17_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Hash oluştur
  private generateHash(str: string): string {
    // SHA256 hash oluştur
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(str).digest('hex');
  }

  // NFC durumunu kontrol et
  isNfcAvailable(): boolean {
    return this.isNfcSupported && this.isNfcEnabled;
  }

  // NFC'yi etkinleştir
  async enableNfc(): Promise<boolean> {
    try {
      if (this.isNfcSupported) {
        await NfcManager.start();
        this.isNfcEnabled = true;
        return true;
      }
      return false;
    } catch (error) {
      console.error('NFC etkinleştirilemedi:', error);
      return false;
    }
  }

  // NFC'yi devre dışı bırak
  async disableNfc(): Promise<void> {
    try {
      await NfcManager.cancelTechnologyRequest();
      this.isNfcEnabled = false;
    } catch (error) {
      console.error('NFC devre dışı bırakılamadı:', error);
    }
  }

  // PayTR ödeme durumunu kontrol et
  async checkPaymentStatus(merchantOid: string): Promise<{
    status: string;
    amount: number;
    currency: string;
    timestamp: string;
  }> {
    try {
      const hashStr = `${this.config.merchantId}${merchantOid}${this.config.merchantSalt}`;
      const hash = this.generateHash(hashStr);

      const formData = new FormData();
      formData.append('merchant_id', this.config.merchantId);
      formData.append('merchant_oid', merchantOid);
      formData.append('hash', hash);

      const response = await fetch('https://www.paytr.com/odeme/api/payment-detail', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      return {
        status: result.status,
        amount: result.payment_amount / 100, // Kuruştan TL'ye çevir
        currency: result.currency,
        timestamp: result.payment_date,
      };
    } catch (error) {
      console.error('Ödeme durumu kontrol edilemedi:', error);
      throw error;
    }
  }

  // Test ödeme yap
  async makeTestPayment(amount: number = 1.00): Promise<boolean> {
    try {
      const paymentResponse = await this.startPayment({
        amount,
        currency: 'TRY',
        email: 'test@alo17.com',
        userName: 'Test Kullanıcı',
        userAddress: 'Test Adres',
        userPhone: '5551234567',
        basket: [{
          name: 'Test Ürün',
          price: amount,
          quantity: 1,
        }],
      });

      if (paymentResponse.status === 'success') {
        Alert.alert('Test Ödeme', `Test ödeme başarılı! Token: ${paymentResponse.token}`);
        return true;
      } else {
        Alert.alert('Test Ödeme Hatası', paymentResponse.reason);
        return false;
      }
    } catch (error) {
      console.error('Test ödeme hatası:', error);
      Alert.alert('Test Ödeme Hatası', error.message);
      return false;
    }
  }
}

export default new PayTRService(); 