import { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ToastProvider } from '@/components/ui/toast'

export const metadata: Metadata = {
  title: 'Alo17 - Ev Hizmetleri ve Daha Fazlası',
  description: 'Ev hizmetleri, eğitim, sağlık ve daha fazlası için güvenilir platform',
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
          <ToastProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  )
}