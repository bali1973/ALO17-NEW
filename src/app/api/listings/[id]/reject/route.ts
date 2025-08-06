import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const listingId = params.id;
    
    // Şimdilik başarılı döndürüyoruz
    // Gerçek uygulamada veritabanında ilanı reddedeceğiz
    console.log(`Listing ${listingId} rejected`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'İlan başarıyla reddedildi' 
    });
  } catch (error) {
    console.error('Error rejecting listing:', error);
    return NextResponse.json(
      { error: 'Failed to reject listing' },
      { status: 500 }
    );
  }
} 