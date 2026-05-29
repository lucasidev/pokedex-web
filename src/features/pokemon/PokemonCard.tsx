import { cn } from '@/lib/cn';
import type { PokemonSummary } from '@/types/api';

interface PokemonCardProps {
  pokemon: PokemonSummary;
  onSelect?: (pokemon: PokemonSummary) => void;
  selected?: boolean;
}

export function PokemonCard({ pokemon, onSelect, selected }: PokemonCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(pokemon)}
      className={cn('flex w-32 flex-col p-2', selected && 'ring-2 ring-orange-400')}
    >
      {pokemon.sprites.front_default ? (
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      ) : (
        <div className="flex h-24 items-center justify-center text-slate-400 text-xs">
          sin sprite
        </div>
      )}
      <h4 className="text-center font-semibold text-slate-50 capitalize">{pokemon.name}</h4>
    </button>
  );
}
