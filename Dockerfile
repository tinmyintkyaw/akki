FROM node:20-alpine AS base
RUN npm install -g pnpm
WORKDIR /app


FROM base AS builder
# fetch packages to pnpm store from lockfile instead of package.json
COPY pnpm-lock.yaml ./
RUN pnpm fetch

COPY . ./
RUN pnpm install -r --offline

RUN pnpm run build

RUN pnpm --filter backend --prod deploy backend/pruned
RUN mv backend/pruned/dist/* backend/pruned
RUN rm -r backend/pruned/dist


# App
FROM base AS api
ENV NODE_ENV=production 

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

COPY --from=builder --chown=nodejs:nodejs /app/backend/pruned/ .

USER nodejs
CMD ["node", "index.js"]


# Caddy
# FROM caddy:2.7-alpine AS app-proxy
# COPY Caddyfile /etc/caddy/Caddyfile
# COPY --from=builder /app/frontend/dist /srv