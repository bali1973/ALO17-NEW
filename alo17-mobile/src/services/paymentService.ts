import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank_transfer' | 'cash';
  name: string;
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number; // Gün cinsinden
  features: string[];
  isPopular?: boolean;
}

export interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  description: string;
  timestamp: string;
  receiptUrl?: string;
}

export interface Subscription {
  id: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  nextBillingDate?: string;
}

class PaymentService {
  private paymentMethods: PaymentMethod[] = [];
  private transactions: PaymentTransaction[] = [];
  private currentSubscription: Subscription | null = null;

  // Ödeme planlarını getir
  async getPaymentPlans(): Promise<PaymentPlan[]> {
    try {
      // API'den ödeme planlarını al
      // const response = await fetch('/api/payment/plans');
      // return response.json();
      
      // Mock data
      return [
        {
          id: 'basic',
          name: 'Temel Plan',
          description: 'Temel özellikler',
          price: 29.99,
          currency: 'TRY',
          duration: 30,
          features: [
            'Günlük 10 ilan',
            'Temel arama',
            'E-posta desteği'
          ]
        },
        {
          id: 'premium',
          name: 'Premium Plan',
          description: 'Gelişmiş özellikler',
          price: 59.99,
          currency: 'TRY',
          duration: 30,
          features: [
            'Sınırsız ilan',
            'Öncelikli destek',
            'Gelişmiş arama',
            'İstatistikler',
            'Reklam yok'
          ],
          isPopular: true
        },
        {
          id: 'business',
          name: 'İş Planı',
          description: 'Kurumsal özellikler',
          price: 149.99,
          currency: 'TRY',
          duration: 30,
          features: [
            'Tüm Premium özellikler',
            'API erişimi',
            'Özel destek',
            'Çoklu hesap',
            'Raporlama'
          ]
        }
      ];
    } catch (error) {
      console.error('Ödeme planları alınamadı:', error);
      throw error;
    }
  }

  // Ödeme yöntemlerini getir
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const savedMethods = await AsyncStorage.getItem('payment-methods');
      if (savedMethods) {
        this.paymentMethods = JSON.parse(savedMethods);
      }
      return this.paymentMethods;
    } catch (error) {
      console.error('Ödeme yöntemleri alınamadı:', error);
      return [];
    }
  }

  // Ödeme yöntemi ekle
  async addPaymentMethod(method: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    try {
      const newMethod: PaymentMethod = {
        ...method,
        id: this.generateId(),
      };

      this.paymentMethods.push(newMethod);
      await this.savePaymentMethods();

      return newMethod;
    } catch (error) {
      console.error('Ödeme yöntemi eklenemedi:', error);
      throw error;
    }
  }

  // Ödeme yöntemi kaldır
  async removePaymentMethod(methodId: string): Promise<void> {
    try {
      this.paymentMethods = this.paymentMethods.filter(m => m.id !== methodId);
      await this.savePaymentMethods();
    } catch (error) {
      console.error('Ödeme yöntemi kaldırılamadı:', error);
      throw error;
    }
  }

  // Varsayılan ödeme yöntemini ayarla
  async setDefaultPaymentMethod(methodId: string): Promise<void> {
    try {
      this.paymentMethods = this.paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }));
      await this.savePaymentMethods();
    } catch (error) {
      console.error('Varsayılan ödeme yöntemi ayarlanamadı:', error);
      throw error;
    }
  }

  // Ödeme yap
  async processPayment(planId: string, paymentMethodId: string): Promise<PaymentTransaction> {
    try {
      const plans = await this.getPaymentPlans();
      const plan = plans.find(p => p.id === planId);
      
      if (!plan) {
        throw new Error('Plan bulunamadı');
      }

      const method = this.paymentMethods.find(m => m.id === paymentMethodId);
      if (!method) {
        throw new Error('Ödeme yöntemi bulunamadı');
      }

      // Ödeme işlemini başlat
      const transaction: PaymentTransaction = {
        id: this.generateId(),
        amount: plan.price,
        currency: plan.currency,
        status: 'pending',
        paymentMethod: method.name,
        description: `${plan.name} - ${plan.duration} gün`,
        timestamp: new Date().toISOString(),
      };

      // Ödeme işlemini simüle et
      await this.simulatePayment(transaction);

      // İşlemi kaydet
      this.transactions.push(transaction);
      await this.saveTransactions();

      return transaction;
    } catch (error) {
      console.error('Ödeme işlemi başarısız:', error);
      throw error;
    }
  }

  // Ödeme simülasyonu
  private async simulatePayment(transaction: PaymentTransaction): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // %90 başarı oranı
        if (Math.random() > 0.1) {
          transaction.status = 'completed';
          transaction.receiptUrl = `https://alo17.com/receipt/${transaction.id}`;
          resolve();
        } else {
          transaction.status = 'failed';
          reject(new Error('Ödeme başarısız'));
        }
      }, 2000);
    });
  }

  // Abonelik oluştur
  async createSubscription(planId: string, paymentMethodId: string): Promise<Subscription> {
    try {
      const transaction = await this.processPayment(planId, paymentMethodId);
      
      if (transaction.status !== 'completed') {
        throw new Error('Ödeme başarısız');
      }

      const plans = await this.getPaymentPlans();
      const plan = plans.find(p => p.id === planId);
      
      if (!plan) {
        throw new Error('Plan bulunamadı');
      }

      const subscription: Subscription = {
        id: this.generateId(),
        planId,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: true,
        nextBillingDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000).toISOString(),
      };

      this.currentSubscription = subscription;
      await this.saveSubscription();

      return subscription;
    } catch (error) {
      console.error('Abonelik oluşturulamadı:', error);
      throw error;
    }
  }

  // Aboneliği iptal et
  async cancelSubscription(): Promise<void> {
    try {
      if (this.currentSubscription) {
        this.currentSubscription.status = 'cancelled';
        this.currentSubscription.autoRenew = false;
        await this.saveSubscription();
      }
    } catch (error) {
      console.error('Abonelik iptal edilemedi:', error);
      throw error;
    }
  }

  // Aboneliği yenile
  async renewSubscription(): Promise<void> {
    try {
      if (this.currentSubscription && this.currentSubscription.status === 'active') {
        const plans = await this.getPaymentPlans();
        const plan = plans.find(p => p.id === this.currentSubscription!.planId);
        
        if (plan) {
          this.currentSubscription.endDate = new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000).toISOString();
          this.currentSubscription.nextBillingDate = new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000).toISOString();
          await this.saveSubscription();
        }
      }
    } catch (error) {
      console.error('Abonelik yenilenemedi:', error);
      throw error;
    }
  }

  // İşlem geçmişini getir
  async getTransactionHistory(): Promise<PaymentTransaction[]> {
    try {
      const savedTransactions = await AsyncStorage.getItem('payment-transactions');
      if (savedTransactions) {
        this.transactions = JSON.parse(savedTransactions);
      }
      return this.transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('İşlem geçmişi alınamadı:', error);
      return [];
    }
  }

  // Mevcut aboneliği getir
  async getCurrentSubscription(): Promise<Subscription | null> {
    try {
      const savedSubscription = await AsyncStorage.getItem('current-subscription');
      if (savedSubscription) {
        this.currentSubscription = JSON.parse(savedSubscription);
      }
      return this.currentSubscription;
    } catch (error) {
      console.error('Mevcut abonelik alınamadı:', error);
      return null;
    }
  }

  // Abonelik durumunu kontrol et
  async checkSubscriptionStatus(): Promise<boolean> {
    try {
      const subscription = await this.getCurrentSubscription();
      
      if (!subscription) return false;
      
      if (subscription.status !== 'active') return false;
      
      const endDate = new Date(subscription.endDate);
      const now = new Date();
      
      if (endDate < now) {
        subscription.status = 'expired';
        await this.saveSubscription();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Abonelik durumu kontrol edilemedi:', error);
      return false;
    }
  }

  // Ödeme yöntemlerini kaydet
  private async savePaymentMethods() {
    try {
      await AsyncStorage.setItem('payment-methods', JSON.stringify(this.paymentMethods));
    } catch (error) {
      console.error('Ödeme yöntemleri kaydedilemedi:', error);
    }
  }

  // İşlemleri kaydet
  private async saveTransactions() {
    try {
      await AsyncStorage.setItem('payment-transactions', JSON.stringify(this.transactions));
    } catch (error) {
      console.error('İşlemler kaydedilemedi:', error);
    }
  }

  // Aboneliği kaydet
  private async saveSubscription() {
    try {
      await AsyncStorage.setItem('current-subscription', JSON.stringify(this.currentSubscription));
    } catch (error) {
      console.error('Abonelik kaydedilemedi:', error);
    }
  }

  // ID oluştur
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Stripe entegrasyonu (gelecekte eklenebilir)
  async setupStripePayment(paymentMethod: any): Promise<PaymentMethod> {
    // Stripe entegrasyonu burada yapılacak
    throw new Error('Stripe entegrasyonu henüz eklenmedi');
  }

  // PayPal entegrasyonu (gelecekte eklenebilir)
  async setupPayPalPayment(paypalToken: string): Promise<PaymentMethod> {
    // PayPal entegrasyonu burada yapılacak
    throw new Error('PayPal entegrasyonu henüz eklenmedi');
  }
}

export default new PaymentService(); 