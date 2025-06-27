export interface Role {
  id: number;
  name: string;
  users?: UserProfile[];
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  action: string;
  subject: string;
  roles?: Role[];
}

export interface UserProfile {
  id: number;
  username: string;
  email?: string;
  name?: string;
  avatar?: string;
  role_id: number;
  role?: Role;
  created_at?: string;
  updated_at?: string;
} 