'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import Link from 'next/link';
import Image from 'next/image';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Settings, 
  Bell, 
  Shield, 
  Star, 
  FileText, 
  MessageCircle, 
  Heart, 
  Eye, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Crown,
  Zap,
  BarChart3,
  CreditCard,
  LogOut,
  Plus,
  Filter,
  Search
} from 'lucide-react';

interface UserStats {
  totalListings: number;
  activeListings: number;
  totalViews: number;
  totalMessages: number;
  totalFavorites: number;
  memberSince: string;
  lastActive: string;
}

interface UserListing {
  id: string;
  title: string;
  price: number;
  status: 'active' | 'pending' | 'expired' | 'sold';
  views: number;
  createdAt: string;
  category: string;
  location: string;
  images: string[];
}

interface UserPremiumStatus {
  isPremium: boolean;
  planName: string;
  endDate: string;
  remainingDays: number;
  features: string[];
}

export default function ProfilePage() {
  const { session, isLoading, setSession } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const updated = searchParams.get('updated');
  
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats, setUserStats] = useState<UserStats>({
    totalListings: 0,
    activeListings: 0,
    totalViews: 0,
    totalMessages: 0,
    totalFavorites: 0,
    memberSince: '',
    lastActive: ''
  });
  
  const [userListings, setUserListings] = useState<UserListing[]>([]);
  const [userPremiumStatus, setUserPremiumStatus] = useState<UserPremiumStatus>({
    isPremium: false,
    planName: '',
    endDate: '',
    remainingDays: 0,
    features: []
  });
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      router.push('/giris?redirect=/profil');
      return;
    }
    
    loadUserData();
  }, [session, isLoading, router]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Kullanıcı istatistiklerini al
      const statsResponse = await fetch(`/api/user/stats?userId=${session?.user.email}`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setUserStats(statsData);
      }

      // Kullanıcı ilanlarını al
      const listingsResponse = await fetch(`/api/user/listings?userId=${session?.user.email}`);
      if (listingsResponse.ok) {
        const listingsData = await listingsResponse.json();
        setUserListings(listingsData.listings);
      }

      // Premium durumunu al
      const premiumResponse = await fetch(`/api/premium/status?userId=${session?.user.email}`);
      if (premiumResponse.ok) {
        const premiumData = await premiumResponse.json();
        setUserPremiumStatus(premiumData);
      }
    } catch (error) {
      console.error('Kullanıcı verileri yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Aktif' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Bekliyor' },
      expired: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Süresi Dolmuş' },
      sold: { color: 'bg-blue-100 text-blue-800', icon: Award, text: 'Satıldı' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const filteredListings = userListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Profil yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Başarı Mesajı */}
        {updated && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-800">Profil başarıyla güncellendi!</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profil Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Profil Fotoğrafı */}
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                                      <Image
                      src="/images/avatar.svg"
                      alt={session?.user?.name || 'Kullanıcı'}
                      fill
                      className="rounded-full object-cover border-4 border-gray-100"
                    />
                  <Link href="/profil/duzenle" className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <Edit className="w-4 h-4" />
                  </Link>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {session?.user?.name || 'Kullanıcı'}
                </h2>
                
                <p className="text-sm text-gray-500 mb-3">
                  Üye: {userStats.memberSince ? formatDate(userStats.memberSince) : '2024'}
                </p>

                {/* Premium Durumu */}
                {userPremiumStatus.isPremium && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg mb-4 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Crown className="w-4 h-4 mr-1" />
                      <span className="font-semibold">{userPremiumStatus.planName}</span>
                    </div>
                    <p className="text-xs opacity-90">
                      {userPremiumStatus.remainingDays} gün kaldı
                    </p>
                  </div>
                )}
              </div>

              {/* İletişim Bilgileri */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-sm">{session?.user?.email || '-'}</span>
                </div>
                {session?.user?.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-sm">{session.user.phone}</span>
                  </div>
                )}
                {session?.user?.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-sm">{session.user.location}</span>
                  </div>
                )}
                {session?.user?.birthdate && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-sm">{formatDate(session.user.birthdate)}</span>
                  </div>
                )}
              </div>

              {/* Hızlı Erişim */}
              <div className="space-y-2">
                <Link
                  href="/profil/duzenle"
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 mr-3" />
                  Profili Düzenle
                </Link>
                <Link
                  href="/bildirim-tercihleri"
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Bell className="w-4 h-4 mr-3" />
                  Bildirim Ayarları
                </Link>
                <Link
                  href="/premium-ozellikler"
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Crown className="w-4 h-4 mr-3" />
                  Premium Özellikler
                </Link>
                <Link
                  href="/ilan-ver"
                  className="flex items-center w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-3" />
                  Yeni İlan Ver
                </Link>
              </div>
            </div>
          </div>

          {/* Ana İçerik */}
          <div className="lg:col-span-3">
            {/* İstatistikler */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Toplam İlan</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats.totalListings}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Eye className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Toplam Görüntülenme</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats.totalViews}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MessageCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Toplam Mesaj</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats.totalMessages}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Favoriler</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats.totalFavorites}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sekmeler */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', name: 'Genel Bakış', icon: User },
                    { id: 'listings', name: 'İlanlarım', icon: FileText },
                    { id: 'messages', name: 'Mesajlarım', icon: MessageCircle },
                    { id: 'favorites', name: 'Favorilerim', icon: Heart },
                    { id: 'analytics', name: 'Analitikler', icon: BarChart3 }
                  ].map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {/* Genel Bakış */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Son Aktiviteler</h3>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            <span>Yeni ilan eklendi: &quot;iPhone 13 Pro&quot;</span>
                            <span className="ml-auto text-xs">2 saat önce</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            <span>3 yeni mesaj alındı</span>
                            <span className="ml-auto text-xs">1 gün önce</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                            <span>İlan görüntülenme: 25 artış</span>
                            <span className="ml-auto text-xs">2 gün önce</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Hızlı İstatistikler</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Aktif İlanlar</span>
                            <span className="font-semibold text-green-600">{userStats.activeListings}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Bu Ay Görüntülenme</span>
                            <span className="font-semibold text-blue-600">+12%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Ortalama Yanıt Süresi</span>
                            <span className="font-semibold text-purple-600">2.3 saat</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {userPremiumStatus.isPremium && (
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Premium Üyeliğiniz</h3>
                            <p className="text-gray-600 mb-2">
                              {userPremiumStatus.planName} planı ile {userPremiumStatus.remainingDays} gün daha premium özelliklere erişiminiz var.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {userPremiumStatus.features.slice(0, 3).map((feature, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                  <Zap className="w-3 h-3 mr-1" />
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                          <Link
                            href="/premium-ozellikler"
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                          >
                            Yenile
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* İlanlarım */}
                {activeTab === 'listings' && (
                  <div className="space-y-6">
                    {/* Filtreler */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            placeholder="İlan ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">Tüm Durumlar</option>
                        <option value="active">Aktif</option>
                        <option value="pending">Bekliyor</option>
                        <option value="expired">Süresi Dolmuş</option>
                        <option value="sold">Satıldı</option>
                      </select>
                    </div>

                    {/* İlan Listesi */}
                    <div className="space-y-4">
                      {filteredListings.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz ilanınız yok</h3>
                          <p className="text-gray-500 mb-4">İlk ilanınızı yayınlayarak başlayın!</p>
                          <Link
                            href="/ilan-ver"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            İlan Ver
                          </Link>
                        </div>
                      ) : (
                        filteredListings.map((listing) => (
                          <div key={listing.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                                  {listing.images.length > 0 ? (
                                    <Image
                                      src={listing.images[0]}
                                      alt={listing.title}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <FileText className="w-6 h-6 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 mb-1">{listing.title}</h3>
                                  <p className="text-lg font-bold text-blue-600 mb-2">{formatPrice(listing.price)}</p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span>{listing.category}</span>
                                    <span>•</span>
                                    <span>{listing.location}</span>
                                    <span>•</span>
                                    <span>{listing.views} görüntülenme</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                {getStatusBadge(listing.status)}
                                <div className="flex space-x-2">
                                  <Link
                                    href={`/ilan/${listing.id}`}
                                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Link>
                                  <Link
                                    href={`/ilan-duzenle/${listing.id}`}
                                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Mesajlarım */}
                {activeTab === 'messages' && (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Mesajlarınız</h3>
                    <p className="text-gray-500 mb-4">İlanlarınızla ilgili mesajları burada görebilirsiniz.</p>
                    <Link
                      href="/mesajlasma"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Mesajlara Git
                    </Link>
                  </div>
                )}

                {/* Favorilerim */}
                {activeTab === 'favorites' && (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Favorileriniz</h3>
                    <p className="text-gray-500 mb-4">Beğendiğiniz ilanları burada görebilirsiniz.</p>
                    <Link
                      href="/favoriler"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Favorilerim Sayfasına Git
                    </Link>
                  </div>
                )}

                {/* Analitikler */}
                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    {/* Özet İstatistikler */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-100 text-sm">Bu Ay Görüntülenme</p>
                            <p className="text-2xl font-bold">{Math.floor(userStats.totalViews * 0.3)}</p>
                          </div>
                          <TrendingUp className="w-8 h-8 text-blue-200" />
                        </div>
                        <div className="mt-2 flex items-center text-blue-100 text-sm">
                          <span className="text-green-300">↗ +12%</span>
                          <span className="ml-2">geçen aya göre</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-100 text-sm">Aktif İlanlar</p>
                            <p className="text-2xl font-bold">{userStats.activeListings}</p>
                          </div>
                          <FileText className="w-8 h-8 text-green-200" />
                        </div>
                        <div className="mt-2 flex items-center text-green-100 text-sm">
                          <span className="text-green-300">↗ +5%</span>
                          <span className="ml-2">geçen haftaya göre</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-100 text-sm">Mesaj Oranı</p>
                            <p className="text-2xl font-bold">{userStats.totalMessages > 0 ? Math.round((userStats.totalMessages / userStats.totalViews) * 100) : 0}%</p>
                          </div>
                          <MessageCircle className="w-8 h-8 text-purple-200" />
                        </div>
                        <div className="mt-2 flex items-center text-purple-100 text-sm">
                          <span className="text-green-300">↗ +8%</span>
                          <span className="ml-2">geçen aya göre</span>
                        </div>
                      </div>
                    </div>

                    {/* İlan Performans Grafiği */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">İlan Performansı (Son 30 Gün)</h3>
                      <div className="space-y-4">
                        {userListings.slice(0, 5).map((listing) => (
                          <div key={listing.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-gray-500" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{listing.title}</h4>
                                <p className="text-sm text-gray-500">{listing.category}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{listing.views} görüntülenme</p>
                              <div className="flex items-center text-sm text-gray-500">
                                <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                                <span>+{Math.floor(listing.views * 0.15)} bu hafta</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Kategori Analizi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">En Popüler Kategoriler</h3>
                        <div className="space-y-3">
                          {['Elektronik', 'Ev & Yaşam', 'Moda', 'Spor', 'Kitap'].map((category, index) => (
                            <div key={category} className="flex items-center justify-between">
                              <span className="text-gray-700">{category}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full" 
                                    style={{ width: `${80 - (index * 10)}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-500 w-8">{80 - (index * 10)}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ziyaretçi Analizi</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Mobil Ziyaretçi</span>
                            <span className="font-semibold text-gray-900">68%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Desktop Ziyaretçi</span>
                            <span className="font-semibold text-gray-900">32%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Ortalama Ziyaret Süresi</span>
                            <span className="font-semibold text-gray-900">2:34 dk</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Sayfa Bounce Oranı</span>
                            <span className="font-semibold text-gray-900">23%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detaylı Analitikler Linki */}
                    <div className="text-center">
                      <Link
                        href="/analitikler"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Detaylı Analitikleri Görüntüle
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
