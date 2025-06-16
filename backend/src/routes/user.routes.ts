import { Router } from 'express';
import { adminOnly, authMiddleware } from '../middlewares/auth.middleware';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserBadges,
  getUserHostedWorkshops,
  getUserAttendedWorkshops,
  getUserJobReviews,
  getUserWorkshopReviews,
  registerUser,
  loginUser,
  getProfile,
  createBadge,
  assignBadgeToUser,
} from '../controllers/user.controller';

const router = Router();

router.get('/', getAllUsers);

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getProfile);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/:id/badges', getUserBadges);
router.get('/:id/hosted-workshops', getUserHostedWorkshops);
router.get('/:id/attended-workshops', getUserAttendedWorkshops);
router.get('/:id/job-reviews', getUserJobReviews);
router.get('/:id/workshop-reviews', getUserWorkshopReviews);
router.post('/badges', authMiddleware, adminOnly, createBadge);
router.post('/badges/assign', authMiddleware, adminOnly, assignBadgeToUser);

export default router;
