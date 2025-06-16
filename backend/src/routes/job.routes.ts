import { Router } from 'express';
import { authMiddleware, employerOnly } from '../middlewares/auth.middleware';
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobApplications,
  getJobContracts,
  getJobSuggestions,
  applyForJob,
  inviteStudentToJob,
  getStudentInvites,
  acceptJobInvite,
  rejectJobInvite,
  getSuggestedFreelancers,
  markJobAsCompleted
} from '../controllers/job.controller';

const router = Router();

// Public routes
router.get('/', getAllJobs);
// Job suggestions (protected)
router.get('/suggestions', authMiddleware, getJobSuggestions);
router.get('/:id', getJobById);

// Protected routes
router.use(authMiddleware);

// Employer only routes
router.post('/', employerOnly, createJob);
router.put('/:id', employerOnly, updateJob);
router.delete('/:id', employerOnly, deleteJob);
router.get('/:id/applications', employerOnly, getJobApplications);
router.get('/:id/contracts', employerOnly, getJobContracts);
router.get('/:id/suggested-freelancers', employerOnly, getSuggestedFreelancers);

// Student routes
router.post('/:id/apply', applyForJob);

// Job invite routes
router.post('/:jobId/invite/:studentId', inviteStudentToJob);
router.get('/invites', getStudentInvites);
router.post('/invites/:inviteId/accept', acceptJobInvite);
router.post('/invites/:inviteId/reject', rejectJobInvite);

// Job completion route (both employer and student can access)
router.post('/:id/complete', markJobAsCompleted);

export default router; 