import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { listingId, paymentId } = body;

    if (!listingId) {
      return NextResponse.json({ error: 'İlan ID gerekli' }, { status: 400 });
    }

    // İlanı güncelle
    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        status: 'active',
        // Premium özellikleri örnek olarak ekleniyor
        // İsterseniz premium alanlarını şemaya ekleyebilirsiniz
        // isPremium: true,
        // premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'İlan başarıyla yayınlandı',
      listing: updatedListing,
    });
  } catch (error) {
    console.error('İlan yayınlama hatası:', error);
    return NextResponse.json(
      { error: 'İlan yayınlanamadı' },
      { status: 500 }
    );
  }
} 