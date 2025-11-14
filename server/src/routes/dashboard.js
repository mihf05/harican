import express from 'express';
import { dashboardController } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard data (protected route)
router.get('/', authenticate, dashboardController.getDashboard);

// Get user growth trends (admin only)
router.get('/user-growth', authenticate, dashboardController.getUserGrowthTrends);

// Get job statistics trends (admin only)
router.get('/job-stats', authenticate, dashboardController.getJobStatsTrends);

// Get poster's job trends (poster only)
router.get('/poster-trends', authenticate, dashboardController.getPosterJobTrends);

export default router;
