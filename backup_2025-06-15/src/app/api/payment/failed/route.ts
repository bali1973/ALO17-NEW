import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { merchant_oid, failed_reason_msg } = body;

    // Veritabanında ödeme kaydını güncelle
    // TODO: Veritabanı işlemleri
    // - Ödeme durumunu "failed" olarak güncelle
    // - Hata mesajını kaydet
    // - İlan durumunu güncelle

    return NextResponse.json({
      success: true,
      message: 'Ödeme kaydı güncellendi',
    });
  } catch (error) {
    console.error('Ödeme kaydı güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Ödeme kaydı güncellenemedi' },
      { status: 500 }
    );
  }
} 