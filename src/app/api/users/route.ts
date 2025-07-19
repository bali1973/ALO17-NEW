import { NextRequest, NextResponse } from 'next/server';
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

export async function GET() {
  const users = await readUsers();
  return NextResponse.json(users);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  let users = await readUsers();
  users = users.filter((u: any) => u.id !== id);
  await writeUsers(users);
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const { id, ...update } = await req.json();
  let users = await readUsers();
  users = users.map((u: any) => u.id === id ? { ...u, ...update } : u);
  await writeUsers(users);
  return NextResponse.json({ success: true });
} 