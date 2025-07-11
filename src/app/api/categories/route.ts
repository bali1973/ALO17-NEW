import { NextResponse } from 'next/server';

export async function GET() {
  const categories = [
    {
      id: "1",
      name: "Elektronik",
      slug: "elektronik",
      order: 0,
      count: 15,
      subCategories: [
        { id: "1-1", name: "Bilgisayarlar", slug: "bilgisayarlar", categoryId: "1" },
        { id: "1-2", name: "Telefonlar", slug: "telefonlar", categoryId: "1" }
      ]
    },
    {
      id: "2",
      name: "Ev ve Bahçe",
      slug: "ev-ve-bahce",
      order: 1,
      count: 28,
      subCategories: [
        { id: "2-1", name: "Mobilya", slug: "mobilya", categoryId: "2" },
        { id: "2-2", name: "Dekorasyon", slug: "dekorasyon", categoryId: "2" }
      ]
    },
    {
      id: "3",
      name: "Giyim",
      slug: "giyim",
      order: 2,
      count: 10,
      subCategories: [
        { id: "3-1", name: "Kadın Giyim", slug: "kadin-giyim", categoryId: "3" },
        { id: "3-2", name: "Erkek Giyim", slug: "erkek-giyim", categoryId: "3" }
      ]
    }
  ];
  return NextResponse.json(categories);
} 