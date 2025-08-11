import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Favori ekleme
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekiyor' }, { status: 401 });
    }

    const { listingId } = await request.json();
    if (!listingId) {
      return NextResponse.json({ error: 'İlan ID gerekli' }, { status: 400 });
    }

    // Prisma ile favori ekleme
    const { prisma } = await import('@/lib/prisma');
    
    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    // İlanı bul
    const listing = await prisma.listing.findUnique({
      where: { id: listingId }
    });

    if (!listing) {
      return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });
    }

    // Favori ekle
    const favorite = await prisma.userFavorite.create({
      data: {
        userId: user.id,
        listingId: listingId
      },
      include: {
        listing: true
      }
    });

    return NextResponse.json({ 
      message: 'Favorilere eklendi', 
      favorite 
    });

  } catch (error) {
    console.error('Favori ekleme hatası:', error);
    return NextResponse.json({ error: 'Favori eklenirken hata oluştu' }, { status: 500 });
  }
}

// Favori çıkarma
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekiyor' }, { status: 401 });
    }

    const { listingId } = await request.json();
    if (!listingId) {
      return NextResponse.json({ error: 'İlan ID gerekli' }, { status: 400 });
    }

    // Prisma ile favori çıkarma
    const { prisma } = await import('@/lib/prisma');
    
    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    // Favoriyi kaldır
    await prisma.userFavorite.deleteMany({
      where: {
        userId: user.id,
        listingId: listingId
      }
    });

    return NextResponse.json({ message: 'Favorilerden çıkarıldı' });

  } catch (error) {
    console.error('Favori çıkarma hatası:', error);
    return NextResponse.json({ error: 'Favori çıkarılırken hata oluştu' }, { status: 500 });
  }
}

// Favori listesi ve durum kontrolü
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekiyor' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');
    
    // Eğer listingId varsa, sadece favori durumunu kontrol et
    if (listingId) {
      const { prisma } = await import('@/lib/prisma');
      
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });

      if (!user) {
        return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
      }

      const favorite = await prisma.userFavorite.findUnique({
        where: {
          userId_listingId: {
            userId: user.id,
            listingId: listingId
          }
        }
      });

      return NextResponse.json({ isFavorite: !!favorite });
    }

    // Normal favori listesi
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Prisma ile favori listesi
    const { prisma } = await import('@/lib/prisma');
    
    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    // Filtreleme koşulları
    const where: any = {
      userId: user.id
    };

    if (category) {
      where.listing = {
        category: category
      };
    }

    if (search) {
      where.listing = {
        ...where.listing,
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      };
    }

    // Favori sayısı
    const totalFavorites = await prisma.userFavorite.count({ where });

    // Favori listesi
    const favorites = await prisma.userFavorite.findMany({
      where,
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            images: true,
            category: true,
            subcategory: true,
            location: true,
            createdAt: true,
            views: true,
            premium: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    return NextResponse.json({
      favorites,
      pagination: {
        page,
        limit,
        total: totalFavorites,
        pages: Math.ceil(totalFavorites / limit)
      }
    });

  } catch (error) {
    console.error('Favori listesi hatası:', error);
    return NextResponse.json({ error: 'Favori listesi yüklenirken hata oluştu' }, { status: 500 });
    }
}
