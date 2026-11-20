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
  nickname?: string;
  mileage: number;
}

export interface UpdateCarInput {
  color?: string | null;
  mileage?: number;
}

export interface CarResponse {
  car: ApiCar;
}

export type ServiceKind = 'maintenance' | 'repair';

export interface ApiServiceItem {
  id: string;
  serviceId: string;
  name: string;
  quantity: number;
  price: number;
  position: number;
  createdAt: string;
}

export interface ServiceItemInput {
  name: string;
  quantity: number;
  price: number;
}

export interface ApiService {
  id: string;
  carId: string;
  status: 'planned' | 'completed';
  kind: ServiceKind | null;
  title: string;
  mileage: number | null;
  recommendedMileage: number | null;
  laborCost: number | null;
  cost: number | null;
  workshop: string | null;
  category: string | null;
  notes: string | null;
  performedAt: string | null;
  createdAt: string;
  updatedAt: string;
  items?: ApiServiceItem[];
}

export interface ApiServiceSummary {
  id: string;
  status: 'planned' | 'completed';
  kind: ServiceKind | null;
  title: string;
  recommendedMileage: number | null;
  cost: number | null;
  mileage: number | null;
  performedAt: string | null;
}

export interface ServiceListResponse {
  services: ApiServiceSummary[];
  totalCost: number;
  latestMileage: number | null;
}

export interface ServiceDetailsResponse {
  service: ApiService;
}

export interface CreateServiceInput {
  kind: ServiceKind;
  mileage: number;
  laborCost: number;
  repair?: string;
  items: ServiceItemInput[];
}

export interface InvoiceAttachment {
  uri: string;
  name: string;
  mimeType?: string;
}
