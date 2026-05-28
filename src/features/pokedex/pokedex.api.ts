import { api } from '@/lib/api';

export async function catchPokemon(pokemonName: string): Promise<void> {
  await api.put('/users/pokedex/catch-pokemon', { pokemonName });
}

export async function releasePokemon(pokemonName: string): Promise<void> {
  await api.put('/users/pokedex/release-pokemon', { pokemonName });
}
