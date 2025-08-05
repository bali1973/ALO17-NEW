interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  url: string;
  userAgent?: string;
}

interface WebVitals {
  FCP: number; // First Contentful Paint
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  TTFB: number; // Time to First Byte
}

class PerformanceService {
  private static instance: PerformanceService;
  private metrics: PerformanceMetric[] = [];
  private isInitialized = false;

  static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  // Performans izlemeyi başlat
  initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    this.isInitialized = true;
    this.setupWebVitals();
    this.setupPerformanceObserver();
    this.setupErrorTracking();
  }

  // Web Vitals izleme
  private setupWebVitals(): void {
    if (typeof window === 'undefined') return;

    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
              this.recordMetric('FCP', entry.startTime, 'ms');
            }
          }
        });
        observer.observe({ entryTypes: ['paint'] });
      } catch (error) {
        console.error('FCP tracking error:', error);
      }
    }

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        let lcpValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              lcpValue = entry.startTime;
              this.recordMetric('LCP', lcpValue, 'ms');
            }
          }
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.error('LCP tracking error:', error);
      }
    }

    // First Input Delay
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'first-input') {
              this.recordMetric('FID', entry.processingStart - entry.startTime, 'ms');
            }
          }
        });
        observer.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.error('FID tracking error:', error);
      }
    }

    // Cumulative Layout Shift
    if ('PerformanceObserver' in window) {
      try {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              clsValue += (entry as any).value;
              this.recordMetric('CLS', clsValue, 'score');
            }
          }
        });
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.error('CLS tracking error:', error);
      }
    }
  }

  // Performans Observer kurulumu
  private setupPerformanceObserver(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      // Navigation timing
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric('TTFB', navEntry.responseStart - navEntry.requestStart, 'ms');
            this.recordMetric('DOMContentLoaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart, 'ms');
            this.recordMetric('LoadComplete', navEntry.loadEventEnd - navEntry.loadEventStart, 'ms');
          }
        }
      });
      observer.observe({ entryTypes: ['navigation'] });
    } catch (error) {
      console.error('Performance observer error:', error);
    }
  }

  // Hata izleme
  private setupErrorTracking(): void {
    if (typeof window === 'undefined') return;

    // JavaScript hataları
    window.addEventListener('error', (event) => {
      this.recordError('JavaScript Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack,
      });
    });

    // Promise hataları
    window.addEventListener('unhandledrejection', (event) => {
      this.recordError('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise,
      });
    });

    // Resource yükleme hataları
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'resource') {
              const resourceEntry = entry as PerformanceResourceTiming;
              if (resourceEntry.transferSize === 0 && resourceEntry.decodedBodySize === 0) {
                this.recordError('Resource Load Failed', {
                  name: resourceEntry.name,
                  initiatorType: resourceEntry.initiatorType,
                  duration: resourceEntry.duration,
                });
              }
            }
          }
        });
        observer.observe({ entryTypes: ['resource'] });
      } catch (error) {
        console.error('Resource error tracking error:', error);
      }
    }
  }

  // Metrik kaydet
  recordMetric(name: string, value: number, unit: string): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    this.metrics.push(metric);

    // Son 1000 metriği sakla
    if (this.metrics.length > 1000) {
      this.metrics.splice(0, this.metrics.length - 1000);
    }

    // Kritik metrikleri anında gönder
    if (this.isCriticalMetric(name)) {
      this.sendMetricToServer(metric);
    }
  }

  // Hata kaydet
  recordError(type: string, details: any): void {
    const errorMetric: PerformanceMetric = {
      name: `Error: ${type}`,
      value: 1,
      unit: 'count',
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    this.metrics.push(errorMetric);
    this.sendErrorToServer(type, details);
  }

  // Kritik metrik kontrolü
  private isCriticalMetric(name: string): boolean {
    const criticalMetrics = ['FCP', 'LCP', 'FID', 'CLS', 'TTFB'];
    return criticalMetrics.includes(name);
  }

  // Metrikleri sunucuya gönder
  private async sendMetricToServer(metric: PerformanceMetric): Promise<void> {
    try {
      await fetch('/api/performance/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });
    } catch (error) {
      console.error('Failed to send metric to server:', error);
    }
  }

  // Hataları sunucuya gönder
  private async sendErrorToServer(type: string, details: any): Promise<void> {
    try {
      await fetch('/api/performance/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          details,
          timestamp: Date.now(),
          url: typeof window !== 'undefined' ? window.location.href : '',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        }),
      });
    } catch (error) {
      console.error('Failed to send error to server:', error);
    }
  }

  // Sayfa yükleme süresini ölç
  measurePageLoad(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.recordMetric('PageLoad', loadTime, 'ms');
    });
  }

  // API yanıt süresini ölç
  measureApiResponse(url: string, startTime: number): void {
    const responseTime = performance.now() - startTime;
    this.recordMetric(`API:${url}`, responseTime, 'ms');
  }

  // Bellek kullanımını ölç
  measureMemoryUsage(): void {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      this.recordMetric('MemoryUsed', memory.usedJSHeapSize, 'bytes');
      this.recordMetric('MemoryTotal', memory.totalJSHeapSize, 'bytes');
      this.recordMetric('MemoryLimit', memory.jsHeapSizeLimit, 'bytes');
    }
  }

  // Metrikleri al
  getMetrics(filters?: {
    name?: string;
    startTime?: number;
    endTime?: number;
  }): PerformanceMetric[] {
    let filteredMetrics = [...this.metrics];

    if (filters) {
      if (filters.name) {
        filteredMetrics = filteredMetrics.filter(m => m.name === filters.name);
      }
      if (filters.startTime) {
        filteredMetrics = filteredMetrics.filter(m => m.timestamp >= filters.startTime!);
      }
      if (filters.endTime) {
        filteredMetrics = filteredMetrics.filter(m => m.timestamp <= filters.endTime!);
      }
    }

    return filteredMetrics.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Performans istatistiklerini al
  getPerformanceStats(): {
    averageFCP: number;
    averageLCP: number;
    averageFID: number;
    averageCLS: number;
    averageTTFB: number;
    errorCount: number;
    totalMetrics: number;
  } {
    const fcpMetrics = this.metrics.filter(m => m.name === 'FCP');
    const lcpMetrics = this.metrics.filter(m => m.name === 'LCP');
    const fidMetrics = this.metrics.filter(m => m.name === 'FID');
    const clsMetrics = this.metrics.filter(m => m.name === 'CLS');
    const ttfbMetrics = this.metrics.filter(m => m.name === 'TTFB');
    const errorMetrics = this.metrics.filter(m => m.name.startsWith('Error:'));

    return {
      averageFCP: this.calculateAverage(fcpMetrics),
      averageLCP: this.calculateAverage(lcpMetrics),
      averageFID: this.calculateAverage(fidMetrics),
      averageCLS: this.calculateAverage(clsMetrics),
      averageTTFB: this.calculateAverage(ttfbMetrics),
      errorCount: errorMetrics.length,
      totalMetrics: this.metrics.length,
    };
  }

  // Ortalama hesapla
  private calculateAverage(metrics: PerformanceMetric[]): number {
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  // Metrikleri temizle
  clearMetrics(): void {
    this.metrics = [];
  }

  // Performans raporu oluştur
  generatePerformanceReport(): string {
    const stats = this.getPerformanceStats();
    const report = `
Performance Report - ${new Date().toLocaleString('tr-TR')}

Web Vitals:
- First Contentful Paint (FCP): ${stats.averageFCP.toFixed(2)}ms
- Largest Contentful Paint (LCP): ${stats.averageLCP.toFixed(2)}ms
- First Input Delay (FID): ${stats.averageFID.toFixed(2)}ms
- Cumulative Layout Shift (CLS): ${stats.averageCLS.toFixed(4)}
- Time to First Byte (TTFB): ${stats.averageTTFB.toFixed(2)}ms

Errors: ${stats.errorCount}
Total Metrics: ${stats.totalMetrics}
    `;

    return report.trim();
  }
}

export const performance = PerformanceService.getInstance();

// Global performans izleme başlatma fonksiyonu
export function initPerformanceMonitoring(): void {
  performance.initialize();
  performance.measurePageLoad();
  
  // Bellek kullanımını periyodik olarak ölç
  if (typeof window !== 'undefined') {
    setInterval(() => {
      performance.measureMemoryUsage();
    }, 30000); // 30 saniyede bir
  }
} 

// Image Optimizer sınıfı
export class ImageOptimizer {
  static supportsWebP(): boolean {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    try {
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } catch (e) {
      return false;
    }
  }

  static supportsAVIF(): boolean {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    try {
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    } catch (e) {
      return false;
    }
  }

  static getOptimalFormat(): 'webp' | 'avif' | 'jpeg' {
    if (this.supportsAVIF()) return 'avif';
    if (this.supportsWebP()) return 'webp';
    return 'jpeg';
  }

  static optimizeImageUrl(url: string, width?: number, height?: number, quality?: number): string {
    if (!url) return url;
    
    const format = this.getOptimalFormat();
    const params = new URLSearchParams();
    
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    if (quality) params.append('q', quality.toString());
    params.append('f', format);
    
    return `${url}?${params.toString()}`;
  }
} 