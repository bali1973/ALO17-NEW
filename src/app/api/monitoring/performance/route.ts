import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { metrics } = await request.json();

    if (!Array.isArray(metrics)) {
      return NextResponse.json(
        { error: 'Geçersiz veri formatı' },
        { status: 400 }
      );
    }

    // Performans metriklerini veritabanına kaydet
    const savedMetrics = await Promise.all(
      metrics.map(async (metric) => {
        return await prisma.performanceLog.create({
          data: {
            name: metric.name,
            duration: metric.duration,
            timestamp: new Date(metric.timestamp),
            userId: metric.userId,
            sessionId: metric.sessionId,
            url: metric.url,
            category: metric.category,
            metadata: metric.metadata ? JSON.stringify(metric.metadata) : null
          }
        });
      })
    );

    return NextResponse.json({ 
      success: true, 
      count: savedMetrics.length 
    });
  } catch (error) {
    console.error('Error saving performance metrics:', error);
    return NextResponse.json(
      { error: 'Performans metrikleri kaydedilemedi' },
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