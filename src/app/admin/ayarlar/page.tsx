'use client';

import { useState } from 'react';
import {
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CreditCardIcon,
  DocumentTextIcon,
  CheckIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Site Ayarları
    siteName: 'Alo17',
    siteDescription: 'Türkiye\'nin en güvenilir ilan sitesi',
    contactEmail: 'destek@alo17.tr',
    contactPhone: '541 4042404',
    
    // Bildirim Ayarları
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    adminNotifications: true,
    
    // Güvenlik Ayarları
    requireEmailVerification: true,
    requirePhoneVerification: false,
    maxLoginAttempts: 5,
    sessionTimeout: 24,
    
    // Ödeme Ayarları
    stripeEnabled: true,
    paypalEnabled: false,
    bankTransferEnabled: true,
    currency: 'TRY',
    
    // İçerik Ayarları
    autoApproveListings: false,
    requireListingApproval: true,
    maxImagesPerListing: 10,
    maxListingTitleLength: 100,
    
    // SEO Ayarları
    metaTitle: 'Alo17 - Türkiye\'nin En Güvenilir İlan Sitesi',
    metaDescription: 'Alo17 ile güvenle alım satım yapın. Binlerce ilan, güvenli ödeme seçenekleri.',
    googleAnalyticsId: 'GA-123456789',
  });

  const [activeTab, setActiveTab] = useState('general');

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Burada API çağrısı yapılacak
      console.log('Ayarlar kaydediliyor:', settings);
      alert('Ayarlar başarıyla kaydedildi!');
    } catch (error) {
      console.error('Ayar kaydetme hatası:', error);
      alert('Ayarlar kaydedilirken hata oluştu!');
    }
  };

  const tabs = [
    { id: 'general', name: 'Genel', icon: Cog6ToothIcon },
    { id: 'notifications', name: 'Bildirimler', icon: BellIcon },
    { id: 'security', name: 'Güvenlik', icon: ShieldCheckIcon },
    { id: 'payment', name: 'Ödeme', icon: CreditCardIcon },
    { id: 'content', name: 'İçerik', icon: DocumentTextIcon },
    { id: 'seo', name: 'SEO', icon: GlobeAltIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-900">Site Ayarları</h1>
        <p className="mt-2 text-sm text-gray-700">
          Platform ayarlarını yapılandırın ve yönetin.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 inline mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="px-6 py-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Genel Ayarlar</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                    Site Adı
                  </label>
                  <input
                    type="text"
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange('siteName', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                    Site Açıklaması
                  </label>
                  <input
                    type="text"
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                    İletişim E-posta
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={settings.contactEmail}
                    onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                    İletişim Telefonu
                  </label>
                  <input
                    type="text"
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) => handleSettingChange('contactPhone', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Bildirim Ayarları</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">E-posta Bildirimleri</h4>
                    <p className="text-sm text-gray-500">Kullanıcılara e-posta ile bildirim gönder</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                    className={`${
                      settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                  >
                    <span
                      className={`${
                        settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">SMS Bildirimleri</h4>
                    <p className="text-sm text-gray-500">Kullanıcılara SMS ile bildirim gönder</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('smsNotifications', !settings.smsNotifications)}
                    className={`${
                      settings.smsNotifications ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                  >
                    <span
                      className={`${
                        settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Push Bildirimleri</h4>
                    <p className="text-sm text-gray-500">Tarayıcı push bildirimleri gönder</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('pushNotifications', !settings.pushNotifications)}
                    className={`${
                      settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                  >
                    <span
                      className={`${
                        settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Admin Bildirimleri</h4>
                    <p className="text-sm text-gray-500">Admin paneline bildirim gönder</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('adminNotifications', !settings.adminNotifications)}
                    className={`${
                      settings.adminNotifications ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                  >
                    <span
                      className={`${
                        settings.adminNotifications ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Güvenlik Ayarları</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">E-posta Doğrulama Zorunlu</h4>
                    <p className="text-sm text-gray-500">Kullanıcıların e-posta adreslerini doğrulaması gerekir</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('requireEmailVerification', !settings.requireEmailVerification)}
                    className={`${
                      settings.requireEmailVerification ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                  >
                    <span
                      className={`${
                        settings.requireEmailVerification ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Telefon Doğrulama Zorunlu</h4>
                    <p className="text-sm text-gray-500">Kullanıcıların telefon numaralarını doğrulaması gerekir</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('requirePhoneVerification', !settings.requirePhoneVerification)}
                    className={`${
                      settings.requirePhoneVerification ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                  >
                    <span
                      className={`${
                        settings.requirePhoneVerification ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                    />
                  </button>
                </div>
                <div>
                  <label htmlFor="maxLoginAttempts" className="block text-sm font-medium text-gray-700">
                    Maksimum Giriş Denemesi
                  </label>
                  <input
                    type="number"
                    id="maxLoginAttempts"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    min="1"
                    max="10"
                  />
                </div>
                <div>
                  <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                    Oturum Zaman Aşımı (Saat)
                  </label>
                  <input
                    type="number"
                    id="sessionTimeout"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    min="1"
                    max="168"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Ödeme Ayarları</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Stripe Ödemeleri</h4>
                    <p className="text-sm text-gray-500">Kredi kartı ödemelerini etkinleştir</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('stripeEnabled', !settings.stripeEnabled)}
                    className={`${
                      settings.stripeEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                  >
                    <span
                      className={`${
                        settings.stripeEnabled ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">PayPal Ödemeleri</h4>
                    <p className="text-sm text-gray-500">PayPal ödemelerini etkinleştir</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('paypalEnabled', !settings.paypalEnabled)}
                    className={`${
                      settings.paypalEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                  >
                    <span
                      className={`${
                        settings.paypalEnabled ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Banka Havalesi</h4>
                    <p className="text-sm text-gray-500">Banka havalesi ödemelerini etkinleştir</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('bankTransferEnabled', !settings.bankTransferEnabled)}
                    className={`${
                      settings.bankTransferEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                  >
                    <span
                      className={`${
                        settings.bankTransferEnabled ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                    />
                  </button>
                </div>
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                    Para Birimi
                  </label>
                  <select
                    id="currency"
                    value={settings.currency}
                    onChange={(e) => handleSettingChange('currency', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="TRY">Türk Lirası (₺)</option>
                    <option value="USD">Amerikan Doları ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Content Settings */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">İçerik Ayarları</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Otomatik İlan Onayı</h4>
                    <p className="text-sm text-gray-500">İlanlar otomatik olarak onaylansın</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('autoApproveListings', !settings.autoApproveListings)}
                    className={`${
                      settings.autoApproveListings ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                  >
                    <span
                      className={`${
                        settings.autoApproveListings ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">İlan Onayı Gerekli</h4>
                    <p className="text-sm text-gray-500">İlanların admin onayından geçmesi gerekir</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('requireListingApproval', !settings.requireListingApproval)}
                    className={`${
                      settings.requireListingApproval ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                  >
                    <span
                      className={`${
                        settings.requireListingApproval ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                    />
                  </button>
                </div>
                <div>
                  <label htmlFor="maxImagesPerListing" className="block text-sm font-medium text-gray-700">
                    İlan Başına Maksimum Resim
                  </label>
                  <input
                    type="number"
                    id="maxImagesPerListing"
                    value={settings.maxImagesPerListing}
                    onChange={(e) => handleSettingChange('maxImagesPerListing', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    min="1"
                    max="20"
                  />
                </div>
                <div>
                  <label htmlFor="maxListingTitleLength" className="block text-sm font-medium text-gray-700">
                    İlan Başlığı Maksimum Uzunluk
                  </label>
                  <input
                    type="number"
                    id="maxListingTitleLength"
                    value={settings.maxListingTitleLength}
                    onChange={(e) => handleSettingChange('maxListingTitleLength', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    min="10"
                    max="200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SEO Settings */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">SEO Ayarları</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">
                    Meta Başlık
                  </label>
                  <input
                    type="text"
                    id="metaTitle"
                    value={settings.metaTitle}
                    onChange={(e) => handleSettingChange('metaTitle', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">
                    Meta Açıklama
                  </label>
                  <textarea
                    id="metaDescription"
                    rows={3}
                    value={settings.metaDescription}
                    onChange={(e) => handleSettingChange('metaDescription', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="googleAnalyticsId" className="block text-sm font-medium text-gray-700">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    id="googleAnalyticsId"
                    value={settings.googleAnalyticsId}
                    onChange={(e) => handleSettingChange('googleAnalyticsId', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="GA-XXXXXXXXX"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <CheckIcon className="h-4 w-4 mr-2" />
          Ayarları Kaydet
        </button>
      </div>
    </div>
  );
} 