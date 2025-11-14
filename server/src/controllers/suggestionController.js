import { prisma } from '../lib/prisma.js';
import { calculateJobMatch } from '../services/jobMatchingService.js';

/**
 * Get AI-powered skill gap analysis and learning suggestions for dashboard
 */
export const getDashboardSuggestions = async (req, res) => {
  try {
    // Get user with skills
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { skills: true }
    });

    if (!user || user.role !== 'SEEKER') {
      return res.status(403).json({
        success: false,
        message: 'This feature is only available for job seekers'
      });
    }

    // Get all active jobs
    const allJobs = await prisma.job.findMany({
      where: { isActive: true },
      take: 50,
      orderBy: { createdAt: 'desc' }
    });

    // Calculate matches for all jobs
    const jobMatches = allJobs.map(job => ({
      job,
      match: calculateJobMatch(job, user)
    }));

    // Filter jobs with partial matches (30-79%)
    const partialMatches = jobMatches.filter(
      jm => jm.match.matchPercentage >= 30 && jm.match.matchPercentage < 80
    );

    // Aggregate all missing skills
    const skillGaps = new Map();
    const jobsByMissingSkill = new Map();

    partialMatches.forEach(({ job, match }) => {
      match.missingSkills.forEach(skill => {
        const skillLower = skill.toLowerCase();
        if (!skillGaps.has(skillLower)) {
          skillGaps.set(skillLower, {
            skillName: skill,
            frequency: 0,
            jobTitles: [],
            averageMatchIncrease: 0
          });
          jobsByMissingSkill.set(skillLower, []);
        }
        
        const gap = skillGaps.get(skillLower);
        gap.frequency += 1;
        if (gap.jobTitles.length < 3) {
          gap.jobTitles.push(job.title);
        }
        
        jobsByMissingSkill.get(skillLower).push({
          title: job.title,
          company: job.company,
          currentMatch: match.matchPercentage
        });
      });
    });

    // Convert to array and sort by frequency
    const prioritizedSkills = Array.from(skillGaps.values())
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    // Get learning resources for top missing skills
    const topSkills = prioritizedSkills.slice(0, 5).map(s => s.skillName.toLowerCase());
    
    const learningResources = await prisma.learningResource.findMany({
      where: {
        isActive: true,
        skills: {
          hasSome: topSkills
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    // Match resources to skills
    const skillsWithResources = prioritizedSkills.map(skill => {
      const matchedResources = learningResources.filter(resource =>
        resource.skills.some(s => 
          s.toLowerCase().includes(skill.skillName.toLowerCase()) ||
          skill.skillName.toLowerCase().includes(s.toLowerCase())
        )
      ).slice(0, 3);

      return {
        ...skill,
        learningResources: matchedResources,
        potentialJobs: jobsByMissingSkill.get(skill.skillName.toLowerCase())?.slice(0, 3) || []
      };
    });

    // Get quick wins (jobs close to good match)
    const quickWins = jobMatches
      .filter(jm => jm.match.matchPercentage >= 65 && jm.match.matchPercentage < 80)
      .sort((a, b) => b.match.matchPercentage - a.match.matchPercentage)
      .slice(0, 5)
      .map(({ job, match }) => ({
        job: {
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          jobType: job.jobType
        },
        matchPercentage: match.matchPercentage,
        missingSkills: match.missingSkills,
        matchedSkills: match.matchedSkills
      }));

    // Career advancement suggestions
    const careerSuggestions = [];
    
    if (user.experienceLevel === 'Fresher' || user.experienceLevel === 'Junior') {
      careerSuggestions.push({
        type: 'experience',
        title: 'Build Your Portfolio',
        description: 'Create 2-3 projects showcasing your skills to stand out to employers',
        priority: 'high'
      });
    }

    if (user.skills.length < 5) {
      careerSuggestions.push({
        type: 'skills',
        title: 'Expand Your Skillset',
        description: 'Add more skills to your profile to match with more opportunities',
        priority: 'high'
      });
    }

    if (!user.cvText || user.cvText.length < 200) {
      careerSuggestions.push({
        type: 'profile',
        title: 'Complete Your Profile',
        description: 'Add detailed CV content to get better job matches and AI recommendations',
        priority: 'medium'
      });
    }

    res.json({
      success: true,
      data: {
        skillGapAnalysis: {
          totalGaps: skillGaps.size,
          prioritizedSkills: skillsWithResources,
          summary: `We found ${skillGaps.size} skills that could help you access ${partialMatches.length} more job opportunities`
        },
        quickWins: {
          jobs: quickWins,
          summary: `${quickWins.length} jobs where learning 1-2 skills could significantly improve your match`
        },
        careerSuggestions,
        learningResourcesCount: learningResources.length,
        analysisDate: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Dashboard suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate suggestions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
