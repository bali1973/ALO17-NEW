'use client';

import NotificationSubscription from '@/components/NotificationSubscription';

export default function BildirimTercihleriPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Bildirim Tercihleri
          </h1>
          <p className="text-lg text-gray-600">
            Yeni ilanlardan haberdar olmak için abonelik ayarlarınızı yapın
          </p>
        </div>
        
        <div className="flex justify-center">
          <NotificationSubscription initialShowForm={true} />
        </div>
      </div>
    </div>
  );
} 
