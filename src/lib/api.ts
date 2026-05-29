import axios from 'axios';
import { env } from '@/config/env';
import { useAuthStore } from '@/features/auth/auth.store';

export const api = axios.create({
  baseURL: env.apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the bearer token on every request when present.
api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A 401 means the token is gone or expired: clear it so the UI falls
// back to the auth screen instead of looping on failed requests.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().clear();
    }
    return Promise.reject(error);
  },
);
