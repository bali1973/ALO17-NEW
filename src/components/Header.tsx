'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Search, User, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Arama sayfasına yönlendirme
      router.push(`/arama?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleNotifications = () => {
    // Bildirimler sayfasına yönlendirme
    router.push('/bildirimler');
  };

  const handleCreateListing = () => {
    console.log('İlan ver butonuna tıklandı!');
    // İlan ver sayfasına yönlendirme
    router.push('/ilan-ver');
  };

  const handleUserAction = () => {
    if (session) {
      // Kullanıcı giriş yapmışsa profil sayfasına yönlendir
      router.push('/profil');
    } else {
      // Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
      router.push('/giris');
    }
  };

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Button 
                onClick={handleSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-alo-orange hover:bg-orange-600 text-white px-6"
              >
                Ara
              </Button>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            <Button 
              onClick={handleNotifications}
              variant="outline" 
              className="hidden md:flex border-alo-blue text-alo-blue hover:bg-alo-blue hover:text-white cursor-pointer"
            >
              <Bell className="h-4 w-4 mr-2" />
              Bildirimler
            </Button>
            <Button 
              onClick={handleCreateListing}
              className="bg-alo-yellow hover:bg-yellow-500 text-black font-medium cursor-pointer relative z-10"
              type="button"
            >
              <span className="hidden sm:inline">+ İlan Ver</span>
              <span className="sm:hidden">+</span>
            </Button>
            <Button 
              onClick={handleUserAction}
              variant="outline" 
              className="border-gray-300 cursor-pointer"
            >
              <User className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">
                {session ? 'Profil' : 'Giriş Yap'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
} 