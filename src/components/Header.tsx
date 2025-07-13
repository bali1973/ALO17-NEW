'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, LogOut } from "lucide-react"
import { useAuth } from './Providers'

export default function Header() {
  const { session, setSession, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    setSession(null);
    setIsMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-primary">alo17<span className="text-secondary">.tr</span></span>
        </Link>
        {/* Mobil hamburger */}
        <button className="lg:hidden p-2 rounded-md hover:bg-gray-100" onClick={()=>setIsMenuOpen(v=>!v)}>
          <span className="sr-only">Menüyü Aç</span>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
        {/* Arama ve kullanıcı */}
        <div className="hidden lg:flex items-center gap-4 flex-1 justify-center">
          <div className="relative w-full max-w-lg">
            <input type="text" placeholder="Ürün, hizmet veya kategori ara..." className="input pl-10 pr-4" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-4">
          {session ? (
            <>
              <Link href="/profil" className="btn-outline flex items-center gap-2"><User className="w-5 h-5" /> Profilim</Link>
              <button onClick={handleSignOut} className="btn-secondary flex items-center gap-2"><LogOut className="w-5 h-5" /> Çıkış</button>
            </>
          ) : (
            <Link href="/giris" className="btn">Giriş Yap</Link>
          )}
        </div>
        {/* Mobil menü */}
        {isMenuOpen && (
          <div className="absolute top-16 right-4 bg-white rounded-xl shadow-lg p-4 flex flex-col gap-3 w-56 border z-50 animate-fade-in">
            <div className="relative w-full mb-2">
              <input type="text" placeholder="Ara..." className="input pl-10 pr-4" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {session ? (
              <>
                <Link href="/profil" className="btn-outline flex items-center gap-2"><User className="w-5 h-5" /> Profilim</Link>
                <button onClick={handleSignOut} className="btn-secondary flex items-center gap-2"><LogOut className="w-5 h-5" /> Çıkış</button>
              </>
            ) : (
              <Link href="/giris" className="btn">Giriş Yap</Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
} 