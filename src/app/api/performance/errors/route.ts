import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PERFORMANCE_ERRORS_PATH = path.join(process.cwd(), 'public', 'performance-errors.json');

async function readPerformanceErrors() {
  try {
    const data = await fs.readFile(PERFORMANCE_ERRORS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writePerformanceErrors(errors: any[]) {
  await fs.writeFile(PERFORMANCE_ERRORS_PATH, JSON.stringify(errors, null, 2), 'utf-8');
}

export async function POST(request: NextRequest) {
  try {
    const error = await request.json();
    
    // Hata verilerini doğrula
    if (!error.type) {
      return NextResponse.json({ error: 'Invalid error data' }, { status: 400 });
    }

    // Ek bilgiler ekle
    const enrichedError = {
      ...error,
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      receivedAt: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    const errors = await readPerformanceErrors();
    errors.push(enrichedError);

    // Son 1000 hatayı sakla
    if (errors.length > 1000) {
      errors.splice(0, errors.length - 1000);
    }

    await writePerformanceErrors(errors);

    return NextResponse.json({
      success: true,
      message: 'Error recorded successfully',
    });

  } catch (error) {
    console.error('Performance error recording error:', error);
    return NextResponse.json({ 
      error: 'Failed to record error' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    const limit = parseInt(searchParams.get('limit') || '100');

    const errors = await readPerformanceErrors();

    let filteredErrors = errors;

    // Filtreleme
    if (type) {
      filteredErrors = filteredErrors.filter((e: any) => e.type === type);
    }

    if (startTime) {
      const start = parseInt(startTime);
      filteredErrors = filteredErrors.filter((e: any) => e.timestamp >= start);
    }

    if (endTime) {
      const end = parseInt(endTime);
      filteredErrors = filteredErrors.filter((e: any) => e.timestamp <= end);
    }

    // Limit uygula
    filteredErrors = filteredErrors.slice(-limit);

    // İstatistikler hesapla
    const stats = {
      total: filteredErrors.length,
      byType: {} as Record<string, number>,
      byUrl: {} as Record<string, number>,
      recentErrors: filteredErrors.slice(-10), // Son 10 hata
    };

    filteredErrors.forEach((error: any) => {
      // Tip bazında sayım
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      
      // URL bazında sayım
      if (error.url) {
        const domain = new URL(error.url).hostname;
        stats.byUrl[domain] = (stats.byUrl[domain] || 0) + 1;
      }
    });

    return NextResponse.json({
      success: true,
      errors: filteredErrors,
      stats,
    });

  } catch (error) {
    console.error('Get performance errors error:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve errors' 
    }, { status: 500 });
  }
} 