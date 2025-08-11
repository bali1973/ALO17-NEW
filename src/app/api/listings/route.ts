import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { NotificationService } from '@/lib/notificationService';

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

async function writeListings(listings: any[]) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'listings.json');
    await fs.writeFile(filePath, JSON.stringify(listings, null, 2));
  } catch (error) {
    console.error('Listings.json yazma hatası:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    let listings = await readListings();
    
    // Kategori slug'ını category'ye çevir
    let categoryFilter = category;
    
    // Slug-category eşleştirmesi
    const slugToCategory: { [key: string]: string } = {
      'elektronik': 'elektronik',
      'ev-bahce': 'ev-bahce',
      'giyim': 'giyim',
      'anne-bebek': 'anne-bebek',
      'egitim-kurslar': 'egitim-kurslar',
      'yemek-icecek': 'yemek-icecek',
      'turizm-gecelemeler': 'turizm-gecelemeler',
      'saglik-guzellik': 'saglik-guzellik',
      'sanat-hobi': 'sanat-hobi',
      'sporlar-oyunlar-eglenceler': 'sporlar-oyunlar-eglenceler',
      'is': 'is',
      'ucretsiz-gel-al': 'ucretsiz-gel-al',
      'hizmetler': 'hizmetler',
      'diger': 'diger'
    };
    
    // Eski kategori adlarını yeni slug'lara çevir
    const oldToNewCategory: { [key: string]: string } = {
      'anne-bebek': 'diger'
    };
    
    if (category) {
      categoryFilter = slugToCategory[category] || category;
    }
    
    // Filtreleme
    if (categoryFilter) {
      listings = listings.filter((listing: any) => {
        // Önce eski kategori adlarını yeni slug'lara çevir
        let listingCategory = listing.category;
        if (oldToNewCategory[listingCategory]) {
          listingCategory = oldToNewCategory[listingCategory];
        }
        
        return listingCategory === categoryFilter;
      });
    }
    
    if (subcategory) {
      listings = listings.filter((listing: any) => listing.subcategory === subcategory);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      listings = listings.filter((listing: any) => 
        listing.title?.toLowerCase().includes(searchLower) ||
        listing.description?.toLowerCase().includes(searchLower) ||
        listing.city?.toLowerCase().includes(searchLower)
      );
    }
    
    // Sadece onaylanmış ilanları göster
    listings = listings.filter((listing: any) => listing.status === 'onaylandı');
    
    // Sıralama (en yeni önce)
    listings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Sayfalama
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedListings = listings.slice(startIndex, endIndex);
    
    return NextResponse.json(paginatedListings);
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
    
    // İlan onaylandığında bildirim gönder
    if (newListing.status === 'onaylandı') {
      try {
        await NotificationService.notifyNewListing(newListing);
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
      }
    }
    
    return NextResponse.json({ success: true, listing: newListing });
  } catch (error) {
    console.error('İlan ekleme hatası:', error);
    return NextResponse.json({ error: 'İlan eklenemedi' }, { status: 500 });
  }
} 