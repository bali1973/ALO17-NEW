console.log('🚀 Test script başlatılıyor...');

const { PrismaClient } = require('@prisma/client');

console.log('📦 PrismaClient import edildi');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_0PrdfMInuKe6@ep-flat-butterfly-a814z8r8-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
});

console.log('🔧 PrismaClient oluşturuldu');

async function testConnection() {
  try {
    console.log('🔗 Prisma ile veritabanına bağlanmaya çalışılıyor...');
    
    // Bağlantıyı test et
    await prisma.$connect();
    console.log('✅ Prisma bağlantısı başarılı!');
    
    // Basit bir sorgu çalıştır
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`;
    console.log('📅 Sunucu zamanı:', result[0].current_time);
    
    await prisma.$disconnect();
    console.log('🔌 Bağlantı kapatıldı.');
  } catch (error) {
    console.error('❌ Bağlantı hatası:', error.message);
    console.error('🔍 Detaylar:', error);
  } finally {
    console.log('🏁 Test tamamlandı');
  }
}

console.log('🔄 Test fonksiyonu çağrılıyor...');
testConnection(); 