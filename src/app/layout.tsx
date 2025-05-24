import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Sidebar from '../components/layout/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ALO17 - İlan Sitesi',
  description: 'Türkiye\'nin en büyük ilan sitesi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Header />
        <div className="flex min-h-[calc(100vh-64px)]">
          <Sidebar />
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  )
} 