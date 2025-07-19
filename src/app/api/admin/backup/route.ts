import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import archiver from 'archiver';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';

const FILES = [
  'public/settings.json',
  'public/users.json',
  'public/reports.json',
  'public/messages.json',
  'public/listings.json',
  'prisma/dev.db',
];
const FOLDERS = [
  'public/images',
  'public/icons',
];

export async function GET() {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const chunks: Buffer[] = [];

  archive.on('data', chunk => chunks.push(chunk));

  // Dosyaları ekle
  for (const file of FILES) {
    try {
      const absPath = path.join(process.cwd(), file);
      await fs.access(absPath);
      archive.file(absPath, { name: file });
    } catch {}
  }
  // Klasörleri ekle
  for (const folder of FOLDERS) {
    try {
      const absPath = path.join(process.cwd(), folder);
      await fs.access(absPath);
      archive.directory(absPath, folder);
    } catch {}
  }
  await archive.finalize();
  // Tüm zip verisini topla
  const buffer = Buffer.concat(chunks);
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="site-backup.zip"',
    },
  });
} 