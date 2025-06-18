// src/hooks/useTradeData.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const API_BASE = '/api/v1/trade';

// Types
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

export interface Holding {
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

export interface Account {
    pseudo_account: string;
    organization_id: string;
    user_id: string;
    status: string;
}

// API Functions
const api = {
    // Account Management
    fetchAllUsers: (organizationId: string) =>
        axios.get(`${API_BASE}/fetch_all_users?organization_id=${organizationId}`),

    fetchAndStore: (pseudoAccount: string, organizationId: string) =>
        axios.post(`${API_BASE}/fetch_and_store/${pseudoAccount}?organization_id=${organizationId}`),

    // Data Fetching
    getPositions: (organizationName: string, userId: string) =>
        axios.get(`${API_BASE}/positions/organization/${organizationName}/user/${userId}`),

    getHoldings: (organizationName: string, userId: string) =>
        axios.get(`${API_BASE}/holdings/organization/${organizationName}/user/${userId}`),

    getOrders: (organizationName: string, userId: string) =>
        axios.get(`${API_BASE}/orders/organization/${organizationName}/user/${userId}`),

    getMargins: (organizationName: string, userId: string) =>
        axios.get(`${API_BASE}/margins/organization/${organizationName}/user/${userId}`),

    // Strategy-based queries
    getOrdersByStrategy: (strategyName: string) =>
        axios.get(`${API_BASE}/orders/strategy/${strategyName}`),

    getPositionsByStrategy: (strategyName: string) =>
        axios.get(`${API_BASE}/positions/strategy/${strategyName}`),

    getHoldingsByStrategy: (strategyName: string) =>
        axios.get(`${API_BASE}/holdings/strategy/${strategyName}`),

    // Trading Operations
    placeRegularOrder: (orderData: any) =>
        axios.post(`${API_BASE}/regular_order`, null, { params: orderData }),

    placeCoverOrder: (orderData: any) =>
        axios.post(`${API_BASE}/cover_order`, null, { params: orderData }),

    placeBracketOrder: (orderData: any) =>
        axios.post(`${API_BASE}/bracket_order`, null, { params: orderData }),

    placeAdvancedOrder: (orderData: any, organizationId: string) =>
        axios.post(`${API_BASE}/advanced_order?organization_id=${organizationId}`, orderData),

    cancelOrder: (pseudoAccount: string, platformId: string, organizationId: string) =>
        axios.post(`${API_BASE}/cancel_order/${platformId}?pseudo_account=${pseudoAccount}&organization_id=${organizationId}`),

    cancelAllOrders: (pseudoAccount: string, organizationId: string) =>
        axios.post(`${API_BASE}/cancel_all_orders?pseudo_account=${pseudoAccount}&organization_id=${organizationId}`),

    modifyOrder: (platformId: string, orderData: any, organizationId: string) =>
        axios.post(`${API_BASE}/modify_order/${platformId}?organization_id=${organizationId}`, orderData),

    squareOffPosition: (params: any) =>
        axios.post(`${API_BASE}/square_off_position`, null, { params }),

    squareOffPortfolio: (pseudoAccount: string, positionCategory: string, organizationId: string) =>
        axios.post(`${API_BASE}/square_off_portfolio?pseudo_account=${pseudoAccount}&position_category=${positionCategory}&organization_id=${organizationId}`),
};

// Hooks
export const useAccounts = (organizationId: string) => {
    return useQuery(
        ['accounts', organizationId],
        () => api.fetchAllUsers(organizationId),
        {
            select: (response) => response.data,
            staleTime: 60000, // 1 minute
        }
    );
};

export const usePositions = (organizationName: string, userId: string) => {
    return useQuery(
        ['positions', organizationName, userId],
        () => api.getPositions(organizationName, userId),
        {
            select: (response) => response.data,
            enabled: !!organizationName && !!userId,
        }
    );
};

export const useHoldings = (organizationName: string, userId: string) => {
    return useQuery(
        ['holdings', organizationName, userId],
        () => api.getHoldings(organizationName, userId),
        {
            select: (response) => response.data,
            enabled: !!organizationName && !!userId,
        }
    );
};

export const useOrders = (organizationName: string, userId: string) => {
    return useQuery(
        ['orders', organizationName, userId],
        () => api.getOrders(organizationName, userId),
        {
            select: (response) => response.data,
            enabled: !!organizationName && !!userId,
        }
    );
};

export const useMargins = (organizationName: string, userId: string) => {
    return useQuery(
        ['margins', organizationName, userId],
        () => api.getMargins(organizationName, userId),
        {
            select: (response) => response.data,
            enabled: !!organizationName && !!userId,
        }
    );
};

// Strategy-based hooks
export const useStrategyOrders = (strategyName: string) => {
    return useQuery(
        ['strategy-orders', strategyName],
        () => api.getOrdersByStrategy(strategyName),
        {
            select: (response) => response.data,
            enabled: !!strategyName,
        }
    );
};

export const useStrategyPositions = (strategyName: string) => {
    return useQuery(
        ['strategy-positions', strategyName],
        () => api.getPositionsByStrategy(strategyName),
        {
            select: (response) => response.data,
            enabled: !!strategyName,
        }
    );
};

// Aggregate data hook
export const useTotalSummary = (organizationId: string) => {
    const { data: accounts } = useAccounts(organizationId);

    return useQuery(
        ['total-summary', organizationId, accounts],
        async () => {
            if (!accounts || accounts.length === 0) return null;

            let totalPnL = 0;
            let totalMargin = 0;

            for (const account of accounts) {
                try {
                    const [positionsRes, marginsRes] = await Promise.all([
                        api.getPositions(organizationId, account.user_id),
                        api.getMargins(organizationId, account.user_id)
                    ]);

                    // Sum up P&L from positions
                    if (positionsRes.data) {
                        totalPnL += positionsRes.data.reduce((sum: number, pos: Position) => sum + (pos.pnl || 0), 0);
                    }

                    // Sum up available margins
                    if (marginsRes.data) {
                        totalMargin += marginsRes.data.reduce((sum: number, margin: Margin) => sum + (margin.available || 0), 0);
                    }
                } catch (error) {
                    console.error(`Error fetching data for account ${account.pseudo_account}:`, error);
                }
            }

            return { totalPnL, totalMargin };
        },
        {
            enabled: !!accounts && accounts.length > 0,
            staleTime: 30000, // 30 seconds
        }
    );
};

// Trading Mutations
export const usePlaceOrder = () => {
    const queryClient = useQueryClient();

    return useMutation(
        (orderData: { type: string; data: any; organizationId: string }) => {
            switch (orderData.type) {
                case 'regular':
                    return api.placeRegularOrder(orderData.data);
                case 'cover':
                    return api.placeCoverOrder(orderData.data);
                case 'bracket':
                    return api.placeBracketOrder(orderData.data);
                case 'advanced':
                    return api.placeAdvancedOrder(orderData.data, orderData.organizationId);
                default:
                    throw new Error('Invalid order type');
            }
        },
        {
            onSuccess: () => {
                // Invalidate and refetch orders
                queryClient.invalidateQueries(['orders']);
                queryClient.invalidateQueries(['positions']);
            },
        }
    );
};

export const useCancelOrder = () => {
    const queryClient = useQueryClient();

    return useMutation(
        ({ pseudoAccount, platformId, organizationId }: { pseudoAccount: string; platformId: string; organizationId: string }) =>
            api.cancelOrder(pseudoAccount, platformId, organizationId),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['orders']);
            },
        }
    );
};

export const useModifyOrder = () => {
    const queryClient = useQueryClient();

    return useMutation(
        ({ platformId, orderData, organizationId }: { platformId: string; orderData: any; organizationId: string }) =>
            api.modifyOrder(platformId, orderData, organizationId),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['orders']);
            },
        }
    );
};

export const useFetchAndStore = () => {
    const queryClient = useQueryClient();

    return useMutation(
        ({ pseudoAccount, organizationId }: { pseudoAccount: string; organizationId: string }) =>
            api.fetchAndStore(pseudoAccount, organizationId),
        {
            onSuccess: () => {
                // Invalidate all data queries to refresh
                queryClient.invalidateQueries(['positions']);
                queryClient.invalidateQueries(['holdings']);
                queryClient.invalidateQueries(['orders']);
                queryClient.invalidateQueries(['margins']);
            },
        }
    );
};