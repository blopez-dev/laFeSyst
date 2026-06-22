# Sistema Hospitalario - La Fe

Sistema completo de gestión hospitalaria con frontend React y backend Node.js.

## Estructura del Proyecto

```
laFeSyst/
├── src/                    # Frontend React + TypeScript + Vite
├── server/                 # Backend API REST (Node.js + Express + TypeScript)
├── database/               # Esquema y seeds de PostgreSQL
└── README.md
```

## Componentes

### Frontend (React + TypeScript + Vite)
- Framework: React 19
- Build tool: Vite 8
- Lenguaje: TypeScript

### Backend (API REST)
- Runtime: Node.js
- Framework: Express
- Lenguaje: TypeScript
- Base de datos: PostgreSQL 15
- Autenticación: JWT
- Seguridad: Helmet, CORS, bcrypt

### Base de Datos
- PostgreSQL 15
- 5 tablas principales: users, patients, rooms, reservations, medical_records
- Tipos ENUM para roles, estados y géneros
- Índices optimizados para consultas frecuentes

## Instalación

### 1. Base de Datos

```bash
# Crear base de datos
createdb hospital_db

# Ejecutar esquema
psql -U tu_usuario -d hospital_db -f database/schema.sql

# Cargar datos de prueba (opcional)
psql -U tu_usuario -d hospital_db -f database/seed.sql
```

### 2. Backend API

```bash
cd server
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# Iniciar servidor de desarrollo
npm run dev
```

La API estará disponible en `http://localhost:3001`

### 3. Frontend

```bash
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## Documentación

- [Documentación de la Base de Datos](database/README.md)
- [Documentación de la API](server/README.md)

## Endpoints Principales de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Usuarios (Doctores, Admin, etc.)
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario (admin)
- `PUT /api/users/:id` - Actualizar usuario (admin)

### Pacientes
- `GET /api/patients` - Listar pacientes
- `GET /api/patients/search?q=query` - Buscar pacientes
- `POST /api/patients` - Crear paciente
- `PUT /api/patients/:id` - Actualizar paciente

### Habitaciones
- `GET /api/rooms` - Listar habitaciones
- `GET /api/rooms/available` - Habitaciones disponibles
- `POST /api/rooms` - Crear habitación (admin)
- `PATCH /api/rooms/:id/status` - Cambiar estado (admin)

### Reservas
- `GET /api/reservations` - Listar reservas
- `POST /api/reservations` - Crear reserva
- `PATCH /api/reservations/:id/status` - Cambiar estado

### Registros Médicos
- `GET /api/medical-records` - Listar registros
- `POST /api/medical-records` - Crear registro
- `GET /api/medical-records/patient/:id` - Registros por paciente

## Usuarios de Prueba

Después de ejecutar el seed, puedes usar estos usuarios:

- **Doctor**: carlos.garcia@hospital.com / password123
- **Admin**: ana.lopez@hospital.com / password123

## Tecnologías

### Frontend
- React 19.2.6
- TypeScript 6.0.2
- Vite 8.0.12

### Backend
- Node.js
- Express 4.19.2
- TypeScript 5.4.5
- PostgreSQL (pg 8.12.0)
- JWT (jsonwebtoken 9.0.2)
- bcrypt 5.1.1
- Helmet 7.1.0
- CORS 2.8.5

## Licencia

ISC
