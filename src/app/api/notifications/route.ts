import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const NOTIFICATIONS_PATH = path.join(process.cwd(), 'public', 'notifications.json');

async function readNotifications() {
  try {
    const data = await fs.readFile(NOTIFICATIONS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeNotifications(notifications: any[]) {
  await fs.writeFile(NOTIFICATIONS_PATH, JSON.stringify(notifications, null, 2), 'utf-8');
}

export async function GET(req: NextRequest) {
  const notifications = await readNotifications();
  const userEmail = req.nextUrl.searchParams.get('userEmail');
  if (userEmail) {
    return NextResponse.json(notifications.filter((n: any) => n.userEmail === userEmail));
  }
  return NextResponse.json(notifications);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const notifications = await readNotifications();
  const newId = notifications.length > 0 ? Math.max(...notifications.map((n: any) => n.id)) + 1 : 1;
  const newNotification = { id: newId, ...body, createdAt: new Date().toISOString(), read: false };
  notifications.push(newNotification);
  await writeNotifications(notifications);
  return NextResponse.json({ success: true, notification: newNotification });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
  const notifications = await readNotifications();
  const idx = notifications.findIndex((n: any) => n.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Bildirim bulunamadı' }, { status: 404 });
  notifications[idx] = { ...notifications[idx], ...updates };
  await writeNotifications(notifications);
  return NextResponse.json({ success: true, notification: notifications[idx] });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
  let notifications = await readNotifications();
  const idx = notifications.findIndex((n: any) => n.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Bildirim bulunamadı' }, { status: 404 });
  notifications.splice(idx, 1);
  await writeNotifications(notifications);
  return NextResponse.json({ success: true });
} 