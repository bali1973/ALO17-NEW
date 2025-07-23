import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listingsPath = path.join(process.cwd(), 'public', 'listings.json');
    const listingsData = fs.readFileSync(listingsPath, 'utf-8');
    const listings = JSON.parse(listingsData);

    const listingIndex = listings.findIndex((l: any) => l.id.toString() === params.id);
    
    if (listingIndex === -1) {
      return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });
    }

    listings.splice(listingIndex, 1);

    fs.writeFileSync(listingsPath, JSON.stringify(listings, null, 2));

    return NextResponse.json({ success: true, message: 'İlan silindi' });
  } catch (error) {
    console.error('İlan silme hatası:', error);
    return NextResponse.json({ error: 'İlan silinemedi' }, { status: 500 });
  }
} 