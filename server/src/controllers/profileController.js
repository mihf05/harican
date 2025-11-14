import { prisma } from '../lib/prisma.js'
import { z } from 'zod'

// Validation schemas
const updateProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').optional(),
  educationLevel: z.string().optional(),
  department: z.string().optional(),
  experienceLevel: z.enum(['Fresher', 'Junior', 'Mid', 'Senior']).optional(),
  preferredCareerTrack: z.string().optional(),
  cvText: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  profileImage: z.string().url().optional().or(z.literal('')).nullable(),
})

const skillSchema = z.object({
  skillName: z.string().min(1, 'Skill name is required'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
})

const addSkillsSchema = z.object({
  skills: z.array(skillSchema).min(1, 'At least one skill is required'),
})

export const profileController = {
  // Get user profile
  async getProfile(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          skills: {
            orderBy: { createdAt: 'desc' },
          },
        },
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        })
      }

      // Remove sensitive data
      const { sessions, accounts, verifications, ...userProfile } = user

      res.json({
        success: true,
        data: userProfile,
      })
    } catch (error) {
      console.error('Get profile error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get profile',
      })
    }
  },

  // Update user profile
  async updateProfile(req, res) {
    try {
      const validation = updateProfileSchema.safeParse(req.body)
      
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input data',
          errors: validation.error.errors,
        })
      }

      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          ...validation.data,
          updatedAt: new Date(),
        },
        include: {
          skills: true,
        },
      })

      // Remove sensitive data
      const { sessions, accounts, verifications, ...userProfile } = updatedUser

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: userProfile,
      })
    } catch (error) {
      console.error('Update profile error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
      })
    }
  },

  // Get user skills
  async getSkills(req, res) {
    try {
      const skills = await prisma.userSkill.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
      })

      res.json({
        success: true,
        data: skills,
      })
    } catch (error) {
      console.error('Get skills error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get skills',
      })
    }
  },

  // Add skills
  async addSkills(req, res) {
    try {
      const validation = addSkillsSchema.safeParse(req.body)
      
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input data',
          errors: validation.error.errors,
        })
      }

      const { skills } = validation.data

      // Use upsert to add or update skills
      const upsertPromises = skills.map(skill =>
        prisma.userSkill.upsert({
          where: {
            userId_skillName: {
              userId: req.user.id,
              skillName: skill.skillName,
            },
          },
          update: {
            level: skill.level,
          },
          create: {
            userId: req.user.id,
            skillName: skill.skillName,
            level: skill.level,
          },
        })
      )

      const addedSkills = await Promise.all(upsertPromises)

      res.json({
        success: true,
        message: 'Skills added successfully',
        data: addedSkills,
      })
    } catch (error) {
      console.error('Add skills error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to add skills',
      })
    }
  },

  // Remove skill
  async removeSkill(req, res) {
    try {
      const { skillId } = req.params

      const skill = await prisma.userSkill.findUnique({
        where: { id: skillId },
      })

      if (!skill) {
        return res.status(404).json({
          success: false,
          message: 'Skill not found',
        })
      }

      if (skill.userId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to remove this skill',
        })
      }

      await prisma.userSkill.delete({
        where: { id: skillId },
      })

      res.json({
        success: true,
        message: 'Skill removed successfully',
      })
    } catch (error) {
      console.error('Remove skill error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to remove skill',
      })
    }
  },

  // Update user role (admin only)
  async updateUserRole(req, res) {
    try {
      const { userId, role } = req.body

      if (!['USER', 'ADMIN', 'EMPLOYER'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role',
        })
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role },
      })

      res.json({
        success: true,
        message: 'User role updated successfully',
        data: { id: updatedUser.id, role: updatedUser.role },
      })
    } catch (error) {
      console.error('Update role error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to update user role',
      })
    }
  },

  // Get all users (admin only)
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 20, role, search } = req.query
      const skip = (page - 1) * limit

      const where = {}
      if (role) where.role = role
      if (search) {
        where.OR = [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ]
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: parseInt(limit),
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
            lastLoginAt: true,
            createdAt: true,
          },
        }),
        prisma.user.count({ where }),
      ])

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit),
          },
        },
      })
    } catch (error) {
      console.error('Get users error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get users',
      })
    }
  },
}
