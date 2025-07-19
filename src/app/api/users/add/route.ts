import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { hash } from 'bcryptjs';

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
  const user = await req.json();
  if (!user.email || !user.password) {
    return NextResponse.json({ error: 'Email ve şifre zorunlu' }, { status: 400 });
  }
  const users = await readUsers();
  if (users.some((u: any) => u.email === user.email)) {
    return NextResponse.json({ error: 'Bu email zaten kayıtlı' }, { status: 400 });
  }
  // Şifreyi hash'le
  const hashedPassword = await hash(user.password, 10);
  users.push({ ...user, password: hashedPassword });
  await writeUsers(users);
  return NextResponse.json({ success: true, user: { ...user, password: undefined } });
} 