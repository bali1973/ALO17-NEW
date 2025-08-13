"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/Providers";
import { useCategories } from "@/lib/useCategories";

export default function IlanDuzenlePage() {
  const router = useRouter();
  const params = useParams();
  const { session, isLoading } = useAuth();
  const { categories } = useCategories();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    condition: "",
    location: "",
    images: [] as string[],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchIlan = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/listings/${params.id}`);
        if (!res.ok) throw new Error("İlan bulunamadı veya yetkiniz yok.");
        const data = await res.json();
        // Yetki kontrolü
        if (
          session?.user?.role !== "admin" &&
          data.email !== session?.user?.email
        ) {
          setError("Bu ilanı düzenleme yetkiniz yok.");
          setLoading(false);
          return;
        }
        setFormData({
          title: data.title || "",
          description: data.description || "",
          price: data.price?.toString() || "",
          category: data.category || "",
          subcategory: data.subcategory || "",
          condition: data.condition || "",
          location: data.location || "",
          images: Array.isArray(data.images) ? data.images : (data.images ? [data.images] : []),
        });
      } catch (e: any) {
        setError(e.message || "İlan bulunamadı.");
      } finally {
        setLoading(false);
      }
    };
    if (session?.user) fetchIlan();
  }, [params.id, session?.user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/listings/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          userEmail: session?.user?.email,
          userRole: session?.user?.role,
        }),
      });
      if (res.ok) {
        setSuccess("İlan başarıyla güncellendi!");
        setTimeout(() => router.push("/profil"), 1200);
      } else {
        const err = await res.json();
        setError(err.error || "Güncelleme başarısız.");
      }
    } catch (e: any) {
      setError(e.message || "Güncelleme başarısız.");
    }
  };

  if (loading || isLoading) return <div className="p-8 text-center">Yükleniyor...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow mt-8">
      <h1 className="text-2xl font-bold mb-6">İlanı Düzenle</h1>
      <form className="space-y-6" onSubmit={handleSave}>
        <div>
          <label className="block text-sm font-medium mb-1">Başlık</label>
          <input name="title" value={formData.title} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Açıklama</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" rows={4} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fiyat (₺)</label>
            <input name="price" type="number" value={formData.price} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Durum</label>
            <select name="condition" value={formData.condition} onChange={handleChange} className="w-full border px-3 py-2 rounded" required>
              <option value="">Durum seçin</option>
              <option value="Yeni">Yeni</option>
              <option value="İkinci El">İkinci El</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full border px-3 py-2 rounded" required>
              <option value="">Kategori seçin</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Alt Kategori</label>
            <select name="subcategory" value={formData.subcategory} onChange={handleChange} className="w-full border px-3 py-2 rounded">
              <option value="">Alt kategori seçin</option>
              {categories.find((cat: any) => cat.id === formData.category)?.subCategories?.map((sub: any) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lokasyon</label>
          <input name="location" value={formData.location} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>
        {/* Resim önizleme */}
        <div>
          <label className="block text-sm font-medium mb-1">Mevcut Resimler</label>
          <div className="flex gap-2 flex-wrap">
            {formData.images.length > 0 ? formData.images.map((img, i) => (
              <img key={i} src={img} alt="İlan görseli" className="w-24 h-24 object-cover rounded border" />
            )) : <span className="text-gray-400">Resim yok</span>}
          </div>
        </div>
        {/* Resim yükleme (isteğe bağlı olarak eklenebilir) */}
        {/* <div>
          <label className="block text-sm font-medium mb-1">Yeni Resim Ekle</label>
          <input type="file" multiple accept="image/*" />
        </div> */}
        <div className="flex gap-4 mt-6">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Kaydet</button>
          <button type="button" className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500" onClick={() => router.push("/profil")}>İptal</button>
        </div>
        {success && <div className="text-green-600 mt-2">{success}</div>}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  );
} 