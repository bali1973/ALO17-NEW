import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const LISTINGS_PATH = path.join(process.cwd(), 'public', 'listings.json');

async function readListings() {
  try {
    const data = await fs.readFile(LISTINGS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeListings(listings: any[]) {
  await fs.writeFile(LISTINGS_PATH, JSON.stringify(listings, null, 2), 'utf-8');
}

export async function GET() {
  const listings = await readListings();
  return NextResponse.json(listings);
}

export async function POST(req: Request) {
  const body = await req.json();
  // Simulate session: get user role from header (in real app, use auth middleware)
  const role = req.headers.get('x-user-role') || 'user';
  const listings = await readListings();
  const newId = listings.length > 0 ? Math.max(...listings.map((l: any) => Number(l.id) || 0)) + 1 : 1;
  const now = new Date().toISOString();
  const newListing = {
    ...body,
    id: newId,
    createdAt: now,
    status: role === 'admin' ? 'active' : 'pending',
    views: 0,
    isPremium: !!body.isPremium,
    premiumFeatures: body.premiumFeatures || [],
  };
  listings.push(newListing);
  await writeListings(listings);
  return NextResponse.json(newListing, { status: 201 });
} 