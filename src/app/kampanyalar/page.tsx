'use client';

import React, { useState, useEffect } from 'react';



export default function KampanyalarPage() {
  
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Burada kampanya verilerini çekmek için API çağrısı yapılacak
    // Örnek: fetch('https://api.example.com/campaigns')
    // .then(response => response.json())
    // .then(data => setCampaigns(data))
    // .catch(error => console.error('Error fetching campaigns:', error))
    // .finally(() => setLoading(false));

    // Simüle edilmiş veri
    const mockCampaigns = [
      {
        id: 1,
        title: 'Yaz İndirimi',
        description: 'Yaz sezonunda tüm ürünlerde %50 indirim',
        image: 'https://via.placeholder.com/150',
        startDate: '2023-07-01',
        endDate: '2023-07-31',
        discount: '50%',
        category: 'Yaz',
        tags: ['İndirim', 'Kampanya'],
      },
      {
        id: 2,
        title: 'Okula Dönüş',
        description: 'Eğitim ürünlerinde %30 indirim',
        image: 'https://via.placeholder.com/150',
        startDate: '2023-08-15',
        endDate: '2023-09-15',
        discount: '30%',
        category: 'Eğitim',
        tags: ['Okula Dönüş', 'İndirim'],
      },
      {
        id: 3,
        title: 'Kış Temizliği',
        description: 'Temizlik ürünlerinde %40 indirim',
        image: 'https://via.placeholder.com/150',
        startDate: '2023-12-01',
        endDate: '2023-12-31',
        discount: '40%',
        category: 'Temizlik',
        tags: ['Kış', 'İndirim'],
      },
    ];
    setCampaigns(mockCampaigns);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Kampanyalar</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{campaign.title}</h2>
            <p className="text-gray-600 mb-4">{campaign.description}</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Detaylar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 
