import type { ReactNode } from 'react';
import type { PokemonSummary } from '@/types/api';

interface PokemonDetailProps {
  pokemon: PokemonSummary;
  actions?: ReactNode;
}

export function PokemonDetail({ pokemon, actions }: PokemonDetailProps) {
  return (
    <div className="h-max bg-slate-900 p-4 text-slate-50">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-xl capitalize">{pokemon.name}</h3>
        <span className="text-slate-400 text-sm">{pokemon.types.join(' / ')}</span>
      </div>
      <div className="flex gap-8">
        <div className="flex flex-col justify-between">
          <span className="text-slate-400 text-sm">front & back</span>
          {pokemon.sprites.front_default && (
            <img src={pokemon.sprites.front_default} alt={`${pokemon.name} front`} />
          )}
          {pokemon.sprites.back_default && (
            <img src={pokemon.sprites.back_default} alt={`${pokemon.name} back`} />
          )}
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold">stats</span>
          {pokemon.stats.map((stat) => (
            <span key={stat.name}>{`${stat.name}: ${stat.base}`}</span>
          ))}
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold">abilities</span>
          {pokemon.abilities.map((ability) => (
            <span key={ability}>{ability}</span>
          ))}
        </div>
      </div>
      {actions && <div className="mt-4 flex gap-2">{actions}</div>}
    </div>
  );
}
