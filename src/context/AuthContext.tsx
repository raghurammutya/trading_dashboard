import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, User, LoginRequest, RegisterRequest, LoginResponse } from '../types/auth';
import { authService } from '../services/authService';
import { mockAuthService } from '../services/mockAuthService';
import { message } from 'antd';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: LoginResponse }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' }
  | { type: 'REFRESH_TOKEN_SUCCESS'; payload: { token: string; user: User } };

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: false,
  isLoading: false,
  error: null
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.access_token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    case 'REFRESH_TOKEN_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true
      };
    
    default:
      return state;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          // Try real API first, fallback to mock
          let user: User;
          try {
            user = await authService.getCurrentUser();
          } catch (realApiError) {
            console.warn('Real API getCurrentUser failed, using mock service:', realApiError);
            user = await mockAuthService.getCurrentUser();
          }
          
          dispatch({ 
            type: 'REFRESH_TOKEN_SUCCESS', 
            payload: { token, user } 
          });
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('auth_token');
          dispatch({ type: 'LOGOUT' });
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Try real API first, fallback to mock on failure
      let response: LoginResponse;
      try {
        response = await authService.login(credentials);
      } catch (realApiError) {
        console.warn('Real API login failed, using mock service:', realApiError);
        response = await mockAuthService.login(credentials);
      }
      
      // Store token in localStorage
      localStorage.setItem('auth_token', response.access_token);
      
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: response });
      message.success(`Welcome back, ${response.user.first_name}!`);
      
    } catch (error: any) {
      const errorMessage = error.message || error.response?.data?.detail || 'Login failed. Please try again.';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      message.error(errorMessage);
    }
  };

  const register = async (userData: RegisterRequest) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Try real API first, fallback to mock on failure
      let response: LoginResponse;
      try {
        response = await authService.register(userData);
      } catch (realApiError) {
        console.warn('Real API registration failed, using mock service:', realApiError);
        response = await mockAuthService.register(userData);
      }
      
      // Store token in localStorage
      localStorage.setItem('auth_token', response.access_token);
      
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: response });
      message.success(`Welcome to Trading Dashboard, ${response.user.first_name}!`);
      
    } catch (error: any) {
      const errorMessage = error.message || error.response?.data?.detail || 'Registration failed. Please try again.';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      message.error(errorMessage);
    }
  };

  const logout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    
    dispatch({ type: 'LOGOUT' });
    message.info('You have been logged out successfully.');
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await authService.refreshToken(refreshToken);
      localStorage.setItem('auth_token', response.access_token);
      
      dispatch({ 
        type: 'REFRESH_TOKEN_SUCCESS', 
        payload: { token: response.access_token, user: response.user } 
      });
      
    } catch (error) {
      // Refresh failed, logout user
      logout();
    }
  };

  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    updateUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}