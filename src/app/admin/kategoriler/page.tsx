"use client"

import { useEffect, useState } from "react";
import { useAuth } from "@/components/Providers";
import { useToast } from "@/components/ToastProvider";
import * as LucideIcons from 'lucide-react';
import React from 'react';
import { triggerCategoryUpdate } from '@/lib/useCategories';

// SubCategoryInput bileşenini sadeleştir
function SubCategoryInput({ value, onChange, onAdd, loading }: { value: string, onChange: (val: string) => void, onAdd: (name: string) => Promise<boolean>, loading: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Alt kategori adını girin..."
          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          autoComplete="off"
          disabled={loading}
        />
      </div>
      <button
        onClick={async () => {
          if (!value.trim()) return;
          await onAdd(value);
        }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
        disabled={loading}
      >
        {loading ? '⏳' : '➕ Alt Kategori Ekle'}
      </button>
    </div>
  );
}

const colorPalette = [
  "text-blue-500",
  "text-indigo-500",
  "text-orange-500",
  "text-purple-500",
  "text-pink-500",
  "text-emerald-500",
  "text-cyan-500",
  "text-amber-500",
  "text-teal-500",
  "text-rose-500",
  "text-violet-500",
  "text-lime-500",
  "text-green-600",
  "text-slate-500"
];

const iconMap: Record<string, any> = {
  // Ana kategoriler
  elektronik: LucideIcons.Smartphone,
  "ev-bahce": LucideIcons.Home,
  giyim: LucideIcons.Shirt,
  "anne-bebek": LucideIcons.Baby,
  "spor-oyunlar-eglenceler": LucideIcons.Dumbbell,
  "egitim-kurslar": LucideIcons.GraduationCap,
  "yemek-icecek": LucideIcons.Utensils,
  "turizm-gecelemeler": LucideIcons.Gift,
  "saglik-guzellik": LucideIcons.Heart,
  "sanat-hobi": LucideIcons.Palette,
  "is": LucideIcons.Briefcase,
  "hizmetler": LucideIcons.MoreHorizontal,
  diger: LucideIcons.Circle,
  // Alt kategoriler
  mobilya: LucideIcons.Sofa,
  bahce: LucideIcons.Flower2,
  "ev-aleti": LucideIcons.WashingMachine,
  kozmetik: LucideIcons.Scissors,
  "kisisel-bakim": LucideIcons.UserCheck,
  yatak: LucideIcons.BedDouble,
  "mutfak-esyasi": LucideIcons.ChefHat,
  oyun: LucideIcons.Gamepad2,
  kamera: LucideIcons.Camera,
  televizyon: LucideIcons.Tv,
  kulaklik: LucideIcons.Headphones,
  yazici: LucideIcons.Printer,
  saat: LucideIcons.Watch,
  radyo: LucideIcons.Radio,
  hoparlor: LucideIcons.Speaker,
  banyo: LucideIcons.Bath,
  aydinlatma: LucideIcons.Lightbulb,
  fan: LucideIcons.Fan,
  buzdolabi: LucideIcons.Refrigerator,
  mikrodalga: LucideIcons.Microwave,
  gozluk: LucideIcons.Glasses,
  kupa: LucideIcons.Trophy,
  hedef: LucideIcons.Target,
  muzik: LucideIcons.Music2,
  tiyatro: LucideIcons.Theater,
  parti: LucideIcons.PartyPopper,
  kamp: LucideIcons.Tent,
  bisiklet: LucideIcons.BikeIcon,
  bina: LucideIcons.Building2,
  "cocuk-oyuncak": LucideIcons.Users
};

function normalizeSlug(slug: string) {
  return slug?.toLowerCase().replace(/\s+/g, '-');
}

function getColor(slug: string, index: number) {
  return colorPalette[index % colorPalette.length];
}

function getIcon(slug: string) {
  const normalized = normalizeSlug(slug);
  return iconMap[normalized] || LucideIcons.Circle;
}

const iconOptions = [
  { value: "Smartphone", label: "📱 Telefon", icon: <LucideIcons.Smartphone className="text-blue-500" />, color: "text-blue-500" },
  { value: "Home", label: "🏠 Ev", icon: <LucideIcons.Home className="text-green-500" />, color: "text-green-500" },
  { value: "Shirt", label: "👕 Giyim", icon: <LucideIcons.Shirt className="text-purple-500" />, color: "text-purple-500" },
  { value: "Baby", label: "👶 Bebek", icon: <LucideIcons.Baby className="text-pink-500" />, color: "text-pink-500" },
  { value: "Dumbbell", label: "💪 Spor", icon: <LucideIcons.Dumbbell className="text-orange-500" />, color: "text-orange-500" },
  { value: "Heart", label: "❤️ Sağlık", icon: <LucideIcons.Heart className="text-red-500" />, color: "text-red-500" },
  { value: "GraduationCap", label: "🎓 Eğitim", icon: <LucideIcons.GraduationCap className="text-indigo-500" />, color: "text-indigo-500" },
  { value: "Utensils", label: "🍽️ Yemek", icon: <LucideIcons.Utensils className="text-yellow-500" />, color: "text-yellow-500" },
  { value: "Palette", label: "🎨 Sanat", icon: <LucideIcons.Palette className="text-teal-500" />, color: "text-teal-500" },
  { value: "Gift", label: "🎁 Turizm", icon: <LucideIcons.Gift className="text-cyan-500" />, color: "text-cyan-500" },
  { value: "Briefcase", label: "💼 İş", icon: <LucideIcons.Briefcase className="text-gray-600" />, color: "text-gray-600" },
  { value: "MoreHorizontal", label: "🔧 Hizmetler", icon: <LucideIcons.MoreHorizontal className="text-slate-500" />, color: "text-slate-500" },
  { value: "Circle", label: "⚪ Diğer", icon: <LucideIcons.Circle className="text-gray-400" />, color: "text-gray-400" },
  { value: "Laptop", label: "💻 Bilgisayar", icon: <LucideIcons.Laptop className="text-blue-600" />, color: "text-blue-600" },
  { value: "Camera", label: "📷 Kamera", icon: <LucideIcons.Camera className="text-black" />, color: "text-black" },
  { value: "Tv", label: "📺 TV", icon: <LucideIcons.Tv className="text-blue-700" />, color: "text-blue-700" },
  { value: "Headphones", label: "🎧 Kulaklık", icon: <LucideIcons.Headphones className="text-purple-600" />, color: "text-purple-600" },
  { value: "Gamepad2", label: "🎮 Oyun", icon: <LucideIcons.Gamepad2 className="text-green-600" />, color: "text-green-600" },
  { value: "Printer", label: "🖨️ Yazıcı", icon: <LucideIcons.Printer className="text-gray-700" />, color: "text-gray-700" },
  { value: "Sofa", label: "🛋️ Mobilya", icon: <LucideIcons.Sofa className="text-amber-600" />, color: "text-amber-600" },
  { value: "Flower2", label: "🌸 Bahçe", icon: <LucideIcons.Flower2 className="text-pink-400" />, color: "text-pink-400" },
  { value: "WashingMachine", label: "🧺 Ev Aleti", icon: <LucideIcons.WashingMachine className="text-blue-400" />, color: "text-blue-400" },
  { value: "Scissors", label: "✂️ Kozmetik", icon: <LucideIcons.Scissors className="text-purple-400" />, color: "text-purple-400" },
  { value: "UserCheck", label: "💄 Bakım", icon: <LucideIcons.UserCheck className="text-pink-300" />, color: "text-pink-300" },
  { value: "BedDouble", label: "🛏️ Yatak", icon: <LucideIcons.BedDouble className="text-indigo-400" />, color: "text-indigo-400" },
  { value: "ChefHat", label: "👨‍🍳 Mutfak", icon: <LucideIcons.ChefHat className="text-orange-400" />, color: "text-orange-400" },
  { value: "Music2", label: "🎵 Müzik", icon: <LucideIcons.Music2 className="text-purple-300" />, color: "text-purple-300" },
  { value: "Theater", label: "🎭 Tiyatro", icon: <LucideIcons.Theater className="text-red-400" />, color: "text-red-400" },
  { value: "PartyPopper", label: "🎉 Parti", icon: <LucideIcons.PartyPopper className="text-yellow-400" />, color: "text-yellow-400" },
  { value: "Tent", label: "⛺ Kamp", icon: <LucideIcons.Tent className="text-green-400" />, color: "text-green-400" },
  { value: "BikeIcon", label: "🚴 Bisiklet", icon: <LucideIcons.BikeIcon className="text-blue-300" />, color: "text-blue-300" },
  { value: "Building2", label: "🏢 Bina", icon: <LucideIcons.Building2 className="text-gray-500" />, color: "text-gray-500" },
  { value: "Users", label: "👥 Çocuk", icon: <LucideIcons.Users className="text-pink-200" />, color: "text-pink-200" },
  { value: "baby-carriage", label: "🚼 Bebek Arabası", icon: <img src="/icons/baby-carriage.svg" alt="Bebek Arabası" className="inline w-5 h-5 align-middle" />, color: "text-pink-300" },
];

export default function AdminKategorilerPage() {
  const { session, isLoading } = useAuth();
  const user = session?.user;
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { showToast } = useToast();
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryIcon, setEditCategoryIcon] = useState(iconOptions[0].value);
  const [subCategoryInputs, setSubCategoryInputs] = useState<{ [catId: string]: string }>({});
  const [editSubCategoryId, setEditSubCategoryId] = useState<string | null>(null);
  const [editSubCategoryName, setEditSubCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0].value);
  // Alt kategori ikon state'lerini yönetmek için:
  const [subCategoryIcons, setSubCategoryIcons] = useState<{ [catId: string]: string }>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      // Önce API endpoint'ini dene
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        console.log('API /api/categories yanıtı:', data);
        setCategories(data);
      } else {
        // API başarısız olursa JSON dosyasını dene
        const jsonRes = await fetch("/categories.json");
        const data = await jsonRes.json();
        console.log('JSON /categories.json yanıtı:', data);
        setCategories(data);
      }
    } catch (err) {
      setError("Kategoriler yüklenemedi");
    }
    setLoading(false);
  };

  const handleAddCategory = async () => {
    if (!newCategory) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("alo17-session")}`,
        },
        body: JSON.stringify({ name: newCategory, icon: selectedIcon }),
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Kategori eklenemedi");
        showToast(errData.error || "Kategori eklenemedi", "error");
      } else {
        setSuccess("Kategori eklendi");
        showToast("Kategori eklendi", "success");
        setNewCategory("");
        fetchCategories();
        // Ana sayfayı güncelle
        triggerCategoryUpdate();
      }
    } catch (err) {
      setError("Kategori eklenemedi");
      showToast("Kategori eklenemedi", "error");
    }
    setLoading(false);
  };

  const handleDeleteCategory = async (id: string) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${localStorage.getItem("alo17-session")}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Kategori silinemedi");
        showToast(errData.error || "Kategori silinemedi", "error");
      } else {
        setSuccess("Kategori silindi");
        showToast("Kategori silindi", "success");
        fetchCategories();
        // Ana sayfayı güncelle
        triggerCategoryUpdate();
      }
    } catch (err) {
      setError("Kategori silinemedi");
      showToast("Kategori silinemedi", "error");
    }
    setLoading(false);
  };

  const handleEditCategory = async (id: string) => {
    if (!editCategoryName) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("alo17-session")}`,
        },
        body: JSON.stringify({ name: editCategoryName, icon: editCategoryIcon }),
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Kategori güncellenemedi");
        showToast(errData.error || "Kategori güncellenemedi", "error");
      } else {
        setSuccess("Kategori güncellendi");
        showToast("Kategori güncellendi", "success");
        setEditCategoryId(null);
        setEditCategoryName("");
        fetchCategories();
        // Ana sayfayı güncelle
        triggerCategoryUpdate();
      }
    } catch (err) {
      setError("Kategori güncellenemedi");
      showToast("Kategori güncellenemedi", "error");
    }
    setLoading(false);
  };

  // Alt kategori işlemleri
  const handleAddSubCategory = async (categoryId: string, name: string) => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/subcategories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("alo17-session")}`,
        },
        body: JSON.stringify({ name, categoryId }),
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Alt kategori eklenemedi");
        showToast(errData.error || "Alt kategori eklenemedi", "error");
        return false;
      } else {
        setSuccess("Alt kategori eklendi");
        showToast("Alt kategori eklendi", "success");
        fetchCategories();
        triggerCategoryUpdate();
        return true;
      }
    } catch (err) {
      setError("Alt kategori eklenemedi");
      showToast("Alt kategori eklenemedi", "error");
      return false;
    }
  };

  const handleDeleteSubCategory = async (id: string) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/subcategories/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${localStorage.getItem("alo17-session")}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Alt kategori silinemedi");
        showToast(errData.error || "Alt kategori silinemedi", "error");
      } else {
        setSuccess("Alt kategori silindi");
        showToast("Alt kategori silindi", "success");
        fetchCategories();
        // Ana sayfayı güncelle
        triggerCategoryUpdate();
      }
    } catch (err) {
      setError("Alt kategori silinemedi");
      showToast("Alt kategori silinemedi", "error");
    }
    setLoading(false);
  };

  const [editSubCategoryIcon, setEditSubCategoryIcon] = useState<string>(iconOptions[0].value);
  const handleEditSubCategory = async (id: string) => {
    if (!editSubCategoryName) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/subcategories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("alo17-session")}`,
        },
        body: JSON.stringify({ name: editSubCategoryName, icon: editSubCategoryIcon }),
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Alt kategori güncellenemedi");
        showToast(errData.error || "Alt kategori güncellenemedi", "error");
      } else {
        setSuccess("Alt kategori güncellendi");
        showToast("Alt kategori güncellendi", "success");
        setEditSubCategoryId(null);
        setEditSubCategoryName("");
        fetchCategories();
        // Ana sayfayı güncelle
        triggerCategoryUpdate();
      }
    } catch (err) {
      setError("Alt kategori güncellenemedi");
      showToast("Alt kategori güncellenemedi", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log('categories state:', categories);
  }, [categories]);

  // Kategorileri order'a göre sırala
  const orderedCategories = [...categories].sort((a: any, b: any) => a.name.localeCompare(b.name, 'tr'));

  if (isLoading) {
    return <div className="p-8">Yükleniyor...</div>;
  }
  if (!user || user.role !== "admin") {
    return <div className="p-8 text-red-600">Yetkisiz erişim</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
          <span className="mr-3">🎯</span>
          Kategori Yönetimi
        </h1>
        
        {/* Yeni Kategori Ekleme */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">➕ Yeni Kategori Ekle</h2>
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              placeholder="Kategori adını girin..."
              className="border-2 border-gray-200 rounded-lg px-4 py-2 flex-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              autoComplete="off"
              disabled={loading}
            />
            <select
              value={selectedIcon}
              onChange={e => setSelectedIcon(e.target.value)}
              className="border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              disabled={loading}
            >
              {iconOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="flex items-center justify-center w-12 h-10 bg-white border-2 border-gray-200 rounded-lg">
              {iconOptions.find(opt => opt.value === selectedIcon)?.icon}
            </div>
            <button
              onClick={handleAddCategory}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Ekleniyor...' : '➕ Ekle'}
            </button>
          </div>
        </div>

        {/* Mesajlar */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">❌</span>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              <span className="text-green-700 font-medium">{success}</span>
            </div>
          </div>
        )}
      </div>

      {/* Kategoriler Listesi */}
      <div className="space-y-4">
        {orderedCategories.map((cat, i) => {
          const Icon = getIcon(cat.slug);
          const color = getColor(cat.slug, i);
          return (
            <div key={cat.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              {/* Ana Kategori Başlığı */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  {editCategoryId === cat.id ? (
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="text"
                        value={editCategoryName}
                        onChange={e => setEditCategoryName(e.target.value)}
                        className="border-2 border-blue-300 rounded-lg px-3 py-2 flex-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                      <select
                        value={editCategoryIcon}
                        onChange={e => setEditCategoryIcon(e.target.value)}
                        className="border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      >
                        {iconOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <div className="flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-200 rounded-lg">
                        {iconOptions.find(opt => opt.value === editCategoryIcon)?.icon}
                      </div>
                      <button
                        onClick={() => handleEditCategory(cat.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
                        disabled={loading}
                      >
                        💾 Kaydet
                      </button>
                      <button
                        onClick={() => { 
                          setEditCategoryId(null); 
                          setEditCategoryName(""); 
                          setEditCategoryIcon(iconOptions[0].value);
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                      >
                        ❌ İptal
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-white shadow-sm border-2 ${color.replace('text-', 'border-')}`}>
                          <Icon className={`w-6 h-6 ${color}`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{cat.name}</h3>
                          <p className="text-sm text-gray-600">
                            {(cat.subCategories || []).length} alt kategori
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            window.open(`/kategori/${cat.slug}`, '_blank');
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm"
                          disabled={loading}
                        >
                          👁️ Detaya Git
                        </button>
                        <button
                          onClick={() => { 
                            setEditCategoryId(cat.id); 
                            setEditCategoryName(cat.name); 
                            setEditCategoryIcon(cat.icon || iconOptions[0].value);
                          }}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors shadow-sm"
                          disabled={loading}
                        >
                          ✏️ Düzenle
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors shadow-sm"
                          disabled={loading}
                        >
                          🗑️ Sil
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {/* Alt kategoriler */}
              <div className="p-4 bg-gray-50">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="mr-2">📂</span>
                  Alt Kategoriler
                </h4>
                <div className="space-y-2">
                  {(cat.subCategories || []).sort((a: any, b: any) => a.name.localeCompare(b.name, 'tr')).map((sub: any, j: number) => {
                    const subSlug = normalizeSlug(sub.slug);
                    // const SubIcon = getIcon(subSlug); // kaldırıldı
                    // const subColor = getColor(subSlug, j); // kaldırıldı
                    return (
                      <div key={sub.id} className="bg-white rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center justify-between">
                          {editSubCategoryId === sub.id ? (
                            <div className="flex items-center gap-3 flex-1">
                              <input
                                type="text"
                                value={editSubCategoryName}
                                onChange={e => setEditSubCategoryName(e.target.value)}
                                className="border-2 border-blue-300 rounded-lg px-3 py-2 flex-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              />
                              {/* İKON SEÇİMİ VE GÖSTERİMİ KALDIRILDI */}
                              <button
                                onClick={() => handleEditSubCategory(sub.id)}
                                className="bg-green-500 text-white px-3 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
                                disabled={loading}
                              >
                                💾
                              </button>
                              <button
                                onClick={() => { setEditSubCategoryId(null); setEditSubCategoryName(""); }}
                                className="bg-gray-500 text-white px-3 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                              >
                                ❌
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-3">
                                {/* İKON KALDIRILDI */}
                                <span className="font-medium text-gray-800">{sub.name}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    window.open(`/kategori/${cat.slug}/${sub.slug}`, '_blank');
                                  }}
                                  className="bg-blue-500 text-white px-3 py-1 rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm"
                                  disabled={loading}
                                >
                                  👁️
                                </button>
                                <button
                                  onClick={() => { setEditSubCategoryId(sub.id); setEditSubCategoryName(sub.name); setEditSubCategoryIcon(sub.icon || iconOptions[0].value); }}
                                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg font-medium hover:bg-yellow-600 transition-colors text-sm"
                                  disabled={loading}
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDeleteSubCategory(sub.id)}
                                  className="bg-red-500 text-white px-3 py-1 rounded-lg font-medium hover:bg-red-600 transition-colors text-sm"
                                  disabled={loading}
                                >
                                  🗑️
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Alt kategori ekleme inputu */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <SubCategoryInput
                    value={subCategoryInputs[cat.id] || ""}
                    onChange={val => setSubCategoryInputs(inputs => ({ ...inputs, [cat.id]: val }))}
                    onAdd={async (name) => {
                      const result = await handleAddSubCategory(cat.id, name);
                      if (result) {
                        setSubCategoryInputs(inputs => ({ ...inputs, [cat.id]: "" }));
                      }
                      return result;
                    }}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 