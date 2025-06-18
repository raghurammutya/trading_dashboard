// Permissions and access control types
import { User } from './auth';

export interface Permission {
  id: string;
  grantor_id: number;
  grantee_id: number;
  permission_type: PermissionType;
  resource_type: ResourceType;
  resource_id?: string;
  action: ActionType;
  conditions?: PermissionConditions;
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
  priority: number;
}

export enum PermissionType {
  EXPLICIT_GRANT = 'EXPLICIT_GRANT',
  EXPLICIT_DENY = 'EXPLICIT_DENY',
  ROLE_BASED = 'ROLE_BASED',
  SYSTEM_DEFAULT = 'SYSTEM_DEFAULT'
}

export enum ResourceType {
  POSITIONS = 'positions',
  HOLDINGS = 'holdings',
  MARGINS = 'margins',
  ORDERS = 'orders',
  STRATEGIES = 'strategies',
  USER_DATA = 'user_data',
  TRADING_ACCOUNTS = 'trading_accounts'
}

export enum ActionType {
  VIEW = 'view',
  CREATE = 'create',
  MODIFY = 'modify',
  DELETE = 'delete',
  EXECUTE = 'execute',
  SHARE = 'share'
}

export interface PermissionConditions {
  instrument_keys?: string[];
  time_restrictions?: {
    start_time?: string;
    end_time?: string;
    days_of_week?: number[];
  };
  amount_limits?: {
    max_amount?: number;
    daily_limit?: number;
  };
  ip_restrictions?: string[];
}

export interface DataSharingRequest {
  resource_types: ResourceType[];
  share_with_all: boolean;
  exclude_users?: number[];
  include_users?: number[];
  conditions?: PermissionConditions;
  expires_in_days?: number;
}

export interface TradingPermissionRequest {
  grantee_id: number;
  actions: ActionType[];
  instrument_restrictions?: string[];
  conditions?: PermissionConditions;
  expires_in_days?: number;
}

export interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  resource_types: ResourceType[];
  actions: ActionType[];
  default_conditions?: PermissionConditions;
  is_system_template: boolean;
}

export interface UserPermissionSummary {
  user_id: number;
  user_name: string;
  user_email: string;
  granted_permissions: Permission[];
  received_permissions: Permission[];
  active_restrictions: Permission[];
  total_permissions: number;
  last_updated: string;
}

export interface PermissionAuditLog {
  id: string;
  actor_id: number;
  actor_name: string;
  action: 'GRANT' | 'REVOKE' | 'MODIFY' | 'EXPIRE';
  permission_id: string;
  target_user_id: number;
  target_user_name: string;
  resource_type: ResourceType;
  action_type: ActionType;
  timestamp: string;
  ip_address: string;
  user_agent: string;
  business_justification?: string;
}

export interface PermissionConflict {
  id: string;
  permission1: Permission;
  permission2: Permission;
  conflict_type: 'GRANT_DENY' | 'OVERLAPPING_CONDITIONS' | 'PRIORITY_CONFLICT';
  resolution: 'EXPLICIT_DENY' | 'HIGHEST_PRIORITY' | 'MOST_RESTRICTIVE';
  resolved_action: ActionType | null;
  created_at: string;
}

export interface GroupPermission {
  group_id: number;
  group_name: string;
  members: User[];
  shared_resources: ResourceType[];
  collective_permissions: Permission[];
  group_restrictions: Permission[];
}

export interface OrganizationAccess {
  organization_id: string;
  organization_name: string;
  user_role: 'admin' | 'manager' | 'member' | 'viewer';
  permissions: Permission[];
  can_manage_permissions: boolean;
  can_invite_users: boolean;
  can_view_audit_logs: boolean;
}