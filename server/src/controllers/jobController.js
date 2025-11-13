import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  isRemote: z.boolean().optional(),
  jobType: z.enum(['Internship', 'Part-time', 'Full-time', 'Freelance']),
  experienceLevel: z.enum(['Fresher', 'Junior', 'Mid', 'Senior']),
  description: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  salary: z.string().optional(),
  applicationUrl: z.string().url().optional(),
});

export const jobController = {
  // Get all jobs with filters
  async getAllJobs(req, res) {
    try {
      const { 
        jobType, 
        experienceLevel, 
        location, 
        isRemote,
        skills,
        search,
        page = 1,
        limit = 20
      } = req.query;

      const where = {
        isActive: true,
      };

      if (jobType) {
        where.jobType = jobType;
      }

      if (experienceLevel) {
        where.experienceLevel = experienceLevel;
      }

      if (location && location !== 'all') {
        where.location = {
          contains: location,
          mode: 'insensitive'
        };
      }

      if (isRemote === 'true') {
        where.isRemote = true;
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
          { company: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [jobs, total] = await Promise.all([
        prisma.job.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: parseInt(limit),
          include: {
            postedBy: {
              select: {
                id: true,
                fullName: true,
                email: true,
              }
            }
          }
        }),
        prisma.job.count({ where })
      ]);

      res.json({
        success: true,
        data: jobs,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get jobs error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch jobs',
        error: error.message
      });
    }
  },

  // Get job by ID
  async getJobById(req, res) {
    try {
      const { id } = req.params;

      const job = await prisma.job.findUnique({
        where: { id },
        include: {
          postedBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            }
          }
        }
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      res.json({
        success: true,
        data: job
      });
    } catch (error) {
      console.error('Get job error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch job',
        error: error.message
      });
    }
  },

  // Create job (POSTER or ADMIN only)
  async createJob(req, res) {
    try {
      const validation = jobSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input data',
          errors: validation.error.errors,
        });
      }

      const job = await prisma.job.create({
        data: {
          ...validation.data,
          postedById: req.user.id
        }
      });

      res.status(201).json({
        success: true,
        message: 'Job created successfully',
        data: job
      });
    } catch (error) {
      console.error('Create job error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create job',
        error: error.message
      });
    }
  },

  // Update job (POSTER/ADMIN only, own jobs only)
  async updateJob(req, res) {
    try {
      const { id } = req.params;
      const validation = jobSchema.partial().safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input data',
          errors: validation.error.errors,
        });
      }

      // Check if job exists and belongs to user (or user is admin)
      const existingJob = await prisma.job.findUnique({
        where: { id }
      });

      if (!existingJob) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      if (req.user.role !== 'ADMIN' && existingJob.postedById !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You can only update your own jobs'
        });
      }

      const job = await prisma.job.update({
        where: { id },
        data: validation.data
      });

      res.json({
        success: true,
        message: 'Job updated successfully',
        data: job
      });
    } catch (error) {
      console.error('Update job error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update job',
        error: error.message
      });
    }
  },

  // Delete job (POSTER/ADMIN only, own jobs only)
  async deleteJob(req, res) {
    try {
      const { id } = req.params;

      const existingJob = await prisma.job.findUnique({
        where: { id }
      });

      if (!existingJob) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      if (req.user.role !== 'ADMIN' && existingJob.postedById !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You can only delete your own jobs'
        });
      }

      await prisma.job.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Job deleted successfully'
      });
    } catch (error) {
      console.error('Delete job error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete job',
        error: error.message
      });
    }
  },

  // Get recommended jobs for current user
  async getRecommendedJobs(req, res) {
    try {
      const userId = req.user.id;

      // Get user's skills and preferences
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
      const preferredTrack = user.preferredCareerTrack;

      // Get all active jobs
      const allJobs = await prisma.job.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });

      // Simple matching logic: calculate match score for each job
      const jobsWithScore = allJobs.map(job => {
        let score = 0;
        const matchedSkills = [];

        // Match skills
        job.skills.forEach(jobSkill => {
          if (userSkills.some(userSkill => 
            userSkill.toLowerCase() === jobSkill.toLowerCase()
          )) {
            score += 10;
            matchedSkills.push(jobSkill);
          }
        });

        // Match career track (if title or description contains preferred track)
        if (preferredTrack) {
          const trackLower = preferredTrack.toLowerCase();
          if (job.title.toLowerCase().includes(trackLower) || 
              (job.description && job.description.toLowerCase().includes(trackLower))) {
            score += 5;
          }
        }

        // Match experience level
        if (user.experienceLevel && job.experienceLevel === user.experienceLevel) {
          score += 3;
        }

        return {
          ...job,
          matchScore: score,
          matchedSkills,
          matchReason: matchedSkills.length > 0 
            ? `Matches: ${matchedSkills.join(', ')}` 
            : 'General recommendation'
        };
      });

      // Filter jobs with score > 0 and sort by score
      const recommendedJobs = jobsWithScore
        .filter(job => job.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 10); // Top 10 recommendations

      res.json({
        success: true,
        data: recommendedJobs,
        totalMatches: recommendedJobs.length
      });
    } catch (error) {
      console.error('Get recommended jobs error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch recommended jobs',
        error: error.message
      });
    }
  }
};
