import { userServiceApi, handleApiError } from './apiClient';
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

class AuthService {
  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await userServiceApi.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Login failed'));
    }
  }

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    try {
      const response = await userServiceApi.post('/users/', {
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone_number: userData.phone_number,
        role: userData.role || 'VIEWER'
      });
      
      // After registration, attempt login
      const loginResponse = await this.login({
        email: userData.email,
        password: userData.password
      });
      
      return loginResponse;
    } catch (error) {
      throw new Error(handleApiError(error, 'Registration failed'));
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await userServiceApi.get('/users/me');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to get user information'));
    }
  }

  async updateUser(userId: number, userData: Partial<User>): Promise<User> {
    try {
      const response = await userServiceApi.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update user'));
    }
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const response = await userServiceApi.post('/auth/refresh', { 
        refresh_token: refreshToken 
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Token refresh failed'));
    }
  }

  async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    try {
      await userServiceApi.post('/auth/password-reset', data);
    } catch (error) {
      throw new Error(handleApiError(error, 'Password reset request failed'));
    }
  }

  async confirmPasswordReset(data: PasswordResetConfirm): Promise<void> {
    try {
      await userServiceApi.post('/auth/password-reset/confirm', data);
    } catch (error) {
      throw new Error(handleApiError(error, 'Password reset confirmation failed'));
    }
  }

  // API Key management
  async getApiKeys(): Promise<ApiKey[]> {
    try {
      const response = await userServiceApi.get('/api/user-enhancements/users/api-keys');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch API keys'));
    }
  }

  async createApiKey(data: CreateApiKeyRequest): Promise<ApiKey> {
    try {
      const response = await userServiceApi.post('/api/user-enhancements/users/api-keys', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to create API key'));
    }
  }

  async deleteApiKey(keyId: string): Promise<void> {
    try {
      await userServiceApi.delete(`/api/user-enhancements/users/api-keys/${keyId}`);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to delete API key'));
    }
  }

  async toggleApiKey(keyId: string, isActive: boolean): Promise<ApiKey> {
    try {
      const response = await userServiceApi.patch(`/api/user-enhancements/users/api-keys/${keyId}`, {
        is_active: isActive
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update API key'));
    }
  }

  // Social authentication
  async initiateSocialAuth(provider: string): Promise<{ redirect_url: string }> {
    try {
      const response = await userServiceApi.get(`/auth/social/${provider}/authorize`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Social authentication failed'));
    }
  }

  async handleSocialCallback(provider: string, code: string, state?: string): Promise<LoginResponse> {
    try {
      const response = await userServiceApi.post(`/auth/social/${provider}/callback`, {
        code,
        state
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Social authentication callback failed'));
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await userServiceApi.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, we still want to clear local storage
      console.warn('Server logout failed:', error);
    }
  }

  // Check authentication status
  async checkAuthStatus(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AuthService();
export default authService;