import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Gerçek veritabanı entegrasyonu eklenecek
    // Şimdilik sabit bir değer döndürüyoruz
    return NextResponse.json({ count: 0 });
  } catch (error) {
    return NextResponse.json({ error: 'Bildirim sayısı alınamadı' }, { status: 500 });
  }
} 