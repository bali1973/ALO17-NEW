import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Report } from '@prisma/client';

export default function BildirimlerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">İlan Bildirimleri</h1>
      <div className="text-gray-500">Statik export için örnek bildirimler sayfası.</div>
    </div>
  );
} 