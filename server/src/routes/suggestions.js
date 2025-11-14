import express from 'express';
import { getDashboardSuggestions } from '../controllers/suggestionController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get AI-powered dashboard suggestions
router.get('/dashboard', authenticate, getDashboardSuggestions);

export default router;
