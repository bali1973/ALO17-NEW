'use client';

import React from 'react';
import Link from 'next/link';

// Örnek blog yazıları
const blogPosts = [
  {
    id: 1,
    title: 'Online Alışverişte Güvenli Ödeme Yöntemleri',
    excerpt: 'Online alışverişlerde güvenli ödeme yapmanın yolları ve dikkat edilmesi gerekenler...',
    date: '2024-03-15',
    category: 'Güvenlik',
    image: '/images/blog/payment-security.jpg'
  },
  {
    id: 2,
    title: 'İkinci El Eşya Alırken Dikkat Edilmesi Gerekenler',
    excerpt: 'İkinci el eşya alırken dikkat edilmesi gereken önemli noktalar ve ipuçları...',
    date: '2024-03-10',
    category: 'Alışveriş',
    image: '/images/blog/second-hand.jpg'
  },
  {
    id: 3,
    title: 'E-ticarette Başarılı Satış İçin İpuçları',
    excerpt: 'Online satış yaparken dikkat edilmesi gereken stratejiler ve başarılı satış teknikleri...',
    date: '2024-03-05',
    category: 'E-ticaret',
    image: '/images/blog/ecommerce.jpg'
  }
];

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      
      {/* Blog Kategorileri */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
            Tümü
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">
            Güvenlik
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">
            Alışveriş
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">
            E-ticaret
          </button>
        </div>
      </div>

      {/* Blog Yazıları Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              {/* Resim eklenecek */}
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-blue-600 font-medium">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/blog/${post.id}`} className="hover:text-blue-600">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.id}`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Devamını Oku →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Newsletter Aboneliği */}
      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            Blog Yazılarımızdan Haberdar Olun
          </h2>
          <p className="text-gray-600 mb-6">
            En yeni blog yazılarımızdan ve güncellemelerimizden haberdar olmak için
            bültenimize abone olun.
          </p>
          <form className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Abone Ol
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 