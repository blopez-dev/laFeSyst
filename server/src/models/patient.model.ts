import { pool } from '../config/database.js';
import type { PatientCreate } from '../types/index.js';

export const PatientModel = {
  findAll: async () => {
    const result = await pool.query(
      'SELECT * FROM patients WHERE is_active = true ORDER BY last_name, first_name'
    );
    return result.rows;
  },

  findById: async (id: string) => {
    const result = await pool.query('SELECT * FROM patients WHERE id = $1', [id]);
    return result.rows[0];
  },

  findByEmail: async (email: string) => {
    const result = await pool.query('SELECT * FROM patients WHERE email = $1', [email]);
    return result.rows[0];
  },

  findByMedicalRecordNumber: async (mrn: string) => {
    const result = await pool.query(
      'SELECT * FROM patients WHERE medical_record_number = $1',
      [mrn]
    );
    return result.rows[0];
  },

  create: async (patientData: PatientCreate) => {
    const result = await pool.query(
      `INSERT INTO patients (
        first_name, last_name, date_of_birth, gender, email, phone,
        address, emergency_contact_name, emergency_contact_phone,
        blood_type, allergies, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        patientData.first_name,
        patientData.last_name,
        patientData.date_of_birth,
        patientData.gender,
        patientData.email || null,
        patientData.phone,
        patientData.address || null,
        patientData.emergency_contact_name || null,
        patientData.emergency_contact_phone || null,
        patientData.blood_type || null,
        patientData.allergies || null,
        patientData.notes || null,
      ]
    );
    return result.rows[0];
  },

  update: async (id: string, patientData: Partial<PatientCreate>) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const fields: (keyof PatientCreate)[] = [
      'first_name', 'last_name', 'date_of_birth', 'gender', 'email',
      'phone', 'address', 'emergency_contact_name', 'emergency_contact_phone',
      'blood_type', 'allergies', 'notes'
    ];

    for (const field of fields) {
      if (patientData[field] !== undefined) {
        updates.push(`${field} = $${paramCount++}`);
        values.push(patientData[field] || null);
      }
    }

    if (updates.length === 0) {
      return await PatientModel.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE patients SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0];
  },

  delete: async (id: string) => {
    const result = await pool.query(
      'UPDATE patients SET is_active = false WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  },

  search: async (query: string) => {
    const result = await pool.query(
      `SELECT * FROM patients 
       WHERE is_active = true 
       AND (first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1 OR medical_record_number ILIKE $1)
       ORDER BY last_name, first_name
       LIMIT 50`,
      [`%${query}%`]
    );
    return result.rows;
  },
};
