import { pool } from '../config/database.js';
import type { RoomCreate, RoomStatus } from '../types/index.js';

export const RoomModel = {
  findAll: async (status?: RoomStatus) => {
    let query = 'SELECT * FROM rooms';
    const params: any[] = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }

    query += ' ORDER BY floor, room_number';
    const result = await pool.query(query, params);
    return result.rows;
  },

  findById: async (id: string) => {
    const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [id]);
    return result.rows[0];
  },

  findByRoomNumber: async (roomNumber: string) => {
    const result = await pool.query('SELECT * FROM rooms WHERE room_number = $1', [roomNumber]);
    return result.rows[0];
  },

  create: async (roomData: RoomCreate) => {
    const result = await pool.query(
      `INSERT INTO rooms (room_number, floor, type, capacity, price_per_night, description, amenities)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        roomData.room_number,
        roomData.floor,
        roomData.type,
        roomData.capacity,
        roomData.price_per_night || null,
        roomData.description || null,
        roomData.amenities || null,
      ]
    );
    return result.rows[0];
  },

  update: async (id: string, roomData: Partial<RoomCreate> & { status?: RoomStatus }) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const fields = ['room_number', 'floor', 'type', 'status', 'capacity', 'price_per_night', 'description', 'amenities'];

    for (const field of fields) {
      if (roomData[field as keyof typeof roomData] !== undefined) {
        updates.push(`${field} = $${paramCount++}`);
        values.push(roomData[field as keyof typeof roomData] || null);
      }
    }

    if (updates.length === 0) {
      return await RoomModel.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE rooms SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0];
  },

  updateStatus: async (id: string, status: RoomStatus) => {
    const result = await pool.query(
      'UPDATE rooms SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  },

  delete: async (id: string) => {
    const result = await pool.query('DELETE FROM rooms WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  },

  findAvailable: async (type?: string) => {
    let query = 'SELECT * FROM rooms WHERE status = $1';
    const params: any[] = ['available'];

    if (type) {
      query += ' AND type = $2';
      params.push(type);
    }

    query += ' ORDER BY floor, room_number';
    const result = await pool.query(query, params);
    return result.rows;
  },
};
