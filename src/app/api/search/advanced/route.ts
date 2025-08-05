import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const LISTINGS_PATH = path.join(process.cwd(), 'public', 'listings.json');
const CATEGORIES_PATH = path.join(process.cwd(), 'public', 'categories.json');

async function readListings() {
  try {
    const data = await fs.readFile(LISTINGS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function readCategories() {
  try {
    const data = await fs.readFile(CATEGORIES_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Arama skoru hesaplama
function calculateSearchScore(listing: any, searchTerm: string): number {
  let score = 0;
  const term = searchTerm.toLowerCase();

  // Başlık eşleşmesi (en yüksek puan)
  if (listing.title?.toLowerCase().includes(term)) {
    score += 10;
    if (listing.title.toLowerCase().startsWith(term)) {
      score += 5; // Başlangıçta eşleşme bonusu
    }
  }

  // Açıklama eşleşmesi
  if (listing.description?.toLowerCase().includes(term)) {
    score += 3;
  }

  // Kategori eşleşmesi
  if (listing.category?.toLowerCase().includes(term)) {
    score += 2;
  }

  // Konum eşleşmesi
  if (listing.location?.toLowerCase().includes(term) || 
      listing.city?.toLowerCase().includes(term)) {
    score += 2;
  }

  // Alt kategori eşleşmesi
  if (listing.subcategory?.toLowerCase().includes(term)) {
    score += 1;
  }

  return score;
}

// Filtreleme fonksiyonu
function applyFilters(listings: any[], filters: any): any[] {
  return listings.filter(listing => {
    // Kategori filtresi
    if (filters.category && listing.category !== filters.category) {
      return false;
    }

    // Alt kategori filtresi
    if (filters.subcategory && listing.subcategory !== filters.subcategory) {
      return false;
    }

    // Konum filtresi
    if (filters.location) {
      const location = filters.location.toLowerCase();
      const listingLocation = (listing.location || listing.city || '').toLowerCase();
      if (!listingLocation.includes(location)) {
        return false;
      }
    }

    // Fiyat filtresi
    if (filters.priceMin && listing.price < parseFloat(filters.priceMin)) {
      return false;
    }
    if (filters.priceMax && listing.price > parseFloat(filters.priceMax)) {
      return false;
    }

    // Durum filtresi
    if (filters.condition && listing.condition !== filters.condition) {
      return false;
    }

    // Tarih filtresi
    if (filters.dateRange) {
      const listingDate = new Date(listing.createdAt || listing.date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - listingDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (filters.dateRange) {
        case 'today':
          if (diffDays > 1) return false;
          break;
        case 'week':
          if (diffDays > 7) return false;
          break;
        case 'month':
          if (diffDays > 30) return false;
          break;
        case '3months':
          if (diffDays > 90) return false;
          break;
      }
    }

    // Premium filtresi
    if (filters.premium && !listing.isPremium) {
      return false;
    }

    // Öne çıkan filtresi
    if (filters.featured && !listing.isFeatured) {
      return false;
    }

    // Acil filtresi
    if (filters.urgent && !listing.isUrgent) {
      return false;
    }

    // Fotoğraflı filtresi
    if (filters.withImages && (!listing.images || listing.images.length === 0)) {
      return false;
    }

    // Doğrulanmış filtresi
    if (filters.verified && !listing.isVerified) {
      return false;
    }

    return true;
  });
}

// Sıralama fonksiyonu
function sortListings(listings: any[], sortBy: string): any[] {
  const sorted = [...listings];

  switch (sortBy) {
    case 'price_low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'date_new':
      return sorted.sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());
    case 'date_old':
      return sorted.sort((a, b) => new Date(a.createdAt || a.date).getTime() - new Date(b.createdAt || b.date).getTime());
    case 'popularity':
      return sorted.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    case 'views':
      return sorted.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    case 'relevance':
    default:
      // İlgi sırası için skor hesaplama
      return sorted.sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0));
  }
}

// Öneriler oluşturma
function generateSuggestions(listings: any[], query: string): string[] {
  if (!query || query.length < 2) return [];

  const suggestions = new Set<string>();
  const term = query.toLowerCase();

  listings.forEach(listing => {
    // Başlık önerileri
    if (listing.title?.toLowerCase().includes(term)) {
      const words = listing.title.split(' ');
      words.forEach(word => {
        if (word.toLowerCase().includes(term) && word.length > 2) {
          suggestions.add(word);
        }
      });
    }

    // Kategori önerileri
    if (listing.category?.toLowerCase().includes(term)) {
      suggestions.add(listing.category);
    }

    // Konum önerileri
    if (listing.location?.toLowerCase().includes(term)) {
      suggestions.add(listing.location);
    }
    if (listing.city?.toLowerCase().includes(term)) {
      suggestions.add(listing.city);
    }
  });

  return Array.from(suggestions).slice(0, 10);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      query = '',
      category = '',
      subcategory = '',
      location = '',
      priceMin = '',
      priceMax = '',
      condition = '',
      sortBy = 'relevance',
      dateRange = '',
      premium = false,
      featured = false,
      urgent = false,
      withImages = false,
      verified = false
    } = body;

    const listings = await readListings();
    const categories = await readCategories();

    // Arama skorlarını hesapla
    let filteredListings = listings.map(listing => ({
      ...listing,
      searchScore: query ? calculateSearchScore(listing, query) : 0
    }));

    // Filtreleri uygula
    const filters = {
      category,
      subcategory,
      location,
      priceMin,
      priceMax,
      condition,
      dateRange,
      premium,
      featured,
      urgent,
      withImages,
      verified
    };

    filteredListings = applyFilters(filteredListings, filters);

    // Sıralama yap
    filteredListings = sortListings(filteredListings, sortBy);

    // Öneriler oluştur
    const suggestions = generateSuggestions(listings, query);

    // Sonuçları formatla
    const results = filteredListings.map(listing => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      images: Array.isArray(listing.images) ? listing.images : [listing.images],
      location: listing.location || listing.city,
      category: listing.category,
      subcategory: listing.subcategory,
      condition: listing.condition,
      createdAt: listing.createdAt || listing.date,
      isPremium: listing.isPremium || false,
      isFeatured: listing.isFeatured || false,
      isUrgent: listing.isUrgent || false,
      hasImages: listing.images && listing.images.length > 0,
      isVerified: listing.isVerified || false,
      viewCount: listing.viewCount || 0,
      favoriteCount: listing.favoriteCount || 0
    }));

    return NextResponse.json({
      success: true,
      results,
      total: results.length,
      suggestions,
      filters: body
    });

  } catch (error) {
    console.error('Advanced search error:', error);
    return NextResponse.json({ 
      error: 'Arama sırasında bir hata oluştu',
      results: [],
      total: 0,
      suggestions: []
    }, { status: 500 });
  }
} 