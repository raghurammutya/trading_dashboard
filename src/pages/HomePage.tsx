import React, { useState } from 'react';
import { 
  Layout, 
  Typography, 
  Button, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Space, 
  Divider,
  Badge,
  Avatar,
  List,
  Timeline
} from 'antd';
import { 
  DollarOutlined, 
  RiseOutlined, 
  FallOutlined,
  BarChartOutlined,
  TeamOutlined,
  SecurityScanOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { themeMode } = useTheme();
  const navigate = useNavigate();

  // Mock market data for the home page
  const marketStats = {
    sp500: { value: 4789.85, change: 28.12, changePercent: 0.59 },
    nasdaq: { value: 15234.45, change: -45.23, changePercent: -0.30 },
    dow: { value: 37689.54, change: 156.78, changePercent: 0.42 },
    vix: { value: 18.45, change: -1.23, changePercent: -6.24 }
  };

  const features = [
    {
      icon: <BarChartOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
      title: 'Advanced Trading Tools',
      description: 'Professional-grade charting, technical analysis, and order management system.'
    },
    {
      icon: <SecurityScanOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
      title: 'Bank-Level Security',
      description: 'Multi-factor authentication, encryption, and compliance with financial regulations.'
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: 32, color: '#faad14' }} />,
      title: 'Lightning Fast Execution',
      description: 'Ultra-low latency trading with real-time market data and instant order processing.'
    },
    {
      icon: <GlobalOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
      title: 'Global Markets',
      description: 'Access to stocks, options, ETFs, and derivatives across major global exchanges.'
    }
  ];

  const recentUpdates = [
    {
      title: 'Options Strategy Builder',
      description: 'New interactive tool for creating and analyzing complex options strategies',
      time: '2 hours ago',
      type: 'feature'
    },
    {
      title: 'Mobile App Update',
      description: 'Enhanced mobile trading experience with improved charts and notifications',
      time: '1 day ago',
      type: 'update'
    },
    {
      title: 'API Rate Limit Increase',
      description: 'Increased API rate limits for professional accounts to 10,000 requests/hour',
      time: '3 days ago',
      type: 'improvement'
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: 0 }}>
        {/* Hero Section */}
        <div style={{
          background: themeMode === 'dark' 
            ? 'linear-gradient(135deg, #1f1f1f 0%, #2f2f2f 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '80px 50px',
          textAlign: 'center',
          color: 'white'
        }}>
          <Title level={1} style={{ color: 'white', fontSize: '3.5rem', marginBottom: 24 }}>
            Professional Trading Platform
          </Title>
          <Paragraph style={{ 
            fontSize: '1.2rem', 
            color: 'rgba(255,255,255,0.9)', 
            maxWidth: 600, 
            margin: '0 auto 40px' 
          }}>
            Execute trades with precision, analyze markets with advanced tools, 
            and manage your portfolio with institutional-grade technology.
          </Paragraph>
          
          {!isAuthenticated ? (
            <Space size="large">
              <Button 
                type="primary" 
                size="large" 
                style={{ 
                  height: 50, 
                  padding: '0 30px', 
                  fontSize: '16px',
                  borderRadius: '8px'
                }}
                onClick={() => navigate('/login')}
              >
                Start Trading
              </Button>
              <Button 
                size="large" 
                style={{ 
                  height: 50, 
                  padding: '0 30px', 
                  fontSize: '16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white'
                }}
                onClick={() => navigate('/demo')}
              >
                Try Demo
              </Button>
            </Space>
          ) : (
            <Button 
              type="primary" 
              size="large" 
              style={{ 
                height: 50, 
                padding: '0 30px', 
                fontSize: '16px',
                borderRadius: '8px'
              }}
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          )}
        </div>

        {/* Market Overview */}
        <div style={{ padding: '60px 50px', backgroundColor: themeMode === 'dark' ? '#141414' : '#fafafa' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
              Live Market Data
            </Title>
            
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="S&P 500"
                    value={marketStats.sp500.value}
                    precision={2}
                    valueStyle={{ color: marketStats.sp500.change >= 0 ? '#3f8600' : '#cf1322' }}
                    prefix={marketStats.sp500.change >= 0 ? <RiseOutlined /> : <FallOutlined />}
                    suffix={`(${marketStats.sp500.changePercent >= 0 ? '+' : ''}${marketStats.sp500.changePercent}%)`}
                  />
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="NASDAQ"
                    value={marketStats.nasdaq.value}
                    precision={2}
                    valueStyle={{ color: marketStats.nasdaq.change >= 0 ? '#3f8600' : '#cf1322' }}
                    prefix={marketStats.nasdaq.change >= 0 ? <RiseOutlined /> : <FallOutlined />}
                    suffix={`(${marketStats.nasdaq.changePercent >= 0 ? '+' : ''}${marketStats.nasdaq.changePercent}%)`}
                  />
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Dow Jones"
                    value={marketStats.dow.value}
                    precision={2}
                    valueStyle={{ color: marketStats.dow.change >= 0 ? '#3f8600' : '#cf1322' }}
                    prefix={marketStats.dow.change >= 0 ? <RiseOutlined /> : <FallOutlined />}
                    suffix={`(${marketStats.dow.changePercent >= 0 ? '+' : ''}${marketStats.dow.changePercent}%)`}
                  />
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="VIX"
                    value={marketStats.vix.value}
                    precision={2}
                    valueStyle={{ color: marketStats.vix.change >= 0 ? '#cf1322' : '#3f8600' }}
                    prefix={marketStats.vix.change >= 0 ? <RiseOutlined /> : <FallOutlined />}
                    suffix={`(${marketStats.vix.changePercent >= 0 ? '+' : ''}${marketStats.vix.changePercent}%)`}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </div>

        {/* Features Section */}
        <div style={{ padding: '80px 50px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>
              Why Choose Our Platform
            </Title>
            <Paragraph style={{ 
              textAlign: 'center', 
              fontSize: '16px', 
              color: '#666', 
              marginBottom: 60 
            }}>
              Built for professional traders and institutional investors
            </Paragraph>
            
            <Row gutter={[40, 40]}>
              {features.map((feature, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card 
                    hoverable
                    style={{ 
                      textAlign: 'center', 
                      height: '100%',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div style={{ marginBottom: 16 }}>
                      {feature.icon}
                    </div>
                    <Title level={4}>{feature.title}</Title>
                    <Paragraph style={{ color: '#666' }}>
                      {feature.description}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ 
          padding: '60px 50px', 
          backgroundColor: themeMode === 'dark' ? '#141414' : '#f0f2f5' 
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Row gutter={[48, 48]} align="middle">
              <Col xs={24} lg={12}>
                <Title level={2}>Trusted by Traders Worldwide</Title>
                <Paragraph style={{ fontSize: '16px', marginBottom: 32 }}>
                  Join thousands of professional traders who trust our platform 
                  for their daily trading operations.
                </Paragraph>
                
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <Statistic
                      title="Active Traders"
                      value={25000}
                      prefix={<TeamOutlined />}
                      suffix="+"
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Daily Volume"
                      value={2.5}
                      prefix={<DollarOutlined />}
                      suffix="B+"
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Uptime"
                      value={99.99}
                      suffix="%"
                      precision={2}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Countries"
                      value={150}
                      suffix="+"
                    />
                  </Col>
                </Row>
              </Col>
              
              <Col xs={24} lg={12}>
                <Card title="Recent Platform Updates" style={{ height: '100%' }}>
                  <Timeline>
                    {recentUpdates.map((update, index) => (
                      <Timeline.Item 
                        key={index}
                        dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                      >
                        <div>
                          <Text strong>{update.title}</Text>
                          <br />
                          <Text type="secondary">{update.description}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {update.time}
                          </Text>
                        </div>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Card>
              </Col>
            </Row>
          </div>
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div style={{
            padding: '80px 50px',
            textAlign: 'center',
            background: themeMode === 'dark' 
              ? 'linear-gradient(135deg, #2f2f2f 0%, #1f1f1f 100%)'
              : 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            color: 'white'
          }}>
            <Title level={2} style={{ color: 'white', marginBottom: 16 }}>
              Ready to Start Trading?
            </Title>
            <Paragraph style={{ 
              fontSize: '18px', 
              color: 'rgba(255,255,255,0.9)', 
              marginBottom: 32 
            }}>
              Create your account in minutes and start trading with professional tools.
            </Paragraph>
            
            <Space size="large">
              <Button 
                type="primary" 
                size="large" 
                style={{ 
                  height: 50, 
                  padding: '0 30px', 
                  fontSize: '16px',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  borderColor: 'white',
                  color: '#667eea'
                }}
                onClick={() => navigate('/login')}
              >
                Get Started Free
              </Button>
              <Button 
                size="large" 
                style={{ 
                  height: 50, 
                  padding: '0 30px', 
                  fontSize: '16px',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white'
                }}
                onClick={() => navigate('/contact')}
              >
                Contact Sales
              </Button>
            </Space>
          </div>
        )}
      </Content>

      {/* Footer */}
      <Footer style={{ 
        textAlign: 'center', 
        backgroundColor: themeMode === 'dark' ? '#000' : '#001529',
        color: 'rgba(255,255,255,0.65)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 0' }}>
          <Row gutter={[48, 32]}>
            <Col xs={24} sm={8}>
              <Title level={4} style={{ color: 'white' }}>TradingHub</Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.65)' }}>
                Professional trading platform for modern investors
              </Paragraph>
            </Col>
            
            <Col xs={24} sm={8}>
              <Title level={5} style={{ color: 'white' }}>Platform</Title>
              <div style={{ lineHeight: 2 }}>
                <div><a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Trading Tools</a></div>
                <div><a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Market Data</a></div>
                <div><a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>API Access</a></div>
                <div><a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Mobile App</a></div>
              </div>
            </Col>
            
            <Col xs={24} sm={8}>
              <Title level={5} style={{ color: 'white' }}>Support</Title>
              <div style={{ lineHeight: 2 }}>
                <div><a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Help Center</a></div>
                <div><a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Contact Us</a></div>
                <div><a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>System Status</a></div>
                <div><a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Security</a></div>
              </div>
            </Col>
          </Row>
          
          <Divider style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
          
          <div style={{ color: 'rgba(255,255,255,0.45)' }}>
            © 2024 TradingHub. All rights reserved. | 
            <a href="#" style={{ color: 'rgba(255,255,255,0.65)', marginLeft: 8 }}>Privacy Policy</a> | 
            <a href="#" style={{ color: 'rgba(255,255,255,0.65)', marginLeft: 8 }}>Terms of Service</a>
          </div>
        </div>
      </Footer>
    </Layout>
  );
}