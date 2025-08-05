import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Admin yetkisi kontrol et
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const eventId = params.id;

    // Güvenlik servisinden olayı çöz
    const { security } = await import('@/lib/security');
    const success = security.resolveEvent(eventId);

    if (!success) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Event resolved successfully',
    });

  } catch (error) {
    console.error('Resolve event error:', error);
    return NextResponse.json({ 
      error: 'Event could not be resolved' 
    }, { status: 500 });
  }
} 