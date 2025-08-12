'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/Providers';

import { AlertTriangle, FileText, User, ShoppingBag, Send, CheckCircle, X } from 'lucide-react';

interface ReportForm {
  type: string;
  subject: string;
  description: string;
  listingId?: string;
  listingTitle?: string;
  userEmail?: string;
  priority: 'low' | 'medium' | 'high';
}

export default function RaporGonderPage() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState<ReportForm>({
    type: 'İlan Şikayeti',
    subject: '',
    description: '',
    listingId: '',
    listingTitle: '',
    userEmail: '',
    priority: 'medium'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // URL'den ilan bilgilerini al
  useEffect(() => {
    const listingId = searchParams.get('listingId');
    const listingTitle = searchParams.get('listingTitle');
    const userEmail = searchParams.get('userEmail');
    
    if (listingId) {
      setFormData(prev => ({
        ...prev,
        listingId,
        listingTitle: listingTitle || '',
        type: 'İlan Şikayeti'
      }));
    }
    
    if (userEmail) {
      setFormData(prev => ({
        ...prev,
        userEmail,
        type: 'Kullanıcı Şikayeti'
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      router.push('/giris?redirect=/rapor-gonder');
    }
  }, [session, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      setErrorMessage('Bu işlemi yapmak için giriş yapmanız gerekiyor');
      return;
    }

    if (!formData.subject.trim() || !formData.description.trim()) {
      setErrorMessage('Konu ve açıklama alanları zorunludur');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const reportData = {
        type: formData.type,
        subject: formData.subject,
        description: formData.description,
        status: 'Açık',
        priority: formData.priority,
        listingId: formData.listingId || undefined,
        listingTitle: formData.listingTitle || undefined,
        reportedUserEmail: formData.userEmail || undefined
      };

      const response = await fetch('/api/raporlar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          type: 'İlan Şikayeti',
          subject: '',
          description: '',
          listingId: '',
          listingTitle: '',
          userEmail: '',
          priority: 'medium'
        });
        
        // 3 saniye sonra başarı mesajını kaldır
        setTimeout(() => {
          setSubmitStatus('idle');
          router.push('/bildirimler');
        }, 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        setSubmitStatus('error');
        setErrorMessage(`Rapor gönderilirken bir hata oluştu: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setSubmitStatus('error');
      setErrorMessage(`Rapor gönderilirken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ReportForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const reportTypes = [
    {
      value: 'İlan Şikayeti',
      label: 'İlan Şikayeti',
      icon: ShoppingBag,
      description: 'İlan ile ilgili şikayetlerinizi bildirin'
    },
    {
      value: 'Kullanıcı Şikayeti',
      label: 'Kullanıcı Şikayeti',
      icon: User,
      description: 'Kullanıcı davranışları ile ilgili şikayetlerinizi bildirin'
    },
    {
      value: 'Genel Şikayet',
      label: 'Genel Şikayet',
      icon: FileText,
      description: 'Site ile ilgili genel şikayetlerinizi bildirin'
    }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Düşük', color: 'text-green-600' },
    { value: 'medium', label: 'Orta', color: 'text-yellow-600' },
    { value: 'high', label: 'Yüksek', color: 'text-red-600' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Başlık */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Şikayet Bildir</h1>
            <p className="text-gray-600">
              Karşılaştığınız sorunları bize bildirin, en kısa sürede çözüm bulalım
            </p>
          </div>

          {/* Başarı Mesajı */}
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">
                  Raporunuz başarıyla gönderildi! En kısa sürede inceleyeceğiz.
                </span>
              </div>
            </div>
          )}

          {/* Hata Mesajı */}
          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <X className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-800">{errorMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rapor Türü */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Şikayet Türü
              </label>
              <div className="grid gap-3">
                {reportTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <label
                      key={type.value}
                      className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.type === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-5 h-5 border-2 rounded-full mt-0.5 ${
                          formData.type === type.value
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.type === type.value && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <IconComponent className="w-5 h-5 text-gray-500 mr-2" />
                            <span className="font-medium text-gray-900">{type.label}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* İlan Bilgileri (İlan Şikayeti seçiliyse) */}
            {formData.type === 'İlan Şikayeti' && formData.listingTitle && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Şikayet Edilen İlan:</h3>
                <p className="text-sm text-blue-800">{formData.listingTitle}</p>
              </div>
            )}

            {/* Kullanıcı Bilgileri (Kullanıcı Şikayeti seçiliyse) */}
            {formData.type === 'Kullanıcı Şikayeti' && formData.userEmail && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Şikayet Edilen Kullanıcı:</h3>
                <p className="text-sm text-blue-800">{formData.userEmail}</p>
              </div>
            )}

            {/* Öncelik */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Öncelik Seviyesi
              </label>
              <div className="flex gap-4">
                {priorityOptions.map((priority) => (
                  <label key={priority.value} className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value={priority.value}
                      checked={formData.priority === priority.value}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="mr-2"
                    />
                    <span className={`text-sm ${priority.color}`}>{priority.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Konu */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Konu *
              </label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Şikayetinizin konusunu kısaca belirtin"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Açıklama */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Detaylı Açıklama *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Şikayetinizi detaylı olarak açıklayın..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              ></textarea>
            </div>

            {/* Gönder Butonu */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Şikayeti Gönder
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
            </div>
          </form>

          {/* Bilgi Notu */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Önemli Bilgiler</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Tüm şikayetler gizlilik içinde değerlendirilir</li>
              <li>• Yanlış şikayetler hesap kapatılmasına neden olabilir</li>
              <li>• Şikayetleriniz en kısa sürede incelenir</li>
              <li>• Gerekli durumlarda sizinle iletişime geçilir</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 
