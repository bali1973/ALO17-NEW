"use client";

import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  StarIcon,
  SparklesIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from "@/components/Providers";
import { useToast } from "@/components/ToastProvider";
import { useCategories } from '@/lib/useCategories';

// İlan tipi tanımı
interface Listing {
  id: string;
  title: string;
  user: string;
  email: string;
  status: string;
  createdAt: string;
  isPremium: boolean;
  premiumFeatures: string[];
  category: string;
  subcategory: string;
  price: string;
  location: string;
  views: number;
  description: string;
}

export default function AdminIlanlarPage() {
  const { session, isLoading } = useAuth();
  const user = session?.user;
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [premiumFilter, setPremiumFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteListingId, setDeleteListingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailListing, setDetailListing] = useState<Listing | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumListing, setPremiumListing] = useState<Listing | null>(null);
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const { categories: allCategories, loading: categoriesLoading } = useCategories();

  const exampleListings = [
    {
      id: "mock-1",
      title: "Turizm & Gecelemeler için örnek ilan",
      user: "Admin User",
      email: "admin@alo17.com",
      status: "active",
      createdAt: new Date().toISOString(),
      isPremium: false,
      premiumFeatures: [],
      category: "Turizm & Gecelemeler",
      subcategory: "",
      price: "1000",
      location: "Çanakkale",
      views: 0,
      description: "Bu bir örnek ilandır.",
      userRole: "admin"
    },
    {
      id: "mock-2",
      title: "Sağlık & Güzellik için örnek ilan",
      user: "Admin User",
      email: "admin@alo17.com",
      status: "active",
      createdAt: new Date().toISOString(),
      isPremium: false,
      premiumFeatures: [],
      category: "Sağlık & Güzellik",
      subcategory: "",
      price: "1000",
      location: "İstanbul",
      views: 0,
      description: "Bu bir örnek ilandır."
    },
    {
      id: "mock-3",
      title: "Ücretsiz Gel-Al için örnek ilan",
      user: "Admin User",
      email: "admin@alo17.com",
      status: "active",
      createdAt: new Date().toISOString(),
      isPremium: false,
      premiumFeatures: [],
      category: "Ücretsiz Gel-Al",
      subcategory: "",
      price: "0",
      location: "Ankara",
      views: 0,
      description: "Bu bir örnek ilandır."
    },
    {
      id: "mock-4",
      title: "Sanat & Hobi için örnek ilan",
      user: "Admin User",
      email: "admin@alo17.com",
      status: "active",
      createdAt: new Date().toISOString(),
      isPremium: false,
      premiumFeatures: [],
      category: "Sanat & Hobi",
      subcategory: "",
      price: "500",
      location: "İzmir",
      views: 0,
      description: "Bu bir örnek ilandır."
    },
    {
      id: "mock-5",
      title: "Sporlar, Oyunlar & Eğlenceler için örnek ilan",
      user: "Admin User",
      email: "admin@alo17.com",
      status: "active",
      createdAt: new Date().toISOString(),
      isPremium: false,
      premiumFeatures: [],
      category: "Sporlar, Oyunlar & Eğlenceler",
      subcategory: "",
      price: "750",
      location: "Bursa",
      views: 0,
      description: "Bu bir örnek ilandır."
    },
    {
      id: "mock-6",
      title: "İş için örnek ilan",
      user: "Admin User",
      email: "admin@alo17.com",
      status: "active",
      createdAt: new Date().toISOString(),
      isPremium: false,
      premiumFeatures: [],
      category: "İş",
      subcategory: "",
      price: "2000",
      location: "Antalya",
      views: 0,
      description: "Bu bir örnek ilandır."
    },
    {
      id: "mock-7",
      title: "Ev & Bahçe için örnek ilan",
      user: "Admin User",
      email: "admin@alo17.com",
      status: "active",
      createdAt: new Date().toISOString(),
      isPremium: false,
      premiumFeatures: [],
      category: "Ev & Bahçe",
      subcategory: "",
      price: "1200",
      location: "Eskişehir",
      views: 0,
      description: "Bu bir örnek ilandır."
    },
    {
      id: "mock-8",
      title: "Yemek & İçecek için örnek ilan",
      user: "Admin User",
      email: "admin@alo17.com",
      status: "active",
      createdAt: new Date().toISOString(),
      isPremium: false,
      premiumFeatures: [],
      category: "Yemek & İçecek",
      subcategory: "",
      price: "300",
      location: "Adana",
      views: 0,
      description: "Bu bir örnek ilandır."
    },
    {
      id: "mock-9",
      title: "Hizmetler için örnek ilan",
      user: "Admin User",
      email: "admin@alo17.com",
      status: "active",
      createdAt: new Date().toISOString(),
      isPremium: false,
      premiumFeatures: [],
      category: "Hizmetler",
      subcategory: "",
      price: "400",
      location: "Konya",
      views: 0,
      description: "Bu bir örnek ilandır."
    },
    {
      id: "mock-10",
      title: "Giyim için örnek ilan",
      user: "Admin User",
      email: "admin@alo17.com",
      status: "active",
      createdAt: new Date().toISOString(),
      isPremium: false,
      premiumFeatures: [],
      category: "Giyim",
      subcategory: "",
      price: "250",
      location: "Samsun",
      views: 0,
      description: "Bu bir örnek ilandır."
    },
    {
      id: "mock-11",
      title: "Elektronik için örnek ilan",
      user: "Admin User",
      email: "admin@alo17.com",
      status: "active",
      createdAt: new Date().toISOString(),
      isPremium: false,
      premiumFeatures: [],
      category: "Elektronik",
      subcategory: "",
      price: "1500",
      location: "Tekirdağ",
      views: 0,
      description: "Bu bir örnek ilandır."
    },
  ];

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/listings');
      if (response.ok) {
        const data = await response.json();
        setListings([...data, ...exampleListings]); // <-- Örnekleri daima ekle
      } else {
        const errorText = await response.text();
        console.error('Admin panel - API hatası:', errorText);
        setError('İlanlar yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('İlanlar yüklenirken hata oluştu:', error);
      setError('İlanlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    // Sadece ilk yüklemede örnek ilanları ekle
    if (listings.length > 0 && !listings.some(l => l.id.startsWith('mock-'))) {
      setListings(prev => [...prev, ...exampleListings]);
    }
  }, [listings]);

  const filteredListings = listings
    .filter(listing => {
      if (search && !listing.title.toLowerCase().includes(search.toLowerCase()) && 
          !listing.user.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (statusFilter !== 'all' && listing.status !== statusFilter) {
        return false;
      }
      if (categoryFilter !== 'all' && listing.category !== categoryFilter) {
        return false;
      }
      if (premiumFilter === 'premium' && !listing.isPremium) {
        return false;
      }
      if (premiumFilter === 'non-premium' && listing.isPremium) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'price':
          return parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, ''));
        case 'views':
          return b.views - a.views;
        default:
          return 0;
      }
    });

  const showMessage = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccess(message);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleApprove = async (id: string) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/admin/listings/${id}/approve`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${localStorage.getItem("alo17-session")}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "İlan onaylanamadı");
        showToast(errData.error || "İlan onaylanamadı", "error");
      } else {
        setSuccess("İlan onaylandı");
        showToast("İlan onaylandı", "success");
        fetchListings();
      }
    } catch (err) {
      setError("İlan onaylanamadı");
      showToast("İlan onaylanamadı", "error");
    }
    setLoading(false);
  };

  const handleReject = async (id: string) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/admin/listings/${id}/reject`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${localStorage.getItem("alo17-session")}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "İlan reddedilemedi");
        showToast(errData.error || "İlan reddedilemedi", "error");
      } else {
        setSuccess("İlan reddedildi");
        showToast("İlan reddedildi", "success");
        fetchListings();
      }
    } catch (err) {
      setError("İlan reddedilemedi");
      showToast("İlan reddedilemedi", "error");
    }
    setLoading(false);
  };

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
    setShowEditModal(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/admin/listings/${id}/delete`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${localStorage.getItem("alo17-session")}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "İlan silinemedi");
        showToast(errData.error || "İlan silinemedi", "error");
      } else {
        setSuccess("İlan silindi");
        showToast("İlan silindi", "success");
        fetchListings();
      }
    } catch (err) {
      setError("İlan silinemedi");
      showToast("İlan silinemedi", "error");
    }
    setLoading(false);
  };

  const handleViewDetail = (listing: Listing) => {
    setDetailListing(listing);
    setShowDetailModal(true);
  };

  const handleSelectListing = (id: string) => {
    setSelectedListings(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedListings.length === filteredListings.length) {
      setSelectedListings([]);
    } else {
      setSelectedListings(filteredListings.map(listing => listing.id));
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject' | 'delete') => {
    if (selectedListings.length === 0) return;

    try {
      setActionLoading('bulk');
      setError(null);
      
      const promises = selectedListings.map(id => {
        switch (action) {
          case 'approve':
            return fetch(`/api/listings/${id}/approve`, { method: 'PUT' });
          case 'reject':
            return fetch(`/api/listings/${id}/reject`, { method: 'PUT' });
          case 'delete':
            return fetch(`/api/listings/${id}`, { method: 'DELETE' });
        }
      });

      await Promise.all(promises);
      
      showMessage(`${selectedListings.length} ilan başarıyla ${action === 'approve' ? 'onaylandı' : action === 'reject' ? 'reddedildi' : 'silindi'}`, 'success');
      
      // Listeyi yenile
      const updatedResponse = await fetch('/api/admin/listings');
      if (updatedResponse.ok) {
        const data = await updatedResponse.json();
        setListings(data);
      }
      
      setSelectedListings([]);
    } catch (error) {
      console.error('Toplu işlem hatası:', error);
      showMessage('Toplu işlem sırasında hata oluştu', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Başlık', 'Kullanıcı', 'Email', 'Kategori', 'Alt Kategori', 'Fiyat', 'Konum', 'Durum', 'Görüntüleme', 'Tarih'];
    const csvContent = [
      headers.join(','),
      ...filteredListings.map(listing => [
        listing.id,
        `"${listing.title}"`,
        `"${listing.user}"`,
        `"${listing.email}"`,
        `"${listing.category}"`,
        `"${listing.subcategory}"`,
        `"${listing.price}"`,
        `"${listing.location}"`,
        `"${listing.status}"`,
        listing.views,
        `"${new Date(listing.createdAt).toLocaleDateString('tr-TR')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ilanlar_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePremiumManagement = (listing: Listing) => {
    setPremiumListing(listing);
    setShowPremiumModal(true);
  };

  const handleSavePremium = async (isPremium: boolean, features: string[]) => {
    if (!premiumListing) return;

    try {
      setActionLoading(premiumListing.id);
      setError(null);
      
      const response = await fetch(`/api/listings/${premiumListing.id}/premium`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPremium,
          premiumFeatures: features,
          premiumPlan: isPremium ? 'admin' : null,
        }),
      });
      
      if (response.ok) {
        showMessage(`Premium özellikler başarıyla ${isPremium ? 'aktifleştirildi' : 'devre dışı bırakıldı'}`, 'success');
        // Listeyi yenile
        const updatedResponse = await fetch('/api/admin/listings');
        if (updatedResponse.ok) {
          const data = await updatedResponse.json();
          setListings(data);
        }
      } else {
        const errorText = await response.text();
        showMessage(`Premium özellik güncelleme hatası: ${errorText}`, 'error');
      }
    } catch (error) {
      console.error('Premium özellik güncelleme hatası:', error);
      showMessage('Premium özellikler güncellenirken hata oluştu', 'error');
    } finally {
      setShowPremiumModal(false);
      setPremiumListing(null);
      setActionLoading(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteListingId) return;

    try {
      setActionLoading(deleteListingId);
      setError(null);
      const response = await fetch(`/api/admin/listings/${deleteListingId}/delete`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        showMessage('İlan başarıyla silindi', 'success');
        // Listeyi yenile
        const updatedResponse = await fetch('/api/admin/listings');
        if (updatedResponse.ok) {
          const data = await updatedResponse.json();
          setListings(data);
        }
      } else {
        const errorText = await response.text();
        showMessage(`İlan silme hatası: ${errorText}`, 'error');
      }
    } catch (error) {
      console.error('İlan silme hatası:', error);
      showMessage('İlan silinirken hata oluştu', 'error');
    } finally {
      setShowDeleteModal(false);
      setDeleteListingId(null);
      setActionLoading(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingListing) return;

    try {
      setActionLoading(editingListing.id);
      setError(null);
      const response = await fetch(`/api/admin/listings/${editingListing.id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingListing),
      });
      
      if (response.ok) {
        showMessage('İlan başarıyla güncellendi', 'success');
        // Listeyi yenile
        const updatedResponse = await fetch('/api/admin/listings');
        if (updatedResponse.ok) {
          const data = await updatedResponse.json();
          setListings(data);
        }
      } else {
        const errorText = await response.text();
        showMessage(`İlan güncelleme hatası: ${errorText}`, 'error');
      }
    } catch (error) {
      console.error('İlan güncelleme hatası:', error);
      showMessage('İlan güncellenirken hata oluştu', 'error');
    } finally {
      setShowEditModal(false);
      setEditingListing(null);
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Beklemede</span>;
      case 'active':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Aktif</span>;
      case 'rejected':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Reddedildi</span>;
      default:
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getPremiumFeatures = (features: string[]) => {
    return features.map((feature, index) => {
      let icon, text, color;
      switch (feature) {
        case 'featured':
          icon = <StarIcon className="h-3 w-3" />;
          text = 'Öne Çıkan';
          color = 'bg-blue-100 text-blue-800';
          break;
        case 'urgent':
          icon = <ClockIcon className="h-3 w-3" />;
          text = 'Acil';
          color = 'bg-red-100 text-red-800';
          break;
        case 'highlighted':
          icon = <SparklesIcon className="h-3 w-3" />;
          text = 'Vurgulanmış';
          color = 'bg-purple-100 text-purple-800';
          break;
        default:
          return null;
      }
      
      return (
        <span key={index} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color} mr-1`}>
          {icon}
          <span className="ml-1">{text}</span>
        </span>
      );
    });
  };

  if (isLoading) {
    return <div className="p-8">Yükleniyor...</div>;
  }
  if (!session || !user || user.role !== "admin") {
    return <div className="p-8 text-red-600">Yetkisiz erişim</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-900">İlan Yönetimi</h1>
        <p className="mt-2 text-sm text-gray-700">
          Sistemdeki tüm ilanları görüntüleyin, onaylayın, reddedin, düzenleyin veya silin.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XMarkIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 bg-blue-500 rounded"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Toplam İlan</dt>
                  <dd className="text-lg font-medium text-gray-900">{listings.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 bg-green-500 rounded"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Aktif İlan</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {listings.filter(l => l.status === 'active').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 bg-blue-500 rounded"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Toplam İlan</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {listings.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 bg-purple-500 rounded"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Premium İlan</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {listings.filter(l => l.isPremium).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="İlan ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tüm İlanlar</option>
            <option value="active">Aktif</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            disabled={categoriesLoading}
          >
            <option value="all">Tüm Kategoriler</option>
            {allCategories.map(cat => (
              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
            ))}
          </select>

          {/* Premium Filter */}
          <select
            value={premiumFilter}
            onChange={(e) => setPremiumFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tüm İlanlar</option>
            <option value="premium">Premium</option>
            <option value="non-premium">Normal</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="createdAt">Tarihe Göre</option>
            <option value="title">Başlığa Göre</option>
            <option value="price">Fiyata Göre</option>
            <option value="views">Görüntülemeye Göre</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              title="Tablo Görünümü"
            >
              <ListBulletIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              title="Grid Görünümü"
            >
              <Squares2X2Icon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedListings.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedListings.length} ilan seçildi
                </span>
                <button
                  onClick={() => setSelectedListings([])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Seçimi Temizle
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('approve')}
                  disabled={actionLoading === 'bulk'}
                  className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {actionLoading === 'bulk' ? 'İşleniyor...' : 'Toplu Onayla'}
                </button>
                <button
                  onClick={() => handleBulkAction('reject')}
                  disabled={actionLoading === 'bulk'}
                  className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading === 'bulk' ? 'İşleniyor...' : 'Toplu Reddet'}
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  disabled={actionLoading === 'bulk'}
                  className="px-3 py-1 text-sm font-medium text-white bg-red-800 rounded-md hover:bg-red-900 disabled:opacity-50"
                >
                  {actionLoading === 'bulk' ? 'İşleniyor...' : 'Toplu Sil'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Export Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            CSV İndir
          </button>
        </div>
      </div>

      {/* Listings Display */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <EyeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">İlan bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || premiumFilter !== 'all'
                ? 'Arama kriterlerinize uygun ilan bulunamadı. Filtreleri değiştirmeyi deneyin.'
                : 'Henüz hiç ilan yok.'}
            </p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="overflow-auto rounded-lg">
            <table className="w-full border min-w-[600px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Başlık</th>
                  <th className="p-2 text-left">Durum</th>
                  <th className="p-2 text-left">Oluşturan</th>
                  <th className="p-2 text-left">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((l) => (
                  <tr key={l.id} className="border-t">
                    <td className="p-2 whitespace-nowrap">{l.title}</td>
                    <td className="p-2 whitespace-nowrap">{l.status}</td>
                    <td className="p-2 whitespace-nowrap">{l.user || "-"}</td>
                    <td className="p-2 flex gap-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(l)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded mr-2"
                        title="Düzenle"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(l.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                        title="Sil"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <input
                        type="checkbox"
                        checked={selectedListings.includes(listing.id)}
                        onChange={() => handleSelectListing(listing.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {getStatusBadge(listing.status)}
                    </div>
                    
                    <div className="mb-3">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-gray-500">{listing.location}</p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Kategori:</span>
                        <span className="text-gray-900">{listing.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Fiyat:</span>
                        <span className="text-gray-900 font-medium">{listing.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Görüntüleme:</span>
                        <span className="text-gray-900">{listing.views}</span>
                      </div>
                    </div>

                    {listing.isPremium && (
                      <div className="mb-4">
                        {getPremiumFeatures(listing.premiumFeatures)}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>{listing.user}</span>
                      <span>{new Date(listing.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>

                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleViewDetail(listing)}
                        className="p-1 text-gray-600 hover:text-gray-900"
                        title="Detayları Görüntüle"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {listing.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(listing.id)}
                            disabled={actionLoading === listing.id}
                            className={`p-1 text-green-600 hover:text-green-900 ${actionLoading === listing.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Onayla"
                          >
                            {actionLoading === listing.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            ) : (
                              <CheckIcon className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleReject(listing.id)}
                            disabled={actionLoading === listing.id}
                            className={`p-1 text-red-600 hover:text-red-900 ${actionLoading === listing.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Reddet"
                          >
                            {actionLoading === listing.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <XMarkIcon className="h-4 w-4" />
                            )}
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleEdit(listing)}
                        disabled={actionLoading === listing.id}
                        className={`p-1 text-blue-600 hover:text-blue-900 ${actionLoading === listing.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Düzenle"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                                              <button
                          onClick={() => handleDelete(listing.id)}
                          disabled={actionLoading === listing.id}
                          className={`p-1 text-red-600 hover:text-red-900 ${actionLoading === listing.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title="Sil"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handlePremiumManagement(listing)}
                          disabled={actionLoading === listing.id}
                          className={`p-1 ${listing.isPremium ? 'text-yellow-600 hover:text-yellow-900' : 'text-gray-600 hover:text-gray-900'} ${actionLoading === listing.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title="Premium Yönetimi"
                        >
                          <StarIcon className="h-4 w-4" />
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingListing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">İlan Düzenle</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Başlık</label>
                  <input
                    type="text"
                    value={editingListing.title}
                    onChange={(e) => setEditingListing({...editingListing, title: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                  <textarea
                    value={editingListing.description}
                    onChange={(e) => setEditingListing({...editingListing, description: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fiyat</label>
                  <input
                    type="text"
                    value={editingListing.price}
                    onChange={(e) => setEditingListing({...editingListing, price: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Konum</label>
                  <input
                    type="text"
                    value={editingListing.location}
                    onChange={(e) => setEditingListing({...editingListing, location: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  disabled={actionLoading === editingListing.id}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  İptal
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={actionLoading === editingListing.id}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {actionLoading === editingListing.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Kaydediliyor...
                    </>
                  ) : (
                    'Kaydet'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Management Modal */}
      {showPremiumModal && premiumListing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">Premium Yönetimi</h3>
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">{premiumListing.title}</h4>
                <p className="text-sm text-gray-600">Bu ilanın premium özelliklerini yönetin</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={premiumListing.isPremium}
                      onChange={(e) => setPremiumListing({
                        ...premiumListing,
                        isPremium: e.target.checked
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-900">Premium İlan</span>
                  </label>
                </div>

                {premiumListing.isPremium && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Premium Özellikler</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={premiumListing.premiumFeatures.includes('featured')}
                          onChange={(e) => {
                            const features = e.target.checked
                              ? [...premiumListing.premiumFeatures, 'featured']
                              : premiumListing.premiumFeatures.filter(f => f !== 'featured');
                            setPremiumListing({
                              ...premiumListing,
                              premiumFeatures: features
                            });
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Öne Çıkan</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={premiumListing.premiumFeatures.includes('urgent')}
                          onChange={(e) => {
                            const features = e.target.checked
                              ? [...premiumListing.premiumFeatures, 'urgent']
                              : premiumListing.premiumFeatures.filter(f => f !== 'urgent');
                            setPremiumListing({
                              ...premiumListing,
                              premiumFeatures: features
                            });
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Acil</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={premiumListing.premiumFeatures.includes('highlighted')}
                          onChange={(e) => {
                            const features = e.target.checked
                              ? [...premiumListing.premiumFeatures, 'highlighted']
                              : premiumListing.premiumFeatures.filter(f => f !== 'highlighted');
                            setPremiumListing({
                              ...premiumListing,
                              premiumFeatures: features
                            });
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Vurgulanmış</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowPremiumModal(false)}
                  disabled={actionLoading === premiumListing.id}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  İptal
                </button>
                <button
                  onClick={() => handleSavePremium(premiumListing.isPremium, premiumListing.premiumFeatures)}
                  disabled={actionLoading === premiumListing.id}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {actionLoading === premiumListing.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Kaydediliyor...
                    </>
                  ) : (
                    'Kaydet'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && detailListing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-medium text-gray-900">İlan Detayları</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sol Kolon */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">{detailListing.title}</h4>
                    <p className="text-gray-600">{detailListing.description}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-3">Temel Bilgiler</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fiyat:</span>
                        <span className="font-medium">{detailListing.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Konum:</span>
                        <span>{detailListing.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kategori:</span>
                        <span>{detailListing.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Alt Kategori:</span>
                        <span>{detailListing.subcategory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Durum:</span>
                        <span>{getStatusBadge(detailListing.status)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Görüntüleme:</span>
                        <span>{detailListing.views}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Oluşturulma Tarihi:</span>
                        <span>{new Date(detailListing.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sağ Kolon */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-3">Kullanıcı Bilgileri</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ad Soyad:</span>
                        <span>{detailListing.user}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span>{detailListing.email}</span>
                      </div>
                    </div>
                  </div>

                  {detailListing.isPremium && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-3">Premium Özellikler</h5>
                      <div className="flex flex-wrap gap-2">
                        {getPremiumFeatures(detailListing.premiumFeatures)}
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-3">İşlemler</h5>
                    <div className="flex flex-wrap gap-2">
                      {detailListing.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              handleApprove(detailListing.id);
                              setShowDetailModal(false);
                            }}
                            className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                          >
                            Onayla
                          </button>
                          <button
                            onClick={() => {
                              handleReject(detailListing.id);
                              setShowDetailModal(false);
                            }}
                            className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                          >
                            Reddet
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          handleEdit(detailListing);
                          setShowDetailModal(false);
                        }}
                        className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(detailListing.id);
                          setShowDetailModal(false);
                        }}
                        className="px-3 py-1 text-sm font-medium text-white bg-red-800 rounded-md hover:bg-red-900"
                      >
                        Sil
                      </button>
                      <button
                        onClick={() => {
                          handlePremiumManagement(detailListing);
                          setShowDetailModal(false);
                        }}
                        className={`px-3 py-1 text-sm font-medium ${detailListing.isPremium ? 'text-white bg-yellow-600 hover:bg-yellow-700' : 'text-white bg-gray-600 hover:bg-gray-700'}`}
                      >
                        Premium
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">İlanı Sil</h3>
              <p className="text-sm text-gray-500 mb-6">
                Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={actionLoading === deleteListingId}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  İptal
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={actionLoading === deleteListingId}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {actionLoading === deleteListingId ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Siliniyor...
                    </>
                  ) : (
                    'Sil'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 