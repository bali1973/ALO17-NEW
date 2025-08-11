const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateListingStatus() {
  try {
    console.log('İlan durumları güncelleniyor...');
    
    // "approved" durumundaki ilanları "onaylandı" olarak güncelle
    const result = await prisma.listing.updateMany({
      where: {
        status: 'approved'
      },
      data: {
        status: 'onaylandı'
      }
    });
    
    console.log(`${result.count} ilan durumu "approved" -> "onaylandı" olarak güncellendi`);
    
    // Güncellenmiş ilanları listele
    const updatedListings = await prisma.listing.findMany({
      where: {
        status: 'onaylandı'
      },
      select: {
        id: true,
        title: true,
        status: true
      }
    });
    
    console.log('\nGüncellenmiş ilanlar:');
    updatedListings.forEach(listing => {
      console.log(`- ${listing.title} (${listing.status})`);
    });
    
  } catch (error) {
    console.error('Güncelleme hatası:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateListingStatus();
