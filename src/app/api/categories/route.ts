import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Mock kategoriler (production'da gerçek database kullanılacak)
const mockCategories = [
  { id: '1', name: 'Hizmetler', icon: '🔧' },
  { id: '2', name: 'Ücretsiz Gel Al', icon: '🎁' },
  { id: '3', name: 'İş', icon: '💼' },
  { id: '4', name: 'Sporlar-Oyunlar-Eğlenceler', icon: '⚽' },
  { id: '5', name: 'Sanat-Hobi', icon: '🎨' },
  { id: '6', name: 'Sağlık-Güzellik', icon: '💅' }
];

// Kategorileri getir
export async function GET() {
  try {
    return NextResponse.json(mockCategories);
  } catch (error) {
    console.error('Kategoriler getirme hatası:', error);
    return NextResponse.json({ error: 'Kategoriler getirilemedi' }, { status: 500 });
  }
}

// Yeni kategori ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, icon } = body;

    if (!name) {
      return NextResponse.json({ error: 'Kategori adı gerekli' }, { status: 400 });
    }

    // Yeni kategori oluştur
    const newCategory = {
      id: (mockCategories.length + 1).toString(),
      name,
      icon: icon || '📁'
    };

    mockCategories.push(newCategory);

    // Kategori değişti, anasayfa ve kategori sayfalarını revalidate et
    revalidatePath('/');
    revalidatePath('/kategori');

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error) {
    console.error('Kategori ekleme hatası:', error);
    return NextResponse.json({ error: 'Kategori eklenemedi' }, { status: 500 });
  }
} 