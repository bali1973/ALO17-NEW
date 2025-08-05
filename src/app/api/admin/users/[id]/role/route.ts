import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { role } = body;

    // Validasyon
    if (!role || !['user', 'moderator', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Geçersiz rol değeri' },
        { status: 400 }
      );
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Rolü güncelle
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role }
    });

    // Log kaydı
    await prisma.adminLog.create({
      data: {
        action: 'USER_ROLE_UPDATE',
        targetId: id,
        targetType: 'USER',
        details: JSON.stringify({
          previousRole: user.role,
          newRole: role,
          reason: body.reason || 'Admin tarafından güncellendi'
        }),
        adminId: 'admin', // Gerçek uygulamada admin ID'si alınmalı
        timestamp: new Date()
      }
    });

    return NextResponse.json({
      message: 'Kullanıcı rolü güncellendi',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });

  } catch (error) {
    console.error('Update user role error:', error);
    return NextResponse.json(
      { error: 'Kullanıcı rolü güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
} 