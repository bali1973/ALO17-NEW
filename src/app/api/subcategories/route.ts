import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

// Alt kategorileri getir
export async function GET() {
  try {
    const subCategories = await prisma.subCategory.findMany();
    return NextResponse.json(subCategories);
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

    // Alt kategoriyi veritabanına ekle
    const newSubCategory = await prisma.subCategory.create({
      data: {
        name,
        slug,
        categoryId,
      },
    });

    // Alt kategori değişti, kategorileri revalidate et
    revalidatePath('/kategori');

    return NextResponse.json({ success: true, subCategory: newSubCategory });
  } catch (error) {
    console.error('Alt kategori ekleme hatası:', error);
    return NextResponse.json({ error: 'Alt kategori eklenemedi' }, { status: 500 });
  }
} 