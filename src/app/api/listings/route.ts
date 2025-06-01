import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Bu işlem için giriş yapmalısınız' },
        { status: 401 }
      );
    }

    const { title, description, price, location, category, subcategory, condition, images, type } = await req.json();

    // Gerekli alanları kontrol et
    if (!title || !description || !price || !location || !category || !condition) {
      return NextResponse.json(
        { message: 'Tüm gerekli alanları doldurun' },
        { status: 400 }
      );
    }

    // İlanı oluştur
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        location,
        category,
        subCategory: subcategory,
        condition,
        images,
        isPremium: type === 'PREMIUM',
        userId: session.user.id,
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error('İlan oluşturma hatası:', error);
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 