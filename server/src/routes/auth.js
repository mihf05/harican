import express from 'express'
import { authController } from '../controllers/authController.js'
import { authenticateUser } from '../middleware/auth.js'

const router = express.Router()

// Authentication routes
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/verify-phone', authController.verifyPhone)
router.post('/resend-phone-otp', authController.resendPhoneOTP)

// Protected routes
router.get('/me', authenticateUser, authController.getMe)

export default router
