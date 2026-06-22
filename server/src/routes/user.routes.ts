import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.post('/', authorize('admin'), UserController.create as any);
router.put('/:id', authorize('admin'), UserController.update as any);
router.delete('/:id', authorize('admin'), UserController.delete);

export default router;
