"use client";
import { useEffect, useState } from "react";

export default function OdemePage() {
  const [iframeHtml, setIframeHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<'bireysel' | 'kurumsal'>('bireysel');
  const [form, setForm] = useState({
    name: '',
    tc: '',
    email: '',
    phone: '',
    address: '',
    // Kurumsal
    company: '',
    taxOffice: '',
    taxNo: '',
    authorized: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIframeHtml(null);
    setLoading(true);
    try {
      const res = await fetch("/api/paytr-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_ip: "127.0.0.1",
          merchant_oid: "ORDER" + Date.now(),
          email: form.email,
          payment_amount: 1000, // 10 TL (kuruş)
          product_name: "Test Ürün",
          product_price: "10.00",
          user_name: form.name,
          user_address: form.address,
          user_phone: form.phone,
          ok_url: "https://alo17.netlify.app/odeme/basarili",
          fail_url: "https://alo17.netlify.app/odeme/basarisiz",
          test_mode: "1",
          payment_type: paymentType,
          tc: form.tc,
          company: form.company,
          taxOffice: form.taxOffice,
          taxNo: form.taxNo,
          authorized: form.authorized,
        }),
      });
      const data = await res.json();
      if (res.ok && data.iframe) {
        setIframeHtml(data.iframe);
      } else {
        setError(data.error || "Ödeme başlatılamadı");
      }
    } catch (err) {
      setError("Sunucu hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Ödeme Yap</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4 mb-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentType"
                value="bireysel"
                checked={paymentType === 'bireysel'}
                onChange={() => setPaymentType('bireysel')}
                className="mr-2"
              />
              Bireysel
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentType"
                value="kurumsal"
                checked={paymentType === 'kurumsal'}
                onChange={() => setPaymentType('kurumsal')}
                className="mr-2"
              />
              Kurumsal
            </label>
          </div>

          {paymentType === 'bireysel' ? (
            <>
              <input
                type="text"
                name="name"
                placeholder="Ad Soyad"
                value={form.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                name="tc"
                placeholder="TC Kimlik No"
                value={form.tc}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </>
          ) : (
            <>
              <input
                type="text"
                name="company"
                placeholder="Şirket Ünvanı"
                value={form.company}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                name="taxOffice"
                placeholder="Vergi Dairesi"
                value={form.taxOffice}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                name="taxNo"
                placeholder="Vergi No"
                value={form.taxNo}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                name="authorized"
                placeholder="Yetkili Ad Soyad"
                value={form.authorized}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="E-posta"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Telefon"
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <textarea
            name="address"
            placeholder="Adres"
            value={form.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Yükleniyor..." : "Ödeme Sayfasına Geç"}
          </button>
        </form>
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
        {iframeHtml && (
          <div className="mt-8">
            <div dangerouslySetInnerHTML={{ __html: iframeHtml }} />
          </div>
        )}
      </div>
    </div>
  );
} 