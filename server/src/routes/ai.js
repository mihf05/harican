import express from 'express';
import { sendChatMessage, extractSkillsFromCV } from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/chat', authenticate, sendChatMessage);
router.post('/extract-skills', authenticate, extractSkillsFromCV);

export default router;
