const fs = require('fs');
const path = require('path');

// Kategoriler ve alt kategoriler
const categories = {
  'elektronik': {
    'telefon': {
      title: 'iPhone 14 Pro Max 256GB - Mükemmel Durumda',
      description: 'Sıfır, kutusunda iPhone 14 Pro Max 256GB. Faturalı ve garantili. Apple Türkiye garantisi mevcut.',
      price: 45000,
      city: 'İstanbul'
    },
    'tablet': {
      title: 'iPad Air 5. Nesil 64GB WiFi - Yeni Gibi',
      description: 'iPad Air 5. nesil, 64GB WiFi, Space Gray. 6 ay kullanıldı, kutulu ve garantili.',
      price: 18000,
      city: 'Ankara'
    },
    'bilgisayar': {
      title: 'MacBook Pro M2 13" 256GB - Profesyonel Kullanım',
      description: 'MacBook Pro M2, 13 inç, 256GB SSD, 8GB RAM. Grafik tasarım için kullanıldı, mükemmel durumda.',
      price: 35000,
      city: 'İzmir'
    },
    'televizyon': {
      title: 'Samsung 55" 4K Smart TV - 2023 Model',
      description: 'Samsung 55" 4K Ultra HD Smart TV, 2023 model. Netflix, YouTube dahil tüm uygulamalar mevcut.',
      price: 12000,
      city: 'Bursa'
    },
    'kamera': {
      title: 'Canon EOS R6 Mark II - Profesyonel Kamera',
      description: 'Canon EOS R6 Mark II, 24.2MP, 4K video. Profesyonel fotoğrafçılık için ideal.',
      price: 65000,
      city: 'İstanbul'
    },
    'kulaklik': {
      title: 'Sony WH-1000XM5 - Kablosuz Kulaklık',
      description: 'Sony WH-1000XM5, aktif gürültü önleme, 30 saat pil ömrü. Mükemmel ses kalitesi.',
      price: 8500,
      city: 'Ankara'
    },
    'oyun-konsolu': {
      title: 'PlayStation 5 - 1TB SSD - 2 Kol',
      description: 'PlayStation 5, 1TB SSD, 2 adet DualSense kol dahil. FIFA 24 ve God of War Ragnarök oyunları dahil.',
      price: 25000,
      city: 'İstanbul'
    },
    'yazici': {
      title: 'HP LaserJet Pro M404n - Lazer Yazıcı',
      description: 'HP LaserJet Pro M404n, monokrom lazer yazıcı. Ofis kullanımı için ideal, düşük maliyet.',
      price: 3500,
      city: 'İzmir'
    },
    'network': {
      title: 'TP-Link Archer C7 - AC1750 WiFi Router',
      description: 'TP-Link Archer C7, AC1750 dual-band WiFi router. Gigabit ethernet portları, USB port.',
      price: 1200,
      city: 'Bursa'
    },
    'aksesuar': {
      title: 'Apple Watch Series 8 45mm - GPS + Cellular',
      description: 'Apple Watch Series 8, 45mm, GPS + Cellular. Spor takibi, kalp ritmi ölçümü.',
      price: 15000,
      city: 'İstanbul'
    }
  },
  'ev-bahce': {
    'mobilya': {
      title: 'IKEA KALLAX Raf Ünitesi - 4x4 Beyaz',
      description: 'IKEA KALLAX raf ünitesi, 4x4, beyaz. Ev dekorasyonu için ideal, çok amaçlı kullanım.',
      price: 2500,
      city: 'İstanbul'
    },
    'dekorasyon': {
      title: 'Vintage Halı - 2x3 Metre - El Dokuma',
      description: 'Vintage el dokuma halı, 2x3 metre. Antik görünüm, ev dekorasyonu için mükemmel.',
      price: 3500,
      city: 'İzmir'
    },
    'bahce': {
      title: 'Bahçe Mobilyası Seti - 6 Kişilik',
      description: 'Bahçe mobilyası seti, 6 kişilik masa ve sandalyeler. Dayanıklı malzeme, uzun ömürlü.',
      price: 8000,
      city: 'Antalya'
    },
    'ev-aletleri': {
      title: 'Philips Airfryer XXL - Hava Fritözü',
      description: 'Philips Airfryer XXL, 1.4L kapasite. Sağlıklı pişirme, düşük yağ kullanımı.',
      price: 4500,
      city: 'Ankara'
    },
    'beyaz-esya': {
      title: 'Beko Buzdolabı - No Frost 450L',
      description: 'Beko buzdolabı, No Frost teknolojisi, 450L kapasite. A+ enerji sınıfı, sessiz çalışma.',
      price: 12000,
      city: 'İstanbul'
    },
    'mutfak-gerecleri': {
      title: 'Tefal Tencere Seti - 6 Parça',
      description: 'Tefal tencere seti, 6 parça, granit kaplama. Isı dağılımı teknolojisi, uzun ömürlü.',
      price: 2800,
      city: 'Bursa'
    }
  },
  'giyim': {
    'kadin-giyim': {
      title: 'Zara Kışlık Mont - Siyah - M Beden',
      description: 'Zara kışlık mont, siyah renk, M beden. Yün karışımlı, sıcak tutan, şık tasarım.',
      price: 1200,
      city: 'İstanbul'
    },
    'erkek-giyim': {
      title: 'Mavi Kot Pantolon - Slim Fit - 32/32',
      description: 'Mavi kot pantolon, slim fit, 32/32 beden. %98 pamuk, %2 elastan, rahat kullanım.',
      price: 450,
      city: 'Ankara'
    },
    'cocuk-giyim': {
      title: 'Çocuk Kışlık Mont Seti - 6-7 Yaş',
      description: 'Çocuk kışlık mont seti, 6-7 yaş. Su geçirmez, sıcak tutan, renkli tasarım.',
      price: 800,
      city: 'İzmir'
    },
    'ayakkabi-canta': {
      title: 'Nike Air Max 270 - Erkek Spor Ayakkabı',
      description: 'Nike Air Max 270, erkek spor ayakkabı, 42 numara. Rahat taban, günlük kullanım.',
      price: 1800,
      city: 'İstanbul'
    },
    'aksesuar': {
      title: 'Michael Kors Çanta - Crossbody - Siyah',
      description: 'Michael Kors çanta, crossbody model, siyah renk. Deri malzeme, şık tasarım.',
      price: 2500,
      city: 'Ankara'
    }
  },
  'anne-bebek': {
    'bebek-arabasi': {
      title: 'Chicco Bebek Arabası - 3'lü Set',
      description: 'Chicco bebek arabası, 3\'lü set. Ana koltuk, puset, oto koltuğu dahil.',
      price: 3500,
      city: 'İstanbul'
    },
    'bebek-giyim': {
      title: 'Bebek Kışlık Seti - 12-18 Ay',
      description: 'Bebek kışlık seti, 12-18 ay. Tulum, şapka, eldiven dahil, yumuşak kumaş.',
      price: 600,
      city: 'Ankara'
    },
    'bebek-oyuncaklari': {
      title: 'Fisher Price Bebek Oyuncağı - Müzikli',
      description: 'Fisher Price bebek oyuncağı, müzikli, renkli. 6+ ay için uygun, eğitici.',
      price: 350,
      city: 'İzmir'
    },
    'bebek-esyalari': {
      title: 'Bebek Beşik Seti - Ahşap - Beyaz',
      description: 'Bebek beşik seti, ahşap malzeme, beyaz renk. Çarşaf, yastık, battaniye dahil.',
      price: 2800,
      city: 'Bursa'
    }
  },
  'egitim-kurslar': {
    'yabanci-dil-kurslari': {
      title: 'İngilizce Kursu - B1 Seviyesi - 3 Ay',
      description: 'İngilizce kursu, B1 seviyesi, 3 ay süre. Deneyimli öğretmenler, küçük gruplar.',
      price: 2500,
      city: 'İstanbul'
    },
    'akademik-kurslar': {
      title: 'TYT-AYT Hazırlık Kursu - Matematik',
      description: 'TYT-AYT hazırlık kursu, matematik ağırlıklı. Deneyimli öğretmenler, test çözümleri.',
      price: 3500,
      city: 'Ankara'
    },
    'meslek-kurslari': {
      title: 'Web Tasarım Kursu - HTML/CSS/JavaScript',
      description: 'Web tasarım kursu, HTML/CSS/JavaScript. Sıfırdan başlayanlar için, sertifika dahil.',
      price: 4000,
      city: 'İzmir'
    },
    'spor-kurslari': {
      title: 'Yüzme Kursu - Yetişkinler İçin',
      description: 'Yüzme kursu, yetişkinler için. Deneyimli eğitmenler, güvenli ortam.',
      price: 1800,
      city: 'Antalya'
    },
    'muzik-kurslari': {
      title: 'Gitar Kursu - Başlangıç Seviyesi',
      description: 'Gitar kursu, başlangıç seviyesi. Birebir ders, esnek saatler.',
      price: 1200,
      city: 'İstanbul'
    },
    'sanat-kurslari': {
      title: 'Resim Kursu - Yağlı Boya Teknikleri',
      description: 'Resim kursu, yağlı boya teknikleri. Profesyonel eğitmen, malzeme dahil.',
      price: 2200,
      city: 'Ankara'
    }
  },
  'yemek-icecek': {
    'restoranlar': {
      title: 'Restoran İşletmesi - Merkezi Konum',
      description: 'Restoran işletmesi, merkezi konum, 80 kişilik kapasite. Tam donanımlı mutfak.',
      price: 150000,
      city: 'İstanbul'
    },
    'kafeler': {
      title: 'Kafe Franchise - Popüler Marka',
      description: 'Kafe franchise, popüler marka, yüksek ciro. Ekipman ve eğitim dahil.',
      price: 250000,
      city: 'Ankara'
    },
    'pastaneler': {
      title: 'Pastane İşletmesi - Tatlı Üretimi',
      description: 'Pastane işletmesi, tatlı üretimi, sipariş sistemi. Müşteri portföyü dahil.',
      price: 180000,
      city: 'İzmir'
    },
    'fast-food': {
      title: 'Fast Food Dükkanı - Ana Cadde',
      description: 'Fast food dükkanı, ana cadde üzeri, yüksek trafik. Tam donanımlı.',
      price: 120000,
      city: 'Bursa'
    },
    'tatli-pastane': {
      title: 'Tatlı Pastanesi - Özel Tarifler',
      description: 'Tatlı pastanesi, özel tarifler, sadık müşteri kitlesi. Ekipman dahil.',
      price: 95000,
      city: 'Antalya'
    },
    'lokantalar': {
      title: 'Geleneksel Lokanta - Aile İşletmesi',
      description: 'Geleneksel lokanta, aile işletmesi, 30 yıllık geçmiş. Tam donanımlı.',
      price: 200000,
      city: 'İstanbul'
    },
    'pilavcilar': {
      title: 'Pilav Dükkanı - Merkezi Konum',
      description: 'Pilav dükkanı, merkezi konum, yüksek ciro. Ekipman ve tarifler dahil.',
      price: 75000,
      city: 'Ankara'
    }
  },
  'turizm-gecelemeler': {
    'oteller': {
      title: 'Butik Otel - 12 Oda - Deniz Manzaralı',
      description: 'Butik otel, 12 oda, deniz manzaralı. Tam donanımlı, yüksek doluluk oranı.',
      price: 2500000,
      city: 'Antalya'
    },
    'pansiyonlar': {
      title: 'Pansiyon İşletmesi - 8 Oda - Merkezi',
      description: 'Pansiyon işletmesi, 8 oda, merkezi konum. Tam donanımlı, sabit müşteri.',
      price: 850000,
      city: 'İstanbul'
    },
    'kamp-alanlari': {
      title: 'Kamp Alanı - 50 Çadır Kapasitesi',
      description: 'Kamp alanı, 50 çadır kapasitesi, doğal ortam. Tesis ve ekipman dahil.',
      price: 450000,
      city: 'Muğla'
    },
    'tatil-koyleri': {
      title: 'Tatil Köyü - 100 Yatak - Havuzlu',
      description: 'Tatil köyü, 100 yatak, havuzlu. Tam donanımlı, yüksek sezon doluluğu.',
      price: 3500000,
      city: 'Antalya'
    },
    'turizm-seyahat': {
      title: 'Turizm Acentesi - Lisanslı - Merkezi',
      description: 'Turizm acentesi, lisanslı, merkezi konum. Müşteri portföyü dahil.',
      price: 180000,
      city: 'İstanbul'
    }
  },
  'saglik-guzellik': {
    'kisisel-bakim': {
      title: 'Kişisel Bakım Seti - Premium Markalar',
      description: 'Kişisel bakım seti, premium markalar. Cilt bakımı, makyaj ürünleri dahil.',
      price: 2500,
      city: 'İstanbul'
    },
    'kozmetik-urunleri': {
      title: 'Kozmetik Ürünleri - Parfüm Seti',
      description: 'Kozmetik ürünleri, parfüm seti. Premium markalar, orijinal ürünler.',
      price: 1800,
      city: 'Ankara'
    },
    'diyet-beslenme': {
      title: 'Diyet Programı - 3 Aylık - Online',
      description: 'Diyet programı, 3 aylık, online takip. Kişiye özel beslenme planı.',
      price: 3500,
      city: 'İzmir'
    },
    'guzellik-merkezi': {
      title: 'Güzellik Merkezi - Cihaz ve Ekipman',
      description: 'Güzellik merkezi, cihaz ve ekipman. Tam donanımlı, müşteri portföyü.',
      price: 450000,
      city: 'İstanbul'
    },
    'kuafor-berber': {
      title: 'Kuaför Salonu - Merkezi Konum',
      description: 'Kuaför salonu, merkezi konum, yüksek trafik. Ekipman ve müşteri dahil.',
      price: 180000,
      city: 'Ankara'
    },
    'spa-merkezi': {
      title: 'Spa Merkezi - Lüks Hizmetler',
      description: 'Spa merkezi, lüks hizmetler, VIP müşteri kitlesi. Tam donanımlı.',
      price: 650000,
      city: 'İstanbul'
    }
  },
  'sanat-hobi': {
    'el-isi-malzemeleri': {
      title: 'El İşi Malzemeleri Seti - Kapsamlı',
      description: 'El işi malzemeleri seti, kapsamlı. Nakış, örgü, takı yapımı malzemeleri.',
      price: 1200,
      city: 'İstanbul'
    },
    'hobi-kurslari': {
      title: 'Hobi Kursu - Seramik Yapımı',
      description: 'Hobi kursu, seramik yapımı. Malzeme dahil, deneyimli eğitmen.',
      price: 1800,
      city: 'Ankara'
    },
    'koleksiyon': {
      title: 'Pul Koleksiyonu - 1000 Adet - Nadir',
      description: 'Pul koleksiyonu, 1000 adet, nadir pullar. Katalog ve albüm dahil.',
      price: 8500,
      city: 'İzmir'
    },
    'muzik-aletleri': {
      title: 'Yamaha Piyano - Dijital - 88 Tuş',
      description: 'Yamaha piyano, dijital, 88 tuş. Profesyonel ses kalitesi, kulaklık dahil.',
      price: 25000,
      city: 'İstanbul'
    },
    'resim-malzemeleri': {
      title: 'Resim Malzemeleri Seti - Profesyonel',
      description: 'Resim malzemeleri seti, profesyonel. Yağlı boya, fırça, tuval dahil.',
      price: 2800,
      city: 'Ankara'
    }
  },
  'sporlar-oyunlar-eglenceler': {
    'spor-aktiviteleri': {
      title: 'Fitness Salonu - Tam Donanımlı',
      description: 'Fitness salonu, tam donanımlı, merkezi konum. Müşteri portföyü dahil.',
      price: 350000,
      city: 'İstanbul'
    },
    'takim-sporlari': {
      title: 'Futbol Sahası - Suni Çim - Aydınlatmalı',
      description: 'Futbol sahası, suni çim, aydınlatmalı. Profesyonel standartlar.',
      price: 850000,
      city: 'Ankara'
    },
    'video-oyunlari': {
      title: 'Video Oyunları Koleksiyonu - 500 Oyun',
      description: 'Video oyunları koleksiyonu, 500 oyun. PlayStation, Xbox, Nintendo.',
      price: 15000,
      city: 'İstanbul'
    },
    'oyun-konsollari': {
      title: 'Xbox Series X - 1TB - 2 Kol',
      description: 'Xbox Series X, 1TB, 2 kol dahil. Game Pass aboneliği mevcut.',
      price: 22000,
      city: 'İzmir'
    }
  },
  'is': {
    'tam-zamanli': {
      title: 'Yazılım Geliştirici - Tam Zamanlı',
      description: 'Yazılım geliştirici pozisyonu, tam zamanlı. React, Node.js deneyimi gerekli.',
      price: 25000,
      city: 'İstanbul'
    },
    'yari-zamanli': {
      title: 'Öğrenci Asistanı - Yarı Zamanlı',
      description: 'Öğrenci asistanı, yarı zamanlı. Pazarlama bölümü, esnek saatler.',
      price: 8000,
      city: 'Ankara'
    },
    'freelance': {
      title: 'Grafik Tasarımcı - Freelance',
      description: 'Grafik tasarımcı, freelance. Logo, kurumsal kimlik tasarımı.',
      price: 15000,
      city: 'İzmir'
    },
    'staj': {
      title: 'Muhasebe Stajyeri - 3 Aylık',
      description: 'Muhasebe stajyeri, 3 aylık. Büyük firma, referans mektubu.',
      price: 5000,
      city: 'Bursa'
    },
    'i-s-ariyorum': {
      title: 'İş Arıyorum - İnşaat Mühendisi',
      description: 'İş arıyorum, inşaat mühendisi. 5 yıl deneyim, proje yönetimi.',
      price: 0,
      city: 'İstanbul'
    }
  },
  'ucretsiz-gel-al': {
    'mobilya': {
      title: 'Ücretsiz Mobilya - Koltuk Takımı',
      description: 'Ücretsiz mobilya, koltuk takımı. 3+1, iyi durumda, gel al.',
      price: 0,
      city: 'İstanbul'
    },
    'oyuncak': {
      title: 'Ücretsiz Oyuncak - Çocuk Oyuncakları',
      description: 'Ücretsiz oyuncak, çocuk oyuncakları. 3-6 yaş, temiz durumda.',
      price: 0,
      city: 'Ankara'
    },
    'kitap': {
      title: 'Ücretsiz Kitap - Roman Koleksiyonu',
      description: 'Ücretsiz kitap, roman koleksiyonu. 50 adet, iyi durumda.',
      price: 0,
      city: 'İzmir'
    },
    'giyim': {
      title: 'Ücretsiz Giyim - Kadın Giyim',
      description: 'Ücretsiz giyim, kadın giyim. M-L beden, temiz durumda.',
      price: 0,
      city: 'Bursa'
    },
    'diger': {
      title: 'Ücretsiz Eşya - Ev Eşyaları',
      description: 'Ücretsiz eşya, ev eşyaları. Çeşitli eşyalar, gel al.',
      price: 0,
      city: 'Antalya'
    }
  },
  'hizmetler': {
    'arac-hizmetleri': {
      title: 'Araç Yıkama Hizmeti - Mobil',
      description: 'Araç yıkama hizmeti, mobil. Ev/ofis adresinize gelir, profesyonel.',
      price: 150,
      city: 'İstanbul'
    },
    'ev-hizmetleri': {
      title: 'Temizlik Hizmeti - Ev Ofis',
      description: 'Temizlik hizmeti, ev ofis. Güvenilir personel, referanslı.',
      price: 200,
      city: 'Ankara'
    },
    'egitim-hizmetleri': {
      title: 'Özel Ders - Matematik Fizik',
      description: 'Özel ders, matematik fizik. Üniversite öğrencisi, deneyimli.',
      price: 300,
      city: 'İzmir'
    },
    'saglik-hizmetleri': {
      title: 'Masaj Terapisi - Profesyonel',
      description: 'Masaj terapisi, profesyonel. Ev/ofis adresinize gelir, lisanslı.',
      price: 400,
      city: 'İstanbul'
    },
    'tasarim-hizmetleri': {
      title: 'Web Tasarım Hizmeti - Responsive',
      description: 'Web tasarım hizmeti, responsive. SEO uyumlu, modern tasarım.',
      price: 5000,
      city: 'Ankara'
    },
    'teknik-hizmetler': {
      title: 'Bilgisayar Tamir Hizmeti',
      description: 'Bilgisayar tamir hizmeti. Ev/ofis adresinize gelir, garantili.',
      price: 250,
      city: 'İzmir'
    },
    'temizlik-hizmetleri': {
      title: 'Ofis Temizlik Hizmeti - Günlük',
      description: 'Ofis temizlik hizmeti, günlük. Güvenilir firma, sigortalı.',
      price: 800,
      city: 'İstanbul'
    },
    'web-hizmetleri': {
      title: 'Web Sitesi Yönetimi - Aylık',
      description: 'Web sitesi yönetimi, aylık. İçerik güncelleme, bakım.',
      price: 1500,
      city: 'Ankara'
    },
    'yazilim-hizmetleri': {
      title: 'Yazılım Geliştirme - Özel Proje',
      description: 'Yazılım geliştirme, özel proje. Mobil uygulama, web uygulaması.',
      price: 25000,
      city: 'İzmir'
    }
  },
  'diger': {
    'diger': {
      title: 'Çeşitli Eşyalar - Karma Koleksiyon',
      description: 'Çeşitli eşyalar, karma koleksiyon. Ev ofis eşyaları, dekorasyon.',
      price: 500,
      city: 'İstanbul'
    }
  }
};

// Mevcut listings.json dosyasını oku
const listingsPath = path.join(__dirname, 'public', 'listings.json');
let existingListings = [];

try {
  const listingsData = fs.readFileSync(listingsPath, 'utf-8');
  existingListings = JSON.parse(listingsData);
} catch (error) {
  console.log('Mevcut listings.json dosyası bulunamadı, yeni oluşturulacak.');
}

// Yeni ilanları oluştur
const newListings = [];
let nextId = existingListings.length > 0 ? Math.max(...existingListings.map(l => l.id)) + 1 : 1;

for (const [category, subcategories] of Object.entries(categories)) {
  for (const [subcategory, listingData] of Object.entries(subcategories)) {
    const newListing = {
      id: nextId++,
      title: listingData.title,
      description: listingData.description,
      price: listingData.price,
      category: category,
      subcategory: subcategory,
      location: listingData.city,
      isPremium: Math.random() > 0.7, // %30 premium
      user: 'Demo Kullanıcı',
      email: 'demo@alo17.com',
      userRole: 'user',
      createdAt: new Date().toISOString(),
      status: Math.random() > 0.3 ? 'active' : 'pending', // %70 aktif, %30 beklemede
      views: Math.floor(Math.random() * 1000),
      premiumFeatures: [],
      condition: 'İyi',
      phone: '0555 123 45 67',
      phoneVisibility: 'public'
    };
    
    newListings.push(newListing);
  }
}

// Mevcut ilanlarla birleştir
const allListings = [...existingListings, ...newListings];

// Dosyaya yaz
fs.writeFileSync(listingsPath, JSON.stringify(allListings, null, 2));

console.log(`✅ ${newListings.length} yeni örnek ilan oluşturuldu!`);
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