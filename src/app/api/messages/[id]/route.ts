import { NextRequest, NextResponse } from 'next/server';

// Mock messages (production'da gerçek database kullanılacak)
let mockMessages: any[] = [];

async function readMessages() {
  return mockMessages;
}

async function writeMessages(messages: any[]) {
  mockMessages = messages;
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let messages = await readMessages();
  messages = messages.filter((m: any) => m.id !== id);
  await writeMessages(messages);
  return NextResponse.json({ success: true });
} 