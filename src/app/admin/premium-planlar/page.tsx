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

// Örnek premium plan verileri
const initialPlans = {
  '30days': { name: '30 Günlük Premium', price: 99, days: 30, features: ['Öne çıkan ilanlar', 'Acil ilan', 'Vurgulanmış ilan'] },
  '90days': { name: '90 Günlük Premium', price: 249, days: 90, features: ['Öne çıkan ilanlar', 'Acil ilan', 'Vurgulanmış ilan', 'Üst sıralarda'] },
  '365days': { name: '365 Günlük Premium', price: 799, days: 365, features: ['Tüm premium özellikler', 'Öncelikli destek', 'Özel rozet'] },
};

export default function PremiumPlansPage() {
  const [plans, setPlans] = useState(initialPlans);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ name: '', price: 0, days: 0, features: [''] });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlan, setNewPlan] = useState({ key: '', name: '', price: 0, days: 0, features: [''] });

  const handleEditPlan = (planKey: string) => {
    const plan = plans[planKey as keyof typeof plans];
    setEditingPlan(planKey);
    setEditValues({
      name: plan.name,
      price: plan.price,
      days: plan.days,
      features: [...plan.features],
    });
  };

  const handleSavePlan = async () => {
    if (!editingPlan) return;

    try {
      const response = await fetch('/api/premium-plans', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planKey: editingPlan,
          ...editValues,
        }),
      });

      if (response.ok) {
        setPlans(prev => ({
          ...prev,
          [editingPlan]: editValues,
        }));
        setEditingPlan(null);
        setEditValues({ name: '', price: 0, days: 0, features: [''] });
      } else {
        console.error('Premium plan güncelleme hatası:', await response.text());
      }
    } catch (error) {
      console.error('Premium plan güncelleme hatası:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
    setEditValues({ name: '', price: 0, days: 0, features: [''] });
  };

  const handleAddFeature = () => {
    setEditValues(prev => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setEditValues(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setEditValues(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature),
    }));
  };

  const handleAddPlan = async () => {
    if (!newPlan.key || !newPlan.name || newPlan.price <= 0 || newPlan.days <= 0) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      const response = await fetch('/api/premium-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlan),
      });

      if (response.ok) {
        setPlans(prev => ({
          ...prev,
          [newPlan.key]: {
            name: newPlan.name,
            price: newPlan.price,
            days: newPlan.days,
            features: newPlan.features.filter(f => f.trim() !== ''),
          },
        }));
        setShowAddForm(false);
        setNewPlan({ key: '', name: '', price: 0, days: 0, features: [''] });
      } else {
        console.error('Premium plan ekleme hatası:', await response.text());
      }
    } catch (error) {
      console.error('Premium plan ekleme hatası:', error);
    }
  };

  const handleDeletePlan = async (planKey: string) => {
    if (!confirm('Bu planı silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/premium-plans/${planKey}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const newPlans = { ...plans };
        delete newPlans[planKey as keyof typeof plans];
        setPlans(newPlans);
      } else {
        console.error('Premium plan silme hatası:', await response.text());
      }
    } catch (error) {
      console.error('Premium plan silme hatası:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-900">Premium Plan Yönetimi</h1>
        <p className="mt-2 text-sm text-gray-700">
          Premium planları oluşturun, düzenleyin ve yönetin.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StarIcon className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Toplam Plan</dt>
                  <dd className="text-lg font-medium text-gray-900">{Object.keys(plans).length}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">En Yüksek Fiyat</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Math.max(...Object.values(plans).map(p => p.price))} ₺
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
                  <dt className="text-sm font-medium text-gray-500 truncate">En Uzun Süre</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Math.max(...Object.values(plans).map(p => p.days))} gün
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
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                <label htmlFor="planKey" className="block text-sm font-medium text-gray-700">
                  Plan Anahtarı
                </label>
                <input
                  type="text"
                  id="planKey"
                  value={newPlan.key}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, key: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="30days"
                />
              </div>
              <div>
                <label htmlFor="planName" className="block text-sm font-medium text-gray-700">
                  Plan Adı
                </label>
                <input
                  type="text"
                  id="planName"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="30 Günlük Premium"
                />
              </div>
              <div>
                <label htmlFor="planPrice" className="block text-sm font-medium text-gray-700">
                  Fiyat (₺)
                </label>
                <input
                  type="number"
                  id="planPrice"
                  value={newPlan.price}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="99"
                />
              </div>
              <div>
                <label htmlFor="planDays" className="block text-sm font-medium text-gray-700">
                  Gün Sayısı
                </label>
                <input
                  type="number"
                  id="planDays"
                  value={newPlan.days}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, days: parseInt(e.target.value) || 0 }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="30"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Özellikler
              </label>
              {newPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...newPlan.features];
                      newFeatures[index] = e.target.value;
                      setNewPlan(prev => ({ ...prev, features: newFeatures }));
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Özellik açıklaması"
                  />
                  <button
                    onClick={() => {
                      const newFeatures = newPlan.features.filter((_, i) => i !== index);
                      setNewPlan(prev => ({ ...prev, features: newFeatures }));
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setNewPlan(prev => ({ ...prev, features: [...prev.features, ''] }))}
                className="text-blue-600 hover:text-blue-900 text-sm"
              >
                + Özellik Ekle
              </button>
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
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {Object.entries(plans).map(([planKey, plan]) => (
          <div key={planKey} className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <StarIcon className="h-6 w-6 text-yellow-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                </div>
                <div className="flex space-x-2">
                  {editingPlan === planKey ? (
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
                        onClick={() => handleEditPlan(planKey)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Düzenle"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(planKey)}
                        className="text-red-600 hover:text-red-900"
                        title="Sil"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {editingPlan === planKey ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Plan Adı</label>
                    <input
                      type="text"
                      value={editValues.name}
                      onChange={(e) => setEditValues(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fiyat (₺)</label>
                      <input
                        type="number"
                        value={editValues.price}
                        onChange={(e) => setEditValues(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gün</label>
                      <input
                        type="number"
                        value={editValues.days}
                        onChange={(e) => setEditValues(prev => ({ ...prev, days: parseInt(e.target.value) || 0 }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Özellikler</label>
                    {editValues.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        <button
                          onClick={() => handleRemoveFeature(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleAddFeature}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      + Özellik Ekle
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {plan.price.toLocaleString('tr-TR')} ₺
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    {plan.days} gün
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
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