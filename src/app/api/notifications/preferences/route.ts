import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PREFERENCES_PATH = path.join(process.cwd(), 'public', 'notification-preferences.json');

async function readPreferences() {
  try {
    const data = await fs.readFile(PREFERENCES_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writePreferences(preferences: any) {
  await fs.writeFile(PREFERENCES_PATH, JSON.stringify(preferences, null, 2), 'utf-8');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı ID gerekli' }, { status: 400 });
    }

    const allPreferences = await readPreferences();
    const userPreferences = allPreferences[userId] || null;

    return NextResponse.json({
      success: true,
      preferences: userPreferences
    });

  } catch (error) {
    console.error('Get preferences error:', error);
    return NextResponse.json({ 
      error: 'Tercihler alınırken hata oluştu' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, preferences } = body;

    if (!userId || !preferences) {
      return NextResponse.json({ error: 'Kullanıcı ID ve tercihler gerekli' }, { status: 400 });
    }

    const allPreferences = await readPreferences();
    allPreferences[userId] = preferences;
    await writePreferences(allPreferences);

    return NextResponse.json({
      success: true,
      message: 'Tercihler başarıyla kaydedildi'
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    return NextResponse.json({ 
      error: 'Tercihler kaydedilirken hata oluştu' 
    }, { status: 500 });
  }
} 