"use client"

import { useEffect, useState } from "react";
import { useAuth } from "@/components/Providers";
import { useToast } from "@/components/ToastProvider";
import * as LucideIcons from 'lucide-react';
import React from 'react';

function SubCategoryInput({ value, onChange, onAdd, iconValue, onIconChange, iconOptions, loading }: { value: string, onChange: (val: string) => void, onAdd: (name: string, icon: string) => Promise<boolean>, iconValue: string, onIconChange: (val: string) => void, iconOptions: any[], loading: boolean }) {
  return (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Yeni alt kategori adı"
        className="border rounded px-2 py-1 flex-1"
        autoComplete="off"
        disabled={loading}
      />
      <select
        value={iconValue}
        onChange={e => onIconChange(e.target.value)}
        className="border rounded px-2 py-1"
        disabled={loading}
      >
        {iconOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <span className="ml-2">{iconOptions.find(opt => opt.value === iconValue)?.icon}</span>
      <button
        onClick={async () => {
          if (!value.trim()) return;
          await onAdd(value, iconValue);
        }}
        className="bg-blue-500 text-white px-3 py-1 rounded"
        disabled={loading}
      >
        Alt Kategori Ekle
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
  { value: "Smartphone", label: "Telefon", icon: <LucideIcons.Smartphone /> },
  { value: "Home", label: "Ev", icon: <LucideIcons.Home /> },
  { value: "Shirt", label: "Giyim", icon: <LucideIcons.Shirt /> },
  { value: "Baby", label: "Bebek", icon: <LucideIcons.Baby /> },
  { value: "Dumbbell", label: "Spor", icon: <LucideIcons.Dumbbell /> },
  { value: "Heart", label: "Sağlık", icon: <LucideIcons.Heart /> },
  { value: "GraduationCap", label: "Eğitim", icon: <LucideIcons.GraduationCap /> },
  { value: "Utensils", label: "Yemek", icon: <LucideIcons.Utensils /> },
  { value: "Palette", label: "Sanat", icon: <LucideIcons.Palette /> },
  { value: "Gift", label: "Turizm", icon: <LucideIcons.Gift /> },
  { value: "Briefcase", label: "İş", icon: <LucideIcons.Briefcase /> },
  { value: "MoreHorizontal", label: "Hizmetler", icon: <LucideIcons.MoreHorizontal /> },
  { value: "Circle", label: "Diğer", icon: <LucideIcons.Circle /> },
  { value: "baby-carriage", label: "Bebek Arabası (SVG)", icon: <img src="/icons/baby-carriage.svg" alt="Bebek Arabası" className="inline w-5 h-5 align-middle" /> },
  // ... diğer ikonlar ...
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
      const res = await fetch("/categories.json");
      const data = await res.json();
      console.log('API /categories.json yanıtı:', data);
      setCategories(data);
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
        body: JSON.stringify({ name: editCategoryName }),
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
      }
    } catch (err) {
      setError("Kategori güncellenemedi");
      showToast("Kategori güncellenemedi", "error");
    }
    setLoading(false);
  };

  // Alt kategori işlemleri
  const handleAddSubCategory = async (categoryId: string, name: string, icon: string) => {
    setError("");
    setSuccess("");
    try {
      console.log('Alt kategori ekle: gönderilen veri', { name, categoryId });
      const res = await fetch(`/api/subcategories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("alo17-session")}`,
        },
        body: JSON.stringify({ name, categoryId, icon }),
      });
      if (!res.ok) {
        const errData = await res.json();
        console.error('Alt kategori ekle hata:', errData);
        setError(errData.error || "Alt kategori eklenemedi");
        showToast(errData.error || "Alt kategori eklenemedi", "error");
        return false;
      } else {
        setSuccess("Alt kategori eklendi");
        showToast("Alt kategori eklendi", "success");
        fetchCategories();
        return true;
      }
    } catch (err) {
      console.error('Alt kategori ekle catch:', err);
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
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Kategori Yönetimi</h1>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          placeholder="Yeni kategori adı"
          className="border rounded px-2 py-1 flex-1"
          autoComplete="off"
          disabled={loading}
        />
        <select
          value={selectedIcon}
          onChange={e => setSelectedIcon(e.target.value)}
          className="border rounded px-2 py-1"
          disabled={loading}
        >
          {iconOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="ml-2">{iconOptions.find(opt => opt.value === selectedIcon)?.icon}</span>
        <button
          onClick={handleAddCategory}
          className="bg-blue-500 text-white px-3 py-1 rounded"
          disabled={loading}
        >
          Kategori Ekle
        </button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <ul className="divide-y">
        {orderedCategories.map((cat, i) => {
          const Icon = getIcon(cat.slug);
          const color = getColor(cat.slug, i);
          return (
            <li key={cat.id} className="py-2 bg-white border-b">
              <div className="flex items-center justify-between gap-2">
                {editCategoryId === cat.id ? (
                  <>
                    <input
                      type="text"
                      value={editCategoryName}
                      onChange={e => setEditCategoryName(e.target.value)}
                      className="border rounded px-2 py-1 mr-2"
                    />
                    <button
                      onClick={() => handleEditCategory(cat.id)}
                      className="bg-green-600 text-white px-2 py-1 rounded mr-1"
                      disabled={loading}
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={() => { setEditCategoryId(null); setEditCategoryName(""); }}
                      className="bg-gray-400 text-white px-2 py-1 rounded"
                    >
                      İptal
                    </button>
                  </>
                ) : (
                  <>
                    <span className="font-medium flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${color}`} />
                      {cat.name}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setEditCategoryId(cat.id); setEditCategoryName(cat.name); }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                        disabled={loading}
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        disabled={loading}
                      >
                        Sil
                      </button>
                    </div>
                  </>
                )}
              </div>
              {/* Alt kategoriler */}
              <div className="ml-6 mt-2">
                <ul className="divide-y">
                  {(cat.subCategories || []).sort((a: any, b: any) => a.name.localeCompare(b.name, 'tr')).map((sub: any, j: number) => {
                    const subSlug = normalizeSlug(sub.slug);
                    const SubIcon = getIcon(subSlug);
                    const subColor = getColor(subSlug, j);
                    return (
                      <li key={sub.id} className="flex items-center justify-between py-1 bg-gray-50 border-b">
                        {editSubCategoryId === sub.id ? (
                          <>
                            <input
                              type="text"
                              value={editSubCategoryName}
                              onChange={e => setEditSubCategoryName(e.target.value)}
                              className="border rounded px-2 py-1 mr-2"
                            />
                            <select
                              value={editSubCategoryIcon}
                              onChange={e => setEditSubCategoryIcon(e.target.value)}
                              className="border rounded px-2 py-1 mr-2"
                            >
                              {iconOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                            <span className="ml-2">{iconOptions.find(opt => opt.value === editSubCategoryIcon)?.icon}</span>
                            <button
                              onClick={() => handleEditSubCategory(sub.id)}
                              className="bg-green-600 text-white px-2 py-1 rounded mr-1"
                              disabled={loading}
                            >
                              Kaydet
                            </button>
                            <button
                              onClick={() => { setEditSubCategoryId(null); setEditSubCategoryName(""); }}
                              className="bg-gray-400 text-white px-2 py-1 rounded"
                            >
                              İptal
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="flex items-center gap-2">
                              {sub.icon ? (
                                (() => {
                                  if (sub.icon === "baby-carriage") {
                                    return <img src="/icons/baby-carriage.svg" alt="Bebek Arabası" className={`w-4 h-4 ${subColor}`} />;
                                  }
                                  const SubIcon = (LucideIcons as any)[sub.icon] || LucideIcons.Circle;
                                  return <SubIcon className={`w-4 h-4 ${subColor}`} />;
                                })()
                              ) : (
                                <LucideIcons.Circle className={`w-4 h-4 ${subColor}`} />
                              )}
                              {sub.name}
                            </span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => { setEditSubCategoryId(sub.id); setEditSubCategoryName(sub.name); setEditSubCategoryIcon(sub.icon || iconOptions[0].value); }}
                                className="bg-yellow-500 text-white px-2 py-1 rounded"
                                disabled={loading}
                              >
                                Düzenle
                              </button>
                              <button
                                onClick={() => handleDeleteSubCategory(sub.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                                disabled={loading}
                              >
                                Sil
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {/* Alt kategori ekleme inputu */}
                <SubCategoryInput
                  value={subCategoryInputs[cat.id] || ""}
                  onChange={val => setSubCategoryInputs(inputs => ({ ...inputs, [cat.id]: val }))}
                  onAdd={async (name, icon) => {
                    const result = await handleAddSubCategory(cat.id, name, icon);
                    if (result) {
                      setSubCategoryInputs(inputs => ({ ...inputs, [cat.id]: "" }));
                      setSubCategoryIcons(icons => ({ ...icons, [cat.id]: icon }));
                    }
                    return result;
                  }}
                  iconValue={subCategoryIcons[cat.id] || iconOptions[0].value}
                  onIconChange={val => setSubCategoryIcons(icons => ({ ...icons, [cat.id]: val }))}
                  iconOptions={iconOptions}
                  loading={loading}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
} 