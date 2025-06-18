import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Row, 
  Col, 
  Typography, 
  Divider,
  Switch,
  Select,
  message,
  Space,
  Alert,
  Slider,
  InputNumber,
  TimePicker,
  Checkbox
} from 'antd';
import { 
  SettingOutlined,
  BellOutlined,
  SecurityScanOutlined,
  EyeOutlined,
  SaveOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

interface Settings {
  // Appearance
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  
  // Trading
  defaultOrderType: string;
  defaultTimeInForce: string;
  maxOrderSize: number;
  riskTolerance: number;
  
  // Notifications
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  tradingAlerts: boolean;
  priceAlerts: boolean;
  newsAlerts: boolean;
  notificationHours: {
    start: string;
    end: string;
  };
  
  // Privacy & Security
  twoFactorAuth: boolean;
  sessionTimeout: number;
  loginHistory: boolean;
  dataRetention: number;
  apiRateLimit: number;
  
  // Data & Analytics
  dataSync: boolean;
  analyticsTracking: boolean;
  performanceMetrics: boolean;
  customDashboard: boolean;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { themeMode, toggleTheme } = useTheme();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Mock current settings - replace with API call
  const [settings, setSettings] = useState<Settings>({
    theme: themeMode === 'light' ? 'light' : 'dark',
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'US',
    
    defaultOrderType: 'LIMIT',
    defaultTimeInForce: 'DAY',
    maxOrderSize: 10000,
    riskTolerance: 5,
    
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    tradingAlerts: true,
    priceAlerts: true,
    newsAlerts: false,
    notificationHours: {
      start: '09:00',
      end: '16:00'
    },
    
    twoFactorAuth: false,
    sessionTimeout: 60,
    loginHistory: true,
    dataRetention: 365,
    apiRateLimit: 1000,
    
    dataSync: true,
    analyticsTracking: true,
    performanceMetrics: true,
    customDashboard: false
  });

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      // Convert moment objects to strings for storage
      const processedValues = { ...values };
      if (processedValues.notificationHours) {
        if (processedValues.notificationHours.start) {
          processedValues.notificationHours.start = processedValues.notificationHours.start.format('HH:mm');
        }
        if (processedValues.notificationHours.end) {
          processedValues.notificationHours.end = processedValues.notificationHours.end.format('HH:mm');
        }
      }
      
      // TODO: Integrate with user_service API
      console.log('Saving settings:', processedValues);
      
      // Update theme if changed
      if (values.theme !== themeMode && values.theme !== 'auto') {
        toggleTheme();
      }
      
      setSettings({ ...settings, ...processedValues });
      setHasChanges(false);
      message.success('Settings saved successfully!');
    } catch (error) {
      message.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.setFieldsValue({
      ...settings,
      notificationHours: {
        start: moment(settings.notificationHours.start, 'HH:mm'),
        end: moment(settings.notificationHours.end, 'HH:mm')
      }
    });
    setHasChanges(false);
    message.info('Settings reset to last saved values');
  };

  const handleFormChange = () => {
    setHasChanges(true);
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Settings</Title>
        {hasChanges && (
          <Space>
            <Button 
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button 
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
              loading={loading}
            >
              Save Changes
            </Button>
          </Space>
        )}
      </div>

      {hasChanges && (
        <Alert
          message="You have unsaved changes"
          description="Don't forget to save your changes before leaving this page."
          type="warning"
          icon={<ExclamationCircleOutlined />}
          style={{ marginBottom: 24 }}
          showIcon
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        onValuesChange={handleFormChange}
        initialValues={{
          ...settings,
          notificationHours: {
            start: moment(settings.notificationHours.start, 'HH:mm'),
            end: moment(settings.notificationHours.end, 'HH:mm')
          }
        }}
      >
        <Row gutter={[24, 24]}>
          {/* Appearance Settings */}
          <Col xs={24} lg={12}>
            <Card title={
              <Space>
                <EyeOutlined />
                <span>Appearance</span>
              </Space>
            }>
              <Form.Item
                name="theme"
                label="Theme"
              >
                <Select>
                  <Option value="light">Light</Option>
                  <Option value="dark">Dark</Option>
                  <Option value="auto">Auto (System)</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="language"
                label="Language"
              >
                <Select>
                  <Option value="en">English</Option>
                  <Option value="es">Español</Option>
                  <Option value="fr">Français</Option>
                  <Option value="de">Deutsch</Option>
                  <Option value="ja">日本語</Option>
                  <Option value="zh">中文</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="timezone"
                label="Timezone"
              >
                <Select showSearch>
                  <Option value="America/New_York">Eastern Time (ET)</Option>
                  <Option value="America/Chicago">Central Time (CT)</Option>
                  <Option value="America/Denver">Mountain Time (MT)</Option>
                  <Option value="America/Los_Angeles">Pacific Time (PT)</Option>
                  <Option value="UTC">UTC</Option>
                  <Option value="Europe/London">London</Option>
                  <Option value="Europe/Paris">Paris</Option>
                  <Option value="Asia/Tokyo">Tokyo</Option>
                  <Option value="Asia/Singapore">Singapore</Option>
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="dateFormat"
                    label="Date Format"
                  >
                    <Select>
                      <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                      <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                      <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="numberFormat"
                    label="Number Format"
                  >
                    <Select>
                      <Option value="US">US (1,234.56)</Option>
                      <Option value="EU">EU (1.234,56)</Option>
                      <Option value="IN">IN (1,23,456.78)</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Trading Settings */}
          <Col xs={24} lg={12}>
            <Card title={
              <Space>
                <SettingOutlined />
                <span>Trading Preferences</span>
              </Space>
            }>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="defaultOrderType"
                    label="Default Order Type"
                  >
                    <Select>
                      <Option value="MARKET">Market</Option>
                      <Option value="LIMIT">Limit</Option>
                      <Option value="STOP">Stop</Option>
                      <Option value="STOP_LIMIT">Stop Limit</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="defaultTimeInForce"
                    label="Time in Force"
                  >
                    <Select>
                      <Option value="DAY">Day</Option>
                      <Option value="GTC">Good Till Canceled</Option>
                      <Option value="IOC">Immediate or Cancel</Option>
                      <Option value="FOK">Fill or Kill</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="maxOrderSize"
                label="Maximum Order Size ($)"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={100}
                  max={1000000}
                  step={1000}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => Number(value!.replace(/\$\s?|(,*)/g, '')) as any}
                />
              </Form.Item>

              <Form.Item
                name="riskTolerance"
                label="Risk Tolerance"
              >
                <div>
                  <Slider
                    min={1}
                    max={10}
                    marks={{
                      1: 'Conservative',
                      5: 'Moderate',
                      10: 'Aggressive'
                    }}
                  />
                </div>
              </Form.Item>
            </Card>
          </Col>

          {/* Notification Settings */}
          <Col xs={24} lg={12}>
            <Card title={
              <Space>
                <BellOutlined />
                <span>Notifications</span>
              </Space>
            }>
              <Form.Item
                name="emailNotifications"
                label="Email Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="smsNotifications"
                label="SMS Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="pushNotifications"
                label="Push Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Divider>Alert Types</Divider>

              <Form.Item
                name="tradingAlerts"
                label="Trading Alerts"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="priceAlerts"
                label="Price Alerts"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="newsAlerts"
                label="News Alerts"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Divider>Notification Hours</Divider>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name={['notificationHours', 'start']}
                    label="Start Time"
                  >
                    <TimePicker 
                      style={{ width: '100%' }}
                      format="HH:mm"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={['notificationHours', 'end']}
                    label="End Time"
                  >
                    <TimePicker 
                      style={{ width: '100%' }}
                      format="HH:mm"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Security Settings */}
          <Col xs={24} lg={12}>
            <Card title={
              <Space>
                <SecurityScanOutlined />
                <span>Privacy & Security</span>
              </Space>
            }>
              <Form.Item
                name="twoFactorAuth"
                label="Two-Factor Authentication"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="sessionTimeout"
                label="Session Timeout (minutes)"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={15}
                  max={480}
                  step={15}
                />
              </Form.Item>

              <Form.Item
                name="loginHistory"
                label="Keep Login History"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="dataRetention"
                label="Data Retention (days)"
              >
                <Select>
                  <Option value={30}>30 days</Option>
                  <Option value={90}>90 days</Option>
                  <Option value={180}>180 days</Option>
                  <Option value={365}>1 year</Option>
                  <Option value={730}>2 years</Option>
                  <Option value={-1}>Forever</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="apiRateLimit"
                label="API Rate Limit (requests/hour)"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={100}
                  max={10000}
                  step={100}
                />
              </Form.Item>
            </Card>
          </Col>

          {/* Data & Analytics */}
          <Col xs={24}>
            <Card title="Data & Analytics">
              <Row gutter={24}>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    name="dataSync"
                    label="Real-time Data Sync"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    name="analyticsTracking"
                    label="Analytics Tracking"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    name="performanceMetrics"
                    label="Performance Metrics"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    name="customDashboard"
                    label="Custom Dashboard"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Save Button */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Space size="large">
            <Button 
              size="large"
              icon={<ReloadOutlined />}
              onClick={handleReset}
              disabled={!hasChanges}
            >
              Reset Changes
            </Button>
            <Button 
              type="primary"
              size="large"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
              disabled={!hasChanges}
            >
              Save All Settings
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
}