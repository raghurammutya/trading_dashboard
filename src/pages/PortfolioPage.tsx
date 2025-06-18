import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Statistic,
  Table,
  Select,
  Button,
  Space,
  Alert,
  Tabs,
  Progress,
  Tag,
  DatePicker,
  Divider
} from 'antd';
import { 
  RiseOutlined, 
  FallOutlined,
  DollarOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  DownloadOutlined,
  ReloadOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface Holdings {
  symbol: string;
  name: string;
  quantity: number;
  avg_cost: number;
  current_price: number;
  market_value: number;
  unrealized_pnl: number;
  unrealized_pnl_percent: number;
  day_change: number;
  day_change_percent: number;
  weight: number;
  sector: string;
  dividend_yield?: number;
}

interface PortfolioMetrics {
  total_value: number;
  cash_balance: number;
  invested_amount: number;
  total_pnl: number;
  total_pnl_percent: number;
  day_change: number;
  day_change_percent: number;
  buying_power: number;
  margin_used: number;
}

interface PerformanceData {
  date: string;
  portfolio_value: number;
  benchmark_value: number;
  daily_return: number;
  cumulative_return: number;
}

// Opstrat integration placeholder - in real implementation, you would install and import opstrat
const OpstratPayoffChart = ({ strategies }: { strategies: any[] }) => {
  return (
    <div style={{ 
      height: 400, 
      border: '1px dashed #d9d9d9', 
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      background: '#fafafa'
    }}>
      <BarChartOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
      <Text type="secondary">Opstrat Payoff Chart</Text>
      <Text type="secondary" style={{ fontSize: 12 }}>
        Install and configure opstrat package for options payoff visualization
      </Text>
    </div>
  );
};

export default function PortfolioPage() {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState<Holdings[]>([]);
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [timeRange, setTimeRange] = useState('1M');
  const [loading, setLoading] = useState(false);

  // Mock data - replace with real API calls
  useEffect(() => {
    const mockHoldings: Holdings[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        quantity: 100,
        avg_cost: 150.20,
        current_price: 152.75,
        market_value: 15275,
        unrealized_pnl: 255,
        unrealized_pnl_percent: 1.70,
        day_change: 125,
        day_change_percent: 0.82,
        weight: 35.2,
        sector: 'Technology',
        dividend_yield: 0.52
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        quantity: 75,
        avg_cost: 340.50,
        current_price: 338.20,
        market_value: 25365,
        unrealized_pnl: -172.5,
        unrealized_pnl_percent: -0.68,
        day_change: -172.5,
        day_change_percent: -0.67,
        weight: 28.8,
        sector: 'Technology'
      },
      {
        symbol: 'TSLA',
        name: 'Tesla, Inc.',
        quantity: 15,
        avg_cost: 199.85,
        current_price: 205.10,
        market_value: 3076.5,
        unrealized_pnl: 78.75,
        unrealized_pnl_percent: 2.63,
        day_change: 78.75,
        day_change_percent: 2.63,
        weight: 12.1,
        sector: 'Automotive'
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        quantity: 25,
        avg_cost: 142.80,
        current_price: 142.30,
        market_value: 3557.5,
        unrealized_pnl: -12.5,
        unrealized_pnl_percent: -0.35,
        day_change: -45,
        day_change_percent: -1.25,
        weight: 8.7,
        sector: 'Technology'
      },
      {
        symbol: 'SPY',
        name: 'SPDR S&P 500 ETF',
        quantity: 50,
        avg_cost: 420.00,
        current_price: 425.80,
        market_value: 21290,
        unrealized_pnl: 290,
        unrealized_pnl_percent: 1.38,
        day_change: 213,
        day_change_percent: 1.01,
        weight: 15.2,
        sector: 'ETF',
        dividend_yield: 1.34
      }
    ];

    const mockMetrics: PortfolioMetrics = {
      total_value: 68563.5,
      cash_balance: 12500,
      invested_amount: 56063.5,
      total_pnl: 439.25,
      total_pnl_percent: 0.79,
      day_change: 199.25,
      day_change_percent: 0.29,
      buying_power: 25000,
      margin_used: 0
    };

    // Generate mock performance data
    const mockPerformance: PerformanceData[] = [];
    const startDate = moment().subtract(30, 'days');
    for (let i = 0; i < 30; i++) {
      const date = startDate.clone().add(i, 'days');
      const randomReturn = (Math.random() - 0.5) * 0.04; // ±2% daily
      const portfolioValue = 68000 + (Math.random() * 2000 - 1000);
      
      mockPerformance.push({
        date: date.format('YYYY-MM-DD'),
        portfolio_value: portfolioValue,
        benchmark_value: 67500 + (Math.random() * 1500 - 750),
        daily_return: randomReturn,
        cumulative_return: i * 0.1 + (Math.random() * 2 - 1)
      });
    }

    setHoldings(mockHoldings);
    setMetrics(mockMetrics);
    setPerformanceData(mockPerformance);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const getSectorColor = (sector: string) => {
    const colors: { [key: string]: string } = {
      'Technology': 'blue',
      'Healthcare': 'green',
      'Finance': 'orange',
      'Energy': 'red',
      'Automotive': 'purple',
      'ETF': 'cyan',
      'Real Estate': 'magenta'
    };
    return colors[sector] || 'default';
  };

  const holdingsColumns = [
    {
      title: 'Symbol',
      key: 'symbol',
      render: (record: Holdings) => (
        <div>
          <Text strong>{record.symbol}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.name}
          </Text>
        </div>
      ),
    },
    {
      title: 'Sector',
      dataIndex: 'sector',
      key: 'sector',
      render: (sector: string) => (
        <Tag color={getSectorColor(sector)}>{sector}</Tag>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Avg Cost',
      dataIndex: 'avg_cost',
      key: 'avg_cost',
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Current Price',
      dataIndex: 'current_price',
      key: 'current_price',
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Market Value',
      dataIndex: 'market_value',
      key: 'market_value',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight: number) => (
        <div>
          <Text>{weight.toFixed(1)}%</Text>
          <Progress 
            percent={weight} 
            size="small" 
            showInfo={false}
            style={{ marginTop: 4 }}
          />
        </div>
      ),
    },
    {
      title: 'Unrealized P&L',
      key: 'unrealized_pnl',
      render: (record: Holdings) => (
        <div>
          <Text style={{ color: record.unrealized_pnl >= 0 ? '#3f8600' : '#cf1322' }}>
            {formatCurrency(record.unrealized_pnl)}
          </Text>
          <br />
          <Text 
            type="secondary" 
            style={{ 
              fontSize: 12,
              color: record.unrealized_pnl_percent >= 0 ? '#3f8600' : '#cf1322'
            }}
          >
            {formatPercent(record.unrealized_pnl_percent)}
          </Text>
        </div>
      ),
    },
    {
      title: 'Day Change',
      key: 'day_change',
      render: (record: Holdings) => (
        <div>
          <Text style={{ color: record.day_change >= 0 ? '#3f8600' : '#cf1322' }}>
            {formatCurrency(record.day_change)}
          </Text>
          <br />
          <Text 
            type="secondary" 
            style={{ 
              fontSize: 12,
              color: record.day_change_percent >= 0 ? '#3f8600' : '#cf1322'
            }}
          >
            {formatPercent(record.day_change_percent)}
          </Text>
        </div>
      ),
    },
    {
      title: 'Dividend Yield',
      dataIndex: 'dividend_yield',
      key: 'dividend_yield',
      render: (yield_rate: number | undefined) => 
        yield_rate ? `${yield_rate.toFixed(2)}%` : 'N/A',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Portfolio</Title>
        <Space>
          <Select
            value={timeRange}
            onChange={setTimeRange}
            style={{ width: 100 }}
          >
            <Option value="1D">1D</Option>
            <Option value="1W">1W</Option>
            <Option value="1M">1M</Option>
            <Option value="3M">3M</Option>
            <Option value="6M">6M</Option>
            <Option value="1Y">1Y</Option>
            <Option value="ALL">ALL</Option>
          </Select>
          <Button icon={<ReloadOutlined />}>
            Refresh
          </Button>
          <Button icon={<DownloadOutlined />}>
            Export
          </Button>
        </Space>
      </div>

      {/* Portfolio Overview */}
      {metrics && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Value"
                value={metrics.total_value}
                precision={2}
                valueStyle={{ color: '#1890ff' }}
                prefix={<DollarOutlined />}
                formatter={(value) => formatCurrency(Number(value))}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total P&L"
                value={metrics.total_pnl}
                precision={2}
                valueStyle={{ color: metrics.total_pnl >= 0 ? '#3f8600' : '#cf1322' }}
                prefix={metrics.total_pnl >= 0 ? <RiseOutlined /> : <FallOutlined />}
                suffix={`(${formatPercent(metrics.total_pnl_percent)})`}
                formatter={(value) => formatCurrency(Number(value))}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Day Change"
                value={metrics.day_change}
                precision={2}
                valueStyle={{ color: metrics.day_change >= 0 ? '#3f8600' : '#cf1322' }}
                prefix={metrics.day_change >= 0 ? <RiseOutlined /> : <FallOutlined />}
                suffix={`(${formatPercent(metrics.day_change_percent)})`}
                formatter={(value) => formatCurrency(Number(value))}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Cash Balance"
                value={metrics.cash_balance}
                precision={2}
                valueStyle={{ color: '#52c41a' }}
                prefix={<DollarOutlined />}
                formatter={(value) => formatCurrency(Number(value))}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Tabs defaultActiveKey="holdings">
        <TabPane tab="Holdings" key="holdings">
          <Card>
            <Table
              columns={holdingsColumns}
              dataSource={holdings}
              rowKey="symbol"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} holdings`
              }}
              summary={(pageData) => {
                const totalValue = pageData.reduce((sum, record) => sum + record.market_value, 0);
                const totalPnL = pageData.reduce((sum, record) => sum + record.unrealized_pnl, 0);
                const totalDayChange = pageData.reduce((sum, record) => sum + record.day_change, 0);
                
                return (
                  <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
                    <Table.Summary.Cell index={0} colSpan={5}>
                      <Text strong>Total</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={5}>
                      <Text strong>{formatCurrency(totalValue)}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6}>
                      <Text>100%</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={7}>
                      <Text 
                        strong 
                        style={{ color: totalPnL >= 0 ? '#3f8600' : '#cf1322' }}
                      >
                        {formatCurrency(totalPnL)}
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={8}>
                      <Text 
                        strong 
                        style={{ color: totalDayChange >= 0 ? '#3f8600' : '#cf1322' }}
                      >
                        {formatCurrency(totalDayChange)}
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={9} />
                  </Table.Summary.Row>
                );
              }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Performance" key="performance">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Portfolio Performance Chart">
                <div style={{ 
                  height: 400, 
                  border: '1px dashed #d9d9d9', 
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  background: '#fafafa'
                }}>
                  <LineChartOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                  <Text type="secondary">Performance Chart</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Integrate with charting library (e.g., Chart.js, Recharts, or TradingView)
                  </Text>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Analytics" key="analytics">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Sector Allocation">
                <div style={{ 
                  height: 300, 
                  border: '1px dashed #d9d9d9', 
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  background: '#fafafa'
                }}>
                  <PieChartOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                  <Text type="secondary">Sector Allocation Chart</Text>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} lg={12}>
              <Card title="Risk Metrics">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text>Beta (vs S&P 500)</Text>
                    <div style={{ float: 'right' }}>
                      <Text strong>1.15</Text>
                    </div>
                  </div>
                  <Divider style={{ margin: '8px 0' }} />
                  
                  <div>
                    <Text>Sharpe Ratio</Text>
                    <div style={{ float: 'right' }}>
                      <Text strong>1.28</Text>
                    </div>
                  </div>
                  <Divider style={{ margin: '8px 0' }} />
                  
                  <div>
                    <Text>Volatility (30d)</Text>
                    <div style={{ float: 'right' }}>
                      <Text strong>18.5%</Text>
                    </div>
                  </div>
                  <Divider style={{ margin: '8px 0' }} />
                  
                  <div>
                    <Text>Max Drawdown</Text>
                    <div style={{ float: 'right' }}>
                      <Text strong style={{ color: '#cf1322' }}>-8.2%</Text>
                    </div>
                  </div>
                  <Divider style={{ margin: '8px 0' }} />
                  
                  <div>
                    <Text>Correlation to Market</Text>
                    <div style={{ float: 'right' }}>
                      <Text strong>0.82</Text>
                    </div>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Options Strategy" key="options">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Alert
                message="Opstrat Integration"
                description="This section demonstrates where opstrat package integration would display options payoff diagrams. Install opstrat and implement custom strategy builders for comprehensive options analysis."
                type="info"
                icon={<InfoCircleOutlined />}
                style={{ marginBottom: 16 }}
                showIcon
              />
            </Col>
            
            <Col span={24}>
              <Card title="Options Payoff Strategy Builder">
                <OpstratPayoffChart strategies={[]} />
                
                <div style={{ marginTop: 16 }}>
                  <Space>
                    <Button type="primary">Add Long Call</Button>
                    <Button>Add Short Put</Button>
                    <Button>Add Covered Call</Button>
                    <Button>Add Iron Condor</Button>
                    <Button>Custom Strategy</Button>
                  </Space>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
}