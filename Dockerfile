FROM node:20-alpine AS builder
WORKDIR /workspace/app
RUN apk add --no-cache openssl
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /workspace/app
ENV NODE_ENV=production
RUN apk add --no-cache openssl
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev
COPY --from=builder /workspace/app/dist ./dist
COPY --from=builder /workspace/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /workspace/app/node_modules/@prisma ./node_modules/@prisma
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/main.js"]
