import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // reports.json dosyasından okunmamış bildirim sayısını al
    const reportsPath = path.join(process.cwd(), 'public', 'reports.json');
    
    try {
      const data = await fs.readFile(reportsPath, 'utf-8');
      const reports = JSON.parse(data);
      const unreadCount = reports.filter((report: any) => !report.read).length;
      return NextResponse.json({ count: unreadCount });
    } catch (fileError) {
      // Dosya yoksa veya okunamazsa 0 döndür
      return NextResponse.json({ count: 0 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Bildirim sayısı alınamadı' }, { status: 500 });
  }
} 