#!/bin/sh

# run db migrations
npx prisma migrate deploy

exec "$@"