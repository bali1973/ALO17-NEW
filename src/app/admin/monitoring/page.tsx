import MonitoringDashboard from '@/components/MonitoringDashboard';

export default function AdminMonitoringPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sistem İzleme Paneli</h1>
          <p className="mt-2 text-gray-600">
            Sistem performansı, hatalar ve kullanıcı aktivitelerini takip edin
          </p>
        </div>
        
        <MonitoringDashboard timeRange="24h" refreshInterval={30000} />
      </div>
    </div>
  );
} 
