import { create } from 'zustand';

interface AppState {
  /** Пример: токен авторизации (в продакшене хранить в secure storage) */
  token: string | null;
  setToken: (token: string | null) => void;
  /** Сброс стора (например, при выходе) */
  reset: () => void;
}

const initialState = {
  token: null as string | null,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  setToken: (token) => set({ token }),
  reset: () => set(initialState),
}));
