import { Router } from 'express';
import { PatientController } from '../controllers/patient.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', PatientController.getAll);
router.get('/search', PatientController.search);
router.get('/:id', PatientController.getById);
router.post('/', PatientController.create as any);
router.put('/:id', PatientController.update as any);
router.delete('/:id', authorize('admin'), PatientController.delete);

export default router;
