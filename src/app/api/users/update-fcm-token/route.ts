import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, token } = await request.json();

    // Token'ı veritabanında güncelle
    await prisma.user.update({
      where: { id: userId },
      data: { fcmToken: token },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating FCM token:', error);
    return NextResponse.json(
      { error: 'Failed to update FCM token' },
      { status: 500 }
    );
  }
} 