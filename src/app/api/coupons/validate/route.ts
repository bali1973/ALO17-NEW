import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Bu işlem için giriş yapmalısınız' },
        { status: 401 }
      );
    }

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { message: 'Kupon kodu gerekli' },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
      include: {
        usedBy: {
          where: {
            id: session.user.id
          }
        }
      }
    });

    if (!coupon) {
      return NextResponse.json(
        { message: 'Geçersiz kupon kodu' },
        { status: 400 }
      );
    }

    if (!coupon.isActive) {
      return NextResponse.json(
        { message: 'Bu kupon artık aktif değil' },
        { status: 400 }
      );
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json(
        { message: 'Bu kuponun süresi dolmuş' },
        { status: 400 }
      );
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json(
        { message: 'Bu kuponun kullanım limiti dolmuş' },
        { status: 400 }
      );
    }

    if (coupon.usedBy.length > 0) {
      return NextResponse.json(
        { message: 'Bu kuponu daha önce kullandınız' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      discount: coupon.discount,
      message: 'Kupon geçerli'
    });
  } catch (error) {
    console.error('Kupon doğrulama hatası:', error);
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 