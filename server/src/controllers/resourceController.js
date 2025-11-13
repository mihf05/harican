import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().url('Valid URL is required'),
  description: z.string().optional(),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  costType: z.enum(['Free', 'Paid']),
  duration: z.string().optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  rating: z.number().min(0).max(5).optional(),
});

export const resourceController = {
  // Get all learning resources with filters
  async getAllResources(req, res) {
    try {
      const { 
        costType, 
        level, 
        platform,
        skills,
        search,
        page = 1,
        limit = 20
      } = req.query;

      const where = {
        isActive: true,
      };

      if (costType) {
        where.costType = costType;
      }

      if (level) {
        where.level = level;
      }

      if (platform) {
        where.platform = {
          contains: platform,
          mode: 'insensitive'
        };
      }

      if (skills) {
        const skillArray = skills.split(',').map(s => s.trim());
        where.skills = {
          hasSome: skillArray
        };
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { platform: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [resources, total] = await Promise.all([
        prisma.learningResource.findMany({
          where,
          orderBy: { rating: 'desc' },
          skip,
          take: parseInt(limit),
        }),
        prisma.learningResource.count({ where })
      ]);

      res.json({
        success: true,
        data: resources,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get resources error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch resources',
        error: error.message
      });
    }
  },

  // Get resource by ID
  async getResourceById(req, res) {
    try {
      const { id } = req.params;

      const resource = await prisma.learningResource.findUnique({
        where: { id }
      });

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      res.json({
        success: true,
        data: resource
      });
    } catch (error) {
      console.error('Get resource error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch resource',
        error: error.message
      });
    }
  },

  // Create resource (ADMIN only)
  async createResource(req, res) {
    try {
      const validation = resourceSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input data',
          errors: validation.error.errors,
        });
      }

      const resource = await prisma.learningResource.create({
        data: validation.data
      });

      res.status(201).json({
        success: true,
        message: 'Resource created successfully',
        data: resource
      });
    } catch (error) {
      console.error('Create resource error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create resource',
        error: error.message
      });
    }
  },

  // Update resource (ADMIN only)
  async updateResource(req, res) {
    try {
      const { id } = req.params;
      const validation = resourceSchema.partial().safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input data',
          errors: validation.error.errors,
        });
      }

      const resource = await prisma.learningResource.update({
        where: { id },
        data: validation.data
      });

      res.json({
        success: true,
        message: 'Resource updated successfully',
        data: resource
      });
    } catch (error) {
      console.error('Update resource error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update resource',
        error: error.message
      });
    }
  },

  // Delete resource (ADMIN only)
  async deleteResource(req, res) {
    try {
      const { id } = req.params;

      await prisma.learningResource.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Resource deleted successfully'
      });
    } catch (error) {
      console.error('Delete resource error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete resource',
        error: error.message
      });
    }
  },

  // Get recommended resources for current user
  async getRecommendedResources(req, res) {
    try {
      const userId = req.user.id;

      // Get user's skills
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          skills: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const userSkills = user.skills.map(s => s.skillName);

      // Get all active resources
      const allResources = await prisma.learningResource.findMany({
        where: { isActive: true },
        orderBy: { rating: 'desc' }
      });

      // Simple matching logic: calculate match score for each resource
      const resourcesWithScore = allResources.map(resource => {
        let score = 0;
        const matchedSkills = [];

        // Match skills
        resource.skills.forEach(resourceSkill => {
          if (userSkills.some(userSkill => 
            userSkill.toLowerCase() === resourceSkill.toLowerCase()
          )) {
            score += 10;
            matchedSkills.push(resourceSkill);
          }
        });

        // Boost free resources
        if (resource.costType === 'Free') {
          score += 2;
        }

        // Boost highly rated resources
        if (resource.rating && resource.rating >= 4.5) {
          score += 3;
        }

        return {
          ...resource,
          matchScore: score,
          matchedSkills,
          matchReason: matchedSkills.length > 0 
            ? `Learn: ${matchedSkills.join(', ')}` 
            : 'Recommended for skill development'
        };
      });

      // Filter resources with score > 0 and sort by score
      const recommendedResources = resourcesWithScore
        .filter(resource => resource.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 10); // Top 10 recommendations

      res.json({
        success: true,
        data: recommendedResources,
        totalMatches: recommendedResources.length
      });
    } catch (error) {
      console.error('Get recommended resources error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch recommended resources',
        error: error.message
      });
    }
  }
};
