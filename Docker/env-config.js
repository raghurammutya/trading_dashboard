// Runtime environment configuration for trading dashboard
window._env_ = {
  // API Configuration
  REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  REACT_APP_USER_SERVICE_URL: process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:8000',
  REACT_APP_TRADE_SERVICE_URL: process.env.REACT_APP_TRADE_SERVICE_URL || 'http://localhost:8001',
  
  // Environment
  REACT_APP_ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT || 'development',
  REACT_APP_USE_MOCK_DATA: process.env.REACT_APP_USE_MOCK_DATA || 'false',
  
  // OAuth Configuration
  REACT_APP_GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
  REACT_APP_LINKEDIN_CLIENT_ID: process.env.REACT_APP_LINKEDIN_CLIENT_ID || '',
  REACT_APP_FACEBOOK_APP_ID: process.env.REACT_APP_FACEBOOK_APP_ID || '',
  REACT_APP_GITHUB_CLIENT_ID: process.env.REACT_APP_GITHUB_CLIENT_ID || '',
  
  // Application Configuration
  REACT_APP_APP_NAME: process.env.REACT_APP_APP_NAME || 'TradingHub',
  REACT_APP_VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  
  // Feature Flags
  REACT_APP_ENABLE_SOCIAL_LOGIN: process.env.REACT_APP_ENABLE_SOCIAL_LOGIN || 'true',
  REACT_APP_ENABLE_MFA: process.env.REACT_APP_ENABLE_MFA || 'true',
  REACT_APP_ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS || 'false'
};