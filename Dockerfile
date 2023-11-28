FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
COPY prisma .
RUN npm install -g pnpm && pnpm i
RUN npm exec prisma generate


FROM base AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules node_modules
RUN ls
RUN npm run build


# App
FROM base AS api

WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
COPY --from=builder --chown=nodejs:nodejs /app/dist/server .
USER nodejs

ENTRYPOINT [ "./docker-entrypoint.sh" ]
CMD node index.cjs


# Caddy
FROM caddy:2.7-alpine AS caddy
COPY ./Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/dist/client /srv