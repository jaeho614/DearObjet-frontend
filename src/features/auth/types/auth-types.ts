import type { UserRole, UserStatus } from '../../../shared/constants';

export interface AuthUser {
  userId: number;
  email: string;
  name: string;
  role: UserRole;
  profileUrl: string;
  phoneNumber: string | null;
  userStatus: UserStatus;
}
