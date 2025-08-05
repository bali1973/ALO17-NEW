'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DilTestiPage() {
  const { 
    t, 
    formatDate, 
    formatCurrency, 
    formatNumber, 
    formatPercent,
    currentLocale,
    getLocaleInfo,
    getAllLocaleInfo 
  } = useTranslation();

  const currentDate = new Date();
  const samplePrice = 1250.50;
  const sampleNumber = 1234567.89;
  const samplePercent = 75.5;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            "" Testi
          </h1>
          <p className="text-gray-600 mt-2">
            "": Çoklu dil desteği test sayfası
          </p>
        </div>
        <LanguageSwitcher variant="button" />
      </div>

      {/* Mevcut Dil Bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle>"" Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Mevcut Dil:</h3>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getLocaleInfo(currentLocale).flag}</span>
                <div>
                  <p className="font-medium">{getLocaleInfo(currentLocale).nativeName}</p>
                  <p className="text-sm text-gray-500">{getLocaleInfo(currentLocale).name}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Desteklenen Diller:</h3>
              <div className="space-y-2">
                {getAllLocaleInfo().map((locale) => (
                  <div key={locale.code} className="flex items-center space-x-2">
                    <span className="text-lg">{locale.flag}</span>
                    <span className="text-sm">{locale.nativeName}</span>
                    {locale.code === currentLocale && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Aktif
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Çeviri Örnekleri */}
      <Card>
        <CardHeader>
          <CardTitle>Çeviri Örnekleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Genel Çeviriler:</h3>
              <div className="space-y-2">
                <p><strong>Loading:</strong> ""</p>
                <p><strong>Error:</strong> ""</p>
                <p><strong>Success:</strong> ""</p>
                <p><strong>Save:</strong> ""</p>
                <p><strong>Cancel:</strong> ""</p>
                <p><strong>Edit:</strong> ""</p>
                <p><strong>Delete:</strong> ""</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Navigasyon:</h3>
              <div className="space-y-2">
                <p><strong>Home:</strong> ""</p>
                <p><strong>Listings:</strong> ""</p>
                <p><strong>Categories:</strong> ""</p>
                <p><strong>Search:</strong> ""</p>
                <p><strong>Messages:</strong> ""</p>
                <p><strong>Profile:</strong> ""</p>
                <p><strong>Settings:</strong> ""</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Format Örnekleri */}
      <Card>
        <CardHeader>
          <CardTitle>Format Örnekleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Tarih Formatı:</h3>
              <div className="space-y-2">
                <p><strong>Tam Tarih:</strong> {formatDate(currentDate)}</p>
                <p><strong>Kısa Tarih:</strong> {formatDate(currentDate, { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</p>
                <p><strong>Sadece Ay:</strong> {formatDate(currentDate, { 
                  month: 'long' 
                })}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Para ve Sayı Formatı:</h3>
              <div className="space-y-2">
                <p><strong>Para Birimi:</strong> {formatCurrency(samplePrice)}</p>
                <p><strong>USD:</strong> {formatCurrency(samplePrice, 'USD')}</p>
                <p><strong>Sayı:</strong> {formatNumber(sampleNumber)}</p>
                <p><strong>Yüzde:</strong> {formatPercent(samplePercent)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parametreli Çeviriler */}
      <Card>
        <CardHeader>
          <CardTitle>Parametreli Çeviriler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Doğrulama Mesajları:</h3>
              <div className="space-y-2">
                <p><strong>Min Length (5):</strong> ""</p>
                <p><strong>Max Length (100):</strong> ""</p>
                <p><strong>Min Value (10):</strong> ""</p>
                <p><strong>Max Value (1000):</strong> ""</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* İlan Örnekleri */}
      <Card>
        <CardHeader>
          <CardTitle>İlan Sistemi Çevirileri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">İlan Durumları:</h3>
              <div className="space-y-2">
                <p><strong>Active:</strong> ""</p>
                <p><strong>Inactive:</strong> ""</p>
                <p><strong>Pending:</strong> ""</p>
                <p><strong>Rejected:</strong> ""</p>
                <p><strong>Expired:</strong> ""</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">İlan Koşulları:</h3>
              <div className="space-y-2">
                <p><strong>New:</strong> ""</p>
                <p><strong>Like New:</strong> ""</p>
                <p><strong>Good:</strong> ""</p>
                <p><strong>Fair:</strong> ""</p>
                <p><strong>Poor:</strong> ""</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hata Mesajları */}
      <Card>
        <CardHeader>
          <CardTitle>Hata Mesajları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>General Error:</strong> ""</p>
            <p><strong>Network Error:</strong> ""</p>
            <p><strong>Server Error:</strong> ""</p>
            <p><strong>Not Found:</strong> ""</p>
            <p><strong>Unauthorized:</strong> ""</p>
            <p><strong>Forbidden:</strong> ""</p>
            <p><strong>Validation Error:</strong> ""</p>
            <p><strong>Timeout:</strong> ""</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
