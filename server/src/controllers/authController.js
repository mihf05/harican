import { authService } from '../auth.js'
import { prisma } from '../lib/prisma.js'
import { bulkSMSBDService } from '../services/bulkSMSBD.js'
import { z } from 'zod'

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email').optional(),
  phone: z.string().min(10, 'Invalid phone number').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(1, 'Full name is required'),
  educationLevel: z.string().optional(),
  department: z.string().optional(),
  experienceLevel: z.enum(['Fresher', 'Junior', 'Mid', 'Senior']).optional(),
  preferredCareerTrack: z.string().optional(),
}).refine(data => data.email || data.phone, {
  message: 'Either email or phone number is required',
  path: ['email']
})

const loginSchema = z.object({
  email: z.string().email('Invalid email').optional(),
  phone: z.string().optional(),
  password: z.string().min(1, 'Password is required'),
}).refine(data => data.email || data.phone, {
  message: 'Either email or phone number is required',
  path: ['email']
})

const verifyPhoneSchema = z.object({
  phone: z.string().min(10, 'Invalid phone number'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

export const authController = {
  // Register new user
  async register(req, res) {
    try {
      const validation = registerSchema.safeParse(req.body)
      
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input data',
          errors: validation.error.errors,
        })
      }

      const { email, phone, password, ...userData } = validation.data

      // Check if user already exists
      if (email) {
        const existingUser = await prisma.user.findUnique({
          where: { email }
        })
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'User with this email already exists'
          })
        }
      }

      if (phone) {
        const existingUser = await prisma.user.findUnique({
          where: { phone }
        })
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'User with this phone number already exists'
          })
        }
      }

      // Hash password
      const hashedPassword = await authService.hashPassword(password)

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          phone,
          password: hashedPassword,
          ...userData,
        }
      })

      // Send phone OTP if phone provided
      if (phone) {
        try {
          const otp = authService.generateOTP()
          
          await prisma.verification.create({
            data: {
              identifier: phone,
              value: otp,
              expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
              userId: user.id,
            }
          })

          await bulkSMSBDService.sendOTP(phone, otp)
        } catch (smsError) {
          console.error('SMS sending error:', smsError)
        }
      }

      // Generate token
      const token = authService.generateToken(user.id)

      // Return user data (without password)
      const { password: _, ...userResponse } = user

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          user: userResponse,
          token,
        }
      })

    } catch (error) {
      console.error('Registration error:', error)
      res.status(500).json({
        success: false,
        message: 'Registration failed'
      })
    }
  },

  // Login user
  async login(req, res) {
    try {
      const validation = loginSchema.safeParse(req.body)
      
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input data',
          errors: validation.error.errors,
        })
      }

      const { email, phone, password } = validation.data

      // Find user
      const whereClause = email ? { email } : { phone }
      const user = await prisma.user.findUnique({
        where: whereClause,
        include: {
          skills: true,
        }
      })

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        })
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is disabled'
        })
      }

      // Check password
      const isValidPassword = await authService.comparePassword(password, user.password)
      
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        })
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      })

      // Generate token
      const token = authService.generateToken(user.id)

      // Return user data (without password)
      const { password: _, ...userResponse } = user

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
          token,
        }
      })

    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({
        success: false,
        message: 'Login failed'
      })
    }
  },

  // Verify phone number
  async verifyPhone(req, res) {
    try {
      const validation = verifyPhoneSchema.safeParse(req.body)
      
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input data',
          errors: validation.error.errors,
        })
      }

      const { phone, otp } = validation.data

      // Find verification record
      const verification = await prisma.verification.findFirst({
        where: {
          identifier: phone,
          value: otp,
          expiresAt: {
            gt: new Date()
          }
        }
      })

      if (!verification) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP'
        })
      }

      // Update user phone verification status
      await prisma.user.update({
        where: { id: verification.userId },
        data: { phoneVerified: true }
      })

      // Delete used verification
      await prisma.verification.delete({
        where: { id: verification.id }
      })

      res.json({
        success: true,
        message: 'Phone number verified successfully'
      })

    } catch (error) {
      console.error('Phone verification error:', error)
      res.status(500).json({
        success: false,
        message: 'Phone verification failed'
      })
    }
  },

  // Resend phone OTP
  async resendPhoneOTP(req, res) {
    try {
      const { phone } = req.body

      if (!phone) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is required'
        })
      }

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { phone }
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      if (user.phoneVerified) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is already verified'
        })
      }

      // Delete old OTPs
      await prisma.verification.deleteMany({
        where: {
          identifier: phone,
          userId: user.id
        }
      })

      // Generate new OTP
      const otp = authService.generateOTP()
      
      await prisma.verification.create({
        data: {
          identifier: phone,
          value: otp,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
          userId: user.id,
        }
      })

      // Send SMS
      const smsResult = await bulkSMSBDService.sendOTP(phone, otp)
      
      if (!smsResult.success) {
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP'
        })
      }

      res.json({
        success: true,
        message: 'OTP sent successfully'
      })

    } catch (error) {
      console.error('Resend OTP error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to resend OTP'
      })
    }
  },

  // Get current user
  async getMe(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          skills: true,
        }
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      // Remove password from response
      const { password: _, ...userResponse } = user

      res.json({
        success: true,
        data: userResponse
      })

    } catch (error) {
      console.error('Get user error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get user data'
      })
    }
  }
}
