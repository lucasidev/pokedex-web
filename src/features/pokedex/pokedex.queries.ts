import { meKey } from '@/features/auth/auth.queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { catchPokemon, releasePokemon } from './pokedex.api';

export function useCatchPokemon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => catchPokemon(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: meKey }),
  });
}

export function useReleasePokemon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => releasePokemon(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: meKey }),
  });
}
