// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Types
export interface User {
  id: string;
  email?: string;
  phone?: string;
  phoneVerified: boolean;
  fullName: string;
  educationLevel?: string;
  department?: string;
  experienceLevel?: 'Fresher' | 'Junior' | 'Mid' | 'Senior';
  preferredCareerTrack?: string;
  cvText?: string;
  bio?: string;
  profileImage?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  skills?: Skill[];
}

export interface Skill {
  id: string;
  skillName: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  userId: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  jobType: 'Internship' | 'Part-time' | 'Full-time' | 'Freelance';
  experienceLevel: 'Fresher' | 'Junior' | 'Mid' | 'Senior';
  description?: string;
  requirements: string[];
  skills: string[];
  salary?: string;
  applicationUrl?: string;
  postedById?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  matchScore?: number;
  matchedSkills?: string[];
  matchReason?: string;
  postedBy?: {
    id: string;
    fullName: string;
    email?: string;
  };
}

export interface LearningResource {
  id: string;
  title: string;
  platform: string;
  url: string;
  description?: string;
  skills: string[];
  costType: 'Free' | 'Paid';
  duration?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  rating?: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  matchScore?: number;
  matchedSkills?: string[];
  matchReason?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface LoginCredentials {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterData {
  email?: string;
  phone?: string;
  password: string;
  fullName: string;
  role?: 'SEEKER' | 'POSTER';
  educationLevel?: string;
  department?: string;
  experienceLevel?: 'Fresher' | 'Junior' | 'Mid' | 'Senior';
  preferredCareerTrack?: string;
}

export interface VerifyPhoneData {
  phone: string;
  otp: string;
}

export interface UpdateProfileData {
  fullName?: string;
  educationLevel?: string;
  department?: string;
  experienceLevel?: 'Fresher' | 'Junior' | 'Mid' | 'Senior';
  preferredCareerTrack?: string;
  cvText?: string;
  bio?: string;
  profileImage?: string;
}

export interface AddSkillsData {
  skills: Array<{
    skillName: string;
    level?: 'Beginner' | 'Intermediate' | 'Advanced';
  }>;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

// Helper function to remove auth token
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

// Helper function to make API requests
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add custom headers if provided
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Important: This sends cookies with requests
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  // Register a new user
  async register(data: RegisterData): Promise<ApiResponse<{ user: User }>> {
    const response = await apiRequest<{ user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response;
  },

  // Login
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User }>> {
    const response = await apiRequest<{ user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    return response;
  },

  // Verify phone number
  async verifyPhone(data: VerifyPhoneData): Promise<ApiResponse> {
    return apiRequest('/api/auth/verify-phone', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Resend phone OTP
  async resendPhoneOTP(phone: string): Promise<ApiResponse> {
    return apiRequest('/api/auth/resend-phone-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  // Get current user
  async getMe(): Promise<ApiResponse<User>> {
    return apiRequest<User>('/api/auth/me');
  },

  // Logout
  async logout(): Promise<ApiResponse> {
    const response = await apiRequest('/api/auth/logout', {
      method: 'POST',
    });
    return response;
  },
};

// Profile API
export const profileAPI = {
  // Get user profile
  async getProfile(): Promise<ApiResponse<User>> {
    return apiRequest<User>('/api/profile');
  },

  // Update profile
  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<User>> {
    return apiRequest<User>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Get skills
  async getSkills(): Promise<ApiResponse<Skill[]>> {
    return apiRequest<Skill[]>('/api/profile/skills');
  },

  // Add skills
  async addSkills(data: AddSkillsData): Promise<ApiResponse<Skill[]>> {
    return apiRequest<Skill[]>('/api/profile/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Remove skill
  async removeSkill(skillId: string): Promise<ApiResponse> {
    return apiRequest(`/api/profile/skills/${skillId}`, {
      method: 'DELETE',
    });
  },

  // Get all users (admin only)
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return apiRequest<User[]>('/api/profile/users');
  },

  // Update user role (admin only)
  async updateUserRole(userId: string, role: string): Promise<ApiResponse<User>> {
    return apiRequest<User>('/api/profile/role', {
      method: 'PUT',
      body: JSON.stringify({ userId, role }),
    });
  },
};

// Jobs API
export const jobsAPI = {
  // Get all jobs with filters
  async getJobs(params?: {
    jobType?: string;
    experienceLevel?: string;
    location?: string;
    isRemote?: boolean;
    skills?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Job[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    return apiRequest<Job[]>(`/api/jobs${queryString ? `?${queryString}` : ''}`);
  },

  // Get job by ID
  async getJobById(id: string): Promise<ApiResponse<Job>> {
    return apiRequest<Job>(`/api/jobs/${id}`);
  },

  // Get recommended jobs
  async getRecommendedJobs(): Promise<ApiResponse<Job[]>> {
    return apiRequest<Job[]>('/api/jobs/recommended/me');
  },

  // Create job (POSTER/ADMIN only)
  async createJob(data: Partial<Job>): Promise<ApiResponse<Job>> {
    return apiRequest<Job>('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update job (POSTER/ADMIN only)
  async updateJob(id: string, data: Partial<Job>): Promise<ApiResponse<Job>> {
    return apiRequest<Job>(`/api/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete job (POSTER/ADMIN only)
  async deleteJob(id: string): Promise<ApiResponse> {
    return apiRequest(`/api/jobs/${id}`, {
      method: 'DELETE',
    });
  },
};

// Resources API
export const resourcesAPI = {
  // Get all resources with filters
  async getResources(params?: {
    costType?: string;
    level?: string;
    platform?: string;
    skills?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<LearningResource[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    return apiRequest<LearningResource[]>(`/api/resources${queryString ? `?${queryString}` : ''}`);
  },

  // Get resource by ID
  async getResourceById(id: string): Promise<ApiResponse<LearningResource>> {
    return apiRequest<LearningResource>(`/api/resources/${id}`);
  },

  // Get recommended resources
  async getRecommendedResources(): Promise<ApiResponse<LearningResource[]>> {
    return apiRequest<LearningResource[]>('/api/resources/recommended/me');
  },

  // Create resource (ADMIN only)
  async createResource(data: Partial<LearningResource>): Promise<ApiResponse<LearningResource>> {
    return apiRequest<LearningResource>('/api/resources', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update resource (ADMIN only)
  async updateResource(id: string, data: Partial<LearningResource>): Promise<ApiResponse<LearningResource>> {
    return apiRequest<LearningResource>(`/api/resources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete resource (ADMIN only)
  async deleteResource(id: string): Promise<ApiResponse> {
    return apiRequest(`/api/resources/${id}`, {
      method: 'DELETE',
    });
  },
};

// Dashboard API
export const dashboardAPI = {
  // Get dashboard data
  async getDashboard(): Promise<ApiResponse<any>> {
    return apiRequest('/api/dashboard');
  },

  // Get user growth trends (Admin only)
  async getUserGrowthTrends(): Promise<ApiResponse<Array<{ month: string; seekers: number; posters: number }>>> {
    return apiRequest('/api/dashboard/user-growth');
  },

  // Get job statistics trends (Admin only)
  async getJobStatsTrends(): Promise<ApiResponse<Array<{ month: string; posted: number; filled: number }>>> {
    return apiRequest('/api/dashboard/job-stats');
  },

  // Get poster's job trends (Poster only)
  async getPosterJobTrends(): Promise<ApiResponse<Array<{ month: string; posted: number; active: number }>>> {
    return apiRequest('/api/dashboard/poster-trends');
  },
};

// AI Assistant API
export const aiAPI = {
  // Send a chat message to AI
  async sendChatMessage(
    message: string,
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<ApiResponse<{ response: string; model: string }>> {
    return apiRequest('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationHistory }),
    });
  },
};

// Roadmap API
export const roadmapAPI = {
  // Generate a new career roadmap
  async generateRoadmap(data: {
    targetRole: string;
    timeframe: string;
    learningTime: string;
    currentSkills?: string[];
  }): Promise<ApiResponse<any>> {
    return apiRequest('/api/roadmap/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all roadmaps for current user
  async getRoadmaps(): Promise<ApiResponse<any[]>> {
    return apiRequest('/api/roadmap', {
      method: 'GET',
    });
  },

  // Get a specific roadmap by ID
  async getRoadmapById(id: string): Promise<ApiResponse<any>> {
    return apiRequest(`/api/roadmap/${id}`, {
      method: 'GET',
    });
  },

  // Delete a roadmap
  async deleteRoadmap(id: string): Promise<ApiResponse<void>> {
    return apiRequest(`/api/roadmap/${id}`, {
      method: 'DELETE',
    });
  },
};

// Export everything
export default {
  auth: authAPI,
  profile: profileAPI,
  jobs: jobsAPI,
  resources: resourcesAPI,
  dashboard: dashboardAPI,
  ai: aiAPI,
  roadmap: roadmapAPI,
};
