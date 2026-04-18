export interface Car {
  id: string;
  vin: string;
  manufacturer: string;
  model: string;
  year: number;
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
