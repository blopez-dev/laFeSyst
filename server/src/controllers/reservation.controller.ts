import { Request, Response } from 'express';
import { body } from 'express-validator';
import { ReservationModel } from '../models/reservation.model.js';
import { validate } from '../middleware/validate.middleware.js';

export const ReservationController = {
  getAll: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { status } = req.query;
      const reservations = await ReservationModel.findAll(status as any);
      return res.json(reservations);
    } catch (err) {
      console.error('Get all reservations error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  getById: async (req: Request, res: Response): Promise<Response> => {
    try {
      const reservation = await ReservationModel.findById(req.params.id);
      if (!reservation) {
        return res.status(404).json({ error: 'Reservation not found' });
      }
      return res.json(reservation);
    } catch (err) {
      console.error('Get reservation by id error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  getByPatient: async (req: Request, res: Response): Promise<Response> => {
    try {
      const reservations = await ReservationModel.findByPatientId(req.params.patientId);
      return res.json(reservations);
    } catch (err) {
      console.error('Get reservations by patient error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  getByDoctor: async (req: Request, res: Response): Promise<Response> => {
    try {
      const reservations = await ReservationModel.findByDoctorId(req.params.doctorId);
      return res.json(reservations);
    } catch (err) {
      console.error('Get reservations by doctor error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  create: [
    validate([
      body('patient_id').isUUID(),
      body('doctor_id').isUUID(),
      body('room_id').isUUID(),
      body('check_in_date').isISO8601(),
      body('check_out_date').optional().isISO8601(),
      body('diagnosis').optional().trim(),
      body('treatment_plan').optional().trim(),
      body('notes').optional().trim(),
    ]),
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const reservation = await ReservationModel.create(req.body);
        return res.status(201).json(reservation);
      } catch (err: any) {
        console.error('Create reservation error:', err);
        if (err.message === 'Room is not available') {
          return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: 'Internal server error' });
      }
    },
  ],

  update: [
    validate([
      body('patient_id').optional().isUUID(),
      body('doctor_id').optional().isUUID(),
      body('room_id').optional().isUUID(),
      body('check_in_date').optional().isISO8601(),
      body('check_out_date').optional().isISO8601(),
      body('diagnosis').optional().trim(),
      body('treatment_plan').optional().trim(),
      body('notes').optional().trim(),
    ]),
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const reservation = await ReservationModel.update(req.params.id, req.body);
        if (!reservation) {
          return res.status(404).json({ error: 'Reservation not found' });
        }
        return res.json(reservation);
      } catch (err) {
        console.error('Update reservation error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    },
  ],

  updateStatus: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { status } = req.body;
      if (!['pending', 'confirmed', 'checked_in', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const reservation = await ReservationModel.updateStatus(req.params.id, status);
      if (!reservation) {
        return res.status(404).json({ error: 'Reservation not found' });
      }
      return res.json(reservation);
    } catch (err: any) {
      console.error('Update reservation status error:', err);
      if (err.message === 'Reservation not found') {
        return res.status(404).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  delete: async (req: Request, res: Response): Promise<Response> => {
    try {
      const reservation = await ReservationModel.delete(req.params.id);
      if (!reservation) {
        return res.status(404).json({ error: 'Reservation not found' });
      }
      return res.json({ message: 'Reservation deleted successfully' });
    } catch (err: any) {
      console.error('Delete reservation error:', err);
      if (err.message === 'Reservation not found') {
        return res.status(404).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};
