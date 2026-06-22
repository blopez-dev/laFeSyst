import { Router } from 'express';
import { RoomController } from '../controllers/room.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', RoomController.getAll);
router.get('/available', RoomController.getAvailable);
router.get('/:id', RoomController.getById);
router.post('/', authorize('admin'), RoomController.create as any);
router.put('/:id', authorize('admin'), RoomController.update as any);
router.patch('/:id/status', authorize('admin'), RoomController.updateStatus);
router.delete('/:id', authorize('admin'), RoomController.delete);

export default router;
