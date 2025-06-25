'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Camera } from 'lucide-react';

export default function IlanVerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [showPhone, setShowPhone] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    phone: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris?callbackUrl=/ilan-ver');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-alo-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      if (images.length + newImages.length > 5) {
        alert('En fazla 5 resim yükleyebilirsiniz');
        return;
      }
      setImages([...images, ...newImages]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // İlan verme işlemi burada yapılacak
    console.log('Form data:', formData);
    console.log('Images:', images);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Yeni İlan Ver</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                İlan Başlığı
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
                placeholder="İlan başlığını girin"
                aria-label="İlan başlığı"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                required
                placeholder="İlan açıklamasını girin"
                aria-label="İlan açıklaması"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Fiyat
              </label>
              <input
                id="price"
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
                placeholder="Fiyatı girin"
                aria-label="İlan fiyatı"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
                aria-label="İlan kategorisi"
              >
                <option value="">Kategori Seçin</option>
                <option value="is-ilanlari">İş İlanları</option>
                <option value="elektronik">Elektronik</option>
                <option value="ev-bahce">Ev & Bahçe</option>
                <option value="hizmetler">Hizmetler</option>
                <option value="egitim-kurslar">Eğitim & Kurslar</option>
                <option value="moda-stil">Moda & Stil</option>
                <option value="anne-bebek">Anne & Bebek</option>
                <option value="sanat-hobi">Sanat & Hobi</option>
                <option value="saglik-guzellik">Sağlık & Güzellik</option>
                <option value="bilgisayar">Bilgisayar</option>
                <option value="ticaret-catering">Ticaret & Catering</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Konum
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
                placeholder="Konum bilgisini girin"
                aria-label="İlan konumu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İletişim Bilgileri
              </label>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showPhone"
                    checked={showPhone}
                    onChange={(e) => setShowPhone(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="showPhone">Telefon numaramı göster</label>
                </div>
                
                {showPhone && (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Telefon numaranız"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resimler (En fazla 5 adet)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`İlan resmi ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      capture="environment"
                    />
                    <Camera className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-500 mt-2">Resim Ekle</span>
                  </label>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-alo-blue text-white rounded-md hover:bg-alo-blue-dark"
              >
                İlanı Yayınla
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 