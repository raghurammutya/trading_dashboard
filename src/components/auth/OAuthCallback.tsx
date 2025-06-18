import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Spin, Typography, Alert, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { realSocialAuthService } from '../../services/realSocialAuthService';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;

export default function OAuthCallback() {
  const { provider } = useParams<{ provider: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (!provider) {
          throw new Error('Provider not specified');
        }

        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        // Check for OAuth errors
        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('Authorization code not received');
        }

        if (!state) {
          throw new Error('State parameter missing');
        }

        setMessage(`Completing ${provider} authentication...`);

        // Try real OAuth service first
        let response;
        try {
          response = await realSocialAuthService.handleSocialCallback(provider, code, state);
        } catch (realOAuthError) {
          console.warn('Real OAuth callback failed, trying backend:', realOAuthError);
          
          // Fallback to backend service
          response = await authService.handleSocialCallback(provider, code, state);
        }

        // Store authentication data
        localStorage.setItem('auth_token', response.access_token);
        if (response.refresh_token) {
          localStorage.setItem('refresh_token', response.refresh_token);
        }

        // Update auth context
        // Note: We'll need to trigger a re-authentication check in the auth context
        // For now, we'll just reload the page to trigger the auth initialization
        
        setStatus('success');
        setMessage(`Successfully authenticated with ${provider}!`);
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
          window.location.reload(); // Trigger auth context refresh
        }, 2000);

      } catch (error: any) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage(error.message || `Authentication with ${provider} failed`);
        
        // Redirect to login page after error
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    handleCallback();
  }, [provider, searchParams, navigate, login]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <LoadingOutlined style={{ fontSize: 24 }} spin />;
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return <LoadingOutlined style={{ fontSize: 24 }} spin />;
    }
  };

  const getStatusType = () => {
    switch (status) {
      case 'success':
        return 'success' as const;
      case 'error':
        return 'error' as const;
      default:
        return 'info' as const;
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      padding: 20
    }}>
      <Space direction="vertical" align="center" size="large" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>
          {getStatusIcon()}
        </div>
        
        <Title level={3}>
          {status === 'loading' && 'Authenticating...'}
          {status === 'success' && 'Authentication Successful!'}
          {status === 'error' && 'Authentication Failed'}
        </Title>

        <Alert
          message={message}
          type={getStatusType()}
          showIcon={false}
          style={{ maxWidth: 400 }}
        />

        {status === 'loading' && (
          <Text type="secondary">
            Please wait while we complete your authentication with {provider}...
          </Text>
        )}

        {status === 'success' && (
          <Text type="secondary">
            Redirecting to dashboard...
          </Text>
        )}

        {status === 'error' && (
          <Text type="secondary">
            Redirecting to login page...
          </Text>
        )}
      </Space>
    </div>
  );
}