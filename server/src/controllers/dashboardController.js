import { prisma } from '../lib/prisma.js';

export const dashboardController = {
  // Get dashboard data for current user
  async getDashboard(req, res) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      // Get user with skills
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

      // Common data for all users
      let dashboardData = {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          educationLevel: user.educationLevel,
          department: user.department,
          experienceLevel: user.experienceLevel,
          preferredCareerTrack: user.preferredCareerTrack,
          skills: user.skills
        }
      };

      // Role-specific data
      if (userRole === 'SEEKER') {
        // Get recommended jobs
        const allJobs = await prisma.job.findMany({
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          take: 50
        });

        const jobsWithScore = allJobs.map(job => {
          let score = 0;
          const matchedSkills = [];

          job.skills.forEach(jobSkill => {
            if (userSkills.some(userSkill => 
              userSkill.toLowerCase() === jobSkill.toLowerCase()
            )) {
              score += 10;
              matchedSkills.push(jobSkill);
            }
          });

          if (user.preferredCareerTrack) {
            const trackLower = user.preferredCareerTrack.toLowerCase();
            if (job.title.toLowerCase().includes(trackLower) || 
                (job.description && job.description.toLowerCase().includes(trackLower))) {
              score += 5;
            }
          }

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

        const recommendedJobs = jobsWithScore
          .filter(job => job.matchScore > 0)
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 5);

        // Get recommended resources
        const allResources = await prisma.learningResource.findMany({
          where: { isActive: true },
          orderBy: { rating: 'desc' },
          take: 50
        });

        const resourcesWithScore = allResources.map(resource => {
          let score = 0;
          const matchedSkills = [];

          resource.skills.forEach(resourceSkill => {
            if (userSkills.some(userSkill => 
              userSkill.toLowerCase() === resourceSkill.toLowerCase()
            )) {
              score += 10;
              matchedSkills.push(resourceSkill);
            }
          });

          if (resource.costType === 'Free') {
            score += 2;
          }

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

        const recommendedResources = resourcesWithScore
          .filter(resource => resource.matchScore > 0)
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 5);

        // Get job statistics
        const totalJobs = await prisma.job.count({ where: { isActive: true } });
        const remoteJobs = await prisma.job.count({ 
          where: { isActive: true, isRemote: true } 
        });

        dashboardData.recommendedJobs = recommendedJobs;
        dashboardData.recommendedResources = recommendedResources;
        dashboardData.stats = {
          totalJobs,
          remoteJobs,
          matchedJobs: recommendedJobs.length,
          totalSkills: userSkills.length
        };

      } else if (userRole === 'POSTER') {
        // Get jobs posted by this user
        const postedJobs = await prisma.job.findMany({
          where: { postedById: userId },
          orderBy: { createdAt: 'desc' },
          take: 10
        });

        const activeJobsCount = await prisma.job.count({
          where: { postedById: userId, isActive: true }
        });

        const totalJobsCount = await prisma.job.count({
          where: { postedById: userId }
        });

        dashboardData.postedJobs = postedJobs;
        dashboardData.stats = {
          totalPosted: totalJobsCount,
          activeJobs: activeJobsCount,
          inactiveJobs: totalJobsCount - activeJobsCount
        };

      } else if (userRole === 'ADMIN') {
        // Get overall statistics
        const totalUsers = await prisma.user.count();
        const totalSeekers = await prisma.user.count({ where: { role: 'SEEKER' } });
        const totalPosters = await prisma.user.count({ where: { role: 'POSTER' } });
        const totalJobs = await prisma.job.count();
        const activeJobs = await prisma.job.count({ where: { isActive: true } });
        const totalResources = await prisma.learningResource.count();

        // Get recent jobs
        const recentJobs = await prisma.job.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            postedBy: {
              select: {
                fullName: true,
                email: true
              }
            }
          }
        });

        // Get recent users
        const recentUsers = await prisma.user.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            createdAt: true
          }
        });

        dashboardData.stats = {
          totalUsers,
          totalSeekers,
          totalPosters,
          totalJobs,
          activeJobs,
          totalResources
        };
        dashboardData.recentJobs = recentJobs;
        dashboardData.recentUsers = recentUsers;
      }

      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      console.error('Get dashboard error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard data',
        error: error.message
      });
    }
  }
};
