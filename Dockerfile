# syntax=docker/dockerfile:1.7
# Multi-stage build for pokedex-web.
# - build stage compiles the vite app to static assets in dist/
# - runtime stage serves them with nginx and proxies /api to the backend

# Stage 1: build
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./

# --ignore-scripts skips the prepare hook (lefthook install needs .git,
# which is dockerignored). No native modules to rebuild here.
RUN npm install --no-audit --no-fund --ignore-scripts

COPY tsconfig.json tsconfig.node.json vite.config.ts index.html ./
COPY postcss.config.js ./
COPY src ./src

# VITE_API_URL is inlined at build time. Default stays relative (/api)
# so nginx can proxy it regardless of the backend origin.
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Stage 2: runtime
FROM nginx:1.31-alpine AS runtime

# nginx:alpine runs envsubst over /etc/nginx/templates/*.template at boot,
# substituting only real env vars, so $host/$uri stay intact.
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

ENV BACKEND_URL=http://pokedex-api:3000

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1
