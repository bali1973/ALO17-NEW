const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./prisma/dev.db"
    },
  },
});

async function checkStatus() {
  try {
    console.log('🔍 Veritabanındaki ilanların status\'larını kontrol ediliyor...\n');

    // Tüm ilanları getir
    const allListings = await prisma.listing.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`📊 Toplam ilan sayısı: ${allListings.length}\n`);

    // Status'lara göre grupla
    const byStatus = {};
    allListings.forEach(listing => {
      if (!byStatus[listing.status]) {
        byStatus[listing.status] = [];
      }
      byStatus[listing.status].push(listing);
    });

    console.log('📋 Status\'lara göre dağılım:');
    Object.keys(byStatus).forEach(status => {
      console.log(`  ${status}: ${byStatus[status].length} ilan`);
      byStatus[status].forEach(listing => {
        console.log(`    - ${listing.title} (${listing.category})`);
      });
    });

    console.log('\n✅ Kontrol tamamlandı!');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStatus(); 