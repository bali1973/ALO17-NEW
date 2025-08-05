import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { events } = await request.json();

    if (!Array.isArray(events)) {
      return NextResponse.json(
        { error: 'Geçersiz veri formatı' },
        { status: 400 }
      );
    }

    // Kullanıcı olaylarını veritabanına kaydet
    const savedEvents = await Promise.all(
      events.map(async (event) => {
        return await prisma.userEventLog.create({
          data: {
            event: event.event,
            timestamp: new Date(event.timestamp),
            userId: event.userId,
            sessionId: event.sessionId,
            url: event.url,
            properties: event.properties ? JSON.stringify(event.properties) : null
          }
        });
      })
    );

    return NextResponse.json({ 
      success: true, 
      count: savedEvents.length 
    });
  } catch (error) {
    console.error('Error saving user events:', error);
    return NextResponse.json(
      { error: 'Kullanıcı olayları kaydedilemedi' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const event = searchParams.get('event');
    const userId = searchParams.get('userId');

    const where: any = {};
    if (event) where.event = event;
    if (userId) where.userId = userId;

    const events = await prisma.userEventLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching user events:', error);
    return NextResponse.json(
      { error: 'Kullanıcı olayları alınamadı' },
      { status: 500 }
    );
  }
} 