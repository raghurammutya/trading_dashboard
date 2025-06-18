// Authentication types for user service integration

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  role: string;
  group_id?: number;
  organization_id?: string;
  created_at: string;
  updated_at?: string;
  last_login?: string;
  is_active?: boolean;
  profile_picture?: string;
  avatar_url?: string;
  mfa_enabled?: boolean;
  timezone?: string;
  language?: string;
  notifications_email?: boolean;
  notifications_sms?: boolean;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR', 
  TRADER = 'TRADER',
  VIEWER = 'VIEWER'
}

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  role?: UserRole;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
  refresh_token?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SocialAuthProvider {
  name: string;
  provider: 'google' | 'facebook' | 'linkedin' | 'github' | 'keycloak';
  icon: string;
  color: string;
  redirectUrl: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  secret?: string;
  permissions: string[];
  created_at: string;
  last_used?: string;
  expires_at?: string;
  is_active: boolean;
}

export interface CreateApiKeyRequest {
  name: string;
  permissions: string[];
  expires_in_days?: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  timezone: string;
  currency: string;
  email_notifications: {
    trading_alerts: boolean;
    security_alerts: boolean;
    market_updates: boolean;
    weekly_reports: boolean;
  };
  sms_notifications: {
    urgent_only: boolean;
    trading_confirmations: boolean;
  };
  trading_preferences: {
    risk_warnings: boolean;
    confirmation_prompts: {
      large_trades: boolean;
      high_risk_instruments: boolean;
    };
  };
}

export interface MFASetup {
  mfa_type: 'totp' | 'sms' | 'email';
  phone_number?: string;
  qr_code?: string;
  secret_key?: string;
  backup_codes?: string[];
}

export interface Session {
  id: string;
  device_id: string;
  device_name: string;
  ip_address: string;
  location?: string;
  browser: string;
  os: string;
  created_at: string;
  last_activity: string;
  is_current: boolean;
  risk_score: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
  confirm_password: string;
}