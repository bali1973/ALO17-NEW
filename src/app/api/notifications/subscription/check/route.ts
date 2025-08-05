import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');

    if (!email) {
      return NextResponse.json(
        { error: 'Email adresi gerekli' },
        { status: 400 }
      );
    }

    // Abonelik kontrolü (email bazlı)
    const subscription = await prisma.notificationSubscription.findFirst({
      where: {
        email: email,
        category: category || null,
        subcategory: subcategory || null,
        isActive: true
      }
    });

    return NextResponse.json({
      isSubscribed: !!subscription,
      subscription: subscription || null
    });
  } catch (error) {
    console.error('Subscription check error:', error);
    return NextResponse.json(
      { error: 'Abonelik kontrolü yapılamadı' },
      { status: 500 }
    );
  }
} 