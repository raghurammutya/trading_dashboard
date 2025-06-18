import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Divider, Space, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { LoginRequest } from '../../types/auth';
import SocialAuth from './SocialAuth';

const { Title, Text, Link } = Typography;

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onSwitchToForgot?: () => void;
  onForgotPassword?: () => void;
}

export default function LoginForm({ 
  onSuccess, 
  onSwitchToRegister, 
  onSwitchToForgot, 
  onForgotPassword 
}: LoginFormProps) {
  const [form] = Form.useForm();
  const { login, isLoading } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      const credentials: LoginRequest = {
        email: values.email,
        password: values.password,
        remember_me: rememberMe
      };
      
      await login(credentials);
      onSuccess?.();
    } catch (error) {
      // Error is already handled in the auth context
      console.error('Login error:', error);
    }
  };

  const handleSocialSuccess = (response: any) => {
    message.success('Social login successful!');
    // The auth context will handle the login state
  };

  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          Welcome Back
        </Title>
        <Text type="secondary">
          Sign in to your trading dashboard
        </Text>
      </div>

      <Form
        form={form}
        name="login"
        onFinish={handleSubmit}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Enter your email"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 16 
          }}>
            <Checkbox 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            >
              Remember me
            </Checkbox>
            <Link onClick={onSwitchToForgot || onForgotPassword}>
              Forgot password?
            </Link>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            block
            size="large"
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>

      <Divider>
        <Text type="secondary">Or continue with</Text>
      </Divider>

      <SocialAuth onSuccess={handleSocialSuccess} />

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Text type="secondary">
          Don't have an account?{' '}
          <Link onClick={onSwitchToRegister}>
            Sign up now
          </Link>
        </Text>
      </div>
    </div>
  );
}