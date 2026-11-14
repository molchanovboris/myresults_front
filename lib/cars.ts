import { apiFetch } from '@/lib/api';
import type { CarDetailsResponse, CarListResponse, CreateCarInput } from '@/lib/types';

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
