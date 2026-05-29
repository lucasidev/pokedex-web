import { HttpResponse, http } from 'msw';
import type { PokemonSummary, User } from '@/types/api';

const BASE = 'http://localhost:3000/api';

function freshUser(): User {
  return {
    _id: 'u1',
    name: 'Ash Ketchum',
    username: 'ash',
    email: 'ash@example.com',
    pokedex: ['pikachu'],
    poketeam: null,
    roles: ['user'],
  };
}

// Mutable user so the mutation endpoints reflect in subsequent reads
// (the UI refetches /users/using-token after each mutation).
let currentUser: User = freshUser();

export function resetTestUser(): void {
  currentUser = freshUser();
}

export function getTestUser(): User {
  return currentUser;
}

const pikachu: PokemonSummary = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  types: ['electric'],
  sprites: { front_default: 'https://example.com/pikachu.png', back_default: null },
  stats: [
    { name: 'hp', base: 35 },
    { name: 'attack', base: 55 },
  ],
  abilities: ['static'],
};

export const handlers = [
  http.post(`${BASE}/auth/signin`, async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    if (body.email === 'ash@example.com' && body.password === 'pikapika') {
      return HttpResponse.json({ token: 'fake.jwt.token' });
    }
    return HttpResponse.json(
      { status: 'Unauthorized', code: 401, message: 'Invalid credentials' },
      { status: 401 },
    );
  }),

  http.post(`${BASE}/auth/signup`, async () => {
    return HttpResponse.json({ token: 'fake.jwt.token' }, { status: 201 });
  }),

  http.get(`${BASE}/users/using-token`, () => {
    return HttpResponse.json(currentUser);
  }),

  http.get(`${BASE}/pokemon/:name`, ({ params }) => {
    return HttpResponse.json({ ...pikachu, name: String(params.name) });
  }),

  http.put(`${BASE}/users/pokedex/catch-pokemon`, async ({ request }) => {
    const { pokemonName } = (await request.json()) as { pokemonName: string };
    if (!currentUser.pokedex.includes(pokemonName)) {
      currentUser.pokedex.push(pokemonName);
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.put(`${BASE}/users/pokedex/release-pokemon`, async ({ request }) => {
    const { pokemonName } = (await request.json()) as { pokemonName: string };
    currentUser.pokedex = currentUser.pokedex.filter((p) => p !== pokemonName);
    return new HttpResponse(null, { status: 204 });
  }),

  http.put(`${BASE}/users/poketeam/create`, async ({ request }) => {
    const { teamName } = (await request.json()) as { teamName: string };
    currentUser.poketeam = { name: teamName, pokemon: [] };
    return new HttpResponse(null, { status: 204 });
  }),

  http.put(`${BASE}/users/poketeam/delete`, () => {
    currentUser.poketeam = null;
    return new HttpResponse(null, { status: 204 });
  }),

  http.put(`${BASE}/users/poketeam/add-pokemon`, async ({ request }) => {
    const { pokemonName } = (await request.json()) as { pokemonName: string };
    if (currentUser.poketeam && !currentUser.poketeam.pokemon.includes(pokemonName)) {
      currentUser.poketeam.pokemon.push(pokemonName);
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.put(`${BASE}/users/poketeam/remove-pokemon`, async ({ request }) => {
    const { pokemonName } = (await request.json()) as { pokemonName: string };
    if (currentUser.poketeam) {
      currentUser.poketeam.pokemon = currentUser.poketeam.pokemon.filter((p) => p !== pokemonName);
    }
    return new HttpResponse(null, { status: 204 });
  }),
];
