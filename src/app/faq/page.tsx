'use client';

import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'ALO17 nedir?',
    answer: 'ALO17, Türkiye\'nin önde gelen online alışveriş platformlarından biridir. Kullanıcıların güvenli bir şekilde alım satım yapabilmelerini sağlayan, kullanıcı dostu bir platformdur.'
  },
  {
    question: 'Nasıl üye olabilirim?',
    answer: 'Üye olmak için ana sayfadaki "Üye Ol" butonuna tıklayarak kayıt formunu doldurabilirsiniz. Geçerli bir e-posta adresi ve telefon numarası ile hızlıca üye olabilirsiniz.'
  },
  {
    question: 'İlan vermek ücretli mi?',
    answer: 'Temel ilan verme hizmetimiz ücretsizdir. Ancak öne çıkarma, vitrin ilanı gibi premium özellikler için ek ücret talep edilmektedir.'
  },
  {
    question: 'Ödeme nasıl yapılır?',
    answer: 'Platformumuzda kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Tüm ödemeler güvenli ödeme altyapımız üzerinden gerçekleştirilmektedir.'
  },
  {
    question: 'İlanımı nasıl düzenleyebilirim?',
    answer: 'Hesabınıza giriş yaptıktan sonra "İlanlarım" bölümünden ilanınızı düzenleyebilir, güncelleyebilir veya silebilirsiniz.'
  },
  {
    question: 'Güvenli alışveriş nasıl yapılır?',
    answer: 'Güvenli alışveriş için satıcının değerlendirmelerini kontrol edin, ürün fotoğraflarını inceleyin ve mümkünse yüz yüze görüşerek alışveriş yapın. Şüpheli durumlarda bizimle iletişime geçin.'
  },
  {
    question: 'İade politikası nedir?',
    answer: 'Ürün tesliminden itibaren 14 gün içinde iade talebinde bulunabilirsiniz. Ürünün orijinal ambalajında ve kullanılmamış olması gerekmektedir.'
  },
  {
    question: 'Şifremi unuttum, ne yapmalıyım?',
    answer: 'Giriş sayfasındaki "Şifremi Unuttum" linkine tıklayarak e-posta adresinize şifre sıfırlama bağlantısı gönderebilirsiniz.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Sıkça Sorulan Sorular</h1>

      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.question}</span>
                <span className="ml-6 flex-shrink-0">
                  <svg
                    className={`h-6 w-6 transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 bg-gray-50">
                <p className="text-gray-600">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Hala sorunuz mu var?</h2>
        <p className="mb-4">
          Yukarıdaki sorular arasında cevabını bulamadığınız bir soru varsa, 
          bizimle iletişime geçmekten çekinmeyin.
        </p>
        <a
          href="/contact"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          İletişime Geç
        </a>
      </div>
    </div>
  );
} 