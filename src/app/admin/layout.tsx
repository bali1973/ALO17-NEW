'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  BellIcon,
  MagnifyingGlassIcon,
  StarIcon,
  SparklesIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  Bars3Icon,
  XMarkIcon as XMarkIconSolid,
  ShieldCheckIcon,
  UserCircleIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';
import { useAdminAuth, AdminGuard, AdminAuthProvider, adminUtils } from '@/lib/admin-auth';
import { ToastProvider } from '@/components/ToastProvider';

const navigation = [
  { 
    name: 'Yönetim Paneli', 
    href: '/admin/dashboard', 
    icon: HomeIcon,
    permission: 'dashboard:read' as const
  },
  { 
    name: 'İlanlar', 
    href: '/admin/ilanlar', 
    icon: ClipboardDocumentListIcon,
    permission: 'listings:read' as const
  },
  { 
    name: 'Kullanıcılar', 
    href: '/admin/kullanicilar', 
    icon: UserGroupIcon,
    permission: 'users:read' as const
  },
  { 
    name: 'Mesajlar', 
    href: '/admin/mesajlar', 
    icon: ChatBubbleLeftRightIcon,
    permission: 'messages:read' as const
  },
  { 
    name: 'Bildirimler', 
    href: '/admin/bildirimler', 
    icon: BellIcon,
    permission: 'dashboard:read' as const
  },
    {
    name: 'Premium Planlar', 
    href: '/admin/premium-planlar', 
    icon: StarIcon,
    permission: 'premium:read' as const
  },
  {
    name: 'Fiyatlandırma Stratejileri', 
    href: '/admin/fiyatlandirma-stratejileri', 
    icon: ArrowTrendingUpIcon,
    permission: 'pricing:read' as const
  },
  {
    name: 'İstatistikler', 
    href: '/admin/istatistikler', 
    icon: ChartBarIcon,
    permission: 'statistics:read' as const
  },
  { 
    name: 'Ayarlar', 
    href: '/admin/ayarlar', 
    icon: Cog6ToothIcon,
    permission: 'settings:read' as const
  },
  {
    name: 'Kategoriler',
    href: '/admin/kategoriler',
    icon: ClipboardDocumentListIcon,
    permission: 'categories:read' as const
  },
  {
    name: 'Sistem İzleme',
    href: '/admin/monitoring',
    icon: CpuChipIcon,
    permission: 'monitoring:read' as const
  },
  {
    name: 'Güvenlik',
    href: '/admin/guvenlik',
    icon: ShieldCheckIcon,
    permission: 'security:read' as const
  },
];

// Sayı rozeti için küçük bir component:
function CountBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
      {count}
    </span>
  );
}

function useAdminCounts() {
  const [reportCount, setReportCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchCounts = async () => {
      try {
        const [reportResponse, messageResponse] = await Promise.all([
          fetch('/api/notifications/report/count'),
          fetch('/api/messages/count')
        ]);
        
        if (isMounted) {
          const reportData = await reportResponse.json();
          const messageData = await messageResponse.json();
          
          setReportCount(reportData.count || 0);
          setMessageCount(messageData.count || 0);
        }
      } catch (error) {
        console.error('Count fetch error:', error);
      }
    };
    
    fetchCounts();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run once
  
  return { reportCount, messageCount };
}

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, adminUser, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { reportCount, messageCount } = useAdminCounts();

  // Admin değilse giriş sayfasına yönlendir
  useEffect(() => {
    if (!isAdmin && pathname !== '/admin/giris') {
      router.push('/admin/giris');
    }
  }, [isAdmin, pathname, router]);

  // Giriş sayfasındaysa sadece children'ı göster
  if (pathname === '/admin/giris') {
    return <>{children}</>;
  }

  // Admin değilse loading göster
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Admin paneli yükleniyor...</p>
          <p className="text-xs text-gray-500 mt-2">Yetki kontrol ediliyor</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIconSolid className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                  {item.href === '/admin/bildirimler' && <CountBadge count={reportCount} />}
                  {item.href === '/admin/mesajlar' && <CountBadge count={messageCount} />}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                  {item.href === '/admin/bildirimler' && <CountBadge count={reportCount} />}
                  {item.href === '/admin/mesajlar' && <CountBadge count={messageCount} />}
                </Link>
              );
            })}
          </nav>
          
          {/* Kullanıcı bilgisi */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">
                  {adminUser?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">
                  {adminUtils.getRoleName(adminUser?.role || 'moderator')}
                </p>
              </div>
              <button
                onClick={logout}
                className="ml-2 text-gray-400 hover:text-gray-600"
                title="Çıkış Yap"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 relative"
                onClick={() => router.push('/admin/mesajlar')}
              >
                <span className="sr-only">Mesajlarım</span>
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
                <CountBadge count={messageCount} />
              </button>
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 relative"
                onClick={() => router.push('/admin/bildirimler')}
              >
                <span className="sr-only">Bildirimler</span>
                <BellIcon className="h-6 w-6" />
                <CountBadge count={reportCount} />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <ToastProvider>
        <AdminLayoutContent>
          {children}
        </AdminLayoutContent>
      </ToastProvider>
    </AdminAuthProvider>
  );
} 
