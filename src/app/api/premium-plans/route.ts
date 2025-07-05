import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const plans = await prisma.premiumPlan.findMany({
      orderBy: { days: 'asc' }
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error('Premium planları getirme hatası:', error);
    return NextResponse.json(
      { message: 'Premium planları getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || (session?.user as any)?.role !== 'admin') {
      return NextResponse.json(
        { message: 'Bu işlem için admin yetkisi gerekiyor' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { plans } = data;

    if (!Array.isArray(plans)) {
      return NextResponse.json(
        { message: 'Geçersiz veri formatı' },
        { status: 400 }
      );
    }

    // Tüm planları güncelle
    const updatePromises = plans.map(plan => 
      prisma.premiumPlan.update({
        where: { key: plan.key },
        data: {
          name: plan.name,
          price: plan.price,
          days: plan.days
        }
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ message: 'Premium planlar başarıyla güncellendi' });
  } catch (error) {
    console.error('Premium plan güncelleme hatası:', error);
    return NextResponse.json(
      { message: 'Premium planlar güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 