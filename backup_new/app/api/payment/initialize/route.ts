import { NextResponse } from 'next/server';
import crypto from 'crypto';

// PayTR API bilgileri - Gerçek uygulamada .env dosyasından alınmalı
const PAYTR_MERCHANT_ID = '123456';
const PAYTR_MERCHANT_KEY = 'your-merchant-key';
const PAYTR_MERCHANT_SALT = 'your-merchant-salt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { listingId, amount, currency } = body;

    // Benzersiz sipariş numarası oluştur
    const merchant_oid = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    // Kullanıcı bilgileri - Gerçek uygulamada oturum bilgilerinden alınmalı
    const user = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '5551234567',
      address: 'Test Address',
    };

    // Sepet bilgisi
    const user_basket = JSON.stringify([
      ['Premium İlan', amount, 1]
    ]);

    // PayTR için gerekli parametreler
    const params = {
      merchant_id: PAYTR_MERCHANT_ID,
      user_ip: '127.0.0.1', // Gerçek IP adresi alınmalı
      merchant_oid,
      email: user.email,
      payment_amount: amount * 100, // Kuruş cinsinden
      paytr_token: '',
      user_basket,
      debug_on: 0,
      no_installment: 1,
      max_installment: 0,
      user_name: user.name,
      user_address: user.address,
      user_phone: user.phone,
      merchant_ok_url: `${process.env.NEXT_PUBLIC_BASE_URL}/odeme/basarili`,
      merchant_fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/odeme/basarisiz`,
      timeout_limit: 30,
      currency: currency,
      test_mode: process.env.NODE_ENV === 'development' ? 1 : 0,
    };

    // PayTR token oluştur
    const hash_str = `${PAYTR_MERCHANT_ID}${params.user_ip}${merchant_oid}${user.email}${params.payment_amount}${user_basket}${params.no_installment}${params.max_installment}${params.currency}${params.test_mode}${PAYTR_MERCHANT_SALT}`;
    const paytr_token = crypto.createHmac('sha256', PAYTR_MERCHANT_KEY).update(hash_str).digest('base64');
    
    params.paytr_token = paytr_token;

    // Veritabanına ödeme kaydı oluştur
    // TODO: Ödeme kaydını veritabanına ekle

    return NextResponse.json(params);
  } catch (error) {
    console.error('Ödeme başlatma hatası:', error);
    return NextResponse.json(
      { error: 'Ödeme başlatılamadı' },
      { status: 500 }
    );
  }
} 