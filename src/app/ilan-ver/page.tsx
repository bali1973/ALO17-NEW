'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

const categories = [
  { id: 'emlak', name: 'Emlak', subCategories: ['Satılık', 'Kiralık', 'Günlük Kiralık', 'Projeler'] },
  { id: 'vasita', name: 'Vasıta', subCategories: ['Otomobil', 'Motosiklet', 'Ticari Araçlar', 'Deniz Araçları'] },
  { id: 'elektronik', name: 'Elektronik', subCategories: ['Telefon', 'Bilgisayar', 'TV & Ses Sistemleri', 'Fotoğraf & Kamera'] },
  { id: 'ev-yasam', name: 'Ev & Yaşam', subCategories: ['Mobilya', 'Ev Tekstili', 'Mutfak Gereçleri', 'Bahçe'] },
];

export default function CreateListing() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subCategory: '',
    price: '',
    location: '',
    description: '',
    features: [''],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // API'ye gönderme işlemi burada yapılacak
    console.log('Form data:', formData);
    console.log('Images:', images);
    router.push('/ilan-basarili');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-alo-dark mb-8">Yeni İlan Oluştur</h1>

        {/* Adım Göstergesi */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNumber ? 'bg-alo-orange text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-24 h-1 mx-2 ${
                      step > stepNumber ? 'bg-alo-orange' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Kategori Seçimi</span>
            <span>İlan Detayları</span>
            <span>Görseller</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Adım 1: Kategori Seçimi */}
          {step === 1 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-alo-dark mb-4">Kategori Seçimi</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Ana Kategori
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 focus:border-alo-orange focus:ring-alo-orange"
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.category && (
                  <div>
                    <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-1">
                      Alt Kategori
                    </label>
                    <select
                      id="subCategory"
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 focus:border-alo-orange focus:ring-alo-orange"
                      required
                    >
                      <option value="">Alt Kategori Seçin</option>
                      {categories
                        .find((cat) => cat.id === formData.category)
                        ?.subCategories.map((subCat) => (
                          <option key={subCat} value={subCat}>
                            {subCat}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Adım 2: İlan Detayları */}
          {step === 2 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-alo-dark mb-4">İlan Detayları</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    İlan Başlığı
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 focus:border-alo-orange focus:ring-alo-orange"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Fiyat
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 focus:border-alo-orange focus:ring-alo-orange pl-12"
                      required
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₺</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Konum
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 focus:border-alo-orange focus:ring-alo-orange"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full rounded-lg border-gray-300 focus:border-alo-orange focus:ring-alo-orange"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Özellikler</label>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          className="flex-1 rounded-lg border-gray-300 focus:border-alo-orange focus:ring-alo-orange"
                          placeholder="Özellik ekleyin"
                        />
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="p-2 text-gray-500 hover:text-alo-red"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-sm text-alo-orange hover:text-alo-light-orange"
                    >
                      + Özellik Ekle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Adım 3: Görseller */}
          {step === 3 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-alo-dark mb-4">Görseller</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                      >
                        <XMarkIcon className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  ))}
                  {images.length < 10 && (
                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-alo-orange">
                      <PhotoIcon className="w-8 h-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">Görsel Ekle</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  En fazla 10 görsel yükleyebilirsiniz. Her görsel en fazla 5MB olabilir.
                </p>
              </div>
            </div>
          )}

          {/* Navigasyon Butonları */}
          <div className="flex justify-between pt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 text-gray-600 hover:text-alo-orange"
              >
                Geri
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 bg-alo-orange text-white rounded-lg hover:bg-alo-light-orange"
              >
                İleri
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-alo-orange text-white rounded-lg hover:bg-alo-light-orange"
              >
                İlanı Yayınla
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 