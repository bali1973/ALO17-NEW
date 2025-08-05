import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const REPORTS_PATH = path.join(process.cwd(), 'public', 'raporlar.json');

async function readReports() {
  try {
    const data = await fs.readFile(REPORTS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeReports(reports: any[]) {
  await fs.writeFile(REPORTS_PATH, JSON.stringify(reports, null, 2), 'utf-8');
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const reportId = parseInt(params.id);
    
    if (isNaN(reportId)) {
      return NextResponse.json({ error: 'Geçersiz ID' }, { status: 400 });
    }

    const reports = await readReports();
    const reportIndex = reports.findIndex((r: any) => r.id === reportId);
    
    if (reportIndex === -1) {
      return NextResponse.json({ error: 'Rapor bulunamadı' }, { status: 404 });
    }

    // Raporu güncelle
    reports[reportIndex] = { ...reports[reportIndex], ...body };
    await writeReports(reports);

    return NextResponse.json({ 
      success: true, 
      report: reports[reportIndex] 
    });
  } catch (error) {
    console.error('Rapor güncelleme hatası:', error);
    return NextResponse.json({ error: 'Güncelleme sırasında hata oluştu' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reportId = parseInt(params.id);
    
    if (isNaN(reportId)) {
      return NextResponse.json({ error: 'Geçersiz ID' }, { status: 400 });
    }

    const reports = await readReports();
    const reportIndex = reports.findIndex((r: any) => r.id === reportId);
    
    if (reportIndex === -1) {
      return NextResponse.json({ error: 'Rapor bulunamadı' }, { status: 404 });
    }

    // Raporu sil
    reports.splice(reportIndex, 1);
    await writeReports(reports);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Rapor silme hatası:', error);
    return NextResponse.json({ error: 'Silme sırasında hata oluştu' }, { status: 500 });
  }
} 