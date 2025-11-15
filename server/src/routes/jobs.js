import express from 'express';
import { jobController } from '../controllers/jobController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);

// Protected routes (require authentication)
router.get('/recommended/me', authenticate, jobController.getRecommendedJobs);
router.get('/match/:id', authenticate, jobController.getJobMatch);
router.post('/:id/apply', authenticate, jobController.applyToJob);

// Poster/Admin only routes
router.post('/', authenticate, authorize(['POSTER', 'ADMIN']), jobController.createJob);
router.put('/:id', authenticate, authorize(['POSTER', 'ADMIN']), jobController.updateJob);
router.delete('/:id', authenticate, authorize(['POSTER', 'ADMIN']), jobController.deleteJob);

export default router;
