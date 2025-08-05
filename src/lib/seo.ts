export interface MetaData {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  robots?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  ogSiteName?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCreator?: string;
  twitterSite?: string;
  structuredData?: Record<string, any>;
}

export interface PageMetaData {
  [key: string]: MetaData;
}

class SEOService {
  private static instance: SEOService;
  private defaultMeta: MetaData = {
    title: 'Alo17 - Türkiye\'nin En Büyük İlan Sitesi',
    description: 'Alo17 ile alım, satım, kiralama işlemlerinizi kolayca yapın. Güvenli, hızlı ve ücretsiz ilan verin.',
    keywords: ['ilan', 'alım', 'satım', 'kiralama', 'ikinci el', 'yeni', 'güvenli', 'ücretsiz'],
    author: 'Alo17',
    robots: 'index, follow',
    ogType: 'website',
    ogSiteName: 'Alo17',
    twitterCard: 'summary_large_image',
    twitterSite: '@alo17',
  };

  private pageMetaData: PageMetaData = {
    // Ana sayfa
    '/': {
      title: 'Alo17 - Türkiye\'nin En Büyük İlan Sitesi',
      description: 'Alo17 ile alım, satım, kiralama işlemlerinizi kolayca yapın. Güvenli, hızlı ve ücretsiz ilan verin.',
      keywords: ['ilan', 'alım', 'satım', 'kiralama', 'ikinci el', 'yeni', 'güvenli', 'ücretsiz'],
      ogTitle: 'Alo17 - Türkiye\'nin En Büyük İlan Sitesi',
      ogDescription: 'Alo17 ile alım, satım, kiralama işlemlerinizi kolayca yapın.',
      ogImage: '/images/alo17-og.jpg',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Alo17',
        url: 'https://alo17.com',
        description: 'Türkiye\'nin en büyük ilan sitesi',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://alo17.com/arama?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      }
    },

    // İlanlar sayfası
    '/ilanlar': {
      title: 'İlanlar - Alo17',
      description: 'Binlerce ilan arasından size uygun olanı bulun. Alım, satım, kiralama işlemlerinizi güvenle yapın.',
      keywords: ['ilanlar', 'alım', 'satım', 'kiralama', 'ikinci el', 'yeni'],
      ogTitle: 'İlanlar - Alo17',
      ogDescription: 'Binlerce ilan arasından size uygun olanı bulun.',
      ogImage: '/images/listings-og.jpg',
      ogType: 'website'
    },

    // Kategoriler sayfası
    '/kategoriler': {
      title: 'Kategoriler - Alo17',
      description: 'Alo17 kategorileri: Emlak, Vasıta, İş Makineleri, İkinci El ve Sıfır Alışveriş, Bahçe, Özel Ders, Ustalar ve Hizmetler.',
      keywords: ['kategoriler', 'emlak', 'vasıta', 'iş makineleri', 'ikinci el', 'sıfır'],
      ogTitle: 'Kategoriler - Alo17',
      ogDescription: 'Alo17 kategorileri: Emlak, Vasıta, İş Makineleri ve daha fazlası.',
      ogImage: '/images/categories-og.jpg'
    },

    // Giriş sayfası
    '/giris': {
      title: 'Giriş Yap - Alo17',
      description: 'Alo17 hesabınıza giriş yapın. İlanlarınızı yönetin, mesajlarınızı görün.',
      keywords: ['giriş', 'login', 'hesap', 'üyelik'],
      robots: 'noindex, nofollow',
      ogTitle: 'Giriş Yap - Alo17',
      ogDescription: 'Alo17 hesabınıza giriş yapın.'
    },

    // Kayıt sayfası
    '/kayit': {
      title: 'Kayıt Ol - Alo17',
      description: 'Alo17\'ye ücretsiz üye olun. İlan verin, alım satım yapın.',
      keywords: ['kayıt', 'üye ol', 'üyelik', 'ücretsiz'],
      robots: 'noindex, nofollow',
      ogTitle: 'Kayıt Ol - Alo17',
      ogDescription: 'Alo17\'ye ücretsiz üye olun.'
    },

    // İlan ver sayfası
    '/ilan-ver': {
      title: 'İlan Ver - Alo17',
      description: 'Alo17\'de ücretsiz ilan verin. Hızlı, güvenli ve kolay ilan yayınlama.',
      keywords: ['ilan ver', 'ücretsiz ilan', 'ilan yayınla', 'satış'],
      ogTitle: 'İlan Ver - Alo17',
      ogDescription: 'Alo17\'de ücretsiz ilan verin.'
    },

    // Premium sayfası
    '/premium': {
      title: 'Premium Özellikler - Alo17',
      description: 'Alo17 Premium ile ilanlarınızı öne çıkarın. Daha fazla görüntülenme, daha hızlı satış.',
      keywords: ['premium', 'öne çıkar', 'görüntülenme', 'satış'],
      ogTitle: 'Premium Özellikler - Alo17',
      ogDescription: 'Alo17 Premium ile ilanlarınızı öne çıkarın.'
    },

    // Hakkımızda sayfası
    '/hakkimizda': {
      title: 'Hakkımızda - Alo17',
      description: 'Alo17 hakkında bilgi alın. Misyonumuz, vizyonumuz ve değerlerimiz.',
      keywords: ['hakkımızda', 'misyon', 'vizyon', 'değerler'],
      ogTitle: 'Hakkımızda - Alo17',
      ogDescription: 'Alo17 hakkında bilgi alın.'
    },

    // İletişim sayfası
    '/iletisim': {
      title: 'İletişim - Alo17',
      description: 'Alo17 ile iletişime geçin. Destek, öneri ve şikayetleriniz için bize ulaşın.',
      keywords: ['iletişim', 'destek', 'öneri', 'şikayet'],
      ogTitle: 'İletişim - Alo17',
      ogDescription: 'Alo17 ile iletişime geçin.'
    },

    // Gizlilik politikası
    '/gizlilik-politikasi': {
      title: 'Gizlilik Politikası - Alo17',
      description: 'Alo17 gizlilik politikası. Kişisel verilerinizin nasıl korunduğunu öğrenin.',
      keywords: ['gizlilik', 'politika', 'kişisel veri', 'koruma'],
      ogTitle: 'Gizlilik Politikası - Alo17',
      ogDescription: 'Alo17 gizlilik politikası.'
    },

    // Kullanım şartları
    '/kullanim-sartlari': {
      title: 'Kullanım Şartları - Alo17',
      description: 'Alo17 kullanım şartları. Platform kullanım koşullarını öğrenin.',
      keywords: ['kullanım', 'şartlar', 'koşullar', 'kurallar'],
      ogTitle: 'Kullanım Şartları - Alo17',
      ogDescription: 'Alo17 kullanım şartları.'
    }
  };

  static getInstance(): SEOService {
    if (!SEOService.instance) {
      SEOService.instance = new SEOService();
    }
    return SEOService.instance;
  }

  // Sayfa meta verilerini al
  getPageMetaData(path: string): MetaData {
    const pageMeta = this.pageMetaData[path];
    if (pageMeta) {
      return { ...this.defaultMeta, ...pageMeta };
    }
    return this.defaultMeta;
  }

  // Dinamik meta veri oluştur
  createMetaData(
    title: string,
    description: string,
    options: Partial<MetaData> = {}
  ): MetaData {
    return {
      ...this.defaultMeta,
      title,
      description,
      ogTitle: options.ogTitle || title,
      ogDescription: options.ogDescription || description,
      ...options
    };
  }

  // İlan meta verisi oluştur
  createListingMetaData(
    title: string,
    description: string,
    price: number,
    category: string,
    location: string,
    images: string[],
    listingId: string
  ): MetaData {
    const metaData = this.createMetaData(
      `${title} - ${price}₺ | ${category} | ${location} - Alo17`,
      description,
      {
        keywords: [category, location, 'ilan', 'satış', 'ikinci el'],
        ogType: 'product',
        ogImage: images[0] || '/images/default-listing.jpg',
        ogUrl: `https://alo17.com/ilan/${listingId}`,
        twitterCard: 'summary_large_image',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: title,
          description: description,
          image: images,
          offers: {
            '@type': 'Offer',
            price: price,
            priceCurrency: 'TRY',
            availability: 'https://schema.org/InStock'
          },
          category: category,
          location: {
            '@type': 'Place',
            name: location
          }
        }
      }
    );

    return metaData;
  }

  // Kategori meta verisi oluştur
  createCategoryMetaData(
    categoryName: string,
    description: string,
    listingCount: number
  ): MetaData {
    return this.createMetaData(
      `${categoryName} İlanları (${listingCount} ilan) - Alo17`,
      `${categoryName} kategorisinde ${listingCount} ilan bulunuyor. ${description}`,
      {
        keywords: [categoryName, 'ilan', 'kategori'],
        ogType: 'website',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${categoryName} İlanları`,
          description: description,
          numberOfItems: listingCount
        }
      }
    );
  }

  // Kullanıcı profili meta verisi oluştur
  createUserProfileMetaData(
    userName: string,
    listingCount: number,
    location: string
  ): MetaData {
    return this.createMetaData(
      `${userName} - ${listingCount} İlan | ${location} - Alo17`,
      `${userName} kullanıcısının ${listingCount} ilanı bulunuyor. ${location} bölgesinde hizmet veriyor.`,
      {
        keywords: [userName, location, 'kullanıcı', 'profil'],
        ogType: 'profile',
        robots: 'noindex, follow',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: userName,
          location: {
            '@type': 'Place',
            name: location
          }
        }
      }
    );
  }

  // Arama sonuçları meta verisi oluştur
  createSearchMetaData(
    query: string,
    resultCount: number
  ): MetaData {
    return this.createMetaData(
      `"${query}" Arama Sonuçları (${resultCount} ilan) - Alo17`,
      `"${query}" için ${resultCount} ilan bulundu. Alo17'de aradığınızı bulun.`,
      {
        keywords: [query, 'arama', 'sonuç'],
        ogType: 'website',
        robots: 'noindex, follow',
        canonical: `https://alo17.com/arama?q=${encodeURIComponent(query)}`
      }
    );
  }

  // Meta tag'leri HTML olarak oluştur
  generateMetaTags(metaData: MetaData): string {
    const tags: string[] = [];

    // Temel meta tag'ler
    tags.push(`<title>${metaData.title}</title>`);
    tags.push(`<meta name="description" content="${metaData.description}" />`);
    
    if (metaData.keywords) {
      tags.push(`<meta name="keywords" content="${metaData.keywords.join(', ')}" />`);
    }
    
    if (metaData.author) {
      tags.push(`<meta name="author" content="${metaData.author}" />`);
    }
    
    if (metaData.robots) {
      tags.push(`<meta name="robots" content="${metaData.robots}" />`);
    }

    // Canonical URL
    if (metaData.canonical) {
      tags.push(`<link rel="canonical" href="${metaData.canonical}" />`);
    }

    // Open Graph tag'leri
    tags.push(`<meta property="og:title" content="${metaData.ogTitle || metaData.title}" />`);
    tags.push(`<meta property="og:description" content="${metaData.ogDescription || metaData.description}" />`);
    tags.push(`<meta property="og:type" content="${metaData.ogType || 'website'}" />`);
    tags.push(`<meta property="og:url" content="${metaData.ogUrl || 'https://alo17.com'}" />`);
    tags.push(`<meta property="og:site_name" content="${metaData.ogSiteName || 'Alo17'}" />`);
    
    if (metaData.ogImage) {
      tags.push(`<meta property="og:image" content="${metaData.ogImage}" />`);
      tags.push(`<meta property="og:image:width" content="1200" />`);
      tags.push(`<meta property="og:image:height" content="630" />`);
    }

    // Twitter Card tag'leri
    tags.push(`<meta name="twitter:card" content="${metaData.twitterCard || 'summary_large_image'}" />`);
    tags.push(`<meta name="twitter:title" content="${metaData.twitterTitle || metaData.title}" />`);
    tags.push(`<meta name="twitter:description" content="${metaData.twitterDescription || metaData.description}" />`);
    
    if (metaData.twitterImage) {
      tags.push(`<meta name="twitter:image" content="${metaData.twitterImage}" />`);
    }
    
    if (metaData.twitterCreator) {
      tags.push(`<meta name="twitter:creator" content="${metaData.twitterCreator}" />`);
    }
    
    if (metaData.twitterSite) {
      tags.push(`<meta name="twitter:site" content="${metaData.twitterSite}" />`);
    }

    // Structured Data
    if (metaData.structuredData) {
      tags.push(`<script type="application/ld+json">${JSON.stringify(metaData.structuredData)}</script>`);
    }

    return tags.join('\n  ');
  }

  // Sitemap URL'leri oluştur
  generateSitemapUrls(): Array<{ url: string; lastmod: string; changefreq: string; priority: number }> {
    return [
      { url: 'https://alo17.com', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 1.0 },
      { url: 'https://alo17.com/ilanlar', lastmod: new Date().toISOString(), changefreq: 'hourly', priority: 0.9 },
      { url: 'https://alo17.com/kategoriler', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.8 },
      { url: 'https://alo17.com/ilan-ver', lastmod: new Date().toISOString(), changefreq: 'monthly', priority: 0.7 },
      { url: 'https://alo17.com/premium', lastmod: new Date().toISOString(), changefreq: 'monthly', priority: 0.6 },
      { url: 'https://alo17.com/hakkimizda', lastmod: new Date().toISOString(), changefreq: 'monthly', priority: 0.5 },
      { url: 'https://alo17.com/iletisim', lastmod: new Date().toISOString(), changefreq: 'monthly', priority: 0.5 },
      { url: 'https://alo17.com/gizlilik-politikasi', lastmod: new Date().toISOString(), changefreq: 'yearly', priority: 0.3 },
      { url: 'https://alo17.com/kullanim-sartlari', lastmod: new Date().toISOString(), changefreq: 'yearly', priority: 0.3 },
    ];
  }

  // Robots.txt içeriği oluştur
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

# Sitemap
Sitemap: https://alo17.com/sitemap.xml

# Disallow admin and private pages
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /giris
Disallow: /kayit
Disallow: /profil/
Disallow: /mesajlasma

# Allow important pages
Allow: /ilanlar
Allow: /kategoriler
Allow: /ilan/
Allow: /kategori/
Allow: /arama`;
  }
}

export const seo = SEOService.getInstance();
export default seo; 