'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Shield, Eye, Clock, CheckCircle, XCircle, Filter, RefreshCw } from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'failed_login' | 'suspicious_activity' | 'rate_limit_exceeded' | 'sql_injection' | 'xss_attempt' | 'file_upload' | 'admin_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip: string;
  userId?: string;
  userAgent?: string;
  details: Record<string, any>;
  timestamp: number;
  resolved: boolean;
}

interface SecurityStats {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsBySeverity: Record<string, number>;
  recentEvents: number;
  unresolvedEvents: number;
  lockedIPs: number;
}

export default function SecurityPage() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    severity: '',
    ip: '',
    resolved: '',
  });

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      
      // Güvenlik olaylarını al
      const eventsResponse = await fetch('/api/admin/security/events');
      const eventsData = await eventsResponse.json();
      
      // Güvenlik istatistiklerini al
      const statsResponse = await fetch('/api/admin/security/stats');
      const statsData = await statsResponse.json();
      
      setEvents(eventsData.events || []);
      setStats(statsData.stats || null);
    } catch (error) {
      console.error('Güvenlik verileri alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/admin/security/events/${eventId}/resolve`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        setEvents(events.map(event => 
          event.id === eventId ? { ...event, resolved: true } : event
        ));
      }
    } catch (error) {
      console.error('Olay çözülemedi:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      login_attempt: 'Giriş Denemesi',
      failed_login: 'Başarısız Giriş',
      suspicious_activity: 'Şüpheli Aktivite',
      rate_limit_exceeded: 'Rate Limit Aşıldı',
      sql_injection: 'SQL Injection',
      xss_attempt: 'XSS Denemesi',
      file_upload: 'Dosya Yükleme',
      admin_access: 'Admin Erişimi',
    };
    return labels[type] || type;
  };

  const filteredEvents = events.filter(event => {
    if (filters.type && event.type !== filters.type) return false;
    if (filters.severity && event.severity !== filters.severity) return false;
    if (filters.ip && !event.ip.includes(filters.ip)) return false;
    if (filters.resolved !== '' && event.resolved !== (filters.resolved === 'true')) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Güvenlik İzleme</h1>
          <p className="text-gray-600 mt-2">Sistem güvenlik olaylarını izleyin ve yönetin</p>
        </div>
        <Button onClick={fetchSecurityData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Yenile
        </Button>
      </div>

      {/* İstatistikler */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Olay</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                Son 24 saat: {stats.recentEvents}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Çözülmemiş Olaylar</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.unresolvedEvents}</div>
              <p className="text-xs text-muted-foreground">
                Dikkat gerektiren olaylar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kilitli IP'ler</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.lockedIPs}</div>
              <p className="text-xs text-muted-foreground">
                Geçici olarak engellenen IP&apos;ler
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kritik Olaylar</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.eventsBySeverity.critical || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Acil müdahale gerektiren
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtreler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtreler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Olay Türü" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tümü</SelectItem>
                <SelectItem value="login_attempt">Giriş Denemesi</SelectItem>
                <SelectItem value="failed_login">Başarısız Giriş</SelectItem>
                <SelectItem value="suspicious_activity">Şüpheli Aktivite</SelectItem>
                <SelectItem value="sql_injection">SQL Injection</SelectItem>
                <SelectItem value="xss_attempt">XSS Denemesi</SelectItem>
                <SelectItem value="file_upload">Dosya Yükleme</SelectItem>
                <SelectItem value="admin_access">Admin Erişimi</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.severity} onValueChange={(value) => setFilters({ ...filters, severity: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Önem Seviyesi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tümü</SelectItem>
                <SelectItem value="critical">Kritik</SelectItem>
                <SelectItem value="high">Yüksek</SelectItem>
                <SelectItem value="medium">Orta</SelectItem>
                <SelectItem value="low">Düşük</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="IP Adresi"
              value={filters.ip}
              onChange={(e) => setFilters({ ...filters, ip: e.target.value })}
            />

            <Select value={filters.resolved} onValueChange={(value) => setFilters({ ...filters, resolved: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tümü</SelectItem>
                <SelectItem value="false">Çözülmemiş</SelectItem>
                <SelectItem value="true">Çözülmüş</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Güvenlik Olayları */}
      <Card>
        <CardHeader>
          <CardTitle>Güvenlik Olayları ({filteredEvents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Filtrelere uygun güvenlik olayı bulunamadı
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 border rounded-lg ${
                    event.resolved ? 'bg-gray-50' : 'bg-white'
                  } ${event.severity === 'critical' ? 'border-red-200' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {getEventTypeLabel(event.type)}
                        </Badge>
                        {event.resolved && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Çözüldü
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">IP Adresi:</span>
                          <span className="ml-2 font-mono">{event.ip}</span>
                        </div>
                        <div>
                          <span className="font-medium">Kullanıcı:</span>
                          <span className="ml-2">{event.userId || 'Anonim'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Zaman:</span>
                          <span className="ml-2">
                            {new Date(event.timestamp).toLocaleString('tr-TR')}
                          </span>
                        </div>
                      </div>

                      {event.details && Object.keys(event.details).length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                          <div className="font-medium mb-1">Detaylar:</div>
                          <pre className="text-xs overflow-x-auto">
                            {JSON.stringify(event.details, null, 2)}
                          </pre>
                        </div>
                      )}

                      {event.userAgent && (
                        <div className="mt-2 text-xs text-gray-500">
                          <span className="font-medium">User Agent:</span>
                          <span className="ml-2">{event.userAgent}</span>
                        </div>
                      )}
                    </div>

                    {!event.resolved && (
                      <Button
                        size="sm"
                        onClick={() => resolveEvent(event.id)}
                        className="ml-4"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Çözüldü
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
