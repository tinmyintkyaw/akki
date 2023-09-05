FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
    else echo "Lockfile not found." && exit 1; \
    fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN yarn build


# App
FROM base AS app

RUN apk add --no-cache supervisor

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Next.js server
COPY --from=builder --chown=nodejs:nodejs /app/.next/standalone ./web
COPY --from=builder --chown=nodejs:nodejs /app/.next/static ./web/.next/static
COPY --from=builder /app/public ./web/public

# Multiplayer server
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# setup prisma for migrations
COPY --chown=nodejs:nodejs prisma ./prisma
RUN npm i prisma

COPY --chown=nodejs:nodejs ./docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

COPY --chown=nodejs:nodejs supervisord.conf ./

USER nodejs

ENTRYPOINT [ "./docker-entrypoint.sh" ]
CMD supervisord -c ./supervisord.conf