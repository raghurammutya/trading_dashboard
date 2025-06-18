// src/hooks/useMockTradeData.tsx
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { mockApiService } from '../services/mockDataService';

export const useAccounts = (organizationId: string) => {
  return useQuery(
    ['accounts', organizationId],
    () => mockApiService.fetchAllUsers(organizationId),
    {
      select: (response) => response.data,
      staleTime: 60000,
    }
  );
};

export const usePositions = (organizationName: string, userId: string) => {
  return useQuery(
    ['positions', organizationName, userId],
    () => mockApiService.getPositions(organizationName, userId),
    {
      select: (response) => response.data,
      enabled: !!organizationName && !!userId,
    }
  );
};

export const useOrders = (organizationName: string, userId: string) => {
  return useQuery(
    ['orders', organizationName, userId],
    () => mockApiService.getOrders(organizationName, userId),
    {
      select: (response) => response.data,
      enabled: !!organizationName && !!userId,
    }
  );
};

export const useMargins = (organizationName: string, userId: string) => {
  return useQuery(
    ['margins', organizationName, userId],
    () => mockApiService.getMargins(organizationName, userId),
    {
      select: (response) => response.data,
      enabled: !!organizationName && !!userId,
    }
  );
};

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
            mockApiService.getPositions(organizationId, account.user_id),
            mockApiService.getMargins(organizationId, account.user_id)
          ]);
          
          if (positionsRes.data) {
            totalPnL += positionsRes.data.reduce((sum: number, pos: any) => sum + (pos.pnl || 0), 0);
          }
          
          if (marginsRes.data) {
            totalMargin += marginsRes.data.reduce((sum: number, margin: any) => sum + (margin.available || 0), 0);
          }
        } catch (error) {
          console.error(`Error fetching data for account ${account.pseudo_account}:`, error);
        }
      }
      
      return { totalPnL, totalMargin };
    },
    {
      enabled: !!accounts && accounts.length > 0,
      staleTime: 30000,
    }
  );
};

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (orderData: any) => mockApiService.placeOrder(orderData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['orders']);
        queryClient.invalidateQueries(['positions']);
      },
    }
  );
};
