import { NextRequest, NextResponse } from 'next/server';

// Mock listings (production'da gerçek database kullanılacak)
let mockListings: any[] = [];

async function readListings() {
  return mockListings;
}

async function writeListings(listings: any[]) {
  mockListings = listings;
}

export async function GET(request: NextRequest) {
  try {
    const listings = await readListings();
    return NextResponse.json(listings);
  } catch (error) {
    console.error('İlanlar getirme hatası:', error);
    return NextResponse.json({ error: 'İlanlar getirilemedi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const listings = await readListings();
    
    const newListing = {
      id: listings.length + 1,
      ...body,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    listings.push(newListing);
    await writeListings(listings);
    
    return NextResponse.json({ success: true, listing: newListing });
  } catch (error) {
    console.error('İlan ekleme hatası:', error);
    return NextResponse.json({ error: 'İlan eklenemedi' }, { status: 500 });
  }
} 