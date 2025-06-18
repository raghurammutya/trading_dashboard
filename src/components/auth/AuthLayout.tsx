import React, { useState } from 'react';
import { Layout, Card, Typography, Switch, Space } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTheme } from '../../context/ThemeContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

const { Content } = Layout;
const { Title, Text } = Typography;

type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

export default function AuthLayout() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const { themeMode, toggleTheme } = useTheme();

  const renderAuthForm = () => {
    switch (authMode) {
      case 'login':
        return (
          <LoginForm
            onSwitchToRegister={() => setAuthMode('register')}
            onForgotPassword={() => setAuthMode('forgot-password')}
          />
        );
      case 'register':
        return (
          <RegisterForm
            onSwitchToLogin={() => setAuthMode('login')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onBackToLogin={() => setAuthMode('login')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout style={{ 
      minHeight: '100vh',
      background: themeMode === 'dark' 
        ? 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {/* Header with theme toggle */}
      <div style={{
        position: 'absolute',
        top: 24,
        right: 24,
        zIndex: 1000
      }}>
        <Space>
          <SunOutlined style={{ color: themeMode === 'light' ? '#1890ff' : '#666' }} />
          <Switch
            checked={themeMode === 'dark'}
            onChange={toggleTheme}
            size="small"
          />
          <MoonOutlined style={{ color: themeMode === 'dark' ? '#1890ff' : '#666' }} />
        </Space>
      </div>

      <Content style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        position: 'relative'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div style={{ 
          width: '100%', 
          maxWidth: 480,
          position: 'relative',
          zIndex: 1
        }}>
          {/* Logo/Brand Section */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: 32,
            color: 'white'
          }}>
            <div style={{
              fontSize: 48,
              fontWeight: 'bold',
              marginBottom: 8,
              background: 'linear-gradient(45deg, #1890ff, #52c41a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              📈 TradingHub
            </div>
            <Text style={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: 16
            }}>
              Professional Trading Platform
            </Text>
          </div>

          {/* Auth Form Card */}
          <Card
            style={{
              borderRadius: 12,
              boxShadow: themeMode === 'dark' 
                ? '0 8px 32px rgba(0, 0, 0, 0.6)'
                : '0 8px 32px rgba(0, 0, 0, 0.15)',
              border: 'none'
            }}
            bodyStyle={{
              padding: '32px',
              background: themeMode === 'dark' 
                ? 'rgba(20, 20, 20, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 12
            }}
          >
            {renderAuthForm()}
          </Card>

          {/* Footer */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: 24,
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            <Text style={{ color: 'inherit', fontSize: 12 }}>
              © 2024 TradingHub. All rights reserved.
            </Text>
          </div>
        </div>
      </Content>
    </Layout>
  );
}