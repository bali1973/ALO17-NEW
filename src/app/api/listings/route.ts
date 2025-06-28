import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

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

    const where: Prisma.ListingWhereInput = {
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
    const { title, description, price, category, subcategory, images, condition, location } = data;

    if (!title || !description || !price || !category || !condition || !location) {
      return NextResponse.json(
        { message: 'Tüm alanları doldurun' },
        { status: 400 }
      );
    }

    // 30 gün sonrası için tarih hesapla
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        subCategory: subcategory,
        condition,
        location,
        images: JSON.stringify(images),
        features: JSON.stringify([]),
        userId: session.user.id,
        // 30 gün ücretsiz premium özelliği
        isPremium: true,
        premiumUntil: thirtyDaysFromNow
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