'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface SearchResult {
  id: string | number;
  title: string;
  price: number;
  image?: string;
  location: string;
  category: string;
  type: 'listing' | 'category';
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Dışarı tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery('');
        setResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ESC tuşu ile kapat
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
        setResults([]);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Arama yap
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchData = async () => {
      setLoading(true);
      try {
        // İlanları ara
        const listingsResponse = await fetch('/api/listings');
        const listings = await listingsResponse.json();
        
        // Kategorileri ara
        const categoriesResponse = await fetch('/api/categories');
        const categories = await categoriesResponse.json();

        const searchTerm = query.toLowerCase();
        
        // İlan arama sonuçları
        const listingResults = listings
          .filter((listing: any) => 
            listing.title?.toLowerCase().includes(searchTerm) ||
            listing.description?.toLowerCase().includes(searchTerm) ||
            listing.category?.toLowerCase().includes(searchTerm) ||
            listing.city?.toLowerCase().includes(searchTerm)
          )
          .slice(0, 5)
          .map((listing: any) => ({
            id: listing.id,
            title: listing.title,
            price: listing.price,
            image: Array.isArray(listing.images) ? listing.images[0] : listing.images,
            location: listing.city || listing.location,
            category: listing.category,
            type: 'listing' as const
          }));

        // Kategori arama sonuçları
        const categoryResults = categories
          .filter((category: any) => 
            category.name?.toLowerCase().includes(searchTerm) ||
            category.slug?.toLowerCase().includes(searchTerm)
          )
          .slice(0, 3)
          .map((category: any) => ({
            id: category.slug,
            title: category.name,
            price: 0,
            location: '',
            category: 'Kategori',
            type: 'category' as const
          }));

        setResults([...listingResults, ...categoryResults]);
      } catch (error) {
        console.error('Arama hatası:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Klavye navigasyonu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'listing') {
      router.push(`/ilan/${result.id}`);
    } else {
      router.push(`/kategori/${result.id}`);
    }
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  const handleSearchClick = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Arama Butonu */}
      <button
        onClick={handleSearchClick}
        className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        title="Ara"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
        <span className="ml-2 hidden md:inline">Ara</span>
      </button>

      {/* Arama Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            {/* Arama Input */}
            <div className="flex items-center p-4 border-b">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="İlan, kategori, şehir ara..."
                className="flex-1 outline-none text-lg"
                autoFocus
              />
              <button
                onClick={() => {
                  setIsOpen(false);
                  setQuery('');
                  setResults([]);
                }}
                className="ml-3 p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Arama Sonuçları */}
            <div className="max-h-96 overflow-y-auto">
              {loading && (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2">Aranıyor...</p>
                </div>
              )}

              {!loading && results.length === 0 && query && (
                <div className="p-4 text-center text-gray-500">
                  <p>Sonuç bulunamadı</p>
                  <p className="text-sm mt-1">Farklı anahtar kelimeler deneyin</p>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="divide-y">
                  {results.map((result, index) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                        index === selectedIndex ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        {result.type === 'listing' && result.image && (
                          <div className="w-12 h-12 relative rounded-lg overflow-hidden mr-3 flex-shrink-0">
                            <Image
                              src={result.image}
                              alt={result.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        )}
                        
                        {result.type === 'category' && (
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-blue-600 font-semibold">
                              {result.title.charAt(0)}
                            </span>
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 truncate">
                              {result.title}
                            </h3>
                            {result.type === 'listing' && (
                              <span className="text-green-600 font-semibold ml-2">
                                {typeof result.price === 'number' 
                                  ? result.price.toLocaleString('tr-TR') 
                                  : result.price} ₺
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            {result.type === 'listing' && (
                              <>
                                <span>{result.location}</span>
                                <span className="mx-2">•</span>
                                <span>{result.category}</span>
                              </>
                            )}
                            {result.type === 'category' && (
                              <span className="text-blue-600">Kategori</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!loading && query && results.length > 0 && (
                <div className="p-4 border-t bg-gray-50">
                  <p className="text-sm text-gray-600">
                    {results.length} sonuç bulundu
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 