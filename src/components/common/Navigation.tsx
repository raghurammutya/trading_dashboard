import React, { useMemo, useCallback } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography, Switch, Badge, Select, Tooltip } from 'antd';
import { 
  UserOutlined, 
  SettingOutlined, 
  LogoutOutlined, 
  BellOutlined,
  SunOutlined,
  MoonOutlined,
  KeyOutlined,
  SafetyCertificateOutlined,
  DashboardOutlined,
  TeamOutlined,
  StockOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider } = Layout;
const { Text } = Typography;

interface NavigationProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

function Navigation({ collapsed, onCollapse }: NavigationProps) {
  const { user, logout } = useAuth();
  const { themeMode, toggleTheme, setTheme, availableThemes } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = useCallback(({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        navigate('/profile');
        break;
      case 'api-keys':
        navigate('/api-keys');
        break;
      case 'permissions':
        navigate('/permissions');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'logout':
        logout();
        break;
      default:
        break;
    }
  }, [navigate, logout]);

  const userMenu = useMemo(() => (
    <Menu onClick={handleMenuClick} style={{ minWidth: 200 }}>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        My Profile
      </Menu.Item>
      <Menu.Item key="api-keys" icon={<KeyOutlined />}>
        API Keys
      </Menu.Item>
      <Menu.Item key="permissions" icon={<SafetyCertificateOutlined />}>
        Permissions
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
        Sign Out
      </Menu.Item>
    </Menu>
  ), [handleMenuClick]);

  const sidebarItems = useMemo(() => [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/portfolio',
      icon: <BarChartOutlined />,
      label: 'Portfolio',
    },
    {
      key: '/trading',
      icon: <StockOutlined />,
      label: 'Trading',
    },
    {
      key: '/permissions',
      icon: <SafetyCertificateOutlined />,
      label: 'Permissions',
    },
    {
      key: '/users',
      icon: <TeamOutlined />,
      label: 'Users',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ], []);

  const handleSidebarClick = useCallback(({ key }: { key: string }) => {
    navigate(key);
  }, [navigate]);

  return (
    <>
      {/* Sidebar */}
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={onCollapse}
        style={{ 
          background: themeMode === 'dark' ? '#001529' : '#ffffff',
          borderRight: themeMode === 'dark' ? 'none' : '1px solid #f0f0f0',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 10
        }}
        theme={themeMode === 'light' ? 'light' : 'dark'}
      >
        {/* Logo */}
        <div style={{ 
          height: '64px', 
          margin: '16px', 
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: themeMode === 'dark' ? 'white' : '#1890ff',
          fontWeight: 'bold',
          fontSize: collapsed ? '16px' : '14px'
        }}>
          {collapsed ? '📈' : '📈 TradingHub'}
        </div>

        {/* Navigation Menu */}
        <Menu
          theme={themeMode === 'light' ? 'light' : 'dark'}
          selectedKeys={[location.pathname]}
          mode="inline"
          items={sidebarItems}
          onClick={handleSidebarClick}
        />
      </Sider>

      {/* Top Header */}
      <Header style={{ 
        padding: '0 24px', 
        background: themeMode === 'dark' ? '#141414' : '#ffffff',
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderBottom: themeMode === 'dark' ? '1px solid #303030' : '1px solid #f0f0f0',
        position: 'fixed',
        top: 0,
        right: 0,
        left: collapsed ? 80 : 200,
        zIndex: 9,
        height: 64
      }}>
        {/* Left side - Page title or breadcrumb */}
        <div>
          <Typography.Title 
            level={4} 
            style={{ 
              margin: 0,
              color: themeMode === 'dark' ? '#ffffff' : '#000000'
            }}
          >
            Trading Dashboard
          </Typography.Title>
        </div>

        {/* Right side - User controls */}
        <Space size="large">
          {/* Theme Selector */}
          <Tooltip title="Switch Theme">
            <Select
              value={themeMode}
              onChange={setTheme}
              size="small"
              style={{ minWidth: 120 }}
              options={availableThemes.map(theme => ({
                label: theme.displayName,
                value: theme.name
              }))}
            />
          </Tooltip>

          {/* Notifications */}
          <Badge count={3} size="small">
            <BellOutlined 
              style={{ 
                fontSize: '18px',
                color: themeMode === 'dark' ? '#ffffff' : '#000000',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/notifications')}
            />
          </Badge>

          {/* User Menu */}
          <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar 
                size="small" 
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff' }}
              />
              <Space direction="vertical" size={0}>
                <Text strong style={{ 
                  color: themeMode === 'dark' ? '#ffffff' : '#000000',
                  fontSize: '14px',
                  lineHeight: 1
                }}>
                  {user?.first_name} {user?.last_name}
                </Text>
                <Text type="secondary" style={{ 
                  fontSize: '12px',
                  lineHeight: 1
                }}>
                  {user?.role}
                </Text>
              </Space>
            </Space>
          </Dropdown>
        </Space>
      </Header>
    </>
  );
}

export default React.memo(Navigation);