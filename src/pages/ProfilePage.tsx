import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Row, 
  Col, 
  Avatar, 
  Upload, 
  Typography, 
  Divider,
  Switch,
  Select,
  message,
  Tag,
  Space,
  Alert
} from 'antd';
import { 
  UserOutlined, 
  UploadOutlined, 
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const { Title, Text } = Typography;
const { Option } = Select;

export default function ProfilePage() {
  const { user } = useAuth();
  const { themeMode } = useTheme();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(user?.mfa_enabled || false);

  const handleSave = async (values: any) => {
    setIsLoading(true);
    try {
      // TODO: Integrate with user_service API
      console.log('Saving profile:', values);
      message.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaToggle = async (enabled: boolean) => {
    try {
      // TODO: Integrate with user_service MFA endpoints
      console.log('MFA toggle:', enabled);
      setMfaEnabled(enabled);
      message.success(enabled ? 'MFA enabled successfully' : 'MFA disabled successfully');
    } catch (error) {
      message.error('Failed to update MFA settings');
    }
  };

  const uploadProps = {
    name: 'avatar',
    action: '/api/upload/avatar',
    headers: {
      authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
    beforeUpload: (file: File) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG files!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
  };

  return (
    <div>
      <Title level={2}>My Profile</Title>
      
      <Row gutter={[24, 24]}>
        {/* Profile Overview */}
        <Col xs={24} lg={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Avatar 
                size={120} 
                icon={<UserOutlined />} 
                src={user?.avatar_url}
                style={{ marginBottom: 16 }}
              />
              
              <Title level={4} style={{ marginBottom: 8 }}>
                {user?.first_name} {user?.last_name}
              </Title>
              
              <Tag color="blue" style={{ marginBottom: 16 }}>
                {user?.role}
              </Tag>
              
              <div style={{ marginBottom: 24 }}>
                <Upload {...uploadProps} showUploadList={false}>
                  <Button icon={<UploadOutlined />}>
                    Change Avatar
                  </Button>
                </Upload>
              </div>

              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text><MailOutlined /> Email:</Text>
                  <Text>{user?.email}</Text>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text><PhoneOutlined /> Phone:</Text>
                  <Text>{user?.phone_number || 'Not provided'}</Text>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text><CalendarOutlined /> Joined:</Text>
                  <Text>{new Date(user?.created_at || '').toLocaleDateString()}</Text>
                </div>
              </Space>
            </div>
          </Card>

          {/* Security Settings */}
          <Card title="Security Settings" style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Multi-Factor Authentication</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Add an extra layer of security to your account
                  </Text>
                </div>
                <Switch 
                  checked={mfaEnabled}
                  onChange={handleMfaToggle}
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </div>
            </div>

            <Divider />

            <div>
              <Text strong>Last Login</Text>
              <br />
              <Text type="secondary">
                {new Date(user?.last_login || '').toLocaleString()}
              </Text>
            </div>
          </Card>
        </Col>

        {/* Profile Details */}
        <Col xs={24} lg={16}>
          <Card 
            title="Profile Information"
            extra={
              <Button 
                type={isEditing ? "default" : "primary"}
                icon={isEditing ? <CloseOutlined /> : <EditOutlined />}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            }
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              initialValues={{
                first_name: user?.first_name,
                last_name: user?.last_name,
                email: user?.email,
                phone_number: user?.phone_number,
                timezone: user?.timezone || 'UTC',
                language: user?.language || 'en',
                notifications_email: user?.notifications_email ?? true,
                notifications_sms: user?.notifications_sms ?? false,
              }}
              disabled={!isEditing}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="first_name"
                    label="First Name"
                    rules={[{ required: true, message: 'Please enter your first name' }]}
                  >
                    <Input placeholder="Enter your first name" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="last_name"
                    label="Last Name"
                    rules={[{ required: true, message: 'Please enter your last name' }]}
                  >
                    <Input placeholder="Enter your last name" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="Enter your email" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="phone_number"
                    label="Phone Number"
                  >
                    <Input prefix={<PhoneOutlined />} placeholder="Enter your phone number" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="timezone"
                    label="Timezone"
                  >
                    <Select placeholder="Select your timezone">
                      <Option value="UTC">UTC</Option>
                      <Option value="America/New_York">Eastern Time (ET)</Option>
                      <Option value="America/Chicago">Central Time (CT)</Option>
                      <Option value="America/Denver">Mountain Time (MT)</Option>
                      <Option value="America/Los_Angeles">Pacific Time (PT)</Option>
                      <Option value="Europe/London">London</Option>
                      <Option value="Europe/Paris">Paris</Option>
                      <Option value="Asia/Tokyo">Tokyo</Option>
                      <Option value="Asia/Singapore">Singapore</Option>
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="language"
                    label="Language"
                  >
                    <Select placeholder="Select your language">
                      <Option value="en">English</Option>
                      <Option value="es">Spanish</Option>
                      <Option value="fr">French</Option>
                      <Option value="de">German</Option>
                      <Option value="ja">Japanese</Option>
                      <Option value="zh">Chinese</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Divider>Notification Preferences</Divider>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="notifications_email"
                    label="Email Notifications"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="notifications_sms"
                    label="SMS Notifications"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              {isEditing && (
                <Form.Item>
                  <Space>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={isLoading}
                      icon={<CheckOutlined />}
                    >
                      Save Changes
                    </Button>
                    <Button onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </Space>
                </Form.Item>
              )}
            </Form>
          </Card>

          {/* Account Status */}
          <Card title="Account Status" style={{ marginTop: 16 }}>
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    backgroundColor: '#52c41a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px',
                    color: 'white',
                    fontSize: 24
                  }}>
                    <CheckOutlined />
                  </div>
                  <Text strong>Verified</Text>
                  <br />
                  <Text type="secondary">Email verified</Text>
                </div>
              </Col>
              
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    backgroundColor: mfaEnabled ? '#52c41a' : '#faad14',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px',
                    color: 'white',
                    fontSize: 24
                  }}>
                    {mfaEnabled ? <CheckOutlined /> : '🔐'}
                  </div>
                  <Text strong>Security</Text>
                  <br />
                  <Text type="secondary">
                    {mfaEnabled ? 'MFA Enabled' : 'MFA Disabled'}
                  </Text>
                </div>
              </Col>
              
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    backgroundColor: '#1890ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px',
                    color: 'white',
                    fontSize: 24
                  }}>
                    👑
                  </div>
                  <Text strong>Subscription</Text>
                  <br />
                  <Text type="secondary">Premium Plan</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}