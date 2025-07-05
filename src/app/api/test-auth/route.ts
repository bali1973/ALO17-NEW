import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Veritabanı bağlantısını test et
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Auth test başarılı',
      users: users,
      totalUsers: users.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Auth test hatası:', error);
    return NextResponse.json({
      success: false,
      message: 'Auth test hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 