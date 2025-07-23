import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function PUT(
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

    listings[listingIndex].status = 'rejected';
    listings[listingIndex].updatedAt = new Date().toISOString();

    fs.writeFileSync(listingsPath, JSON.stringify(listings, null, 2));

    return NextResponse.json({ success: true, message: 'İlan reddedildi' });
  } catch (error) {
    console.error('İlan reddetme hatası:', error);
    return NextResponse.json({ error: 'İlan reddedilemedi' }, { status: 500 });
  }
} 