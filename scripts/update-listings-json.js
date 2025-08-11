const fs = require('fs');
const path = require('path');

async function updateListingsJson() {
  try {
    console.log('listings.json dosyası güncelleniyor...');
    
    const filePath = path.join(process.cwd(), 'public', 'listings.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const listings = JSON.parse(data);
    
    console.log(`${listings.length} ilan bulundu`);
    
    let updatedCount = 0;
    
    // Her ilanın status alanını güncelle
    listings.forEach((listing, index) => {
      if (listing.status === 'approved') {
        listings[index].status = 'onaylandı';
        updatedCount++;
        console.log(`İlan "${listing.title}" güncellendi: approved -> onaylandı`);
      }
    });
    
    // Güncellenmiş veriyi dosyaya yaz
    fs.writeFileSync(filePath, JSON.stringify(listings, null, 2), 'utf-8');
    
    console.log(`\nToplam ${updatedCount} ilan durumu güncellendi`);
    console.log('listings.json dosyası başarıyla güncellendi!');
    
  } catch (error) {
    console.error('Güncelleme hatası:', error);
  }
}

updateListingsJson();
