# API REST - Sistema Hospitalario

API REST construida con Node.js, Express, TypeScript y PostgreSQL.

## Instalación

```bash
cd server
npm install
```

## Configuración

Copia el archivo `.env` y ajusta las variables según tu entorno:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hospital_db
DB_USER=postgres
DB_PASSWORD=postgres

PORT=3001
NODE_ENV=development

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

CORS_ORIGIN=http://localhost:5173

BCRYPT_ROUNDS=10
```

## Ejecutar

```bash
# Desarrollo (con hot reload)
npm run dev

# Producción
npm run build
npm start
```

## Endpoints de la API

### Autenticación

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "carlos.garcia@hospital.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "carlos.garcia@hospital.com",
    "first_name": "Carlos",
    "last_name": "García López",
    "role": "doctor",
    "specialty": "Cardiología"
  }
}
```

#### Obtener usuario actual
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Usuarios (Doctores, Admin, etc.)

#### Listar todos los usuarios
```http
GET /api/users
Authorization: Bearer <token>
```

#### Obtener usuario por ID
```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Crear usuario (solo admin)
```http
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "nuevo.doctor@hospital.com",
  "password": "password123",
  "first_name": "Nuevo",
  "last_name": "Doctor",
  "phone": "+34 600000000",
  "role": "doctor",
  "specialty": "Medicina General",
  "license_number": "MED-2024-004"
}
```

#### Actualizar usuario (solo admin)
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "specialty": "Nueva Especialidad",
  "phone": "+34 611111111"
}
```

#### Eliminar usuario (solo admin)
```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

### Pacientes

#### Listar todos los pacientes
```http
GET /api/patients
Authorization: Bearer <token>
```

#### Buscar pacientes
```http
GET /api/patients/search?q=pedro
Authorization: Bearer <token>
```

#### Obtener paciente por ID
```http
GET /api/patients/:id
Authorization: Bearer <token>
```

#### Crear paciente
```http
POST /api/patients
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "Nuevo",
  "last_name": "Paciente",
  "date_of_birth": "1980-05-15",
  "gender": "male",
  "phone": "+34 699999999",
  "email": "nuevo.paciente@email.com",
  "address": "Calle Nueva 123, Madrid",
  "emergency_contact_name": "Contacto Emergencia",
  "emergency_contact_phone": "+34 688888888",
  "blood_type": "A+",
  "allergies": "Ninguna conocida"
}
```

#### Actualizar paciente
```http
PUT /api/patients/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "phone": "+34 677777777",
  "address": "Nueva dirección 456"
}
```

#### Eliminar paciente (solo admin)
```http
DELETE /api/patients/:id
Authorization: Bearer <token>
```

### Habitaciones

#### Listar todas las habitaciones
```http
GET /api/rooms
Authorization: Bearer <token>
```

#### Filtrar por estado
```http
GET /api/rooms?status=available
Authorization: Bearer <token>
```

#### Obtener habitaciones disponibles
```http
GET /api/rooms/available
Authorization: Bearer <token>
```

#### Filtrar disponibles por tipo
```http
GET /api/rooms/available?type=individual
Authorization: Bearer <token>
```

#### Obtener habitación por ID
```http
GET /api/rooms/:id
Authorization: Bearer <token>
```

#### Crear habitación (solo admin)
```http
POST /api/rooms
Authorization: Bearer <token>
Content-Type: application/json

{
  "room_number": "501",
  "floor": 5,
  "type": "suite",
  "capacity": 2,
  "price_per_night": 500.00,
  "description": "Suite de lujo",
  "amenities": "Cama king, jacuzzi, TV 65\", WiFi, minibar"
}
```

#### Actualizar habitación (solo admin)
```http
PUT /api/rooms/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price_per_night": 550.00,
  "status": "maintenance"
}
```

#### Cambiar estado de habitación (solo admin)
```http
PATCH /api/rooms/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "maintenance"
}
```

#### Eliminar habitación (solo admin)
```http
DELETE /api/rooms/:id
Authorization: Bearer <token>
```

### Reservas

#### Listar todas las reservas
```http
GET /api/reservations
Authorization: Bearer <token>
```

#### Filtrar por estado
```http
GET /api/reservations?status=checked_in
Authorization: Bearer <token>
```

#### Obtener reservas por paciente
```http
GET /api/reservations/patient/:patientId
Authorization: Bearer <token>
```

#### Obtener reservas por doctor
```http
GET /api/reservations/doctor/:doctorId
Authorization: Bearer <token>
```

#### Obtener reserva por ID
```http
GET /api/reservations/:id
Authorization: Bearer <token>
```

#### Crear reserva
```http
POST /api/reservations
Authorization: Bearer <token>
Content-Type: application/json

{
  "patient_id": "uuid-del-paciente",
  "doctor_id": "uuid-del-doctor",
  "room_id": "uuid-de-la-habitacion",
  "check_in_date": "2024-02-01T14:00:00Z",
  "check_out_date": "2024-02-05T12:00:00Z",
  "diagnosis": "Diagnóstico inicial",
  "treatment_plan": "Plan de tratamiento",
  "notes": "Notas adicionales"
}
```

**Nota:** Al crear una reserva, la habitación cambia automáticamente a estado "occupied".

#### Actualizar reserva
```http
PUT /api/reservations/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "check_out_date": "2024-02-06T12:00:00Z",
  "diagnosis": "Nuevo diagnóstico"
}
```

#### Cambiar estado de reserva
```http
PATCH /api/reservations/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "checked_in"
}
```

**Estados válidos:** `pending`, `confirmed`, `checked_in`, `completed`, `cancelled`

**Nota:** Al cambiar a `completed` o `cancelled`, la habitación vuelve a estado "available".

#### Eliminar reserva (solo admin)
```http
DELETE /api/reservations/:id
Authorization: Bearer <token>
```

### Registros Médicos

#### Listar todos los registros
```http
GET /api/medical-records
Authorization: Bearer <token>
```

#### Obtener registros por paciente
```http
GET /api/medical-records/patient/:patientId
Authorization: Bearer <token>
```

#### Obtener registros por doctor
```http
GET /api/medical-records/doctor/:doctorId
Authorization: Bearer <token>
```

#### Obtener registro por ID
```http
GET /api/medical-records/:id
Authorization: Bearer <token>
```

#### Crear registro médico
```http
POST /api/medical-records
Authorization: Bearer <token>
Content-Type: application/json

{
  "patient_id": "uuid-del-paciente",
  "doctor_id": "uuid-del-doctor",
  "reservation_id": "uuid-de-la-reserva",
  "diagnosis": "Diagnóstico detallado",
  "treatment": "Tratamiento aplicado",
  "prescriptions": "Medicamentos recetados",
  "notes": "Notas de la consulta"
}
```

#### Actualizar registro médico
```http
PUT /api/medical-records/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "treatment": "Nuevo tratamiento",
  "prescriptions": "Nueva prescripción"
}
```

#### Eliminar registro médico (solo admin)
```http
DELETE /api/medical-records/:id
Authorization: Bearer <token>
```

## Roles y Permisos

- **admin**: Acceso total a todos los endpoints
- **doctor**: Puede gestionar pacientes, reservas y registros médicos
- **nurse**: Puede ver pacientes y reservas
- **receptionist**: Puede gestionar pacientes y reservas

## Ejemplos de Uso con cURL

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"carlos.garcia@hospital.com","password":"password123"}'
```

### Listar pacientes (con token)
```bash
curl -X GET http://localhost:3001/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Crear reserva
```bash
curl -X POST http://localhost:3001/api/reservations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "uuid-paciente",
    "doctor_id": "uuid-doctor",
    "room_id": "uuid-habitacion",
    "check_in_date": "2024-02-01T14:00:00Z",
    "diagnosis": "Control rutinario"
  }'
```

## Estructura del Proyecto

```
server/
├── src/
│   ├── config/          # Configuración de base de datos
│   ├── controllers/     # Controladores de la API
│   ├── middleware/      # Middlewares (auth, validación)
│   ├── models/          # Modelos de datos
│   ├── routes/          # Rutas de la API
│   ├── types/           # Tipos TypeScript
│   └── index.ts         # Punto de entrada
├── .env                 # Variables de entorno
├── package.json
└── tsconfig.json
```

## Próximos Pasos

1. Configurar la base de datos PostgreSQL
2. Ejecutar el esquema: `psql -U postgres -d hospital_db -f ../database/schema.sql`
3. Cargar datos de prueba: `psql -U postgres -d hospital_db -f ../database/seed.sql`
4. Instalar dependencias: `npm install`
5. Iniciar el servidor: `npm run dev`
