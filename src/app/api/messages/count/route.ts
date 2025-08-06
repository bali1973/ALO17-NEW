import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Şimdilik sabit değer döndürüyoruz
    // Gerçek uygulamada veritabanından mesaj sayısını çekeceğiz
    const messageCount = {
      unreadCount: 0,
      totalMessages: 0
    };

    return NextResponse.json(messageCount);
  } catch (error) {
    console.error('Error fetching message count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch message count' },
      { status: 500 }
    );
  }
} 