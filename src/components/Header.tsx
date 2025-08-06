'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, Bell, MessageCircle, Menu, X } from "lucide-react";
import { useAuth } from '@/components/Providers';

interface NotificationCount {
  unreadCount: number;
  totalNotifications: number;
}

export default function Header() {
  const { session, setSession } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState<NotificationCount>({ 
    unreadCount: 0, 
    totalNotifications: 0 
  });

  useEffect(() => {
    if (session?.user?.email) {
      fetchNotificationCount();
      const interval = setInterval(fetchNotificationCount, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const fetchNotificationCount = async () => {
    try {
      const response = await fetch(`/api/notifications/unread/count?userId=${session?.user?.email}`);
      if (response.ok) {
        const data = await response.json();
        setNotificationCount(data);
      }
    } catch (error) {
      // Bildirim sayısı alınamadı - sessizce devam et
    }
  };

  const handleSignOut = () => {
    try {
      // LocalStorage'dan session'ı temizle
      localStorage.removeItem('alo17-session');
      // Session state'ini temizle
      setSession(null);
      // Menüyü kapat
      setIsMenuOpen(false);
      // Ana sayfaya yönlendir
      window.location.href = '/';
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
      // Hata durumunda da ana sayfaya yönlendir
      window.location.href = '/';
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A17</span>
              </div>
              <span className="font-bold text-xl text-gray-800 hidden sm:block">Alo17</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            <Link 
              href="/premium-ozellikler" 
              className="px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              ⭐ Öncelikli
            </Link>
            <Link 
              href="/ilan-ver" 
              className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              + İlan Ver
            </Link>
            {session ? (
              <>
                <Link 
                  href="/bildirimler" 
                  className="relative px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Bell className="w-4 h-4 inline mr-1" />
                  Bildirimler
                  {notificationCount.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notificationCount.unreadCount > 99 ? '99+' : notificationCount.unreadCount}
                    </span>
                  )}
                </Link>
                <Link 
                  href="/profil/mesajlar" 
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 inline mr-1" />
                  Mesajlarım
                </Link>
  
                <div className="relative">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    {session.user?.name || 'Profil'}
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                      <Link href="/profil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profilim
                      </Link>
                      <button 
                        onClick={handleSignOut} 
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link href="/giris" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Giriş
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="space-y-3">
              <Link 
                href="/ilan-ver" 
                className="block w-full px-4 py-3 text-sm font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors text-center"
              >
                + İlan Ver
              </Link>
              <Link 
                href="/premium-ozellikler" 
                className="block w-full px-4 py-3 text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors text-center"
              >
                ⭐ Öncelikli
              </Link>
              {session ? (
                <>
                  <Link 
                    href="/bildirimler" 
                    className="relative block w-full px-4 py-3 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-center"
                  >
                    <Bell className="w-4 h-4 inline mr-1" />
                    Bildirimler
                    {notificationCount.unreadCount > 0 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notificationCount.unreadCount > 99 ? '99+' : notificationCount.unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link 
                    href="/profil/mesajlar" 
                    className="block w-full px-4 py-3 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-center"
                  >
                    <MessageCircle className="w-4 h-4 inline mr-1" />
                    Mesajlarım
                  </Link>
                  <Link 
                    href="/profil" 
                    className="block w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                  >
                    <User className="w-4 h-4 inline mr-1" />
                    Profilim
                  </Link>
                  <button 
                    onClick={handleSignOut} 
                    className="block w-full px-4 py-3 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <Link 
                  href="/giris" 
                  className="block w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  Giriş
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 