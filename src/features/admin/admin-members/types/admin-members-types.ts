import type { UserRole, UserStatus } from '../../../../shared/constants';

export interface AdminRoleCountResponse {
  customerCount: number;
  shopCount: number;
  artistCount: number;
}

export interface AdminUserSummary {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  status: UserStatus;
}

export interface AdminUserListResponse {
  users: AdminUserSummary[];
  page: number;
  totalPages: number;
  totalCount: number;
}

export interface AdminUserDetailResponse {
  userId: number;
  name: string;
  email: string;
  phoneNumber: string | null;
  role: UserRole;
  status: UserStatus;
  profileUrl: string | null;
  socialId: string | null;
  smsAgreement: boolean | null;
  marketingAgreement: boolean | null;
  withdrawalRequestedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserStatusResponse {
  userId: number;
  status: UserStatus;
}
