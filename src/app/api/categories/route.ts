import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Kategorileri getir
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'categories.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const categories = JSON.parse(data);
    return NextResponse.json(categories);
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

    // Mevcut kategorileri oku
    const filePath = path.join(process.cwd(), 'public', 'categories.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const categories = JSON.parse(data);

    // Yeni kategori ekle
    const newCategory = {
      id: categories.length + 1,
      name,
      slug,
      icon: icon || null,
    };

    categories.push(newCategory);

    // Kategorileri kaydet
    await fs.writeFile(filePath, JSON.stringify(categories, null, 2));

    return NextResponse.json(newCategory);
  } catch (error) {
    console.error('Kategori ekleme hatası:', error);
    return NextResponse.json({ error: 'Kategori eklenemedi' }, { status: 500 });
  }
} 