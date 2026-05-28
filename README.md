# pokedex-web

Cliente web de una Pokédex personal: registro y login con JWT, captura y
liberación de pokémons, y armado de un equipo. Consume la
[pokedex-api](https://github.com/lucasidev/node-seminario-authAPI), que a
su vez proxea la [PokeAPI publica](https://pokeapi.co) con cache.

## Origen del proyecto

Nacio como trabajo final de la asignatura **Seminario Informatico** de la
Tecnicatura Universitaria en Desarrollo y Calidad de Software (UNSTA,
2023). La version original era React + Vite en JavaScript plano, con
Redux para todo el estado, llamadas a la API hardcodeadas, sin tests, sin
tipos y con varios flujos a medio terminar (el signup era un stub, el
manejo de equipo tenia bugs).

La rama `main` conserva esa version. La rama `feature/devops-modernization`
es un rewrite completo: TypeScript, TanStack Query para server state,
Zustand para el token, validacion con Zod, tests con Vitest + Testing
Library + MSW, imagen Docker multi-stage servida por nginx y pipeline de
CI en GitHub Actions con analisis de seguridad.

## Stack

| Capa | Tecnologia |
|---|---|
| Build tool | Vite 5 |
| Lenguaje | TypeScript 5.7 strict |
| UI | React 18 |
| Estilos | Tailwind CSS 3 |
| Server state | TanStack Query 5 |
| Client state | Zustand 5 (token, persistido) |
| HTTP | axios (instancia con interceptors) |
| Validacion | Zod (formularios) |
| Routing | React Router 6 |
| Tests | Vitest + Testing Library + MSW |
| Lint + format | Biome 1.9 (reemplaza ESLint + Prettier) |
| Git hooks | Lefthook |
| Container | Docker multi-stage, nginx |
| CI | GitHub Actions (quality, docker, sbom, sonarcloud, snyk) |

## Quick start

Necesitas Node 22. El toolchain esta pineado en `.tool-versions` para
[mise](https://mise.jdx.dev) o [asdf](https://asdf-vm.com).

```bash
just setup        # npm install + lefthook install
just dev          # vite dev server en http://localhost:5173
```

El dev server proxea `/api` a `http://localhost:3000` (la pokedex-api).
Levantala antes, o apunta el proxy a otro origen con
`VITE_API_PROXY_TARGET`.

## Comandos

```bash
just dev            # vite dev server
just build          # typecheck + vite build a dist/
just preview        # sirve el build local
just lint           # biome check
just lint-fix       # biome check --write
just format         # biome format --write
just typecheck      # tsc --noEmit
just test           # vitest run
just test-watch     # vitest en watch
just test-coverage  # vitest con cobertura
just sbom           # CycloneDX SBOM
just check          # lint + typecheck + test (quality gate)
```

## Variables de entorno

Copiar `.env.example` a `.env`. Todas las vars del cliente llevan prefijo
`VITE_` (se inlinean en build time).

| Variable | Default | Descripcion |
|---|---|---|
| `VITE_API_URL` | `/api` | Base URL del cliente HTTP. Relativa por defecto: la proxea vite en dev y nginx en prod. |
| `VITE_API_PROXY_TARGET` | `http://localhost:3000` | Solo dev: a donde apunta el proxy de vite para `/api`. |

## Estructura

Package by feature. Cada feature owns su api, sus queries/mutations y sus
componentes.

```
src/
├── config/env.ts          validacion de import.meta.env con zod
├── lib/
│   ├── api.ts             axios instance: baseURL, bearer interceptor, 401 -> logout
│   ├── queryClient.ts     config de TanStack Query
│   └── forms.ts           helper de errores de formulario
├── types/api.ts           tipos del contrato del backend (User, PokemonSummary)
├── features/
│   ├── auth/              store (zustand), api, schemas (zod), forms, AuthPage
│   ├── pokemon/           proxy client, queries, card y detalle
│   ├── pokedex/           mutaciones catch / release
│   └── team/              mutaciones create / delete / add / remove + panel
├── components/            Button, FormField, Layout, Header, Footer, Loading
├── routes/                ProtectedRoute, NotFoundPage
├── pages/HomePage.tsx     vista principal autenticada
├── App.tsx                rutas
└── main.tsx               providers (QueryClient + Router)
```

## Estado: server vs client

- **TanStack Query** maneja todo el server state. El usuario (`useMe`) y
  los pokemones del proxy se cachean y se refetchean ante mutaciones
  (capturar, liberar, equipo) invalidando la query `['me']`.
- **Zustand** guarda solo el token JWT, persistido en `localStorage`. El
  interceptor de axios lo adjunta como `Authorization: Bearer`; un 401
  lo limpia y la UI vuelve al login.

## Como consume la API

Todas las llamadas pasan por `lib/api.ts` con base `VITE_API_URL`. El
backend responde con el envelope `{ status, code, data?, message? }`; el
cliente desempaqueta `data`. Los pokemones se piden al proxy del backend
(`/api/pokemon/:name`), no a pokeapi.co directo, para aprovechar la cache
Redis y recibir el shape normalizado.

## Docker

```bash
docker build -t pokedex-web .
docker run -p 8080:80 -e BACKEND_URL=http://host:3000 pokedex-web
```

Build multi-stage: vite build, luego nginx sirve `dist/` con fallback SPA
y proxy de `/api` al backend. `BACKEND_URL` se sustituye al arrancar.

## CI

GitHub Actions corre en cada push y PR:

- **quality**: biome, typecheck, vitest con cobertura, vite build.
- **docker**: build de la imagen + smoke test del SPA.
- **sbom**: CycloneDX + scan con grype.
- **sonarcloud / snyk**: analisis estatico y de dependencias (gated por
  secrets).

## Convenciones

- Identificadores en ingles, UI strings en espanol.
- Conventional Commits, Oneflow (`feature/`, `fix/`, `hotfix/`).
- Biome para lint + format, lefthook para pre-commit.
