'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// Stripe ile ilgili importları kaldır
// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const FEATURE_PRICE_API = '/api/premium-feature-prices';
const PLAN_PRICE_API = '/api/premium-plans';
const INVOICE_STORAGE_KEY = 'ilanOdemeInvoice';

export default function IlanOdemePage() {
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [invoiceType, setInvoiceType] = useState<'bireysel' | 'kurumsal'>('bireysel');
  const [invoiceInfo, setInvoiceInfo] = useState({
    name: '',
    address: '',
    tc: '',
    company: '',
    taxOffice: '',
    taxNo: '',
    authorized: '',
  });
  const [featurePrices, setFeaturePrices] = useState<Record<string, number>>({});
  const [planPrices, setPlanPrices] = useState<Record<string, any>>({});
  const [paytrIframe, setPaytrIframe] = useState<string>('');

  useEffect(() => {
    const data = localStorage.getItem('pendingListing');
    if (data) {
      setListing(JSON.parse(data));
    }
    fetch(FEATURE_PRICE_API)
      .then(res => res.json())
      .then(setFeaturePrices)
      .catch(() => setFeaturePrices({}));
    fetch(PLAN_PRICE_API)
      .then(res => res.json())
      .then(setPlanPrices)
      .catch(() => setPlanPrices({}));
    setLoading(false);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(INVOICE_STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setInvoiceType(data.invoiceType ?? 'bireysel');
      setInvoiceInfo((prev: any) => ({ ...prev, ...data.invoiceInfo }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify({
      invoiceType,
      invoiceInfo,
    }));
  }, [invoiceType, invoiceInfo]);

  // Adım 2'ye geçildiğinde PayTR iframe'i al
  useEffect(() => {
    if (step === 2 && !paytrIframe) {
      // Toplam tutarı hesapla
      const planPrice = (listing.selectedPremiumPlan && listing.selectedPremiumPlan !== 'free' && planPrices[listing.selectedPremiumPlan]?.price) || 0;
      const featuresTotal = listing.selectedFeatures ? listing.selectedFeatures.reduce((sum: number, key: string) => sum + (featurePrices[key] || 0), 0) : 0;
      const total = planPrice + featuresTotal;
      fetch('/api/paytr-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_ip: '127.0.0.1',
          merchant_oid: `ORDER_${Date.now()}`,
          email: listing.email,
          payment_amount: total * 100, // PayTR kuruş cinsinden ister
          user_name: invoiceType === 'bireysel' ? invoiceInfo.name : invoiceInfo.authorized,
          user_address: invoiceInfo.address,
          user_phone: '',
          ok_url: window.location.origin + '/ilan-odeme?success=1',
          fail_url: window.location.origin + '/ilan-odeme?fail=1',
          test_mode: '1',
          payment_type: invoiceType,
          company: invoiceInfo.company,
          taxOffice: invoiceInfo.taxOffice,
          taxNo: invoiceInfo.taxNo,
          authorized: invoiceInfo.authorized,
          tc: invoiceInfo.tc,
          product_name: listing.formData.title,
          product_price: total.toFixed(2),
        }),
      })
        .then(res => res.json())
        .then(data => {
          setPaytrIframe(data.iframe);
        })
        .catch(() => setError('PayTR ödeme başlatılamadı.'));
    }
  }, [step, paytrIframe, listing, invoiceType, invoiceInfo, planPrices, featurePrices]);

  const handleInvoiceNext = () => {
    // Basit validasyon
    if (invoiceType === 'bireysel') {
      if (!invoiceInfo.name || !invoiceInfo.address || !invoiceInfo.tc) {
        setError('Lütfen tüm bireysel fatura alanlarını doldurun.');
        return;
      }
      // TC Kimlik No: tam olarak 11 haneli ve sadece rakam
      if (invoiceInfo.tc.length !== 11 || !/^[0-9]{11}$/.test(invoiceInfo.tc)) {
        setError('TC Kimlik No tam olarak 11 haneli ve sadece rakamlardan oluşmalıdır.');
        return;
      }
    }
    if (invoiceType === 'kurumsal') {
      if (!invoiceInfo.company || !invoiceInfo.taxOffice || !invoiceInfo.taxNo || !invoiceInfo.address || !invoiceInfo.authorized) {
        setError('Lütfen tüm kurumsal fatura alanlarını doldurun.');
        return;
      }
      // Vergi No: tam olarak 10 haneli ve sadece rakam
      if (invoiceInfo.taxNo.length !== 10 || !/^[0-9]{10}$/.test(invoiceInfo.taxNo)) {
        setError('Vergi No tam olarak 10 haneli ve sadece rakamlardan oluşmalıdır.');
        return;
      }
    }
    setError('');
    setStep(2);
  };

  const handleTestPayment = async () => {
    setError('');
    setLoading(true);
    try {
      // Test ödeme başarılı simülasyonu
      const payload = {
        ...listing.formData,
        premiumPlan: listing.selectedPremiumPlan,
        features: listing.selectedFeatures,
        user: listing.user,
        email: listing.email,
        userRole: listing.userRole,
        invoiceType,
        invoiceInfo,
      };
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setSuccess(true);
        localStorage.removeItem('pendingListing');
        setTimeout(() => router.push('/'), 2000);
      } else {
        setError('İlan kaydedilemedi.');
      }
    } catch (e) {
      setError('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (!listing) return <div>İlan verisi bulunamadı.</div>;

  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">Fatura & Test Ödeme</h1>
      {step === 1 && (
        <div className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Fatura Bilgileri</h2>
          <div className="mb-4 flex gap-4">
            <label>
              <input type="radio" checked={invoiceType === 'bireysel'} onChange={() => setInvoiceType('bireysel')} /> Bireysel
            </label>
            <label>
              <input type="radio" checked={invoiceType === 'kurumsal'} onChange={() => setInvoiceType('kurumsal')} /> Kurumsal
            </label>
          </div>
          {invoiceType === 'bireysel' ? (
            <>
              <div className="mb-2">
                <input type="text" className="w-full border rounded p-2" placeholder="Ad Soyad" value={invoiceInfo.name} onChange={e => setInvoiceInfo(i => ({ ...i, name: e.target.value }))} />
              </div>
              <div className="mb-2">
                <input type="text" className="w-full border rounded p-2" placeholder="Adres" value={invoiceInfo.address} onChange={e => setInvoiceInfo(i => ({ ...i, address: e.target.value }))} />
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  placeholder="TC Kimlik No"
                  value={invoiceInfo.tc}
                  maxLength={11}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={e => {
                    // Sadece rakam girilmesine izin ver
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setInvoiceInfo(i => ({ ...i, tc: val }));
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-2">
                <input type="text" className="w-full border rounded p-2" placeholder="Şirket Ünvanı" value={invoiceInfo.company} onChange={e => setInvoiceInfo(i => ({ ...i, company: e.target.value }))} />
              </div>
              <div className="mb-2">
                <input type="text" className="w-full border rounded p-2" placeholder="Vergi Dairesi" value={invoiceInfo.taxOffice} onChange={e => setInvoiceInfo(i => ({ ...i, taxOffice: e.target.value }))} />
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  placeholder="Vergi No"
                  value={invoiceInfo.taxNo}
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={e => {
                    // Sadece rakam girilmesine izin ver
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setInvoiceInfo(i => ({ ...i, taxNo: val }));
                  }}
                />
              </div>
              <div className="mb-2">
                <input type="text" className="w-full border rounded p-2" placeholder="Yetkili Kişi" value={invoiceInfo.authorized} onChange={e => setInvoiceInfo(i => ({ ...i, authorized: e.target.value }))} />
              </div>
              <div className="mb-2">
                <input type="text" className="w-full border rounded p-2" placeholder="Adres" value={invoiceInfo.address} onChange={e => setInvoiceInfo(i => ({ ...i, address: e.target.value }))} />
              </div>
            </>
          )}
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <button onClick={handleInvoiceNext} className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold mt-4">Devam</button>
        </div>
      )}
      {step === 2 && (
        <div className="max-w-lg mx-auto bg-white rounded shadow p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Ödeme Özeti</h2>
          <div className="mb-2"><b>Başlık:</b> {listing.formData.title}</div>
          <div className="mb-2"><b>Açıklama:</b> {listing.formData.description}</div>
          <div className="mb-2"><b>Fiyat:</b> {listing.formData.price} ₺</div>
          <div className="mb-2"><b>Premium Plan:</b> {listing.selectedPremiumPlan}</div>
          {/* Premium plan fiyatı */}
          {listing.selectedPremiumPlan && listing.selectedPremiumPlan !== 'free' && planPrices[listing.selectedPremiumPlan] && (
            <div className="mb-2">
              <b>Premium Plan Ücreti:</b> {planPrices[listing.selectedPremiumPlan].price} ₺
            </div>
          )}
          <div className="mb-2"><b>Ekstra Özellikler:</b> {listing.selectedFeatures?.join(', ') || '-'}</div>
          {/* Premium özellik fiyat dökümü */}
          {listing.selectedFeatures && listing.selectedFeatures.length > 0 && (
            <div className="mb-2">
              <b>Premium Özellik Fiyatları:</b>
              <ul className="ml-4 mt-1">
                {listing.selectedFeatures.map((feature: string) => (
                  <li key={feature}>
                    {feature} : {featurePrices[feature] || 0} ₺
                  </li>
                ))}
              </ul>
              <div className="mt-2 font-bold">
                Toplam Premium Özellik Ücreti: {listing.selectedFeatures.reduce((sum: number, key: string) => sum + (featurePrices[key] || 0), 0)} ₺
              </div>
            </div>
          )}
          {/* Toplam ücret */}
          <div className="mt-4 text-lg font-bold">
            Toplam Ödenecek Tutar: {
              ((listing.selectedPremiumPlan && listing.selectedPremiumPlan !== 'free' && planPrices[listing.selectedPremiumPlan]?.price) || 0)
              + (listing.selectedFeatures ? listing.selectedFeatures.reduce((sum: number, key: string) => sum + (featurePrices[key] || 0), 0) : 0)
            } ₺
          </div>
          <div className="mb-2"><b>Fatura Tipi:</b> {invoiceType === 'bireysel' ? 'Bireysel' : 'Kurumsal'}</div>
          {invoiceType === 'bireysel' ? (
            <>
              <div className="mb-2"><b>Ad Soyad:</b> {invoiceInfo.name}</div>
              <div className="mb-2"><b>Adres:</b> {invoiceInfo.address}</div>
              <div className="mb-2"><b>TC Kimlik No:</b> {invoiceInfo.tc}</div>
            </>
          ) : (
            <>
              <div className="mb-2"><b>Şirket Ünvanı:</b> {invoiceInfo.company}</div>
              <div className="mb-2"><b>Vergi Dairesi:</b> {invoiceInfo.taxOffice}</div>
              <div className="mb-2"><b>Vergi No:</b> {invoiceInfo.taxNo}</div>
              <div className="mb-2"><b>Yetkili Kişi:</b> {invoiceInfo.authorized}</div>
              <div className="mb-2"><b>Adres:</b> {invoiceInfo.address}</div>
            </>
          )}
          {error && <div className="text-red-600 mb-2">{error}</div>}
          {paytrIframe ? (
            <div dangerouslySetInnerHTML={{ __html: paytrIframe }} />
          ) : (
            <div>Ödeme ekranı yükleniyor...</div>
          )}
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        </div>
      )}
    </div>
  );
} 