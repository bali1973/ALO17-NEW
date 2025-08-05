import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const USERS_PATH = path.join(process.cwd(), 'public', 'users.json');

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeUsers(users: any[]) {
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2), 'utf-8');
}

export async function POST(req: Request) {
  const body = await req.json();
  const { email, name, phone, location, address, birthdate } = body;
  console.log('API gelen (JSON):', body);
  if (!email) {
    return NextResponse.json({ error: 'Email zorunlu' }, { status: 400 });
  }
  const users = await readUsers();
  const idx = users.findIndex((u: any) => u.email === email);
  if (idx === -1) {
    return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
  }
  console.log('ÖNCE (users[idx]):', users[idx]);
  // Güncellenecek alanlar
  users[idx].name = name || users[idx].name;
  users[idx].phone = phone || users[idx].phone;
  users[idx].location = location || users[idx].location;
  users[idx].address = address || users[idx].address;
  users[idx].birthdate = birthdate || users[idx].birthdate;
  console.log('SONRA (users[idx]):', users[idx]);
  // Avatar dosyası mock (gerçek dosya kaydı yok)
  console.log('YAZILMADAN ÖNCE (users):', users);
  await writeUsers(users);
  console.log('YAZILDIKTAN SONRA (users):', users);
  return NextResponse.json({ success: true, user: users[idx] });
} 