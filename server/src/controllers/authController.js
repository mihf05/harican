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
  role: z.enum(['SEEKER', 'POSTER']).optional().default('SEEKER'),
  educationLevel: z.string().optional(),
  department: z.string().optional(),
  experienceLevel: z.enum(['Fresher', 'Junior', 'Mid', 'Senior']).optional(),
  preferredCareerTrack: z.string().optional(),
}).refine(data => data.email || data.phone, {
  message: 'Either email or phone number is required',
  path: ['email']
})

const loginSchema = z.object({
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
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

      // Normalize phone number if provided (remove spaces, dashes, + signs)
      const normalizedPhone = phone ? phone.replace(/[\s\-\+]/g, '') : undefined

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

      if (normalizedPhone) {
        const existingUser = await prisma.user.findUnique({
          where: { phone: normalizedPhone }
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
          phone: normalizedPhone,
          password: hashedPassword,
          ...userData,
        }
      })

      // Send phone OTP if phone provided
      if (normalizedPhone) {
        try {
          const otp = authService.generateOTP()
          
          await prisma.verification.create({
            data: {
              identifier: normalizedPhone,
              value: otp,
              expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
              userId: user.id,
            }
          })

          await bulkSMSBDService.sendOTP(normalizedPhone, otp)
        } catch (smsError) {
          console.error('SMS sending error:', smsError)
        }
      }

      // Generate token
      const token = authService.generateToken(user.id)

      // Return user data (without password)
      const { password: _, ...userResponse } = user

      // Set token in HTTP-only cookie
      // For cross-origin requests (localhost to production), we need sameSite: 'none' with secure: true
      const isProduction = process.env.NODE_ENV === 'production'
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: true, // Always true for cross-origin cookies
        sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-origin
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          user: userResponse,
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

      // Normalize phone number if provided
      const normalizedPhone = phone ? phone.replace(/[\s\-\+]/g, '') : undefined

      // Find user
      const whereClause = email ? { email } : { phone: normalizedPhone }
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

      // Set token in HTTP-only cookie
      // For cross-origin requests (localhost to production), we need sameSite: 'none' with secure: true
      const isProduction = process.env.NODE_ENV === 'production'
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: true, // Always true for cross-origin cookies
        sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-origin
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
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

      // Normalize phone number (remove spaces, dashes, + signs)
      const normalizedPhone = phone.replace(/[\s\-\+]/g, '')

      // Find verification record - try both original and normalized phone
      const verification = await prisma.verification.findFirst({
        where: {
          OR: [
            { identifier: phone },
            { identifier: normalizedPhone }
          ],
          value: otp,
          expiresAt: {
            gt: new Date()
          }
        }
      })
      
      if (!verification) {
        // Check if OTP exists but is expired
        const expiredOTP = await prisma.verification.findFirst({
          where: {
            OR: [
              { identifier: phone },
              { identifier: normalizedPhone }
            ],
            value: otp
          }
        })
        
        if (expiredOTP) {
          return res.status(400).json({
            success: false,
            message: 'OTP has expired. Please request a new one.'
          })
        }
        
        console.log('Invalid OTP - no match found')
        return res.status(400).json({
          success: false,
          message: 'Invalid OTP'
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
  },

  // Logout user
  async logout(req, res) {
    try {
      // Clear the auth cookie
      res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })

      res.json({
        success: true,
        message: 'Logged out successfully'
      })
    } catch (error) {
      console.error('Logout error:', error)
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      })
    }
  }
}
