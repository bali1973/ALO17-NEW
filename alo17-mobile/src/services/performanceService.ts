// Performance optimization service for Alo17 Mobile
import { InteractionManager, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-netinfo/netinfo';

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private startTimes: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(key: string): void {
    this.startTimes.set(key, Date.now());
  }

  endTimer(key: string): number {
    const startTime = this.startTimes.get(key);
    if (!startTime) return 0;

    const duration = Date.now() - startTime;
    this.startTimes.delete(key);

    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    this.metrics.get(key)!.push(duration);

    // Keep only last 100 measurements
    if (this.metrics.get(key)!.length > 100) {
      this.metrics.get(key)!.shift();
    }

    return duration;
  }

  getAverageTime(key: string): number {
    const measurements = this.metrics.get(key);
    if (!measurements || measurements.length === 0) return 0;

    const sum = measurements.reduce((acc, val) => acc + val, 0);
    return sum / measurements.length;
  }

  getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((measurements, key) => {
      result[key] = this.getAverageTime(key);
    });
    return result;
  }

  clearMetrics(): void {
    this.metrics.clear();
    this.startTimes.clear();
  }
}

// Image optimization service
export class ImageOptimizer {
  private static cache = new Map<string, string>();

  static async preloadImages(urls: string[]): Promise<void> {
    const promises = urls.map(url => this.preloadImage(url));
    await Promise.allSettled(promises);
  }

  static async preloadImage(url: string): Promise<void> {
    if (this.cache.has(url)) return;

    try {
      // For React Native, we can use Image.prefetch
      const { Image } = require('react-native');
      await Image.prefetch(url);
      this.cache.set(url, url);
    } catch (error) {
      console.warn('Failed to preload image:', url, error);
    }
  }

  static getOptimizedImageUrl(url: string, width: number, height: number): string {
    // Add image optimization parameters
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&h=${height}&fit=crop&auto=format`;
  }

  static clearCache(): void {
    this.cache.clear();
  }
}

// Memory management service
export class MemoryManager {
  private static instance: MemoryManager;
  private memoryWarnings: number = 0;

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  async optimizeMemory(): Promise<void> {
    // Clear image cache
    ImageOptimizer.clearCache();
    
    // Clear AsyncStorage if needed
    const keys = await AsyncStorage.getAllKeys();
    if (keys.length > 100) {
      // Keep only essential keys
      const essentialKeys = keys.filter(key => 
        key.startsWith('auth_') || 
        key.startsWith('user_') || 
        key.startsWith('settings_')
      );
      
      const keysToRemove = keys.filter(key => !essentialKeys.includes(key));
      await AsyncStorage.multiRemove(keysToRemove);
    }

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
  }

  getMemoryUsage(): Promise<number> {
    return new Promise((resolve) => {
      if (Platform.OS === 'ios') {
        // iOS memory usage
        const { NativeModules } = require('react-native');
        if (NativeModules.MemoryManager) {
          NativeModules.MemoryManager.getMemoryUsage((usage: number) => {
            resolve(usage);
          });
        } else {
          resolve(0);
        }
      } else {
        // Android memory usage
        const { NativeModules } = require('react-native');
        if (NativeModules.MemoryManager) {
          NativeModules.MemoryManager.getMemoryUsage().then((usage: number) => {
            resolve(usage);
          });
        } else {
          resolve(0);
        }
      }
    });
  }
}

// Network optimization service
export class NetworkOptimizer {
  private static instance: NetworkOptimizer;
  private isOnline: boolean = true;
  private connectionType: string = 'unknown';

  static getInstance(): NetworkOptimizer {
    if (!NetworkOptimizer.instance) {
      NetworkOptimizer.instance = new NetworkOptimizer();
      NetworkOptimizer.instance.init();
    }
    return NetworkOptimizer.instance;
  }

  private init(): void {
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected ?? false;
      this.connectionType = state.type ?? 'unknown';
    });
  }

  isConnected(): boolean {
    return this.isOnline;
  }

  getConnectionType(): string {
    return this.connectionType;
  }

  shouldUseLowQualityImages(): boolean {
    return this.connectionType === 'cellular' || this.connectionType === '2g';
  }

  getImageQuality(): number {
    if (this.connectionType === 'wifi') return 100;
    if (this.connectionType === 'cellular') return 75;
    if (this.connectionType === '2g') return 50;
    return 75; // default
  }
}

// Cache management service
export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  clearExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  getSize(): number {
    return this.cache.size;
  }
}

// Animation optimization service
export class AnimationOptimizer {
  static enableInteractionAfterAnimation(): void {
    InteractionManager.runAfterInteractions(() => {
      // Animation completed, safe to perform heavy operations
    });
  }

  static shouldReduceMotion(): boolean {
    // Check if user prefers reduced motion
    return false; // TODO: Implement accessibility check
  }

  static getOptimalAnimationDuration(): number {
    return this.shouldReduceMotion() ? 0 : 300;
  }
}

// Bundle optimization service
export class BundleOptimizer {
  static async lazyLoadComponent(importFunc: () => Promise<any>): Promise<any> {
    try {
      const module = await importFunc();
      return module.default || module;
    } catch (error) {
      console.error('Failed to lazy load component:', error);
      return null;
    }
  }

  static preloadCriticalComponents(): void {
    // Preload critical components in background
    InteractionManager.runAfterInteractions(() => {
      // Preload components that are likely to be used
      this.lazyLoadComponent(() => import('../screens/main/HomeScreen'));
      this.lazyLoadComponent(() => import('../screens/main/SearchScreen'));
    });
  }
}

// Performance utilities
export const PerformanceUtils = {
  // Debounce function
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Memoization helper
  memoize<T extends (...args: any[]) => any>(
    func: T,
    resolver?: (...args: Parameters<T>) => string
  ): T {
    const cache = new Map<string, ReturnType<T>>();

    return ((...args: Parameters<T>) => {
      const key = resolver ? resolver(...args) : JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key);
      }

      const result = func(...args);
      cache.set(key, result);
      return result;
    }) as T;
  }
};

// Export singleton instances
export const performanceMonitor = PerformanceMonitor.getInstance();
export const memoryManager = MemoryManager.getInstance();
export const networkOptimizer = NetworkOptimizer.getInstance();
export const cacheManager = CacheManager.getInstance(); 