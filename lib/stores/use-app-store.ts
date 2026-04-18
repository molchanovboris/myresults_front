import { create } from 'zustand';

import type { Car, ServiceRecord } from '@/lib/types';

interface AppState {
  token: string | null;
  cars: Car[];
  serviceRecords: ServiceRecord[];
  setToken: (token: string | null) => void;
  addCar: (car: Omit<Car, 'id'>) => string;
  addServiceRecord: (record: Omit<ServiceRecord, 'id'>) => void;
  reset: () => void;
}

const initialState = {
  token: null as string | null,
  cars: [
    { id: '1', vin: 'JTDBR32E720042211', manufacturer: 'Toyota', model: 'Camry', year: 2020 },
    { id: '2', vin: 'WBA5R1C58LFH12865', manufacturer: 'BMW', model: '330i', year: 2021 },
    { id: '3', vin: '5YJ3E1EA5MF818253', manufacturer: 'Tesla', model: 'Model 3', year: 2022 },
  ] as Car[],
  serviceRecords: [] as ServiceRecord[],
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  setToken: (token) => set({ token }),
  addCar: (car) => {
    const id = Date.now().toString();
    set((state) => ({ cars: [...state.cars, { id, ...car }] }));
    return id;
  },
  addServiceRecord: (record) => {
    const id = Date.now().toString();
    set((state) => ({ serviceRecords: [...state.serviceRecords, { id, ...record }] }));
  },
  reset: () => set(initialState),
}));
