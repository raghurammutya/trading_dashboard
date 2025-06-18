import React, { useState } from 'react';
import { Form, Input, Button, Divider, Typography, Progress, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { RegisterRequest, UserRole } from '../../types/auth';
import SocialAuth from './SocialAuth';

const { Title, Text, Link } = Typography;

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [form] = Form.useForm();
  const { register, isLoading } = useAuth();
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const getPasswordStrengthStatus = () => {
    if (passwordStrength < 30) return 'exception';
    if (passwordStrength < 60) return 'normal';
    if (passwordStrength < 80) return 'active';
    return 'success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return 'Weak';
    if (passwordStrength < 60) return 'Fair';
    if (passwordStrength < 80) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (values: any) => {
    try {
      const userData: RegisterRequest = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone_number: values.phone_number,
        password: values.password,
        confirm_password: values.confirm_password,
        role: UserRole.VIEWER // Default role, admin can change later
      };
      
      await register(userData);
      onSuccess?.();
    } catch (error) {
      // Error is already handled in the auth context
      console.error('Registration error:', error);
    }
  };

  const handleSocialSuccess = (response: any) => {
    message.success('Social registration successful!');
    // The auth context will handle the login state
  };

  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          Create Account
        </Title>
        <Text type="secondary">
          Join our trading platform today
        </Text>
      </div>

      <Form
        form={form}
        name="register"
        onFinish={handleSubmit}
        layout="vertical"
        size="large"
      >
        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item
            name="first_name"
            label="First Name"
            style={{ flex: 1 }}
            rules={[
              { required: true, message: 'Please enter your first name!' },
              { min: 2, message: 'First name must be at least 2 characters!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="First name"
              autoComplete="given-name"
            />
          </Form.Item>

          <Form.Item
            name="last_name"
            label="Last Name"
            style={{ flex: 1 }}
            rules={[
              { required: true, message: 'Please enter your last name!' },
              { min: 2, message: 'Last name must be at least 2 characters!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Last name"
              autoComplete="family-name"
            />
          </Form.Item>
        </div>

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
          name="phone_number"
          label="Phone Number"
          rules={[
            { required: true, message: 'Please enter your phone number!' },
            { pattern: /^\+\d{10,15}$/, message: 'Please enter a valid phone number with country code (e.g., +1234567890)!' }
          ]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="Enter phone number (+1234567890)"
            autoComplete="tel"
          />
        </Form.Item>


        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter your password!' },
            { min: 8, message: 'Password must be at least 8 characters!' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Create a password"
            onChange={handlePasswordChange}
            autoComplete="new-password"
          />
        </Form.Item>

        {passwordStrength > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Password Strength
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {getPasswordStrengthText()}
              </Text>
            </div>
            <Progress 
              percent={passwordStrength} 
              status={getPasswordStrengthStatus()}
              showInfo={false}
              size="small"
            />
          </div>
        )}

        <Form.Item
          name="confirm_password"
          label="Confirm Password"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm your password"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            block
            size="large"
          >
            Create Account
          </Button>
        </Form.Item>
      </Form>

      <Divider>
        <Text type="secondary">Or continue with</Text>
      </Divider>

      <SocialAuth onSuccess={handleSocialSuccess} />

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Text type="secondary">
          Already have an account?{' '}
          <Link onClick={onSwitchToLogin}>
            Sign in here
          </Link>
        </Text>
      </div>
    </div>
  );
}