'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { listingTypes, listingStatus, Listing } from '@/types/listings';
import MessagesBox from './mesajlar/MessagesBox';
import { ListingCard } from '@/components/listing-card';
// import { toast } from 'react-hot-toast';
import { useToast } from '@/components/ToastProvider';

// Örnek veri
const user = {
  name: 'Ahmet Yılmaz',
  email: 'ahmet@example.com',
  phone: '+90 555 123 4567',
  location: 'Kadıköy, İstanbul',
  memberSince: '2023',
  avatar: '/images/avatar.jpg',
};

const listings = [
  {
    id: 1,
    title: 'Sahibinden Satılık Lüks Daire',
    price: '2.450.000',
    location: 'Kadıköy, İstanbul',
    category: 'Ev & Yaşam',
    subcategory: 'Daire',
    description: 'Sahibinden satılık lüks daire. 3+1, 180m², deniz manzaralı.',
    images: ['/images/listing1.jpg'],
    date: '2024-02-20',
    condition: 'Yeni',
    type: listingTypes.PREMIUM,
    status: listingStatus.ACTIVE,
    showPhone: true,
    isFavorite: false,
    views: 1234,
    favorites: 5,
    seller: {
      name: 'Ahmet Yılmaz',
      rating: 4.8,
      memberSince: '2023-01-15',
      phone: '0532 123 4567',
      isVerified: true,
    },
    premiumFeatures: {
      isActive: true,
      expiresAt: '2024-04-20',
      isHighlighted: true,
      isFeatured: true,
      isUrgent: false,
    },
  },
  {
    id: 2,
    title: '2019 Model BMW 320i',
    price: '1.850.000',
    location: 'Beşiktaş, İstanbul',
    category: 'Otomobil',
    subcategory: 'BMW',
    description: '2019 model BMW 320i. Otomatik, benzin, 45.000 km.',
    images: ['/images/listing2.jpg'],
    date: '2024-02-19',
    condition: 'İkinci El',
    type: listingTypes.PREMIUM,
    status: listingStatus.PENDING,
    showPhone: true,
    isFavorite: false,
    views: 856,
    favorites: 3,
    seller: {
      name: 'Ahmet Yılmaz',
      rating: 4.8,
      memberSince: '2023-01-15',
      phone: '0532 123 4567',
      isVerified: true,
    },
    premiumFeatures: {
      isActive: true,
      expiresAt: '2024-04-19',
      isHighlighted: false,
      isFeatured: false,
      isUrgent: true,
    },
  },
];

function getFavoriteIds() {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('favorites') || '[]');
}
function setFavoriteIds(ids: number[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('favorites', JSON.stringify(ids));
}

export default function ProfilePage() {
  const router = useRouter();
  const { session, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('listings');
  const [userListings, setUserListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [listingTab, setListingTab] = useState<'active' | 'draft' | 'deleted'>('active');
  const [allListings, setAllListings] = useState<any[]>([]);

  // Kullanıcının ilanlarını çek
  useEffect(() => {
    const fetchUserListings = async () => {
      if (!session?.user?.email) return;
      
      try {
        setLoading(true);
        const response = await fetch('/api/listings');
        if (response.ok) {
          const allListings = await response.json();
          setAllListings(allListings);
          // Kullanıcının ilanlarını filtrele
          const userListings = allListings.filter((listing: any) => 
            listing.email === session.user.email
          );
          setUserListings(userListings);
        }
      } catch (error) {
        console.error('İlanlar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserListings();
  }, [session]);

  const handleDeleteListing = async (id: number) => {
    if (window.confirm('Bu ilanı silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/listings/${id}?userEmail=${session?.user?.email}&userRole=${session?.user?.role}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          alert('İlan başarıyla silindi');
          // Listeyi yenile
          const updatedResponse = await fetch('/api/listings');
          if (updatedResponse.ok) {
            const allListings = await updatedResponse.json();
            const userListings = allListings.filter((listing: any) => 
              listing.email === session?.user?.email
            );
            setUserListings(userListings);
          }
        } else {
          const error = await response.json();
          alert(error.error || 'İlan silinirken hata oluştu');
        }
      } catch (error) {
        console.error('İlan silme hatası:', error);
        alert('İlan silinirken hata oluştu');
      }
    }
  };

  const handleEditListing = (listing: any) => {
    // İlan düzenleme sayfasına yönlendir
    router.push(`/ilan-duzenle/${listing.id}`);
  };

  // İlan statüsünü güncelle
  const handleStatusChange = async (listing: any, newStatus: 'active' | 'draft' | 'deleted') => {
    try {
      const response = await fetch(`/api/listings/${listing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          userEmail: session?.user?.email,
          userRole: session?.user?.role,
        }),
      });
      if (response.ok) {
        alert('İlan durumu güncellendi');
        // Listeyi yenile
        const updatedResponse = await fetch('/api/listings');
        if (updatedResponse.ok) {
          const allListings = await updatedResponse.json();
          const userListings = allListings.filter((l: any) => l.email === session?.user?.email);
          setUserListings(userListings);
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Durum güncellenemedi');
      }
    } catch (error) {
      alert('Durum güncellenemedi');
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        <CheckCircleIcon className="w-3 h-3 mr-1" />
        Yayında
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profil Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    className="rounded-full object-cover"
                  />
                  <button className="absolute bottom-0 right-0 p-2 bg-alo-orange text-white rounded-full hover:bg-alo-light-orange">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-xl font-semibold text-alo-dark">{user.name}</h2>
                <p className="text-sm text-gray-500">Üyelik: {user.memberSince}</p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center text-gray-600">
                  <EnvelopeIcon className="w-5 h-5 mr-2" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="w-5 h-5 mr-2" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  <span>{user.location}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  href="/profil/duzenle"
                  className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-alo-orange hover:text-alo-light-orange"
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Profili Düzenle
                </Link>
              </div>
            </div>
          </div>

          {/* Ana İçerik */}
          <div className="lg:col-span-3">
            {/* Sekmeler */}
            <div className="bg-white rounded-xl shadow-sm mb-6">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'listings'
                      ? 'text-alo-orange border-b-2 border-alo-orange'
                      : 'text-gray-500 hover:text-alo-orange'
                  }`}
                >
                  İlanlarım
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'favorites'
                      ? 'text-alo-orange border-b-2 border-alo-orange'
                      : 'text-gray-500 hover:text-alo-orange'
                  }`}
                >
                  Favorilerim
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'messages'
                      ? 'text-alo-orange border-b-2 border-alo-orange'
                      : 'text-gray-500 hover:text-alo-orange'
                  }`}
                >
                  Mesajlarım
                </button>
                <button
                  onClick={() => setActiveTab('invoices')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'invoices'
                      ? 'text-alo-orange border-b-2 border-alo-orange'
                      : 'text-gray-500 hover:text-alo-orange'
                  }`}
                >
                  Fatura Arşivi
                </button>
              </nav>
            </div>

            {/* İlanlarım */}
            {activeTab === 'listings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-alo-dark">İlanlarım</h3>
                  <Link
                    href="/ilan-ver"
                    className="flex items-center px-4 py-2 bg-alo-orange text-white rounded-lg hover:bg-alo-light-orange"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Yeni İlan Ver
                  </Link>
                </div>

                {/* Durum sekmeleri */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setListingTab('active')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${listingTab === 'active' ? 'bg-alo-orange text-white border-alo-orange' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                  >
                    Yayında
                  </button>
                  <button
                    onClick={() => setListingTab('draft')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${listingTab === 'draft' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                  >
                    Taslak
                  </button>
                  <button
                    onClick={() => setListingTab('deleted')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${listingTab === 'deleted' ? 'bg-gray-500 text-white border-gray-500' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                  >
                    Silinen
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-alo-orange mx-auto"></div>
                    <p className="mt-2 text-gray-600">İlanlar yükleniyor...</p>
                  </div>
                ) : userListings.filter(l => l.status === listingTab).length > 0 ? (
                  <div className="space-y-4">
                    {userListings.filter(l => l.status === listingTab).map((listing) => (
                      <div
                        key={listing.id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="relative w-full md:w-48 h-48">
                            {listing.images && listing.images.length > 0 ? (
                              <img
                                src={listing.images[0]}
                                alt={listing.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">Resim Yok</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-alo-dark mb-2">
                                  {listing.title}
                                </h4>
                                <p className="text-xl font-bold text-alo-red mb-2">
                                  {listing.price} ₺
                                </p>
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                  <MapPinIcon className="w-4 h-4 mr-1" />
                                  {listing.location}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <span className="mr-4">
                                    {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                                  </span>
                                  <span>{listing.views || 0} görüntülenme</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {listingTab === 'active' && (
                                  <>
                                    <button
                                      onClick={() => handleStatusChange(listing, 'draft')}
                                      className="p-2 text-gray-500 hover:text-blue-500"
                                      title="Taslağa Çek"
                                    >
                                      <ClockIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(listing, 'deleted')}
                                      className="p-2 text-gray-500 hover:text-alo-red"
                                      title="Sil"
                                    >
                                      <TrashIcon className="w-5 h-5" />
                                    </button>
                                  </>
                                )}
                                {listingTab === 'draft' && (
                                  <>
                                    <button
                                      onClick={() => handleStatusChange(listing, 'active')}
                                      className="p-2 text-gray-500 hover:text-green-600"
                                      title="Yayına Al"
                                    >
                                      <CheckCircleIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(listing, 'deleted')}
                                      className="p-2 text-gray-500 hover:text-alo-red"
                                      title="Sil"
                                    >
                                      <TrashIcon className="w-5 h-5" />
                                    </button>
                                  </>
                                )}
                                {listingTab === 'deleted' && (
                                  <>
                                    <button
                                      onClick={() => handleStatusChange(listing, 'active')}
                                      className="p-2 text-gray-500 hover:text-green-600"
                                      title="Geri Al (Yayına Al)"
                                    >
                                      <CheckCircleIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteListing(listing.id)}
                                      className="p-2 text-gray-500 hover:text-alo-red"
                                      title="Kalıcı Sil"
                                    >
                                      <TrashIcon className="w-5 h-5" />
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleEditListing(listing)}
                                  className="p-2 text-gray-500 hover:text-alo-orange"
                                  title="Düzenle"
                                  disabled={listingTab === 'deleted'}
                                >
                                  <PencilIcon className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                            <div className="mt-4">
                              {getStatusBadge(listing.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Bu sekmede ilanınız bulunmuyor.</p>
                    {listingTab === 'active' && (
                      <Link
                        href="/ilan-ver"
                        className="inline-flex items-center px-4 py-2 bg-alo-orange text-white rounded-lg hover:bg-alo-light-orange"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        İlk İlanınızı Verin
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Favorilerim */}
            {activeTab === 'favorites' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-alo-dark mb-4">Favorilerim</h3>
                {(() => {
                  const { showToast } = useToast();
                  // Favorilerim için SSR uyumlu state
                  const [favIds, setFavIds] = useState<number[]>([]);
                  useEffect(() => {
                    if (typeof window !== 'undefined') {
                      try {
                        setFavIds(getFavoriteIds());
                      } catch (e) {
                        setFavIds([]);
                        showToast('Favoriler yüklenirken hata oluştu', 'error');
                      }
                    }
                  }, []);
                  const favListings = allListings.filter((l: any) => favIds.includes(l.id));
                  const handleRemoveFavorite = (id: number) => {
                    const newFavs = favIds.filter(favId => favId !== id);
                    setFavIds(newFavs);
                    setFavoriteIds(newFavs);
                    showToast('Favorilerden çıkarıldı', 'info');
                  };
                  const handleClearFavorites = () => {
                    setFavIds([]);
                    setFavoriteIds([]);
                    showToast('Tüm favoriler temizlendi', 'success');
                  };
                  if (favListings.length === 0) {
                    return <div className="text-center py-12">
                      <div className="text-6xl mb-4">💔</div>
                      <p className="text-gray-500 mb-2">Henüz favori ilanınız yok.</p>
                      <p className="text-gray-400">Beğendiğiniz ilanları kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz!</p>
                    </div>;
                  }
                  return (
                    <>
                      <div className="flex justify-end mb-4">
                        <button
                          onClick={handleClearFavorites}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                        >
                          Tüm Favorileri Temizle
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favListings.map((listing: any) => (
                          <div key={listing.id} className="relative group">
                            <ListingCard listing={listing} />
                            <button
                              onClick={() => handleRemoveFavorite(listing.id)}
                              className="absolute top-2 right-2 z-20 bg-white/90 text-red-500 border border-red-200 rounded-full p-2 shadow hover:bg-red-500 hover:text-white transition-colors"
                              title="Favorilerden çıkar"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Mesajlarım */}
            {activeTab === 'messages' && (
              <MessagesBox />
            )}

            {/* Fatura Arşivi */}
            {activeTab === 'invoices' && (
              <InvoiceArchive userEmail={session?.user?.email} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 

function InvoiceArchive({ userEmail }: { userEmail: string | undefined }) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/payments.json');
        const data = await res.json();
        // Sadece giriş yapan kullanıcıya ait faturalar
        setInvoices(data.filter((inv: any) => inv.userEmail === userEmail));
      } catch (err) {
        setError('Faturalar yüklenemedi.');
      }
      setLoading(false);
    };
    if (userEmail) fetchInvoices();
  }, [userEmail]);

  if (!userEmail) return <div className="p-8 text-center text-red-500">Fatura arşivini görmek için giriş yapmalısınız.</div>;
  if (loading) return <div className="p-8 text-center">Yükleniyor...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (invoices.length === 0) return <div className="p-8 text-center text-gray-500">Fatura bulunamadı.</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
      <h3 className="text-lg font-semibold text-alo-dark mb-4">Fatura Arşivim</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fatura No</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td className="px-4 py-2 whitespace-nowrap font-mono">{inv.invoiceNo || inv.id}</td>
              <td className="px-4 py-2 whitespace-nowrap">{new Date(inv.createdAt).toLocaleDateString('tr-TR')}</td>
              <td className="px-4 py-2 whitespace-nowrap">{inv.amount} {inv.currency || '₺'}</td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${inv.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{inv.status === 'paid' ? 'Ödendi' : inv.status}</span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                {inv.pdfUrl && (
                  <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">PDF İndir</a>
                )}
                <button
                  onClick={() => alert('Fatura e-posta ile gönderildi (mock).')}
                  className="px-3 py-1 bg-alo-orange text-white rounded hover:bg-orange-600 text-xs"
                >
                  E-posta Gönder
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 