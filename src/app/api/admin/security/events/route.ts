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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const severity = searchParams.get('severity');
    const ip = searchParams.get('ip');
    const userId = searchParams.get('userId');
    const resolved = searchParams.get('resolved');
    const limit = parseInt(searchParams.get('limit') || '100');

    // Güvenlik servisinden olayları al
    const { security } = await import('@/lib/security');
    
    const filters: any = {};
    if (type) filters.type = type;
    if (severity) filters.severity = severity;
    if (ip) filters.ip = ip;
    if (userId) filters.userId = userId;
    if (resolved !== null) filters.resolved = resolved === 'true';

    const events = security.getEvents(filters).slice(0, limit);

    return NextResponse.json({
      success: true,
      events,
      total: events.length,
    });

  } catch (error) {
    console.error('Security events error:', error);
    return NextResponse.json({ 
      error: 'Security events could not be retrieved' 
    }, { status: 500 });
  }
} 