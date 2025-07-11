"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/Providers";
import { useToast } from "@/components/ToastProvider";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { StatCard, MetricGrid, BarChart, ChartData } from '@/components/ui/charts';

export default function AdminKullanicilarPage() {
  const { session, isLoading } = useAuth();
  const user = session?.user;
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [premiumFilter, setPremiumFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('joinedAt');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const { showToast } = useToast();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("alo17-session")}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Kullanıcılar yüklenemedi");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${localStorage.getItem("alo17-session")}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Kullanıcı silinemedi");
        showToast(errData.error || "Kullanıcı silinemedi", "error");
      } else {
        setSuccess("Kullanıcı silindi");
        showToast("Kullanıcı silindi", "success");
        fetchUsers();
      }
    } catch (err) {
      setError("Kullanıcı silinemedi");
      showToast("Kullanıcı silinemedi", "error");
    }
    setLoading(false);
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("alo17-session")}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Rol güncellenemedi");
        showToast(errData.error || "Rol güncellenemedi", "error");
      } else {
        setSuccess("Rol güncellendi");
        showToast("Rol güncellendi", "success");
        fetchUsers();
      }
    } catch (err) {
      setError("Rol güncellenemedi");
      showToast("Rol güncellenemedi", "error");
    }
    setLoading(false);
  };

  const filteredUsers = users
    .filter(user => {
      if (search && !user.name.toLowerCase().includes(search.toLowerCase()) && 
          !user.email.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (statusFilter !== 'all' && user.status !== statusFilter) {
        return false;
      }
      if (premiumFilter === 'premium' && !user.isPremium) {
        return false;
      }
      if (premiumFilter === 'non-premium' && user.isPremium) {
        return false;
      }
      if (verifiedFilter === 'verified' && !user.verified) {
        return false;
      }
      if (verifiedFilter === 'unverified' && user.verified) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'joinedAt':
          return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
        case 'listings':
          return b.listings - a.listings;
        case 'lastLogin':
          return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime();
        case 'totalViews':
          return b.totalViews - a.totalViews;
        default:
          return 0;
      }
    });

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleSuspendUser = async (userId: number) => {
    if (confirm('Bu kullanıcıyı askıya almak istediğinizden emin misiniz?')) {
      // API call to suspend user
      console.log('Suspending user:', userId);
    }
  };

  const handleActivateUser = async (userId: number) => {
    if (confirm('Bu kullanıcıyı aktif hale getirmek istediğinizden emin misiniz?')) {
      // API call to activate user
      console.log('Activating user:', userId);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      // API call to delete user
      console.log('Deleting user:', userId);
    }
  };

  // Chart data
  const userStatusData: ChartData[] = [
    { label: 'Aktif', value: users.filter(u => u.status === 'active').length, color: '#10b981' },
    { label: 'Askıya Alınmış', value: users.filter(u => u.status === 'suspended').length, color: '#ef4444' },
  ];

  const userTypeData: ChartData[] = [
    { label: 'Premium', value: users.filter(u => u.isPremium).length, color: '#f59e0b' },
    { label: 'Standart', value: users.filter(u => !u.isPremium).length, color: '#6b7280' },
  ];

  if (isLoading) {
    return <div className="p-8">Yükleniyor...</div>;
  }
  if (!user || user.role !== "admin") {
    return <div className="p-8 text-red-600">Yetkisiz erişim</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
        <p className="mt-2 text-sm text-gray-700">
          Sistemdeki tüm kullanıcıları görüntüleyin ve yönetin.
        </p>
      </div>

      {/* Stats */}
      <MetricGrid>
        <StatCard
          title="Toplam Kullanıcı"
          value={users.length}
          icon={<UserIcon className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Premium Kullanıcı"
          value={users.filter(u => u.isPremium).length}
          icon={<StarIcon className="h-6 w-6" />}
          color="yellow"
        />
        <StatCard
          title="Aktif Kullanıcı"
          value={users.filter(u => u.status === 'active').length}
          icon={<CheckCircleIcon className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Doğrulanmış"
          value={users.filter(u => u.verified).length}
          icon={<CheckCircleIcon className="h-6 w-6" />}
          color="purple"
        />
      </MetricGrid>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarChart
          data={userStatusData}
          title="Kullanıcı Durumları"
        />
        <BarChart
          data={userTypeData}
          title="Kullanıcı Tipleri"
        />
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Arama
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  id="search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="İsim veya email..."
                />
                <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Durum
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">Tümü</option>
                <option value="active">Aktif</option>
                <option value="suspended">Askıya Alınmış</option>
              </select>
            </div>

            {/* Premium Filter */}
            <div>
              <label htmlFor="premium" className="block text-sm font-medium text-gray-700">
                Premium
              </label>
              <select
                id="premium"
                value={premiumFilter}
                onChange={(e) => setPremiumFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">Tümü</option>
                <option value="premium">Premium</option>
                <option value="non-premium">Premium Değil</option>
              </select>
            </div>

            {/* Verified Filter */}
            <div>
              <label htmlFor="verified" className="block text-sm font-medium text-gray-700">
                Doğrulama
              </label>
              <select
                id="verified"
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">Tümü</option>
                <option value="verified">Doğrulanmış</option>
                <option value="unverified">Doğrulanmamış</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
                Sıralama
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="joinedAt">Kayıt Tarihi</option>
                <option value="name">İsim</option>
                <option value="listings">İlan Sayısı</option>
                <option value="lastLogin">Son Giriş</option>
                <option value="totalViews">Görüntülenme</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-auto rounded-lg">
            <table className="w-full border min-w-[600px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Ad</th>
                  <th className="p-2 text-left">E-posta</th>
                  <th className="p-2 text-left">Rol</th>
                  <th className="p-2 text-left">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="p-2 whitespace-nowrap">{u.name || "-"}</td>
                    <td className="p-2 whitespace-nowrap">{u.email}</td>
                    <td className="p-2 whitespace-nowrap">{u.role}</td>
                    <td className="p-2 flex gap-2 whitespace-nowrap">
                      <button 
                        onClick={() => handleViewUser(u)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Detayları Görüntüle"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleViewUser(u)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Düzenle"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      {u.status === 'active' ? (
                        <button 
                          onClick={() => handleSuspendUser(u.id)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Askıya Al"
                        >
                          <XCircleIcon className="h-4 w-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleActivateUser(u.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Aktifleştir"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(u.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Sil"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                      {u.role !== "superadmin" && (
                        <button
                          onClick={() => handleRoleChange(u.id, "superadmin")}
                          className="bg-purple-700 text-white px-3 py-1 rounded"
                          disabled={loading}
                        >
                          Süper Admin Yap
                        </button>
                      )}
                      {u.role === "superadmin" && (
                        <button
                          onClick={() => handleRoleChange(u.id, "admin")}
                          className="bg-blue-700 text-white px-3 py-1 rounded"
                          disabled={loading}
                        >
                          Admin Yap
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Kullanıcı bulunamadı</h3>
              <p className="mt-1 text-sm text-gray-500">
                Seçtiğiniz kriterlere uygun kullanıcı bulunamadı.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Kullanıcı Detayları</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-lg font-medium text-white">
                      {selectedUser.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h4 className="text-lg font-medium text-gray-900">{selectedUser.name}</h4>
                      {selectedUser.verified && (
                        <CheckCircleIcon className="ml-2 h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">{selectedUser.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">
                      {new Date(selectedUser.joinedAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ChartBarIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">{selectedUser.listings} ilan</span>
                  </div>
                  <div className="flex items-center">
                    <EyeIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">{selectedUser.totalViews.toLocaleString('tr-TR')} görüntülenme</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowUserModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Kapat
                    </button>
                    <button
                      onClick={() => {
                        setShowUserModal(false);
                        // Handle edit
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Düzenle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 