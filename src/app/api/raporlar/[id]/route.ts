import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { prisma } = await import('@/lib/prisma');
    
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            category: true,
            subcategory: true,
            location: true,
            status: true,
            createdAt: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!report) {
      return NextResponse.json({ error: 'Rapor bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('Rapor getirme hatası:', error);
    return NextResponse.json({ error: 'Rapor getirilirken hata oluştu' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekiyor' }, { status: 401 });
    }

    const body = await req.json();
    const { prisma } = await import('@/lib/prisma');
    
    const updatedReport = await prisma.report.update({
      where: { id: params.id },
      data: body,
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            category: true,
            subcategory: true,
            location: true,
            status: true,
            createdAt: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error('Rapor güncelleme hatası:', error);
    return NextResponse.json({ error: 'Rapor güncellenirken hata oluştu' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekiyor' }, { status: 401 });
    }

    const { prisma } = await import('@/lib/prisma');
    
    await prisma.report.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Rapor silme hatası:', error);
    return NextResponse.json({ error: 'Rapor silinirken hata oluştu' }, { status: 500 });
  }
} 