import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Tüm kategoriler ve alt kategoriler siliniyor...');
  await prisma.subCategory.deleteMany({});
  await prisma.category.deleteMany({});
  console.log('Temizlendi. Şimdi seed başlıyor...');

  console.log('🌱 Seeding database...')

  // Helper function to create slugs
  const slugify = (text: string) => {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')

    return text.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
  }

  async function createSubCategories(subcategories: any[], categoryId: string, parentId: string | null) {
    for (const sub of subcategories) {
      const subName = typeof sub === 'string' ? sub : sub.name;
      const subSlug = slugify(subName);

      // Find existing subcategory to prevent duplicates within the same main category
      let existingSub = await prisma.subCategory.findFirst({
        where: { slug: subSlug, categoryId: categoryId }
      });

      if (existingSub) {
        // If it exists, update its parentId
        existingSub = await prisma.subCategory.update({
          where: { id: existingSub.id },
          data: { parentId: parentId || null }
        });
        console.log(`  ${parentId ? '  ' : ''}Alt kategori güncellendi:`, existingSub.name);
      } else {
        // If it doesn't exist, create it
        existingSub = await prisma.subCategory.create({
          data: {
            name: subName,
            slug: subSlug,
            categoryId,
            parentId: parentId || null,
          },
        });
        console.log(`  ${parentId ? '  ' : ''}Alt kategori eklendi:`, existingSub.name);
      }

      if (typeof sub === 'object' && sub.subs && sub.subs.length > 0) {
        await createSubCategories(sub.subs, categoryId, existingSub.id);
      }
    }
  }

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.log('🔧 DATABASE_URL not found, using SQLite for testing...')
  }

  try {
    // Clear existing data
    await prisma.coupon.deleteMany()
    await prisma.userFavorite.deleteMany()
    await prisma.listing.deleteMany()
    await prisma.user.deleteMany()

    // Create users
    const adminPassword = await hash('admin123', 12)
    const userPassword = await hash('user123', 12)
    const testPassword = await hash('test123', 12)

    const admin = await prisma.user.create({
      data: {
        email: 'admin@alo17.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'admin',
      },
    })

    const user = await prisma.user.create({
      data: {
        email: 'user@alo17.com',
        name: 'Normal User',
        password: userPassword,
      },
    })

    const testUser = await prisma.user.create({
      data: {
        email: 'test@alo17.com',
        name: 'Test User',
        password: testPassword,
      },
    })

    const categoriesSeed = [
      {
        name: 'Elektronik', slug: 'elektronik', subs: [
          { name: 'Bilgisayar', subs: ['Dizüstü Bilgisayar', 'Masaüstü Bilgisayar', 'Bilgisayar Bileşenleri', 'Ağ Ürünleri'] },
          { name: 'Telefon', subs: ['Akıllı Telefonlar', 'Tuşlu Telefonlar', 'Telefon Aksesuarları'] },
          { name: 'Televizyon & Ses Sistemleri', subs: ['Televizyonlar', 'Ses Sistemleri', 'Projeksiyon'] },
          'Tablet',
          'Kulaklık',
          'Kamera',
          'Oyun Konsolu',
        ]
      },
      {
        name: 'Giyim', slug: 'giyim', subs: [
          { name: 'Kadın Giyim', subs: ['Elbise', 'Ayakkabı', 'Çanta', 'Aksesuar', 'Dış Giyim'] },
          { name: 'Erkek Giyim', subs: ['Tişört', 'Gömlek', 'Pantolon', 'Ayakkabı', 'Ceket'] },
          { name: 'Çocuk Giyim', subs: ['Kız Çocuk', 'Erkek Çocuk', 'Bebek Giyim'] },
        ]
      },
      { name: 'Ev & Bahçe', slug: 'ev-bahce', subs: [
        'Mobilya',
        'Dekorasyon',
        'Bahçe Ürünleri',
        'Halı',
        'Aydınlatma',
        'Mutfak',
        'Banyo'
      ] },
      { name: 'Sporlar, Oyunlar ve Eğlenceler', slug: 'sporlar-oyunlar-eglenceler', subs: ['Takım Sporları', 'Bireysel Sporlar', 'Oyun Konsolları'] },
      { name: 'Anne & Bebek', slug: 'anne-bebek', subs: ['Bebek Arabası', 'Bebek Giyim', 'Bebek Oyuncakları'] },
      { name: 'Eğitim & Kurslar', slug: 'egitim-kurslar', subs: ['Yabancı Dil Kursları', 'Akademik Kurslar', 'Sertifika Programları'] },
      { name: 'Yemek & İçecek', slug: 'yemek-icecek', subs: ['Restoranlar', 'Kafeler', 'Pastaneler'] },
      { name: 'Turizm & Gecelemeler', slug: 'turizm-gecelemeler', subs: ['Oteller', 'Pansiyonlar', 'Kamp Alanları'] },
      { name: 'Hizmetler', slug: 'hizmetler', subs: ['Temizlik', 'Nakliyat', 'Tadilat'] },
      { name: 'Araçlar', slug: 'araclar', subs: ['Otomobil', 'Motosiklet', 'Ticari Araçlar'] },
      { name: 'Evcil Hayvanlar', slug: 'evcil-hayvanlar', subs: ['Köpek', 'Kedi', 'Kuş'] },
      { name: 'Sanat & Koleksiyon', slug: 'sanat-koleksiyon', subs: ['Tablolar', 'Antikalar', 'Koleksiyon Ürünleri'] },
    ];

    for (const cat of categoriesSeed) {
      console.log('Kategori ekleniyor:', cat.name);
      const main = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: { name: cat.name, slug: cat.slug },
      });

      if (cat.subs && cat.subs.length > 0) {
        await createSubCategories(cat.subs, main.id, null);
      }
    }

    // Create listings
    await prisma.listing.create({
      data: {
        title: 'iPhone 14 Pro Max - Yeni',
        description: '128GB, Uzay Grisi, Garantili, Kutusunda',
        price: 45000,
        images: '["/images/listings/iphone-14-pro-max-1.jpg"]',
        features: '["256GB", "Uzay Grisi", "Garantili"]',
        condition: 'Yeni',
        location: 'İstanbul',
        category: 'elektronik',
        subcategory: 'telefon',
        brand: 'Apple',
        model: 'iPhone 14 Pro Max',
        year: '2023',
        isPremium: true,
        status: 'active',
        userId: admin.id,
      },
    })

    await prisma.listing.create({
      data: {
        title: 'MacBook Air M2 - İkinci El',
        description: '13 inç, 8GB RAM, 256GB SSD, Mükemmel durumda',
        price: 25000,
        images: '["/images/placeholder.svg"]',
        features: '["8GB RAM", "256GB SSD", "M2 Chip"]',
        condition: 'İkinci El',
        location: 'Ankara',
        category: 'elektronik',
        subcategory: 'bilgisayar',
        brand: 'Apple',
        model: 'MacBook Air M2',
        year: '2022',
        isPremium: false,
        status: 'active',
        userId: user.id,
      },
    })

    await prisma.listing.create({
      data: {
        title: 'Hemenalgetir Toptan Ürünler',
        description: 'Toptan fiyatına ürünler. Hemenalgetir ile hızlı ve güvenilir alışveriş!\nİletişim: 05414042404',
        price: 1000,
        images: '["/images/placeholder.svg"]',
        features: '["Toptan Satış", "Güvenli Teslimat"]',
        condition: 'Yeni',
        location: 'İstanbul',
        category: 'yemek-icecek',
        subcategory: 'gida',
        brand: 'Hemenalgetir',
        model: '',
        year: '2024',
        isPremium: true,
        status: 'active',
        userId: admin.id,
      },
    })

    // Create coupon
    await prisma.coupon.create({
      data: {
        code: 'WELCOME10',
        discount: 10,
        maxUses: 100,
        expiresAt: new Date('2025-12-31'),
      },
    })

    // Premium Planlar
    const premiumPlans = [
      { name: 'Ücretsiz Plan', key: 'free', price: 0, days: 30 },
      { name: '30 Gün Premium', key: '30days', price: 99, days: 30 },
      { name: '90 Gün Premium', key: '90days', price: 249, days: 90 },
      { name: '365 Gün Premium', key: '365days', price: 799, days: 365 },
    ];

    for (const plan of premiumPlans) {
      await prisma.premiumPlan.upsert({
        where: { key: plan.key },
        update: plan,
        create: plan,
      });
    }

    // Test kullanıcıları oluştur
    const user1 = await prisma.user.upsert({
      where: { email: 'test1@alo17.com' },
      update: {},
      create: {
        email: 'test1@alo17.com',
        name: 'Test Kullanıcı 1',
        password: 'hashedpassword123',
        role: 'USER'
      },
    })

    const user2 = await prisma.user.upsert({
      where: { email: 'test2@alo17.com' },
      update: {},
      create: {
        email: 'test2@alo17.com',
        name: 'Test Kullanıcı 2',
        password: 'hashedpassword123',
        role: 'USER'
      },
    })

    // Eğitim-kurslar kategorisinde test ilanları oluştur
    const egitimIlanlari = [
      {
        title: 'İngilizce Kursu - Başlangıç Seviyesi',
        description: 'A1-A2 seviyesi İngilizce kursu, haftada 2 gün, 3 ay süre. Deneyimli öğretmenlerle birebir ders.',
        price: 1500,
        category: 'egitim-kurslar',
        subcategory: 'dil-kurslari',
        condition: 'Yeni',
        location: 'İstanbul',
        images: JSON.stringify(['/images/listings/ingilizce-kursu.jpg']),
        features: JSON.stringify(['Sertifika', 'Online Destek', 'Materyal Dahil']),
        userId: user1.id,
        isPremium: true,
        status: 'active',
        views: 25
      },
      {
        title: 'Matematik Özel Ders',
        description: 'Lise ve üniversite öğrencileri için matematik özel ders. TYT, AYT, KPSS hazırlık.',
        price: 200,
        category: 'egitim-kurslar',
        subcategory: 'ozel-dersler',
        condition: 'Yeni',
        location: 'Ankara',
        images: JSON.stringify(['/images/listings/matematik-ders.jpg']),
        features: JSON.stringify(['Birebir Ders', 'Online Seçeneği', 'Esnek Saat']),
        userId: user2.id,
        isPremium: false,
        status: 'active',
        views: 15
      },
      {
        title: 'Gitar Kursu - Başlangıç',
        description: 'Gitar öğrenmek isteyenler için temel kurs. Akustik ve elektro gitar dersleri.',
        price: 800,
        category: 'egitim-kurslar',
        subcategory: 'muzik-kurslari',
        condition: 'Yeni',
        location: 'İzmir',
        images: JSON.stringify(['/images/listings/gitar-kursu.jpg']),
        features: JSON.stringify(['Gitar Dahil', 'Grup Dersi', 'Performans Gecesi']),
        userId: user1.id,
        isPremium: true,
        status: 'active',
        views: 30
      },
      {
        title: 'Yazılım Geliştirme Kursu',
        description: 'Web geliştirme kursu: HTML, CSS, JavaScript, React. Sıfırdan başlayanlar için.',
        price: 3000,
        category: 'egitim-kurslar',
        subcategory: 'teknoloji-kurslari',
        condition: 'Yeni',
        location: 'İstanbul',
        images: JSON.stringify(['/images/listings/yazilim-kursu.jpg']),
        features: JSON.stringify(['Sertifika', 'Proje Portföyü', 'İş Yerleştirme']),
        userId: user2.id,
        isPremium: true,
        status: 'active',
        views: 45
      },
      {
        title: 'Yoga ve Meditasyon Kursu',
        description: 'Stres azaltma ve esneklik için yoga dersleri. Her seviyeye uygun.',
        price: 600,
        category: 'egitim-kurslar',
        subcategory: 'spor-kurslari',
        condition: 'Yeni',
        location: 'Bursa',
        images: JSON.stringify(['/images/listings/yoga-kursu.jpg']),
        features: JSON.stringify(['Materyal Dahil', 'Grup Dersi', 'Özel Ders Seçeneği']),
        userId: user1.id,
        isPremium: false,
        status: 'active',
        views: 20
      }
    ]

      for (const ilan of egitimIlanlari) {
    await prisma.listing.create({
      data: ilan,
    })
  }

    // --- TÜM ESKİ İLANLARI SİL ---
    await prisma.listing.deleteMany({});

    // --- HER ANA KATEGORİYE 1 İLAN ---
    const categories = [
      { slug: 'elektronik', name: 'Elektronik' },
      { slug: 'giyim', name: 'Giyim' },
      { slug: 'hizmetler', name: 'Hizmetler' },
      { slug: 'yemek-icecek', name: 'Yemek & İçecek' },
      { slug: 'ev-bahce', name: 'Ev & Bahçe' },
      { slug: 'is', name: 'İş' },
      { slug: 'sporlar-oyunlar-eglenceler', name: 'Sporlar, Oyunlar & Eğlenceler' },
      { slug: 'sanat-hobi', name: 'Sanat & Hobi' },
      { slug: 'ucretsiz-gel-al', name: 'Ücretsiz Gel-Al' },
      { slug: 'saglik-guzellik', name: 'Sağlık & Güzellik' },
      { slug: 'turizm-gecelemeler', name: 'Turizm & Gecelemeler' },
    ];

    for (const cat of categories) {
      await prisma.listing.create({
        data: {
          title: `${cat.name} için örnek ilan`,
          description: `${cat.name} kategorisinde örnek açıklama`,
          price: 1000,
          images: JSON.stringify(['/images/placeholder.svg']),
          features: JSON.stringify(['Özellik 1', 'Özellik 2']),
          condition: 'Yeni',
          location: 'Çanakkale',
          category: cat.slug,
          subcategory: '',
          brand: '',
          model: '',
          year: '2024',
          isPremium: false,
          status: 'active',
          userId: admin.id,
        },
      });
    }

    console.log('✅ Database seeded successfully!')
    console.log('')
    console.log('📋 Created users:')
    console.log('👑 Admin:', admin.email, '/ admin123')
    console.log('👤 User:', user.email, '/ user123')
    console.log('🧪 Test:', testUser.email, '/ test123')
    console.log('')
    console.log('📋 Created categories:', categoriesSeed.length)
    console.log('📋 Created subcategories:', categoriesSeed.length)
    console.log('📋 Created listings:', categories.length)
    console.log('📋 Created coupon: WELCOME10 (10% discount)')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 