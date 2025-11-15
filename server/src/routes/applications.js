import express from 'express';
import { applicationController } from '../controllers/applicationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and POSTER/ADMIN role
router.use(authenticate);
router.use(authorize(['POSTER', 'ADMIN']));

// Get all applications for a specific job
router.get('/job/:jobId', applicationController.getJobApplications);

// Get all applications for all poster's jobs
router.get('/my-applications', applicationController.getAllMyApplications);

// Get application statistics
router.get('/stats', applicationController.getApplicationStats);

// Update application status (review, hire, reject)
router.put('/:applicationId/status', applicationController.updateApplicationStatus);

// Send interview invitation email
router.post('/:applicationId/interview-invitation', applicationController.sendInterviewInvitation);

export default router;
