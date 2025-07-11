const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkListings() {
  try {
    console.log('Veritabanındaki ilanlar kontrol ediliyor...');
    
    const listings = await prisma.listing.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    console.log(`Toplam ${listings.length} ilan bulundu:`);
    
    listings.forEach((listing, index) => {
      console.log(`${index + 1}. ${listing.title} - ${listing.category} - Status: ${listing.status} - Premium: ${listing.isPremium}`);
    });

    // Status dağılımını kontrol et
    const statusCounts = {};
    listings.forEach(listing => {
      statusCounts[listing.status] = (statusCounts[listing.status] || 0) + 1;
    });

    console.log('\nStatus dağılımı:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`${status}: ${count} ilan`);
    });

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkListings(); 