# Dockerfile para microservicios NestJS + Prisma + gRPC.
#
# Build:
#   docker build --build-arg SERVICE_PORT=50051 --build-arg PROTO_FILE=user.proto \
#     -t maestria/user-service .

FROM alpine/git:latest AS contracts
ARG GRPC_CONTRACTS_REPO=https://github.com/Pryectomaestria1/maestria-grpc-contracts.git
ARG GRPC_CONTRACTS_REF=main
RUN git clone --depth 1 --branch ${GRPC_CONTRACTS_REF} ${GRPC_CONTRACTS_REPO} /grpc-contracts

FROM node:20 AS builder
WORKDIR /app
ARG SERVICE_PORT
ENV SERVICE_PORT=${SERVICE_PORT}

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:20 AS runner
WORKDIR /app
ENV NODE_ENV=production

ARG SERVICE_PORT
ENV SERVICE_PORT=${SERVICE_PORT}

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=contracts /grpc-contracts/ /grpc-contracts/

EXPOSE ${SERVICE_PORT}

CMD ["node", "dist/main.js"]
