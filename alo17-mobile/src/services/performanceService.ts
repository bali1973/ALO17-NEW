// Performance optimization service for Alo17 Mobile
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Dimensions } from 'react-native';

export interface CacheConfig {
  maxSize: number; // MB cinsinden
  ttl: number; // Milisaniye cinsinden
  enableCompression: boolean;
}

export interface ImageConfig {
  quality: number; // 0-1 arası
  maxWidth: number;
  maxHeight: number;
  enableProgressive: boolean;
  enableWebP: boolean;
}

export interface PerformanceMetrics {
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
  cacheHitRate: number;
  imageLoadTime: number;
}

class PerformanceService {
  private cache: Map<string, { data: any; timestamp: number; size: number }> = new Map();
  private cacheConfig: CacheConfig = {
    maxSize: 50, // 50MB
    ttl: 24 * 60 * 60 * 1000, // 24 saat
    enableCompression: true,
  };
  
  private imageConfig: ImageConfig = {
    quality: 0.8,
    maxWidth: 800,
    maxHeight: 600,
    enableProgressive: true,
    enableWebP: true,
  };

  private metrics: PerformanceMetrics = {
    memoryUsage: 0,
    cpuUsage: 0,
    networkLatency: 0,
    cacheHitRate: 0,
    imageLoadTime: 0,
  };

  private cacheHits = 0;
  private cacheMisses = 0;

  // Performans servisini başlat
  async initialize() {
    try {
      // Cache konfigürasyonunu yükle
      await this.loadCacheConfig();
      
      // Mevcut cache'i yükle
      await this.loadCache();
      
      // Performans izlemeyi başlat
      this.startPerformanceMonitoring();
      
      console.log('Performans servisi başlatıldı');
    } catch (error) {
      console.error('Performans servisi başlatılamadı:', error);
    }
  }

  // Cache konfigürasyonunu yükle
  private async loadCacheConfig() {
    try {
      const savedConfig = await AsyncStorage.getItem('performance-cache-config');
      if (savedConfig) {
        this.cacheConfig = { ...this.cacheConfig, ...JSON.parse(savedConfig) };
      }
    } catch (error) {
      console.error('Cache konfigürasyonu yüklenemedi:', error);
    }
  }

  // Cache konfigürasyonunu kaydet
  async saveCacheConfig(config: Partial<CacheConfig>) {
    try {
      this.cacheConfig = { ...this.cacheConfig, ...config };
      await AsyncStorage.setItem('performance-cache-config', JSON.stringify(this.cacheConfig));
    } catch (error) {
      console.error('Cache konfigürasyonu kaydedilemedi:', error);
    }
  }

  // Cache'e veri ekle
  async setCache(key: string, data: any, ttl?: number): Promise<void> {
    try {
      const size = this.calculateDataSize(data);
      const timestamp = Date.now();
      const cacheTTL = ttl || this.cacheConfig.ttl;

      // Cache boyutunu kontrol et
      await this.ensureCacheSize(size);

      this.cache.set(key, {
        data,
        timestamp,
        size,
      });

      await this.saveCache();
    } catch (error) {
      console.error('Cache veri ekleme hatası:', error);
    }
  }

  // Cache'den veri al
  async getCache(key: string): Promise<any | null> {
    try {
      const cached = this.cache.get(key);
      
      if (!cached) {
        this.cacheMisses++;
        return null;
      }

      // TTL kontrolü
      if (Date.now() - cached.timestamp > this.cacheConfig.ttl) {
        this.cache.delete(key);
        this.cacheMisses++;
        await this.saveCache();
        return null;
      }

      this.cacheHits++;
      return cached.data;
    } catch (error) {
      console.error('Cache veri alma hatası:', error);
      return null;
    }
  }

  // Cache'i temizle
  async clearCache(): Promise<void> {
    try {
      this.cache.clear();
      await AsyncStorage.removeItem('performance-cache');
      console.log('Cache temizlendi');
    } catch (error) {
      console.error('Cache temizleme hatası:', error);
    }
  }

  // Cache boyutunu kontrol et
  private async ensureCacheSize(newDataSize: number): Promise<void> {
    const currentSize = this.getCurrentCacheSize();
    const maxSize = this.cacheConfig.maxSize * 1024 * 1024; // MB'ı byte'a çevir

    if (currentSize + newDataSize > maxSize) {
      // En eski verileri sil
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

      let removedSize = 0;
      for (const [key, value] of entries) {
        if (currentSize - removedSize + newDataSize <= maxSize) {
          break;
        }
        this.cache.delete(key);
        removedSize += value.size;
      }
    }
  }

  // Mevcut cache boyutunu hesapla
  private getCurrentCacheSize(): number {
    let totalSize = 0;
    for (const value of this.cache.values()) {
      totalSize += value.size;
    }
    return totalSize;
  }

  // Veri boyutunu hesapla
  private calculateDataSize(data: any): number {
    const jsonString = JSON.stringify(data);
    return new Blob([jsonString]).size;
  }

  // Cache'i kaydet
  private async saveCache() {
    try {
      const cacheData = Array.from(this.cache.entries());
      await AsyncStorage.setItem('performance-cache', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Cache kaydetme hatası:', error);
    }
  }

  // Cache'i yükle
  private async loadCache() {
    try {
      const cacheData = await AsyncStorage.getItem('performance-cache');
      if (cacheData) {
        const entries = JSON.parse(cacheData);
        this.cache = new Map(entries);
      }
    } catch (error) {
      console.error('Cache yükleme hatası:', error);
    }
  }

  // Resim optimizasyonu
  optimizeImageUrl(url: string, width?: number, height?: number): string {
    if (!url) return url;

    const maxWidth = width || this.imageConfig.maxWidth;
    const maxHeight = height || this.imageConfig.maxHeight;
    const quality = this.imageConfig.quality;

    // CDN veya resim servisi kullanıyorsa parametreleri ekle
    if (url.includes('cloudinary.com')) {
      return `${url}?w=${maxWidth}&h=${maxHeight}&q=${Math.round(quality * 100)}&f=auto`;
    }

    if (url.includes('imgix.net')) {
      return `${url}?w=${maxWidth}&h=${maxHeight}&q=${Math.round(quality * 100)}&auto=format`;
    }

    // Kendi resim servisimiz için
    if (url.includes('alo17.com')) {
      return `${url}?width=${maxWidth}&height=${maxHeight}&quality=${Math.round(quality * 100)}`;
    }

    return url;
  }

  // Lazy loading için Intersection Observer benzeri
  createLazyLoader(callback: () => void, threshold: number = 0.1): () => void {
    let isVisible = false;
    let hasTriggered = false;

    const checkVisibility = () => {
      // Basit görünürlük kontrolü (gerçek uygulamada Intersection Observer kullanılabilir)
      if (!isVisible && !hasTriggered) {
        isVisible = true;
        hasTriggered = true;
        callback();
      }
    };

    return checkVisibility;
  }

  // Debounce fonksiyonu
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Throttle fonksiyonu
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
  }

  // Performans izlemeyi başlat
  private startPerformanceMonitoring() {
    // Her 30 saniyede bir performans metriklerini güncelle
    setInterval(() => {
      this.updatePerformanceMetrics();
    }, 30000);
  }

  // Performans metriklerini güncelle
  private updatePerformanceMetrics() {
    // Cache hit rate hesapla
    const totalRequests = this.cacheHits + this.cacheMisses;
    this.metrics.cacheHitRate = totalRequests > 0 ? this.cacheHits / totalRequests : 0;

    // Memory usage (basit hesaplama)
    this.metrics.memoryUsage = this.getCurrentCacheSize() / (1024 * 1024); // MB

    // CPU usage (basit hesaplama)
    this.metrics.cpuUsage = Math.random() * 100; // Gerçek uygulamada system API kullanılabilir

    console.log('Performans metrikleri güncellendi:', this.metrics);
  }

  // Performans metriklerini al
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Cache istatistiklerini al
  getCacheStats() {
    return {
      size: this.getCurrentCacheSize(),
      itemCount: this.cache.size,
      hitRate: this.metrics.cacheHitRate,
      hits: this.cacheHits,
      misses: this.cacheMisses,
    };
  }

  // Resim önbelleğe alma
  async preloadImages(urls: string[]): Promise<void> {
    try {
      const promises = urls.map(url => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = this.optimizeImageUrl(url);
        });
      });

      await Promise.all(promises);
      console.log(`${urls.length} resim önbelleğe alındı`);
    } catch (error) {
      console.error('Resim önbelleğe alma hatası:', error);
    }
  }

  // Veri sıkıştırma
  async compressData(data: any): Promise<any> {
    if (!this.cacheConfig.enableCompression) {
      return data;
    }

    try {
      // Basit sıkıştırma (gerçek uygulamada daha gelişmiş algoritmalar kullanılabilir)
      const jsonString = JSON.stringify(data);
      
      // Gereksiz boşlukları kaldır
      const compressed = jsonString.replace(/\s+/g, ' ').trim();
      
      return JSON.parse(compressed);
    } catch (error) {
      console.error('Veri sıkıştırma hatası:', error);
      return data;
    }
  }

  // Veri sıkıştırmayı aç
  async decompressData(data: any): Promise<any> {
    // Basit sıkıştırma için açma işlemi gerekmez
    return data;
  }

  // Network latency ölçümü
  async measureNetworkLatency(url: string): Promise<number> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const endTime = Date.now();
      const latency = endTime - startTime;
      
      this.metrics.networkLatency = latency;
      return latency;
    } catch (error) {
      console.error('Network latency ölçüm hatası:', error);
      return -1;
    }
  }

  // Resim yükleme süresini ölç
  async measureImageLoadTime(url: string): Promise<number> {
    const startTime = Date.now();
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const loadTime = Date.now() - startTime;
        this.metrics.imageLoadTime = loadTime;
        resolve(loadTime);
      };
      img.onerror = () => {
        resolve(-1);
      };
      img.src = this.optimizeImageUrl(url);
    });
  }

  // Performans raporu oluştur
  generatePerformanceReport(): string {
    const stats = this.getCacheStats();
    const metrics = this.getPerformanceMetrics();
    
    return `
Performans Raporu:
==================
Cache İstatistikleri:
- Toplam Boyut: ${(stats.size / (1024 * 1024)).toFixed(2)} MB
- Öğe Sayısı: ${stats.itemCount}
- Hit Rate: ${(stats.hitRate * 100).toFixed(2)}%
- Hit: ${stats.hits}
- Miss: ${stats.misses}

Performans Metrikleri:
- Memory Usage: ${metrics.memoryUsage.toFixed(2)} MB
- CPU Usage: ${metrics.cpuUsage.toFixed(2)}%
- Network Latency: ${metrics.networkLatency}ms
- Image Load Time: ${metrics.imageLoadTime}ms
    `.trim();
  }

  // Performans optimizasyonu önerileri
  getOptimizationSuggestions(): string[] {
    const suggestions: string[] = [];
    const stats = this.getCacheStats();
    const metrics = this.getPerformanceMetrics();

    if (stats.hitRate < 0.5) {
      suggestions.push('Cache hit rate düşük. Daha fazla veri önbelleğe alınabilir.');
    }

    if (metrics.memoryUsage > 40) {
      suggestions.push('Memory usage yüksek. Cache boyutu azaltılabilir.');
    }

    if (metrics.networkLatency > 1000) {
      suggestions.push('Network latency yüksek. CDN kullanımı değerlendirilebilir.');
    }

    if (metrics.imageLoadTime > 2000) {
      suggestions.push('Resim yükleme süresi yüksek. Resim optimizasyonu yapılabilir.');
    }

    return suggestions;
  }
}

export default new PerformanceService(); 
export const cacheManager = CacheManager.getInstance(); 