import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PRICES_PATH = path.join(process.cwd(), 'public', 'premium-feature-prices.json');

export async function GET() {
  try {
    const data = await fs.readFile(PRICES_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Fiyatlar okunamadı' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    await fs.writeFile(PRICES_PATH, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Fiyatlar güncellenemedi' }, { status: 500 });
  }
} 