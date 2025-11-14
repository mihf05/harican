import { prisma } from '../lib/prisma.js';

// Initialize Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAF7NQxhs9F7YEOtqa0GmV9VJw5-wJLUgU';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Helper function to call Gemini API
async function callGeminiAPI(prompt) {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Gemini API request failed');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

/**
 * Generate AI-powered career roadmap
 */
export const generateRoadmap = async (req, res) => {
  try {
    const { targetRole, timeframe, learningTime } = req.body;

    if (!targetRole || !timeframe) {
      return res.status(400).json({
        success: false,
        message: 'Target role and timeframe are required'
      });
    }

    // Get user with skills
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { skills: true }
    });

    const currentSkills = user.skills.map(s => s.skillName);
    const experienceLevel = user.experienceLevel || 'Fresher';

    // Generate roadmap with AI
    const prompt = `You are an expert career counselor and technical mentor. Generate a detailed, personalized career roadmap.

USER PROFILE:
- Name: ${user.fullName}
- Current Skills: ${currentSkills.join(', ') || 'None specified'}
- Experience Level: ${experienceLevel}
- Target Role: ${targetRole}
- Timeframe: ${timeframe} months
- Learning Time Available: ${learningTime || '10-15 hours/week'}

TASK: Create a comprehensive, step-by-step career roadmap in JSON format:

{
  "overview": {
    "title": "Career Roadmap: ${targetRole}",
    "duration": "${timeframe} months",
    "targetRole": "${targetRole}",
    "currentLevel": "${experienceLevel}",
    "summary": "2-3 sentence overview of the journey"
  },
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Phase Name (e.g., Foundation Building)",
      "duration": "Months 1-2",
      "description": "What this phase focuses on",
      "topics": [
        {
          "name": "Topic Name",
          "skills": ["skill1", "skill2"],
          "resources": ["resource suggestion 1", "resource suggestion 2"],
          "estimatedHours": 20
        }
      ],
      "projects": [
        {
          "name": "Project Name",
          "description": "What to build and why",
          "skills": ["skills practiced"],
          "complexity": "beginner/intermediate/advanced"
        }
      ],
      "milestones": ["Milestone 1", "Milestone 2"]
    }
  ],
  "jobApplicationTimeline": {
    "startApplying": "Month X",
    "reason": "Why this timing",
    "preparationSteps": ["step1", "step2"]
  },
  "recommendations": {
    "dailyRoutine": "Suggested learning schedule",
    "skillPriority": ["Most important skills in order"],
    "portfolioTips": ["Tip 1", "Tip 2"],
    "networkingAdvice": ["Advice 1", "Advice 2"]
  }
}

GUIDELINES:
1. Break down into ${Math.ceil(timeframe / 2)} phases
2. Each phase should have 3-5 topics with specific skills
3. Include 2-3 practical projects per phase
4. Progress from beginner to more advanced concepts
5. Consider current skills to avoid redundancy
6. Make it achievable within the timeframe
7. Include realistic time estimates
8. Provide specific, actionable advice
9. Suggest when to start applying for jobs/internships

Return ONLY valid JSON, no additional text.`;

    const aiResponse = await callGeminiAPI(prompt);

    // Parse JSON response
    let roadmapData;
    try {
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || aiResponse.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiResponse;
      roadmapData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return res.status(500).json({
        success: false,
        message: 'Failed to parse AI response',
        rawResponse: aiResponse
      });
    }

    // Save roadmap to database
    const savedRoadmap = await prisma.careerRoadmap.create({
      data: {
        userId: user.id,
        targetRole,
        timeframe: parseInt(timeframe),
        learningTime: learningTime || '10-15 hours/week',
        currentSkills,
        roadmapData,
        status: 'active'
      }
    });

    res.json({
      success: true,
      data: {
        id: savedRoadmap.id,
        roadmap: roadmapData,
        createdAt: savedRoadmap.createdAt
      },
      message: 'Career roadmap generated successfully'
    });

  } catch (error) {
    console.error('Roadmap generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate roadmap',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get user's saved roadmaps
 */
export const getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await prisma.careerRoadmap.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: roadmaps
    });
  } catch (error) {
    console.error('Get roadmaps error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roadmaps'
    });
  }
};

/**
 * Get specific roadmap by ID
 */
export const getRoadmapById = async (req, res) => {
  try {
    const { id } = req.params;

    const roadmap = await prisma.careerRoadmap.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found'
      });
    }

    res.json({
      success: true,
      data: roadmap
    });
  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roadmap'
    });
  }
};

/**
 * Delete roadmap
 */
export const deleteRoadmap = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.careerRoadmap.deleteMany({
      where: {
        id,
        userId: req.user.id
      }
    });

    res.json({
      success: true,
      message: 'Roadmap deleted successfully'
    });
  } catch (error) {
    console.error('Delete roadmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete roadmap'
    });
  }
};
