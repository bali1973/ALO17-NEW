import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Kategori güncelleme
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, icon } = body;

    // JSON dosyasını oku
    const categoriesPath = join(process.cwd(), 'public', 'categories.json');
    const categoriesData = readFileSync(categoriesPath, 'utf8');
    const categories = JSON.parse(categoriesData);

    // Kategoriyi bul ve güncelle
    const categoryIndex = categories.findIndex((cat: any) => cat.id === id);
    if (categoryIndex === -1) {
      return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 });
    }

    // Kategoriyi güncelle
    categories[categoryIndex] = {
      ...categories[categoryIndex],
      name: name || categories[categoryIndex].name,
      icon: icon || categories[categoryIndex].icon,
    };

    // JSON dosyasına kaydet
    writeFileSync(categoriesPath, JSON.stringify(categories, null, 2));

    return NextResponse.json({ success: true, category: categories[categoryIndex] });
  } catch (error) {
    console.error('Kategori güncelleme hatası:', error);
    return NextResponse.json({ error: 'Kategori güncellenemedi' }, { status: 500 });
  }
}

// Kategori silme
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // JSON dosyasını oku
    const categoriesPath = join(process.cwd(), 'public', 'categories.json');
    const categoriesData = readFileSync(categoriesPath, 'utf8');
    const categories = JSON.parse(categoriesData);

    // Kategoriyi bul ve sil
    const categoryIndex = categories.findIndex((cat: any) => cat.id === id);
    if (categoryIndex === -1) {
      return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 });
    }

    // Kategoriyi sil
    categories.splice(categoryIndex, 1);

    // JSON dosyasına kaydet
    writeFileSync(categoriesPath, JSON.stringify(categories, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Kategori silme hatası:', error);
    return NextResponse.json({ error: 'Kategori silinemedi' }, { status: 500 });
  }
} 