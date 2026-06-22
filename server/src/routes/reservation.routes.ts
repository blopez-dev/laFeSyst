import { Router } from 'express';
import { ReservationController } from '../controllers/reservation.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', ReservationController.getAll);
router.get('/patient/:patientId', ReservationController.getByPatient);
router.get('/doctor/:doctorId', ReservationController.getByDoctor);
router.get('/:id', ReservationController.getById);
router.post('/', ReservationController.create as any);
router.put('/:id', ReservationController.update as any);
router.patch('/:id/status', ReservationController.updateStatus);
router.delete('/:id', authorize('admin'), ReservationController.delete);

export default router;
