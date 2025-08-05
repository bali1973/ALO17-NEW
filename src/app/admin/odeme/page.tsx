"use client";
import { useEffect, useState } from "react";

interface Payment {
  date: string;
  payment_type: string;
  fatura_type: string;
  user_name: string;
  email: string;
  user_phone: string;
  user_address: string;
  buyer_company: string;
  buyer_tax_office: string;
  buyer_tax_no: string;
  buyer_tc: string;
  buyer_authorized: string;
  product_name: string;
  product_price: string;
  payment_amount: number;
  merchant_oid: string;
  status: string;
}

declare global {
  interface Window {
    jspdf: any;
  }
}

export default function AdminOdemePage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Payment | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/payments.json");
        if (!res.ok) throw new Error("Kayıtlar yüklenemedi");
        const data = await res.json();
        setPayments(data.reverse());
      } catch (err: any) {
        setError(err.message || "Hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Ödeme & Fatura Kayıtları</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading ? (
        <div>Yükleniyor...</div>
      ) : payments.length === 0 ? (
        <div>Kayıt bulunamadı.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Tarih</th>
                <th className="p-2 border">Kullanıcı</th>
                <th className="p-2 border">E-posta</th>
                <th className="p-2 border">Ödeme Tipi</th>
                <th className="p-2 border">Fatura Tipi</th>
                <th className="p-2 border">Tutar</th>
                <th className="p-2 border">Durum</th>
                <th className="p-2 border">Detay</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-2 border">{new Date(p.date).toLocaleString('tr-TR')}</td>
                  <td className="p-2 border">{p.user_name}</td>
                  <td className="p-2 border">{p.email}</td>
                  <td className="p-2 border">{p.payment_type}</td>
                  <td className="p-2 border">{p.fatura_type}</td>
                  <td className="p-2 border">{(p.payment_amount / 100).toFixed(2)} TL</td>
                  <td className="p-2 border">{p.status}</td>
                  <td className="p-2 border">
                    <button onClick={() => setSelected(p)} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">Detay</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Detay Modalı */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative">
            <button onClick={() => setSelected(null)} className="absolute top-2 right-2 text-gray-500 hover:text-red-600">Kapat</button>
            <h2 className="text-xl font-bold mb-4">Fatura Detayı</h2>
            <div className="space-y-2">
              <div><b>Kullanıcı:</b> {selected.user_name}</div>
              <div><b>E-posta:</b> {selected.email}</div>
              <div><b>Telefon:</b> {selected.user_phone}</div>
              <div><b>Adres:</b> {selected.user_address}</div>
              <div><b>Ödeme Tipi:</b> {selected.payment_type}</div>
              <div><b>Fatura Tipi:</b> {selected.fatura_type}</div>
              {selected.fatura_type === 'kurumsal' ? (
                <>
                  <div><b>Şirket Ünvanı:</b> {selected.buyer_company}</div>
                  <div><b>Vergi Dairesi:</b> {selected.buyer_tax_office}</div>
                  <div><b>Vergi No:</b> {selected.buyer_tax_no}</div>
                  <div><b>Yetkili:</b> {selected.buyer_authorized}</div>
                </>
              ) : (
                <div><b>TC Kimlik No:</b> {selected.buyer_tc}</div>
              )}
              <div><b>Ürün:</b> {selected.product_name}</div>
              <div><b>Ürün Fiyatı:</b> {selected.product_price} TL</div>
              <div><b>Ödenen Tutar:</b> {(selected.payment_amount / 100).toFixed(2)} TL</div>
              <div><b>Tarih:</b> {new Date(selected.date).toLocaleString('tr-TR')}</div>
              <div><b>Durum:</b> {selected.status}</div>
              <div><b>İşlem No:</b> {selected.merchant_oid}</div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={async () => {
                  if (typeof window !== "undefined") {
                    // Eğer jsPDF yüklü değilse script ekle
                    if (!window.jspdf) {
                      await new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = '/vendor/jspdf.umd.min.js';
                        script.onload = resolve;
                        script.onerror = reject;
                        document.body.appendChild(script);
                      });
                    }
                    // @ts-expect-error - jsPDF global window object
                    const jsPDF = window.jspdf.jsPDF;
                    const doc = new jsPDF();
                    const p = selected;
                    let y = 10;
                    doc.setFontSize(16);
                    doc.text('FATURA', 105, y, { align: 'center' });
                    y += 10;
                    doc.setFontSize(10);
                    doc.text(`Tarih: ${new Date(p.date).toLocaleString('tr-TR')}`, 10, y);
                    y += 8;
                    doc.text(`Fatura Tipi: ${p.fatura_type}`, 10, y);
                    y += 8;
                    if (p.fatura_type === 'kurumsal') {
                      doc.text(`Şirket Ünvanı: ${p.buyer_company}`, 10, y); y += 8;
                      doc.text(`Vergi Dairesi: ${p.buyer_tax_office}`, 10, y); y += 8;
                      doc.text(`Vergi No: ${p.buyer_tax_no}`, 10, y); y += 8;
                      doc.text(`Yetkili: ${p.buyer_authorized}`, 10, y); y += 8;
                    } else {
                      doc.text(`TC Kimlik No: ${p.buyer_tc}`, 10, y); y += 8;
                    }
                    doc.text(`Ad Soyad: ${p.user_name}`, 10, y); y += 8;
                    doc.text(`E-posta: ${p.email}`, 10, y); y += 8;
                    doc.text(`Telefon: ${p.user_phone}`, 10, y); y += 8;
                    doc.text(`Adres: ${p.user_address}`, 10, y); y += 8;
                    y += 4;
                    doc.setFontSize(12);
                    doc.text('Ürün Bilgileri', 10, y); y += 8;
                    doc.setFontSize(10);
                    doc.text(`Ürün: ${p.product_name}`, 10, y); y += 8;
                    doc.text(`Ürün Fiyatı: ${p.product_price} TL`, 10, y); y += 8;
                    doc.text(`Ödenen Tutar: ${(p.payment_amount / 100).toFixed(2)} TL`, 10, y); y += 8;
                    doc.text(`İşlem No: ${p.merchant_oid}`, 10, y); y += 8;
                    doc.text(`Durum: ${p.status}`, 10, y); y += 8;
                    doc.save(`fatura_${p.merchant_oid}.pdf`);
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Fatura PDF İndir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
