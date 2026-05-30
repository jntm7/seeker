# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV DEMO_MODE=false

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/@libsql ./node_modules/@libsql
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/src/generated ./src/generated

RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npx prisma db seed

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
