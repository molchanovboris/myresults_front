import { Platform } from 'react-native';

import { apiFetch } from '@/lib/api';
import type {
  CreateServiceInput,
  ServiceDetailsResponse,
  ServiceInvoiceResponse,
  ServiceListResponse,
} from '@/lib/types';

export type ServiceInvoiceFile = {
  uri: string;
  name: string;
  mimeType: string;
};

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

export async function createServiceInvoice(carId: string, serviceId: string, file: ServiceInvoiceFile) {
  const body = new FormData();

  body.append('photo', {
    uri: file.uri,
    name: file.name,
    type: file.mimeType,
  } as unknown as Blob);

  return apiFetch<ServiceInvoiceResponse>(`/cars/${carId}/services/${serviceId}/invoices`, {
    method: 'POST',
    body,
  });
}

export function deleteServiceInvoice(carId: string, serviceId: string, invoiceId: string) {
  return apiFetch<void>(`/cars/${carId}/services/${serviceId}/invoices/${invoiceId}`, { method: 'DELETE' });
}
