import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { useMe } from '@/features/auth/auth.queries';
import { useCatchPokemon, useReleasePokemon } from '@/features/pokedex/pokedex.queries';
import { PokemonCard } from '@/features/pokemon/PokemonCard';
import { PokemonDetail } from '@/features/pokemon/PokemonDetail';
import { usePokemonList } from '@/features/pokemon/pokemon.queries';
import { TeamPanel } from '@/features/team/TeamPanel';
import { useAddToTeam, useRemoveFromTeam } from '@/features/team/team.queries';
import type { PokemonSummary } from '@/types/api';
import { type FormEvent, useState } from 'react';

export function HomePage() {
  const { data: user } = useMe();
  const pokedexNames = user?.pokedex ?? [];
  const { pokemons, isLoading } = usePokemonList(pokedexNames);

  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [catchName, setCatchName] = useState('');

  const catchPokemon = useCatchPokemon();
  const releasePokemon = useReleasePokemon();

  if (!user) {
    return <Loading />;
  }

  const active: PokemonSummary | null =
    pokemons.find((p) => p.name === selectedName) ?? pokemons[0] ?? null;
  const inTeam = active ? Boolean(user.poketeam?.pokemon.includes(active.name)) : false;

  const handleCatch = (e: FormEvent) => {
    e.preventDefault();
    const name = catchName.trim().toLowerCase();
    if (!name) return;
    catchPokemon.mutate(name, { onSuccess: () => setCatchName('') });
  };

  return (
    <div className="container mx-auto flex grow flex-col gap-8 xl:max-w-6xl">
      <form onSubmit={handleCatch} className="flex items-end gap-2">
        <label className="flex flex-col gap-1 font-semibold" htmlFor="catch">
          Capturar pokemon
          <input
            id="catch"
            value={catchName}
            onChange={(e) => setCatchName(e.target.value)}
            placeholder="pikachu"
            className="border-slate-950 border-b-2 bg-orange-50 outline-none"
          />
        </label>
        <Button type="submit" color="positive" disabled={catchPokemon.isPending}>
          {catchPokemon.isPending ? 'Capturando...' : 'Capturar'}
        </Button>
      </form>
      {catchPokemon.isError && (
        <p className="text-rose-600 text-sm">No se pudo capturar ese pokemon</p>
      )}

      <div className="flex justify-center gap-12">
        <section className="grid h-fit grid-cols-2 gap-4 bg-slate-900 p-4">
          <h2 className="col-span-2 text-center font-semibold text-slate-50 text-xl">Pokedex</h2>
          {isLoading && <p className="col-span-2 text-slate-300">Cargando...</p>}
          {!isLoading && pokemons.length === 0 && (
            <p className="col-span-2 text-slate-300 text-sm">Todavia no capturaste pokemones.</p>
          )}
          {pokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.name}
              pokemon={pokemon}
              selected={pokemon.name === active?.name}
              onSelect={(p) => setSelectedName(p.name)}
            />
          ))}
        </section>

        <div className="flex flex-col gap-8">
          <TeamPanel
            user={user}
            teamPokemons={pokemons.filter((p) => user.poketeam?.pokemon.includes(p.name))}
          />
          {active && (
            <PokemonDetail
              pokemon={active}
              actions={
                <>
                  <Button
                    color="warning"
                    disabled={releasePokemon.isPending}
                    onClick={() => releasePokemon.mutate(active.name)}
                  >
                    Liberar
                  </Button>
                  <TeamToggle
                    pokemonName={active.name}
                    inTeam={inTeam}
                    hasTeam={Boolean(user.poketeam)}
                  />
                </>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TeamToggle({
  pokemonName,
  inTeam,
  hasTeam,
}: {
  pokemonName: string;
  inTeam: boolean;
  hasTeam: boolean;
}) {
  const addToTeam = useAddToTeam();
  const removeFromTeam = useRemoveFromTeam();

  if (!hasTeam) {
    return (
      <span className="self-center text-slate-400 text-sm">
        Crea un equipo para sumar pokemones
      </span>
    );
  }
  if (inTeam) {
    return (
      <Button
        color="negative"
        disabled={removeFromTeam.isPending}
        onClick={() => removeFromTeam.mutate(pokemonName)}
      >
        Quitar del equipo
      </Button>
    );
  }
  return (
    <Button
      color="positive"
      disabled={addToTeam.isPending}
      onClick={() => addToTeam.mutate(pokemonName)}
    >
      Sumar al equipo
    </Button>
  );
}
