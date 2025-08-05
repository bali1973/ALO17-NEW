// Performance Testing Suite

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  totalBlockingTime: number;
  speedIndex: number;
}

interface TestResult {
  testName: string;
  metrics: PerformanceMetrics;
  passed: boolean;
  score: number;
  recommendations: string[];
}

class PerformanceTester {
  private results: TestResult[] = [];

  // Core Web Vitals Test
  async testCoreWebVitals(): Promise<TestResult> {
    const startTime = performance.now();
    
    // Sayfa yükleme süresini ölç
    await this.waitForPageLoad();
    const loadTime = performance.now() - startTime;

    // Core Web Vitals metriklerini al
    const metrics = await this.getCoreWebVitals();
    metrics.loadTime = loadTime;

    // Skor hesapla
    const score = this.calculateScore(metrics);
    const passed = score >= 90;

    const recommendations = this.getRecommendations(metrics);

    return {
      testName: 'Core Web Vitals',
      metrics,
      passed,
      score,
      recommendations
    };
  }

  // API Response Time Test
  async testAPIPerformance(): Promise<TestResult> {
    const endpoints = [
      '/api/listings',
      '/api/categories',
      '/api/search',
      '/api/admin/users'
    ];

    const results = await Promise.all(
      endpoints.map(async (endpoint) => {
        const startTime = performance.now();
        try {
          const response = await fetch(endpoint);
          const endTime = performance.now();
          return {
            endpoint,
            responseTime: endTime - startTime,
            status: response.status,
            success: response.ok
          };
        } catch (error) {
          return {
            endpoint,
            responseTime: -1,
            status: 0,
            success: false,
            error: error.message
          };
        }
      })
    );

    const avgResponseTime = results
      .filter(r => r.success)
      .reduce((sum, r) => sum + r.responseTime, 0) / results.filter(r => r.success).length;

    const successRate = results.filter(r => r.success).length / results.length * 100;

    const passed = avgResponseTime < 500 && successRate > 95;
    const score = Math.min(100, (500 - avgResponseTime) / 5 + successRate);

    return {
      testName: 'API Performance',
      metrics: {
        loadTime: avgResponseTime,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        firstInputDelay: 0,
        cumulativeLayoutShift: 0,
        totalBlockingTime: 0,
        speedIndex: successRate
      },
      passed,
      score,
      recommendations: this.getAPIRecommendations(results)
    };
  }

  // Image Loading Test
  async testImagePerformance(): Promise<TestResult> {
    const images = document.querySelectorAll('img');
    const imageLoadTimes: number[] = [];
    const failedImages: string[] = [];

    const imagePromises = Array.from(images).map((img) => {
      return new Promise<void>((resolve) => {
        const startTime = performance.now();
        
        if (img.complete) {
          imageLoadTimes.push(0);
          resolve();
        } else {
          img.onload = () => {
            imageLoadTimes.push(performance.now() - startTime);
            resolve();
          };
          
          img.onerror = () => {
            failedImages.push(img.src);
            resolve();
          };
        }
      });
    });

    await Promise.all(imagePromises);

    const avgLoadTime = imageLoadTimes.reduce((sum, time) => sum + time, 0) / imageLoadTimes.length;
    const successRate = (images.length - failedImages.length) / images.length * 100;

    const passed = avgLoadTime < 1000 && successRate > 95;
    const score = Math.min(100, (1000 - avgLoadTime) / 10 + successRate);

    return {
      testName: 'Image Performance',
      metrics: {
        loadTime: avgLoadTime,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        firstInputDelay: 0,
        cumulativeLayoutShift: 0,
        totalBlockingTime: 0,
        speedIndex: successRate
      },
      passed,
      score,
      recommendations: this.getImageRecommendations(avgLoadTime, failedImages)
    };
  }

  // Bundle Size Test
  async testBundleSize(): Promise<TestResult> {
    const resources = performance.getEntriesByType('resource');
    const jsFiles = resources.filter(r => r.name.endsWith('.js'));
    const cssFiles = resources.filter(r => r.name.endsWith('.css'));

    const totalJsSize = jsFiles.reduce((sum, file) => sum + (file as any).transferSize || 0, 0);
    const totalCssSize = cssFiles.reduce((sum, file) => sum + (file as any).transferSize || 0, 0);
    const totalSize = totalJsSize + totalCssSize;

    // 500KB altı ideal
    const passed = totalSize < 500 * 1024;
    const score = Math.max(0, 100 - (totalSize - 200 * 1024) / (500 * 1024 - 200 * 1024) * 100);

    return {
      testName: 'Bundle Size',
      metrics: {
        loadTime: totalSize,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        firstInputDelay: 0,
        cumulativeLayoutShift: 0,
        totalBlockingTime: 0,
        speedIndex: jsFiles.length + cssFiles.length
      },
      passed,
      score,
      recommendations: this.getBundleRecommendations(totalSize, jsFiles.length, cssFiles.length)
    };
  }

  // Memory Usage Test
  async testMemoryUsage(): Promise<TestResult> {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMemory = memory.usedJSHeapSize;
      const totalMemory = memory.totalJSHeapSize;
      const memoryUsage = (usedMemory / totalMemory) * 100;

      const passed = memoryUsage < 80;
      const score = Math.max(0, 100 - memoryUsage);

      return {
        testName: 'Memory Usage',
        metrics: {
          loadTime: memoryUsage,
          firstContentfulPaint: 0,
          largestContentfulPaint: 0,
          firstInputDelay: 0,
          cumulativeLayoutShift: 0,
          totalBlockingTime: 0,
          speedIndex: usedMemory
        },
        passed,
        score,
        recommendations: this.getMemoryRecommendations(memoryUsage)
      };
    }

    return {
      testName: 'Memory Usage',
      metrics: {
        loadTime: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        firstInputDelay: 0,
        cumulativeLayoutShift: 0,
        totalBlockingTime: 0,
        speedIndex: 0
      },
      passed: true,
      score: 100,
      recommendations: ['Memory API not available']
    };
  }

  // Tüm testleri çalıştır
  async runAllTests(): Promise<TestResult[]> {
    console.log('🚀 Performance tests başlatılıyor...');

    const tests = [
      this.testCoreWebVitals(),
      this.testAPIPerformance(),
      this.testImagePerformance(),
      this.testBundleSize(),
      this.testMemoryUsage()
    ];

    this.results = await Promise.all(tests);
    
    console.log('✅ Performance tests tamamlandı');
    this.printResults();
    
    return this.results;
  }

  // Sonuçları yazdır
  private printResults(): void {
    console.log('\n📊 PERFORMANCE TEST SONUÇLARI');
    console.log('=' .repeat(50));

    this.results.forEach(result => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${result.testName} - Skor: ${result.score.toFixed(1)}/100`);
      
      if (result.recommendations.length > 0) {
        console.log('   Öneriler:');
        result.recommendations.forEach(rec => console.log(`   • ${rec}`));
      }
      console.log('');
    });

    const avgScore = this.results.reduce((sum, r) => sum + r.score, 0) / this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    
    console.log(`📈 Genel Skor: ${avgScore.toFixed(1)}/100`);
    console.log(`✅ Geçen Testler: ${passedTests}/${this.results.length}`);
    console.log('=' .repeat(50));
  }

  // Yardımcı metodlar
  private async waitForPageLoad(): Promise<void> {
    if (document.readyState === 'complete') {
      return;
    }
    
    return new Promise((resolve) => {
      window.addEventListener('load', resolve);
    });
  }

  private async getCoreWebVitals(): Promise<PerformanceMetrics> {
    return new Promise((resolve) => {
      const metrics: PerformanceMetrics = {
        loadTime: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        firstInputDelay: 0,
        cumulativeLayoutShift: 0,
        totalBlockingTime: 0,
        speedIndex: 0
      };

      // FCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          metrics.firstContentfulPaint = entries[entries.length - 1].startTime;
        }
      }).observe({ entryTypes: ['paint'] });

      // LCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          metrics.largestContentfulPaint = entries[entries.length - 1].startTime;
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // FID
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          metrics.firstInputDelay = entry.processingStart - entry.startTime;
        });
      }).observe({ entryTypes: ['first-input'] });

      // CLS
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            metrics.cumulativeLayoutShift += entry.value;
          }
        });
      }).observe({ entryTypes: ['layout-shift'] });

      // TBT
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.duration > 50) {
            metrics.totalBlockingTime += entry.duration - 50;
          }
        });
      }).observe({ entryTypes: ['longtask'] });

      // 3 saniye sonra sonuçları döndür
      setTimeout(() => resolve(metrics), 3000);
    });
  }

  private calculateScore(metrics: PerformanceMetrics): number {
    let score = 100;

    // LCP (0-2.5s = 100, 2.5-4s = 50, >4s = 0)
    if (metrics.largestContentfulPaint > 4000) score -= 25;
    else if (metrics.largestContentfulPaint > 2500) score -= 12;

    // FID (0-100ms = 100, 100-300ms = 50, >300ms = 0)
    if (metrics.firstInputDelay > 300) score -= 25;
    else if (metrics.firstInputDelay > 100) score -= 12;

    // CLS (0-0.1 = 100, 0.1-0.25 = 50, >0.25 = 0)
    if (metrics.cumulativeLayoutShift > 0.25) score -= 25;
    else if (metrics.cumulativeLayoutShift > 0.1) score -= 12;

    // Load Time
    if (metrics.loadTime > 3000) score -= 15;
    else if (metrics.loadTime > 2000) score -= 7;

    return Math.max(0, score);
  }

  private getRecommendations(metrics: PerformanceMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.largestContentfulPaint > 2500) {
      recommendations.push('LCP iyileştirmesi: Resimleri optimize edin, CDN kullanın');
    }

    if (metrics.firstInputDelay > 100) {
      recommendations.push('FID iyileştirmesi: JavaScript bundle\'ını küçültün');
    }

    if (metrics.cumulativeLayoutShift > 0.1) {
      recommendations.push('CLS iyileştirmesi: Resim boyutlarını belirtin');
    }

    if (metrics.loadTime > 2000) {
      recommendations.push('Sayfa yükleme süresini azaltın');
    }

    return recommendations;
  }

  private getAPIRecommendations(results: any[]): string[] {
    const recommendations: string[] = [];
    const slowEndpoints = results.filter(r => r.responseTime > 500);

    if (slowEndpoints.length > 0) {
      recommendations.push('Yavaş API endpoint\'leri optimize edin');
    }

    const failedEndpoints = results.filter(r => !r.success);
    if (failedEndpoints.length > 0) {
      recommendations.push('Başarısız API endpoint\'lerini düzeltin');
    }

    return recommendations;
  }

  private getImageRecommendations(avgLoadTime: number, failedImages: string[]): string[] {
    const recommendations: string[] = [];

    if (avgLoadTime > 1000) {
      recommendations.push('Resim yükleme süresini azaltın');
    }

    if (failedImages.length > 0) {
      recommendations.push('Yüklenemeyen resimleri düzeltin');
    }

    return recommendations;
  }

  private getBundleRecommendations(totalSize: number, jsCount: number, cssCount: number): string[] {
    const recommendations: string[] = [];

    if (totalSize > 500 * 1024) {
      recommendations.push('Bundle boyutunu küçültün');
    }

    if (jsCount > 10) {
      recommendations.push('JavaScript dosyalarını birleştirin');
    }

    if (cssCount > 5) {
      recommendations.push('CSS dosyalarını birleştirin');
    }

    return recommendations;
  }

  private getMemoryRecommendations(memoryUsage: number): string[] {
    const recommendations: string[] = [];

    if (memoryUsage > 80) {
      recommendations.push('Memory kullanımını azaltın');
    }

    return recommendations;
  }
}

// Global instance
export const performanceTester = new PerformanceTester();

// Otomatik test başlatma
if (typeof window !== 'undefined') {
  // Development modunda testleri çalıştır
  if (process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      performanceTester.runAllTests();
    }, 5000);
  }
} 