import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Admin yetkisi kontrolü
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();
    const { isPremium, premiumPlan, premiumFeatures, premiumUntil } = body;

    // Mock veritabanı güncellemesi (gerçek projede Prisma kullanılacak)
    // Bu örnek için basit bir güncelleme simülasyonu
    console.log(`İlan ${id} premium durumu güncelleniyor:`, {
      isPremium,
      premiumPlan,
      premiumFeatures,
      premiumUntil
    });

    // Başarılı güncelleme
    return NextResponse.json({ 
      success: true, 
      message: 'Premium durumu başarıyla güncellendi',
      data: {
        id,
        isPremium,
        premiumPlan,
        premiumFeatures,
        premiumUntil
      }
    });

  } catch (error) {
    console.error('Premium güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Premium durumu güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}
