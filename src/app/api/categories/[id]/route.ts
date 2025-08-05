import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

// Kategori güncelleme
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, icon } = body;

    // Kategoriyi veritabanında güncelle
    const updatedCategory = await prisma.category.update({
      where: { id: id },
      data: {
        name: name,
        icon: icon,
      },
    });

    // Kategori değişti, anasayfa ve kategori sayfalarını revalidate et
    revalidatePath('/');
    revalidatePath('/kategori');

    return NextResponse.json({ success: true, category: updatedCategory });
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

    // Kategoriyi veritabanından sil
    await prisma.category.delete({
      where: { id: id },
    });

    // Kategori değişti, anasayfa ve kategori sayfalarını revalidate et
    revalidatePath('/');
    revalidatePath('/kategori');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Kategori silme hatası:', error);
    return NextResponse.json({ error: 'Kategori silinemedi' }, { status: 500 });
  }
} 