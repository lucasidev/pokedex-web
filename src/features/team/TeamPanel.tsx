import { Button } from '@/components/Button';
import { PokemonCard } from '@/features/pokemon/PokemonCard';
import type { PokemonSummary, User } from '@/types/api';
import { type FormEvent, useState } from 'react';
import { useCreateTeam, useDeleteTeam } from './team.queries';

interface TeamPanelProps {
  user: User;
  teamPokemons: PokemonSummary[];
}

export function TeamPanel({ user, teamPokemons }: TeamPanelProps) {
  const createTeam = useCreateTeam();
  const deleteTeam = useDeleteTeam();
  const [teamName, setTeamName] = useState('');

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    const name = teamName.trim();
    if (!name) return;
    createTeam.mutate(name, { onSuccess: () => setTeamName('') });
  };

  if (!user.poketeam) {
    return (
      <form onSubmit={handleCreate} className="flex items-end gap-2 bg-slate-900 p-4">
        <label className="flex flex-col gap-1 font-semibold text-slate-50" htmlFor="teamName">
          Crear equipo
          <input
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Mi equipo"
            className="border-slate-50 border-b-2 bg-slate-800 px-1 text-slate-50 outline-none"
          />
        </label>
        <Button type="submit" color="positive" disabled={createTeam.isPending}>
          Crear
        </Button>
      </form>
    );
  }

  return (
    <section className="flex flex-col gap-2 bg-slate-900 p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-50 text-xl">{user.poketeam.name}</h2>
        <Button color="warning" disabled={deleteTeam.isPending} onClick={() => deleteTeam.mutate()}>
          Eliminar equipo
        </Button>
      </div>
      <div className="flex gap-4">
        {teamPokemons.length === 0 ? (
          <p className="text-slate-300 text-sm">Equipo vacio. Suma pokemones desde el detalle.</p>
        ) : (
          teamPokemons.map((pokemon) => <PokemonCard key={pokemon.name} pokemon={pokemon} />)
        )}
      </div>
    </section>
  );
}
