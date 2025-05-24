'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            ALO17
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/listings" className="text-gray-600 hover:text-blue-600">
              İlanlar
            </Link>
            <Link href="/listings/create" className="text-gray-600 hover:text-blue-600">
              İlan Ver
            </Link>
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="text-gray-600 hover:text-blue-600">
                  {username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link
              href="/listings"
              className="block text-gray-600 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              İlanlar
            </Link>
            <Link
              href="/listings/create"
              className="block text-gray-600 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              İlan Ver
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="block text-gray-600 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {username}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-red-600 hover:text-red-700"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-gray-600 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="block text-gray-600 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
} 