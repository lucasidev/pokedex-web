set windows-shell := ["powershell.exe", "-NoLogo", "-NoProfile", "-Command"]
set dotenv-load := true

default:
    @just --list

# ═══════════════════════════════════════════════════════════════
# Setup
# ═══════════════════════════════════════════════════════════════

setup:
    npm install
    npx lefthook install

teardown:
    npx rimraf node_modules dist coverage

# ═══════════════════════════════════════════════════════════════
# Dev
# ═══════════════════════════════════════════════════════════════

# Vite dev server. Expects pokedex-api running on localhost:3000
# (proxied via /api). Override target with VITE_API_PROXY_TARGET.
dev:
    npm run dev

build:
    npm run build

preview:
    npm run preview

# ═══════════════════════════════════════════════════════════════
# Quality
# ═══════════════════════════════════════════════════════════════

lint:
    npx biome check .

lint-fix:
    npx biome check --write .

format:
    npx biome format --write .

typecheck:
    npm run typecheck

test:
    npm test

test-watch:
    npm run test:watch

test-coverage:
    npm run test:coverage

sbom:
    npm run sbom

check: lint typecheck test
