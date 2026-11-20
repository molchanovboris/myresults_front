import { create } from 'zustand';

interface AppState {
  token: string | null;
  setToken: (token: string | null) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
  reset: () => set({ token: null }),
}));
