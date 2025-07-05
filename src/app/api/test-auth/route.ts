import { NextResponse } from 'next/server';

// Hardcoded kullanıcılar
const hardcodedUsers = [
  {
    id: '1',
    email: 'admin@alo17.com',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: '2',
    email: 'user@alo17.com',
    name: 'Normal User',
    role: 'user'
  },
  {
    id: '3',
    email: 'test@alo17.com',
    name: 'Test User',
    role: 'user'
  }
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Auth test başarılı - Hardcoded kullanıcılar',
      users: hardcodedUsers,
      totalUsers: hardcodedUsers.length,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
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