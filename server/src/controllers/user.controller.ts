import { Request, Response } from 'express';
import { body } from 'express-validator';
import { UserModel } from '../models/user.model.js';
import { validate } from '../middleware/validate.middleware.js';

export const UserController = {
  getAll: async (_req: Request, res: Response): Promise<Response> => {
    try {
      const users = await UserModel.findAll();
      return res.json(users);
    } catch (err) {
      console.error('Get all users error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  getById: async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json(user);
    } catch (err) {
      console.error('Get user by id error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  create: [
    validate([
      body('email').isEmail().normalizeEmail(),
      body('password').isLength({ min: 6 }),
      body('first_name').notEmpty().trim(),
      body('last_name').notEmpty().trim(),
      body('role').isIn(['doctor', 'admin', 'nurse', 'receptionist']),
      body('phone').optional().trim(),
      body('specialty').optional().trim(),
      body('license_number').optional().trim(),
    ]),
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const existingUser = await UserModel.findByEmail(req.body.email);
        if (existingUser) {
          return res.status(400).json({ error: 'Email already registered' });
        }

        const user = await UserModel.create(req.body);
        return res.status(201).json(user);
      } catch (err) {
        console.error('Create user error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    },
  ],

  update: [
    validate([
      body('email').optional().isEmail().normalizeEmail(),
      body('first_name').optional().trim(),
      body('last_name').optional().trim(),
      body('role').optional().isIn(['doctor', 'admin', 'nurse', 'receptionist']),
      body('phone').optional().trim(),
      body('specialty').optional().trim(),
      body('license_number').optional().trim(),
    ]),
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const user = await UserModel.update(req.params.id, req.body);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.json(user);
      } catch (err) {
        console.error('Update user error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    },
  ],

  delete: async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await UserModel.delete(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error('Delete user error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};
