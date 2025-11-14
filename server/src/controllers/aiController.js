import { prisma } from '../lib/prisma.js';

// Initialize Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAF7NQxhs9F7YEOtqa0GmV9VJw5-wJLUgU';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Helper function to call Gemini API
async function callGeminiAPI(messages) {
  const prompt = messages.map(msg => {
    if (msg.role === 'system') return `System Instructions: ${msg.content}`;
    if (msg.role === 'user') return `User: ${msg.content}`;
    if (msg.role === 'assistant') return `Assistant: ${msg.content}`;
    return msg.content;
  }).join('\n\n');

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
 * Send a chat message to AI and get response
 */
export const sendChatMessage = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Check if user is a job seeker
    if (req.user.role !== 'SEEKER') {
      return res.status(403).json({
        success: false,
        message: 'AI Assistant is only available for job seekers'
      });
    }

    // Fetch user's complete profile with skills
    const userProfile = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        skills: {
          select: {
            skillName: true,
            level: true
          }
        }
      }
    });

    // Build user context for AI
    const userContext = {
      name: userProfile.fullName,
      email: userProfile.email,
      phone: userProfile.phone,
      educationLevel: userProfile.educationLevel,
      department: userProfile.department,
      experienceLevel: userProfile.experienceLevel,
      preferredCareerTrack: userProfile.preferredCareerTrack,
      skills: userProfile.skills.map(s => `${s.skillName} (${s.level || 'Not specified'})`).join(', '),
      bio: userProfile.bio,
      cvText: userProfile.cvText
    };

    // Create system prompt with user context
    const systemPrompt = `You are CareerBot, an AI mentor assistant for Harican - a platform dedicated to promoting decent work and economic growth (UN SDG 8) for youth in Bangladesh. You are currently helping ${userContext.name}, a job seeker.

USER PROFILE:
- Name: ${userContext.name}
- Education Level: ${userContext.educationLevel || 'Not specified'}
- Department/Field: ${userContext.department || 'Not specified'}
- Experience Level: ${userContext.experienceLevel || 'Not specified'}
- Preferred Career Track: ${userContext.preferredCareerTrack || 'Not specified'}
- Skills: ${userContext.skills || 'No skills added yet'}
- Bio: ${userContext.bio || 'No bio provided'}
${userContext.cvText ? `- CV/Resume Content: ${userContext.cvText.substring(0, 1000)}${userContext.cvText.length > 1000 ? '...' : ''}` : ''}

IMPORTANT DISCLAIMERS:
⚠️ All suggestions and advice are recommendations only and do not guarantee specific outcomes.
⚠️ Job market conditions vary, and success depends on multiple factors beyond our control.
⚠️ You should verify all information and make informed decisions based on your unique situation.

YOUR MISSION (SDG 8 - Decent Work and Economic Growth):
- Promote full and productive employment for youth
- Support skill development and employability
- Encourage entrepreneurship and economic participation
- Advocate for equal opportunities regardless of gender, background, or disability
- Focus on sustainable and decent work opportunities

INSTRUCTIONS:
1. Use the user's profile information to provide personalized career advice
2. Recommend jobs that match their skills, experience level, and preferred career track
3. Suggest relevant skills they should learn based on their career goals
4. Provide specific, actionable advice for their situation
5. If they ask about their profile, refer to the information above
6. Help with resume/CV improvements based on their current CV content
7. Be encouraging and supportive in your responses
8. Focus on youth employment and career development opportunities

Provide guidance on career development, job searching, resume writing, interview preparation, and professional growth.`;

    // Build messages array with conversation history
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Optionally fetch available jobs that match user's profile
    let jobContext = '';
    if (message.toLowerCase().includes('job') || message.toLowerCase().includes('opportunity') || message.toLowerCase().includes('position')) {
      const matchingJobs = await prisma.job.findMany({
        where: {
          isActive: true,
          OR: [
            { experienceLevel: userProfile.experienceLevel },
            { skills: { hasSome: userProfile.skills.map(s => s.skillName) } }
          ]
        },
        take: 5,
        select: {
          id: true,
          title: true,
          company: true,
          location: true,
          jobType: true,
          experienceLevel: true,
          skills: true,
          salary: true
        }
      });

      if (matchingJobs.length > 0) {
        jobContext = `\n\nAVAILABLE MATCHING JOBS ON PLATFORM:\n${matchingJobs.map((job, idx) => 
          `${idx + 1}. ${job.title} at ${job.company}
   - Location: ${job.location}
   - Type: ${job.jobType}
   - Experience: ${job.experienceLevel}
   - Skills Required: ${job.skills.join(', ')}
   ${job.salary ? `- Salary: ${job.salary}` : ''}`
        ).join('\n\n')}
        
You can mention these specific opportunities to the user if relevant to their query.`;
        
        messages[0].content += jobContext;
      }
    }

    
    const aiResponse = await callGeminiAPI(messages);

    res.json({
      success: true,
      data: {
        response: aiResponse,
        model: 'gemini-2.0-flash',
        jobsFound: jobContext ? true : false
      }
    });

  } catch (error) {
    console.error('❌ AI Chat Error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      response: error.response?.data
    });
    
    // More detailed error message
    let errorMessage = 'Failed to get AI response';
    let statusCode = 500;
    
    if (error.message?.includes('API key') || error.message?.includes('Unauthorized') || error.message?.includes('401')) {
      errorMessage = 'AI service authentication failed. Please check API key configuration.';
      statusCode = 503;
      console.error('💡 Hint: Check that GEMINI_API_KEY environment variable is set correctly');
    } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
      errorMessage = 'AI service quota exceeded. Please check your Gemini API quota.';
      statusCode = 503;
      console.error('💡 Hint: Check your API quota at https://console.cloud.google.com/');
    } else if (error.message?.includes('rate limit')) {
      errorMessage = 'AI service rate limit exceeded. Please try again in a moment.';
      statusCode = 429;
    } else if (error.response) {
      errorMessage = `AI service error: ${error.response.data?.error?.message || error.message}`;
    } else if (error.message) {
      errorMessage = `AI service error: ${error.message}`;
    }
    
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      details: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        response: error.response?.data
      } : undefined
    });
  }
};

/**
 * Generate CV improvement suggestions based on user profile
 */
export const generateCVSuggestions = async (req, res) => {
  try {
    const userProfile = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        skills: {
          select: {
            skillName: true,
            level: true
          }
        }
      }
    });

    if (!userProfile.cvText || userProfile.cvText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Please upload or add CV content to your profile first.'
      });
    }

    const suggestionPrompt = `You are an expert career counselor and resume consultant. Analyze this CV and provide specific, actionable improvement suggestions.

USER PROFILE:
- Name: ${userProfile.fullName}
- Education: ${userProfile.educationLevel || 'Not specified'}
- Department: ${userProfile.department || 'Not specified'}
- Experience Level: ${userProfile.experienceLevel || 'Not specified'}
- Career Track: ${userProfile.preferredCareerTrack || 'Not specified'}
- Current Skills: ${userProfile.skills.map(s => s.skillName).join(', ') || 'None listed'}

CURRENT CV/RESUME:
${userProfile.cvText}

TASK: Provide detailed CV improvement suggestions in the following JSON format:

{
  "professionalSummary": "A strong 2-3 sentence professional summary tailored to their goals",
  "strongBulletPoints": [
    "Example: Led team of 5 developers to deliver project 2 weeks ahead of schedule, increasing efficiency by 30%",
    "Example: Developed automated testing framework reducing bug detection time by 50%"
  ],
  "skillsToHighlight": ["skill1", "skill2", "skill3"],
  "missingKeywords": ["keyword1", "keyword2"],
  "formatSuggestions": [
    "Use action verbs like 'Led', 'Developed', 'Implemented'",
    "Quantify achievements with numbers and percentages"
  ],
  "linkedinTips": [
    "Add a professional headline",
    "Request recommendations from colleagues"
  ],
  "portfolioSuggestions": [
    "Create a GitHub profile showcasing your projects",
    "Build a personal website with case studies"
  ],
  "overallScore": 7.5,
  "strengths": ["strength1", "strength2"],
  "areasForImprovement": ["area1", "area2"]
}

Focus on practical, youth-friendly advice aligned with SDG 8 goals. Return ONLY valid JSON.`;

    const aiResponse = await callGeminiAPI([
      {
        role: 'user',
        content: suggestionPrompt
      }
    ]);

    // Parse JSON response
    let suggestions;
    try {
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || aiResponse.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiResponse;
      suggestions = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return res.status(500).json({
        success: false,
        message: 'Failed to parse AI response',
        rawResponse: aiResponse
      });
    }

    res.json({
      success: true,
      data: suggestions
    });

  } catch (error) {
    console.error('CV Suggestions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate CV suggestions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Generate a formatted CV/Resume based on user profile
 */
export const generateCV = async (req, res) => {
  try {
    const { template = 'professional' } = req.body;

    const userProfile = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        skills: {
          select: {
            skillName: true,
            level: true
          }
        }
      }
    });

    // Build CV data structure
    const cvData = {
      personalInfo: {
        name: userProfile.fullName,
        email: userProfile.email,
        phone: userProfile.phone,
        bio: userProfile.bio || '',
        profileImage: userProfile.profileImage
      },
      education: {
        level: userProfile.educationLevel,
        department: userProfile.department
      },
      experience: {
        level: userProfile.experienceLevel,
        cvText: userProfile.cvText || ''
      },
      skills: userProfile.skills.map(s => ({
        name: s.skillName,
        level: s.level
      })),
      careerGoals: {
        preferredTrack: userProfile.preferredCareerTrack
      }
    };

    // Generate professional summary using AI if not exists
    let professionalSummary = '';
    if (!userProfile.bio || userProfile.bio.length < 50) {
      const summaryPrompt = `Generate a professional 2-3 sentence summary for a CV based on this profile:
      
Name: ${userProfile.fullName}
Education: ${userProfile.educationLevel} in ${userProfile.department}
Experience Level: ${userProfile.experienceLevel}
Career Goal: ${userProfile.preferredCareerTrack}
Skills: ${userProfile.skills.map(s => s.skillName).join(', ')}

Make it compelling and youth-focused. Return only the summary text, no additional formatting.`;

      professionalSummary = await callGeminiAPI([
        {
          role: 'user',
          content: summaryPrompt
        }
      ]);
    } else {
      professionalSummary = userProfile.bio;
    }

    cvData.professionalSummary = professionalSummary.trim();

    // Return CV data that can be rendered on frontend
    res.json({
      success: true,
      data: {
        cvData,
        template,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('CV Generation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate CV',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Extract skills, technologies, and roles from CV text using AI
 */
export const extractSkillsFromCV = async (req, res) => {
  try {
    // Get CV text from request body or user's profile
    let { cvText } = req.body;

    // If no CV text provided in request, fetch from user's profile
    if (!cvText || cvText.trim().length < 50) {
      const userProfile = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { cvText: true }
      });

      cvText = userProfile?.cvText;

      if (!cvText || cvText.trim().length < 50) {
        return res.status(400).json({
          success: false,
          message: 'No CV text found. Please update your profile with CV/resume content first.'
        });
      }
    }

    // Create prompt for skill extraction
    const extractionPrompt = `You are an expert HR analyst and career counselor. Analyze the following CV/Resume and extract structured information.

CV/RESUME TEXT:
${cvText}

TASK: Extract and categorize the following information in JSON format:

{
  "skills": [
    {"name": "skill_name", "category": "technical/soft/language", "proficiency": "beginner/intermediate/advanced/expert"}
  ],
  "technologies": [
    {"name": "technology_name", "type": "programming_language/framework/tool/database/platform"}
  ],
  "roles": [
    {"title": "role_title", "relevance": "high/medium/low"}
  ],
  "experience_level": "fresher/junior/mid/senior",
  "domains": ["domain1", "domain2"],
  "summary": "brief 2-3 sentence professional summary"
}

INSTRUCTIONS:
1. Extract ALL technical skills (programming languages, frameworks, tools, technologies)
2. Include soft skills (communication, leadership, etc.)
3. List languages (English, Bengali, etc.)
4. Identify job titles/roles the person is qualified for
5. Determine experience level based on work history
6. Identify industry domains (e.g., web development, data science, fintech)
7. Be specific and accurate - only extract what's explicitly mentioned or strongly implied
8. Return ONLY valid JSON, no additional text

Return the JSON now:`;

    const aiResponse = await callGeminiAPI([
      {
        role: 'user',
        content: extractionPrompt
      }
    ]);

    // Parse JSON response
    let extractedData;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || aiResponse.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiResponse;
      extractedData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return res.status(500).json({
        success: false,
        message: 'Failed to parse AI response',
        rawResponse: aiResponse
      });
    }

    // Validate extracted data
    if (!extractedData.skills || !Array.isArray(extractedData.skills)) {
      extractedData.skills = [];
    }
    if (!extractedData.technologies || !Array.isArray(extractedData.technologies)) {
      extractedData.technologies = [];
    }
    if (!extractedData.roles || !Array.isArray(extractedData.roles)) {
      extractedData.roles = [];
    }

    res.json({
      success: true,
      data: {
        ...extractedData,
        totalSkillsFound: extractedData.skills.length + extractedData.technologies.length,
        extraction_method: 'AI-powered (Google Gemini)',
        transparent_process: 'AI analyzed CV text and identified skills, technologies, and roles based on industry standards'
      }
    });

  } catch (error) {
    console.error('Skill Extraction Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to extract skills from CV',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
