export interface Account {
  pseudo_account: string;
  organization_id: string;
  user_id: string;
  status: string;
}

export interface Position {
  id: string;
  symbol: string;
  exchange: string;
  quantity: number;
  avg_price: number;
  ltp: number;
  pnl: number;
  organization_name: string;
  user_id: string;
  strategy_name?: string;
}

export interface Order {
  id: string;
  platform_id: string;
  symbol: string;
  exchange: string;
  order_type: string;
  transaction_type: string;
  quantity: number;
  price: number;
  status: string;
  organization_name: string;
  user_id: string;
  strategy_name?: string;
  created_at: string;
}

export interface Margin {
  id: string;
  category: string;
  available: number;
  used: number;
  total: number;
  organization_name: string;
  user_id: string;
}
