import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const USERS_PATH = path.join(process.cwd(), 'public', 'users.json');
const LISTINGS_PATH = path.join(process.cwd(), 'public', 'listings.json');
const MESSAGES_PATH = path.join(process.cwd(), 'public', 'messages.json');

async function readData(filePath: string) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı ID gerekli' }, { status: 400 });
    }

    const users = await readData(USERS_PATH);
    const listings = await readData(LISTINGS_PATH);
    const messages = await readData(MESSAGES_PATH);

    // Kullanıcıyı bul
    const user = users.find((u: any) => u.email === userId);
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    // Kullanıcının ilanlarını filtrele
    const userListings = listings.filter((listing: any) => listing.email === userId);
    
    // İstatistikleri hesapla
    const totalListings = userListings.length;
    const activeListings = userListings.filter((listing: any) => listing.status === 'active').length;
    const totalViews = userListings.reduce((sum: number, listing: any) => sum + (listing.views || 0), 0);
    
    // Kullanıcının mesajlarını filtrele
    const userMessages = messages.filter((msg: any) => 
      msg.senderId === userId || msg.receiverId === userId
    );
    const totalMessages = userMessages.length;

    // Favoriler (örnek veri)
    const totalFavorites = Math.floor(Math.random() * 50) + 5;

    // Üyelik tarihi
    const memberSince = user.createdAt || user.joinedAt || new Date().toISOString();
    const lastActive = new Date().toISOString();

    const stats = {
      totalListings,
      activeListings,
      totalViews,
      totalMessages,
      totalFavorites,
      memberSince,
      lastActive
    };

    return NextResponse.json({
      success: true,
      ...stats
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    return NextResponse.json({ 
      error: 'Kullanıcı istatistikleri alınırken hata oluştu',
      totalListings: 0,
      activeListings: 0,
      totalViews: 0,
      totalMessages: 0,
      totalFavorites: 0,
      memberSince: '',
      lastActive: ''
    }, { status: 500 });
  }
} 