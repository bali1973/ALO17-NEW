'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Search, User, Bell, MessageCircle, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Header() {
  const { data: session } = useSession();
  type SessionUser = typeof session.user & { role?: string };
  const user = session?.user as SessionUser;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-alo-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-2xl font-bold">
                <span className="text-alo-blue">alo</span>
                <span className="text-alo-blue">17</span>
                <span className="text-orange-500">.tr</span>
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Aradığınız ürün, hizmet veya kategoriyi yazın..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 focus:border-alo-blue bg-white"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-alo-orange hover:bg-orange-600 text-white px-6">
                Ara
              </Button>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* İlan Ver Butonu - Her zaman görünür */}
            <Button className="bg-alo-yellow hover:bg-yellow-500 text-black font-medium">
              <span className="hidden sm:inline">+ İlan Ver</span>
              <span className="sm:hidden">+</span>
            </Button>

            {session ? (
              // Giriş yapmış kullanıcılar için
              <>
                {/* Bildirimler */}
                <Button variant="outline" className="hidden md:flex border-alo-blue text-alo-blue hover:bg-alo-blue hover:text-white">
                  <Bell className="h-4 w-4 mr-2" />
                  Bildirimler
                </Button>

                {/* Mesajlarım */}
                <Link href="/profil/mesajlar">
                  <Button variant="outline" className="hidden md:flex border-alo-blue text-alo-blue hover:bg-alo-blue hover:text-white">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Mesajlarım
                  </Button>
                </Link>

                {/* Profil Menüsü */}
                <div className="relative">
                  <Button 
                    variant="outline" 
                    className="border-gray-300"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <User className="h-4 w-4 lg:mr-2" />
                    <span className="hidden lg:inline">{session.user?.name || 'Profil'}</span>
                  </Button>

                  {/* Profil Dropdown Menü */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                      <Link href="/profil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <User className="h-4 w-4 inline mr-2" />
                        Profilim
                      </Link>
                      <Link href="/profil/duzenle" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Settings className="h-4 w-4 inline mr-2" />
                        Profili Düzenle
                      </Link>
                      {user?.role === 'admin' && (
                        <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <Settings className="h-4 w-4 inline mr-2" />
                          Admin Paneli
                        </Link>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 inline mr-2" />
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Giriş yapmamış kullanıcılar için
              <Link href="/giris">
                <Button variant="outline" className="border-gray-300">
                  <User className="h-4 w-4 lg:mr-2" />
                  <span className="hidden lg:inline">Giriş Yap</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Profil menüsü dışına tıklandığında kapat */}
      {isProfileMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}
    </header>
  );
} 