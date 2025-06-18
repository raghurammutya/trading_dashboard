// src/services/mockDataService.tsx
export const mockAccounts = [
  {
    pseudo_account: 'DEMO_USER_001',
    organization_id: 'default_org',
    user_id: 'user_001',
    status: 'ACTIVE'
  },
  {
    pseudo_account: 'DEMO_USER_002',
    organization_id: 'default_org',
    user_id: 'user_002', 
    status: 'ACTIVE'
  },
  {
    pseudo_account: 'DEMO_USER_003',
    organization_id: 'default_org',
    user_id: 'user_003',
    status: 'ACTIVE'
  }
];

export const mockPositions = [
  {
    id: '1',
    symbol: 'RELIANCE',
    exchange: 'NSE',
    quantity: 100,
    avg_price: 2450.50,
    ltp: 2465.75,
    pnl: 1525.00,
    organization_name: 'default_org',
    user_id: 'user_001',
    strategy_name: 'Long Term Growth'
  },
  {
    id: '2',
    symbol: 'TCS',
    exchange: 'NSE',
    quantity: 50,
    avg_price: 3720.25,
    ltp: 3698.50,
    pnl: -1087.50,
    organization_name: 'default_org',
    user_id: 'user_001',
    strategy_name: 'Tech Momentum'
  },
  {
    id: '3',
    symbol: 'INFY',
    exchange: 'NSE',
    quantity: 75,
    avg_price: 1456.80,
    ltp: 1478.25,
    pnl: 1608.75,
    organization_name: 'default_org',
    user_id: 'user_001',
    strategy_name: 'Tech Momentum'
  },
  {
    id: '4',
    symbol: 'HDFCBANK',
    exchange: 'NSE',
    quantity: 200,
    avg_price: 1542.30,
    ltp: 1558.90,
    pnl: 3320.00,
    organization_name: 'default_org',
    user_id: 'user_002',
    strategy_name: 'Banking Sector'
  },
  {
    id: '5',
    symbol: 'ICICIBANK',
    exchange: 'NSE',
    quantity: 150,
    avg_price: 987.60,
    ltp: 975.25,
    pnl: -1852.50,
    organization_name: 'default_org',
    user_id: 'user_002',
    strategy_name: 'Banking Sector'
  },
  {
    id: '6',
    symbol: 'WIPRO',
    exchange: 'NSE',
    quantity: 300,
    avg_price: 425.75,
    ltp: 441.20,
    pnl: 4635.00,
    organization_name: 'default_org',
    user_id: 'user_003',
    strategy_name: 'Tech Dividend'
  }
];

export const mockOrders = [
  {
    id: '1',
    platform_id: 'ORD_001',
    symbol: 'ADANIPORTS',
    exchange: 'NSE',
    order_type: 'LIMIT',
    transaction_type: 'BUY',
    quantity: 100,
    price: 1245.50,
    status: 'OPEN',
    organization_name: 'default_org',
    user_id: 'user_001',
    strategy_name: 'Infrastructure Play',
    created_at: '2025-06-08T09:15:00Z'
  },
  {
    id: '2',
    platform_id: 'ORD_002',
    symbol: 'TATASTEEL',
    exchange: 'NSE',
    order_type: 'MARKET',
    transaction_type: 'SELL',
    quantity: 200,
    price: 0,
    status: 'COMPLETE',
    organization_name: 'default_org',
    user_id: 'user_001',
    strategy_name: 'Metal Momentum',
    created_at: '2025-06-08T08:45:00Z'
  },
  {
    id: '3',
    platform_id: 'ORD_003',
    symbol: 'BAJFINANCE',
    exchange: 'NSE',
    order_type: 'SL',
    transaction_type: 'BUY',
    quantity: 50,
    price: 6850.00,
    status: 'PENDING',
    organization_name: 'default_org',
    user_id: 'user_002',
    strategy_name: 'NBFC Growth',
    created_at: '2025-06-08T10:30:00Z'
  }
];

export const mockMargins = [
  {
    id: '1',
    category: 'Equity',
    available: 125000.50,
    used: 75000.25,
    total: 200000.75,
    organization_name: 'default_org',
    user_id: 'user_001'
  },
  {
    id: '2',
    category: 'F&O',
    available: 45000.00,
    used: 30000.00,
    total: 75000.00,
    organization_name: 'default_org',
    user_id: 'user_001'
  },
  {
    id: '3',
    category: 'Equity',
    available: 85000.75,
    used: 40000.50,
    total: 125001.25,
    organization_name: 'default_org',
    user_id: 'user_002'
  },
  {
    id: '4',
    category: 'Equity',
    available: 95000.25,
    used: 55000.75,
    total: 150001.00,
    organization_name: 'default_org',
    user_id: 'user_003'
  }
];

// Mock API Service
export class MockApiService {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async fetchAllUsers(organizationId: string) {
    await this.delay(500);
    return { data: mockAccounts };
  }

  async getPositions(organizationName: string, userId: string) {
    await this.delay(300);
    const userPositions = mockPositions.filter(pos => pos.user_id === userId);
    return { data: userPositions };
  }

  async getOrders(organizationName: string, userId: string) {
    await this.delay(300);
    const userOrders = mockOrders.filter(order => order.user_id === userId);
    return { data: userOrders };
  }

  async getMargins(organizationName: string, userId: string) {
    await this.delay(300);
    const userMargins = mockMargins.filter(margin => margin.user_id === userId);
    return { data: userMargins };
  }

  async placeOrder(orderData: any) {
    await this.delay(800);
    console.log('Mock order placed:', orderData);
    return { 
      data: { 
        order_id: 'MOCK_' + Date.now(),
        status: 'SUCCESS',
        message: 'Order placed successfully (MOCK)'
      } 
    };
  }
}

export const mockApiService = new MockApiService();
