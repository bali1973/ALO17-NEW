'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin-auth';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaResult, setCaptchaResult] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState<Array<{time: string, email: string, device: string}>>([]);
  const { login, isLoading, error } = useAdminAuth();
  const router = useRouter();

  // Giriş denemelerini takip et
  useEffect(() => {
    if (loginAttempts >= 5) {
      setIsLocked(true);
      const lockoutTimer = setTimeout(() => {
        setIsLocked(false);
        setLoginAttempts(0);
      }, 300000); // 5 dakika bekleme süresi
      
      return () => clearTimeout(lockoutTimer);
    }
  }, [loginAttempts]);

  // Rate limiting - çok hızlı giriş denemelerini engelle
  const [lastAttemptTime, setLastAttemptTime] = useState(0);
  const RATE_LIMIT_DELAY = 2000; // 2 saniye

  // Cihaz bilgisini al
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    
    setDeviceInfo(`${platform} | ${language} | ${userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Firefox') ? 'Firefox' : userAgent.includes('Safari') ? 'Safari' : 'Unknown'}`);
  }, []);

  // CAPTCHA oluştur
  useEffect(() => {
    if (loginAttempts >= 2) {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      setCaptchaQuestion(`${num1} + ${num2} = ?`);
      setCaptchaResult(num1 + num2);
    }
  }, [loginAttempts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      return;
    }
    
    // Rate limiting kontrolü
    const now = Date.now();
    if (now - lastAttemptTime < RATE_LIMIT_DELAY) {
      return;
    }
    setLastAttemptTime(now);
    
    // CAPTCHA kontrolü
    if (loginAttempts >= 2 && captchaAnswer !== captchaResult.toString()) {
      // Admin auth'tan error state'ini kullan
      return;
    }
    
    const success = await login(email, password);
    if (success) {
      setLoginAttempts(0);
      setCaptchaAnswer('');
      setCaptchaQuestion('');
      router.push('/admin');
    } else {
      setLoginAttempts(prev => prev + 1);
      // Başarısız giriş logunu ekle
      setFailedAttempts(prev => [...prev, {
        time: new Date().toLocaleString('tr-TR'),
        email: email,
        device: deviceInfo
      }]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center mb-4">
            <ShieldCheckIcon className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Girişi
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Alo17 Admin Paneli
          </p>
          <p className="mt-1 text-center text-xs text-gray-500">
            Güvenli erişim için kimlik doğrulama gerekli
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email adresi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                disabled={isLocked}
                className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={isLocked}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* CAPTCHA Alanı */}
          {captchaQuestion && (
            <div>
              <label htmlFor="captcha" className="block text-sm font-medium text-gray-700 mb-2">
                🔒 Güvenlik Sorusu
              </label>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-gray-900 bg-gray-100 px-3 py-2 rounded">
                  {captchaQuestion}
                </span>
                <input
                  id="captcha"
                  name="captcha"
                  type="text"
                  required
                  disabled={isLocked}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Cevabınızı yazın"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Güvenlik için basit matematik sorusunu cevaplayın
              </p>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || isLocked}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Giriş yapılıyor...' : isLocked ? 'Hesap Kilitli' : 'Giriş Yap'}
            </button>
          </div>

          {/* Güvenlik Uyarıları */}
          {loginAttempts > 0 && (
            <div className="text-sm text-center">
              <p className={`text-${loginAttempts >= 3 ? 'red' : 'yellow'}-600`}>
                {loginAttempts >= 3 ? '⚠️ ' : '⚠️ '}
                {loginAttempts} başarısız giriş denemesi
                {loginAttempts >= 4 && ' - Son deneme!'}
              </p>
              {loginAttempts >= 5 && (
                <p className="text-red-600 text-xs mt-1">
                  Hesap 5 dakika kilitlendi
                </p>
              )}
            </div>
          )}

          {/* Başarısız Giriş Logları */}
          {failedAttempts.length > 0 && (
            <div className="text-xs text-center text-gray-500 border-t pt-3">
              <p className="mb-2">📊 Başarısız Giriş Geçmişi:</p>
              <div className="max-h-20 overflow-y-auto space-y-1">
                {failedAttempts.slice(-3).map((attempt, index) => (
                  <div key={index} className="text-xs bg-red-50 p-2 rounded">
                    <p className="text-red-700">{attempt.time}</p>
                    <p className="text-red-600">{attempt.email}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-sm text-center text-gray-600">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800 font-medium">
                🔒 Güvenlik Uyarısı
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Kullanıcı bilgileri güvenlik nedeniyle gizlenmiştir.
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Lütfen sistem yöneticinizle iletişime geçin.
              </p>
            </div>
          </div>

          {/* Güvenlik İpuçları */}
          <div className="text-xs text-center text-gray-500 space-y-1">
            <p>💡 Güvenlik İpuçları:</p>
            <p>• Güçlü şifre kullanın</p>
            <p>• Şifrenizi kimseyle paylaşmayın</p>
            <p>• Güvenli cihazlardan giriş yapın</p>
          </div>

          {/* Cihaz Bilgisi */}
          {deviceInfo && (
            <div className="text-xs text-center text-gray-400 border-t pt-3">
              <p className="mb-1">📱 Cihaz Bilgisi:</p>
              <p className="font-mono text-xs">{deviceInfo}</p>
              <p className="text-xs mt-1">
                🕐 Giriş Zamanı: {new Date().toLocaleString('tr-TR')}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 
