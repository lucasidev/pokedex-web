import { api } from '@/lib/api';
import type { AuthToken, User } from '@/types/api';

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  username: string;
  email: string;
  password: string;
}

export async function signIn(payload: SignInPayload): Promise<string> {
  const res = await api.post<AuthToken>('/auth/signin', payload);
  return res.data.token;
}

export async function signUp(payload: SignUpPayload): Promise<string> {
  const res = await api.post<AuthToken>('/auth/signup', payload);
  return res.data.token;
}

export async function getMe(): Promise<User> {
  const res = await api.get<User>('/users/using-token');
  return res.data;
}
