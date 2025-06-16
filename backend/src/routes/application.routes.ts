import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication
} from '../controllers/application.controller';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get all applications
router.get('/', getAllApplications);

// Get application by ID
router.get('/:id', getApplicationById);

// Update application status
router.patch('/:id/status', updateApplicationStatus);

// Delete application
router.delete('/:id', deleteApplication);

export default router; 