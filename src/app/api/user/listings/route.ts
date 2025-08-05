import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const LISTINGS_PATH = path.join(process.cwd(), 'public', 'listings.json');

async function readListings() {
  try {
    const data = await fs.readFile(LISTINGS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı ID gerekli' }, { status: 400 });
    }

    const listings = await readListings();

    // Kullanıcının ilanlarını filtrele
    const userListings = listings.filter((listing: any) => listing.email === userId);

    // İlanları formatla
    const formattedListings = userListings.map((listing: any) => ({
      id: listing.id,
      title: listing.title,
      price: listing.price,
      status: listing.status || 'active',
      views: listing.views || 0,
      createdAt: listing.createdAt || listing.date,
      category: listing.category,
      location: listing.location,
      images: listing.images || []
    }));

    // Tarihe göre sırala (en yeni önce)
    const sortedListings = formattedListings.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      listings: sortedListings
    });

  } catch (error) {
    console.error('Get user listings error:', error);
    return NextResponse.json({ 
      error: 'Kullanıcı ilanları alınırken hata oluştu',
      listings: []
    }, { status: 500 });
  }
} 