import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const MESSAGES_PATH = path.join(process.cwd(), 'public', 'messages.json');

async function readMessages() {
  try {
    const data = await fs.readFile(MESSAGES_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeMessages(messages: any[]) {
  await fs.writeFile(MESSAGES_PATH, JSON.stringify(messages, null, 2), 'utf-8');
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  let messages = await readMessages();
  messages = messages.filter((m: any) => m.id !== id);
  await writeMessages(messages);
  return NextResponse.json({ success: true });
} 