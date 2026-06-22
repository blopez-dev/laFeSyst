INSERT INTO users (email, password_hash, first_name, last_name, phone, role, specialty, license_number) VALUES
('carlos.garcia@hospital.com', '$2b$10$example_hash_1', 'Carlos', 'García López', '+34 612345678', 'doctor', 'Cardiología', 'MED-2024-001'),
('maria.rodriguez@hospital.com', '$2b$10$example_hash_2', 'María', 'Rodríguez Sánchez', '+34 623456789', 'doctor', 'Neurología', 'MED-2024-002'),
('juan.martinez@hospital.com', '$2b$10$example_hash_3', 'Juan', 'Martínez Fernández', '+34 634567890', 'doctor', 'Pediatría', 'MED-2024-003'),
('ana.lopez@hospital.com', '$2b$10$example_hash_4', 'Ana', 'López García', '+34 645678901', 'admin', NULL, NULL),
('laura.gonzalez@hospital.com', '$2b$10$example_hash_5', 'Laura', 'González Martín', '+34 656789012', 'nurse', NULL, NULL);

INSERT INTO patients (first_name, last_name, date_of_birth, gender, email, phone, address, emergency_contact_name, emergency_contact_phone, medical_record_number, blood_type, allergies) VALUES
('Pedro', 'Sánchez Pérez', '1975-03-15', 'male', 'pedro.sanchez@email.com', '+34 611111111', 'Calle Mayor 123, Madrid', 'Laura Sánchez', '+34 611111112', 'MRN-2024-001', 'O+', 'Penicilina'),
('Carmen', 'Díaz Romero', '1988-07-22', 'female', 'carmen.diaz@email.com', '+34 622222222', 'Avenida de la Constitución 45, Sevilla', 'Miguel Díaz', '+34 622222223', 'MRN-2024-002', 'A+', NULL),
('Roberto', 'Hernández Ruiz', '1962-11-08', 'male', 'roberto.hernandez@email.com', '+34 633333333', 'Plaza España 10, Valencia', 'Isabel Hernández', '+34 633333334', 'MRN-2024-003', 'B+', 'Aspirina, Mariscos'),
('Isabel', 'Moreno Jiménez', '1995-05-30', 'female', 'isabel.moreno@email.com', '+34 644444444', 'Calle Real 78, Barcelona', 'Antonio Moreno', '+34 644444445', 'MRN-2024-004', 'AB+', NULL),
('Miguel', 'Álvarez Torres', '1950-01-12', 'male', 'miguel.alvarez@email.com', '+34 655555555', 'Ronda Norte 56, Bilbao', 'Patricia Álvarez', '+34 655555556', 'MRN-2024-005', 'O-', 'Sulfa');

INSERT INTO rooms (room_number, floor, type, status, capacity, price_per_night, description, amenities) VALUES
('101', 1, 'individual', 'available', 1, 150.00, 'Habitación individual estándar', 'Cama individual, baño privado, TV, WiFi'),
('102', 1, 'individual', 'available', 1, 150.00, 'Habitación individual estándar', 'Cama individual, baño privado, TV, WiFi'),
('201', 2, 'double', 'available', 2, 250.00, 'Habitación doble con vista al jardín', 'Cama doble, baño privado, TV, WiFi, minibar'),
('202', 2, 'double', 'occupied', 2, 250.00, 'Habitación doble con vista al jardín', 'Cama doble, baño privado, TV, WiFi, minibar'),
('301', 3, 'suite', 'available', 2, 450.00, 'Suite premium con sala de estar', 'Cama king, sala de estar, baño de lujo, TV, WiFi, minibar'),
('401', 4, 'icu', 'available', 1, 800.00, 'Unidad de cuidados intensivos', 'Equipo médico completo, monitoreo 24/7'),
('402', 4, 'icu', 'maintenance', 1, 800.00, 'Unidad de cuidados intensivos', 'Equipo médico completo, monitoreo 24/7');

INSERT INTO reservations (patient_id, doctor_id, room_id, check_in_date, check_out_date, status, diagnosis, treatment_plan) VALUES
(
    (SELECT id FROM patients WHERE medical_record_number = 'MRN-2024-001'),
    (SELECT id FROM users WHERE email = 'carlos.garcia@hospital.com'),
    (SELECT id FROM rooms WHERE room_number = '202'),
    '2024-01-15 14:00:00',
    '2024-01-20 12:00:00',
    'checked_in',
    'Hipertensión arterial',
    'Control de presión arterial, medicación antihipertensiva, dieta baja en sodio'
),
(
    (SELECT id FROM patients WHERE medical_record_number = 'MRN-2024-002'),
    (SELECT id FROM users WHERE email = 'maria.rodriguez@hospital.com'),
    (SELECT id FROM rooms WHERE room_number = '101'),
    '2024-01-18 10:00:00',
    '2024-01-22 12:00:00',
    'confirmed',
    'Migraña crónica',
    'Estudios neurológicos, resonancia magnética, tratamiento preventivo'
),
(
    (SELECT id FROM patients WHERE medical_record_number = 'MRN-2024-003'),
    (SELECT id FROM users WHERE email = 'carlos.garcia@hospital.com'),
    (SELECT id FROM rooms WHERE room_number = '301'),
    '2024-01-10 09:00:00',
    '2024-01-14 12:00:00',
    'completed',
    'Arritmia cardíaca',
    'Monitoreo cardíaco, medicación antiarrítmica, seguimiento post-alta'
);

INSERT INTO medical_records (patient_id, doctor_id, reservation_id, diagnosis, treatment, prescriptions, notes) VALUES
(
    (SELECT id FROM patients WHERE medical_record_number = 'MRN-2024-001'),
    (SELECT id FROM users WHERE email = 'carlos.garcia@hospital.com'),
    (SELECT id FROM reservations WHERE patient_id = (SELECT id FROM patients WHERE medical_record_number = 'MRN-2024-001') LIMIT 1),
    'Hipertensión arterial estadio 2',
    'Inicio de tratamiento farmacológico, cambios en estilo de vida',
    'Enalapril 10mg cada 12 horas, Hidroclorotiazida 25mg cada 24 horas',
    'Paciente refiere mareos ocasionales. Se solicita ecocardiograma.'
),
(
    (SELECT id FROM patients WHERE medical_record_number = 'MRN-2024-003'),
    (SELECT id FROM users WHERE email = 'carlos.garcia@hospital.com'),
    (SELECT id FROM reservations WHERE patient_id = (SELECT id FROM patients WHERE medical_record_number = 'MRN-2024-003') LIMIT 1),
    'Fibrilación auricular paroxística',
    'Cardioversión farmacológica exitosa, anticoagulación',
    'Amiodarona 200mg cada 8 horas, Warfarina 5mg según INR',
    'Paciente responde bien al tratamiento. Alta con seguimiento en consultorio en 2 semanas.'
);
