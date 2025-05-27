import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SafetyNotice from '@/components/SafetyNotice'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ALO17.TR - İkinci El Alışveriş',
  description: 'Güvenilir ikinci el alışveriş platformu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <SafetyNotice />
        <Footer />
      </body>
    </html>
  )
} 