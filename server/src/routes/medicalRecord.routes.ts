import { Router } from 'express';
import { MedicalRecordController } from '../controllers/medicalRecord.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', MedicalRecordController.getAll);
router.get('/patient/:patientId', MedicalRecordController.getByPatient);
router.get('/doctor/:doctorId', MedicalRecordController.getByDoctor);
router.get('/:id', MedicalRecordController.getById);
router.post('/', MedicalRecordController.create as any);
router.put('/:id', MedicalRecordController.update as any);
router.delete('/:id', authorize('admin'), MedicalRecordController.delete);

export default router;
