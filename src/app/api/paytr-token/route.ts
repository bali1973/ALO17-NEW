import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const body = await req.json();

  // .env.local dosyasına ekleyin:
  // PAYTR_MERCHANT_ID=...
  // PAYTR_MERCHANT_KEY=...
  // PAYTR_MERCHANT_SALT=...
  const merchant_id = process.env.PAYTR_MERCHANT_ID!;
  const merchant_key = process.env.PAYTR_MERCHANT_KEY!;
  const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;

  if (!merchant_id || !merchant_key || !merchant_salt) {
    return NextResponse.json({ error: 'PayTR API bilgileri eksik (.env.local)' }, { status: 500 });
  }

  // Ortak alanlar
  const user_ip = body.user_ip || '127.0.0.1';
  const merchant_oid = body.merchant_oid || 'ORDER123';
  const email = body.email || 'test@example.com';
  const payment_amount = body.payment_amount || 1000;
  const user_name = body.user_name || '';
  const user_address = body.user_address || '';
  const user_phone = body.user_phone || '';
  const ok_url = body.ok_url || '';
  const fail_url = body.fail_url || '';
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
    // buyer_name = yetkili adı
    buyer_name = body.authorized || '';
  } else {
    fatura_type = 'bireysel';
    buyer_tc = body.tc || '';
  }

  // PayTR user_basket örneği (tek ürün)
  const user_basket = Buffer.from(JSON.stringify([
    [body.product_name || 'Test Ürün', body.product_price || '10.00', 1]
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

  // --- Fatura/ödeme kaydını dosyaya ekle ---
  const paymentsPath = path.join(process.cwd(), 'public', 'payments.json');
  let payments = [];
  try {
    const data = await fs.readFile(paymentsPath, 'utf-8');
    payments = JSON.parse(data);
  } catch (e) {
    payments = [];
  }
  const now = new Date().toISOString();
  const paymentRecord = {
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
    product_name: body.product_name || '',
    product_price: body.product_price || '',
    payment_amount,
    merchant_oid,
    status: 'pending', // Ödeme onayı için webhook ile güncellenebilir
  };
  payments.push(paymentRecord);
  await fs.writeFile(paymentsPath, JSON.stringify(payments, null, 2), 'utf-8');
  // ---

  // Test için örnek iframe
  const iframe = `<iframe src='https://www.paytr.com/odeme/guvenli/${paytr_token}' id='paytriframe' frameborder='0' scrolling='no' style='width:100%;min-width:350px;height:600px;'></iframe>`;

  return NextResponse.json({ iframe });
} 