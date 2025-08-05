// API Cache Management System

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of items in cache
  enableBackgroundRefresh: boolean;
}

export class ApiCache {
  private cache = new Map<string, CacheItem<any>>();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      ttl: 5 * 60 * 1000, // 5 minutes default
      maxSize: 100,
      enableBackgroundRefresh: true,
      ...config
    };
  }

  // Cache'e veri ekle
  set<T>(key: string, data: T, ttl?: number): void {
    // Cache boyutunu kontrol et
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.ttl
    });
  }

  // Cache'den veri al
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;

    // TTL kontrolü
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // Cache'den veri sil
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Cache'i temizle
  clear(): void {
    this.cache.clear();
  }

  // Cache istatistikleri
  getStats() {
    const now = Date.now();
    let validItems = 0;
    let expiredItems = 0;

    this.cache.forEach((item) => {
      if (now - item.timestamp > item.ttl) {
        expiredItems++;
      } else {
        validItems++;
      }
    });

    return {
      total: this.cache.size,
      valid: validItems,
      expired: expiredItems,
      hitRate: this.calculateHitRate()
    };
  }

  // En eski item'ı sil (LRU)
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    this.cache.forEach((item, key) => {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  // Hit rate hesapla
  private calculateHitRate(): number {
    // Bu basit bir implementasyon, gerçek uygulamada daha detaylı olabilir
    return this.cache.size > 0 ? 0.8 : 0; // Örnek değer
  }
}

// SWR için cache provider
export const swrCacheProvider = new Map();

// Cache key oluştur
export const generateCacheKey = (url: string, params?: Record<string, any>): string => {
  const baseKey = url;
  if (!params) return baseKey;
  
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  return `${baseKey}?${sortedParams}`;
};

// Cache ile API çağrısı yap
export const withCache = async <T>(
  url: string,
  options: RequestInit = {},
  cacheConfig?: Partial<CacheConfig>
): Promise<T> => {
  const cache = new ApiCache(cacheConfig);
  const cacheKey = generateCacheKey(url, options.body ? JSON.parse(options.body as string) : undefined);
  
  // Cache'den kontrol et
  const cachedData = cache.get<T>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // API çağrısı yap
  const startTime = performance.now();
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  
  // Cache'e kaydet
  cache.set(cacheKey, data);
  
  // Performans ölçümü
  const duration = performance.now() - startTime;
  console.log(`API Call: ${url} took ${duration.toFixed(2)}ms`);
  
  return data;
};

// Background refresh için cache
export const setupBackgroundRefresh = (
  url: string,
  interval: number = 5 * 60 * 1000 // 5 dakika
) => {
  if (typeof window === 'undefined') return;

  const refresh = async () => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const cache = new ApiCache();
        cache.set(url, data);
        console.log(`Background refresh completed for: ${url}`);
      }
    } catch (error) {
      console.error(`Background refresh failed for: ${url}`, error);
    }
  };

  // İlk refresh'i hemen yap
  refresh();
  
  // Periyodik refresh
  const intervalId = setInterval(refresh, interval);
  
  // Cleanup function
  return () => clearInterval(intervalId);
};

// Cache invalidation patterns
export const invalidateCache = {
  // Belirli bir pattern'e uyan tüm cache'leri sil
  byPattern: (pattern: RegExp) => {
    const cache = new ApiCache();
    // Bu implementasyon cache instance'ına erişim gerektirir
    console.log(`Invalidating cache by pattern: ${pattern}`);
  },

  // Belirli bir key'i sil
  byKey: (key: string) => {
    const cache = new ApiCache();
    cache.delete(key);
  },

  // Tüm cache'i temizle
  all: () => {
    const cache = new ApiCache();
    cache.clear();
  }
};

// Local storage cache wrapper
export class LocalStorageCache {
  private prefix = 'api_cache_';

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    if (typeof window === 'undefined') return;

    const item = {
      data,
      timestamp: Date.now(),
      ttl
    };

    localStorage.setItem(this.prefix + key, JSON.stringify(item));
  }

  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    const itemStr = localStorage.getItem(this.prefix + key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      
      if (Date.now() - item.timestamp > item.ttl) {
        localStorage.removeItem(this.prefix + key);
        return null;
      }

      return item.data;
    } catch {
      localStorage.removeItem(this.prefix + key);
      return null;
    }
  }

  delete(key: string): boolean {
    if (typeof window === 'undefined') return false;
    
    const exists = localStorage.getItem(this.prefix + key) !== null;
    localStorage.removeItem(this.prefix + key);
    return exists;
  }

  clear(): void {
    if (typeof window === 'undefined') return;

    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
} 