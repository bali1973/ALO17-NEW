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

// Kategori güncelleme
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, icon } = body;

    // Mock kategoriyi bul
    const categoryIndex = mockCategories.findIndex(cat => cat.id === id);
    if (categoryIndex === -1) {
      return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 });
    }

    // Mock kategoriyi güncelle
    mockCategories[categoryIndex] = {
      ...mockCategories[categoryIndex],
      name: name || mockCategories[categoryIndex].name,
      icon: icon || mockCategories[categoryIndex].icon,
    };

    // Kategori değişti, anasayfa ve kategori sayfalarını revalidate et
    revalidatePath('/');
    revalidatePath('/kategori');

    return NextResponse.json({ success: true, category: mockCategories[categoryIndex] });
  } catch (error) {
    console.error('Kategori güncelleme hatası:', error);
    return NextResponse.json({ error: 'Kategori güncellenemedi' }, { status: 500 });
  }
}

// Kategori silme
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Mock kategoriyi bul
    const categoryIndex = mockCategories.findIndex(cat => cat.id === id);
    if (categoryIndex === -1) {
      return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 });
    }

    // Mock kategoriyi sil
    mockCategories.splice(categoryIndex, 1);

    // Kategori değişti, anasayfa ve kategori sayfalarını revalidate et
    revalidatePath('/');
    revalidatePath('/kategori');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Kategori silme hatası:', error);
    return NextResponse.json({ error: 'Kategori silinemedi' }, { status: 500 });
  }
} 