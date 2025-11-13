import express from 'express';
import { resourceController } from '../controllers/resourceController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', resourceController.getAllResources);
router.get('/:id', resourceController.getResourceById);

// Protected routes (require authentication)
router.get('/recommended/me', authenticate, resourceController.getRecommendedResources);

// Admin only routes
router.post('/', authenticate, authorize(['ADMIN']), resourceController.createResource);
router.put('/:id', authenticate, authorize(['ADMIN']), resourceController.updateResource);
router.delete('/:id', authenticate, authorize(['ADMIN']), resourceController.deleteResource);

export default router;
