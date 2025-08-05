'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Heart, Phone, Mail, Share2, Facebook, Twitter, Instagram, MessageCircle, ChevronRight, Eye, BarChart, MessageSquare, AlertTriangle, User, ArrowLeft, Edit, Check, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';


const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Hw7Zyc2VsIFlvayA8L3RleHQ+PC9zdmc+';

export default function IlanOnizlemePage() {
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  // Kategorileri yükle
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
      }
    };

    fetchCategories();
  }, []);

  // Kategori adını bul
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Alt kategori adını bul
  const getSubCategoryName = (subcategoryId: string) => {
    const category = categories.find(cat => cat.id === listing.category);
    if (category && category.subcategories) {
      const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
      return subcategory ? subcategory.name : subcategoryId;
    }
    return subcategoryId;
  };

  // URL parametrelerinden ilan verilerini al
  useEffect(() => {
    const fetchPreviewData = () => {
      try {
        // URL'den ilan verilerini al
        const title = searchParams.get('title') || '';
        const description = searchParams.get('description') || '';
        const price = searchParams.get('price') || '';
        const category = searchParams.get('category') || '';
        const subcategory = searchParams.get('subcategory') || '';
        const location = searchParams.get('location') || '';
        const images = searchParams.get('images') ? JSON.parse(searchParams.get('images')!) : [];
        const contactPhone = searchParams.get('contactPhone') || '';
        const phoneVisibility = searchParams.get('phoneVisibility') || 'public';
        const contactEmail = searchParams.get('contactEmail') || '';
        const sellerName = searchParams.get('sellerName') || '';

        // Ön izleme için mock listing objesi oluştur
        const previewListing = {
          id: 'preview',
          title,
          description,
          price: parseFloat(price) || 0,
          category,
          subcategory,
          location,
          images: images.length > 0 ? images : [placeholderImage],
          contactPhone,
          phoneVisibility,
          contactEmail,
          seller: {
            name: sellerName,
            email: contactEmail
          },
          createdAt: new Date().toISOString(),
          status: 'preview'
        };

        setListing(previewListing);
      } catch (error) {
        console.error('Ön izleme verileri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviewData();
  }, [searchParams]);

  const handleShare = (platform: string) => {
    if (!listing) return;

    const shareUrl = window.location.href;
    const shareText = `${listing.title} - ${listing.price} TL`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'instagram':
        window.open('https://www.instagram.com', '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank');
        break;
    }
    setShowShareMenu(false);
  };

  const getDefaultImage = () => {
    if (!listing) return placeholderImage;
    return listing.images[selectedImage] || placeholderImage;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const handlePublish = () => {
    // İlanı yayınla - burada gerçek API çağrısı yapılacak
    alert('İlan başarıyla yayınlandı!');
    router.push('/ilanlar');
  };

  const handleEdit = () => {
    // İlan verilerini localStorage'a kaydet
    const draftData = {
      title: listing.title,
      description: listing.description,
      price: listing.price.toString(),
      category: listing.category,
      subcategory: listing.subcategory,
      condition: searchParams.get('condition') || '',
      location: listing.location,
      contactPhone: listing.contactPhone,
      phoneVisibility: listing.phoneVisibility,
      contactEmail: listing.contactEmail,
      sellerName: listing.seller.name,
      images: listing.images,
      isDraft: true
    };
    
    localStorage.setItem('ilanDraftData', JSON.stringify(draftData));
    
    // İlan ver sayfasına yönlendir
    router.push('/ilan-ver?draft=1');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ön izleme yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Ön izleme verileri bulunamadı</h1>
          <p className="text-gray-600 mt-2">İlan verilerini kontrol edin ve tekrar deneyin.</p>
          <Link href="/ilan-ver" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            İlan Ver Sayfasına Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Banner */}
      <div className="bg-yellow-100 border-b border-yellow-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">İlan Ön İzleme</span>
              <span className="text-yellow-600 text-sm">Bu bir ön izlemedir, henüz yayınlanmamıştır</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEdit}
                className="flex items-center space-x-1 bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Düzenle</span>
              </button>
              <button
                onClick={handlePublish}
                className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>Yayınla</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-700 hover:text-alo-orange">
                Ana Sayfa
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link href={`/kategori/${listing.category.toLowerCase()}`} className="text-gray-700 hover:text-alo-orange">
                  {getCategoryName(listing.category)}
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">Ön İzleme</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Kolon - Resimler */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Ana Resim */}
              <div className="relative aspect-video bg-gray-100">
                <Image
                  src={getDefaultImage()}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  onError={() => setSelectedImage(0)}
                />
                {listing.images.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {selectedImage + 1} / {listing.images.length}
                  </div>
                )}
              </div>

              {/* Küçük Resimler */}
              {listing.images.length > 1 && (
                <div className="p-4">
                  <div className="grid grid-cols-5 gap-2">
                    {listing.images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                          selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${listing.title} - Resim ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sağ Kolon - İlan Bilgileri */}
          <div className="space-y-6">
            {/* İlan Başlığı ve Fiyat */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
              <div className="text-3xl font-bold text-alo-orange mb-4">
                {formatPrice(listing.price)}
              </div>
              
              {/* Kategori ve Konum */}
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {getCategoryName(listing.category)}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {listing.location}
                </div>
              </div>

              {/* Aksiyon Butonları */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Paylaş</span>
                </button>
              </div>

              {/* Paylaşım Menüsü */}
              {showShareMenu && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                    >
                      <Facebook className="h-4 w-4" />
                      <span>Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center space-x-2 bg-blue-400 text-white px-3 py-2 rounded hover:bg-blue-500"
                    >
                      <Twitter className="h-4 w-4" />
                      <span>Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="flex items-center space-x-2 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleShare('instagram')}
                      className="flex items-center space-x-2 bg-pink-500 text-white px-3 py-2 rounded hover:bg-pink-600"
                    >
                      <Instagram className="h-4 w-4" />
                      <span>Instagram</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Satıcı Bilgileri */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Satıcı Bilgileri</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{listing.seller.name}</span>
                </div>
                
                {/* Telefon Görünürlüğü */}
                {listing.contactPhone && (
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      {listing.phoneVisibility === 'public' && (
                        <span className="text-gray-700">{listing.contactPhone}</span>
                      )}
                      {listing.phoneVisibility === 'private' && (
                        <span className="text-gray-500 italic">Telefon numarası gizli</span>
                      )}
                      {listing.phoneVisibility === 'message_only' && (
                        <span className="text-gray-500 italic">Telefon numarası sadece mesaj yoluyla iletilecek</span>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      listing.phoneVisibility === 'public' ? 'bg-green-100 text-green-800' :
                      listing.phoneVisibility === 'private' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {listing.phoneVisibility === 'public' ? 'Açık' :
                       listing.phoneVisibility === 'private' ? 'Gizli' : 'Mesaj'}
                    </span>
                  </div>
                )}
                
                {listing.contactEmail && (
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{listing.contactEmail}</span>
                  </div>
                )}
              </div>
            </div>

            {/* İlan Detayları */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İlan Detayları</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Kategori:</span>
                  <span className="text-gray-900">{getCategoryName(listing.category)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Alt Kategori:</span>
                  <span className="text-gray-900">{getSubCategoryName(listing.subcategory)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Konum:</span>
                  <span className="text-gray-900">{listing.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Yayın Tarihi:</span>
                  <span className="text-gray-900">
                    {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* İlan Açıklaması */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">İlan Açıklaması</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
            </div>
          </div>
        </div>

        {/* Aksiyon Butonları - Alt */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={handleEdit}
            className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Edit className="h-5 w-5" />
            <span>Düzenle</span>
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Check className="h-5 w-5" />
            <span>İlanı Yayınla</span>
          </button>
        </div>
      </div>
    </div>
  );
} 
