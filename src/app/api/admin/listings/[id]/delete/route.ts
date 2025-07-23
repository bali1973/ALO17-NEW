import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;
    
    // Mock implementation - gerçek uygulamada database kullanılacak
    const mockResponse = {
      id,
      message: 'İlan silindi'
    };
    
    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('İlan silme hatası:', error);
    return NextResponse.json({ error: 'İlan silinemedi' }, { status: 500 });
  }
} 