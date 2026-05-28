import { api } from '@/lib/api';
import type { ApiEnvelope, AuthToken, User } from '@/types/api';

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
  const res = await api.post<ApiEnvelope<AuthToken>>('/auth/signin', payload);
  const token = res.data.data?.token;
  if (!token) {
    throw new Error('Signin response did not include a token');
  }
  return token;
}

export async function signUp(payload: SignUpPayload): Promise<string> {
  const res = await api.post<ApiEnvelope<AuthToken>>('/auth/signup', payload);
  const token = res.data.data?.token;
  if (!token) {
    throw new Error('Signup response did not include a token');
  }
  return token;
}

export async function getMe(): Promise<User> {
  const res = await api.get<ApiEnvelope<User>>('/users/using-token');
  if (!res.data.data) {
    throw new Error('User response was empty');
  }
  return res.data.data;
}
