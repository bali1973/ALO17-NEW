import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // Basit auth: Authorization header 'Bearer <ADMIN_TOKEN>' olmalı
  const auth = req.headers.get('authorization');
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'alo17admin';
  if (!auth || auth !== `Bearer ${ADMIN_TOKEN}`) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const type = formData.get('type') as string; // 'logo', 'favicon', 'banner'
  if (!file || !type) {
    return NextResponse.json({ error: 'Dosya veya tip eksik' }, { status: 400 });
  }
  // --- Dosya tipi ve boyut validasyonu ---
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/jpg'
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Geçersiz dosya tipi' }, { status: 400 });
  }
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'Dosya boyutu 5MB üzerinde' }, { status: 400 });
  }
  // ---
  const arrayBuffer = await file.arrayBuffer();
  let filePath = '';
  let url = '';
  if (type === 'logo') {
    filePath = path.join(process.cwd(), 'public', 'images', 'logo.svg');
    url = '/images/logo.svg';
  } else if (type === 'favicon') {
    filePath = path.join(process.cwd(), 'public', 'favicon.ico');
    url = '/favicon.ico';
  } else if (type === 'banner') {
    // Orijinal dosya uzantısını al
    const originalName = (file as any).name || 'banner.jpg';
    const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    // images klasörü yoksa oluştur
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    try { await fs.mkdir(imagesDir, { recursive: true }); } catch {}
    const uniqueName = uuidv4();
    filePath = path.join(imagesDir, `${uniqueName}.${ext}`);
    url = `/images/${uniqueName}.${ext}`;
  } else {
    return NextResponse.json({ error: 'Geçersiz tip' }, { status: 400 });
  }
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));
  return NextResponse.json({ success: true, url });
} 