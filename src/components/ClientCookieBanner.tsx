"use client";
import { useEffect, useState } from "react";

export default function ClientCookieBanner() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    document.cookie = 'cookieConsent=accepted; path=/; max-age=31536000';
    // setShow(false); // Otomatik kaybolmasın, kullanıcı kapatana kadar kalsın
  }, []);
  if (!show) return null;
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-gray-900 text-white flex flex-col md:flex-row items-center justify-between px-4 py-3 shadow-lg animate-fadeIn">
      <span className="text-sm">Bu site, deneyiminizi iyileştirmek için çerezleri otomatik olarak kullanır. Siteyi kullanmaya devam ederek çerezleri kabul etmiş olursunuz.</span>
      <button
        className="ml-4 mt-2 md:mt-0 bg-alo-orange hover:bg-orange-600 text-white px-4 py-2 rounded transition"
        onClick={() => setShow(false)}
      >Tamam</button>
    </div>
  );
} 