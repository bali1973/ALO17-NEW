import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    // public/categories.json dosyasını oku
    const categoriesPath = join(process.cwd(), 'public', 'categories.json');
    const categoriesData = readFileSync(categoriesPath, 'utf8');
    const categories = JSON.parse(categoriesData);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Kategoriler yüklenirken hata:', error);
    return NextResponse.json({ error: 'Kategoriler yüklenemedi' }, { status: 500 });
  }
}

// Kategori ekleme
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, icon } = body;

    if (!name) {
      return NextResponse.json({ error: 'Kategori adı gerekli' }, { status: 400 });
    }

    // JSON dosyasını oku
    const categoriesPath = join(process.cwd(), 'public', 'categories.json');
    const categoriesData = readFileSync(categoriesPath, 'utf8');
    const categories = JSON.parse(categoriesData);

    // Yeni kategori ID'si oluştur
    const newId = (categories.length + 1).toString();
    
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

    // Yeni kategori oluştur
    const newCategory = {
      id: newId,
      name,
      slug,
      icon: icon || 'emoji:📦',
      order: categories.length,
      subCategories: []
    };

    // Kategoriyi ekle
    categories.push(newCategory);

    // JSON dosyasına kaydet
    writeFileSync(categoriesPath, JSON.stringify(categories, null, 2));

    // Kategori değişti, anasayfa ve kategori sayfalarını revalidate et
    revalidatePath('/');
    revalidatePath('/kategori');

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error) {
    console.error('Kategori ekleme hatası:', error);
    return NextResponse.json({ error: 'Kategori eklenemedi' }, { status: 500 });
  }
} 