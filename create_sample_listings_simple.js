const fs = require('fs');
const path = require('path');

// Basit örnek ilanlar
const sampleListings = [
  // Elektronik
  {
    id: 100,
    title: 'iPhone 14 Pro Max 256GB - Mükemmel Durumda',
    description: 'Sıfır, kutusunda iPhone 14 Pro Max 256GB. Faturalı ve garantili.',
    price: 45000,
    category: 'elektronik',
    subcategory: 'telefon',
    location: 'İstanbul',
    status: 'pending',
    user: 'Demo Kullanıcı',
    email: 'demo@alo17.com',
    userRole: 'user',
    createdAt: new Date().toISOString(),
    views: 156,
    isPremium: false,
    premiumFeatures: []
  },
  {
    id: 101,
    title: 'MacBook Pro M2 13" 256GB - Profesyonel Kullanım',
    description: 'MacBook Pro M2, 13 inç, 256GB SSD, 8GB RAM. Grafik tasarım için kullanıldı.',
    price: 35000,
    category: 'elektronik',
    subcategory: 'bilgisayar',
    location: 'Ankara',
    status: 'active',
    user: 'Demo Kullanıcı',
    email: 'demo@alo17.com',
    userRole: 'user',
    createdAt: new Date().toISOString(),
    views: 89,
    isPremium: true,
    premiumFeatures: ['featured']
  },
  // Ev & Bahçe
  {
    id: 102,
    title: 'IKEA KALLAX Raf Ünitesi - 4x4 Beyaz',
    description: 'IKEA KALLAX raf ünitesi, 4x4, beyaz. Ev dekorasyonu için ideal.',
    price: 2500,
    category: 'ev-bahce',
    subcategory: 'mobilya',
    location: 'İzmir',
    status: 'active',
    user: 'Demo Kullanıcı',
    email: 'demo@alo17.com',
    userRole: 'user',
    createdAt: new Date().toISOString(),
    views: 45,
    isPremium: false,
    premiumFeatures: []
  },
  // Giyim
  {
    id: 103,
    title: 'Zara Kışlık Mont - Siyah - M Beden',
    description: 'Zara kışlık mont, siyah renk, M beden. Yün karışımlı, sıcak tutan.',
    price: 1200,
    category: 'giyim',
    subcategory: 'kadin-giyim',
    location: 'Bursa',
    status: 'pending',
    user: 'Demo Kullanıcı',
    email: 'demo@alo17.com',
    userRole: 'user',
    createdAt: new Date().toISOString(),
    views: 23,
    isPremium: false,
    premiumFeatures: []
  },
  // Anne & Bebek
  {
    id: 104,
    title: 'Chicco Bebek Arabası - 3\'lü Set',
    description: 'Chicco bebek arabası, 3\'lü set. Ana koltuk, puset, oto koltuğu dahil.',
    price: 3500,
    category: 'anne-bebek',
    subcategory: 'bebek-arabasi',
    location: 'İstanbul',
    status: 'active',
    user: 'Demo Kullanıcı',
    email: 'demo@alo17.com',
    userRole: 'user',
    createdAt: new Date().toISOString(),
    views: 67,
    isPremium: false,
    premiumFeatures: []
  },
  // Eğitim & Kurslar
  {
    id: 105,
    title: 'İngilizce Kursu - B1 Seviyesi - 3 Ay',
    description: 'İngilizce kursu, B1 seviyesi, 3 ay süre. Deneyimli öğretmenler.',
    price: 2500,
    category: 'egitim-kurslar',
    subcategory: 'yabanci-dil-kurslari',
    location: 'Ankara',
    status: 'active',
    user: 'Demo Kullanıcı',
    email: 'demo@alo17.com',
    userRole: 'user',
    createdAt: new Date().toISOString(),
    views: 34,
    isPremium: true,
    premiumFeatures: ['featured', 'urgent']
  },
  // Yemek & İçecek
  {
    id: 106,
    title: 'Restoran İşletmesi - Merkezi Konum',
    description: 'Restoran işletmesi, merkezi konum, 80 kişilik kapasite. Tam donanımlı.',
    price: 150000,
    category: 'yemek-icecek',
    subcategory: 'restoranlar',
    location: 'İstanbul',
    status: 'pending',
    user: 'Demo Kullanıcı',
    email: 'demo@alo17.com',
    userRole: 'user',
    createdAt: new Date().toISOString(),
    views: 12,
    isPremium: false,
    premiumFeatures: []
  },
  // Turizm & Gecelemeler
  {
    id: 107,
    title: 'Butik Otel - 12 Oda - Deniz Manzaralı',
    description: 'Butik otel, 12 oda, deniz manzaralı. Tam donanımlı, yüksek doluluk.',
    price: 2500000,
    category: 'turizm-gecelemeler',
    subcategory: 'oteller',
    location: 'Antalya',
    status: 'active',
    user: 'Demo Kullanıcı',
    email: 'demo@alo17.com',
    userRole: 'user',
    createdAt: new Date().toISOString(),
    views: 89,
    isPremium: true,
    premiumFeatures: ['featured']
  },
  // Sağlık & Güzellik
  {
    id: 108,
    title: 'Güzellik Merkezi - Cihaz ve Ekipman',
    description: 'Güzellik merkezi, cihaz ve ekipman. Tam donanımlı, müşteri portföyü.',
    price: 450000,
    category: 'saglik-guzellik',
    subcategory: 'guzellik-merkezi',
    location: 'İzmir',
    status: 'pending',
    user: 'Demo Kullanıcı',
    email: 'demo@alo17.com',
    userRole: 'user',
    createdAt: new Date().toISOString(),
    views: 18,
    isPremium: false,
    premiumFeatures: []
  },
  // Sanat & Hobi
  {
    id: 109,
    title: 'Yamaha Piyano - Dijital - 88 Tuş',
    description: 'Yamaha piyano, dijital, 88 tuş. Profesyonel ses kalitesi, kulaklık dahil.',
    price: 25000,
    category: 'sanat-hobi',
    subcategory: 'muzik-aletleri',
    location: 'İstanbul',
    status: 'active',
    user: 'Demo Kullanıcı',
    email: 'demo@alo17.com',
    userRole: 'user',
    createdAt: new Date().toISOString(),
    views: 56,
    isPremium: false,
    premiumFeatures: []
  },
  // Sporlar & Oyunlar
  {
    id: 110,
    title: 'Fitness Salonu - Tam Donanımlı',
    description: 'Fitness salonu, tam donanımlı, merkezi konum. Müşteri portföyü dahil.',
    price: 350000,
    category: 'sporlar-oyunlar-eglenceler',
    subcategory: 'spor-aktiviteleri',
    location: 'Ankara',
    status: 'active',
    user: 'Demo Kullanıcı',
    email: 'demo@alo17.com',
    userRole: 'user',
    createdAt: new Date().toISOString(),
    views: 78,
    isPremium: true,
    premiumFeatures: ['featured']
  },
  // İş
  {
    id: 111,
    title: 'Yazılım Geliştirici - Tam Zamanlı',
    description: 'Yazılım geliştirici pozisyonu, tam zamanlı. React, Node.js deneyimi gerekli.',
    price: 25000,
    category: 'is',
    subcategory: 'tam-zamanli',
    location: 'İstanbul',
    status: 'pending',
    user: 'Demo Kullanıcı',
    email: 'demo@alo17.com',
    userRole: 'user',
    createdAt: new Date().toISOString(),
    views: 45,
    isPremium: false,
    premiumFeatures: []
  },
  // Ücretsiz Gel-Al
  {
    id: 112,
    title: 'Ücretsiz Mobilya - Koltuk Takımı',
    description: 'Ücretsiz mobilya, koltuk takımı. 3+1, iyi durumda, gel al.',
    price: 0,
    category: 'ucretsiz-gel-al',
    subcategory: 'mobilya',
    location: 'İzmir',
    status: 'active',
    user: 'Demo Kullanıcı',
    email: 'demo@alo17.com',
    userRole: 'user',
    createdAt: new Date().toISOString(),
    views: 123,
    isPremium: false,
    premiumFeatures: []
  },
  // Hizmetler
  {
    id: 113,
    title: 'Web Tasarım Hizmeti - Responsive',
    description: 'Web tasarım hizmeti, responsive. SEO uyumlu, modern tasarım.',
    price: 5000,
    category: 'hizmetler',
    subcategory: 'tasarim-hizmetleri',
    location: 'Bursa',
    status: 'active',
    user: 'Demo Kullanıcı',
    email: 'demo@alo17.com',
    userRole: 'user',
    createdAt: new Date().toISOString(),
    views: 29,
    isPremium: false,
    premiumFeatures: []
  },
  // Diğer
  {
    id: 114,
    title: 'Çeşitli Eşyalar - Karma Koleksiyon',
    description: 'Çeşitli eşyalar, karma koleksiyon. Ev ofis eşyaları, dekorasyon.',
    price: 500,
    category: 'diger',
    subcategory: 'diger',
    location: 'Antalya',
    status: 'active',
    user: 'Demo Kullanıcı',
    email: 'demo@alo17.com',
    userRole: 'user',
    createdAt: new Date().toISOString(),
    views: 15,
    isPremium: false,
    premiumFeatures: []
  }
];

// Mevcut listings.json dosyasını oku
const listingsPath = path.join(__dirname, 'public', 'listings.json');
let existingListings = [];

try {
  const listingsData = fs.readFileSync(listingsPath, 'utf-8');
  existingListings = JSON.parse(listingsData);
} catch (error) {
  console.log('Mevcut listings.json dosyası bulunamadı, yeni oluşturulacak.');
}

// Yeni ilanları ekle
const allListings = [...existingListings, ...sampleListings];

// Dosyaya yaz
fs.writeFileSync(listingsPath, JSON.stringify(allListings, null, 2));

console.log(`✅ ${sampleListings.length} yeni örnek ilan oluşturuldu!`);
console.log(`📊 Toplam ilan sayısı: ${allListings.length}`);
console.log(`📁 Dosya konumu: ${listingsPath}`);

// Kategori bazında istatistik
const categoryStats = {};
allListings.forEach(listing => {
  if (!categoryStats[listing.category]) {
    categoryStats[listing.category] = 0;
  }
  categoryStats[listing.category]++;
});

console.log('\n📈 Kategori Bazında İlan Dağılımı:');
for (const [category, count] of Object.entries(categoryStats)) {
  console.log(`  ${category}: ${count} ilan`);
} 