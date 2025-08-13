'use client';

import React, { useEffect, useState } from 'react';

const defaultSettings = {
  siteTitle: '',
  metaTitle: '',
  supportEmail: '',
  homepageDescription: '',
  logoUrl: '',
  phone: '',
  footerText: '',
  facebook: '',
  instagram: '',
  twitter: '',
  address: '',
  invoiceAddress: '',
  announcementText: '',
  googleAdsCode: '',
  // OAuth ayarları
  oauthGoogleClientId: '',
  oauthGoogleClientSecret: '',
  oauthGoogleRedirectUri: '',
  oauthGoogleEnabled: false,
  oauthFacebookClientId: '',
  oauthFacebookClientSecret: '',
  oauthFacebookRedirectUri: '',
  oauthFacebookEnabled: false,
  oauthAppleClientId: '',
  oauthAppleClientSecret: '',
  oauthAppleRedirectUri: '',
  oauthAppleTeamId: '',
  oauthAppleKeyId: '',
  oauthAppleEnabled: false,
};

export default function AdminAyarlarPage() {
  const [settings, setSettings] = useState<any>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const adminToken = typeof window !== 'undefined' ? localStorage.getItem('alo17-admin-token') : '';
    fetch('/api/admin/settings', {
      headers: {
        ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {})
      }
    })
      .then(res => res.json())
      .then(data => {
        setSettings({ ...defaultSettings, ...data });
        setLoading(false);
      })
      .catch(() => {
        setError('Ayarlar yüklenemedi');
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((s: any) => ({ 
      ...s, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((s: any) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const adminToken = typeof window !== 'undefined' ? localStorage.getItem('alo17-admin-token') : '';
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {})
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSuccess('Ayarlar başarıyla kaydedildi!');
      } else {
        setError('Ayarlar kaydedilemedi!');
      }
    } catch {
      setError('Ayarlar kaydedilemedi!');
    }
  };

  // Ayarları dışa aktar (indir)
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "settings.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Ayarları içe aktar (yükle)
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      setSettings({ ...defaultSettings, ...imported });
      // Otomatik kaydetmek için PATCH isteği gönder
      const adminToken = typeof window !== 'undefined' ? localStorage.getItem('alo17-admin-token') : '';
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {})
        },
        body: JSON.stringify(imported)
      });
      if (res.ok) {
        setSuccess('Ayarlar başarıyla yüklendi!');
      } else {
        setError('Ayarlar yüklenemedi!');
      }
    } catch {
      setError('Geçersiz dosya veya okuma hatası!');
    }
  };

  // Siteyi yedekle (zip indir)
  const handleBackup = () => {
    const link = document.createElement('a');
    link.href = '/api/admin/backup';
    link.download = 'site-backup.zip';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Logo yükleme
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'logo');
    const adminToken = typeof window !== 'undefined' ? localStorage.getItem('alo17-admin-token') : '';
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {},
      body: formData
    });
    const data = await res.json();
    if (data.url) {
      setSettings(s => ({ ...s, logoUrl: data.url }));
      setSuccess('Logo başarıyla yüklendi!');
    } else {
      setError('Logo yüklenemedi!');
    }
  };
  // Favicon yükleme
  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'favicon');
    const adminToken = typeof window !== 'undefined' ? localStorage.getItem('alo17-admin-token') : '';
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {},
      body: formData
    });
    const data = await res.json();
    if (data.url) {
      setSettings(s => ({ ...s, faviconUrl: data.url }));
      setSuccess('Favicon başarıyla yüklendi!');
    } else {
      setError('Favicon yüklenemedi!');
    }
  };

  if (loading) return <div className="p-8">Yükleniyor...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-6">Ayarlar</h1>
      <div className="flex gap-4 mb-4">
        <button type="button" onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Ayarları Dışa Aktar (JSON İndir)</button>
        <label className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer">
          Ayarları İçe Aktar (JSON Yükle)
          <input type="file" accept="application/json" onChange={handleImport} className="hidden" />
        </label>
        <button type="button" onClick={handleBackup} className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition">Siteyi Yedekle (Tüm İçeriği İndir)</button>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Site Başlığı</label>
          <input type="text" name="siteTitle" value={settings.siteTitle} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Site başlığını girin" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Site Meta Başlığı (Slogan)</label>
          <input type="text" name="metaTitle" value={settings.metaTitle || ''} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Örn: Türkiye'nin En Büyük İlan Sitesi" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Destek E-posta</label>
          <input type="email" name="supportEmail" value={settings.supportEmail} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="destek@site.com" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Ana Sayfa Açıklaması</label>
          <textarea name="homepageDescription" value={settings.homepageDescription} onChange={handleTextareaChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Ana sayfa açıklaması"></textarea>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Site Logosu (URL)</label>
          <input type="text" name="logoUrl" value={settings.logoUrl} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 mb-2" placeholder="/images/logo.svg" />
          <input type="file" accept="image/*" onChange={handleLogoUpload} className="block" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Favicon (URL)</label>
          <input type="text" name="faviconUrl" value={settings.faviconUrl || ''} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 mb-2" placeholder="/favicon.ico" />
          <input type="file" accept="image/*" onChange={handleFaviconUpload} className="block" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Telefon</label>
          <input type="text" name="phone" value={settings.phone} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="+90 555 123 4567" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Footer Metni</label>
          <input type="text" name="footerText" value={settings.footerText} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="© 2024 Alo17. Tüm hakları saklıdır." />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Facebook</label>
          <input type="text" name="facebook" value={settings.facebook} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="https://facebook.com/alo17" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Instagram</label>
          <input type="text" name="instagram" value={settings.instagram} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="https://instagram.com/alo17" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Twitter</label>
          <input type="text" name="twitter" value={settings.twitter} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="https://twitter.com/alo17" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">WhatsApp Destek Numarası</label>
          <input type="text" name="whatsappNumber" value={settings.whatsappNumber} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="+90 555 123 4567" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">PayTR API Key</label>
          <input type="text" name="paytrApiKey" value={settings.paytrApiKey} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="PayTR API Key" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">PayTR Merchant ID</label>
          <input type="text" name="paytrMerchantId" value={settings.paytrMerchantId} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="PayTR Merchant ID" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">PayTR Merchant Salt</label>
          <input type="text" name="paytrMerchantSalt" value={settings.paytrMerchantSalt} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="PayTR Merchant Salt" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Stripe Public Key</label>
          <input type="text" name="stripePublicKey" value={settings.stripePublicKey} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Stripe Public Key" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Stripe Secret Key</label>
          <input type="text" name="stripeSecretKey" value={settings.stripeSecretKey} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Stripe Secret Key" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Fatura Başlığı</label>
          <input type="text" name="invoiceTitle" value={settings.invoiceTitle} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Fatura başlığı" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Vergi Numarası</label>
          <input type="text" name="taxNumber" value={settings.taxNumber} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Vergi numarası" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Fatura Adresi</label>
          <textarea name="invoiceAddress" value={settings.invoiceAddress} onChange={handleTextareaChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Fatura adresi"></textarea>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Duyuru Metni</label>
          <input type="text" name="announcementText" value={settings.announcementText} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Duyuru metni" />
        </div>
        {/* Banner Görseli (URL) ile ilgili input, label ve kod tamamen kaldırıldı */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Google Reklam Kodu (HTML/script)</label>
          <textarea
            name="googleAdsCode"
            value={settings.googleAdsCode}
            onChange={handleTextareaChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="&lt;script async src='https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXX-X'&gt;&lt;/script&gt;\n&lt;script&gt;...&lt;/script&gt;"
            rows={4}
          />
        </div>

        {/* OAuth Ayarları Bölümü */}
        <div className="border-t pt-6 mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">🔐 OAuth Sosyal Medya Giriş Ayarları</h3>
          
          {/* Google OAuth */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-blue-800 flex items-center">
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google OAuth
              </h4>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="oauthGoogleEnabled"
                  checked={settings.oauthGoogleEnabled}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm text-blue-700">Aktif</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Client ID</label>
                <input
                  type="text"
                  name="oauthGoogleClientId"
                  value={settings.oauthGoogleClientId}
                  onChange={handleChange}
                  className="w-full border border-blue-300 rounded px-3 py-2 text-sm"
                  placeholder="Google Cloud Console Client ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Client Secret</label>
                <input
                  type="password"
                  name="oauthGoogleClientSecret"
                  value={settings.oauthGoogleClientSecret}
                  onChange={handleChange}
                  className="w-full border border-blue-300 rounded px-3 py-2 text-sm"
                  placeholder="Google Cloud Console Client Secret"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-blue-700 mb-1">Redirect URI</label>
                <input
                  type="text"
                  name="oauthGoogleRedirectUri"
                  value={settings.oauthGoogleRedirectUri}
                  onChange={handleChange}
                  className="w-full border border-blue-300 rounded px-3 py-2 text-sm"
                  placeholder="https://alo17-new-27-06.onrender.com/api/auth/google/callback"
                />
              </div>
            </div>
          </div>

          {/* Facebook OAuth */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-blue-800 flex items-center">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold mr-2">f</div>
                Facebook OAuth
              </h4>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="oauthFacebookEnabled"
                  checked={settings.oauthFacebookEnabled}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm text-blue-700">Aktif</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">App ID</label>
                <input
                  type="text"
                  name="oauthFacebookClientId"
                  value={settings.oauthFacebookClientId}
                  onChange={handleChange}
                  className="w-full border border-blue-300 rounded px-3 py-2 text-sm"
                  placeholder="Facebook App ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">App Secret</label>
                <input
                  type="password"
                  name="oauthFacebookClientSecret"
                  value={settings.oauthFacebookClientSecret}
                  onChange={handleChange}
                  className="w-full border border-blue-300 rounded px-3 py-2 text-sm"
                  placeholder="Facebook App Secret"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-blue-700 mb-1">Redirect URI</label>
                <input
                  type="text"
                  name="oauthFacebookRedirectUri"
                  value={settings.oauthFacebookRedirectUri}
                  onChange={handleChange}
                  className="w-full border border-blue-300 rounded px-3 py-2 text-sm"
                  placeholder="https://alo17-new-27-06.onrender.com/api/auth/facebook/callback"
                />
              </div>
            </div>
          </div>

          {/* Apple OAuth */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-white text-xs font-bold mr-2">🍎</div>
                Apple OAuth
              </h4>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="oauthAppleEnabled"
                  checked={settings.oauthAppleEnabled}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Aktif</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
                <input
                  type="text"
                  name="oauthAppleClientId"
                  value={settings.oauthAppleClientId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="Apple Client ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Secret</label>
                <input
                  type="password"
                  name="oauthAppleClientSecret"
                  value={settings.oauthAppleClientSecret}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="Apple Client Secret"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team ID</label>
                <input
                  type="text"
                  name="oauthAppleTeamId"
                  value={settings.oauthAppleTeamId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="Apple Team ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key ID</label>
                <input
                  type="text"
                  name="oauthAppleKeyId"
                  value={settings.oauthAppleKeyId}
                  onChange={handleChange}
                  className="w-full border border-blue-300 rounded px-3 py-2 text-sm"
                  placeholder="Apple Key ID"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Redirect URI</label>
                <input
                  type="text"
                  name="oauthAppleRedirectUri"
                  value={settings.oauthAppleRedirectUri}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="https://alo17-new-27-06.onrender.com/api/auth/apple/callback"
                />
              </div>
            </div>
          </div>

          {/* OAuth Bilgi Kutusu */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="font-medium text-yellow-800 mb-2">ℹ️ OAuth Kurulum Bilgileri</h5>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>• <strong>Google:</strong> <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a>'dan OAuth 2.0 Client ID ve Secret alın</p>
              <p>• <strong>Facebook:</strong> <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="underline">Facebook Developers</a>'dan App ID ve App Secret alın</p>
              <p>• <strong>Apple:</strong> <a href="https://developer.apple.com" target="_blank" rel="noopener noreferrer" className="underline">Apple Developer</a>'dan Team ID, Key ID ve Client ID alın</p>
              <p>• Tüm provider'lar için redirect URI'ları doğru ayarlayın</p>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <input type="checkbox" id="announcementActive" name="announcementActive" checked={!!settings.announcementActive} onChange={e => setSettings({ ...settings, announcementActive: e.target.checked })} className="mr-2" />
          <label htmlFor="announcementActive" className="text-gray-700 font-medium">Duyuru Aktif</label>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Kaydet</button>
        {success && <div className="mt-2 text-green-600 font-semibold">{success}</div>}
        {error && <div className="mt-2 text-red-600 font-semibold">{error}</div>}
      </form>
    </div>
  );
} 
