import express from 'express'
import { profileController } from '../controllers/profileController.js'
import { authenticateUser, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// All profile routes require authentication
router.use(authenticateUser)

// User profile routes
router.get('/', profileController.getProfile)
router.put('/', profileController.updateProfile)

// Skills routes
router.get('/skills', profileController.getSkills)
router.post('/skills', profileController.addSkills)
router.delete('/skills/:skillId', profileController.removeSkill)

// Admin only routes
router.put('/role', requireAdmin, profileController.updateUserRole)
router.get('/users', requireAdmin, profileController.getAllUsers)

export default router
