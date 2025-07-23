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
      status: 'rejected',
      message: 'İlan reddedildi'
    };
    
    return NextResponse.json(mockListing);
  } catch (error) {
    console.error('İlan reddetme hatası:', error);
    return NextResponse.json({ error: 'İlan reddedilemedi' }, { status: 500 });
  }
} 