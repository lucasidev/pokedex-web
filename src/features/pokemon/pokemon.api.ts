import { api } from '@/lib/api';
import type { PokemonSummary } from '@/types/api';

// Hits the backend proxy (/api/pokemon/:name), not pokeapi.co directly.
// The proxy adds the Redis cache and returns the normalized shape.
export async function getPokemon(name: string): Promise<PokemonSummary> {
  const res = await api.get<PokemonSummary>(`/pokemon/${encodeURIComponent(name)}`);
  return res.data;
}
