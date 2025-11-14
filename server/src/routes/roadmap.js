import express from 'express';
import { generateRoadmap, getRoadmaps, getRoadmapById, deleteRoadmap } from '../controllers/roadmapController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', authenticate, generateRoadmap);
router.get('/', authenticate, getRoadmaps);
router.get('/:id', authenticate, getRoadmapById);
router.delete('/:id', authenticate, deleteRoadmap);

export default router;
