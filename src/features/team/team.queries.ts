import { meKey } from '@/features/auth/auth.queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToTeam, createTeam, deleteTeam, removeFromTeam } from './team.api';

function useTeamMutation<TArg>(mutationFn: (arg: TArg) => Promise<void>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: meKey }),
  });
}

export function useCreateTeam() {
  return useTeamMutation((teamName: string) => createTeam(teamName));
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteTeam(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: meKey }),
  });
}

export function useAddToTeam() {
  return useTeamMutation((pokemonName: string) => addToTeam(pokemonName));
}

export function useRemoveFromTeam() {
  return useTeamMutation((pokemonName: string) => removeFromTeam(pokemonName));
}
