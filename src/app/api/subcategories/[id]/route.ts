import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Alt kategori güncelleme
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

    // Alt kategoriyi bul
    let subCategory = null;
    let categoryIndex = -1;
    let subCategoryIndex = -1;

    for (let i = 0; i < categories.length; i++) {
      const subIndex = categories[i].subCategories.findIndex((sub: any) => sub.id === id);
      if (subIndex !== -1) {
        categoryIndex = i;
        subCategoryIndex = subIndex;
        subCategory = categories[i].subCategories[subIndex];
        break;
      }
    }

    if (!subCategory) {
      return NextResponse.json({ error: 'Alt kategori bulunamadı' }, { status: 404 });
    }

    // Alt kategoriyi güncelle
    categories[categoryIndex].subCategories[subCategoryIndex] = {
      ...subCategory,
      name: name || subCategory.name,
      icon: icon || subCategory.icon,
    };

    // JSON dosyasına kaydet
    writeFileSync(categoriesPath, JSON.stringify(categories, null, 2));

    return NextResponse.json({ 
      success: true, 
      subCategory: categories[categoryIndex].subCategories[subCategoryIndex] 
    });
  } catch (error) {
    console.error('Alt kategori güncelleme hatası:', error);
    return NextResponse.json({ error: 'Alt kategori güncellenemedi' }, { status: 500 });
  }
}

// Alt kategori silme
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

    // Alt kategoriyi bul ve sil
    let categoryIndex = -1;
    let subCategoryIndex = -1;

    for (let i = 0; i < categories.length; i++) {
      const subIndex = categories[i].subCategories.findIndex((sub: any) => sub.id === id);
      if (subIndex !== -1) {
        categoryIndex = i;
        subCategoryIndex = subIndex;
        break;
      }
    }

    if (categoryIndex === -1) {
      return NextResponse.json({ error: 'Alt kategori bulunamadı' }, { status: 404 });
    }

    // Alt kategoriyi sil
    categories[categoryIndex].subCategories.splice(subCategoryIndex, 1);

    // JSON dosyasına kaydet
    writeFileSync(categoriesPath, JSON.stringify(categories, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Alt kategori silme hatası:', error);
    return NextResponse.json({ error: 'Alt kategori silinemedi' }, { status: 500 });
  }
} 