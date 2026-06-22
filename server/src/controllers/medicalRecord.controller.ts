import { Request, Response } from 'express';
import { body } from 'express-validator';
import { MedicalRecordModel } from '../models/medicalRecord.model.js';
import { validate } from '../middleware/validate.middleware.js';

export const MedicalRecordController = {
  getAll: async (_req: Request, res: Response): Promise<Response> => {
    try {
      const records = await MedicalRecordModel.findAll();
      return res.json(records);
    } catch (err) {
      console.error('Get all medical records error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  getById: async (req: Request, res: Response): Promise<Response> => {
    try {
      const record = await MedicalRecordModel.findById(req.params.id);
      if (!record) {
        return res.status(404).json({ error: 'Medical record not found' });
      }
      return res.json(record);
    } catch (err) {
      console.error('Get medical record by id error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  getByPatient: async (req: Request, res: Response): Promise<Response> => {
    try {
      const records = await MedicalRecordModel.findByPatientId(req.params.patientId);
      return res.json(records);
    } catch (err) {
      console.error('Get medical records by patient error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  getByDoctor: async (req: Request, res: Response): Promise<Response> => {
    try {
      const records = await MedicalRecordModel.findByDoctorId(req.params.doctorId);
      return res.json(records);
    } catch (err) {
      console.error('Get medical records by doctor error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  create: [
    validate([
      body('patient_id').isUUID(),
      body('doctor_id').isUUID(),
      body('reservation_id').optional().isUUID(),
      body('diagnosis').notEmpty().trim(),
      body('treatment').optional().trim(),
      body('prescriptions').optional().trim(),
      body('notes').optional().trim(),
    ]),
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const record = await MedicalRecordModel.create(req.body);
        return res.status(201).json(record);
      } catch (err) {
        console.error('Create medical record error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    },
  ],

  update: [
    validate([
      body('patient_id').optional().isUUID(),
      body('doctor_id').optional().isUUID(),
      body('reservation_id').optional().isUUID(),
      body('diagnosis').optional().trim(),
      body('treatment').optional().trim(),
      body('prescriptions').optional().trim(),
      body('notes').optional().trim(),
    ]),
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const record = await MedicalRecordModel.update(req.params.id, req.body);
        if (!record) {
          return res.status(404).json({ error: 'Medical record not found' });
        }
        return res.json(record);
      } catch (err) {
        console.error('Update medical record error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    },
  ],

  delete: async (req: Request, res: Response): Promise<Response> => {
    try {
      const record = await MedicalRecordModel.delete(req.params.id);
      if (!record) {
        return res.status(404).json({ error: 'Medical record not found' });
      }
      return res.json({ message: 'Medical record deleted successfully' });
    } catch (err) {
      console.error('Delete medical record error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};
