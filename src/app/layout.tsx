import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SafetyNotice from '@/components/SafetyNotice'
import SEO from '@/components/layout/SEO'
import ErrorBoundary from '@/components/ErrorBoundary'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Alo17 - İlan Ver, Alışveriş Yap',
  description: 'Türkiye\'nin en güvenilir alışveriş platformu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <SEO title="ALO17.TR - İkinci El Alışveriş" description="Güvenilir ikinci el alışveriş platformu" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
          <SafetyNotice />
          <Footer />
        </AuthProvider>
        {/* Yüklenme durumları için kullanılabilir: <LoadingSpinner /> */}
      </body>
    </html>
  )
} 