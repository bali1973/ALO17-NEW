// Simple in-memory cache system for performance optimization
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class Cache {
  private store = new Map<string, CacheItem<any>>();
  private maxSize = 1000; // Maximum cache size

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // Clean up expired items
    this.cleanup();

    // Remove oldest items if cache is full
    if (this.store.size >= this.maxSize) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) {
        this.store.delete(oldestKey);
      }
    }

    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.store.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item is expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.store.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    this.store.forEach((item, key) => {
      if (now - item.timestamp > item.ttl) {
        this.store.delete(key);
      }
    });
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.store.size,
      maxSize: this.maxSize,
      keys: Array.from(this.store.keys())
    };
  }
}

// Global cache instance
export const cache = new Cache();

// Cache keys
export const CACHE_KEYS = {
  LISTINGS: 'listings',
  CATEGORIES: 'categories',
  USER_PROFILE: 'user_profile',
  FEATURED_ADS: 'featured_ads',
  LATEST_ADS: 'latest_ads',
  SEARCH_RESULTS: 'search_results'
} as const;

// Cache utilities
export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|');
  
  return `${prefix}:${sortedParams}`;
}

// Cache decorator for functions
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl: number = 5 * 60 * 1000
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const key = keyGenerator(...args);
    const cached = cache.get<ReturnType<T>>(key);
    
    if (cached) {
      return cached;
    }

    const result = await fn(...args);
    cache.set(key, result, ttl);
    
    return result;
  }) as T;
}

// Database query cache wrapper
export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
): Promise<T> {
  const cached = cache.get<T>(key);
  
  if (cached) {
    return cached;
  }

  const result = await queryFn();
  cache.set(key, result, ttl);
  
  return result;
}

// Cache invalidation
export function invalidateCache(pattern: string): void {
  // This would need to be implemented differently to access private store
  // For now, we'll use a different approach
  cache.clear(); // Clear all cache as a fallback
} 