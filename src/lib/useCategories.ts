import useSWR, { mutate } from 'swr';
import { Category } from '@/types/categories';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCategories() {
  const { data, error } = useSWR<Category[]>('/api/categories', fetcher);

  return {
    categories: data || [],
    loading: !error && !data,
    error: error,
  };
}

export function triggerCategoryUpdate() {
  mutate('/api/categories');
} 