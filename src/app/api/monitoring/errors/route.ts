import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { errors } = await request.json();

    if (!Array.isArray(errors)) {
      return NextResponse.json(
        { error: 'Geçersiz veri formatı' },
        { status: 400 }
      );
    }

    // Hataları veritabanına kaydet
    const savedErrors = await Promise.all(
      errors.map(async (error) => {
        return await prisma.errorLog.create({
          data: {
            message: error.message,
            stack: error.stack,
            timestamp: new Date(error.timestamp),
            userId: error.userId,
            sessionId: error.sessionId,
            url: error.url,
            userAgent: error.userAgent,
            severity: error.severity,
            category: error.category,
            metadata: error.metadata ? JSON.stringify(error.metadata) : null
          }
        });
      })
    );

    return NextResponse.json({ 
      success: true, 
      count: savedErrors.length 
    });
  } catch (error) {
    console.error('Error saving errors:', error);
    return NextResponse.json(
      { error: 'Hatalar kaydedilemedi' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const severity = searchParams.get('severity');
    const category = searchParams.get('category');

    const where: any = {};
    if (severity) where.severity = severity;
    if (category) where.category = category;

    const errors = await prisma.errorLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit
    });

    return NextResponse.json({ errors });
  } catch (error) {
    console.error('Error fetching errors:', error);
    return NextResponse.json(
      { error: 'Hatalar alınamadı' },
      { status: 500 }
    );
  }
} 