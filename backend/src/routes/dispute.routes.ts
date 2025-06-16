import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  raiseDispute,
  respondToDispute,
  castVote,
  resolveDispute,
  getAllDisputes,
  getDisputeById,
  getUserRewards
} from '../controllers/dispute.controller';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Raise a new dispute
router.post('/', raiseDispute);

// Respond to a dispute
router.post('/:id/respond', respondToDispute);

// Cast a vote on a dispute
router.post('/vote', castVote);

// Resolve a dispute
router.post('/:id/resolve', resolveDispute);

// Get all disputes
router.get('/', getAllDisputes);

// Get dispute by ID
router.get('/:id', getDisputeById);

// Get user's reward history
router.get('/rewards/:userId', getUserRewards);

export default router; 