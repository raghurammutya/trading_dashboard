import React, { useState } from 'react';
import { Form, Input, Button, Typography, Space, Result } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { authService } from '../../services/authService';
import { PasswordResetRequest } from '../../types/auth';

const { Title, Text, Link } = Typography;

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export default function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    
    try {
      const data: PasswordResetRequest = {
        email: values.email
      };
      
      await authService.requestPasswordReset(data);
      
      setEmail(values.email);
      setEmailSent(true);
      
    } catch (error: any) {
      console.error('Password reset request failed:', error);
      // Error handling is done in the service
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (email) {
      setIsLoading(true);
      try {
        await authService.requestPasswordReset({ email });
      } catch (error) {
        console.error('Resend email failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (emailSent) {
    return (
      <div style={{ width: '100%', maxWidth: 400 }}>
        <Result
          status="success"
          title="Email Sent!"
          subTitle={
            <div>
              <Text>
                We've sent a password reset link to{' '}
                <Text strong>{email}</Text>
              </Text>
              <br />
              <Text type="secondary">
                Please check your email and follow the instructions to reset your password.
              </Text>
            </div>
          }
          extra={
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" onClick={onBackToLogin}>
                Back to Sign In
              </Button>
              <Button 
                type="link" 
                onClick={handleResendEmail}
                loading={isLoading}
              >
                Didn't receive the email? Resend
              </Button>
            </Space>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          Reset Password
        </Title>
        <Text type="secondary">
          Enter your email address and we'll send you a link to reset your password
        </Text>
      </div>

      <Form
        form={form}
        name="forgot-password"
        onFinish={handleSubmit}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: 'Please enter your email address!' },
            { type: 'email', message: 'Please enter a valid email address!' }
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Enter your email address"
            autoComplete="email"
            autoFocus
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
            Send Reset Link
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />}
          onClick={onBackToLogin}
        >
          Back to Sign In
        </Button>
      </div>

      <div style={{ 
        marginTop: 24, 
        padding: 16, 
        backgroundColor: 'rgba(24, 144, 255, 0.1)',
        borderRadius: 8,
        border: '1px solid rgba(24, 144, 255, 0.2)'
      }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          <strong>Note:</strong> If you don't receive an email within a few minutes, 
          please check your spam folder or ensure you've entered the correct email address.
        </Text>
      </div>
    </div>
  );
}