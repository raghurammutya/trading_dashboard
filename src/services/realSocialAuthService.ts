import { LoginResponse, User } from '../types/auth';

interface OAuthProvider {
  name: string;
  provider: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  authUrl: string;
}

class RealSocialAuthService {
  private providers: Record<string, OAuthProvider> = {
    google: {
      name: 'Google',
      provider: 'google',
      clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
      redirectUri: `${window.location.origin}/auth/callback/google`,
      scope: 'openid email profile',
      authUrl: 'https://accounts.google.com/o/oauth2/auth'
    },
    linkedin: {
      name: 'LinkedIn',
      provider: 'linkedin',
      clientId: process.env.REACT_APP_LINKEDIN_CLIENT_ID || '',
      redirectUri: `${window.location.origin}/auth/callback/linkedin`,
      scope: 'r_liteprofile r_emailaddress',
      authUrl: 'https://www.linkedin.com/oauth/v2/authorization'
    },
    facebook: {
      name: 'Facebook',
      provider: 'facebook',
      clientId: process.env.REACT_APP_FACEBOOK_APP_ID || '',
      redirectUri: `${window.location.origin}/auth/callback/facebook`,
      scope: 'email,public_profile',
      authUrl: 'https://www.facebook.com/v18.0/dialog/oauth'
    },
    github: {
      name: 'GitHub',
      provider: 'github',
      clientId: process.env.REACT_APP_GITHUB_CLIENT_ID || '',
      redirectUri: `${window.location.origin}/auth/callback/github`,
      scope: 'user:email',
      authUrl: 'https://github.com/login/oauth/authorize'
    }
  };

  // Generate OAuth authorization URL
  getAuthUrl(provider: string): string {
    const config = this.providers[provider];
    if (!config) {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    if (!config.clientId) {
      throw new Error(`Client ID not configured for ${provider}. Please set REACT_APP_${provider.toUpperCase()}_CLIENT_ID in your environment.`);
    }

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scope,
      response_type: 'code',
      state: this.generateState(provider)
    });

    // Provider-specific parameters
    if (provider === 'google') {
      params.append('access_type', 'offline');
      params.append('prompt', 'consent');
    }

    return `${config.authUrl}?${params.toString()}`;
  }

  // Generate state parameter for CSRF protection
  private generateState(provider: string): string {
    const state = {
      provider,
      timestamp: Date.now(),
      random: Math.random().toString(36).substring(2)
    };
    return btoa(JSON.stringify(state));
  }

  // Validate state parameter
  private validateState(state: string, expectedProvider: string): boolean {
    try {
      const decoded = JSON.parse(atob(state));
      return decoded.provider === expectedProvider && 
             (Date.now() - decoded.timestamp) < 600000; // 10 minutes
    } catch {
      return false;
    }
  }

  // Initiate OAuth flow
  async initiateSocialAuth(provider: string): Promise<{ redirect_url: string }> {
    try {
      const authUrl = this.getAuthUrl(provider);
      return { redirect_url: authUrl };
    } catch (error) {
      console.error(`Failed to initiate ${provider} OAuth:`, error);
      throw error;
    }
  }

  // Handle OAuth callback
  async handleSocialCallback(provider: string, code: string, state: string): Promise<LoginResponse> {
    // Validate state parameter
    if (!this.validateState(state, provider)) {
      throw new Error('Invalid state parameter. Possible CSRF attack.');
    }

    try {
      // Exchange code for access token
      const tokenData = await this.exchangeCodeForToken(provider, code);
      
      // Get user profile from provider
      const userProfile = await this.getUserProfile(provider, tokenData.access_token);
      
      // Create user in our system or get existing user
      const loginResponse = await this.createOrLoginUser(userProfile, provider);
      
      return loginResponse;
    } catch (error) {
      console.error(`OAuth callback error for ${provider}:`, error);
      throw new Error(`Failed to complete ${provider} authentication`);
    }
  }

  // Exchange authorization code for access token
  private async exchangeCodeForToken(provider: string, code: string): Promise<any> {
    const config = this.providers[provider];
    
    // This would typically be done by your backend to keep client secrets secure
    // For demo purposes, we'll show the structure but recommend backend implementation
    
    const tokenEndpoints = {
      google: 'https://oauth2.googleapis.com/token',
      linkedin: 'https://www.linkedin.com/oauth/v2/accessToken',
      facebook: 'https://graph.facebook.com/v18.0/oauth/access_token',
      github: 'https://github.com/login/oauth/access_token'
    };

    const response = await fetch(tokenEndpoints[provider as keyof typeof tokenEndpoints], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        // client_secret: config.clientSecret, // This should be handled by backend
        code,
        redirect_uri: config.redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    return await response.json();
  }

  // Get user profile from OAuth provider
  private async getUserProfile(provider: string, accessToken: string): Promise<any> {
    const profileEndpoints = {
      google: 'https://www.googleapis.com/oauth2/v2/userinfo',
      linkedin: 'https://api.linkedin.com/v2/people/~?projection=(id,firstName,lastName,emailAddress)',
      facebook: 'https://graph.facebook.com/me?fields=id,name,email,first_name,last_name',
      github: 'https://api.github.com/user'
    };

    const response = await fetch(profileEndpoints[provider as keyof typeof profileEndpoints], {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get user profile: ${response.statusText}`);
    }

    return await response.json();
  }

  // Create user in our system or login existing user
  private async createOrLoginUser(profile: any, provider: string): Promise<LoginResponse> {
    // This should integrate with your user_service backend
    // For now, we'll create a mock response based on the profile
    
    const user: User = {
      id: `${provider}_${profile.id || profile.sub}`,
      first_name: profile.given_name || profile.first_name || profile.name?.split(' ')[0] || 'User',
      last_name: profile.family_name || profile.last_name || profile.name?.split(' ').slice(1).join(' ') || 'Unknown',
      email: profile.email,
      role: 'VIEWER',
      organization_id: 'org1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
      mfa_enabled: false,
      timezone: 'UTC',
      language: 'en',
      notifications_email: true,
      notifications_sms: false,
      avatar_url: profile.picture || profile.avatar_url
    };

    // Generate a mock JWT token (in real implementation, this comes from your backend)
    const token = btoa(JSON.stringify({
      userId: user.id,
      email: user.email,
      provider,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    }));

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 86400,
      user,
      refresh_token: `refresh_${token}`
    };
  }

  // Check if OAuth is properly configured
  isConfigured(provider: string): boolean {
    const config = this.providers[provider];
    return config && !!config.clientId && config.clientId !== 'your_client_id_here';
  }

  // Get list of configured providers
  getConfiguredProviders(): string[] {
    return Object.keys(this.providers).filter(provider => this.isConfigured(provider));
  }
}

export const realSocialAuthService = new RealSocialAuthService();