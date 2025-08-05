import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PERFORMANCE_METRICS_PATH = path.join(process.cwd(), 'public', 'performance-metrics.json');

async function readPerformanceMetrics() {
  try {
    const data = await fs.readFile(PERFORMANCE_METRICS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writePerformanceMetrics(metrics: any[]) {
  await fs.writeFile(PERFORMANCE_METRICS_PATH, JSON.stringify(metrics, null, 2), 'utf-8');
}

export async function POST(request: NextRequest) {
  try {
    const metric = await request.json();
    
    // Metrik verilerini doğrula
    if (!metric.name || typeof metric.value !== 'number') {
      return NextResponse.json({ error: 'Invalid metric data' }, { status: 400 });
    }

    // Ek bilgiler ekle
    const enrichedMetric = {
      ...metric,
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      receivedAt: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    };

    const metrics = await readPerformanceMetrics();
    metrics.push(enrichedMetric);

    // Son 10000 metriği sakla
    if (metrics.length > 10000) {
      metrics.splice(0, metrics.length - 10000);
    }

    await writePerformanceMetrics(metrics);

    return NextResponse.json({
      success: true,
      message: 'Metric recorded successfully',
    });

  } catch (error) {
    console.error('Performance metric error:', error);
    return NextResponse.json({ 
      error: 'Failed to record metric' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    const limit = parseInt(searchParams.get('limit') || '100');

    const metrics = await readPerformanceMetrics();

    let filteredMetrics = metrics;

    // Filtreleme
    if (name) {
      filteredMetrics = filteredMetrics.filter((m: any) => m.name === name);
    }

    if (startTime) {
      const start = parseInt(startTime);
      filteredMetrics = filteredMetrics.filter((m: any) => m.timestamp >= start);
    }

    if (endTime) {
      const end = parseInt(endTime);
      filteredMetrics = filteredMetrics.filter((m: any) => m.timestamp <= end);
    }

    // Limit uygula
    filteredMetrics = filteredMetrics.slice(-limit);

    // İstatistikler hesapla
    const stats = {
      total: filteredMetrics.length,
      byName: {} as Record<string, { count: number; average: number; min: number; max: number }>,
    };

    filteredMetrics.forEach((metric: any) => {
      if (!stats.byName[metric.name]) {
        stats.byName[metric.name] = { count: 0, average: 0, min: Infinity, max: -Infinity };
      }

      const stat = stats.byName[metric.name];
      stat.count++;
      stat.min = Math.min(stat.min, metric.value);
      stat.max = Math.max(stat.max, metric.value);
    });

    // Ortalamaları hesapla
    Object.keys(stats.byName).forEach(name => {
      const values = filteredMetrics.filter((m: any) => m.name === name).map((m: any) => m.value);
      const sum = values.reduce((acc, val) => acc + val, 0);
      stats.byName[name].average = sum / values.length;
    });

    return NextResponse.json({
      success: true,
      metrics: filteredMetrics,
      stats,
    });

  } catch (error) {
    console.error('Get performance metrics error:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve metrics' 
    }, { status: 500 });
  }
} 