'use client';

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sıkça Sorulan Sorular</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">ALO17 nedir?</h2>
        <p>ALO17, kullanıcıların ilan verebildiği ve alışveriş yapabildiği bir platformdur.</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Nasıl ilan verebilirim?</h2>
        <p>Ücretsiz hesap oluşturduktan sonra ilan verme adımlarını takip ederek kolayca ilan verebilirsiniz.</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Destek almak için ne yapmalıyım?</h2>
        <p>İletişim sayfamızdan bize ulaşarak destek alabilirsiniz.</p>
      </div>
    </div>
  );
} 