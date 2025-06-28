import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listingId = parseInt(params.id);

    if (isNaN(listingId)) {
      return NextResponse.json(
        { error: 'Geçersiz ilan ID' },
        { status: 400 }
      );
    }

    // İlanı onayla
    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        status: 'active',
        approvedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'İlan başarıyla onaylandı',
      listing: updatedListing,
    });
  } catch (error) {
    console.error('İlan onaylama hatası:', error);
    return NextResponse.json(
      { error: 'İlan onaylanırken hata oluştu' },
      { status: 500 }
    );
  }
} 