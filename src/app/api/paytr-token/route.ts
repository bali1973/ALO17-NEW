import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

interface PaymentRequest {
  user_ip: string;
  merchant_oid: string;
  email: string;
  payment_amount: number;
  user_name: string;
  user_address: string;
  user_phone?: string;
  ok_url: string;
  fail_url: string;
  test_mode: string;
  payment_type: 'bireysel' | 'kurumsal';
  product_name: string;
  product_price: string;
  // Kurumsal fatura alanları
  company?: string;
  taxOffice?: string;
  taxNo?: string;
  authorized?: string;
  tc?: string;
  // İlan bilgileri
  listingId?: string;
  listingTitle?: string;
  premiumFeatures?: string[];
  premiumPlan?: string;
}

interface PaymentRecord {
  id: string;
  date: string;
  payment_type: string;
  fatura_type: string;
  user_name: string;
  email: string;
  user_phone?: string;
  user_address: string;
  buyer_company?: string;
  buyer_tax_office?: string;
  buyer_tax_no?: string;
  buyer_tc?: string;
  buyer_authorized?: string;
  product_name: string;
  product_price: string;
  payment_amount: number;
  merchant_oid: string;
  status: 'pending' | 'success' | 'failed';
  listingId?: string;
  listingTitle?: string;
  premiumFeatures?: string[];
  premiumPlan?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export async function POST(req: Request) {
  try {
    // Basit auth: Authorization header 'Bearer <ADMIN_TOKEN>' olmalı
    const auth = req.headers.get('authorization');
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'alo17admin';
    if (!auth || auth !== `Bearer ${ADMIN_TOKEN}`) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const body: PaymentRequest = await req.json();

    // Gerekli alanları kontrol et
    const requiredFields = ['email', 'payment_amount', 'user_name', 'user_address', 'ok_url', 'fail_url'];
    for (const field of requiredFields) {
      if (!body[field as keyof PaymentRequest]) {
        return NextResponse.json({ 
          error: `${field} alanı gerekli` 
        }, { status: 400 });
      }
    }

    // Email formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ 
        error: 'Geçersiz email formatı' 
      }, { status: 400 });
    }

    // Ödeme tutarını kontrol et
    if (body.payment_amount <= 0) {
      return NextResponse.json({ 
        error: 'Ödeme tutarı 0\'dan büyük olmalıdır' 
      }, { status: 400 });
    }

    // settings.json dosyasından ayarları oku
    const settingsPath = path.join(process.cwd(), 'public', 'settings.json');
    let settings: any = {};
    try {
      const data = await fs.readFile(settingsPath, 'utf-8');
      settings = JSON.parse(data);
    } catch (e) {
      return NextResponse.json({ 
        error: 'Ayarlar dosyası okunamadı' 
      }, { status: 500 });
    }

    const merchant_id = settings.paytrMerchantId;
    const merchant_key = settings.paytrApiKey;
    const merchant_salt = settings.paytrMerchantSalt;

    if (!merchant_id || !merchant_key || !merchant_salt) {
      return NextResponse.json({ 
        error: 'PayTR API bilgileri eksik. Lütfen admin panelinden ayarları kontrol edin.' 
      }, { status: 500 });
    }

    // Ortak alanlar
    const user_ip = body.user_ip || '127.0.0.1';
    const merchant_oid = body.merchant_oid || `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const email = body.email;
    const payment_amount = Math.round(body.payment_amount * 100); // PayTR kuruş cinsinden ister
    const user_name = body.user_name;
    const user_address = body.user_address;
    const user_phone = body.user_phone || '';
    const ok_url = body.ok_url;
    const fail_url = body.fail_url;
    const test_mode = body.test_mode || '1';
    const payment_type = body.payment_type || 'bireysel';

    // Kurumsal/bireysel fatura bilgileri
    let fatura_type = 'bireysel';
    let buyer_name = user_name;
    let buyer_address = user_address;
    let buyer_tax_no = '';
    let buyer_tax_office = '';
    let buyer_company = '';
    let buyer_tc = '';
    let buyer_authorized = '';

    if (payment_type === 'kurumsal') {
      fatura_type = 'kurumsal';
      buyer_company = body.company || '';
      buyer_tax_office = body.taxOffice || '';
      buyer_tax_no = body.taxNo || '';
      buyer_authorized = body.authorized || '';
      buyer_name = body.authorized || user_name;

      // Kurumsal fatura için gerekli alanları kontrol et
      if (!buyer_company || !buyer_tax_office || !buyer_tax_no) {
        return NextResponse.json({ 
          error: 'Kurumsal fatura için şirket adı, vergi dairesi ve vergi numarası gerekli' 
        }, { status: 400 });
      }
    } else {
      fatura_type = 'bireysel';
      buyer_tc = body.tc || '';

      // Bireysel fatura için TC kimlik numarası kontrolü
      if (buyer_tc && !/^\d{11}$/.test(buyer_tc)) {
        return NextResponse.json({ 
          error: 'Geçersiz TC kimlik numarası' 
        }, { status: 400 });
      }
    }

    // PayTR user_basket örneği (tek ürün)
    const user_basket = Buffer.from(JSON.stringify([
      [body.product_name || 'İlan Yayınlama', body.product_price || '0.00', 1]
    ])).toString('base64');

    // PayTR için gerekli parametreler
    const paytrParams: any = {
      merchant_id,
      user_ip,
      merchant_oid,
      email,
      payment_amount,
      user_basket,
      user_name,
      user_address,
      user_phone,
      ok_url,
      fail_url,
      test_mode,
      fatura_type,
      buyer_name,
      buyer_address,
      buyer_tax_no,
      buyer_tax_office,
      buyer_company,
      buyer_tc,
      buyer_authorized,
    };

    // İmza oluşturma (PayTR dokümantasyonuna göre)
    const hash_str = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${user_basket}${ok_url}${fail_url}${test_mode}${merchant_salt}`;
    const paytr_token = crypto.createHmac('sha256', merchant_key).update(hash_str).digest('base64');

    // Ödeme kaydını dosyaya ekle
    const paymentsPath = path.join(process.cwd(), 'public', 'payments.json');
    let payments: PaymentRecord[] = [];
    try {
      const data = await fs.readFile(paymentsPath, 'utf-8');
      payments = JSON.parse(data);
    } catch (e) {
      payments = [];
    }

    const now = new Date().toISOString();
    const paymentRecord: PaymentRecord = {
      id: Date.now().toString(),
      date: now,
      payment_type,
      fatura_type,
      user_name,
      email,
      user_phone,
      user_address,
      buyer_company,
      buyer_tax_office,
      buyer_tax_no,
      buyer_tc,
      buyer_authorized,
      product_name: body.product_name || 'İlan Yayınlama',
      product_price: body.product_price || '0.00',
      payment_amount: body.payment_amount,
      merchant_oid,
      status: 'pending',
      listingId: body.listingId,
      listingTitle: body.listingTitle,
      premiumFeatures: body.premiumFeatures,
      premiumPlan: body.premiumPlan,
      created_at: now,
      updated_at: now
    };

    payments.push(paymentRecord);
    await fs.writeFile(paymentsPath, JSON.stringify(payments, null, 2), 'utf-8');

    // PayTR iframe URL'si
    const iframeUrl = `https://www.paytr.com/odeme/guvenli/${paytr_token}`;
    const iframe = `<iframe src='${iframeUrl}' id='paytriframe' frameborder='0' scrolling='no' style='width:100%;min-width:350px;height:600px;'></iframe>`;

    return NextResponse.json({ 
      success: true,
      iframe,
      iframeUrl,
      token: paytr_token,
      merchant_oid,
      payment_id: paymentRecord.id
    });

  } catch (error) {
    console.error('PayTR token generation error:', error);
    return NextResponse.json({ 
      error: 'Ödeme başlatılırken bir hata oluştu. Lütfen tekrar deneyin.' 
    }, { status: 500 });
  }
}

// Ödeme durumunu kontrol et
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get('id');
    const merchantOid = searchParams.get('merchant_oid');

    if (!paymentId && !merchantOid) {
      return NextResponse.json({ 
        error: 'Ödeme ID veya merchant_oid gerekli' 
      }, { status: 400 });
    }

    const paymentsPath = path.join(process.cwd(), 'public', 'payments.json');
    let payments: PaymentRecord[] = [];
    
    try {
      const data = await fs.readFile(paymentsPath, 'utf-8');
      payments = JSON.parse(data);
    } catch (e) {
      return NextResponse.json({ 
        error: 'Ödeme kayıtları bulunamadı' 
      }, { status: 404 });
    }

    let payment: PaymentRecord | undefined;

    if (paymentId) {
      payment = payments.find(p => p.id === paymentId);
    } else if (merchantOid) {
      payment = payments.find(p => p.merchant_oid === merchantOid);
    }

    if (!payment) {
      return NextResponse.json({ 
        error: 'Ödeme bulunamadı' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      payment
    });

  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json({ 
      error: 'Ödeme durumu kontrol edilirken hata oluştu' 
    }, { status: 500 });
  }
} 