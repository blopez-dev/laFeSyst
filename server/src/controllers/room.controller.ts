import { Request, Response } from 'express';
import { body } from 'express-validator';
import { RoomModel } from '../models/room.model.js';
import { validate } from '../middleware/validate.middleware.js';

export const RoomController = {
  getAll: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { status } = req.query;
      const rooms = await RoomModel.findAll(status as any);
      return res.json(rooms);
    } catch (err) {
      console.error('Get all rooms error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  getById: async (req: Request, res: Response): Promise<Response> => {
    try {
      const room = await RoomModel.findById(req.params.id);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      return res.json(room);
    } catch (err) {
      console.error('Get room by id error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  getAvailable: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { type } = req.query;
      const rooms = await RoomModel.findAvailable(type as string);
      return res.json(rooms);
    } catch (err) {
      console.error('Get available rooms error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  create: [
    validate([
      body('room_number').notEmpty().trim(),
      body('floor').isInt({ min: 0 }),
      body('type').isIn(['individual', 'double', 'suite', 'icu']),
      body('capacity').isInt({ min: 1 }),
      body('price_per_night').optional().isFloat({ min: 0 }),
      body('description').optional().trim(),
      body('amenities').optional().trim(),
    ]),
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const existingRoom = await RoomModel.findByRoomNumber(req.body.room_number);
        if (existingRoom) {
          return res.status(400).json({ error: 'Room number already exists' });
        }

        const room = await RoomModel.create(req.body);
        return res.status(201).json(room);
      } catch (err) {
        console.error('Create room error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    },
  ],

  update: [
    validate([
      body('room_number').optional().trim(),
      body('floor').optional().isInt({ min: 0 }),
      body('type').optional().isIn(['individual', 'double', 'suite', 'icu']),
      body('status').optional().isIn(['available', 'occupied', 'maintenance', 'reserved']),
      body('capacity').optional().isInt({ min: 1 }),
      body('price_per_night').optional().isFloat({ min: 0 }),
      body('description').optional().trim(),
      body('amenities').optional().trim(),
    ]),
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const room = await RoomModel.update(req.params.id, req.body);
        if (!room) {
          return res.status(404).json({ error: 'Room not found' });
        }
        return res.json(room);
      } catch (err) {
        console.error('Update room error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    },
  ],

  updateStatus: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { status } = req.body;
      if (!['available', 'occupied', 'maintenance', 'reserved'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const room = await RoomModel.updateStatus(req.params.id, status);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      return res.json(room);
    } catch (err) {
      console.error('Update room status error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  delete: async (req: Request, res: Response): Promise<Response> => {
    try {
      const room = await RoomModel.delete(req.params.id);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      return res.json({ message: 'Room deleted successfully' });
    } catch (err) {
      console.error('Delete room error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};
