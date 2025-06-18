import React from 'react';
import { Row, Col, Card, Statistic, Typography, Alert, Spin, Progress } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined, TrophyOutlined, TeamOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AccountOverview from '../components/AccountOverview';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const { user } = useAuth();
  const { themeMode } = useTheme();

  // Mock data for dashboard stats
  const dashboardStats = {
    totalValue: 125420.50,
    dailyPnL: 2340.80,
    dailyPnLPercent: 1.87,
    weeklyPnL: 8420.30,
    weeklyPnLPercent: 7.25,
    activePositions: 12,
    totalUsers: 156,
    apiCalls: 23450
  };

  const recentActivities = [
    { id: 1, action: 'Login', time: '2 minutes ago', status: 'success' },
    { id: 2, action: 'API Key Created', time: '1 hour ago', status: 'info' },
    { id: 3, action: 'Permission Updated', time: '3 hours ago', status: 'warning' },
    { id: 4, action: 'User Registered', time: '5 hours ago', status: 'success' },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          Welcome back, {user?.first_name}! 👋
        </Title>
        <Text type="secondary">
          Here's what's happening with your trading platform today
        </Text>
      </div>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="trading-card animate-slide-in">
            <Statistic
              title="Portfolio Value"
              value={dashboardStats.totalValue}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="trading-card animate-slide-in">
            <Statistic
              title="Daily P&L"
              value={dashboardStats.dailyPnL}
              precision={2}
              valueStyle={{ 
                color: dashboardStats.dailyPnL > 0 ? '#3f8600' : '#cf1322' 
              }}
              prefix={
                dashboardStats.dailyPnL > 0 ? 
                <ArrowUpOutlined /> : 
                <ArrowDownOutlined />
              }
              suffix={`USD (${dashboardStats.dailyPnLPercent}%)`}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="trading-card animate-slide-in">
            <Statistic
              title="Active Positions"
              value={dashboardStats.activePositions}
              valueStyle={{ color: '#1890ff' }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="trading-card animate-slide-in">
            <Statistic
              title="Total Users"
              value={dashboardStats.totalUsers}
              valueStyle={{ color: '#722ed1' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        {/* Portfolio Overview */}
        <Col xs={24} lg={16}>
          <Card 
            className="glass-card animate-fade-in"
            title="Portfolio Overview" 
            style={{ marginBottom: 16 }}
          >
            <AccountOverview organizationId="default_org" />
          </Card>
        </Col>

        {/* Quick Actions & Recent Activity */}
        <Col xs={24} lg={8}>
          {/* User Progress */}
          <Card 
            className="glass-card animate-fade-in"
            title="Account Setup" 
            style={{ marginBottom: 16 }}
          >
            <div style={{ marginBottom: 16 }}>
              <Text>Profile Completion</Text>
              <Progress 
                percent={85} 
                status="active"
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Text>Security Setup</Text>
              <Progress 
                percent={60} 
                status="normal"
                strokeColor="#faad14"
              />
            </div>
            
            <div>
              <Text>API Integration</Text>
              <Progress 
                percent={40} 
                status="normal"
              />
            </div>
          </Card>

          {/* Recent Activities */}
          <Card 
            className="glass-card animate-fade-in"
            title="Recent Activity"
            size="small"
          >
            {recentActivities.map(activity => (
              <div 
                key={activity.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid #f0f0f0'
                }}
              >
                <div>
                  <Text strong>{activity.action}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {activity.time}
                  </Text>
                </div>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 
                    activity.status === 'success' ? '#52c41a' :
                    activity.status === 'warning' ? '#faad14' :
                    activity.status === 'error' ? '#ff4d4f' : '#1890ff'
                }} />
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* System Status */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Alert
            message="System Status: All Services Operational"
            description="All trading services are running normally. Last updated: 2 minutes ago"
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />
        </Col>
      </Row>
    </div>
  );
}