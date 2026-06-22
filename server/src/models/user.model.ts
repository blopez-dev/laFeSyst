import { pool } from '../config/database.js';
import type { UserCreate } from '../types/index.js';
import bcrypt from 'bcrypt';

export const UserModel = {
  findAll: async () => {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, phone, role, specialty, license_number, is_active, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    return result.rows;
  },

  findById: async (id: string) => {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, phone, role, specialty, license_number, is_active, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  findByEmail: async (email: string) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  create: async (userData: UserCreate) => {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '10');
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, specialty, license_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, email, first_name, last_name, phone, role, specialty, license_number, is_active, created_at, updated_at`,
      [
        userData.email,
        passwordHash,
        userData.first_name,
        userData.last_name,
        userData.phone || null,
        userData.role,
        userData.specialty || null,
        userData.license_number || null,
      ]
    );
    return result.rows[0];
  },

  update: async (id: string, userData: Partial<UserCreate>) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (userData.email) {
      updates.push(`email = $${paramCount++}`);
      values.push(userData.email);
    }
    if (userData.first_name) {
      updates.push(`first_name = $${paramCount++}`);
      values.push(userData.first_name);
    }
    if (userData.last_name) {
      updates.push(`last_name = $${paramCount++}`);
      values.push(userData.last_name);
    }
    if (userData.phone !== undefined) {
      updates.push(`phone = $${paramCount++}`);
      values.push(userData.phone);
    }
    if (userData.role) {
      updates.push(`role = $${paramCount++}`);
      values.push(userData.role);
    }
    if (userData.specialty !== undefined) {
      updates.push(`specialty = $${paramCount++}`);
      values.push(userData.specialty);
    }
    if (userData.license_number !== undefined) {
      updates.push(`license_number = $${paramCount++}`);
      values.push(userData.license_number);
    }

    if (updates.length === 0) {
      return await UserModel.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount}
       RETURNING id, email, first_name, last_name, phone, role, specialty, license_number, is_active, created_at, updated_at`,
      values
    );
    return result.rows[0];
  },

  delete: async (id: string) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  },

  verifyPassword: async (email: string, password: string) => {
    const user = await UserModel.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return null;

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};
