import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Admin yetkisi kontrol et
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Güvenlik servisinden istatistikleri al
    const { security } = await import('@/lib/security');
    const stats = security.getStats();

    return NextResponse.json({
      success: true,
      stats,
    });

  } catch (error) {
    console.error('Security stats error:', error);
    return NextResponse.json({ 
      error: 'Security stats could not be retrieved' 
    }, { status: 500 });
  }
} 