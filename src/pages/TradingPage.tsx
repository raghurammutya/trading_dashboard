import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Tag, 
  Space, 
  Typography,
  Row,
  Col,
  message,
  InputNumber,
  Statistic,
  Alert,
  Tabs,
  List,
  Progress,
  Tooltip,
  Switch
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  StockOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  ReloadOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface Trade {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  order_type: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
  quantity: number;
  price?: number;
  stop_price?: number;
  status: 'PENDING' | 'FILLED' | 'PARTIALLY_FILLED' | 'CANCELED' | 'REJECTED';
  filled_quantity: number;
  avg_fill_price?: number;
  time_in_force: 'DAY' | 'GTC' | 'IOC' | 'FOK';
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface Position {
  symbol: string;
  quantity: number;
  avg_cost: number;
  current_price: number;
  market_value: number;
  unrealized_pnl: number;
  unrealized_pnl_percent: number;
  day_change: number;
  day_change_percent: number;
}

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  market_cap: number;
  pe_ratio?: number;
}

export default function TradingPage() {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [realTimeData, setRealTimeData] = useState(true);

  // Mock data - replace with real API calls
  useEffect(() => {
    const mockTrades: Trade[] = [
      {
        id: '1',
        symbol: 'AAPL',
        side: 'BUY',
        order_type: 'LIMIT',
        quantity: 100,
        price: 150.25,
        status: 'FILLED',
        filled_quantity: 100,
        avg_fill_price: 150.20,
        time_in_force: 'DAY',
        created_at: '2024-01-15T09:30:00Z',
        updated_at: '2024-01-15T09:31:00Z',
        user_id: user?.id || '1'
      },
      {
        id: '2',
        symbol: 'GOOGL',
        side: 'SELL',
        order_type: 'MARKET',
        quantity: 50,
        status: 'PENDING',
        filled_quantity: 0,
        time_in_force: 'DAY',
        created_at: '2024-01-15T10:15:00Z',
        updated_at: '2024-01-15T10:15:00Z',
        user_id: user?.id || '1'
      },
      {
        id: '3',
        symbol: 'TSLA',
        side: 'BUY',
        order_type: 'STOP_LIMIT',
        quantity: 25,
        price: 200.00,
        stop_price: 195.00,
        status: 'PARTIALLY_FILLED',
        filled_quantity: 15,
        avg_fill_price: 199.85,
        time_in_force: 'GTC',
        created_at: '2024-01-15T11:00:00Z',
        updated_at: '2024-01-15T11:30:00Z',
        user_id: user?.id || '1'
      }
    ];

    const mockPositions: Position[] = [
      {
        symbol: 'AAPL',
        quantity: 100,
        avg_cost: 150.20,
        current_price: 152.75,
        market_value: 15275,
        unrealized_pnl: 255,
        unrealized_pnl_percent: 1.70,
        day_change: 1.25,
        day_change_percent: 0.82
      },
      {
        symbol: 'MSFT',
        quantity: 75,
        avg_cost: 340.50,
        current_price: 338.20,
        market_value: 25365,
        unrealized_pnl: -172.5,
        unrealized_pnl_percent: -0.68,
        day_change: -2.30,
        day_change_percent: -0.67
      },
      {
        symbol: 'TSLA',
        quantity: 15,
        avg_cost: 199.85,
        current_price: 205.10,
        market_value: 3076.5,
        unrealized_pnl: 78.75,
        unrealized_pnl_percent: 2.63,
        day_change: 5.25,
        day_change_percent: 2.63
      }
    ];

    const mockMarketData: MarketData[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 152.75,
        change: 1.25,
        change_percent: 0.82,
        volume: 89456789,
        market_cap: 2.4e12,
        pe_ratio: 28.5
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 142.30,
        change: -1.80,
        change_percent: -1.25,
        volume: 45123456,
        market_cap: 1.8e12,
        pe_ratio: 24.2
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 338.20,
        change: -2.30,
        change_percent: -0.67,
        volume: 32789123,
        market_cap: 2.5e12,
        pe_ratio: 32.1
      },
      {
        symbol: 'TSLA',
        name: 'Tesla, Inc.',
        price: 205.10,
        change: 5.25,
        change_percent: 2.63,
        volume: 156789234,
        market_cap: 6.5e11,
        pe_ratio: 45.8
      }
    ];

    setTrades(mockTrades);
    setPositions(mockPositions);
    setMarketData(mockMarketData);
  }, [user]);

  const handlePlaceOrder = useCallback(() => {
    setIsOrderModalVisible(true);
    form.resetFields();
  }, [form]);

  const handleSubmitOrder = async (values: any) => {
    setLoading(true);
    try {
      // TODO: Integrate with trade_service API
      console.log('Placing order:', values);
      
      const newTrade: Trade = {
        id: Date.now().toString(),
        user_id: user?.id || '1',
        status: 'PENDING',
        filled_quantity: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...values
      };
      
      setTrades([newTrade, ...trades]);
      setIsOrderModalVisible(false);
      form.resetFields();
      message.success('Order placed successfully!');
    } catch (error) {
      message.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      // TODO: Integrate with trade_service API
      console.log('Canceling order:', orderId);
      
      const updatedTrades = trades.map(trade =>
        trade.id === orderId
          ? { ...trade, status: 'CANCELED' as const, updated_at: new Date().toISOString() }
          : trade
      );
      setTrades(updatedTrades);
      message.success('Order canceled successfully!');
    } catch (error) {
      message.error('Failed to cancel order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FILLED': return 'green';
      case 'PARTIALLY_FILLED': return 'orange';
      case 'PENDING': return 'blue';
      case 'CANCELED': return 'default';
      case 'REJECTED': return 'red';
      default: return 'default';
    }
  };

  const getSideColor = (side: string) => {
    return side === 'BUY' ? 'green' : 'red';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const tradeColumns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (symbol: string) => <Text strong>{symbol}</Text>,
    },
    {
      title: 'Side',
      dataIndex: 'side',
      key: 'side',
      render: (side: string) => (
        <Tag color={getSideColor(side)}>{side}</Tag>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'order_type',
      key: 'order_type',
    },
    {
      title: 'Quantity',
      key: 'quantity',
      render: (record: Trade) => (
        <div>
          <Text>{record.filled_quantity}/{record.quantity}</Text>
          {record.status === 'PARTIALLY_FILLED' && (
            <Progress 
              percent={(record.filled_quantity / record.quantity) * 100}
              size="small"
              showInfo={false}
              style={{ marginTop: 4 }}
            />
          )}
        </div>
      ),
    },
    {
      title: 'Price',
      key: 'price',
      render: (record: Trade) => (
        <div>
          {record.price && <Text>{formatCurrency(record.price)}</Text>}
          {record.avg_fill_price && (
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Avg: {formatCurrency(record.avg_fill_price)}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Time',
      key: 'time',
      render: (record: Trade) => (
        <div>
          <Text style={{ fontSize: 12 }}>
            {moment(record.created_at).format('HH:mm:ss')}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {moment(record.created_at).format('MMM DD')}
          </Text>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Trade) => (
        <Space>
          {(record.status === 'PENDING' || record.status === 'PARTIALLY_FILLED') && (
            <Button
              type="text"
              size="small"
              danger
              icon={<StopOutlined />}
              onClick={() => handleCancelOrder(record.id)}
            >
              Cancel
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const positionColumns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (symbol: string) => <Text strong>{symbol}</Text>,
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
      title: 'Unrealized P&L',
      key: 'unrealized_pnl',
      render: (record: Position) => (
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
      render: (record: Position) => (
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
      title: 'Actions',
      key: 'actions',
      render: (record: Position) => (
        <Space>
          <Button
            type="text"
            size="small"
            onClick={() => {
              setSelectedSymbol(record.symbol);
              setOrderSide('SELL');
              setIsOrderModalVisible(true);
            }}
          >
            Sell
          </Button>
          <Button
            type="text"
            size="small"
            onClick={() => {
              setSelectedSymbol(record.symbol);
              setOrderSide('BUY');
              setIsOrderModalVisible(true);
            }}
          >
            Buy More
          </Button>
        </Space>
      ),
    },
  ];

  const marketDataColumns = [
    {
      title: 'Symbol',
      key: 'symbol',
      render: (record: MarketData) => (
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
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Change',
      key: 'change',
      render: (record: MarketData) => (
        <div>
          <Text style={{ color: record.change >= 0 ? '#3f8600' : '#cf1322' }}>
            {record.change >= 0 ? '+' : ''}{formatCurrency(record.change)}
          </Text>
          <br />
          <Text 
            type="secondary" 
            style={{ 
              fontSize: 12,
              color: record.change_percent >= 0 ? '#3f8600' : '#cf1322'
            }}
          >
            {formatPercent(record.change_percent)}
          </Text>
        </div>
      ),
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
      render: (volume: number) => (
        volume / 1000000 >= 1 ? `${(volume / 1000000).toFixed(1)}M` : `${(volume / 1000).toFixed(0)}K`
      ),
    },
    {
      title: 'Market Cap',
      dataIndex: 'market_cap',
      key: 'market_cap',
      render: (cap: number) => `$${(cap / 1e12).toFixed(1)}T`,
    },
    {
      title: 'P/E',
      dataIndex: 'pe_ratio',
      key: 'pe_ratio',
      render: (pe: number | undefined) => pe ? pe.toFixed(1) : 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: MarketData) => (
        <Space>
          <Button
            type="text"
            size="small"
            onClick={() => {
              setSelectedSymbol(record.symbol);
              setOrderSide('BUY');
              setIsOrderModalVisible(true);
            }}
          >
            Buy
          </Button>
          <Button
            type="text"
            size="small"
            onClick={() => {
              setSelectedSymbol(record.symbol);
              setOrderSide('SELL');
              setIsOrderModalVisible(true);
            }}
          >
            Sell
          </Button>
        </Space>
      ),
    },
  ];

  // Calculate portfolio summary
  const portfolioValue = positions.reduce((total, pos) => total + pos.market_value, 0);
  const totalPnL = positions.reduce((total, pos) => total + pos.unrealized_pnl, 0);
  const totalPnLPercent = portfolioValue > 0 ? (totalPnL / (portfolioValue - totalPnL)) * 100 : 0;

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Trading</Title>
        <Space>
          <Switch
            checked={realTimeData}
            onChange={setRealTimeData}
            checkedChildren="Live"
            unCheckedChildren="Static"
          />
          <Button icon={<ReloadOutlined />}>
            Refresh
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </Space>
      </div>

      {/* Portfolio Summary */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Portfolio Value"
              value={portfolioValue}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
              prefix={<DollarOutlined />}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total P&L"
              value={totalPnL}
              precision={2}
              valueStyle={{ color: totalPnL >= 0 ? '#3f8600' : '#cf1322' }}
              prefix={totalPnL >= 0 ? <RiseOutlined /> : <FallOutlined />}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total P&L %"
              value={totalPnLPercent}
              precision={2}
              valueStyle={{ color: totalPnLPercent >= 0 ? '#3f8600' : '#cf1322' }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="positions">
        <TabPane tab="Positions" key="positions">
          <Card>
            <Table
              columns={positionColumns}
              dataSource={positions}
              rowKey="symbol"
              pagination={false}
            />
          </Card>
        </TabPane>

        <TabPane tab="Orders" key="orders">
          <Card>
            <Table
              columns={tradeColumns}
              dataSource={trades}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} orders`
              }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Market Data" key="market">
          <Card>
            <Table
              columns={marketDataColumns}
              dataSource={marketData}
              rowKey="symbol"
              pagination={false}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Place Order Modal */}
      <Modal
        title="Place Order"
        open={isOrderModalVisible}
        onCancel={() => setIsOrderModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitOrder}
          initialValues={{
            symbol: selectedSymbol,
            side: orderSide,
            order_type: 'LIMIT',
            time_in_force: 'DAY'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="symbol"
                label="Symbol"
                rules={[{ required: true, message: 'Please enter symbol' }]}
              >
                <Input placeholder="e.g., AAPL" style={{ textTransform: 'uppercase' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="side"
                label="Side"
                rules={[{ required: true, message: 'Please select side' }]}
              >
                <Select>
                  <Option value="BUY">Buy</Option>
                  <Option value="SELL">Sell</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="order_type"
                label="Order Type"
                rules={[{ required: true, message: 'Please select order type' }]}
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
                name="time_in_force"
                label="Time in Force"
                rules={[{ required: true, message: 'Please select time in force' }]}
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
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              placeholder="Number of shares"
            />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.order_type !== currentValues.order_type
            }
          >
            {({ getFieldValue }) => {
              const orderType = getFieldValue('order_type');
              return (
                <>
                  {(orderType === 'LIMIT' || orderType === 'STOP_LIMIT') && (
                    <Form.Item
                      name="price"
                      label="Limit Price"
                      rules={[{ required: true, message: 'Please enter limit price' }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0.01}
                        step={0.01}
                        placeholder="Price per share"
                        formatter={(value) => `$ ${value}`}
                        parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, '')) as any}
                      />
                    </Form.Item>
                  )}
                  
                  {(orderType === 'STOP' || orderType === 'STOP_LIMIT') && (
                    <Form.Item
                      name="stop_price"
                      label="Stop Price"
                      rules={[{ required: true, message: 'Please enter stop price' }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0.01}
                        step={0.01}
                        placeholder="Stop trigger price"
                        formatter={(value) => `$ ${value}`}
                        parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, '')) as any}
                      />
                    </Form.Item>
                  )}
                </>
              );
            }}
          </Form.Item>

          <Alert
            message="Risk Warning"
            description="Trading involves substantial risk of loss and is not suitable for all investors. Past performance does not guarantee future results."
            type="warning"
            style={{ marginBottom: 16 }}
            showIcon
          />

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsOrderModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Place Order
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}