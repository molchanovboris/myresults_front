import { apiFetch } from '@/lib/api';
import type { ApiCar, CarDetailsResponse, CarListResponse, CreateCarInput, UpdateCarInput } from '@/lib/types';

export function fetchCars() {
  return apiFetch<CarListResponse>('/cars');
}

export function fetchCar(id: string) {
  return apiFetch<CarDetailsResponse>(`/cars/${id}`);
}

export function createCar(input: CreateCarInput) {
  return apiFetch<CarDetailsResponse>('/cars', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateCar(id: string, input: UpdateCarInput) {
  return apiFetch<{ car: ApiCar }>(`/cars/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteCar(id: string) {
  return apiFetch<void>(`/cars/${id}`, { method: 'DELETE' });
}
