export type UserRole = 'doctor' | 'admin' | 'nurse' | 'receptionist';
export type ReservationStatus = 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled';
export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';
export type RoomType = 'individual' | 'double' | 'suite' | 'icu';
export type Gender = 'male' | 'female' | 'other';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
  specialty?: string;
  license_number?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserCreate {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
  specialty?: string;
  license_number?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  gender: Gender;
  email?: string;
  phone: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_record_number?: string;
  blood_type?: string;
  allergies?: string;
  notes?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PatientCreate {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: Gender;
  email?: string;
  phone: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  blood_type?: string;
  allergies?: string;
  notes?: string;
}

export interface Room {
  id: string;
  room_number: string;
  floor: number;
  type: RoomType;
  status: RoomStatus;
  capacity: number;
  price_per_night?: number;
  description?: string;
  amenities?: string;
  created_at: Date;
  updated_at: Date;
}

export interface RoomCreate {
  room_number: string;
  floor: number;
  type: RoomType;
  capacity: number;
  price_per_night?: number;
  description?: string;
  amenities?: string;
}

export interface Reservation {
  id: string;
  patient_id: string;
  doctor_id: string;
  room_id: string;
  check_in_date: Date;
  check_out_date?: Date;
  status: ReservationStatus;
  diagnosis?: string;
  treatment_plan?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ReservationCreate {
  patient_id: string;
  doctor_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date?: string;
  diagnosis?: string;
  treatment_plan?: string;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  reservation_id?: string;
  visit_date: Date;
  diagnosis: string;
  treatment?: string;
  prescriptions?: string;
  notes?: string;
  created_at: Date;
}

export interface MedicalRecordCreate {
  patient_id: string;
  doctor_id: string;
  reservation_id?: string;
  diagnosis: string;
  treatment?: string;
  prescriptions?: string;
  notes?: string;
}

export interface AuthToken {
  token: string;
  user: Omit<User, 'password_hash'>;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}
