import { pool } from '../config/database.js';
import type { ReservationCreate, ReservationStatus } from '../types/index.js';

export const ReservationModel = {
  findAll: async (status?: ReservationStatus) => {
    let query = `
      SELECT 
        r.*,
        p.first_name AS patient_first_name,
        p.last_name AS patient_last_name,
        p.medical_record_number,
        u.first_name AS doctor_first_name,
        u.last_name AS doctor_last_name,
        u.specialty AS doctor_specialty,
        rm.room_number
      FROM reservations r
      JOIN patients p ON r.patient_id = p.id
      JOIN users u ON r.doctor_id = u.id
      JOIN rooms rm ON r.room_id = rm.id
    `;
    const params: any[] = [];

    if (status) {
      query += ' WHERE r.status = $1';
      params.push(status);
    }

    query += ' ORDER BY r.check_in_date DESC';
    const result = await pool.query(query, params);
    return result.rows;
  },

  findById: async (id: string) => {
    const result = await pool.query(
      `SELECT 
        r.*,
        p.first_name AS patient_first_name,
        p.last_name AS patient_last_name,
        p.medical_record_number,
        p.phone AS patient_phone,
        u.first_name AS doctor_first_name,
        u.last_name AS doctor_last_name,
        u.specialty AS doctor_specialty,
        rm.room_number,
        rm.type AS room_type
      FROM reservations r
      JOIN patients p ON r.patient_id = p.id
      JOIN users u ON r.doctor_id = u.id
      JOIN rooms rm ON r.room_id = rm.id
      WHERE r.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  findByPatientId: async (patientId: string) => {
    const result = await pool.query(
      `SELECT 
        r.*,
        u.first_name AS doctor_first_name,
        u.last_name AS doctor_last_name,
        u.specialty AS doctor_specialty,
        rm.room_number
      FROM reservations r
      JOIN users u ON r.doctor_id = u.id
      JOIN rooms rm ON r.room_id = rm.id
      WHERE r.patient_id = $1
      ORDER BY r.check_in_date DESC`,
      [patientId]
    );
    return result.rows;
  },

  findByDoctorId: async (doctorId: string) => {
    const result = await pool.query(
      `SELECT 
        r.*,
        p.first_name AS patient_first_name,
        p.last_name AS patient_last_name,
        p.medical_record_number,
        rm.room_number
      FROM reservations r
      JOIN patients p ON r.patient_id = p.id
      JOIN rooms rm ON r.room_id = rm.id
      WHERE r.doctor_id = $1
      ORDER BY r.check_in_date DESC`,
      [doctorId]
    );
    return result.rows;
  },

  create: async (reservationData: ReservationCreate) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const roomCheck = await client.query(
        'SELECT status FROM rooms WHERE id = $1',
        [reservationData.room_id]
      );

      if (!roomCheck.rows[0] || roomCheck.rows[0].status !== 'available') {
        throw new Error('Room is not available');
      }

      const result = await client.query(
        `INSERT INTO reservations (
          patient_id, doctor_id, room_id, check_in_date, check_out_date,
          diagnosis, treatment_plan, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          reservationData.patient_id,
          reservationData.doctor_id,
          reservationData.room_id,
          reservationData.check_in_date,
          reservationData.check_out_date || null,
          reservationData.diagnosis || null,
          reservationData.treatment_plan || null,
          reservationData.notes || null,
        ]
      );

      await client.query(
        'UPDATE rooms SET status = $1 WHERE id = $2',
        ['occupied', reservationData.room_id]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  update: async (id: string, reservationData: Partial<ReservationCreate>) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const fields: (keyof ReservationCreate)[] = [
      'patient_id', 'doctor_id', 'room_id', 'check_in_date',
      'check_out_date', 'diagnosis', 'treatment_plan', 'notes'
    ];

    for (const field of fields) {
      if (reservationData[field] !== undefined) {
        updates.push(`${field} = $${paramCount++}`);
        values.push(reservationData[field] || null);
      }
    }

    if (updates.length === 0) {
      return await ReservationModel.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE reservations SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0];
  },

  updateStatus: async (id: string, status: ReservationStatus) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const reservation = await client.query(
        'SELECT room_id, status FROM reservations WHERE id = $1',
        [id]
      );

      if (!reservation.rows[0]) {
        throw new Error('Reservation not found');
      }

      const result = await client.query(
        'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
      );

      if (status === 'completed' || status === 'cancelled') {
        await client.query(
          'UPDATE rooms SET status = $1 WHERE id = $2',
          ['available', reservation.rows[0].room_id]
        );
      } else if (status === 'checked_in') {
        await client.query(
          'UPDATE rooms SET status = $1 WHERE id = $2',
          ['occupied', reservation.rows[0].room_id]
        );
      }

      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  delete: async (id: string) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const reservation = await client.query(
        'SELECT room_id, status FROM reservations WHERE id = $1',
        [id]
      );

      if (!reservation.rows[0]) {
        throw new Error('Reservation not found');
      }

      const result = await client.query(
        'DELETE FROM reservations WHERE id = $1 RETURNING id',
        [id]
      );

      if (reservation.rows[0].status === 'checked_in' || reservation.rows[0].status === 'confirmed') {
        await client.query(
          'UPDATE rooms SET status = $1 WHERE id = $2',
          ['available', reservation.rows[0].room_id]
        );
      }

      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
};
