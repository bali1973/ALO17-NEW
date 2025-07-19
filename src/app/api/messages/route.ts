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

// Basit küfür/hakaret filtresi (örnek kelimeler)
const bannedWords = [
  'salak', 'aptal', 'gerizekalı', 'mal', 'oç', 'amk', 'orospu', 'sik', 'piç', 'yarrak', 'ananı', 'anan', 'göt', 'sürtük', 'kahpe', 'ibne', 'pezevenk', 'şerefsiz', 'haysiyetsiz', 'puşt', 'bok', 'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'dick', 'cunt', 'motherfucker', 'fucker', 'pussy', 'slut', 'whore'
];

function containsBannedWord(text: string) {
  const lower = text.toLowerCase();
  return bannedWords.some(word => lower.includes(word));
}

export async function GET() {
  const messages = await readMessages();
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (containsBannedWord(body.content || '')) {
    return NextResponse.json({ error: 'Mesajda hakaret veya küfür tespit edildi.' }, { status: 400 });
  }
  const messages = await readMessages();
  const newId = messages.length > 0 ? (parseInt(messages[messages.length - 1].id) + 1).toString() : '1';
  const newMessage = { id: newId, ...body };
  messages.push(newMessage);
  await writeMessages(messages);
  return NextResponse.json({ success: true, message: newMessage });
} 