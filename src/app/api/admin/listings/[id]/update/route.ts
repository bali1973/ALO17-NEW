import { NextResponse } from 'next/server';
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

async function writeListings(listings: any[]) {
  await fs.writeFile(LISTINGS_PATH, JSON.stringify(listings, null, 2), 'utf-8');
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const listings = await readListings();
    const listingIndex = listings.findIndex((l: any) => l.id.toString() === params.id);
    
    if (listingIndex === -1) {
      return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });
    }
    
    // Update the listing with new data, preserving id and createdAt
    listings[listingIndex] = {
      ...listings[listingIndex],
      ...body,
      id: listings[listingIndex].id,
      createdAt: listings[listingIndex].createdAt,
    };
    
    await writeListings(listings);
    
    return NextResponse.json({ message: 'İlan güncellendi', listing: listings[listingIndex] });
  } catch (error) {
    console.error('İlan güncelleme hatası:', error);
    return NextResponse.json({ error: 'İlan güncellenemedi' }, { status: 500 });
  }
} 