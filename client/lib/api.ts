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
      throw new Error(data.message || 'An error occurred');
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

// Export everything
export default {
  auth: authAPI,
  profile: profileAPI,
};
