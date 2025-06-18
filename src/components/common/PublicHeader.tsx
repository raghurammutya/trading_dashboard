import React, { useState } from 'react';
import { 
  Layout, 
  Space, 
  Button, 
  Dropdown, 
  Avatar, 
  Typography, 
  Switch,
  Modal,
  message
} from 'antd';
import { 
  UserOutlined, 
  LoginOutlined,
  UserAddOutlined,
  SunOutlined,
  MoonOutlined,
  SettingOutlined,
  LogoutOutlined,
  KeyOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../auth/LoginForm';
import RegisterForm from '../auth/RegisterForm';
import ForgotPasswordForm from '../auth/ForgotPasswordForm';

const { Header } = Layout;
const { Text } = Typography;

export default function PublicHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const { themeMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'register' | 'forgot'>('login');

  const handleLoginSuccess = () => {
    setIsLoginModalVisible(false);
    message.success('Welcome back!');
    navigate('/dashboard');
  };

  const handleRegisterSuccess = () => {
    setIsLoginModalVisible(false);
    message.success('Account created successfully! Please check your email to verify your account.');
  };

  const showLoginModal = (type: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalType(type);
    setIsLoginModalVisible(true);
  };

  const userMenu = {
    items: [
      {
        key: 'dashboard',
        icon: <UserOutlined />,
        label: 'Dashboard',
        onClick: () => navigate('/dashboard')
      },
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'My Profile',
        onClick: () => navigate('/profile')
      },
      {
        key: 'api-keys',
        icon: <KeyOutlined />,
        label: 'API Keys',
        onClick: () => navigate('/api-keys')
      },
      {
        key: 'permissions',
        icon: <SafetyCertificateOutlined />,
        label: 'Permissions',
        onClick: () => navigate('/permissions')
      },
      {
        type: 'divider' as const
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: 'Settings',
        onClick: () => navigate('/settings')
      },
      {
        type: 'divider' as const
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Sign Out',
        onClick: logout,
        danger: true
      }
    ]
  };

  const getModalTitle = () => {
    switch (authModalType) {
      case 'login': return 'Sign In to Your Account';
      case 'register': return 'Create Your Account';
      case 'forgot': return 'Reset Your Password';
      default: return 'Authentication';
    }
  };

  const renderAuthForm = () => {
    switch (authModalType) {
      case 'login':
        return (
          <LoginForm 
            onSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setAuthModalType('register')}
            onSwitchToForgot={() => setAuthModalType('forgot')}
          />
        );
      case 'register':
        return (
          <RegisterForm 
            onSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setAuthModalType('login')}
          />
        );
      case 'forgot':
        return (
          <ForgotPasswordForm 
            onBackToLogin={() => setAuthModalType('login')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: themeMode === 'dark' ? 'rgba(20, 20, 20, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${themeMode === 'dark' ? '#303030' : '#f0f0f0'}`,
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64
      }}>
        {/* Logo */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: 'bold',
            color: themeMode === 'dark' ? '#fff' : '#1890ff'
          }}
          onClick={() => navigate('/')}
        >
          📈 TradingHub
        </div>

        {/* Navigation Menu */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Space size={32}>
            <a 
              href="#features" 
              style={{ 
                color: themeMode === 'dark' ? '#fff' : '#666',
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              Features
            </a>
            <a 
              href="#pricing" 
              style={{ 
                color: themeMode === 'dark' ? '#fff' : '#666',
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              Pricing
            </a>
            <a 
              href="#docs" 
              style={{ 
                color: themeMode === 'dark' ? '#fff' : '#666',
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              API Docs
            </a>
            <a 
              href="#support" 
              style={{ 
                color: themeMode === 'dark' ? '#fff' : '#666',
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              Support
            </a>
          </Space>
        </div>

        {/* Right Side - Auth & Settings */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Space size={16}>
            {/* Theme Toggle */}
            <Space>
              <SunOutlined style={{ 
                color: themeMode === 'light' ? '#1890ff' : '#666',
                fontSize: '16px'
              }} />
              <Switch
                checked={themeMode === 'dark'}
                onChange={toggleTheme}
                size="small"
              />
              <MoonOutlined style={{ 
                color: themeMode === 'dark' ? '#1890ff' : '#666',
                fontSize: '16px'
              }} />
            </Space>

            {/* Authentication Section */}
            {!isAuthenticated ? (
              <Space size={8}>
                <Button 
                  type="text"
                  icon={<LoginOutlined />}
                  onClick={() => showLoginModal('login')}
                  style={{
                    color: themeMode === 'dark' ? '#fff' : '#666',
                    border: 'none'
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={() => showLoginModal('register')}
                  style={{
                    borderRadius: '6px'
                  }}
                >
                  Sign Up
                </Button>
              </Space>
            ) : (
              <Dropdown menu={userMenu} trigger={['click']} placement="bottomRight">
                <Space style={{ cursor: 'pointer' }}>
                  <Avatar 
                    size={32}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: '#1890ff' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Text 
                      strong 
                      style={{ 
                        color: themeMode === 'dark' ? '#fff' : '#000',
                        fontSize: '14px',
                        lineHeight: 1
                      }}
                    >
                      {user?.first_name} {user?.last_name}
                    </Text>
                    <Text 
                      type="secondary" 
                      style={{ 
                        fontSize: '12px',
                        lineHeight: 1
                      }}
                    >
                      {user?.role}
                    </Text>
                  </div>
                </Space>
              </Dropdown>
            )}
          </Space>
        </div>
      </Header>

      {/* Authentication Modal */}
      <Modal
        title={getModalTitle()}
        open={isLoginModalVisible}
        onCancel={() => setIsLoginModalVisible(false)}
        footer={null}
        width={500}
        centered
        destroyOnClose
      >
        {renderAuthForm()}
      </Modal>
    </>
  );
}