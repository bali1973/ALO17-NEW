import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PLANS_PATH = path.join(process.cwd(), 'public', 'premium-plans.json');

export async function GET() {
  try {
    const data = await fs.readFile(PLANS_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Planlar okunamadı' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (body.planKey && body.data) {
      // Tek bir plan güncelle
      const file = await fs.readFile(PLANS_PATH, 'utf-8');
      const plans = JSON.parse(file);
      plans[body.planKey] = body.data;
      await fs.writeFile(PLANS_PATH, JSON.stringify(plans, null, 2), 'utf-8');
      return NextResponse.json({ success: true });
    } else {
      // Tüm planları topluca güncelle (eski davranış)
      await fs.writeFile(PLANS_PATH, JSON.stringify(body, null, 2), 'utf-8');
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Planlar güncellenemedi' }, { status: 500 });
  }
} 