export interface AuthToken {
  token: string;
}

export interface PokeTeam {
  name: string;
  pokemon: string[];
}

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  pokedex: string[];
  poketeam: PokeTeam | null;
  roles: string[];
}

export interface PokemonStat {
  name: string;
  base: number;
}

// Normalized shape returned by the backend pokemon proxy (not the raw
// pokeapi.co payload). The proxy flattens stats and abilities.
export interface PokemonSummary {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  sprites: {
    front_default: string | null;
    back_default: string | null;
  };
  stats: PokemonStat[];
  abilities: string[];
}
