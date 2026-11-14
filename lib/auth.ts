import { apiFetch } from '@/lib/api';

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
};

export function requestAuthCode(email: string) {
  return apiFetch<{ ok: boolean }>('/auth/request-code', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function verifyAuthCode(email: string, code: string) {
  return apiFetch<{ token: string; user: AuthUser }>('/auth/verify-code', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
}

export function fetchMe() {
  return apiFetch<{ user: AuthUser }>('/auth/me');
}
