import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PREMIUM_SUBSCRIPTIONS_PATH = path.join(process.cwd(), 'public', 'premium-subscriptions.json');
const PREMIUM_PLANS_PATH = path.join(process.cwd(), 'public', 'premium-plans.json');
const PREMIUM_FEATURES_PATH = path.join(process.cwd(), 'public', 'premium-features.json');

async function readPremiumSubscriptions() {
  try {
    const data = await fs.readFile(PREMIUM_SUBSCRIPTIONS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writePremiumSubscriptions(subscriptions: any[]) {
  await fs.writeFile(PREMIUM_SUBSCRIPTIONS_PATH, JSON.stringify(subscriptions, null, 2), 'utf-8');
}

async function readPremiumPlans() {
  try {
    const data = await fs.readFile(PREMIUM_PLANS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function readPremiumFeatures() {
  try {
    const data = await fs.readFile(PREMIUM_FEATURES_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planId, featureIds, totalPrice } = body;

    if (!userId || !planId || !totalPrice) {
      return NextResponse.json({ error: 'Gerekli alanlar eksik' }, { status: 400 });
    }

    const subscriptions = await readPremiumSubscriptions();
    const plans = await readPremiumPlans();
    const features = await readPremiumFeatures();

    // Planı kontrol et
    const plan = plans.find((p: any) => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: 'Geçersiz plan' }, { status: 400 });
    }

    // Özellikleri kontrol et
    const selectedFeatures = features.filter((f: any) => featureIds.includes(f.id));
    const featureNames = selectedFeatures.map((f: any) => f.name);

    // Yeni abonelik oluştur
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);

    const newSubscription = {
      id: `sub_${Date.now()}`,
      userId,
      planId,
      planName: plan.name,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      features: featureIds,
      featureNames,
      totalPrice: parseFloat(totalPrice),
      isActive: true,
      createdAt: new Date().toISOString(),
      paymentStatus: 'pending'
    };

    // Mevcut aktif aboneliği deaktif et
    const existingSubscription = subscriptions.find((sub: any) => 
      sub.userId === userId && sub.isActive
    );
    
    if (existingSubscription) {
      existingSubscription.isActive = false;
      existingSubscription.updatedAt = new Date().toISOString();
    }

    // Yeni aboneliği ekle
    subscriptions.push(newSubscription);
    await writePremiumSubscriptions(subscriptions);

    // PayTR ödeme URL'si oluştur
    const paymentData = {
      user_ip: '127.0.0.1',
      merchant_oid: `PREMIUM_${Date.now()}`,
      email: userId,
      payment_amount: totalPrice * 100, // PayTR kuruş cinsinden ister
      user_name: userId.split('@')[0],
      user_address: 'Premium Üyelik',
      user_phone: '',
      ok_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/premium-ozellikler?success=1`,
      fail_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/premium-ozellikler?fail=1`,
      test_mode: '1',
      payment_type: 'premium',
      product_name: `${plan.name} Premium Üyelik`,
      product_price: totalPrice.toFixed(2),
      subscription_id: newSubscription.id
    };

    // PayTR token oluştur
    const paytrResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/paytr-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (paytrResponse.ok) {
      const paytrData = await paytrResponse.json();
      return NextResponse.json({
        success: true,
        subscription: newSubscription,
        paymentUrl: paytrData.iframeUrl,
        iframe: paytrData.iframe
      });
    } else {
      return NextResponse.json({
        success: true,
        subscription: newSubscription,
        message: 'Abonelik oluşturuldu, ödeme sayfasına yönlendiriliyorsunuz...'
      });
    }

  } catch (error) {
    console.error('Premium purchase error:', error);
    return NextResponse.json({ 
      error: 'Premium satın alma işlemi başlatılamadı' 
    }, { status: 500 });
  }
} 