import { api } from '@/lib/api';

export async function createTeam(teamName: string): Promise<void> {
  await api.put('/users/poketeam/create', { teamName });
}

export async function deleteTeam(): Promise<void> {
  await api.put('/users/poketeam/delete');
}

export async function addToTeam(pokemonName: string): Promise<void> {
  await api.put('/users/poketeam/add-pokemon', { pokemonName });
}

export async function removeFromTeam(pokemonName: string): Promise<void> {
  await api.put('/users/poketeam/remove-pokemon', { pokemonName });
}
