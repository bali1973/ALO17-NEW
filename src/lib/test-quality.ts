interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  timestamp: Date;
}

interface TestSuite {
  name: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  duration: number;
  coverage: number;
  results: TestResult[];
}

interface QualityMetrics {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  successRate: number;
  averageDuration: number;
  totalCoverage: number;
  suites: TestSuite[];
  timestamp: Date;
}

class TestQualityService {
  private static instance: TestQualityService;
  private testResults: TestResult[] = [];
  private suites: TestSuite[] = [];

  static getInstance(): TestQualityService {
    if (!TestQualityService.instance) {
      TestQualityService.instance = new TestQualityService();
    }
    return TestQualityService.instance;
  }

  // Test sonucu kaydet
  recordTestResult(result: TestResult): void {
    this.testResults.push(result);
  }

  // Test suite sonucu kaydet
  recordTestSuite(suite: TestSuite): void {
    this.suites.push(suite);
  }

  // Kalite metriklerini hesapla
  calculateQualityMetrics(): QualityMetrics {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.status === 'passed').length;
    const failedTests = this.testResults.filter(r => r.status === 'failed').length;
    const skippedTests = this.testResults.filter(r => r.status === 'skipped').length;
    
    const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
    const averageDuration = totalTests > 0 
      ? this.testResults.reduce((sum, r) => sum + r.duration, 0) / totalTests 
      : 0;
    
    const totalCoverage = this.suites.length > 0
      ? this.suites.reduce((sum, s) => sum + s.coverage, 0) / this.suites.length
      : 0;

    return {
      totalTests,
      passedTests,
      failedTests,
      skippedTests,
      successRate,
      averageDuration,
      totalCoverage,
      suites: this.suites,
      timestamp: new Date(),
    };
  }

  // Test performansını analiz et
  analyzeTestPerformance(): {
    slowTests: TestResult[];
    flakyTests: TestResult[];
    performanceIssues: string[];
  } {
    const slowTests = this.testResults.filter(r => r.duration > 5000); // 5 saniyeden uzun
    const flakyTests = this.findFlakyTests();
    
    const performanceIssues: string[] = [];
    
    if (slowTests.length > 0) {
      performanceIssues.push(`${slowTests.length} test çok yavaş çalışıyor`);
    }
    
    if (flakyTests.length > 0) {
      performanceIssues.push(`${flakyTests.length} test kararsız çalışıyor`);
    }
    
    if (this.calculateQualityMetrics().successRate < 90) {
      performanceIssues.push('Test başarı oranı %90\'ın altında');
    }

    return {
      slowTests,
      flakyTests,
      performanceIssues,
    };
  }

  // Kararsız testleri bul
  private findFlakyTests(): TestResult[] {
    const testGroups = this.groupTestsByName();
    const flakyTests: TestResult[] = [];
    
    Object.entries(testGroups).forEach(([name, results]) => {
      if (results.length > 1) {
        const hasPassed = results.some(r => r.status === 'passed');
        const hasFailed = results.some(r => r.status === 'failed');
        
        if (hasPassed && hasFailed) {
          flakyTests.push(...results);
        }
      }
    });
    
    return flakyTests;
  }

  // Testleri isme göre grupla
  private groupTestsByName(): Record<string, TestResult[]> {
    return this.testResults.reduce((groups, result) => {
      if (!groups[result.name]) {
        groups[result.name] = [];
      }
      groups[result.name].push(result);
      return groups;
    }, {} as Record<string, TestResult[]>);
  }

  // Test raporu oluştur
  generateTestReport(): string {
    const metrics = this.calculateQualityMetrics();
    const performance = this.analyzeTestPerformance();
    
    const report = `
# Test Kalite Raporu
**Oluşturulma Tarihi:** ${metrics.timestamp.toLocaleString('tr-TR')}

## Genel İstatistikler
- **Toplam Test:** ${metrics.totalTests}
- **Başarılı Test:** ${metrics.passedTests}
- **Başarısız Test:** ${metrics.failedTests}
- **Atlanan Test:** ${metrics.skippedTests}
- **Başarı Oranı:** ${metrics.successRate.toFixed(2)}%
- **Ortalama Süre:** ${metrics.averageDuration.toFixed(2)}ms
- **Toplam Coverage:** ${metrics.totalCoverage.toFixed(2)}%

## Test Suite'leri
${metrics.suites.map(suite => `
### ${suite.name}
- **Toplam Test:** ${suite.totalTests}
- **Başarılı:** ${suite.passedTests}
- **Başarısız:** ${suite.failedTests}
- **Coverage:** ${suite.coverage.toFixed(2)}%
- **Süre:** ${suite.duration}ms
`).join('')}

## Performans Analizi
${performance.performanceIssues.length > 0 
  ? `### Sorunlar\n${performance.performanceIssues.map(issue => `- ${issue}`).join('\n')}`
  : '### Performans sorunu bulunamadı'
}

${performance.slowTests.length > 0 
  ? `### Yavaş Testler\n${performance.slowTests.map(test => `- ${test.name} (${test.duration}ms)`).join('\n')}`
  : ''
}

${performance.flakyTests.length > 0 
  ? `### Kararsız Testler\n${performance.flakyTests.map(test => `- ${test.name}`).join('\n')}`
  : ''
}

## Öneriler
${this.generateRecommendations(metrics, performance)}
    `;
    
    return report.trim();
  }

  // Öneriler oluştur
  private generateRecommendations(metrics: QualityMetrics, performance: any): string {
    const recommendations: string[] = [];
    
    if (metrics.successRate < 95) {
      recommendations.push('Test başarı oranını artırmak için başarısız testleri gözden geçirin');
    }
    
    if (metrics.totalCoverage < 80) {
      recommendations.push('Test coverage\'ını artırmak için daha fazla test yazın');
    }
    
    if (performance.slowTests.length > 0) {
      recommendations.push('Yavaş testleri optimize edin veya paralel çalıştırın');
    }
    
    if (performance.flakyTests.length > 0) {
      recommendations.push('Kararsız testleri düzeltin veya mock kullanın');
    }
    
    if (metrics.averageDuration > 2000) {
      recommendations.push('Test sürelerini azaltmak için async işlemleri optimize edin');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Test kalitesi iyi durumda, mevcut seviyeyi koruyun');
    }
    
    return recommendations.map(rec => `- ${rec}`).join('\n');
  }

  // Test sonuçlarını temizle
  clearResults(): void {
    this.testResults = [];
    this.suites = [];
  }

  // Test sonuçlarını dışa aktar
  exportResults(): {
    metrics: QualityMetrics;
    performance: any;
    report: string;
  } {
    const metrics = this.calculateQualityMetrics();
    const performance = this.analyzeTestPerformance();
    const report = this.generateTestReport();
    
    return {
      metrics,
      performance,
      report,
    };
  }
}

export const testQuality = TestQualityService.getInstance();
export default testQuality; 