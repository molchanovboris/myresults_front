/**
 * Базовый API-клиент для запросов к бэкенду.
 * Замените BASE_URL на адрес вашего API.
 */

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com';

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}
