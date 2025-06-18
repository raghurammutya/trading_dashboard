// src/components/AccountOverview.tsx
import React, { useMemo } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Space, Button, Spin } from 'antd';
import { RiseOutlined, FallOutlined, UserOutlined, SyncOutlined } from '@ant-design/icons';
import { useAccounts, usePositions, useOrders, useMargins } from '../hooks/useMockTradeData';

interface AccountOverviewProps {
  organizationId: string;
}

const AccountOverview: React.FC<AccountOverviewProps> = ({ organizationId }) => {
  const { data: accounts, isLoading: accountsLoading, refetch } = useAccounts(organizationId);

  // Get all user data at the top level (not inside map)
  const user1Positions = usePositions(organizationId, 'user_001');
  const user1Orders = useOrders(organizationId, 'user_001');
  const user1Margins = useMargins(organizationId, 'user_001');

  const user2Positions = usePositions(organizationId, 'user_002');
  const user2Orders = useOrders(organizationId, 'user_002');
  const user2Margins = useMargins(organizationId, 'user_002');

  const user3Positions = usePositions(organizationId, 'user_003');
  const user3Orders = useOrders(organizationId, 'user_003');
  const user3Margins = useMargins(organizationId, 'user_003');

  // Create a lookup for user data
  const userDataLookup = useMemo(() => ({
    'user_001': {
      positions: user1Positions.data || [],
      orders: user1Orders.data || [],
      margins: user1Margins.data || []
    },
    'user_002': {
      positions: user2Positions.data || [],
      orders: user2Orders.data || [],
      margins: user2Margins.data || []
    },
    'user_003': {
      positions: user3Positions.data || [],
      orders: user3Orders.data || [],
      margins: user3Margins.data || []
    }
  }), [
    user1Positions.data, user1Orders.data, user1Margins.data,
    user2Positions.data, user2Orders.data, user2Margins.data,
    user3Positions.data, user3Orders.data, user3Margins.data
  ]);

  // Calculate account data using the lookup
  const accountsData = useMemo(() => {
    if (!accounts) return [];
    
    return accounts.map((account: any) => {
      const userData = userDataLookup[account.user_id as keyof typeof userDataLookup];
      
      const totalPnL = userData.positions.reduce((sum: number, pos: any) => sum + (pos.pnl || 0), 0);
      const activeOrders = userData.orders.filter((order: any) => order.status === 'OPEN' || order.status === 'PENDING').length;
      const availableMargin = userData.margins.reduce((sum: number, margin: any) => sum + (margin.available || 0), 0);

      return {
        ...account,
        totalPnL,
        activeOrders,
        availableMargin,
        totalPositions: userData.positions.length,
      };
    });
  }, [accounts, userDataLookup]);

  // Calculate totals
  const totalStats = useMemo(() => {
    return accountsData.reduce(
      (acc: any, account: any) => ({
        totalPnL: acc.totalPnL + account.totalPnL,
        totalMargin: acc.totalMargin + account.availableMargin,
        totalActiveOrders: acc.totalActiveOrders + account.activeOrders,
        totalPositions: acc.totalPositions + account.totalPositions,
      }),
      { totalPnL: 0, totalMargin: 0, totalActiveOrders: 0, totalPositions: 0 }
    );
  }, [accountsData]);

  const columns = [
    {
      title: 'Account',
      dataIndex: 'pseudo_account',
      key: 'account',
      render: (text: string) => (
        <Space>
          <UserOutlined />
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: 'P&L',
      dataIndex: 'totalPnL',
      key: 'pnl',
      render: (value: number) => (
        <Statistic
          value={value}
          precision={2}
          valueStyle={{ 
            color: value >= 0 ? '#3f8600' : '#cf1322',
            fontSize: '14px'
          }}
          prefix={value >= 0 ? <RiseOutlined /> : <FallOutlined />}
          suffix="₹"
        />
      ),
      sorter: (a: any, b: any) => a.totalPnL - b.totalPnL,
    },
    {
      title: 'Available Margin',
      dataIndex: 'availableMargin',
      key: 'margin',
      render: (value: number) => (
        <Statistic
          value={value}
          precision={0}
          valueStyle={{ fontSize: '14px' }}
          prefix="₹"
        />
      ),
      sorter: (a: any, b: any) => a.availableMargin - b.availableMargin,
    },
    {
      title: 'Active Orders',
      dataIndex: 'activeOrders',
      key: 'orders',
      render: (value: number) => (
        <Tag color={value > 0 ? 'blue' : 'default'}>
          {value} {value === 1 ? 'Order' : 'Orders'}
        </Tag>
      ),
    },
    {
      title: 'Positions',
      dataIndex: 'totalPositions',
      key: 'positions',
      render: (value: number) => <Tag color="green">{value}</Tag>,
    },
  ];

  const isLoading = accountsLoading || 
    user1Positions.isLoading || user1Orders.isLoading || user1Margins.isLoading ||
    user2Positions.isLoading || user2Orders.isLoading || user2Margins.isLoading ||
    user3Positions.isLoading || user3Orders.isLoading || user3Margins.isLoading;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p style={{ marginTop: '16px' }}>Loading account data...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total P&L"
              value={totalStats.totalPnL}
              precision={2}
              valueStyle={{ 
                color: totalStats.totalPnL >= 0 ? '#3f8600' : '#cf1322',
                fontSize: '24px'
              }}
              prefix={totalStats.totalPnL >= 0 ? <RiseOutlined /> : <FallOutlined />}
              suffix="₹"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Available Margin"
              value={totalStats.totalMargin}
              precision={0}
              valueStyle={{ fontSize: '24px' }}
              prefix="₹"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Active Orders"
              value={totalStats.totalActiveOrders}
              valueStyle={{ fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total Positions"
              value={totalStats.totalPositions}
              valueStyle={{ fontSize: '24px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Accounts Table */}
      <Card 
        title="Account Details" 
        bordered={false}
        extra={
          <Button 
            icon={<SyncOutlined />} 
            onClick={() => refetch()}
            loading={isLoading}
          >
            Refresh
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={accountsData}
          rowKey="pseudo_account"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default AccountOverview;
