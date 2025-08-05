import { prisma } from './prisma';

interface SearchFilters {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: 'new' | 'used';
  city?: string;
  premiumOnly?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'date_desc' | 'views_desc';
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  condition: string;
  city: string;
  isPremium: boolean;
  createdAt: Date;
  views: number;
  imageUrl: string;
  score: number;
}

export async function searchListings(
  query: string,
  filters: SearchFilters = {},
  page: number = 1,
  limit: number = 20
): Promise<{ results: SearchResult[]; total: number }> {
  try {
    // Arama terimlerini hazırla
    const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
    
    // Temel sorgu
    const whereClause: any = {
      status: 'active',
      OR: [
        ...searchTerms.map(term => ({
          OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
            { tags: { has: term } }
          ]
        }))
      ]
    };

    // Filtreleri ekle
    if (filters.category) {
      whereClause.category = filters.category;
    }
    if (filters.subcategory) {
      whereClause.subcategory = filters.subcategory;
    }
    if (filters.minPrice) {
      whereClause.price = { ...whereClause.price, gte: filters.minPrice };
    }
    if (filters.maxPrice) {
      whereClause.price = { ...whereClause.price, lte: filters.maxPrice };
    }
    if (filters.condition) {
      whereClause.condition = filters.condition;
    }
    if (filters.city) {
      whereClause.city = filters.city;
    }
    if (filters.premiumOnly) {
      whereClause.isPremium = true;
    }

    // Sıralama seçenekleri
    let orderBy: any = {};
    switch (filters.sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'date_desc':
        orderBy = { createdAt: 'desc' };
        break;
      case 'views_desc':
        orderBy = { views: 'desc' };
        break;
      default:
        orderBy = [
          { isPremium: 'desc' },
          { createdAt: 'desc' }
        ];
    }

    // Toplam sonuç sayısını al
    const total = await prisma.listing.count({ where: whereClause });

    // Sonuçları getir
    const listings = await prisma.listing.findMany({
      where: whereClause,
      orderBy,
      skip: (page - 1) * limit,
      limit,
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        category: true,
        subcategory: true,
        condition: true,
        city: true,
        isPremium: true,
        createdAt: true,
        views: true,
        imageUrl: true,
      },
    });

    // Sonuçları skorla ve sırala
    const results = listings.map(listing => {
      const score = calculateSearchScore(listing, searchTerms);
      return { ...listing, score };
    });

    return {
      results: results.sort((a, b) => b.score - a.score),
      total,
    };
  } catch (error) {
    console.error('Search error:', error);
    throw new Error('Arama işlemi sırasında bir hata oluştu');
  }
}

// Arama skoru hesaplama
function calculateSearchScore(listing: any, searchTerms: string[]): number {
  let score = 0;

  // Başlıkta geçen terimler için yüksek puan
  searchTerms.forEach(term => {
    if (listing.title.toLowerCase().includes(term)) {
      score += 10;
    }
  });

  // Açıklamada geçen terimler için orta puan
  searchTerms.forEach(term => {
    if (listing.description.toLowerCase().includes(term)) {
      score += 5;
    }
  });

  // Premium ilanlar için bonus puan
  if (listing.isPremium) {
    score += 15;
  }

  // Görüntülenme sayısına göre bonus
  score += Math.min(listing.views / 100, 5);

  // Yeni ilanlar için bonus
  const daysSinceCreation = Math.floor(
    (Date.now() - new Date(listing.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceCreation < 7) {
    score += (7 - daysSinceCreation);
  }

  return score;
} 