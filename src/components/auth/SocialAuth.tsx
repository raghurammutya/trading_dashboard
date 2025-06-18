import React, { useState, useEffect } from 'react';
import { Button, Space, message, Typography, Alert } from 'antd';
import { GoogleOutlined, GithubOutlined, LinkedinOutlined, FacebookOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { SocialAuthProvider } from '../../types/auth';
import { authService } from '../../services/authService';
import { mockAuthService } from '../../services/mockAuthService';
import { realSocialAuthService } from '../../services/realSocialAuthService';
import { useAuth } from '../../context/AuthContext';

const { Text } = Typography;

interface SocialAuthProps {
  onSuccess: (response: any) => void;
}

export default function SocialAuth({ onSuccess }: SocialAuthProps) {
  const [configuredProviders, setConfiguredProviders] = useState<string[]>([]);
  const [useRealOAuth, setUseRealOAuth] = useState(false);

  useEffect(() => {
    // Check which OAuth providers are properly configured
    const configured = realSocialAuthService.getConfiguredProviders();
    setConfiguredProviders(configured);
    setUseRealOAuth(configured.length > 0);
  }, []);

  const socialProviders: SocialAuthProvider[] = [
    {
      name: 'Google',
      provider: 'google',
      icon: 'GoogleOutlined',
      color: '#db4437',
      redirectUrl: `${window.location.origin}/auth/callback/google`
    },
    {
      name: 'LinkedIn',
      provider: 'linkedin',
      icon: 'LinkedinOutlined',
      color: '#0077b5',
      redirectUrl: `${window.location.origin}/auth/callback/linkedin`
    },
    {
      name: 'Facebook',
      provider: 'facebook',
      icon: 'FacebookOutlined',
      color: '#3b5998',
      redirectUrl: `${window.location.origin}/auth/callback/facebook`
    },
    {
      name: 'GitHub',
      provider: 'github',
      icon: 'GithubOutlined',
      color: '#333',
      redirectUrl: `${window.location.origin}/auth/callback/github`
    },
  ];

  const handleSocialLogin = async (provider: SocialAuthProvider) => {
    try {
      const isConfigured = configuredProviders.includes(provider.provider);
      
      if (useRealOAuth && isConfigured) {
        // Use real OAuth
        message.loading({ content: `Redirecting to ${provider.name}...`, key: 'social-auth' });
        
        try {
          const authData = await realSocialAuthService.initiateSocialAuth(provider.provider);
          
          // Store provider info for callback handling
          sessionStorage.setItem('social_auth_provider', provider.provider);
          
          // Redirect to OAuth provider
          window.location.href = authData.redirect_url;
          return;
          
        } catch (realOAuthError: any) {
          console.error('Real OAuth failed:', realOAuthError);
          message.error({ 
            content: `OAuth configuration error for ${provider.name}: ${realOAuthError.message || 'Unknown error'}`, 
            key: 'social-auth' 
          });
          return;
        }
      }
      
      // Fallback to mock or when OAuth not configured
      message.loading({ 
        content: isConfigured 
          ? `Connecting to ${provider.name}...` 
          : `Creating demo account with ${provider.name}...`, 
        key: 'social-auth' 
      });
      
      // Try backend API first, then mock
      try {
        const authData = await authService.initiateSocialAuth(provider.provider);
        
        sessionStorage.setItem('social_auth_provider', provider.provider);
        window.location.href = authData.redirect_url;
        
      } catch (backendError) {
        console.warn('Backend social auth failed, using mock service:', backendError);
        
        // Use mock social login
        const mockCode = `mock_${provider.provider}_${Date.now()}`;
        const response = await mockAuthService.socialLogin(provider.provider, mockCode);
        
        // Store token in localStorage
        localStorage.setItem('auth_token', response.access_token);
        if (response.refresh_token) {
          localStorage.setItem('refresh_token', response.refresh_token);
        }
        
        // Check if it was a new registration or existing login
        const wasExistingUser = Date.now() - parseInt(response.user.id) > 1000;
        
        message.success({ 
          content: wasExistingUser 
            ? `Welcome back! Logged in with ${provider.name}` 
            : `Successfully registered and logged in with ${provider.name}!`, 
          key: 'social-auth' 
        });
        
        // Call onSuccess callback
        onSuccess(response);
      }
      
    } catch (error) {
      message.error({ 
        content: `Failed to connect to ${provider.name}`, 
        key: 'social-auth' 
      });
      console.error(`Social auth error for ${provider.name}:`, error);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GoogleOutlined':
        return <GoogleOutlined />;
      case 'LinkedinOutlined':
        return <LinkedinOutlined />;
      case 'FacebookOutlined':
        return <FacebookOutlined />;
      case 'GithubOutlined':
        return <GithubOutlined />;
      default:
        return <GoogleOutlined />;
    }
  };

  const renderStatusAlert = () => {
    if (configuredProviders.length === 0) {
      return (
        <Alert
          message="OAuth Not Configured"
          description={
            <div>
              <Text>No OAuth providers are configured. Using mock authentication for demo purposes.</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 11 }}>
                To enable real OAuth: Add your OAuth app credentials to .env.local
              </Text>
            </div>
          }
          type="warning"
          icon={<WarningOutlined />}
          style={{ fontSize: 12 }}
          showIcon
        />
      );
    }

    if (configuredProviders.length < socialProviders.length) {
      return (
        <Alert
          message="Partial OAuth Configuration"
          description={
            <div>
              <Text>Configured: {configuredProviders.join(', ')}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 11 }}>
                Other providers will use mock authentication
              </Text>
            </div>
          }
          type="info"
          icon={<InfoCircleOutlined />}
          style={{ fontSize: 12 }}
          showIcon
        />
      );
    }

    return (
      <Alert
        message="Real OAuth Active"
        description="All providers are configured for real OAuth authentication."
        type="success"
        style={{ fontSize: 12 }}
        showIcon
      />
    );
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      {renderStatusAlert()}
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 12,
        flexWrap: 'wrap' 
      }}>
        {socialProviders.map((provider) => {
          const isConfigured = configuredProviders.includes(provider.provider);
          
          return (
            <Button
              key={provider.provider}
              shape="circle"
              size="large"
              icon={getIcon(provider.icon)}
              onClick={() => handleSocialLogin(provider)}
              style={{
                borderColor: provider.color,
                color: provider.color,
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isConfigured ? 1 : 0.7,
                fontSize: '20px'
              }}
              title={isConfigured ? `Continue with ${provider.name}` : `${provider.name} (Demo Mode)`}
            />
          );
        })}
      </div>
      
      {/* Keycloak SSO Button */}
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <Button
          type="link"
          size="small"
          onClick={() => {
            message.info('Keycloak SSO integration coming soon!');
          }}
          style={{
            color: '#666',
            fontSize: '12px'
          }}
        >
          Enterprise SSO (Keycloak)
        </Button>
      </div>
    </Space>
  );
}

// Social auth callback handler component
export function SocialAuthCallback() {
  React.useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const provider = sessionStorage.getItem('social_auth_provider');
        
        if (code && provider) {
          message.loading({ content: 'Completing authentication...', key: 'social-callback' });
          
          const response = await authService.handleSocialCallback(provider, code, state || '');
          
          // Clear the stored provider
          sessionStorage.removeItem('social_auth_provider');
          
          // Store token and redirect to dashboard
          localStorage.setItem('auth_token', response.access_token);
          
          message.success({ 
            content: 'Authentication successful!', 
            key: 'social-callback' 
          });
          
          window.location.href = '/dashboard';
        } else {
          throw new Error('Invalid callback parameters');
        }
      } catch (error) {
        message.error({ 
          content: 'Authentication failed', 
          key: 'social-callback' 
        });
        
        // Redirect back to login
        window.location.href = '/login';
      }
    };
    
    handleCallback();
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div>Completing authentication...</div>
    </div>
  );
}