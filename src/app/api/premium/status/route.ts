import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const USERS_PATH = path.join(process.cwd(), 'public', 'users.json');
const PREMIUM_SUBSCRIPTIONS_PATH = path.join(process.cwd(), 'public', 'premium-subscriptions.json');

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function readPremiumSubscriptions() {
  try {
    const data = await fs.readFile(PREMIUM_SUBSCRIPTIONS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı ID gerekli' }, { status: 400 });
    }

    const users = await readUsers();
    const subscriptions = await readPremiumSubscriptions();

    // Kullanıcıyı bul
    const user = users.find((u: any) => u.email === userId);
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    // Aktif premium aboneliği bul
    const activeSubscription = subscriptions.find((sub: any) => 
      sub.userId === userId && 
      sub.isActive && 
      new Date(sub.endDate) > new Date()
    );

    if (!activeSubscription) {
      return NextResponse.json({
        success: true,
        isPremium: false,
        planId: null,
        startDate: null,
        endDate: null,
        features: [],
        remainingDays: 0
      });
    }

    // Kalan günleri hesapla
    const endDate = new Date(activeSubscription.endDate);
    const now = new Date();
    const remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      success: true,
      isPremium: true,
      planId: activeSubscription.planId,
      startDate: activeSubscription.startDate,
      endDate: activeSubscription.endDate,
      features: activeSubscription.features || [],
      remainingDays: Math.max(0, remainingDays)
    });

  } catch (error) {
    console.error('Get premium status error:', error);
    return NextResponse.json({ 
      error: 'Premium durum alınırken hata oluştu',
      isPremium: false,
      planId: null,
      startDate: null,
      endDate: null,
      features: [],
      remainingDays: 0
    }, { status: 500 });
  }
} 