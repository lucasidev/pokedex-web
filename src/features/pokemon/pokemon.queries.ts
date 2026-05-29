import { useQueries, useQuery } from '@tanstack/react-query';
import type { PokemonSummary } from '@/types/api';
import { getPokemon } from './pokemon.api';

export const pokemonKey = (name: string) => ['pokemon', name] as const;

export function usePokemon(name: string | null) {
  return useQuery({
    queryKey: pokemonKey(name ?? ''),
    queryFn: () => getPokemon(name as string),
    enabled: Boolean(name),
    staleTime: 60 * 60 * 1000,
  });
}

// Fetches every pokemon in a list (the user's pokedex) in parallel, each
// cached under its own key so the detail view reuses them.
export function usePokemonList(names: string[]) {
  const results = useQueries({
    queries: names.map((name) => ({
      queryKey: pokemonKey(name),
      queryFn: () => getPokemon(name),
      staleTime: 60 * 60 * 1000,
    })),
  });

  const pokemons = results.map((r) => r.data).filter((p): p is PokemonSummary => Boolean(p));
  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);

  return { pokemons, isLoading, isError };
}
