export interface Car {
  id: string;
  vin: string;
  manufacturer: string;
  model: string;
  year: number;
}

/** Машина в ответе бэка. Даты приходят строками ISO. */
export interface ApiCar {
  id: string;
  userId: string;
  vin: string | null;
  make: string;
  model: string;
  year: number | null;
  color: string | null;
  nickname: string | null;
  mileage: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CarListResponse {
  cars: ApiCar[];
}

export interface ApiCarPhoto {
  id: string;
  carId: string;
  caption: string | null;
  mimeType: string;
  size: number;
  originalName: string | null;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface CarDetailsResponse {
  car: ApiCar;
  photos: ApiCarPhoto[];
}

export interface VinDecode {
  vin?: string;
  make?: string | null;
  model?: string | null;
  year?: number | null;
}

export interface CreateCarInput {
  make: string;
  model: string;
  vin?: string;
  year?: number;
  color?: string;
  mileage: number;
}

export interface UpdateCarInput {
  color?: string | null;
  mileage?: number;
}

export interface ServiceRecord {
  id: string;
  carId: string;
  mileage: number;
  description: string;
}

export interface InvoiceAttachment {
  uri: string;
  name: string;
  mimeType?: string;
}
