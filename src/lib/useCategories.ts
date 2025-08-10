import useSWR, { mutate } from 'swr';
import { Category } from '@/types/categories';

const fetcher = (url: string) => {
  console.log('Fetching categories from:', url);
  return fetch(url).then((res) => {
    console.log('Categories API response status:', res.status);
    return res.json();
  }).then((data) => {
    console.log('Categories data received:', data);
    return data;
  }).catch((error) => {
    console.error('Categories fetch error:', error);
    throw error;
  });
};

export function useCategories() {
  const { data, error } = useSWR<Category[]>('/api/categories', fetcher);

  console.log('useCategories hook state:', { data, error, loading: !error && !data });

  return {
    categories: data || [],
    loading: !error && !data,
    error: error,
  };
}

export function triggerCategoryUpdate() {
  mutate('/api/categories');
} 