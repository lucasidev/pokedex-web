import type { PokemonSummary, User } from '@/types/api';
import { http, HttpResponse } from 'msw';

const BASE = 'http://localhost:3000/api';

export const testUser: User = {
  _id: 'u1',
  name: 'Ash Ketchum',
  username: 'ash',
  email: 'ash@example.com',
  pokedex: ['pikachu'],
  poketeam: null,
  roles: ['user'],
};

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
    return HttpResponse.json(testUser);
  }),

  http.get(`${BASE}/pokemon/:name`, ({ params }) => {
    if (params.name === 'pikachu') {
      return HttpResponse.json(pikachu);
    }
    return HttpResponse.json(
      { status: 'Not Found', code: 404, message: 'not found' },
      { status: 404 },
    );
  }),
];
