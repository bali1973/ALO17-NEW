import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '24h';
    
    // Zaman aralığını hesapla
    const now = new Date();
    let startTime: Date;
    
    switch (timeRange) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Hata verilerini al
    const errors = await prisma.$queryRaw`
      SELECT 
        category,
        severity,
        COUNT(*) as count
      FROM ErrorLog 
      WHERE timestamp >= ${startTime}
      GROUP BY category, severity
      ORDER BY count DESC
      LIMIT 10
    `;

    // Performans verilerini al
    const performance = await prisma.$queryRaw`
      SELECT 
        name,
        AVG(duration) as avgDuration,
        MAX(duration) as maxDuration,
        MIN(duration) as minDuration,
        COUNT(*) as count
      FROM PerformanceLog 
      WHERE timestamp >= ${startTime}
      GROUP BY name
      ORDER BY avgDuration DESC
      LIMIT 10
    `;

    // Kullanıcı olaylarını al
    const userEvents = await prisma.$queryRaw`
      SELECT 
        event,
        COUNT(*) as count
      FROM UserEventLog 
      WHERE timestamp >= ${startTime}
      GROUP BY event
      ORDER BY count DESC
      LIMIT 10
    `;

    // Toplam olay sayısını hesapla
    const totalEvents = userEvents.reduce((sum: number, event: any) => sum + event.count, 0);
    
    // Yüzdelikleri hesapla
    const userEventsWithPercentage = userEvents.map((event: any) => ({
      ...event,
      percentage: totalEvents > 0 ? event.count / totalEvents : 0
    }));

    // Sistem sağlığı verilerini al
    const systemHealth = await getSystemHealth(startTime);

    const monitoringData = {
      errors: errors.map((error: any) => ({
        id: `${error.category}-${error.severity}`,
        message: `${error.category} hatası`,
        severity: error.severity,
        category: error.category,
        timestamp: now.toISOString(),
        count: error.count
      })),
      performance: performance.map((perf: any) => ({
        name: perf.name,
        avgDuration: Math.round(perf.avgDuration),
        maxDuration: Math.round(perf.maxDuration),
        minDuration: Math.round(perf.minDuration),
        count: perf.count
      })),
      userEvents: userEventsWithPercentage,
      systemHealth
    };

    return NextResponse.json(monitoringData);
  } catch (error) {
    console.error('Monitoring dashboard error:', error);
    return NextResponse.json(
      { error: 'Monitoring verileri alınamadı' },
      { status: 500 }
    );
  }
}

async function getSystemHealth(startTime: Date) {
  try {
    // Aktif kullanıcı sayısı (son 5 dakikada aktivite gösteren)
    const activeUsers = await prisma.$queryRaw`
      SELECT COUNT(DISTINCT userId) as count
      FROM UserEventLog 
      WHERE timestamp >= ${new Date(Date.now() - 5 * 60 * 1000)}
    `;

    // Toplam istek sayısı
    const totalRequests = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM PerformanceLog 
      WHERE timestamp >= ${startTime}
    `;

    // Hata oranı
    const errorCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM ErrorLog 
      WHERE timestamp >= ${startTime}
    `;

    const errorRate = totalRequests[0]?.count > 0 
      ? errorCount[0]?.count / totalRequests[0]?.count 
      : 0;

    // Mock sistem kaynakları (gerçek uygulamada sistem API'larından alınır)
    const memoryUsage = Math.random() * 0.8 + 0.2; // %20-100 arası
    const cpuUsage = Math.random() * 0.6 + 0.1; // %10-70 arası
    const uptime = Date.now() - new Date('2024-01-01').getTime(); // Saniye cinsinden

    return {
      uptime: Math.floor(uptime / 1000),
      memoryUsage,
      cpuUsage,
      activeUsers: activeUsers[0]?.count || 0,
      totalRequests: totalRequests[0]?.count || 0,
      errorRate
    };
  } catch (error) {
    console.error('System health error:', error);
    return {
      uptime: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      activeUsers: 0,
      totalRequests: 0,
      errorRate: 0
    };
  }
} 