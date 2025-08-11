import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Arama geçmişi için basit cache
const searchHistory = new Map<string, number>();

// Fuzzy search için basit fonksiyon
function fuzzyMatch(text: string, query: string): boolean {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Tam eşleşme
  if (textLower.includes(queryLower)) return true;
  
  // Kelime bazlı arama
  const queryWords = queryLower.split(' ').filter(word => word.length > 1);
  const textWords = textLower.split(' ');
  
  return queryWords.every(queryWord => 
    textWords.some(textWord => textWord.includes(queryWord))
  );
}

// Arama skoru hesaplama
function calculateSearchScore(listing: any, searchTerm: string): number {
  let score = 0;
  const term = searchTerm.toLowerCase();
  
  // Başlık eşleşmesi (en yüksek puan)
  if (listing.title.toLowerCase().includes(term)) {
    score += 100;
    if (listing.title.toLowerCase().startsWith(term)) score += 50;
  }
  
  // Açıklama eşleşmesi
  if (listing.description.toLowerCase().includes(term)) {
    score += 30;
  }
  
  // Kategori eşleşmesi
  if (listing.category.toLowerCase().includes(term)) {
    score += 40;
  }
  
  // Alt kategori eşleşmesi
  if (listing.subcategory?.toLowerCase().includes(term)) {
    score += 35;
  }
  
  // Şehir eşleşmesi
  if (listing.location.toLowerCase().includes(term)) {
    score += 25;
  }
  
  // Özellikler eşleşmesi
  if (listing.features && typeof listing.features === 'string') {
    try {
      const features = JSON.parse(listing.features || '[]');
      const featureMatches = features.filter((feature: string) => 
        feature.toLowerCase().includes(term)
      ).length;
      score += featureMatches * 10;
    } catch (error) {
      // JSON parse hatası durumunda string olarak kontrol et
      if (listing.features.toLowerCase().includes(term)) {
        score += 10;
      }
    }
  }
  
  // Premium bonus
  if (listing.isPremium) score += 20;
  
  // Görüntülenme bonusu
  score += Math.min(listing.views || 0, 100) / 10;
  
  // Tarih bonusu (yeni ilanlar daha yüksek puan)
  const daysSinceCreation = (Date.now() - new Date(listing.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCreation < 7) score += 15;
  else if (daysSinceCreation < 30) score += 10;
  
  return score;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters = {}, page = 1, limit = 20 } = body;

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ 
        error: 'Arama terimi en az 2 karakter olmalıdır' 
      }, { status: 400 });
    }

    // Arama terimini temizle
    const searchTerm = query.trim().toLowerCase();
    
    // Arama geçmişini güncelle
    searchHistory.set(searchTerm, (searchHistory.get(searchTerm) || 0) + 1);
    
    // İlanları JSON dosyasından oku
    const listingsPath = path.join(process.cwd(), 'public', 'listings.json');
    let listings: any[] = [];
    try {
      const data = await fs.readFile(listingsPath, 'utf-8');
      listings = JSON.parse(data);
    } catch (error) {
      console.error('Listings dosyası okunamadı:', error);
      listings = [];
    }

    // Filtreleri uygula
    let filteredListings = listings.filter((listing: any) => {
      // Status filtresi
      if (listing.status !== 'onaylandı') return false;
      
      // Arama terimi filtresi
      const matchesSearch = 
        listing.title.toLowerCase().includes(searchTerm) ||
        listing.description.toLowerCase().includes(searchTerm) ||
        listing.category.toLowerCase().includes(searchTerm) ||
        (listing.subcategory && listing.subcategory.toLowerCase().includes(searchTerm)) ||
        listing.location.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;
      
      // Kategori filtresi
      if (filters.category && listing.category !== filters.category) return false;
      
      // Alt kategori filtresi
      if (filters.subcategory && listing.subcategory !== filters.subcategory) return false;
      
      // Fiyat aralığı
      if (filters.priceMin && listing.price < Number(filters.priceMin)) return false;
      if (filters.priceMax && listing.price > Number(filters.priceMax)) return false;
      
      // Konum filtresi
      if (filters.location && !listing.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      
      // Durum filtresi
      if (filters.condition && listing.condition !== filters.condition) return false;
      
      // Premium filtresi
      if (filters.premium && !listing.isPremium) return false;
      
      // Tarih aralığı
      if (filters.dateRange) {
        const now = new Date();
        let startDate: Date;
        
        switch (filters.dateRange) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(0);
        }
        
        if (new Date(listing.createdAt) < startDate) return false;
      }
      
      return true;
    });

    // Sıralama
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          filteredListings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'oldest':
          filteredListings.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          break;
        case 'price_low':
          filteredListings.sort((a: any, b: any) => a.price - b.price);
          break;
        case 'price_high':
          filteredListings.sort((a: any, b: any) => b.price - a.price);
          break;
        case 'popular':
          filteredListings.sort((a: any, b: any) => (b.views || 0) - (a.views || 0));
          break;
        case 'premium':
          filteredListings.sort((a: any, b: any) => {
            if (a.isPremium && !b.isPremium) return -1;
            if (!a.isPremium && b.isPremium) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          break;
        case 'relevance':
          // Relevance sıralaması için skor hesaplama
          filteredListings = filteredListings
            .map((listing: any) => ({
              ...listing,
              searchScore: calculateSearchScore(listing, searchTerm)
            }))
            .sort((a: any, b: any) => (b.searchScore || 0) - (a.searchScore || 0));
          break;
        default:
          filteredListings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    } else {
      // Varsayılan sıralama
      filteredListings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Sayfalama
    const totalCount = filteredListings.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedListings = filteredListings.slice(startIndex, endIndex);

    // Kategorileri de ara
    const categoriesPath = path.join(process.cwd(), 'public', 'categories.json');
    let categories: any[] = [];
    try {
      const data = await fs.readFile(categoriesPath, 'utf-8');
      const allCategories = JSON.parse(data);
      categories = allCategories.filter((category: any) => 
        category.name.toLowerCase().includes(searchTerm) ||
        category.slug.toLowerCase().includes(searchTerm)
      ).slice(0, 10);
    } catch (error) {
      console.error('Categories dosyası okunamadı:', error);
      categories = [];
    }

    // Önerilen aramalar
    const suggestions = generateSearchSuggestions(searchTerm, searchHistory);

    // Sonuçları birleştir
    const results = {
      listings: paginatedListings.map((listing: any) => ({
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        images: listing.images,
        category: listing.category,
        subcategory: listing.subcategory,
        location: listing.location,
        condition: listing.condition,
        isPremium: listing.isPremium,
        views: listing.views,
        createdAt: listing.createdAt,
        user: listing.user,
        searchScore: listing.searchScore
      })),
      categories: categories.map((category: any) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon
      })),
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      query: searchTerm,
      filters,
      suggestions
    };

    return NextResponse.json(results);

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ 
      error: 'Arama sırasında bir hata oluştu' 
    }, { status: 500 });
  }
}

// Arama önerileri oluştur
function generateSearchSuggestions(query: string, history: Map<string, number>): string[] {
  const suggestions: string[] = [];
  
  // Geçmiş aramalardan öneriler
  const historySuggestions = Array.from(history.entries())
    .filter(([term]) => term.includes(query) && term !== query)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([term]) => term);
  
  suggestions.push(...historySuggestions);
  
  // Genel öneriler
  const generalSuggestions = [
    `${query} yeni`,
    `${query} kullanılmış`,
    `${query} ucuz`,
    `${query} premium`
  ];
  
  suggestions.push(...generalSuggestions);
  
  return Array.from(new Set(suggestions)).slice(0, 5);
}

// Autocomplete endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type'); // 'listings', 'categories', 'all'

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ 
        error: 'Arama terimi en az 2 karakter olmalıdır' 
      }, { status: 400 });
    }

    const searchTerm = query.trim().toLowerCase();
    const results: any = {};

    // İlan önerileri
    if (type !== 'categories') {
      const listingsPath = path.join(process.cwd(), 'public', 'listings.json');
      try {
        const data = await fs.readFile(listingsPath, 'utf-8');
        const listings = JSON.parse(data);
        
        const listingSuggestions = listings
          .filter((listing: any) => 
            listing.status === 'onaylandı' &&
            (listing.title.toLowerCase().includes(searchTerm) ||
             listing.description.toLowerCase().includes(searchTerm))
          )
          .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
          .slice(0, 5)
          .map((listing: any) => ({
            id: listing.id,
            title: listing.title,
            category: listing.category,
            subcategory: listing.subcategory,
            price: listing.price,
            images: listing.images
          }));
        
        results.listings = listingSuggestions;
      } catch (error) {
        console.error('Listings dosyası okunamadı:', error);
        results.listings = [];
      }
    }

    // Kategori önerileri
    if (type !== 'listings') {
      const categoriesPath = path.join(process.cwd(), 'public', 'categories.json');
      try {
        const data = await fs.readFile(categoriesPath, 'utf-8');
        const allCategories = JSON.parse(data);
        
        const categorySuggestions = allCategories
          .filter((category: any) => 
            category.name.toLowerCase().includes(searchTerm) ||
            category.slug.toLowerCase().includes(searchTerm)
          )
          .slice(0, 5)
          .map((category: any) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            icon: category.icon
          }));
        
        results.categories = categorySuggestions;
      } catch (error) {
        console.error('Categories dosyası okunamadı:', error);
        results.categories = [];
      }
    }

    // Arama geçmişi önerileri
    const historySuggestions = Array.from(searchHistory.entries())
      .filter(([term]) => term.includes(searchTerm) && term !== searchTerm)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([term]) => term);

    results.history = historySuggestions;

    return NextResponse.json(results);

  } catch (error) {
    console.error('Autocomplete error:', error);
    return NextResponse.json({ 
      error: 'Autocomplete sırasında bir hata oluştu' 
    }, { status: 500 });
  }
} 