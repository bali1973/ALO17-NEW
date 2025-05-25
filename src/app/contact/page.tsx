'use client';

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">İletişim</h1>
      <p className="mb-4">Bize ulaşmak için aşağıdaki iletişim bilgilerini kullanabilirsiniz:</p>
      <ul className="mb-4 list-disc list-inside">
        <li>E-posta: info@alo17.com</li>
        <li>Telefon: +90 (212) 123 45 67</li>
        <li>Adres: Örnek Mahallesi, Örnek Sokak No:123, Kadıköy, İstanbul</li>
      </ul>
      <p>Her türlü soru, öneri ve destek talepleriniz için bize yazabilirsiniz.</p>
    </div>
  );
} 