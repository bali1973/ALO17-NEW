import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const listingId = params.id;
    
    // Şimdilik başarılı döndürüyoruz
    // Gerçek uygulamada veritabanında ilanı onaylayacağız
    console.log(`Listing ${listingId} approved`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'İlan başarıyla onaylandı' 
    });
  } catch (error) {
    console.error('Error approving listing:', error);
    return NextResponse.json(
      { error: 'Failed to approve listing' },
      { status: 500 }
    );
  }
} 