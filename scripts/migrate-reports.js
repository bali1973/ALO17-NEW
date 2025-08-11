const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function migrateReports() {
  try {
    console.log('Raporlar veritabanına aktarılıyor...');
    
    // Mevcut raporları oku
    const reportsPath = path.join(process.cwd(), 'public', 'raporlar.json');
    const reportsData = JSON.parse(fs.readFileSync(reportsPath, 'utf-8'));
    
    console.log(`${reportsData.length} rapor bulundu`);
    
    // Her rapor için veritabanına ekle
    for (const report of reportsData) {
      // Örnek kullanıcı bul (gerçek uygulamada bu kullanıcı ID'leri doğru olmalı)
      const user = await prisma.user.findFirst();
      
      const reportData = {
        type: report.type || 'Genel Şikayet',
        subject: report.subject || '',
        description: report.description || '',
        status: report.status || 'Açık',
        priority: 'medium', // Varsayılan öncelik
        listingId: null, // Mevcut verilerde listingId yok
        listingTitle: null,
        reportedUserEmail: null,
        userId: user ? user.id : null
      };
      
      await prisma.report.create({
        data: reportData
      });
      
      console.log(`Rapor "${report.subject}" eklendi`);
    }
    
    console.log('Tüm raporlar başarıyla aktarıldı!');
    
  } catch (error) {
    console.error('Migration hatası:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateReports();
