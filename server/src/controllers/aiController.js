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
    const systemPrompt = `You are a helpful career assistant for Harican, a platform helping youth find job opportunities. You are currently helping ${userContext.name}, a job seeker.

USER PROFILE:
- Name: ${userContext.name}
- Education Level: ${userContext.educationLevel || 'Not specified'}
- Department/Field: ${userContext.department || 'Not specified'}
- Experience Level: ${userContext.experienceLevel || 'Not specified'}
- Preferred Career Track: ${userContext.preferredCareerTrack || 'Not specified'}
- Skills: ${userContext.skills || 'No skills added yet'}
- Bio: ${userContext.bio || 'No bio provided'}
${userContext.cvText ? `- CV/Resume Content: ${userContext.cvText.substring(0, 1000)}${userContext.cvText.length > 1000 ? '...' : ''}` : ''}

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

    // Call Gemini API
    console.log('🔄 Calling Gemini API with model: gemini-2.0-flash');
    console.log('📝 Message count:', messages.length);
    
    const aiResponse = await callGeminiAPI(messages);

    console.log('✅ Gemini response received');

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
