const fs = require('fs');
const path = require('path');

const pages = [
  { name: 'muhendis', title: 'Mühendis Pozisyonları', icon: 'FaCogs', desc: 'Mühendislik pozisyonları. Teknik uzmanlık fırsatları.' },
  { name: 'teknisyen', title: 'Teknisyen Pozisyonları', icon: 'FaCogs', desc: 'Teknisyen pozisyonları. Teknik beceri fırsatları.' },
  { name: 'operator', title: 'Operatör Pozisyonları', icon: 'FaCogs', desc: 'Operatör pozisyonları. Üretim ve işletme fırsatları.' },
  { name: 'satis-pazarlama', title: 'Satış & Pazarlama', icon: 'FaChartLine', desc: 'Satış ve pazarlama pozisyonları. Satış becerilerinizi geliştirin.' },
  { name: 'muhasebe-finans', title: 'Muhasebe & Finans', icon: 'FaCalculator', desc: 'Muhasebe ve finans pozisyonları. Finansal uzmanlık fırsatları.' },
  { name: 'insan-kaynaklari', title: 'İnsan Kaynakları', icon: 'FaUserFriends', desc: 'İnsan kaynakları pozisyonları. İK uzmanlığı fırsatları.' },
  { name: 'bilgi-teknolojileri', title: 'Bilgi Teknolojileri', icon: 'FaDesktop', desc: 'Bilgi teknolojileri pozisyonları. IT uzmanlığı fırsatları.' },
  { name: 'musteri-hizmetleri', title: 'Müşteri Hizmetleri', icon: 'FaHeadset', desc: 'Müşteri hizmetleri pozisyonları. Müşteri odaklı çalışma.' },
  { name: 'uretim-imalat', title: 'Üretim & İmalat', icon: 'FaIndustry', desc: 'Üretim ve imalat pozisyonları. Endüstriyel fırsatlar.' },
  { name: 'lojistik-depo', title: 'Lojistik & Depo', icon: 'FaTruck', desc: 'Lojistik ve depo pozisyonları. Tedarik zinciri fırsatları.' },
  { name: 'egitim-ogretim', title: 'Eğitim & Öğretim', icon: 'FaChalkboardTeacher', desc: 'Eğitim ve öğretim pozisyonları. Eğitimcilik fırsatları.' },
  { name: 'saglik-bakim', title: 'Sağlık & Bakım', icon: 'FaHeartbeat', desc: 'Sağlık ve bakım pozisyonları. Sağlık sektörü fırsatları.' },
  { name: 'yeni-mezun', title: 'Yeni Mezun İlanları', icon: 'FaUserGraduate', desc: 'Yeni mezunlar için iş fırsatları. Kariyer başlangıcı.' },
  { name: 'part-time-eleman', title: 'Part-Time Eleman', icon: 'FaUserClock', desc: 'Yarı zamanlı eleman pozisyonları. Esnek çalışma.' },
  { name: 'sezonluk-eleman', title: 'Sezonluk Eleman', icon: 'FaUserEdit', desc: 'Sezonluk eleman pozisyonları. Mevsimlik iş fırsatları.' },
  { name: 'güvenlik-elemani', title: 'Güvenlik Elemanı', icon: 'FaUserShield', desc: 'Güvenlik elemanı pozisyonları. Güvenlik sektörü fırsatları.' },
  { name: 'teknik-eleman', title: 'Teknik Eleman', icon: 'FaUserCog', desc: 'Teknik eleman pozisyonları. Teknik beceri fırsatları.' },
  { name: 'ofis-elemani', title: 'Ofis Elemanı', icon: 'FaUserTie', desc: 'Ofis elemanı pozisyonları. Ofis yönetimi fırsatları.' }
];

pages.forEach(page => {
  const dirPath = `src/app/kategori/is/${page.name}`;
  const filePath = `${dirPath}/page.tsx`;
  
  // Dizin oluştur
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Sayfa içeriği
  const content = `'use client'

import { ${page.icon} } from 'react-icons/fa'

export default function ${page.name.charAt(0).toUpperCase() + page.name.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())}Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">${page.title}</h1>
        <p className="text-gray-600 mt-2">
          ${page.desc}
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <${page.icon} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            ${page.title}
          </h3>
          <p className="text-gray-600 mb-4">
            Bu sayfa yakında güncellenecek. ${page.title} burada listelenecek.
          </p>
        </div>
      </div>
    </div>
  )
}`;
  
  fs.writeFileSync(filePath, content);
  console.log(`Created: ${filePath}`);
});

console.log('All pages created successfully!'); 