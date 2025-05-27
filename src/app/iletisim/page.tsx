'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form gönderme işlemi burada yapılacak
    console.log('Form data:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-alo-dark mb-8">İletişim</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* İletişim Bilgileri */}
        <div>
          <h2 className="text-2xl font-semibold text-alo-dark mb-6">İletişim Bilgileri</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="text-alo-orange text-2xl">📍</div>
              <div>
                <h3 className="font-semibold text-gray-900">Adres</h3>
                <p className="text-gray-600">
                  Cevatpaşa Mahallesi, Bayrak Sokak No:4<br />
                  Çanakkale
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-alo-orange text-2xl">📞</div>
              <div>
                <h3 className="font-semibold text-gray-900">Telefon</h3>
                <p className="text-gray-600">0541 404 2 404</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-alo-orange text-2xl">✉️</div>
              <div>
                <h3 className="font-semibold text-gray-900">E-posta</h3>
                <p className="text-gray-600">destek@alo17.tr</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-alo-orange text-2xl">⏰</div>
              <div>
                <h3 className="font-semibold text-gray-900">Çalışma Saatleri</h3>
                <p className="text-gray-600">
                  Pazartesi - Cuma: 09:00 - 18:00<br />
                  Cumartesi: 10:00 - 14:00<br />
                  Pazar: Kapalı
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* İletişim Formu */}
        <div>
          <h2 className="text-2xl font-semibold text-alo-dark mb-6">Bize Ulaşın</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Adınız Soyadınız
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alo-orange focus:border-alo-orange"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-posta Adresiniz
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alo-orange focus:border-alo-orange"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Konu
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alo-orange focus:border-alo-orange"
                required
              >
                <option value="">Seçiniz</option>
                <option value="general">Genel Bilgi</option>
                <option value="support">Teknik Destek</option>
                <option value="business">İş Birliği</option>
                <option value="other">Diğer</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Mesajınız
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alo-orange focus:border-alo-orange"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-alo-orange text-white py-3 px-6 rounded-lg font-semibold hover:bg-alo-light-orange transition-colors"
            >
              Gönder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 