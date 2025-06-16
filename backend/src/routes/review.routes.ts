import { Router } from 'express';
import { getAllReviews, getReviewById, createReview, updateReview, deleteReview } from '../controllers/review.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// All review routes require authentication
router.use(authMiddleware);

// Get all reviews
router.get('/', getAllReviews);

// Get review by ID
router.get('/:id', getReviewById);

// Create new review
router.post('/', createReview);

// Update review
router.put('/:id', updateReview);

// Delete review
router.delete('/:id', deleteReview);

export default router; 