/**
 * Базовый API-клиент.
 * Адрес бэка задаётся в .env как EXPO_PUBLIC_API_URL.
 * Если переменной нет, используется локальный сервер.
 */

import { queryClient } from '@/lib/query-client';
import { useAppStore } from '@/lib/stores/use-app-store';

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');

export function apiAssetUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const headers = new Headers(options?.headers);
  const isFormData = typeof FormData !== 'undefined' && options?.body instanceof FormData;

  if (options?.body && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = useAppStore.getState().token;
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, { ...options, headers });
  const data = await readBody(res);

  if (!res.ok) {
    if (res.status === 401 && token) {
      useAppStore.getState().setToken(null);
      queryClient.removeQueries({ queryKey: ['auth', 'me'] });
    }

    const message =
      data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
        ? data.error
        : `API Error: ${res.status}`;
    throw new ApiError(res.status, message);
  }

  return data as T;
}

async function readBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}
