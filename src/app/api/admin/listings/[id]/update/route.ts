import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    // Mock implementation - gerçek uygulamada database kullanılacak
    const mockListing = {
      id,
      ...body,
      message: 'İlan güncellendi',
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(mockListing);
  } catch (error) {
    console.error('İlan güncelleme hatası:', error);
    return NextResponse.json({ error: 'İlan güncellenemedi' }, { status: 500 });
  }
} 