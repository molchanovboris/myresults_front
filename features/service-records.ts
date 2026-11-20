import { apiFetch } from '@/lib/api';
import type { CreateServiceInput, ServiceDetailsResponse, ServiceListResponse } from '@/lib/types';

export function fetchServices(carId: string) {
  return apiFetch<ServiceListResponse>(`/cars/${carId}/services`);
}

export function fetchService(carId: string, serviceId: string) {
  return apiFetch<ServiceDetailsResponse>(`/cars/${carId}/services/${serviceId}`);
}

export function createService(carId: string, input: CreateServiceInput) {
  return apiFetch<ServiceDetailsResponse>(`/cars/${carId}/services`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
