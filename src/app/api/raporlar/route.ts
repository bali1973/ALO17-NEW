import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const REPORTS_PATH = path.join(process.cwd(), 'public', 'reports.json');

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

export async function GET() {
  const reports = await readReports();
  return NextResponse.json(reports);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const reports = await readReports();
  const newId = reports.length > 0 ? Math.max(...reports.map((r: any) => r.id)) + 1 : 1;
  const newReport = { id: newId, ...body };
  reports.push(newReport);
  await writeReports(reports);
  return NextResponse.json({ success: true, report: newReport });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
  const reports = await readReports();
  const idx = reports.findIndex((r: any) => r.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Rapor bulunamadı' }, { status: 404 });
  reports[idx] = { ...reports[idx], ...updates };
  await writeReports(reports);
  return NextResponse.json({ success: true, report: reports[idx] });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
  const reports = await readReports();
  const idx = reports.findIndex((r: any) => r.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Rapor bulunamadı' }, { status: 404 });
  reports[idx] = { ...reports[idx], ...updates };
  await writeReports(reports);
  return NextResponse.json({ success: true, report: reports[idx] });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
  let reports = await readReports();
  const idx = reports.findIndex((r: any) => r.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Rapor bulunamadı' }, { status: 404 });
  reports.splice(idx, 1);
  await writeReports(reports);
  return NextResponse.json({ success: true });
} 