'use client';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Kullanım Koşulları</h1>
      <p className="mb-4">ALO17 platformunu kullanarak aşağıdaki koşulları kabul etmiş olursunuz:</p>
      <ul className="mb-4 list-disc list-inside">
        <li>Platformda yayınlanan ilanların içeriğinden ilan sahibi sorumludur.</li>
        <li>ALO17, kullanıcılar arasında yapılan işlemlerde aracı değildir.</li>
        <li>Yasalara aykırı ilanlar yayınlanamaz.</li>
      </ul>
      <p>Daha fazla bilgi için bizimle iletişime geçebilirsiniz.</p>
    </div>
  );
} 