import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(req: Request) {
  const body = await req.formData();
  const merchant_oid = body.get('merchant_oid') as string;
  const status = body.get('status') as string; // 'success' veya 'failed'
  const total_amount = body.get('total_amount') as string;
  const hash = body.get('hash') as string;

  // PayTR hash doğrulama
  const merchant_key = process.env.PAYTR_MERCHANT_KEY!;
  const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;
  const hashStr = merchant_oid + merchant_salt + status + total_amount;
  const paytrHash = crypto.createHmac('sha256', merchant_key).update(hashStr).digest('base64');
  if (paytrHash !== hash) {
    return new Response('PAYTR notification failed: invalid hash', { status: 400 });
  }

  // payments.json dosyasını güncelle
  const paymentsPath = path.join(process.cwd(), 'public', 'payments.json');
  let payments = [];
  try {
    const data = await fs.readFile(paymentsPath, 'utf-8');
    payments = JSON.parse(data);
  } catch (e) {
    return new Response('Payments file not found', { status: 500 });
  }
  const idx = payments.findIndex((p: any) => p.merchant_oid === merchant_oid);
  if (idx === -1) {
    return new Response('Payment not found', { status: 404 });
  }
  payments[idx].status = status;
  await fs.writeFile(paymentsPath, JSON.stringify(payments, null, 2), 'utf-8');

  // PayTR webhook'a "OK" dönülmeli
  return new Response('OK');
} 