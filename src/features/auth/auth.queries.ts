import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type SignInPayload, type SignUpPayload, getMe, signIn, signUp } from './auth.api';
import { useAuthStore } from './auth.store';

export const meKey = ['me'] as const;

export function useMe() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: meKey,
    queryFn: getMe,
    enabled: Boolean(token),
  });
}

export function useSignIn() {
  const setToken = useAuthStore((s) => s.setToken);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SignInPayload) => signIn(payload),
    onSuccess: (token) => {
      setToken(token);
      queryClient.invalidateQueries({ queryKey: meKey });
    },
  });
}

export function useSignUp() {
  const setToken = useAuthStore((s) => s.setToken);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SignUpPayload) => signUp(payload),
    onSuccess: (token) => {
      setToken(token);
      queryClient.invalidateQueries({ queryKey: meKey });
    },
  });
}

export function useSignOut() {
  const clear = useAuthStore((s) => s.clear);
  const queryClient = useQueryClient();
  return () => {
    clear();
    queryClient.clear();
  };
}
