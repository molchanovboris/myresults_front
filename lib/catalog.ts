import { apiFetch } from '@/lib/api';
import type { VinDecode } from '@/lib/types';

export function decodeVin(vin: string) {
  return apiFetch<VinDecode>(`/catalog/decode/${encodeURIComponent(vin)}`);
}
