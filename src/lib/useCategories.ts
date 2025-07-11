import { useEffect, useState } from 'react';

export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  icon?: string;
  subCategories?: SubCategory[];
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/categories.json')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Kategoriler yüklenemedi');
        setLoading(false);
      });
  }, []);

  return { categories, loading, error };
} 