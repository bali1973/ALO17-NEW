import { NextRequest, NextResponse } from 'next/server';

// Mock session token parser
function parseSessionToken(token: string): { email: string; id: string } | null {
  try {
    // Token'ı decode et (mock implementation)
    if (token.startsWith('mock_token_')) {
      const parts = token.split('_');
      if (parts.length >= 3) {
        return {
          id: parts[2],
          email: parts[3] || 'unknown@example.com'
        };
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const { prisma } = await import('@/lib/prisma');
    
    const reports = await prisma.report.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Raporlar yükleme hatası:', error);
    return NextResponse.json({ error: 'Raporlar yüklenirken hata oluştu' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Authorization header'dan session bilgisini al
    const authHeader = req.headers.get('authorization');
    const sessionToken = authHeader?.replace('Bearer ', '');
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekiyor' }, { status: 401 });
    }

    // Session token'ı parse et (mock implementation)
    const sessionData = parseSessionToken(sessionToken);
    if (!sessionData?.email) {
      return NextResponse.json({ error: 'Geçersiz session' }, { status: 401 });
    }

    const body = await req.json();
    console.log('Rapor oluşturma isteği:', body);
    
    const { prisma } = await import('@/lib/prisma');
    
    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: sessionData.email }
    });

    if (!user) {
      console.log('Kullanıcı bulunamadı:', sessionData.email);
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    console.log('Kullanıcı bulundu:', user.id);

    // Yeni rapor oluştur
    const reportData = {
      type: body.type || 'Genel Şikayet',
      subject: body.subject || '',
      description: body.description || '',
      status: body.status || 'Açık',
      priority: body.priority || 'medium',
      listingId: body.listingId || null,
      listingTitle: body.listingTitle || null,
      reportedUserEmail: body.reportedUserEmail || null,
      userId: user.id
    };

    console.log('Rapor verisi:', reportData);

    console.log('Prisma create çağrısı öncesi');
    
    const newReport = await prisma.report.create({
      data: reportData
    });

    console.log('Rapor oluşturuldu:', newReport);

    return NextResponse.json({ success: true, report: newReport });
  } catch (error) {
    console.error('Rapor oluşturma hatası:', error);
    console.error('Hata detayları:', {
      message: error instanceof Error ? error.message : 'Bilinmeyen hata',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ 
      error: 'Rapor oluşturulurken hata oluştu',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { prisma } = await import('@/lib/prisma');
    
    // Toplu işlem kontrolü
    if (body.action === 'markAllAsRead') {
      const updatedReports = await prisma.report.updateMany({
        where: {
          status: 'Açık'
        },
        data: {
          status: 'Çözüldü'
        }
      });

      return NextResponse.json({ success: true, count: updatedReports.count });
    }
    
    // Tekil güncelleme
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
    
    const updatedReport = await prisma.report.update({
      where: { id },
      data: updates,
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

    return NextResponse.json({ success: true, report: updatedReport });
  } catch (error) {
    console.error('Rapor güncelleme hatası:', error);
    return NextResponse.json({ error: 'Rapor güncellenirken hata oluştu' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    
    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
    
    const { prisma } = await import('@/lib/prisma');
    
    const updatedReport = await prisma.report.update({
      where: { id },
      data: updates,
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

    return NextResponse.json({ success: true, report: updatedReport });
  } catch (error) {
    console.error('Rapor güncelleme hatası:', error);
    return NextResponse.json({ error: 'Rapor güncellenirken hata oluştu' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    
    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
    
    const { prisma } = await import('@/lib/prisma');
    
    await prisma.report.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Rapor silme hatası:', error);
    return NextResponse.json({ error: 'Rapor silinirken hata oluştu' }, { status: 500 });
  }
} 