import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, price, category, city, status } = body;

    const listingsPath = path.join(process.cwd(), 'public', 'listings.json');
    const listingsData = fs.readFileSync(listingsPath, 'utf-8');
    const listings = JSON.parse(listingsData);

    const listingIndex = listings.findIndex((l: any) => l.id.toString() === params.id);
    
    if (listingIndex === -1) {
      return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });
    }

    // İlanı güncelle
    listings[listingIndex] = {
      ...listings[listingIndex],
      title: title || listings[listingIndex].title,
      description: description || listings[listingIndex].description,
      price: price || listings[listingIndex].price,
      category: category || listings[listingIndex].category,
      location: city || listings[listingIndex].location,
      status: status || listings[listingIndex].status,
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(listingsPath, JSON.stringify(listings, null, 2));

    return NextResponse.json({ success: true, message: 'İlan güncellendi' });
  } catch (error) {
    console.error('İlan güncelleme hatası:', error);
    return NextResponse.json({ error: 'İlan güncellenemedi' }, { status: 500 });
  }
} 