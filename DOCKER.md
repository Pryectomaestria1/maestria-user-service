# Imagen Docker
Este servicio incluye un `Dockerfile` parametrizado, idéntico en estructura al de los demás microservicios del ecosistema.

## Build

```bash
docker build \
  --build-arg SERVICE_PORT=50051 \
  --build-arg PROTO_FILE=user.proto \
  -t maestria/user-service .
```

## Variables de build

| Arg | Significado | Default |
|---|---|---|
| `SERVICE_PORT` | Puerto gRPC que el contenedor expone | `3000` |
| `PROTO_FILE` | Nombre del `.proto` a copiar desde `maestria-grpc-contracts` | (requerido) |
| `GRPC_CONTRACTS_REPO` | URL del repo de contratos | `https://github.com/Pryectomaestria1/maestria-grpc-contracts.git` |
| `GRPC_CONTRACTS_REF` | Rama/tag del repo de contratos | `main` |

## Variables de entorno de runtime

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgresql://udemy_admin:udemy_password@postgres:5432/user_db` |
| `GRPC_PORT` | Puerto gRPC en el contenedor | `50051` |
| `NODE_ENV` | Entorno de Node | `production` |

## Contexto

El `.proto` se clona en build-time desde `maestria-grpc-contracts` y se copia a `/grpc-contracts/<file>.proto` dentro de la imagen, conservando el path relativo que espera el código del servicio (`join(process.cwd(), '..', 'grpc-contracts', '<file>.proto')`).
