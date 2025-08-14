import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sender, senderEmail, receiver, content, subject, type, date, listingId, receiverId } = body;

    // Gerekli alanları kontrol et
    if (!sender || !senderEmail || !content) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    // Mesajı veritabanına kaydet
    const message = await prisma.message.create({
      data: {
        sender,
        senderEmail,
        receiver: receiver || receiverId || 'bilinmiyor',
        content,
        subject: subject || 'İlan Hakkında',
        type: type || 'listing',
        date: date ? new Date(date) : new Date(),
        listingId: listingId || null,
        isRead: false,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Mesaj gönderme hatası:', error);
    return NextResponse.json(
      { error: 'Mesaj gönderilemedi' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const listingId = searchParams.get('listingId');
    const sellerId = searchParams.get('sellerId');

    let whereClause: any = {};

    if (type) {
      whereClause.type = type;
    }

    if (listingId) {
      whereClause.listingId = listingId;
    }

    if (sellerId) {
      whereClause.receiver = sellerId;
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      orderBy: {
        date: 'desc',
      },
    });

    // Admin sayfası için doğru format
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Mesajları getirme hatası:', error);
    
    // Daha detaylı hata mesajı
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Mesajlar yüklenemedi: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Mesajlar yüklenemedi' },
      { status: 500 }
    );
  }
}
