# Maestria - User Service 👤

Microservicio encargado de la gestión de perfiles de usuario y autenticación gRPC.

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

### 2. Ejecución del Servicio
Instala las dependencias y corre el servidor en modo desarrollo (corre en el puerto gRPC `50051`):

```bash
npm install
npm run start:dev
```
