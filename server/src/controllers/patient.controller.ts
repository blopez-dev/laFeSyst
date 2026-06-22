import { Request, Response } from 'express';
import { body } from 'express-validator';
import { PatientModel } from '../models/patient.model.js';
import { validate } from '../middleware/validate.middleware.js';

export const PatientController = {
  getAll: async (_req: Request, res: Response): Promise<Response> => {
    try {
      const patients = await PatientModel.findAll();
      return res.json(patients);
    } catch (err) {
      console.error('Get all patients error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  getById: async (req: Request, res: Response): Promise<Response> => {
    try {
      const patient = await PatientModel.findById(req.params.id);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      return res.json(patient);
    } catch (err) {
      console.error('Get patient by id error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  search: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: 'Search query is required' });
      }
      const patients = await PatientModel.search(q);
      return res.json(patients);
    } catch (err) {
      console.error('Search patients error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  create: [
    validate([
      body('first_name').notEmpty().trim(),
      body('last_name').notEmpty().trim(),
      body('date_of_birth').isISO8601(),
      body('gender').isIn(['male', 'female', 'other']),
      body('phone').notEmpty().trim(),
      body('email').optional().isEmail().normalizeEmail(),
      body('address').optional().trim(),
      body('emergency_contact_name').optional().trim(),
      body('emergency_contact_phone').optional().trim(),
      body('blood_type').optional().trim(),
      body('allergies').optional().trim(),
      body('notes').optional().trim(),
    ]),
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const patient = await PatientModel.create(req.body);
        return res.status(201).json(patient);
      } catch (err) {
        console.error('Create patient error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    },
  ],

  update: [
    validate([
      body('first_name').optional().trim(),
      body('last_name').optional().trim(),
      body('date_of_birth').optional().isISO8601(),
      body('gender').optional().isIn(['male', 'female', 'other']),
      body('phone').optional().trim(),
      body('email').optional().isEmail().normalizeEmail(),
      body('address').optional().trim(),
      body('emergency_contact_name').optional().trim(),
      body('emergency_contact_phone').optional().trim(),
      body('blood_type').optional().trim(),
      body('allergies').optional().trim(),
      body('notes').optional().trim(),
    ]),
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const patient = await PatientModel.update(req.params.id, req.body);
        if (!patient) {
          return res.status(404).json({ error: 'Patient not found' });
        }
        return res.json(patient);
      } catch (err) {
        console.error('Update patient error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    },
  ],

  delete: async (req: Request, res: Response): Promise<Response> => {
    try {
      const patient = await PatientModel.delete(req.params.id);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      return res.json({ message: 'Patient deactivated successfully' });
    } catch (err) {
      console.error('Delete patient error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};
