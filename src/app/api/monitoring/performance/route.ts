import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Body'nin var olup olmadığını kontrol et
    if (!body) {
      return NextResponse.json(
        { error: 'Request body bulunamadı' },
        { status: 400 }
      );
    }

    const { metrics } = body;

    // Metrics'in var olup olmadığını kontrol et
    if (!metrics) {
      return NextResponse.json(
        { error: 'Metrics verisi bulunamadı' },
        { status: 400 }
      );
    }

    if (!Array.isArray(metrics)) {
      return NextResponse.json(
        { error: 'Metrics bir array olmalıdır' },
        { status: 400 }
      );
    }

    // Boş array kontrolü
    if (metrics.length === 0) {
      return NextResponse.json({ 
        success: true, 
        count: 0,
        message: 'Boş metrics array'
      });
    }

    // Her metric'in gerekli alanları var mı kontrol et
    const validMetrics = metrics.filter(metric => {
      return metric && 
             typeof metric === 'object' && 
             metric.name && 
             typeof metric.name === 'string' &&
             metric.duration !== undefined &&
             (typeof metric.duration === 'number' || !isNaN(parseFloat(metric.duration)));
    });

    if (validMetrics.length === 0) {
      return NextResponse.json(
        { error: 'Geçerli metric bulunamadı' },
        { status: 400 }
      );
    }

    // Performans metriklerini veritabanına kaydet
    const savedMetrics = await Promise.all(
      validMetrics.map(async (metric) => {
        try {
          return await prisma.performanceLog.create({
            data: {
              name: metric.name,
              duration: typeof metric.duration === 'number' ? metric.duration : parseFloat(metric.duration),
              timestamp: new Date(metric.timestamp || Date.now()),
              userId: metric.userId || null,
              sessionId: metric.sessionId || null,
              url: metric.url || null,
              category: metric.category || 'general',
              metadata: metric.metadata ? JSON.stringify(metric.metadata) : null
            }
          });
        } catch (dbError) {
          console.error('Database error for metric:', metric, dbError);
          return null;
        }
      })
    );

    const successfulMetrics = savedMetrics.filter(metric => metric !== null);

    return NextResponse.json({ 
      success: true, 
      count: successfulMetrics.length,
      total: metrics.length,
      valid: validMetrics.length
    });
  } catch (error) {
    console.error('Error saving performance metrics:', error);
    return NextResponse.json(
      { error: 'Performans metrikleri kaydedilemedi', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category');
    const name = searchParams.get('name');

    const where: any = {};
    if (category) where.category = category;
    if (name) where.name = name;

    const metrics = await prisma.performanceLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit
    });

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return NextResponse.json(
      { error: 'Performans metrikleri alınamadı' },
      { status: 500 }
    );
  }
} 