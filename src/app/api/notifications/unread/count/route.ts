import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const NOTIFICATIONS_PATH = path.join(process.cwd(), 'public', 'notifications.json');

async function readNotifications() {
  try {
    const data = await fs.readFile(NOTIFICATIONS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı ID gerekli' }, { status: 400 });
    }

    const notifications = await readNotifications();
    
    // Kullanıcıya ait okunmamış bildirimleri say
    const unreadCount = notifications.filter((notification: any) => 
      notification.userId === userId && !notification.isRead
    ).length;

    return NextResponse.json({
      success: true,
      unreadCount,
      totalNotifications: notifications.filter((n: any) => n.userId === userId).length
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    return NextResponse.json({ 
      error: 'Okunmamış bildirim sayısı alınırken hata oluştu' 
    }, { status: 500 });
  }
} 