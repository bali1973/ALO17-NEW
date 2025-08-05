import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      category,
      subcategory,
      keywords,
      priceRange,
      location,
      frequency
    } = body;

    // Email validasyonu
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Geçerli bir email adresi gerekli' },
        { status: 400 }
      );
    }

    // Mevcut aboneliği kontrol et (email bazlı)
    const existingSubscription = await prisma.notificationSubscription.findFirst({
      where: {
        email: email,
        category: category || null,
        subcategory: subcategory || null
      }
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'Bu email adresi ile bu kategoride zaten aboneliğiniz var' },
        { status: 400 }
      );
    }

    // Yeni abonelik oluştur
    const subscription = await prisma.notificationSubscription.create({
      data: {
        userId: null, // Giriş yapmamış kullanıcılar için null
        email: email,
        category: category || null,
        subcategory: subcategory || null,
        keywords: keywords ? JSON.stringify(keywords) : null,
        priceRange: priceRange ? JSON.stringify(priceRange) : null,
        location: location || null,
        frequency: frequency || 'instant'
      }
    });

    return NextResponse.json({
      success: true,
      subscription,
      message: 'Abonelik başarıyla oluşturuldu'
    });
  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: 'Abonelik oluşturulamadı' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, category, subcategory } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email adresi gerekli' },
        { status: 400 }
      );
    }

    // Aboneliği sil (email bazlı)
    const deletedSubscription = await prisma.notificationSubscription.deleteMany({
      where: {
        email: email,
        category: category || null,
        subcategory: subcategory || null
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Abonelik iptal edildi',
      deletedCount: deletedSubscription.count
    });
  } catch (error) {
    console.error('Subscription deletion error:', error);
    return NextResponse.json(
      { error: 'Abonelik iptal edilemedi' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');

    if (!email) {
      return NextResponse.json(
        { error: 'Email adresi gerekli' },
        { status: 400 }
      );
    }

    // Abonelikleri getir (email bazlı)
    const subscriptions = await prisma.notificationSubscription.findMany({
      where: {
        email: email,
        ...(category && { category }),
        ...(subcategory && { subcategory })
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { error: 'Abonelikler alınamadı' },
      { status: 500 }
    );
  }
} 