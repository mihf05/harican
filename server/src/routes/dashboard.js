import express from 'express';
import { dashboardController } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard data (protected route)
router.get('/', authenticate, dashboardController.getDashboard);

export default router;
