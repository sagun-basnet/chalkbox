import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { 
  getUserDashboard,
  getEmployerDashboard,
  getMatchingJobs,
  getRecentActivities,
  getBadgesAndAchievements
} from '../controllers/dashboard.controller';

const router = Router();

// User Dashboard Routes
router.get('/user', authMiddleware, getUserDashboard);
router.get('/user/matching-jobs', authMiddleware, getMatchingJobs);
router.get('/user/recent-activities', authMiddleware, getRecentActivities);
router.get('/user/badges', authMiddleware, getBadgesAndAchievements);

// Employer Dashboard Routes
router.get('/employer', authMiddleware, getEmployerDashboard);

export default router; 