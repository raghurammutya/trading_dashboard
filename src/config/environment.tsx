// src/config/environment.ts
export const config = {
  USE_MOCK_DATA: true, // Always use mock data for now
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  ORGANIZATION_ID: process.env.REACT_APP_ORGANIZATION_ID || 'default_org',
  REFRESH_INTERVAL: 30000,
  STALE_TIME: 10000,
};

console.log('🚀 Trading Dashboard Configuration:', {
  useMockData: config.USE_MOCK_DATA,
  apiBaseUrl: config.API_BASE_URL,
  organizationId: config.ORGANIZATION_ID
});
