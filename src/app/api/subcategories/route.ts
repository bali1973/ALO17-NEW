import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Mock subcategories (production'da gerçek database kullanılacak)
const mockSubCategories = [
  { id: '1', name: 'Temizlik', categoryId: '1' },
  { id: '2', name: 'Tadilat', categoryId: '1' },
  { id: '3', name: 'Elektronik', categoryId: '2' },
  { id: '4', name: 'Mobilya', categoryId: '2' }
];

// Alt kategorileri getir
export async function GET() {
  try {
    return NextResponse.json(mockSubCategories);
  } catch (error) {
    console.error('Alt kategoriler getirme hatası:', error);
    return NextResponse.json({ error: 'Alt kategoriler getirilemedi' }, { status: 500 });
  }
}

// Yeni alt kategori ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, categoryId } = body;

    if (!name || !categoryId) {
      return NextResponse.json({ error: 'Alt kategori adı ve kategori ID gerekli' }, { status: 400 });
    }

    // Yeni alt kategori oluştur
    const newSubCategory = {
      id: (mockSubCategories.length + 1).toString(),
      name,
      categoryId
    };

    mockSubCategories.push(newSubCategory);

    // Alt kategori değişti, kategorileri revalidate et
    revalidatePath('/kategori');

    return NextResponse.json({ success: true, subCategory: newSubCategory });
  } catch (error) {
    console.error('Alt kategori ekleme hatası:', error);
    return NextResponse.json({ error: 'Alt kategori eklenemedi' }, { status: 500 });
  }
} 