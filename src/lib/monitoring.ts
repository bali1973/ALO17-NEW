// Monitoring ve Error Tracking Sistemi

interface ErrorEvent {
  message: string;
  stack?: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  url: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'javascript' | 'api' | 'network' | 'validation' | 'auth';
  metadata?: Record<string, any>;
}

interface PerformanceEvent {
  name: string;
  duration: number;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  url: string;
  category: 'navigation' | 'api' | 'render' | 'resource';
  metadata?: Record<string, any>;
}

interface UserEvent {
  event: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  url: string;
  properties?: Record<string, any>;
}

class MonitoringService {
  private static instance: MonitoringService;
  private errorQueue: ErrorEvent[] = [];
  private performanceQueue: PerformanceEvent[] = [];
  private userEventQueue: UserEvent[] = [];
  private sessionId: string;
  private isOnline: boolean = navigator.onLine;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.setupEventListeners();
    this.setupPeriodicFlush();
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupEventListeners(): void {
    // Online/offline events
    window.addEventListener('online', async () => {
      this.isOnline = true;
      await this.flushQueues();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Error events
    window.addEventListener('error', (event) => {
      this.captureError({
        message: event.message,
        stack: event.error?.stack,
        timestamp: new Date(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        severity: 'medium',
        category: 'javascript',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        timestamp: new Date(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        severity: 'high',
        category: 'javascript',
        metadata: {
          reason: event.reason
        }
      });
    });

    // Performance monitoring
    if ('PerformanceObserver' in window) {
      // Navigation timing
      const navigationObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.capturePerformance({
              name: 'page_load',
              duration: navEntry.loadEventEnd - navEntry.loadEventStart,
              timestamp: new Date(),
              url: window.location.href,
              category: 'navigation',
              metadata: {
                domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
                firstPaint: navEntry.loadEventEnd - navEntry.loadEventStart,
                totalTime: navEntry.loadEventEnd - navEntry.fetchStart
              }
            });
          }
        });
      });
      navigationObserver.observe({ entryTypes: ['navigation'] });

      // Resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            this.capturePerformance({
              name: 'resource_load',
              duration: resourceEntry.duration,
              timestamp: new Date(),
              url: window.location.href,
              category: 'resource',
              metadata: {
                resourceName: resourceEntry.name,
                resourceType: resourceEntry.initiatorType,
                transferSize: resourceEntry.transferSize
              }
            });
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
    }
  }

  private setupPeriodicFlush(): void {
    // Her 30 saniyede bir queue'ları flush et
    setInterval(async () => {
      await this.flushQueues();
    }, 30000);
  }

  captureError(error: Omit<ErrorEvent, 'sessionId'>): void {
    const errorEvent: ErrorEvent = {
      ...error,
      sessionId: this.sessionId
    };

    this.errorQueue.push(errorEvent);
    
    // Critical hataları hemen gönder
    if (error.severity === 'critical') {
      this.flushErrorQueue().catch(console.error);
    }

    // Console'a log
    console.error('Captured Error:', {
      message: errorEvent.message,
      severity: errorEvent.severity,
      category: errorEvent.category,
      timestamp: errorEvent.timestamp,
      url: errorEvent.url
    });
  }

  capturePerformance(performance: Omit<PerformanceEvent, 'sessionId'>): void {
    const performanceEvent: PerformanceEvent = {
      ...performance,
      sessionId: this.sessionId
    };

    this.performanceQueue.push(performanceEvent);
  }

  captureUserEvent(event: Omit<UserEvent, 'sessionId' | 'timestamp'>): void {
    const userEvent: UserEvent = {
      ...event,
      sessionId: this.sessionId,
      timestamp: new Date()
    };

    this.userEventQueue.push(userEvent);
  }

  private async flushErrorQueue(): Promise<void> {
    if (this.errorQueue.length === 0 || !this.isOnline) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      await fetch('/api/monitoring/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ errors }),
      });
    } catch (error) {
      // Hata durumunda queue'ya geri ekle
      this.errorQueue.unshift(...errors);
      console.error('Error flushing error queue:', error);
    }
  }

  private async flushPerformanceQueue(): Promise<void> {
    if (this.performanceQueue.length === 0 || !this.isOnline) return;

    const performance = [...this.performanceQueue];
    this.performanceQueue = [];

    try {
      await fetch('/api/monitoring/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ performance }),
      });
    } catch (error) {
      this.performanceQueue.unshift(...performance);
      console.error('Error flushing performance queue:', error);
    }
  }

  private async flushUserEventQueue(): Promise<void> {
    if (this.userEventQueue.length === 0 || !this.isOnline) return;

    const events = [...this.userEventQueue];
    this.userEventQueue = [];

    try {
      await fetch('/api/monitoring/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      });
    } catch (error) {
      this.userEventQueue.unshift(...events);
      console.error('Error flushing user event queue:', error);
    }
  }

  private async flushQueues(): Promise<void> {
    await Promise.all([
      this.flushErrorQueue(),
      this.flushPerformanceQueue(),
      this.flushUserEventQueue()
    ]);
  }

  // Public API methods
  trackPageView(page: string): void {
    this.captureUserEvent({
      event: 'page_view',
      url: page,
      properties: {
        page,
        referrer: document.referrer
      }
    });
  }

  trackButtonClick(buttonName: string, properties?: Record<string, any>): void {
    this.captureUserEvent({
      event: 'button_click',
      url: window.location.href,
      properties: {
        button_name: buttonName,
        ...properties
      }
    });
  }

  trackFormSubmission(formName: string, success: boolean, properties?: Record<string, any>): void {
    this.captureUserEvent({
      event: 'form_submission',
      url: window.location.href,
      properties: {
        form_name: formName,
        success,
        ...properties
      }
    });
  }

  trackAPIError(endpoint: string, status: number, error: string): void {
    this.captureError({
      message: `API Error: ${endpoint}`,
      timestamp: new Date(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      severity: status >= 500 ? 'high' : 'medium',
      category: 'api',
      metadata: {
        endpoint,
        status,
        error
      }
    });
  }

  trackCustomEvent(eventName: string, properties?: Record<string, any>): void {
    this.captureUserEvent({
      event: eventName,
      url: window.location.href,
      properties
    });
  }

  getSessionId(): string {
    return this.sessionId;
  }

  isUserOnline(): boolean {
    return this.isOnline;
  }
}

// React Hook for monitoring
export function useMonitoring() {
  const monitoring = MonitoringService.getInstance();

  return {
    trackPageView: monitoring.trackPageView.bind(monitoring),
    trackButtonClick: monitoring.trackButtonClick.bind(monitoring),
    trackFormSubmission: monitoring.trackFormSubmission.bind(monitoring),
    trackCustomEvent: monitoring.trackCustomEvent.bind(monitoring),
    trackAPIError: monitoring.trackAPIError.bind(monitoring),
    captureError: monitoring.captureError.bind(monitoring),
    capturePerformance: monitoring.capturePerformance.bind(monitoring),
    captureUserEvent: monitoring.captureUserEvent.bind(monitoring),
    getSessionId: monitoring.getSessionId.bind(monitoring),
    isUserOnline: monitoring.isUserOnline.bind(monitoring)
  };
}

// Error Boundary için monitoring
export function captureErrorInBoundary(error: Error, errorInfo: any): void {
  const monitoring = MonitoringService.getInstance();
  
  monitoring.captureError({
    message: error.message,
    stack: error.stack,
    timestamp: new Date(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    severity: 'high',
    category: 'javascript',
    metadata: {
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    }
  });
}

// API monitoring wrapper
export async function monitoredFetch(url: string, options?: RequestInit): Promise<Response> {
  const monitoring = MonitoringService.getInstance();
  const startTime = Date.now();

  try {
    const response = await fetch(url, options);
    
    // Performance tracking
    monitoring.capturePerformance({
      name: 'api_call',
      duration: Date.now() - startTime,
      timestamp: new Date(),
      url: window.location.href,
      category: 'api',
      metadata: {
        endpoint: url,
        method: options?.method || 'GET',
        status: response.status
      }
    });

    // Error tracking
    if (!response.ok) {
      monitoring.trackAPIError(url, response.status, `HTTP ${response.status}`);
    }

    return response;
  } catch (error) {
    // Network error tracking
    monitoring.trackAPIError(url, 0, error instanceof Error ? error.message : 'Network Error');
    throw error;
  }
}

// Export singleton instance
export const monitoring = MonitoringService.getInstance(); 