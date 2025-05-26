'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-alo-blue">ALO.TR</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/kategoriler" className="text-alo-dark hover:text-alo-orange transition-colors">
              Kategoriler
            </Link>
            <Link href="/ilanlar" className="text-alo-dark hover:text-alo-orange transition-colors">
              Tüm İlanlar
            </Link>
            <Link href="/blog" className="text-alo-dark hover:text-alo-orange transition-colors">
              Blog
            </Link>
            <Link href="/giris" className="text-alo-dark hover:text-alo-orange transition-colors">
              Giriş Yap
            </Link>
            <Link
              href="/ilan-ver"
              className="bg-alo-orange text-white px-4 py-2 rounded-lg hover:bg-alo-light-orange transition-colors"
            >
              İlan Ver
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-alo-dark"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-4">
            <Link
              href="/kategoriler"
              className="block text-alo-dark hover:text-alo-orange transition-colors"
            >
              Kategoriler
            </Link>
            <Link
              href="/ilanlar"
              className="block text-alo-dark hover:text-alo-orange transition-colors"
            >
              Tüm İlanlar
            </Link>
            <Link
              href="/blog"
              className="block text-alo-dark hover:text-alo-orange transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/giris"
              className="block text-alo-dark hover:text-alo-orange transition-colors"
            >
              Giriş Yap
            </Link>
            <Link
              href="/ilan-ver"
              className="block bg-alo-orange text-white px-4 py-2 rounded-lg hover:bg-alo-light-orange transition-colors text-center"
            >
              İlan Ver
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
} 