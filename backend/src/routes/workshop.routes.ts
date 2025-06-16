import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  getAllWorkshops,
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  registerForWorkshop,
  getWorkshopAttendees,
  getWorkshopReviews,
  addWorkshopReview,
  getWorkshopSuggestions,
  getMyOrganizedWorkshops,
  getMyJoinedWorkshops
} from '../controllers/workshop.controller';

const router = Router();

// Get all workshops with optional filters
router.get('/', getAllWorkshops);

// Get personalized workshop suggestions
router.get('/suggestions', authMiddleware, getWorkshopSuggestions);

// Get workshops organized by the user
router.get('/my-organized', authMiddleware, getMyOrganizedWorkshops);

// Get workshops joined by the user
router.get('/my-joined', authMiddleware, getMyJoinedWorkshops);

// Get workshop by ID
router.get('/:id', getWorkshopById);

// Create new workshop
router.post('/', authMiddleware, createWorkshop);

// Update workshop
router.put('/:id', authMiddleware, updateWorkshop);

// Delete workshop
router.delete('/:id', authMiddleware, deleteWorkshop);

// Register for a workshop
router.post('/:id/register', authMiddleware, registerForWorkshop);

// Get workshop attendees
router.get('/:id/attendees', authMiddleware, getWorkshopAttendees);

// Get workshop reviews
router.get('/:id/reviews', getWorkshopReviews);

// Add workshop review
router.post('/:id/reviews', authMiddleware, addWorkshopReview);

export default router; 