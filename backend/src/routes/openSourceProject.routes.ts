import { Router } from 'express';
import { authMiddleware, employerOnly } from '../middlewares/auth.middleware';
import {
  getAllOpenSourceProjects,
  getOpenSourceProjectById,
  createOpenSourceProject,
  updateOpenSourceProject,
  deleteOpenSourceProject
} from '../controllers/openSourceProject.controller';

const router = Router();

// Public routes
router.get('/', getAllOpenSourceProjects);
router.get('/:id', getOpenSourceProjectById);

// Protected routes (employer only)
router.post('/', authMiddleware, employerOnly, createOpenSourceProject);
router.put('/:id', authMiddleware, employerOnly, updateOpenSourceProject);
router.delete('/:id', authMiddleware, employerOnly, deleteOpenSourceProject);

export default router; 