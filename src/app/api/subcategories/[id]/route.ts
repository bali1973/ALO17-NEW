import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Mock subcategories (production'da gerçek database kullanılacak)
const mockSubCategories = [
  { id: '1', name: 'Temizlik', categoryId: '1' },
  { id: '2', name: 'Tadilat', categoryId: '1' },
  { id: '3', name: 'Elektronik', categoryId: '2' },
  { id: '4', name: 'Mobilya', categoryId: '2' }
];

// Alt kategori güncelleme
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, icon } = body;

    // Mock alt kategoriyi bul
    const subCategoryIndex = mockSubCategories.findIndex(sub => sub.id === id);
    
    if (subCategoryIndex === -1) {
      return NextResponse.json({ error: 'Alt kategori bulunamadı' }, { status: 404 });
    }

    // Mock alt kategoriyi güncelle
    mockSubCategories[subCategoryIndex] = {
      ...mockSubCategories[subCategoryIndex],
      name: name || mockSubCategories[subCategoryIndex].name,
    };

    // Alt kategori değişti, kategorileri revalidate et
    revalidatePath('/kategori');

    return NextResponse.json({ success: true, subCategory: mockSubCategories[subCategoryIndex] });
  } catch (error) {
    console.error('Alt kategori güncelleme hatası:', error);
    return NextResponse.json({ error: 'Alt kategori güncellenemedi' }, { status: 500 });
  }
}

// Alt kategori silme
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Mock alt kategoriyi bul
    const subCategoryIndex = mockSubCategories.findIndex(sub => sub.id === id);
    
    if (subCategoryIndex === -1) {
      return NextResponse.json({ error: 'Alt kategori bulunamadı' }, { status: 404 });
    }

    // Mock alt kategoriyi sil
    mockSubCategories.splice(subCategoryIndex, 1);

    // Alt kategori değişti, kategorileri revalidate et
    revalidatePath('/kategori');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Alt kategori silme hatası:', error);
    return NextResponse.json({ error: 'Alt kategori silinemedi' }, { status: 500 });
  }
} 