import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Alt kategori ekleme
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, categoryId, icon } = body;

    if (!name || !categoryId) {
      return NextResponse.json({ error: 'Alt kategori adı ve kategori ID gerekli' }, { status: 400 });
    }

    // JSON dosyasını oku
    const categoriesPath = join(process.cwd(), 'public', 'categories.json');
    const categoriesData = readFileSync(categoriesPath, 'utf8');
    const categories = JSON.parse(categoriesData);

    // Kategoriyi bul
    const categoryIndex = categories.findIndex((cat: any) => cat.id === categoryId);
    if (categoryIndex === -1) {
      return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 });
    }

    // Yeni alt kategori ID'si oluştur
    const newSubId = `${categoryId}-${categories[categoryIndex].subCategories.length + 1}`;
    
    // Slug oluştur
    const slug = name.toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Yeni alt kategori oluştur
    const newSubCategory = {
      id: newSubId,
      name,
      slug,
      icon: icon || 'emoji:📦'
    };

    // Alt kategoriyi ekle
    categories[categoryIndex].subCategories.push(newSubCategory);

    // JSON dosyasına kaydet
    writeFileSync(categoriesPath, JSON.stringify(categories, null, 2));

    return NextResponse.json({ success: true, subCategory: newSubCategory });
  } catch (error) {
    console.error('Alt kategori ekleme hatası:', error);
    return NextResponse.json({ error: 'Alt kategori eklenemedi' }, { status: 500 });
  }
} 