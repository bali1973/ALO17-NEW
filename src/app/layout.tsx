import { Metadata, Viewport } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import Header from '@/components/Header'
import SiteFooter from '@/components/SiteFooter'
import fs from 'fs';
import path from 'path';
import ClientCookieBanner from '@/components/ClientCookieBanner';
import { initPerformanceMonitoring } from '@/lib/performance';


export const metadata: Metadata = (() => {
  let metaTitle = "Alo17 - Türkiye'nin En Büyük İlan Sitesi";
  let metaTitleTemplate = "%s | Alo17";
  let metaDescription = 'Elektronik, ev eşyaları, giyim ve daha birçok kategoride binlerce ilanı keşfedin.';
  try {
    const settingsPath = path.join(process.cwd(), 'public', 'settings.json');
    const settingsRaw = fs.readFileSync(settingsPath, 'utf-8');
    const settings = JSON.parse(settingsRaw);
    if (settings.metaTitle && settings.metaTitle.trim() !== '') {
      metaTitle = settings.metaTitle;
      metaTitleTemplate = "%s | " + settings.metaTitle;
    }
    if (settings.homepageDescription && settings.homepageDescription.trim() !== '') {
      metaDescription = settings.homepageDescription;
    }
  } catch {}
  return {
    title: {
      default: metaTitle,
      template: metaTitleTemplate
    },
    description: metaDescription,
    keywords: [
      'alo17', 'ilan', 'ikinci el', 'satılık', 'hizmet', 'elektronik', 'ev eşyası', 'giyim', 'araba', 'emlak', 'iş ilanı', 'premium ilan', 'ücretsiz ilan', 'Çanakkale', 'Türkiye'
    ],
    icons: {
      icon: '/icons/favicon-32x32.png',
      shortcut: '/icons/favicon-16x16.png',
      apple: '/icons/apple-touch-icon.png',
      other: [
        {
          rel: 'icon',
          url: '/icons/favicon.ico',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          url: '/icons/favicon-16x16.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          url: '/icons/favicon-32x32.png',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          url: '/icons/apple-touch-icon.png',
        },
        {
          rel: 'manifest',
          url: '/manifest.json',
        }
      ]
    },
    openGraph: {
      type: 'website',
      url: 'https://alo17.com',
      title: metaTitle,
      description: metaDescription,
      siteName: metaTitle,
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: 'tr_TR',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@alo17tr',
      title: metaTitle,
      description: metaDescription,
      images: ['/images/og-image.jpg'],
    },
    metadataBase: new URL('https://alo17.com'),
  };
})();

export const viewport: Viewport = {
  themeColor: '#ff6600',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Google Ads kodunu settings.json'dan oku
  let googleAdsCode = '';
  try {
    const settingsPath = path.join(process.cwd(), 'public', 'settings.json');
    const settingsRaw = fs.readFileSync(settingsPath, 'utf-8');
    const settings = JSON.parse(settingsRaw);
    googleAdsCode = settings.googleAdsCode || '';
  } catch {}

  return (
    <html lang="tr">
                           <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="index, follow" />
          <meta name="author" content="Alo17" />
          <meta name="copyright" content="Alo17" />
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/apple-icon.png" />
          <link rel="manifest" href="/manifest.json" />
         
        {googleAdsCode && (
          <script
            dangerouslySetInnerHTML={{
              __html: googleAdsCode
            }}
          />
        )}
      </head>
             <body className="font-sans">
        <Providers>
          <Header />
          <ClientCookieBanner />
          {children}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Performans optimizasyonları
                if (typeof window !== 'undefined') {
                  // Performans izleme başlat
                  try {
                    // Core Web Vitals izleme
                    if ('PerformanceObserver' in window) {
                      // LCP (Largest Contentful Paint)
                      new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        console.log('LCP:', lastEntry.startTime.toFixed(2) + 'ms');
                      }).observe({ entryTypes: ['largest-contentful-paint'] });

                      // FID (First Input Delay)
                      new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        entries.forEach((entry) => {
                          console.log('FID:', (entry.processingStart - entry.startTime).toFixed(2) + 'ms');
                        });
                      }).observe({ entryTypes: ['first-input'] });

                      // CLS (Cumulative Layout Shift)
                      new PerformanceObserver((list) => {
                        let clsValue = 0;
                        const entries = list.getEntries();
                        entries.forEach((entry) => {
                          if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                          }
                        });
                        console.log('CLS:', clsValue.toFixed(4));
                      }).observe({ entryTypes: ['layout-shift'] });
                    }
                  } catch (error) {
                    console.error('Performance monitoring error:', error);
                  }
                  
                  // Cache temizleme
                  if (typeof localStorage !== 'undefined') {
                    const lastCleanup = localStorage.getItem('last_cache_cleanup');
                    const now = Date.now();
                    
                    if (!lastCleanup || (now - parseInt(lastCleanup)) > 24 * 60 * 60 * 1000) {
                      const keys = Object.keys(localStorage);
                      keys.forEach(key => {
                        if (key.startsWith('cache_')) {
                          try {
                            const item = JSON.parse(localStorage.getItem(key) || '{}');
                            if (item.timestamp && (now - item.timestamp) > 24 * 60 * 60 * 1000) {
                              localStorage.removeItem(key);
                            }
                          } catch (e) {
                            localStorage.removeItem(key);
                          }
                        }
                      });
                      
                      localStorage.setItem('last_cache_cleanup', now.toString());
                    }
                  }
                }
              `
            }}
          />
          <div className="w-full m-0 p-0">
            <div className="bg-yellow-50 border-t-4 border-alo-orange p-1 pb-px mb-0 m-0 shadow flex flex-col gap-0 items-center rounded-none">
              <div className="flex items-center gap-1 text-yellow-700 font-semibold text-base mt-0">
                <span role="img" aria-label="Uyarı">⚠️</span>
                Güvenlik Uyarısı
              </div>
              <div className="text-xs text-gray-800 mt-0 text-left">
                <span>
                  Siz de kendi güvenliğiniz ve diğer kullanıcıların daha sağlıklı alışveriş yapabilmeleri için, satın almak istediğiniz ürünü teslim almadan ön ödeme yapmamaya, avans ya da kapora ödememeye özen gösteriniz.
                </span>
                <span>
                  İlan sahiplerinin ilanlarda belirttiği herhangi bir bilgi ya da görselin gerçeği yansıtmadığını düşünüyorsanız veya ilan sahiplerinin hesap profillerindeki bilgilerin doğru olmadığını düşünüyorsanız, lütfen ilanı bildiriniz.
                </span>
                <span>
                  ALO17.TR'de yer alan kullanıcıların oluşturduğu tüm içerik, görüş ve bilgilerin doğruluğu, eksiksiz ve değişmez olduğu, yayınlanması ile ilgili yasal yükümlülükler içeriği oluşturan kullanıcıya aittir. Bu içeriğin, görüş ve bilgilerin yanlışlık, eksiklik veya yasalarla düzenlenmiş kurallara aykırılığından ALO17.TR hiçbir şekilde sorumlu değildir. Sorularınız için ilan sahibi ile irtibata geçebilirsiniz.
                </span>
              </div>
            </div>
            <div className='w-full h-[3px] bg-alo-orange m-0 p-0'></div>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  )
}
