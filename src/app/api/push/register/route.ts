import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PUSH_TOKENS_PATH = path.join(process.cwd(), 'public', 'push-tokens.json');

async function readPushTokens() {
  try {
    const data = await fs.readFile(PUSH_TOKENS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writePushTokens(tokens: any[]) {
  await fs.writeFile(PUSH_TOKENS_PATH, JSON.stringify(tokens, null, 2), 'utf-8');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, platform, userId } = body;

    if (!token || !platform) {
      return NextResponse.json({ error: 'Token and platform are required' }, { status: 400 });
    }

    const tokens = await readPushTokens();

    // Mevcut token'ı kontrol et
    const existingTokenIndex = tokens.findIndex((t: any) => t.token === token);

    if (existingTokenIndex !== -1) {
      // Token'ı güncelle
      tokens[existingTokenIndex] = {
        ...tokens[existingTokenIndex],
        userId,
        platform,
        updatedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };
    } else {
      // Yeni token ekle
      const newToken = {
        id: `token_${Date.now()}`,
        token,
        platform,
        userId,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };

      tokens.push(newToken);
    }

    await writePushTokens(tokens);

    return NextResponse.json({
      success: true,
      message: 'Push token registered successfully',
    });

  } catch (error) {
    console.error('Push token registration error:', error);
    return NextResponse.json({ 
      error: 'Push token could not be registered' 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    if (!token && !userId) {
      return NextResponse.json({ error: 'Token or userId is required' }, { status: 400 });
    }

    const tokens = await readPushTokens();

    let filteredTokens = tokens;

    if (token) {
      filteredTokens = filteredTokens.filter((t: any) => t.token !== token);
    } else if (userId) {
      filteredTokens = filteredTokens.filter((t: any) => t.userId !== userId);
    }

    await writePushTokens(filteredTokens);

    return NextResponse.json({
      success: true,
      message: 'Push token(s) removed successfully',
    });

  } catch (error) {
    console.error('Push token removal error:', error);
    return NextResponse.json({ 
      error: 'Push token(s) could not be removed' 
    }, { status: 500 });
  }
} 