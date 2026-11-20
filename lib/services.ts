import { apiFetch } from '@/lib/api';
import type { ApiService, CreateServiceInput, ServiceListResponse } from '@/lib/types';

export function fetchServices(carId: string) {
  return apiFetch<ServiceListResponse>(`/cars/${carId}/services`);
}

export function fetchService(carId: string, serviceId: string) {
  return apiFetch<{ service: ApiService }>(`/cars/${carId}/services/${serviceId}`);
}

export function createService(carId: string, input: CreateServiceInput) {
  return apiFetch<{ service: ApiService }>(`/cars/${carId}/services`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
