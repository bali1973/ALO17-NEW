interface PerformanceMetric {
  id: string;
  type: 'page_load' | 'api_call' | 'user_interaction' | 'error';
  name: string;
  duration: number;
  timestamp: string;
  metadata?: any;
  userId?: string;
  sessionId?: string;
}

interface PageLoadMetric extends PerformanceMetric {
  type: 'page_load';
  page: string;
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
}

interface ApiCallMetric extends PerformanceMetric {
  type: 'api_call';
  endpoint: string;
  method: string;
  statusCode: number;
  responseSize?: number;
  error?: string;
}

interface UserInteractionMetric extends PerformanceMetric {
  type: 'user_interaction';
  action: string;
  element?: string;
  coordinates?: { x: number; y: number };
}

interface ErrorMetric extends PerformanceMetric {
  type: 'error';
  errorType: string;
  errorMessage: string;
  stackTrace?: string;
  componentStack?: string;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private sessionId: string;
  private isEnabled: boolean = true;
  private batchSize: number = 10;
  private flushInterval: number = 30000; // 30 saniye
  private flushTimer?: NodeJS.Timeout;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.startPeriodicFlush();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Sayfa yükleme süresini izle
  trackPageLoad(page: string, loadTime: number, metadata?: any): void {
    if (!this.isEnabled) return;

    const metric: PageLoadMetric = {
      id: this.generateId(),
      type: 'page_load',
      name: `Page Load: ${page}`,
      duration: loadTime,
      timestamp: new Date().toISOString(),
      page,
      loadTime,
      domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      metadata,
      sessionId: this.sessionId
    };

    // Web Vitals metriklerini ekle
    if ('PerformanceObserver' in window) {
      this.trackWebVitals(metric);
    }

    this.addMetric(metric);
  }

  // API çağrısını izle
  trackApiCall(endpoint: string, method: string, startTime: number, endTime: number, statusCode: number, responseSize?: number, error?: string): void {
    if (!this.isEnabled) return;

    const duration = endTime - startTime;
    const metric: ApiCallMetric = {
      id: this.generateId(),
      type: 'api_call',
      name: `API Call: ${method} ${endpoint}`,
      duration,
      timestamp: new Date().toISOString(),
      endpoint,
      method,
      statusCode,
      responseSize,
      error,
      sessionId: this.sessionId
    };

    this.addMetric(metric);
  }

  // Kullanıcı etkileşimini izle
  trackUserInteraction(action: string, element?: string, coordinates?: { x: number; y: number }): void {
    if (!this.isEnabled) return;

    const metric: UserInteractionMetric = {
      id: this.generateId(),
      type: 'user_interaction',
      name: `User Interaction: ${action}`,
      duration: 0,
      timestamp: new Date().toISOString(),
      action,
      element,
      coordinates,
      sessionId: this.sessionId
    };

    this.addMetric(metric);
  }

  // Hata izleme
  trackError(error: Error, errorType: string = 'javascript', componentStack?: string): void {
    if (!this.isEnabled) return;

    const metric: ErrorMetric = {
      id: this.generateId(),
      type: 'error',
      name: `Error: ${errorType}`,
      duration: 0,
      timestamp: new Date().toISOString(),
      errorType,
      errorMessage: error.message,
      stackTrace: error.stack,
      componentStack,
      sessionId: this.sessionId
    };

    this.addMetric(metric);
  }

  // Web Vitals metriklerini izle
  private trackWebVitals(pageMetric: PageLoadMetric): void {
    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            pageMetric.firstContentfulPaint = entry.startTime;
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });
    }

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            pageMetric.largestContentfulPaint = entry.startTime;
          }
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    // Cumulative Layout Shift
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        let cls = 0;
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            cls += (entry as any).value;
          }
        }
        pageMetric.cumulativeLayoutShift = cls;
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  // Metrik ekle
  private addMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // Batch size'a ulaşıldığında flush et
    if (this.metrics.length >= this.batchSize) {
      this.flush();
    }
  }

  // Metrikleri sunucuya gönder
  private async flush(): Promise<void> {
    if (this.metrics.length === 0) return;

    const metricsToSend = [...this.metrics];
    this.metrics = [];

    try {
      const response = await fetch('/api/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics: metricsToSend,
          sessionId: this.sessionId,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        console.warn('Performance metrics could not be sent to server');
        // Başarısız metrikleri geri ekle
        this.metrics.unshift(...metricsToSend);
      }
    } catch (error) {
      console.error('Error sending performance metrics:', error);
      // Hata durumunda metrikleri geri ekle
      this.metrics.unshift(...metricsToSend);
    }
  }

  // Periyodik flush
  private startPeriodicFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  // Performans izlemeyi etkinleştir/devre dışı bırak
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  // Batch size'ı ayarla
  setBatchSize(size: number): void {
    this.batchSize = size;
  }

  // Flush interval'ı ayarla
  setFlushInterval(interval: number): void {
    this.flushInterval = interval;
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.startPeriodicFlush();
    }
  }

  // Mevcut metrikleri getir
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  // Metrikleri temizle
  clearMetrics(): void {
    this.metrics = [];
  }

  // Performans raporu oluştur
  generateReport(): any {
    const allMetrics = this.getMetrics();
    
    const report = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      totalMetrics: allMetrics.length,
      metricsByType: {
        page_load: allMetrics.filter(m => m.type === 'page_load').length,
        api_call: allMetrics.filter(m => m.type === 'api_call').length,
        user_interaction: allMetrics.filter(m => m.type === 'user_interaction').length,
        error: allMetrics.filter(m => m.type === 'error').length,
      },
      averageDurations: {
        page_load: this.calculateAverageDuration(allMetrics.filter(m => m.type === 'page_load')),
        api_call: this.calculateAverageDuration(allMetrics.filter(m => m.type === 'api_call')),
      },
      slowestOperations: this.getSlowestOperations(allMetrics, 5),
      errorSummary: this.getErrorSummary(allMetrics),
      topPages: this.getTopPages(allMetrics),
      topApiEndpoints: this.getTopApiEndpoints(allMetrics),
    };

    return report;
  }

  // Ortalama süre hesapla
  private calculateAverageDuration(metrics: PerformanceMetric[]): number {
    if (metrics.length === 0) return 0;
    const totalDuration = metrics.reduce((sum, metric) => sum + metric.duration, 0);
    return totalDuration / metrics.length;
  }

  // En yavaş operasyonları getir
  private getSlowestOperations(metrics: PerformanceMetric[], limit: number): PerformanceMetric[] {
    return metrics
      .filter(m => m.duration > 0)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  // Hata özeti
  private getErrorSummary(metrics: PerformanceMetric[]): any {
    const errors = metrics.filter(m => m.type === 'error') as ErrorMetric[];
    const errorTypes = new Map<string, number>();

    errors.forEach(error => {
      const count = errorTypes.get(error.errorType) || 0;
      errorTypes.set(error.errorType, count + 1);
    });

    return {
      totalErrors: errors.length,
      errorTypes: Object.fromEntries(errorTypes),
      recentErrors: errors.slice(-10)
    };
  }

  // En çok ziyaret edilen sayfalar
  private getTopPages(metrics: PerformanceMetric[]): any[] {
    const pageLoads = metrics.filter(m => m.type === 'page_load') as PageLoadMetric[];
    const pageCounts = new Map<string, number>();

    pageLoads.forEach(page => {
      const count = pageCounts.get(page.page) || 0;
      pageCounts.set(page.page, count + 1);
    });

    return Array.from(pageCounts.entries())
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  // En çok kullanılan API endpoint'leri
  private getTopApiEndpoints(metrics: PerformanceMetric[]): any[] {
    const apiCalls = metrics.filter(m => m.type === 'api_call') as ApiCallMetric[];
    const endpointCounts = new Map<string, number>();

    apiCalls.forEach(api => {
      const count = endpointCounts.get(api.endpoint) || 0;
      endpointCounts.set(api.endpoint, count + 1);
    });

    return Array.from(endpointCounts.entries())
      .map(([endpoint, count]) => ({ endpoint, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  // ID oluştur
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Session ID oluştur
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Temizlik
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

// Global performans izleme fonksiyonları
export const performanceMonitor = PerformanceMonitor.getInstance();

// Sayfa yükleme süresini otomatik izle
export const trackPageLoad = (page: string) => {
  const startTime = performance.now();
  
  window.addEventListener('load', () => {
    const loadTime = performance.now() - startTime;
    performanceMonitor.trackPageLoad(page, loadTime);
  });
};

// API çağrısını otomatik izle
export const trackApiCall = async <T>(
  endpoint: string,
  method: string,
  apiCall: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await apiCall();
    const endTime = performance.now();
    performanceMonitor.trackApiCall(endpoint, method, startTime, endTime, 200);
    return result;
  } catch (error) {
    const endTime = performance.now();
    performanceMonitor.trackApiCall(endpoint, method, startTime, endTime, 500, undefined, error.message);
    throw error;
  }
};

// Kullanıcı etkileşimini otomatik izle
export const trackUserInteraction = (action: string, element?: string) => {
  performanceMonitor.trackUserInteraction(action, element);
};

// Hata izlemeyi otomatik etkinleştir
export const enableErrorTracking = () => {
  window.addEventListener('error', (event) => {
    performanceMonitor.trackError(event.error, 'javascript');
  });

  window.addEventListener('unhandledrejection', (event) => {
    performanceMonitor.trackError(new Error(event.reason), 'unhandled_promise');
  });
};

export default performanceMonitor; 