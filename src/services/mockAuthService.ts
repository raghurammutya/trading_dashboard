import { 
  LoginRequest, 
  RegisterRequest, 
  LoginResponse, 
  User, 
  PasswordResetRequest,
  PasswordResetConfirm,
  ApiKey,
  CreateApiKeyRequest
} from '../types/auth';

// Extended user interface for mock storage
interface MockUser extends User {
  password_hash?: string;
}

// Mock user storage in localStorage - Clear previous data
const USERS_STORAGE_KEY = 'trading_dashboard_users';
const CURRENT_USER_KEY = 'trading_dashboard_current_user';

// Clear any existing user data for fresh start
localStorage.removeItem(USERS_STORAGE_KEY);
localStorage.removeItem(CURRENT_USER_KEY);
localStorage.removeItem('auth_token');
localStorage.removeItem('refresh_token');

// Mock user database
const getMockUsers = (): MockUser[] => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default admin user
  const defaultUsers: MockUser[] = [
    {
      id: '1',
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@tradinghub.com',
      phone_number: '+1-555-0100',
      role: 'ADMIN',
      organization_id: 'org1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
      mfa_enabled: false,
      timezone: 'UTC',
      language: 'en',
      notifications_email: true,
      notifications_sms: false,
      // Mock password hash for "password123"
      password_hash: 'mock_hash_password123'
    }
  ];
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
};

const saveMockUsers = (users: MockUser[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const generateMockToken = (user: User): string => {
  // Simple mock token - in real app this would be a JWT
  return btoa(JSON.stringify({ 
    userId: user.id, 
    email: user.email, 
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  }));
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockAuthService {
  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Simulate API delay
    await delay(800);
    
    const users = getMockUsers();
    const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Mock password check - in real app this would be proper hash comparison
    const password = credentials.password;
    const expectedPassword = user.password_hash?.replace('mock_hash_', '') || 'password123';
    
    if (password !== expectedPassword) {
      throw new Error('Invalid email or password');
    }
    
    if (!user.is_active) {
      throw new Error('Account is not active. Please contact support.');
    }
    
    // Update last login
    user.last_login = new Date().toISOString();
    saveMockUsers(users);
    
    const token = generateMockToken(user);
    // Remove password_hash from response
    const { password_hash, ...userWithoutPassword } = user;
    const response: LoginResponse = {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 86400, // 24 hours
      user: userWithoutPassword as User,
      refresh_token: `refresh_${token}`
    };
    
    // Store current user
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(response.user));
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    // Simulate API delay
    await delay(1000);
    
    const users = getMockUsers();
    
    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }
    
    // Validate password confirmation
    if (userData.password !== userData.confirm_password) {
      throw new Error('Passwords do not match');
    }
    
    // Create new user
    const newUser: MockUser = {
      id: Date.now().toString(),
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone_number: userData.phone_number,
      role: userData.role || 'VIEWER',
      organization_id: 'org1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
      mfa_enabled: false,
      timezone: 'UTC',
      language: 'en',
      notifications_email: true,
      notifications_sms: false,
      password_hash: `mock_hash_${userData.password}` // Store password for mock purposes
    };
    
    users.push(newUser);
    saveMockUsers(users);
    
    // Auto-login after registration
    return await this.login({
      email: userData.email,
      password: userData.password,
      remember_me: true
    });
  }

  async getCurrentUser(): Promise<User> {
    // Simulate API delay
    await delay(300);
    
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (!stored) {
      throw new Error('No authenticated user found');
    }
    
    return JSON.parse(stored);
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    // Simulate API delay
    await delay(500);
    
    const users = getMockUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Update user
    users[userIndex] = { 
      ...users[userIndex], 
      ...userData, 
      updated_at: new Date().toISOString() 
    };
    
    saveMockUsers(users);
    
    // Update current user if it's the same
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    if (currentUser) {
      const current = JSON.parse(currentUser);
      if (current.id === userId) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[userIndex]));
      }
    }
    
    return users[userIndex];
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    // Simulate API delay
    await delay(400);
    
    try {
      // Decode mock refresh token
      const tokenData = JSON.parse(atob(refreshToken.replace('refresh_', '')));
      const users = getMockUsers();
      const user = users.find(u => u.id === tokenData.userId);
      
      if (!user) {
        throw new Error('Invalid refresh token');
      }
      
      const newToken = generateMockToken(user);
      // Remove password_hash from response
      const { password_hash, ...userWithoutPassword } = user;
      return {
        access_token: newToken,
        token_type: 'Bearer',
        expires_in: 86400,
        user: userWithoutPassword as User,
        refresh_token: `refresh_${newToken}`
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    // Simulate API delay
    await delay(800);
    
    const users = getMockUsers();
    const user = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    
    if (!user) {
      // Don't reveal if email exists for security
      console.log('Password reset requested for non-existent email:', data.email);
    }
    
    // In real app, this would send an email
    console.log('Mock: Password reset email sent to', data.email);
  }

  async confirmPasswordReset(data: PasswordResetConfirm): Promise<void> {
    // Simulate API delay
    await delay(600);
    
    // In mock implementation, we'll just accept any token
    if (data.new_password !== data.confirm_password) {
      throw new Error('Passwords do not match');
    }
    
    console.log('Mock: Password reset confirmed');
  }

  // API Key management (mock implementation)
  async createApiKey(data: CreateApiKeyRequest): Promise<ApiKey> {
    // Simulate API delay
    await delay(500);
    
    const apiKey: ApiKey = {
      id: Date.now().toString(),
      name: data.name,
      key: `tk_${Math.random().toString(36).substr(2, 32)}`,
      permissions: data.permissions,
      created_at: new Date().toISOString(),
      expires_at: data.expires_in_days ? 
        new Date(Date.now() + data.expires_in_days * 24 * 60 * 60 * 1000).toISOString() : 
        undefined,
      is_active: true
    };
    
    return apiKey;
  }

  async getApiKeys(): Promise<ApiKey[]> {
    // Simulate API delay
    await delay(400);
    
    // Return mock API keys
    return [
      {
        id: '1',
        name: 'Development API',
        key: 'tk_dev_1234567890abcdef1234567890abcdef',
        permissions: ['READ_PORTFOLIO', 'READ_MARKET_DATA'],
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true
      }
    ];
  }

  async revokeApiKey(keyId: string): Promise<void> {
    // Simulate API delay
    await delay(300);
    console.log('Mock: API key revoked:', keyId);
  }

  // Social authentication (mock)
  async socialLogin(provider: string, code: string): Promise<LoginResponse> {
    // Simulate API delay
    await delay(1200);
    
    const users = getMockUsers();
    const socialEmail = `user@${provider}.com`;
    
    // Check if user already exists with this email
    let existingUser = users.find(u => u.email.toLowerCase() === socialEmail.toLowerCase());
    
    if (existingUser) {
      // User already exists, just login
      const token = generateMockToken(existingUser);
      const { password_hash, ...userWithoutPassword } = existingUser;
      const response: LoginResponse = {
        access_token: token,
        token_type: 'Bearer',
        expires_in: 86400,
        user: userWithoutPassword as User,
        refresh_token: `refresh_${token}`
      };
      
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      return response;
    }
    
    // Create new mock user from social login
    const mockSocialUser: MockUser = {
      id: Date.now().toString(),
      first_name: provider.charAt(0).toUpperCase() + provider.slice(1),
      last_name: 'User',
      email: socialEmail,
      role: 'VIEWER', // Default role for social logins
      organization_id: 'org1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
      mfa_enabled: false,
      timezone: 'UTC',
      language: 'en',
      notifications_email: true,
      notifications_sms: false,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`
    };
    
    users.push(mockSocialUser);
    saveMockUsers(users);
    
    const token = generateMockToken(mockSocialUser);
    // Remove password_hash from response
    const { password_hash, ...userWithoutPassword } = mockSocialUser;
    const response: LoginResponse = {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 86400,
      user: userWithoutPassword as User,
      refresh_token: `refresh_${token}`
    };
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return response;
  }
}

// Export singleton instance
export const mockAuthService = new MockAuthService();