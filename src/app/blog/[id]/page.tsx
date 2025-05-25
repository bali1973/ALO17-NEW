'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Örnek blog yazıları (gerçek uygulamada API'den gelecek)
const blogPosts = [
  {
    id: 1,
    title: 'Online Alışverişte Güvenli Ödeme Yöntemleri',
    content: `
      <p>Online alışverişlerde güvenli ödeme yapmak, hem alıcılar hem de satıcılar için büyük önem taşır. Bu yazımızda, güvenli online alışveriş için dikkat edilmesi gereken önemli noktaları ele alacağız.</p>

      <h2>1. Güvenli Ödeme Yöntemleri</h2>
      <p>Online alışverişlerde tercih edebileceğiniz güvenli ödeme yöntemleri:</p>
      <ul>
        <li>Kredi/Banka Kartı ile Ödeme</li>
        <li>Havale/EFT</li>
        <li>Kapıda Ödeme</li>
        <li>Dijital Cüzdanlar</li>
      </ul>

      <h2>2. SSL Sertifikası Kontrolü</h2>
      <p>Alışveriş yapacağınız sitenin SSL sertifikasına sahip olduğundan emin olun. Adres çubuğunda "https://" ile başlayan ve kilit simgesi bulunan siteler güvenlidir.</p>

      <h2>3. Güvenli Şifre Oluşturma</h2>
      <p>Hesap güvenliğiniz için güçlü şifreler oluşturun ve düzenli olarak değiştirin. Şifrenizde büyük/küçük harf, rakam ve özel karakterler kullanın.</p>

      <h2>4. İki Faktörlü Doğrulama</h2>
      <p>Mümkünse iki faktörlü doğrulama kullanın. Bu, hesabınıza ekstra bir güvenlik katmanı ekler.</p>

      <h2>5. Satıcı Araştırması</h2>
      <p>Alışveriş yapmadan önce satıcıyı araştırın. Müşteri yorumlarını okuyun ve satıcının güvenilirliğini kontrol edin.</p>
    `,
    date: '2024-03-15',
    category: 'Güvenlik',
    author: 'Ahmet Yılmaz',
    image: '/images/blog/payment-security.jpg',
    readTime: '5 dk'
  },
  {
    id: 2,
    title: 'İkinci El Eşya Alırken Dikkat Edilmesi Gerekenler',
    content: `
      <p>İkinci el eşya alırken dikkat edilmesi gereken önemli noktalar ve ipuçları...</p>
      <!-- İçerik devam edecek -->
    `,
    date: '2024-03-10',
    category: 'Alışveriş',
    author: 'Mehmet Demir',
    image: '/images/blog/second-hand.jpg',
    readTime: '4 dk'
  },
  {
    id: 3,
    title: 'E-ticarette Başarılı Satış İçin İpuçları',
    content: `
      <p>Online satış yaparken dikkat edilmesi gereken stratejiler ve başarılı satış teknikleri...</p>
      <!-- İçerik devam edecek -->
    `,
    date: '2024-03-05',
    category: 'E-ticaret',
    author: 'Ayşe Kaya',
    image: '/images/blog/ecommerce.jpg',
    readTime: '6 dk'
  }
];

export default function BlogPostPage() {
  const params = useParams();
  const postId = parseInt(params.id as string);
  const post = blogPosts.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Yazı Bulunamadı</h1>
        <p className="mb-4">Aradığınız blog yazısı bulunamadı.</p>
        <Link href="/blog" className="text-blue-600 hover:text-blue-700">
          ← Blog'a Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Geri Dön Butonu */}
      <Link
        href="/blog"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
      >
        ← Blog'a Dön
      </Link>

      {/* Başlık ve Meta Bilgiler */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-gray-600">
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {post.author}
          </span>
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(post.date).toLocaleDateString('tr-TR')}
          </span>
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {post.readTime} okuma
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {post.category}
          </span>
        </div>
      </header>

      {/* Öne Çıkan Görsel */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-200 mb-8 rounded-lg overflow-hidden">
        {/* Resim eklenecek */}
      </div>

      {/* İçerik */}
      <article 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Paylaşım Butonları */}
      <div className="mt-12 pt-8 border-t">
        <h3 className="text-lg font-semibold mb-4">Bu Yazıyı Paylaş</h3>
        <div className="flex gap-4">
          <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
            </svg>
          </button>
          <button className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/>
            </svg>
          </button>
          <button className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.1 3.9C17.9 1.7 15 .5 12 .5 5.8.5.7 5.6.7 11.9c0 2 .5 3.9 1.5 5.6L.6 23.4l6-1.6c1.6.9 3.5 1.3 5.4 1.3 6.3 0 11.4-5.1 11.4-11.4-.1-2.8-1.2-5.7-3.3-7.8zM12 21.4c-1.7 0-3.3-.5-4.8-1.3l-.4-.2-3.5 1 1-3.4L4 17c-1-1.5-1.4-3.2-1.4-5.1 0-5.2 4.2-9.4 9.4-9.4 2.5 0 4.9 1 6.7 2.8 1.8 1.8 2.8 4.2 2.8 6.7-.1 5.2-4.3 9.4-9.5 9.4zm5.1-7.1c-.3-.1-1.7-.9-1.9-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1s-1.2-.5-2.3-1.4c-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6s.3-.3.4-.5c.2-.1.3-.3.4-.5.1-.2 0-.4 0-.5C10 9 9.3 7.6 9 7c-.1-.4-.4-.3-.5-.3h-.6s-.4.1-.7.3c-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.3-.3-.4-.6-.5z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* İlgili Yazılar */}
      <div className="mt-12 pt-8 border-t">
        <h3 className="text-xl font-semibold mb-6">İlgili Yazılar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts
            .filter(p => p.id !== post.id)
            .slice(0, 2)
            .map(relatedPost => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.id}`}
                className="block group"
              >
                <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <h4 className="font-semibold group-hover:text-blue-600">
                      {relatedPost.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-2">
                      {new Date(relatedPost.date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
} 