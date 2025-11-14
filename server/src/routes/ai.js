import express from 'express';
import { sendChatMessage, extractSkillsFromCV, generateCVSuggestions, generateCV } from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// CareerBot chat endpoint
router.post('/chat', authenticate, sendChatMessage);

// CV/Profile Assistant endpoints
router.post('/extract-skills', authenticate, extractSkillsFromCV);
router.post('/cv-suggestions', authenticate, generateCVSuggestions);
router.post('/generate-cv', authenticate, generateCV);

export default router;
