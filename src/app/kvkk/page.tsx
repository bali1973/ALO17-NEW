import React from 'react';

export default function KvkkPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">KVKK (Kişisel Verilerin Korunması Kanunu) Aydınlatma Metni</h1>
      <p className="mb-4">
        6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında, kişisel verileriniz aşağıda açıklanan çerçevede işlenmekte ve korunmaktadır.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">1. Kişisel Verilerin İşlenme Amaçları</h2>
      <p className="mb-4">
        Kişisel verileriniz, hizmetlerimizin sunulması, kullanıcı deneyiminin iyileştirilmesi, yasal yükümlülüklerin yerine getirilmesi, iletişim faaliyetlerinin yürütülmesi ve güvenliğin sağlanması amaçlarıyla işlenmektedir.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">2. Toplanan Kişisel Veriler</h2>
      <p className="mb-4">
        Kimlik bilgileri (ad, soyad), iletişim bilgileri (e-posta, telefon), işlem güvenliği bilgileri, kullanıcı işlemleri, IP adresi ve çerez verileri gibi bilgiler toplanabilmektedir.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">3. Kişisel Verilerin Aktarılması</h2>
      <p className="mb-4">
        Kişisel verileriniz, yasal yükümlülükler ve hizmetin gereklilikleri doğrultusunda, ilgili kamu kurumları, iş ortakları ve tedarikçilerle paylaşılabilir. Üçüncü kişilere aktarım, KVKK'da öngörülen şartlara uygun olarak yapılır.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">4. Kişisel Veri Sahibinin Hakları</h2>
      <p className="mb-4">
        KVKK'nın 11. maddesi kapsamında, kişisel verilerinizle ilgili olarak aşağıdaki haklara sahipsiniz:
      </p>
      <ul className="list-disc list-inside mb-4 text-gray-700">
        <li>Kişisel veri işlenip işlenmediğini öğrenme</li>
        <li>Kişisel verileri işlenmişse buna ilişkin bilgi talep etme</li>
        <li>İşleme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
        <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme</li>
        <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
        <li>KVKK'da öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme</li>
        <li>Aktarılan üçüncü kişilere yapılan işlemlerin bildirilmesini isteme</li>
        <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme</li>
        <li>Verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">5. İletişim</h2>
      <p className="mb-4">
        KVKK kapsamındaki haklarınızı kullanmak ve detaylı bilgi almak için bizimle iletişime geçebilirsiniz:
      </p>
      <ul className="mb-4 text-gray-700">
        <li>E-posta: <a href="mailto:destek@alo17.tr" className="text-blue-600 underline">destek@alo17.tr</a></li>
        <li>Adres: Çanakkale, Cevatpaşa Mahallesi, Bayrak Sokak, No:4</li>
      </ul>
      <p className="text-gray-500 text-sm">Bu sayfa bilgilendirme amaçlıdır. Detaylı metin ve güncel bilgiler için lütfen resmi kaynaklara başvurunuz.</p>
    </div>
  );
} 