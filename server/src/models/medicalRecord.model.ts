import { pool } from '../config/database.js';
import type { MedicalRecordCreate } from '../types/index.js';

export const MedicalRecordModel = {
  findAll: async () => {
    const result = await pool.query(
      `SELECT 
        mr.*,
        p.first_name AS patient_first_name,
        p.last_name AS patient_last_name,
        p.medical_record_number,
        u.first_name AS doctor_first_name,
        u.last_name AS doctor_last_name,
        u.specialty AS doctor_specialty
      FROM medical_records mr
      JOIN patients p ON mr.patient_id = p.id
      JOIN users u ON mr.doctor_id = u.id
      ORDER BY mr.visit_date DESC`
    );
    return result.rows;
  },

  findById: async (id: string) => {
    const result = await pool.query(
      `SELECT 
        mr.*,
        p.first_name AS patient_first_name,
        p.last_name AS patient_last_name,
        p.medical_record_number,
        u.first_name AS doctor_first_name,
        u.last_name AS doctor_last_name,
        u.specialty AS doctor_specialty
      FROM medical_records mr
      JOIN patients p ON mr.patient_id = p.id
      JOIN users u ON mr.doctor_id = u.id
      WHERE mr.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  findByPatientId: async (patientId: string) => {
    const result = await pool.query(
      `SELECT 
        mr.*,
        u.first_name AS doctor_first_name,
        u.last_name AS doctor_last_name,
        u.specialty AS doctor_specialty
      FROM medical_records mr
      JOIN users u ON mr.doctor_id = u.id
      WHERE mr.patient_id = $1
      ORDER BY mr.visit_date DESC`,
      [patientId]
    );
    return result.rows;
  },

  findByDoctorId: async (doctorId: string) => {
    const result = await pool.query(
      `SELECT 
        mr.*,
        p.first_name AS patient_first_name,
        p.last_name AS patient_last_name,
        p.medical_record_number
      FROM medical_records mr
      JOIN patients p ON mr.patient_id = p.id
      WHERE mr.doctor_id = $1
      ORDER BY mr.visit_date DESC`,
      [doctorId]
    );
    return result.rows;
  },

  create: async (recordData: MedicalRecordCreate) => {
    const result = await pool.query(
      `INSERT INTO medical_records (
        patient_id, doctor_id, reservation_id, diagnosis,
        treatment, prescriptions, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        recordData.patient_id,
        recordData.doctor_id,
        recordData.reservation_id || null,
        recordData.diagnosis,
        recordData.treatment || null,
        recordData.prescriptions || null,
        recordData.notes || null,
      ]
    );
    return result.rows[0];
  },

  update: async (id: string, recordData: Partial<MedicalRecordCreate>) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const fields: (keyof MedicalRecordCreate)[] = [
      'patient_id', 'doctor_id', 'reservation_id', 'diagnosis',
      'treatment', 'prescriptions', 'notes'
    ];

    for (const field of fields) {
      if (recordData[field] !== undefined) {
        updates.push(`${field} = $${paramCount++}`);
        values.push(recordData[field] || null);
      }
    }

    if (updates.length === 0) {
      return await MedicalRecordModel.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE medical_records SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0];
  },

  delete: async (id: string) => {
    const result = await pool.query(
      'DELETE FROM medical_records WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  },
};
