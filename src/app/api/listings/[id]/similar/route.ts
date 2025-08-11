import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

async function readListings() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'listings.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Listings.json okuma hatası:', error);
    return [];
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const listingId = parseInt(id, 10);

  if (isNaN(listingId)) {
    return NextResponse.json({ error: 'Invalid listing ID' }, { status: 400 });
  }

  try {
    const listings = await readListings();
    const currentListing = listings.find((l: any) => l.id === listingId);

    if (!currentListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Aynı kategori ve alt kategorideki diğer ilanları bul
    const similarListings = listings.filter((l: any) => 
      l.id !== listingId && 
      (l.status === 'active' || l.status === 'onaylandı') &&
      (l.category === currentListing.category || l.subcategory === currentListing.subcategory)
    );

    // En fazla 5 benzer ilan döndür
    return NextResponse.json(similarListings.slice(0, 5));
  } catch (error) {
    console.error('Error fetching similar listings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 