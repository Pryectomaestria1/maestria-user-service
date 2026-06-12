# Maestria - User Service 👤

Microservicio encargado de la gestión de perfiles de usuario y autenticación gRPC. Utiliza PostgreSQL con Prisma ORM y base de datos independiente (`user_db`).

## 🚀 Requisitos e Instalación

### 1. Contratos gRPC (Obligatorio)
Clona el repositorio de contratos en el **mismo directorio padre** donde está este microservicio con el nombre `grpc-contracts`:

```bash
# Desde el directorio padre común:
git clone https://github.com/Pryectomaestria1/maestria-grpc-contracts.git grpc-contracts
```

La estructura de carpetas debe quedar así:
```
directorio-padre/
├── maestria-user-service/  (Este repositorio)
└── grpc-contracts/
```

### 2. Base de Datos (Prisma)
Asegúrate de tener la infraestructura de Docker encendida (`docker-compose up -d` en el gateway) y configura la conexión a la base de datos **independiente** de este servicio:

```bash
cp .env.example .env
npm install
npm run prisma:push
```

### 3. Ejecución del Servicio
Inicia el microservicio en modo desarrollo (corre en el puerto gRPC `50051`):

```bash
npm run start:dev
```
