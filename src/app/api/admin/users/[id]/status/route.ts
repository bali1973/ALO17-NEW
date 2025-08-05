import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // Validasyon
    if (!status || !['active', 'suspended', 'banned'].includes(status)) {
      return NextResponse.json(
        { error: 'Geçersiz durum değeri' },
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

    // Durumu güncelle
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status }
    });

    // Log kaydı
    await prisma.adminLog.create({
      data: {
        action: 'USER_STATUS_UPDATE',
        targetId: id,
        targetType: 'USER',
        details: JSON.stringify({
          previousStatus: user.status,
          newStatus: status,
          reason: body.reason || 'Admin tarafından güncellendi'
        }),
        adminId: 'admin', // Gerçek uygulamada admin ID'si alınmalı
        timestamp: new Date()
      }
    });

    return NextResponse.json({
      message: 'Kullanıcı durumu güncellendi',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        status: updatedUser.status
      }
    });

  } catch (error) {
    console.error('Update user status error:', error);
    return NextResponse.json(
      { error: 'Kullanıcı durumu güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
} 