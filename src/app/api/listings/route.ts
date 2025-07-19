import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const LISTINGS_PATH = path.join(process.cwd(), 'public', 'listings.json');

async function readListings() {
  try {
    const data = await fs.readFile(LISTINGS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Dosya okuma hatası:', error);
    // Dosya yoksa boş array döndür
    return [];
  }
}

async function writeListings(listings: any[]) {
  try {
    console.log('Dosya yazma başlıyor...');
    console.log('Dosya yolu:', LISTINGS_PATH);
    
    // Dizini kontrol et ve oluştur
    const dir = path.dirname(LISTINGS_PATH);
    console.log('Dizin yolu:', dir);
    await fs.mkdir(dir, { recursive: true });
    console.log('Dizin oluşturuldu/kontrol edildi');
    
    // JSON string'i oluştur
    const jsonString = JSON.stringify(listings, null, 2);
    console.log('JSON string oluşturuldu, uzunluk:', jsonString.length);
    
    // Dosyayı yaz
    await fs.writeFile(LISTINGS_PATH, jsonString, 'utf-8');
    console.log('İlanlar başarıyla kaydedildi:', LISTINGS_PATH);
    
    // Dosyanın yazıldığını doğrula
    const stats = await fs.stat(LISTINGS_PATH);
    console.log('Dosya boyutu:', stats.size, 'bytes');
  } catch (error) {
    console.error('Dosya yazma hatası:', error);
    console.error('Hata detayı:', error instanceof Error ? error.stack : 'Bilinmeyen hata');
    throw new Error(`İlanlar kaydedilemedi: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function GET() {
  const listings = await readListings();
  return NextResponse.json(listings);
}

export async function POST(req: Request) {
  try {
    console.log('POST /api/listings çağrıldı');
    
    const body = await req.json();
    console.log('Gelen veri:', JSON.stringify(body, null, 2));
    
    // Gerekli alanları kontrol et
    if (!body.title || !body.description || !body.price || !body.category) {
      console.log('Eksik alanlar:', { title: !!body.title, description: !!body.description, price: !!body.price, category: !!body.category });
      return NextResponse.json(
        { error: 'Başlık, açıklama, fiyat ve kategori alanları zorunludur' },
        { status: 400 }
      );
    }
    
    // Kullanıcı rolünü belirle
    const userRole = body.userRole || 'user';
    const userEmail = body.email || '';
    
    console.log('Mevcut ilanlar okunuyor...');
    const listings = await readListings();
    console.log('Mevcut ilan sayısı:', listings.length);

    // Premium kullanıcı ilan limiti kontrolü
    if (userRole === 'premium') {
      const userListings = listings.filter((l: any) => l.email === userEmail);
      if (userListings.length >= 5) {
        // İlk ilan tarihi
        const firstListing = userListings.reduce((min: any, curr: any) => new Date(curr.createdAt) < new Date(min.createdAt) ? curr : min, userListings[0]);
        return NextResponse.json({
          error: 'Premium kullanıcılar en fazla 5 ilan verebilir.',
          firstListingDate: firstListing.createdAt,
          totalListings: userListings.length
        }, { status: 403 });
      }
    }
    
    const newId = listings.length > 0 ? Math.max(...listings.map((l: any) => Number(l.id) || 0)) + 1 : 1;
    const now = new Date().toISOString();
    
    const newListing = {
      ...body,
      id: newId,
      createdAt: now,
      // Tüm ilanlar direkt aktif
      status: 'active',
      views: 0,
      isPremium: !!body.isPremium,
      premiumFeatures: body.premiumFeatures || [],
      // Kullanıcı bilgileri
      user: body.user || 'Anonim',
      email: userEmail,
      userRole: userRole,
    };
    
    console.log('Yeni ilan oluşturuluyor:', JSON.stringify(newListing, null, 2));
    
    listings.push(newListing);
    console.log('İlan listeye eklendi, dosyaya yazılıyor...');
    await writeListings(listings);
    
    console.log('İlan başarıyla oluşturuldu:', newListing.id);
    return NextResponse.json(newListing, { status: 201 });
  } catch (error) {
    console.error('İlan oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'İlan oluşturulurken bir hata oluştu: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
} 