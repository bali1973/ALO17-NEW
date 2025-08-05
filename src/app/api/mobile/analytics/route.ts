import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const MOBILE_ANALYTICS_PATH = path.join(process.cwd(), 'public', 'mobile-analytics.json');
const PUSH_TOKENS_PATH = path.join(process.cwd(), 'public', 'push-tokens.json');

async function readMobileAnalytics() {
  try {
    const data = await fs.readFile(MOBILE_ANALYTICS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeMobileAnalytics(analytics: any[]) {
  await fs.writeFile(MOBILE_ANALYTICS_PATH, JSON.stringify(analytics, null, 2), 'utf-8');
}

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
    const { events, metrics, sessionId, userId } = body;

    if (!events || !Array.isArray(events)) {
      return NextResponse.json({ error: 'Events array is required' }, { status: 400 });
    }

    const analytics = await readMobileAnalytics();

    // Yeni analitik verilerini ekle
    const newAnalytics = {
      id: `mobile_analytics_${Date.now()}`,
      sessionId,
      userId,
      events: events.map((event: any) => ({
        ...event,
        receivedAt: new Date().toISOString(),
      })),
      metrics: metrics || [],
      receivedAt: new Date().toISOString(),
    };

    analytics.push(newAnalytics);

    // Son 1000 kaydı sakla
    if (analytics.length > 1000) {
      analytics.splice(0, analytics.length - 1000);
    }

    await writeMobileAnalytics(analytics);

    return NextResponse.json({
      success: true,
      message: 'Analytics data received successfully',
      eventsCount: events.length,
      metricsCount: metrics?.length || 0,
    });

  } catch (error) {
    console.error('Mobile analytics error:', error);
    return NextResponse.json({ 
      error: 'Analytics data could not be processed' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '100');

    const analytics = await readMobileAnalytics();

    let filteredAnalytics = analytics;

    // Kullanıcı ID'sine göre filtrele
    if (userId) {
      filteredAnalytics = filteredAnalytics.filter((a: any) => a.userId === userId);
    }

    // Oturum ID'sine göre filtrele
    if (sessionId) {
      filteredAnalytics = filteredAnalytics.filter((a: any) => a.sessionId === sessionId);
    }

    // Limit uygula
    filteredAnalytics = filteredAnalytics.slice(-limit);

    return NextResponse.json({
      success: true,
      analytics: filteredAnalytics,
      total: filteredAnalytics.length,
    });

  } catch (error) {
    console.error('Get mobile analytics error:', error);
    return NextResponse.json({ 
      error: 'Analytics data could not be retrieved' 
    }, { status: 500 });
  }
} 