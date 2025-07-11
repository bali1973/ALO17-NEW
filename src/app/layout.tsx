import { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import Header from '@/components/Header'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Alo17 - Türkiye\'nin En Büyük İlan Sitesi',
  description: 'Elektronik, ev eşyaları, giyim ve daha birçok kategoride binlerce ilanı keşfedin.',
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className="font-sans">
        <Providers>
          <Header />
          {children}
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