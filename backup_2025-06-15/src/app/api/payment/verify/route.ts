import { NextResponse } from 'next/server';
import crypto from 'crypto';

// PayTR API bilgileri - Gerçek uygulamada .env dosyasından alınmalı
const PAYTR_MERCHANT_KEY = 'your-merchant-key';
const PAYTR_MERCHANT_SALT = 'your-merchant-salt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { merchant_oid, status } = body;

    // PayTR'den gelen hash'i doğrula
    const hash = crypto.createHmac('sha256', PAYTR_MERCHANT_KEY)
      .update(merchant_oid + PAYTR_MERCHANT_SALT + status)
      .digest('base64');

    // Hash doğrulaması
    if (hash !== body.hash) {
      return NextResponse.json(
        { error: 'Geçersiz hash' },
        { status: 400 }
      );
    }

    // Ödeme durumunu kontrol et
    if (status !== 'success') {
      return NextResponse.json(
        { error: 'Ödeme başarısız' },
        { status: 400 }
      );
    }

    // Veritabanından ödeme kaydını bul ve doğrula
    // TODO: Veritabanı işlemleri

    // İlan ID'sini döndür
    return NextResponse.json({
      verified: true,
      listingId: '123', // Gerçek uygulamada veritabanından alınacak
    });
  } catch (error) {
    console.error('Ödeme doğrulama hatası:', error);
    return NextResponse.json(
      { error: 'Ödeme doğrulanamadı' },
      { status: 500 }
    );
  }
} 