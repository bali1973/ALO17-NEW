interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  keys: string[];
}

class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    keys: [],
  };
  private maxSize = 1000; // Maksimum cache boyutu
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Her 5 dakikada bir expired item'ları temizle
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  // Veri cache'e ekle
  set<T>(key: string, data: T, ttlSeconds: number = 3600): void {
    const now = Date.now();
    const expiresAt = now + (ttlSeconds * 1000);

    // Cache boyutunu kontrol et
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    const item: CacheItem<T> = {
      data,
      timestamp: now,
      expiresAt,
    };

    this.cache.set(key, item);
    this.updateStats();
  }

  // Cache'den veri al
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      return null;
    }

    // Expired kontrolü
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return item.data as T;
  }

  // Cache'den veri sil
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.updateStats();
    }
    return deleted;
  }

  // Cache'i temizle
  clear(): void {
    this.cache.clear();
    this.updateStats();
  }

  // Belirli pattern'e uyan key'leri sil
  deletePattern(pattern: string): number {
    const regex = new RegExp(pattern);
    let deletedCount = 0;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      this.updateStats();
    }

    return deletedCount;
  }

  // Cache istatistiklerini al
  getStats(): CacheStats {
    return { ...this.stats };
  }

  // Cache boyutunu al
  getSize(): number {
    return this.cache.size;
  }

  // Cache'de key var mı kontrol et
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // Cache'deki tüm key'leri al
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Cache'deki tüm değerleri al
  values(): any[] {
    return Array.from(this.cache.values()).map(item => item.data);
  }

  // Cache'deki tüm item'ları al
  entries(): [string, any][] {
    return Array.from(this.cache.entries()).map(([key, item]) => [key, item.data]);
  }

  // Expired item'ları temizle
  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.updateStats();
    }
  }

  // En eski item'ı sil (LRU)
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  // İstatistikleri güncelle
  private updateStats(): void {
    this.stats.size = this.cache.size;
    this.stats.keys = Array.from(this.cache.keys());
  }

  // Cache'i destroy et
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }
}

// Global cache instance
export const cache = new CacheService();

// Cache wrapper fonksiyonları
export async function cachedFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = 3600
): Promise<T> {
  // Cache'den kontrol et
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch et ve cache'e kaydet
  const data = await fetchFn();
  cache.set(key, data, ttlSeconds);
  return data;
}

// Cache key generator
export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|');
  
  return `${prefix}:${sortedParams}`;
}

// Cache middleware (API routes için)
export function withCache<T>(
  handler: () => Promise<T>,
  key: string,
  ttlSeconds: number = 3600
): () => Promise<T> {
  return async () => {
    return cachedFetch(key, handler, ttlSeconds);
  };
}

// Cache invalidation helpers
export const cacheInvalidators = {
  // İlan cache'ini temizle
  clearListingCache: (listingId?: string) => {
    if (listingId) {
      cache.deletePattern(`listing:${listingId}`);
    } else {
      cache.deletePattern('listing:');
    }
  },

  // Kategori cache'ini temizle
  clearCategoryCache: (categoryId?: string) => {
    if (categoryId) {
      cache.deletePattern(`category:${categoryId}`);
    } else {
      cache.deletePattern('category:');
    }
  },

  // Kullanıcı cache'ini temizle
  clearUserCache: (userId?: string) => {
    if (userId) {
      cache.deletePattern(`user:${userId}`);
    } else {
      cache.deletePattern('user:');
    }
  },

  // Arama cache'ini temizle
  clearSearchCache: () => {
    cache.deletePattern('search:');
  },

  // Tüm cache'i temizle
  clearAll: () => {
    cache.clear();
  },
};

export default cache; 