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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const listings = await readListings();
    const listingIndex = listings.findIndex((l: any) => l.id.toString() === params.id);
    
    if (listingIndex === -1) {
      return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });
    }
    
    listings.splice(listingIndex, 1);
    await writeListings(listings);
    
    return NextResponse.json({ message: 'İlan silindi' });
  } catch (error) {
    console.error('İlan silme hatası:', error);
    return NextResponse.json({ error: 'İlan silinemedi' }, { status: 500 });
  }
} 