'use client';

import React from 'react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Hakkımızda</h1>
      
      <div className="prose prose-lg">
        <p className="mb-4">
          ALO17, Türkiye'nin önde gelen online alışveriş platformlarından biridir. 
          Amacımız, alıcı ve satıcıları güvenli bir ortamda buluşturmak ve 
          alışveriş deneyimini kolaylaştırmaktır.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Misyonumuz</h2>
        <p className="mb-4">
          Kullanıcılarımıza güvenli, hızlı ve kolay bir alışveriş deneyimi sunmak, 
          satıcılarımıza ise ürünlerini etkili bir şekilde tanıtma ve satma 
          imkanı sağlamak.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Vizyonumuz</h2>
        <p className="mb-4">
          Türkiye'nin en güvenilir ve kullanıcı dostu online alışveriş platformu 
          olmak ve dijital ticaretin gelişimine katkıda bulunmak.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Değerlerimiz</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Güvenilirlik</li>
          <li>Müşteri Memnuniyeti</li>
          <li>Şeffaflık</li>
          <li>Yenilikçilik</li>
          <li>Sürdürülebilirlik</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Neden Biz?</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Güvenli alışveriş deneyimi</li>
          <li>7/24 müşteri desteği</li>
          <li>Kolay kullanım</li>
          <li>Geniş ürün yelpazesi</li>
          <li>Rekabetçi fiyatlar</li>
        </ul>
      </div>
    </div>
  );
} 