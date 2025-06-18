import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { message } from 'antd';

const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:8002';
const TRADE_SERVICE_URL = process.env.REACT_APP_TRADE_SERVICE_URL || 'http://localhost:8004';

// Create axios instances for different services
export const userServiceApi: AxiosInstance = axios.create({
  baseURL: USER_SERVICE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tradeServiceApi: AxiosInstance = axios.create({
  baseURL: TRADE_SERVICE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
const addAuthInterceptor = (apiInstance: AxiosInstance) => {
  apiInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

// Response interceptor for error handling
const addErrorInterceptor = (apiInstance: AxiosInstance) => {
  apiInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      // Handle different error types
      if (error.response?.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        message.error('Session expired. Please log in again.');
      } else if (error.response?.status === 403) {
        message.error('Access denied. You do not have permission to perform this action.');
      } else if (error.response?.status === 404) {
        message.error('Resource not found.');
      } else if (error.response?.status && error.response.status >= 500) {
        message.error('Server error. Please try again later.');
      } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        message.error('Network error. Please check your connection.');
      }
      
      return Promise.reject(error);
    }
  );
};

// Add interceptors to both API instances
addAuthInterceptor(userServiceApi);
addAuthInterceptor(tradeServiceApi);
addErrorInterceptor(userServiceApi);
addErrorInterceptor(tradeServiceApi);

// Health check function
export const checkServiceHealth = async (serviceName: 'user' | 'trade') => {
  try {
    const api = serviceName === 'user' ? userServiceApi : tradeServiceApi;
    const response = await api.get('/health');
    return {
      service: serviceName,
      status: 'healthy',
      response: response.data
    };
  } catch (error) {
    return {
      service: serviceName,
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Generic API error handler
export const handleApiError = (error: any, defaultMessage: string = 'An error occurred') => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  } else if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.message) {
    return error.message;
  }
  return defaultMessage;
};

export default userServiceApi;