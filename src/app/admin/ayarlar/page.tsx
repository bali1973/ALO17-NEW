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
  whatsappNumber: '',
  paytrApiKey: '',
  paytrMerchantId: '',
  paytrMerchantSalt: '',
  stripePublicKey: '',
  stripeSecretKey: '',
  invoiceTitle: '',
  taxNumber: '',
  invoiceAddress: '',
  announcementText: '',
  bannerImageUrl: '',
  announcementActive: false,
  faviconUrl: '',
  googleAdsCode: '',
};

export default function AdminAyarlarPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
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
          <textarea name="homepageDescription" value={settings.homepageDescription} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Ana sayfa açıklaması"></textarea>
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
          <textarea name="invoiceAddress" value={settings.invoiceAddress} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Fatura adresi"></textarea>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Duyuru Metni</label>
          <input type="text" name="announcementText" value={settings.announcementText} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Duyuru metni" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Banner Görseli (URL)</label>
          <input type="text" name="bannerImageUrl" value={settings.bannerImageUrl} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="/images/banner.jpg" />
          <input type="file" accept="image/*" onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'banner');
            const adminToken = typeof window !== 'undefined' ? localStorage.getItem('alo17-admin-token') : '';
            const res = await fetch('/api/admin/upload', {
              method: 'POST',
              headers: adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {},
              body: formData
            });
            const data = await res.json();
            if (data.url) {
              setSettings(s => ({ ...s, bannerImageUrl: data.url }));
              setSuccess('Banner görseli başarıyla yüklendi!');
            } else {
              setError('Banner görseli yüklenemedi!');
            }
          }} className="block mt-2" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Google Reklam Kodu (HTML/script)</label>
          <textarea
            name="googleAdsCode"
            value={settings.googleAdsCode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="&lt;script async src='https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXX-X'&gt;&lt;/script&gt;\n&lt;script&gt;...&lt;/script&gt;"
            rows={4}
          />
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