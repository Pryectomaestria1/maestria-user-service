# Dockerfile para microservicios NestJS + Prisma + gRPC.
#
# Build por servicio:
#   docker build --build-arg SERVICE_PORT=50051 --build-arg PROTO_FILE=user.proto \
#     -t maestria/user-service .
#
# La convención es que el `.proto` se copie a /grpc-contracts/ (hermano de WORKDIR /app)
# para que `join(process.cwd(), '..', 'grpc-contracts', '<file>.proto')` funcione
# tal como lo espera el código del servicio.

FROM alpine/git:latest AS contracts
ARG GRPC_CONTRACTS_REPO=https://github.com/Pryectomaestria1/maestria-grpc-contracts.git
ARG GRPC_CONTRACTS_REF=main
ARG PROTO_FILE
RUN git clone --depth 1 --branch ${GRPC_CONTRACTS_REF} ${GRPC_CONTRACTS_REPO} /grpc-contracts \
  && cp /grpc-contracts/${PROTO_FILE} /tmp/${PROTO_FILE}

FROM node:20-alpine AS builder
WORKDIR /app
ARG SERVICE_PORT
ENV SERVICE_PORT=${SERVICE_PORT}

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
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

# Copia el .proto necesario al directorio /grpc-contracts/ para preservar
# el path relativo `../grpc-contracts/<file>.proto` que usa el código.
COPY --from=contracts /tmp/${PROTO_FILE} /grpc-contracts/${PROTO_FILE}

EXPOSE ${SERVICE_PORT}

CMD ["node", "dist/main.js"]
