import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;
    
    // Mock implementation - gerçek uygulamada database kullanılacak
    const mockListing = {
      id,
      status: 'active',
      message: 'İlan onaylandı'
    };
    
    return NextResponse.json(mockListing);
  } catch (error) {
    console.error('İlan onaylama hatası:', error);
    return NextResponse.json({ error: 'İlan onaylanamadı' }, { status: 500 });
  }
} 