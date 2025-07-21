import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const SETTINGS_PATH = path.join(process.cwd(), 'public', 'settings.json');

async function readSettings() {
  try {
    const data = await fs.readFile(SETTINGS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeSettings(settings: any) {
  await fs.writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8');
}

export async function GET() {
  const settings = await readSettings();
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  // Basit auth: Authorization header 'Bearer <ADMIN_TOKEN>' olmalı
  const auth = req.headers.get('authorization');
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'alo17admin';
  if (!auth || auth !== `Bearer ${ADMIN_TOKEN}`) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }
  const updates = await req.json();
  const settings = await readSettings();
  // Banner ile ilgili tüm backend kodu kaldırıldı
  const newSettings = { ...settings, ...updates };
  await writeSettings(newSettings);
  return NextResponse.json(newSettings);
} 