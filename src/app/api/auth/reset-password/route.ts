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
  const { email, newPassword } = await req.json();
  if (!email || !newPassword) {
    return NextResponse.json({ message: 'Email ve yeni şifre zorunlu' }, { status: 400 });
  }
  const users = await readUsers();
  const idx = users.findIndex((u: any) => u.email === email);
  if (idx === -1) {
    return NextResponse.json({ message: 'Kullanıcı bulunamadı' }, { status: 404 });
  }
  users[idx].password = newPassword;
  await writeUsers(users);
  return NextResponse.json({ message: 'Şifre başarıyla güncellendi' });
} 