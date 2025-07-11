const http = require('http');

// Buraya kopyalanan JSON'u yapıştırıyoruz:
const categories = [
  {"id":"cmcuepwzw0003qjgcl08buww2","name":"Elektronik","slug":"elektronik","createdAt":"2025-07-08T10:48:27.212Z","updatedAt":"2025-07-08T11:59:55.831Z","order":0,"icon":null,"subCategories":[{"id":"cmcuepx1f0005qjgc5ok98cja","name":"Bilgisayar","slug":"bilgisayar","categoryId":"cmcuepwzw0003qjgcl08buww2","createdAt":"2025-07-08T10:48:27.267Z","updatedAt":"2025-07-09T15:31:11.726Z","order":0,"icon":"Laptop"},{"id":"cmcuepx330007qjgclawy4mzw","name":"Telefon","slug":"telefon","categoryId":"cmcuepwzw0003qjgcl08buww2","createdAt":"2025-07-08T10:48:27.327Z","updatedAt":"2025-07-08T10:48:27.327Z","order":0,"icon":null},{"id":"cmcuepx3l0009qjgcin909qr2","name":"Tablet","slug":"tablet","categoryId":"cmcuepwzw0003qjgcl08buww2","createdAt":"2025-07-08T10:48:27.345Z","updatedAt":"2025-07-08T10:48:27.345Z","order":0,"icon":null},{"id":"cmcuepx46000bqjgca16yc5ef","name":"Kulaklık","slug":"kulaklık","categoryId":"cmcuepwzw0003qjgcl08buww2","createdAt":"2025-07-08T10:48:27.366Z","updatedAt":"2025-07-08T10:48:27.366Z","order":0,"icon":null},{"id":"cmcuepx4w000dqjgcn4ewuxfm","name":"Televizyon","slug":"televizyon","categoryId":"cmcuepwzw0003qjgcl08buww2","createdAt":"2025-07-08T10:48:27.392Z","updatedAt":"2025-07-08T10:48:27.392Z","order":0,"icon":null},{"id":"cmcuepx5s000fqjgcragu6ree","name":"Kamera","slug":"kamera","categoryId":"cmcuepwzw0003qjgcl08buww2","createdAt":"2025-07-08T10:48:27.424Z","updatedAt":"2025-07-08T10:48:27.424Z","order":0,"icon":null},{"id":"cmcuepx6g000hqjgclctgo39p","name":"Oyun Konsolu","slug":"oyun-konsolu","categoryId":"cmcuepwzw0003qjgcl08buww2","createdAt":"2025-07-08T10:48:27.448Z","updatedAt":"2025-07-08T10:48:27.448Z","order":0,"icon":null},{"id":"cmcuepx78000jqjgcqoxqsmqu","name":"Yazıcı","slug":"yazıcı","categoryId":"cmcuepwzw0003qjgcl08buww2","createdAt":"2025-07-08T10:48:27.476Z","updatedAt":"2025-07-08T10:48:27.476Z","order":0,"icon":null},{"id":"cmcuepx84000lqjgc69kt3uds","name":"Network","slug":"network","categoryId":"cmcuepwzw0003qjgcl08buww2","createdAt":"2025-07-08T10:48:27.508Z","updatedAt":"2025-07-08T10:48:27.508Z","order":0,"icon":null}]},
  // ... (devamı, JSON'un tamamı buraya yapıştırılacak)
];

const iconMap = {
  bilgisayar: 'Laptop',
  telefon: 'Smartphone',
  tablet: 'Tablet',
  kulaklık: 'Headphones',
  televizyon: 'Tv',
  kamera: 'Camera',
  'oyun-konsolu': 'Gamepad2',
  yazıcı: 'Printer',
  network: 'Radio',
  mobilya: 'Sofa',
  dekorasyon: 'Palette',
  'bahçe-ürünleri': 'Flower2',
  halı: 'Home',
  aydınlatma: 'Lightbulb',
  mutfak: 'ChefHat',
  banyo: 'Bath',
  'kadın-giyim': 'Shirt',
  'erkek-giyim': 'Shirt',
  'çocuk-giyim': 'Baby',
  ayakkabı: 'Shirt',
  aksesuar: 'Glasses',
  'kişisel-bakım': 'UserCheck',
  berberler: 'Scissors',
  kuaförler: 'Scissors',
  'diyet-&-beslenme': 'Heart',
  'medikal-ürünler': 'Heart',
  'güzellik-salonları': 'Heart',
  'bebek-arabası': 'Baby',
  'bebek-giyim': 'Baby',
  'bebek-oyuncakları': 'Baby',
  'yabancı-dil-kursları': 'GraduationCap',
  'akademik-kurslar': 'GraduationCap',
  'sertifika-programları': 'GraduationCap',
  'okullar-': 'GraduationCap',
  kreşler: 'Baby',
  restoranlar: 'Utensils',
  kafeler: 'Utensils',
  pastaneler: 'Utensils',
  'fast-food': 'Utensils',
  lokantalar: 'Utensils',
  çorbacılar: 'Utensils',
};

function updateSubCategory(id, name, icon) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ name, icon });
    const options = {
      hostname: 'localhost',
      port: 3004,
      path: `/api/subcategories/${id}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`Güncellendi: ${name} (${id}) → ${icon} | Yanıt: ${res.statusCode}`);
        resolve();
      });
    });
    req.on('error', (e) => {
      console.error(`Hata: ${name} (${id}) → ${icon} | ${e.message}`);
      resolve();
    });
    req.write(postData);
    req.end();
  });
}

(async () => {
  for (const cat of categories) {
    for (const sub of cat.subCategories || []) {
      if (!sub.icon) {
        const icon = iconMap[sub.slug] || 'Circle';
        await updateSubCategory(sub.id, sub.name, icon);
      }
    }
  }
  console.log('Tüm alt kategoriler güncellendi!');
})(); 
 
 