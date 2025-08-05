import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

// Alt kategori güncelleme
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, icon } = body;

    // Alt kategoriyi veritabanında güncelle
    const updatedSubCategory = await prisma.subCategory.update({
      where: { id: id },
      data: {
        name: name,
        icon: icon,
      },
    });

    // Alt kategori değişti, kategorileri revalidate et
    revalidatePath('/kategori');

    return NextResponse.json({ success: true, subCategory: updatedSubCategory });
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

    // Alt kategoriyi veritabanından sil
    await prisma.subCategory.delete({
      where: { id: id },
    });

    // Alt kategori değişti, kategorileri revalidate et
    revalidatePath('/kategori');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Alt kategori silme hatası:', error);
    return NextResponse.json({ error: 'Alt kategori silinemedi' }, { status: 500 });
  }
} 