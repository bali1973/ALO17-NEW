import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { logFileUpload } from '@/lib/security-logger';

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
  // --- Güvenli dosya tipi ve boyut validasyonu ---
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/jpg'
  ];
  // SVG dosyaları güvenlik riski taşıyabilir, kaldırıldı
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  // Dosya tipi kontrolü
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Geçersiz dosya tipi' }, { status: 400 });
  }
  
  // Dosya boyutu kontrolü
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'Dosya boyutu 5MB üzerinde' }, { status: 400 });
  }
  
  // Dosya adı güvenlik kontrolü
  const fileName = file.name || '';
  const suspiciousPatterns = [
    /\.\.\//, // Path traversal
    /[<>:"|?*]/, // Geçersiz karakterler
    /\.(php|asp|aspx|jsp|exe|bat|cmd|sh|bash)$/i, // Tehlikeli uzantılar
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(fileName)) {
      return NextResponse.json({ error: 'Geçersiz dosya adı' }, { status: 400 });
    }
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
  
  // Başarılı dosya yüklemeyi logla
  const clientIP = req.headers.get('x-forwarded-for') || 
                   req.headers.get('x-real-ip') || 
                   req.headers.get('cf-connecting-ip') || 
                   'unknown';
  
  logFileUpload(clientIP, file.name || 'unknown', file.size, true);
  
  return NextResponse.json({ success: true, url });
} 