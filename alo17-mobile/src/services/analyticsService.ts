import AsyncStorage from '@react-native-async-storage/async-storage';

interface AnalyticsEvent {
  id: string;
  event: string;
  properties: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

interface PerformanceMetric {
  id: string;
  metric: string;
  value: number;
  unit: string;
  timestamp: number;
  context: Record<string, any>;
}

interface UserSession {
  id: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  events: AnalyticsEvent[];
  metrics: PerformanceMetric[];
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private currentSession: UserSession | null = null;
  private isEnabled = true;
  private batchSize = 50;
  private flushInterval = 30000; // 30 saniye
  private flushTimer: NodeJS.Timeout | null = null;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async initialize() {
    await this.loadSettings();
    this.startSession();
    this.startFlushTimer();
  }

  private async loadSettings() {
    try {
      const settings = await AsyncStorage.getItem('analyticsSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        this.isEnabled = parsed.enabled ?? true;
        this.batchSize = parsed.batchSize ?? 50;
        this.flushInterval = parsed.flushInterval ?? 30000;
      }
    } catch (error) {
      console.error('Error loading analytics settings:', error);
    }
  }

  private startSession() {
    this.currentSession = {
      id: this.generateSessionId(),
      startTime: Date.now(),
      events: [],
      metrics: [],
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private startFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flushAnalytics();
    }, this.flushInterval);
  }

  // Olay takibi
  async trackEvent(event: string, properties: Record<string, any> = {}) {
    if (!this.isEnabled || !this.currentSession) return;

    const analyticsEvent: AnalyticsEvent = {
      id: this.generateEventId(),
      event,
      properties: {
        ...properties,
        platform: 'mobile',
        appVersion: '1.0.0', // Uygulama versiyonunu dinamik olarak al
      },
      timestamp: Date.now(),
      sessionId: this.currentSession.id,
      userId: await this.getUserId(),
    };

    this.currentSession.events.push(analyticsEvent);

    // Batch boyutuna ulaşıldığında flush et
    if (this.currentSession.events.length >= this.batchSize) {
      this.flushAnalytics();
    }
  }

  // Sayfa görüntüleme takibi
  async trackScreenView(screenName: string, properties: Record<string, any> = {}) {
    await this.trackEvent('screen_view', {
      screen_name: screenName,
      ...properties,
    });
  }

  // İlan görüntüleme takibi
  async trackListingView(listingId: string, listingTitle: string, properties: Record<string, any> = {}) {
    await this.trackEvent('listing_view', {
      listing_id: listingId,
      listing_title: listingTitle,
      ...properties,
    });
  }

  // Arama takibi
  async trackSearch(query: string, resultsCount: number, properties: Record<string, any> = {}) {
    await this.trackEvent('search', {
      query,
      results_count: resultsCount,
      ...properties,
    });
  }

  // Mesaj gönderme takibi
  async trackMessageSent(recipientId: string, listingId?: string, properties: Record<string, any> = {}) {
    await this.trackEvent('message_sent', {
      recipient_id: recipientId,
      listing_id: listingId,
      ...properties,
    });
  }

  // Favori ekleme/çıkarma takibi
  async trackFavoriteAction(action: 'add' | 'remove', listingId: string, properties: Record<string, any> = {}) {
    await this.trackEvent('favorite_action', {
      action,
      listing_id: listingId,
      ...properties,
    });
  }

  // İlan oluşturma takibi
  async trackListingCreated(listingId: string, category: string, price: number, properties: Record<string, any> = {}) {
    await this.trackEvent('listing_created', {
      listing_id: listingId,
      category,
      price,
      ...properties,
    });
  }

  // Premium satın alma takibi
  async trackPremiumPurchase(planId: string, amount: number, properties: Record<string, any> = {}) {
    await this.trackEvent('premium_purchase', {
      plan_id: planId,
      amount,
      ...properties,
    });
  }

  // Hata takibi
  async trackError(error: Error, context: Record<string, any> = {}) {
    await this.trackEvent('error', {
      error_message: error.message,
      error_stack: error.stack,
      ...context,
    });
  }

  // Performans metrikleri
  async trackPerformance(metric: string, value: number, unit: string = 'ms', context: Record<string, any> = {}) {
    if (!this.isEnabled || !this.currentSession) return;

    const performanceMetric: PerformanceMetric = {
      id: this.generateMetricId(),
      metric,
      value,
      unit,
      timestamp: Date.now(),
      context: {
        ...context,
        platform: 'mobile',
      },
    };

    this.currentSession.metrics.push(performanceMetric);
  }

  // API yanıt süresi takibi
  async trackApiResponseTime(endpoint: string, responseTime: number, statusCode: number) {
    await this.trackPerformance('api_response_time', responseTime, 'ms', {
      endpoint,
      status_code: statusCode,
    });
  }

  // Sayfa yükleme süresi takibi
  async trackPageLoadTime(screenName: string, loadTime: number) {
    await this.trackPerformance('page_load_time', loadTime, 'ms', {
      screen_name: screenName,
    });
  }

  // Uygulama başlatma süresi takibi
  async trackAppStartTime(startTime: number) {
    await this.trackPerformance('app_start_time', startTime, 'ms');
  }

  // Bellek kullanımı takibi
  async trackMemoryUsage(usage: number) {
    await this.trackPerformance('memory_usage', usage, 'MB');
  }

  // Kullanıcı davranış analizi
  async trackUserBehavior(action: string, properties: Record<string, any> = {}) {
    await this.trackEvent('user_behavior', {
      action,
      ...properties,
    });
  }

  // Oturum sonlandırma
  async endSession() {
    if (!this.currentSession) return;

    this.currentSession.endTime = Date.now();
    this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;

    // Oturum verilerini kaydet
    await this.saveSessionData(this.currentSession);

    // Yeni oturum başlat
    this.startSession();
  }

  // Analitik verilerini sunucuya gönder
  private async flushAnalytics() {
    if (!this.currentSession || this.currentSession.events.length === 0) return;

    try {
      const eventsToSend = [...this.currentSession.events];
      const metricsToSend = [...this.currentSession.metrics];

      // Sunucuya gönder
      await this.sendAnalyticsToServer(eventsToSend, metricsToSend);

      // Gönderilen verileri temizle
      this.currentSession.events = [];
      this.currentSession.metrics = [];
    } catch (error) {
      console.error('Error flushing analytics:', error);
    }
  }

  private async sendAnalyticsToServer(events: AnalyticsEvent[], metrics: PerformanceMetric[]) {
    try {
      const response = await fetch('http://localhost:3000/api/analytics/mobile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events,
          metrics,
          sessionId: this.currentSession?.id,
          userId: await this.getUserId(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send analytics data');
      }
    } catch (error) {
      console.error('Error sending analytics to server:', error);
      // Hata durumunda verileri yerel olarak sakla
      await this.saveFailedAnalytics(events, metrics);
    }
  }

  private async saveFailedAnalytics(events: AnalyticsEvent[], metrics: PerformanceMetric[]) {
    try {
      const failedData = await this.getFailedAnalytics();
      failedData.events.push(...events);
      failedData.metrics.push(...metrics);

      await AsyncStorage.setItem('failedAnalytics', JSON.stringify(failedData));
    } catch (error) {
      console.error('Error saving failed analytics:', error);
    }
  }

  private async getFailedAnalytics(): Promise<{ events: AnalyticsEvent[]; metrics: PerformanceMetric[] }> {
    try {
      const data = await AsyncStorage.getItem('failedAnalytics');
      return data ? JSON.parse(data) : { events: [], metrics: [] };
    } catch (error) {
      return { events: [], metrics: [] };
    }
  }

  private async saveSessionData(session: UserSession) {
    try {
      const sessions = await this.getSessionHistory();
      sessions.push(session);

      // Son 100 oturumu sakla
      if (sessions.length > 100) {
        sessions.splice(0, sessions.length - 100);
      }

      await AsyncStorage.setItem('sessionHistory', JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving session data:', error);
    }
  }

  private async getSessionHistory(): Promise<UserSession[]> {
    try {
      const data = await AsyncStorage.getItem('sessionHistory');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMetricId(): string {
    return `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async getUserId(): Promise<string | undefined> {
    try {
      return await AsyncStorage.getItem('userId') || undefined;
    } catch (error) {
      return undefined;
    }
  }

  // Analitik ayarlarını güncelle
  async updateSettings(settings: {
    enabled?: boolean;
    batchSize?: number;
    flushInterval?: number;
  }) {
    this.isEnabled = settings.enabled ?? this.isEnabled;
    this.batchSize = settings.batchSize ?? this.batchSize;
    this.flushInterval = settings.flushInterval ?? this.flushInterval;

    await AsyncStorage.setItem('analyticsSettings', JSON.stringify({
      enabled: this.isEnabled,
      batchSize: this.batchSize,
      flushInterval: this.flushInterval,
    }));

    this.startFlushTimer();
  }

  // Analitik verilerini temizle
  async clearAnalytics() {
    try {
      await AsyncStorage.multiRemove([
        'sessionHistory',
        'failedAnalytics',
        'analyticsSettings',
      ]);

      if (this.currentSession) {
        this.currentSession.events = [];
        this.currentSession.metrics = [];
      }
    } catch (error) {
      console.error('Error clearing analytics:', error);
    }
  }

  // Analitik durumunu kontrol et
  isAnalyticsEnabled(): boolean {
    return this.isEnabled;
  }

  // Manuel flush
  async forceFlush() {
    await this.flushAnalytics();
  }
}

export default AnalyticsService.getInstance(); 