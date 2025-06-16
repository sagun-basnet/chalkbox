import { Router } from 'express';
import userRoutes from './user.routes';
import jobRoutes from './job.routes';
import workshopRoutes from './workshop.routes';
import applicationRoutes from './application.routes';
import contractRoutes from './contract.routes';
import reviewRoutes from './review.routes';
import openSourceRoutes from './openSourceProject.routes';
import dashboardRoutes from './dashboard.routes';
import disputeRoutes from './dispute.routes';

const router = Router();

// Mount routes
router.use('/users', userRoutes);
router.use('/jobs', jobRoutes);
router.use('/workshops', workshopRoutes);
router.use('/applications', applicationRoutes);
router.use('/contracts', contractRoutes);
router.use('/reviews', reviewRoutes);
router.use('/open-source-projects', openSourceRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/disputes', disputeRoutes);

export default router; 