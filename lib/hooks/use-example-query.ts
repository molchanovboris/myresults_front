import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

/**
 * Пример хука с TanStack Query.
 * Замените на реальный эндпоинт и тип ответа.
 */
export function useExampleQuery() {
  return useQuery({
    queryKey: ['example'],
    queryFn: () => apiFetch<{ message: string }>('/example'),
    // enabled: false, // включить запрос только при необходимости
  });
}
