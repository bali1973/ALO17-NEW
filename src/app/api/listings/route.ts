import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    const where: any = {
      AND: [
        { isPremium: true },
        category ? { category } : {},
        subcategory ? { subCategory: subcategory } : {},
        search ? {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } }
          ]
        } : {}
      ]
    };

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: {
          [sort]: order
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.listing.count({ where })
    ]);

    return NextResponse.json({
      listings,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('İlanlar getirme hatası:', error);
    return NextResponse.json(
      { message: 'İlanlar getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Bu işlem için giriş yapmalısınız' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { title, description, price, category, subcategory, images, condition, location, premiumPlan, features } = data;

    if (!title || !description || !price || !category || !condition || !location) {
      return NextResponse.json(
        { message: 'Tüm alanları doldurun' },
        { status: 400 }
      );
    }

    // Resim sayısını kontrol et (maksimum 5)
    if (images && images.length > 5) {
      return NextResponse.json(
        { message: 'Maksimum 5 resim yükleyebilirsiniz' },
        { status: 400 }
      );
    }

    // Premium plan varsa süreyi hesapla, yoksa 30 gün ücretsiz
    let premiumUntil = null;
    let isPremium = false;
    let planType = null;

    if (premiumPlan && premiumPlan !== 'free') {
      // Premium plan seçilmişse
      const { calculatePremiumEndDate } = await import('@/lib/utils');
      premiumUntil = calculatePremiumEndDate(premiumPlan);
      isPremium = true;
      planType = premiumPlan;
    } else {
      // Normal ilan - 30 gün ücretsiz premium
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      premiumUntil = thirtyDaysFromNow;
      isPremium = true;
      planType = 'free';
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        subCategory: subcategory,
        condition,
        location,
        images: JSON.stringify(images || []),
        features: JSON.stringify(features || []),
        userId: session.user.id,
        isPremium,
        premiumUntil,
        premiumPlan: planType
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error('İlan oluşturma hatası:', error);
    return NextResponse.json(
      { message: 'İlan oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 