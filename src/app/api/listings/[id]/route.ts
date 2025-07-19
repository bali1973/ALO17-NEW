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

// İlan güncelleme
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const listingId = parseInt(params.id);
    
    const listings = await readListings();
    const listingIndex = listings.findIndex((l: any) => l.id === listingId);
    
    if (listingIndex === -1) {
      return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });
    }
    
    const listing = listings[listingIndex];
    
    // Yetki kontrolü - sadece ilan sahibi veya admin/moderatör düzenleyebilir
    const userEmail = body.userEmail;
    const userRole = body.userRole;
    const userId = body.userId;
    const userName = body.userName;
    
    if (listing.email !== userEmail && userRole !== 'admin' && userRole !== 'moderator') {
      return NextResponse.json({ error: 'Bu ilanı düzenleme yetkiniz yok' }, { status: 403 });
    }
    
    // İşlem bilgisi
    const now = new Date().toISOString();
    const actionInfo = {
      action: 'düzenle',
      by: { id: userId, name: userName, role: userRole },
      at: now
    };
    // History dizisini güncelle
    const updatedHistory = Array.isArray(listing.history) ? [...listing.history, actionInfo] : [actionInfo];
    // İlanı güncelle
    const updatedListing = {
      ...listing,
      ...body,
      id: listingId, // ID'yi koru
      updatedAt: now,
      lastActionBy: { id: userId, name: userName, role: userRole },
      lastActionType: 'düzenle',
      lastActionAt: now,
      history: updatedHistory
    };
    
    listings[listingIndex] = updatedListing;
    await writeListings(listings);
    
    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error('İlan güncelleme hatası:', error);
    return NextResponse.json({ error: 'İlan güncellenirken hata oluştu' }, { status: 500 });
  }
}

// İlan silme
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const listingId = parseInt(params.id);
    const url = new URL(req.url);
    const userEmail = url.searchParams.get('userEmail');
    const userRole = url.searchParams.get('userRole');
    const userId = url.searchParams.get('userId');
    const userName = url.searchParams.get('userName');
    
    const listings = await readListings();
    const listingIndex = listings.findIndex((l: any) => l.id === listingId);
    
    if (listingIndex === -1) {
      return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });
    }
    
    const listing = listings[listingIndex];
    
    // Yetki kontrolü - sadece ilan sahibi veya admin/moderatör silebilir
    if (listing.email !== userEmail && userRole !== 'admin' && userRole !== 'moderator') {
      return NextResponse.json({ error: 'Bu ilanı silme yetkiniz yok' }, { status: 403 });
    }
    // İşlem bilgisi
    const now = new Date().toISOString();
    const actionInfo = {
      action: 'sil',
      by: { id: userId, name: userName, role: userRole },
      at: now
    };
    // History dizisini güncelle
    const updatedHistory = Array.isArray(listing.history) ? [...listing.history, actionInfo] : [actionInfo];
    // Silinen ilanı history ile birlikte kaydetmek için (opsiyonel: arşivleme yapılabilir)
    // İlanı sil
    listings.splice(listingIndex, 1);
    await writeListings(listings);
    // (Opsiyonel: Silinen ilanı başka bir dosyada arşivleyebilirsiniz)
    return NextResponse.json({ message: 'İlan başarıyla silindi', lastAction: actionInfo, history: updatedHistory });
  } catch (error) {
    console.error('İlan silme hatası:', error);
    return NextResponse.json({ error: 'İlan silinirken hata oluştu' }, { status: 500 });
  }
} 

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const listings = await readListings();
  const listing = listings.find((l: any) => l.id === Number(params.id));
  if (!listing) {
    return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });
  }
  return NextResponse.json(listing);
} 