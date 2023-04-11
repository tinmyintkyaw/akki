FROM node:18-alpine AS base

FROM base AS deps

WORKDIR /app

COPY package*.json .

RUN npm install --production

FROM base as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build:server

FROM base as runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules

CMD ["node", "dist/server/index.js"]