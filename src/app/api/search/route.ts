import { NextResponse } from 'next/server';
import { searchListings } from '@/lib/search';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Arama parametrelerini al
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Filtreleri al
    const filters = {
      category: searchParams.get('category') || undefined,
      subcategory: searchParams.get('subcategory') || undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      condition: searchParams.get('condition') as 'new' | 'used' | undefined,
      city: searchParams.get('city') || undefined,
      premiumOnly: searchParams.get('premiumOnly') === 'true',
      sortBy: searchParams.get('sortBy') as 'price_asc' | 'price_desc' | 'date_desc' | 'views_desc' | undefined,
    };

    // Arama yap
    const { results, total } = await searchListings(query, filters, page, limit);

    // Sonuçları döndür
    return NextResponse.json({
      success: true,
      data: {
        results,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Arama işlemi sırasında bir hata oluştu',
      },
      { status: 500 }
    );
  }
} 