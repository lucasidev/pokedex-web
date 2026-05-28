import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clear: () => void;
}

// Token persisted in localStorage so a refresh keeps the session. The
// api client reads getState().token on each request.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      clear: () => set({ token: null }),
    }),
    { name: 'pokedex-auth' },
  ),
);
