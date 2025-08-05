'use client';

import { useState, useEffect } from 'react';
import {
  StarIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { 
  Sparkles, 
  Clock, 
  TrendingUp, 
  Crown, 
  Shield, 
  FileText, 
  MessageCircle, 
  BarChart3, 
  Bell, 
  Settings, 
  Zap,
  Eye,
  DollarSign,
  Calendar
} from 'lucide-react';

interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon: string;
}

interface PremiumPlan {
  id: string;
  name: string;
  duration: number;
  price: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  createdAt: string;
}

// Premium özellikler - Component dışında tanımlanıyor
const allFeatures: PremiumFeature[] = [
  {
    id: 'feature_1',
    name: 'Öne Çıkan Rozet',
    description: 'İlanınız premium rozeti ile işaretlenir ve daha fazla dikkat çeker',
    price: 15.00,
    category: 'listing',
    icon: 'crown'
  },
  {
    id: 'feature_2',
    name: 'Öncelikli Sıralama',
    description: 'Arama sonuçlarında üst sıralarda görünürsünüz',
    price: 25.00,
    category: 'listing',
    icon: 'trendingUp'
  },
  {
    id: 'feature_3',
    name: 'Güvenilir Satıcı Rozeti',
    description: 'Premium satıcı rozeti kazanın ve güven oluşturun',
    price: 20.00,
    category: 'profile',
    icon: 'shield'
  },
  {
    id: 'feature_4',
    name: 'Maksimum 5 Resim',
    description: 'İlanınızda 5 resme kadar yükleyebilirsiniz',
    price: 10.00,
    category: 'listing',
    icon: 'sparkles'
  },
  {
    id: 'feature_5',
    name: 'Maksimum 5 İlan',
    description: 'Aynı anda 5 adet ilan yayınlayabilirsiniz',
    price: 30.00,
    category: 'listing',
    icon: 'fileText'
  },

  {
    id: 'feature_7',
    name: 'Gelişmiş Analitikler',
    description: 'İlan performansınızı detaylı olarak takip edin',
    price: 20.00,
    category: 'analytics',
    icon: 'barChart3'
  },
  {
    id: 'feature_8',
    name: 'Özel Bildirimler',
    description: 'Özel bildirim tercihleri ve gelişmiş uyarılar',
    price: 15.00,
    category: 'communication',
    icon: 'bell'
  },
  {
    id: 'feature_9',
    name: 'Profil Özelleştirme',
    description: 'Profilinizi özelleştirin ve daha profesyonel görünün',
    price: 12.00,
    category: 'profile',
    icon: 'settings'
  },
  {
    id: 'feature_10',
    name: 'Hızlı İlan Yayınlama',
    description: 'İlanlarınızı daha hızlı yayınlayın',
    price: 18.00,
    category: 'listing',
    icon: 'zap'
  }
];

export default function PremiumPlansPage() {
  const [plans, setPlans] = useState<PremiumPlan[]>([]);
  const [features, setFeatures] = useState<PremiumFeature[]>([]);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<PremiumPlan>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlan, setNewPlan] = useState<Partial<PremiumPlan>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
    setFeatures(allFeatures);
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/premium-plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      }
    } catch (error) {
      console.error('Premium planları getirme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFeatureIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      crown: <Crown className="w-4 h-4" />,
      trendingUp: <TrendingUp className="w-4 h-4" />,
      shield: <Shield className="w-4 h-4" />,
      sparkles: <Sparkles className="w-4 h-4" />,
      fileText: <FileText className="w-4 h-4" />,
      messageCircle: <MessageCircle className="w-4 h-4" />,
      barChart3: <BarChart3 className="w-4 h-4" />,
      bell: <Bell className="w-4 h-4" />,
      settings: <Settings className="w-4 h-4" />,
      zap: <Zap className="w-4 h-4" />
    };
    return iconMap[iconName] || <Sparkles className="w-4 h-4" />;
  };

  const calculatePlanValue = (planFeatures: string[]) => {
    return allFeatures
      .filter(feature => planFeatures.includes(feature.id))
      .reduce((total, feature) => total + feature.price, 0);
  };

  const handleEditPlan = (plan: PremiumPlan) => {
    setEditingPlan(plan.id);
    setEditValues(plan);
  };

  const handleSavePlan = async () => {
    if (!editingPlan) return;

    try {
      const response = await fetch('/api/premium-plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingPlan, ...editValues }),
      });

      if (response.ok) {
        setPlans(prev => prev.map(plan => 
          plan.id === editingPlan ? { ...plan, ...editValues } : plan
        ));
        setEditingPlan(null);
        setEditValues({});
      }
    } catch (error) {
      console.error('Plan güncelleme hatası:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
    setEditValues({});
  };

  const handleAddPlan = async () => {
    if (!newPlan.name || !newPlan.price || !newPlan.duration) {
      alert('Lütfen gerekli alanları doldurun');
      return;
    }

    try {
      const response = await fetch('/api/premium-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlan),
      });

      if (response.ok) {
        const addedPlan = await response.json();
        setPlans(prev => [...prev, addedPlan]);
        setShowAddForm(false);
        setNewPlan({});
      }
    } catch (error) {
      console.error('Plan ekleme hatası:', error);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Bu planı silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/premium-plans/${planId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPlans(prev => prev.filter(plan => plan.id !== planId));
      }
    } catch (error) {
      console.error('Plan silme hatası:', error);
    }
  };

  const toggleFeature = (featureId: string) => {
    const currentFeatures = editValues.features || [];
    const newFeatures = currentFeatures.includes(featureId)
      ? currentFeatures.filter(id => id !== featureId)
      : [...currentFeatures, featureId];
    
    setEditValues(prev => ({ ...prev, features: newFeatures }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-alo-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-gray-900">Premium Plan Yönetimi</h1>
        <p className="mt-2 text-sm text-gray-700">
          Premium planları oluşturun, düzenleyin ve yönetin.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StarIcon className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Toplam Plan</dt>
                  <dd className="text-lg font-medium text-gray-900">{plans.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">En Yüksek Fiyat</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {plans.length > 0 ? Math.max(...plans.map(p => p.price)) : 0} ₺
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
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">En Uzun Süre</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {plans.length > 0 ? Math.max(...plans.map(p => p.duration)) : 0} gün
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
                <Eye className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Aktif Planlar</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {plans.filter(p => p.isActive).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Plan Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-alo-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Yeni Plan Ekle
        </button>
      </div>

      {/* Add New Plan Form */}
      {showAddForm && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Yeni Premium Plan Ekle</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Plan Adı</label>
                <input
                  type="text"
                  value={newPlan.name || ''}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-alo-orange focus:ring-alo-orange sm:text-sm"
                  placeholder="Aylık Premium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fiyat (₺)</label>
                <input
                  type="number"
                  value={newPlan.price || ''}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-alo-orange focus:ring-alo-orange sm:text-sm"
                  placeholder="49.99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Süre (Gün)</label>
                <input
                  type="number"
                  value={newPlan.duration || ''}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-alo-orange focus:ring-alo-orange sm:text-sm"
                  placeholder="30"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newPlan.isPopular || false}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, isPopular: e.target.checked }))}
                  className="h-4 w-4 text-alo-orange focus:ring-alo-orange border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Popüler Plan</label>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Özellikler</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {allFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(newPlan.features || []).includes(feature.id)}
                      onChange={() => {
                        const currentFeatures = newPlan.features || [];
                        const newFeatures = currentFeatures.includes(feature.id)
                          ? currentFeatures.filter(id => id !== feature.id)
                          : [...currentFeatures, feature.id];
                        setNewPlan(prev => ({ ...prev, features: newFeatures }));
                      }}
                      className="h-4 w-4 text-alo-orange focus:ring-alo-orange border-gray-300 rounded"
                    />
                    <div className="ml-2 flex items-center">
                      <span className="text-gray-600 mr-2">{getFeatureIcon(feature.icon)}</span>
                      <span className="text-sm text-gray-900">{feature.name}</span>
                      <span className="text-xs text-gray-500 ml-1">({feature.price}₺)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleAddPlan}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-alo-orange hover:bg-orange-600"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white shadow rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all">
            <div className="px-4 py-5 sm:p-6">
              {/* Plan Header */}
              <div className="mb-4 flex flex-col items-center">
                <Sparkles className="w-6 h-6 text-alo-orange mb-1" />
                <h3 className="text-xl font-bold text-alo-orange text-center">{plan.name}</h3>
                {plan.isPopular && (
                  <span className="mt-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    POPÜLER
                  </span>
                )}
              </div>

              {/* Plan Details */}
              <div className="flex flex-col items-center mb-4">
                <div className="text-3xl font-extrabold text-gray-900 mb-1">{plan.price.toLocaleString('tr-TR')} ₺</div>
                <div className="text-base text-gray-500 mb-2">{plan.duration} gün</div>
                <div className="text-sm text-green-600 font-medium">
                  Değer: {calculatePlanValue(plan.features).toLocaleString('tr-TR')} ₺
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <StarIcon className="h-6 w-6 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-600">{plan.features.length} özellik</span>
                </div>
                <div className="flex space-x-2">
                  {editingPlan === plan.id ? (
                    <>
                      <button
                        onClick={handleSavePlan}
                        className="text-green-600 hover:text-green-900"
                        title="Kaydet"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-600 hover:text-gray-900"
                        title="İptal"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditPlan(plan)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Düzenle"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Sil"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Edit Form or Features List */}
              {editingPlan === plan.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Plan Adı</label>
                    <input
                      type="text"
                      value={editValues.name || ''}
                      onChange={(e) => setEditValues(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-alo-orange focus:ring-alo-orange sm:text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fiyat (₺)</label>
                      <input
                        type="number"
                        value={editValues.price || ''}
                        onChange={(e) => setEditValues(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-alo-orange focus:ring-alo-orange sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Süre (Gün)</label>
                      <input
                        type="number"
                        value={editValues.duration || ''}
                        onChange={(e) => setEditValues(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-alo-orange focus:ring-alo-orange sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editValues.isPopular || false}
                      onChange={(e) => setEditValues(prev => ({ ...prev, isPopular: e.target.checked }))}
                      className="h-4 w-4 text-alo-orange focus:ring-alo-orange border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Popüler Plan</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Özellikler</label>
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                      {allFeatures.map((feature) => (
                        <div key={feature.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(editValues.features || []).includes(feature.id)}
                            onChange={() => toggleFeature(feature.id)}
                            className="h-4 w-4 text-alo-orange focus:ring-alo-orange border-gray-300 rounded"
                          />
                          <div className="ml-2 flex items-center">
                            <span className="text-gray-600 mr-2">{getFeatureIcon(feature.icon)}</span>
                            <span className="text-sm text-gray-900">{feature.name}</span>
                            <span className="text-xs text-gray-500 ml-1">({feature.price}₺)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <ul className="space-y-2">
                    {plan.features.map((featureId) => {
                      const feature = allFeatures.find(f => f.id === featureId);
                      if (!feature) return null;
                      
                      return (
                        <li key={featureId} className="flex items-center">
                          <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                          <div className="flex items-center">
                            <span className="text-gray-600 mr-2">{getFeatureIcon(feature.icon)}</span>
                            <span className="text-sm text-gray-700">{feature.name}</span>
                            <span className="text-xs text-gray-500 ml-1">({feature.price}₺)</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
