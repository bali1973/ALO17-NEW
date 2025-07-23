import { NextResponse } from 'next/server';

// Mock listings (production'da gerçek database kullanılacak)
let mockListings: any[] = [];

async function readListings() {
  return mockListings;
}

async function writeListings(listings: any[]) {
  mockListings = listings;
}

// İlan güncelleme
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const { id } = await params;
    const listingId = parseInt(id);
    
    const listings = await readListings();
    const listingIndex = listings.findIndex((l: any) => l.id === listingId);
    
    if (listingIndex === -1) {
      return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });
    }

    // İlanı güncelle
    listings[listingIndex] = {
      ...listings[listingIndex],
      ...body,
      id: listingId,
      updatedAt: new Date().toISOString()
    };

    await writeListings(listings);

    return NextResponse.json({
      success: true,
      listing: listings[listingIndex]
    });
  } catch (error) {
    console.error('İlan güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'İlan güncellenemedi' },
      { status: 500 }
    );
  }
}

// İlan silme
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const listingId = parseInt(id);
    
    const listings = await readListings();
    const listingIndex = listings.findIndex((l: any) => l.id === listingId);
    
    if (listingIndex === -1) {
      return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });
    }

    // İlanı sil
    listings.splice(listingIndex, 1);
    await writeListings(listings);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('İlan silme hatası:', error);
    return NextResponse.json(
      { error: 'İlan silinemedi' },
      { status: 500 }
    );
  }
}

// İlan getirme
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const listingId = parseInt(id);
    
    const listings = await readListings();
    const listing = listings.find((l: any) => l.id === listingId);
    
    if (!listing) {
      return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ listing });
  } catch (error) {
    console.error('İlan getirme hatası:', error);
    return NextResponse.json(
      { error: 'İlan getirilemedi' },
      { status: 500 }
    );
  }
} 