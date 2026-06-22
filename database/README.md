# Base de Datos PostgreSQL - Sistema Hospitalario

## Esquema de la Base de Datos

### Tablas Principales

#### 1. `users` - Usuarios del Sistema (Doctores, Admin, Enfermeras)
- **id**: UUID único
- **email**: Email único del usuario
- **password_hash**: Contraseña encriptada
- **first_name, last_name**: Nombre completo
- **phone**: Teléfono de contacto
- **role**: Rol del usuario (doctor, admin, nurse, receptionist)
- **specialty**: Especialidad médica (solo doctores)
- **license_number**: Número de licencia médica
- **is_active**: Estado activo/inactivo
- **created_at, updated_at**: Timestamps

#### 2. `patients` - Pacientes
- **id**: UUID único
- **first_name, last_name**: Nombre completo
- **date_of_birth**: Fecha de nacimiento
- **gender**: Género (male, female, other)
- **email, phone**: Datos de contacto
- **address**: Dirección
- **emergency_contact_name, emergency_contact_phone**: Contacto de emergencia
- **medical_record_number**: Número de historial médico único
- **blood_type**: Tipo de sangre
- **allergies**: Alergias conocidas
- **notes**: Notas adicionales
- **is_active**: Estado activo/inactivo
- **created_at, updated_at**: Timestamps

#### 3. `rooms` - Habitaciones
- **id**: UUID único
- **room_number**: Número de habitación único
- **floor**: Piso donde se ubica
- **type**: Tipo de habitación (individual, double, suite, icu)
- **status**: Estado (available, occupied, maintenance, reserved)
- **capacity**: Capacidad de personas
- **price_per_night**: Precio por noche
- **description**: Descripción de la habitación
- **amenities**: Servicios incluidos
- **created_at, updated_at**: Timestamps

#### 4. `reservations` - Reservas/Admisiones
- **id**: UUID único
- **patient_id**: Referencia al paciente
- **doctor_id**: Referencia al doctor asignado
- **room_id**: Referencia a la habitación
- **check_in_date**: Fecha y hora de ingreso
- **check_out_date**: Fecha y hora de salida (puede ser NULL si aún está ingresado)
- **status**: Estado de la reserva (pending, confirmed, checked_in, completed, cancelled)
- **diagnosis**: Diagnóstico principal
- **treatment_plan**: Plan de tratamiento
- **notes**: Notas adicionales
- **created_at, updated_at**: Timestamps

#### 5. `medical_records` - Historial Médico
- **id**: UUID único
- **patient_id**: Referencia al paciente
- **doctor_id**: Referencia al doctor que atendió
- **reservation_id**: Referencia a la reserva (opcional)
- **visit_date**: Fecha de la visita
- **diagnosis**: Diagnóstico
- **treatment**: Tratamiento aplicado
- **prescriptions**: Medicamentos recetados
- **notes**: Notas médicas
- **created_at**: Timestamp de creación

## Relaciones

```
users (doctores) ──< reservations >── patients
                        │
                        └──> rooms

patients ──< medical_records >── users (doctores)
    │
    └──< reservations
```

## Instalación

### 1. Crear la base de datos
```bash
createdb hospital_db
```

### 2. Ejecutar el esquema
```bash
psql -U tu_usuario -d hospital_db -f database/schema.sql
```

### 3. Cargar datos de prueba (opcional)
```bash
psql -U tu_usuario -d hospital_db -f database/seed.sql
```

## Consultas de Ejemplo

### Ver todas las reservas activas con información del paciente y doctor
```sql
SELECT 
    r.id,
    p.first_name || ' ' || p.last_name AS paciente,
    u.first_name || ' ' || u.last_name AS doctor,
    rm.room_number,
    r.check_in_date,
    r.check_out_date,
    r.status
FROM reservations r
JOIN patients p ON r.patient_id = p.id
JOIN users u ON r.doctor_id = u.id
JOIN rooms rm ON r.room_id = rm.id
WHERE r.status IN ('pending', 'confirmed', 'checked_in')
ORDER BY r.check_in_date DESC;
```

### Habitaciones disponibles por tipo
```sql
SELECT * FROM rooms 
WHERE status = 'available' 
ORDER BY type, room_number;
```

### Pacientes con su doctor asignado en reservas activas
```sql
SELECT 
    p.first_name || ' ' || p.last_name AS paciente,
    p.phone AS telefono_paciente,
    u.first_name || ' ' || u.last_name AS doctor,
    u.specialty AS especialidad,
    r.check_in_date,
    r.status
FROM patients p
JOIN reservations r ON p.id = r.patient_id
JOIN users u ON r.doctor_id = u.id
WHERE r.status IN ('confirmed', 'checked_in')
ORDER BY r.check_in_date;
```

## Próximos Pasos

1. Crear la API REST para conectar con la base de datos
2. Implementar autenticación y autorización
3. Crear endpoints para CRUD de cada entidad
4. Implementar validaciones a nivel de aplicación
5. Agregar índices adicionales según patrones de consulta
