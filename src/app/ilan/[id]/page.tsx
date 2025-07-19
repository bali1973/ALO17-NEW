'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Providers';

interface Ilan {
  id: number;
  title: string;
  description: string;
  price: number | string;
  location?: string;
  category?: string;
  subCategory?: string;
  subcategory?: string; // küçük harfli varyantı da type'a ekle
  images?: string | string[];
  features?: string | string[];
  condition?: string;
  brand?: string;
  model?: string;
  year?: string;
  status?: string;
  isPremium?: boolean;
  premiumFeatures?: string[];
  views?: number;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  user?: string;
  email?: string;
  userRole?: string;
}

interface IlanDetayPageProps {
  params: { id: string };
}

export default function IlanDetayPage({ params }: IlanDetayPageProps) {
  const [ilan, setIlan] = useState<Ilan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favMsg, setFavMsg] = useState<string | null>(null);
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [modalInfo, setModalInfo] = useState<string | null>(null);
  const router = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    const fetchIlan = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/listings/${params.id}`);
        if (!res.ok) throw new Error('İlan bulunamadı veya silinmiş olabilir. Lütfen geçerli bir ilan ID giriniz.');
        const data = await res.json();
        setIlan(data);
      } catch (e: any) {
        setError(e.message || 'İlan bulunamadı.');
      } finally {
        setLoading(false);
      }
    };
    fetchIlan();
  }, [params.id]);

  // Görsel alanı: string veya dizi olabilir
  let images: string[] = [];
  if (ilan?.images) {
    if (typeof ilan.images === 'string') {
      try {
        const parsed = JSON.parse(ilan.images);
        if (Array.isArray(parsed)) images = parsed;
        else images = [ilan.images];
      } catch {
        images = [ilan.images];
      }
    } else if (Array.isArray(ilan.images)) {
      images = ilan.images;
    }
  }

  // Özellikler alanı: string veya dizi olabilir
  let features: string[] = [];
  if (ilan?.features) {
    if (typeof ilan.features === 'string') {
      try {
        const parsed = JSON.parse(ilan.features);
        if (Array.isArray(parsed)) features = parsed;
        else features = [ilan.features];
      } catch {
        features = ilan.features.split(',').map(f => f.trim());
      }
    } else if (Array.isArray(ilan.features)) {
      features = ilan.features;
    }
  }

  // Favorilere ekle fonksiyonu
  const handleAddFavorite = () => {
    if (!session) {
      router.push(`/giris?redirect=/ilan/${params.id}`);
      return;
    }
    if (!ilan) return;
    try {
      const key = 'frequentlyUsed';
      let favs: number[] = [];
      if (typeof window !== 'undefined') {
        favs = JSON.parse(localStorage.getItem(key) || '[]');
        if (favs.includes(ilan.id)) {
          setFavMsg('Bu ilan zaten favorilerde!');
          return;
        }
        favs.unshift(ilan.id);
        localStorage.setItem(key, JSON.stringify(favs));
        setFavMsg('Favorilere eklendi!');
      }
    } catch {
      setFavMsg('Favorilere eklenirken hata oluştu.');
    }
    setTimeout(() => setFavMsg(null), 2000);
  };

  // Mesaj gönder fonksiyonu
  const handleSendMessage = async () => {
    if (!session) {
      router.push(`/giris?redirect=/ilan/${params.id}`);
      return;
    }
    if (!messageContent.trim()) {
      setModalInfo('Mesaj boş olamaz!');
      return;
    }
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: session.user.email,
          receiver: ilan?.email || 'bilinmiyor',
          content: messageContent,
          date: new Date().toISOString(),
        })
      });
      if (res.ok) {
        setModalInfo('Mesaj gönderildi!');
        setMessageContent('');
        setTimeout(() => { setShowMsgModal(false); setModalInfo(null); }, 1500);
      } else {
        setModalInfo('Mesaj gönderilemedi!');
      }
    } catch {
      setModalInfo('Mesaj gönderilemedi!');
    }
  };

  // Rapor gönder fonksiyonu
  const handleSendReport = async () => {
    if (!session) {
      router.push(`/giris?redirect=/ilan/${params.id}`);
      return;
    }
    if (!reportContent.trim()) {
      setModalInfo('Rapor mesajı boş olamaz!');
      return;
    }
    try {
      const res = await fetch('/api/raporlar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'İlan Şikayeti',
          subject: reportContent,
          date: new Date().toISOString().slice(0, 10),
          status: 'Açık',
          user: session.user.email
        })
      });
      if (res.ok) {
        setModalInfo('Rapor gönderildi!');
        setReportContent('');
        setTimeout(() => { setShowReportModal(false); setModalInfo(null); }, 1500);
      } else {
        setModalInfo('Rapor gönderilemedi!');
      }
    } catch {
      setModalInfo('Rapor gönderilemedi!');
    }
  };

  // Paylaş fonksiyonu
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: ilan?.title,
          text: ilan?.description,
          url: shareUrl,
        });
      } else {
        navigator.clipboard.writeText(shareUrl);
        setFavMsg('Link kopyalandı!');
        setTimeout(() => setFavMsg(null), 2000);
      }
    }
  };

  if (loading) return <div className="p-8">Yükleniyor...</div>;
  if (error || !ilan) return <div className="p-8 text-red-600 font-semibold">{error || 'İlan bulunamadı.'}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Görseller */}
        <div className="md:w-1/2">
          {images.length > 0 ? (
            <div className="flex flex-col gap-4">
              {images.map((img, i) => (
                <Image key={i} src={img} alt={ilan.title} width={400} height={300} className="rounded-lg object-cover" />
              ))}
            </div>
          ) : (
            <div className="bg-gray-200 w-full h-64 flex items-center justify-center rounded-lg">Görsel yok</div>
          )}
        </div>
        {/* Bilgiler */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h1 className="text-2xl font-bold mb-2">{ilan.title}</h1>
          <div className="text-lg text-gray-700 font-semibold">Fiyat: {ilan.price} TL</div>
          <div className="text-gray-500">{ilan.description}</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {features.length > 0 && features.map((f, i) => (
              <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{f}</span>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div><b>Durum:</b> {ilan.condition || '-'}</div>
            <div><b>Konum:</b> {ilan.location || '-'}</div>
            <div><b>Kategori:</b> {ilan.category || '-'}</div>
            <div><b>Alt Kategori:</b> {ilan.subCategory || ilan.subcategory || '-'}</div>
            <div><b>Marka:</b> {ilan.brand || '-'}</div>
            <div><b>Model:</b> {ilan.model || '-'}</div>
            <div><b>Yıl:</b> {ilan.year || '-'}</div>
            <div><b>İlan Durumu:</b> {ilan.status || '-'}</div>
            <div><b>Premium:</b> {ilan.isPremium ? 'Evet' : 'Hayır'}</div>
            <div><b>Görüntülenme:</b> {ilan.views ?? '-'}</div>
            <div><b>Eklenme:</b> {ilan.createdAt ? new Date(ilan.createdAt).toLocaleString('tr-TR') : '-'}</div>
            <div><b>Güncelleme:</b> {ilan.updatedAt ? new Date(ilan.updatedAt).toLocaleString('tr-TR') : '-'}</div>
          </div>
          <div className="mt-4 text-sm">
            <b>Kullanıcı:</b> {ilan.user || ilan.userId || '-'}<br />
            <b>E-posta:</b> {ilan.email || '-'}
          </div>
          {/* İşlevsel butonlar */}
          <div className="flex gap-2 mt-6">
            <button
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
              onClick={handleAddFavorite}
              title={session ? '' : 'Bu işlemi yapmak için giriş yapmalısınız.'}
            >Favorilere Ekle</button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => {
                if (!session) {
                  router.push(`/giris?redirect=/ilan/${params.id}`);
                  return;
                }
                setShowMsgModal(true);
              }}
              title={session ? '' : 'Bu işlemi yapmak için giriş yapmalısınız.'}
            >Mesaj Gönder</button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              onClick={() => {
                if (!session) {
                  router.push(`/giris?redirect=/ilan/${params.id}`);
                  return;
                }
                setShowReportModal(true);
              }}
              title={session ? '' : 'Bu işlemi yapmak için giriş yapmalısınız.'}
            >İlanı Bildir</button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={handleShare}
            >Paylaş</button>
          </div>
          {favMsg && <div className="mt-2 text-green-600 font-semibold">{favMsg}</div>}
        </div>
      </div>
      {/* Mesaj Gönder Modalı */}
      {showMsgModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
            <button onClick={() => setShowMsgModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
            <h2 className="text-xl font-bold mb-4">Mesaj Gönder</h2>
            <textarea value={messageContent} onChange={e => setMessageContent(e.target.value)} className="w-full border rounded p-2 mb-4" rows={4} placeholder="Mesajınızı yazın..." />
            <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">Gönder</button>
            {modalInfo && <div className="mt-2 text-green-600">{modalInfo}</div>}
          </div>
        </div>
      )}
      {/* Raporla Modalı */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
            <button onClick={() => setShowReportModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
            <h2 className="text-xl font-bold mb-4">İlanı Bildir</h2>
            <textarea value={reportContent} onChange={e => setReportContent(e.target.value)} className="w-full border rounded p-2 mb-4" rows={4} placeholder="Rapor nedeninizi yazın..." />
            <button onClick={handleSendReport} className="bg-yellow-500 text-white px-4 py-2 rounded">Raporla</button>
            {modalInfo && <div className="mt-2 text-green-600">{modalInfo}</div>}
          </div>
        </div>
      )}
    </div>
  );
} 