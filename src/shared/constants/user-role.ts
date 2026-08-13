export const USER_ROLE = {
  TEMP: 'TEMP',
  CUSTOMER: 'CUSTOMER',
  ARTIST: 'ARTIST',
  SHOP: 'SHOP',
  ADMIN: 'ADMIN',
} as const;

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  WITHDRAWAL_PENDING: 'WITHDRAWAL_PENDING',
  WITHDRAWN: 'WITHDRAWN',
} as const;

export type UserRole = 'TEMP' | 'CUSTOMER' | 'ARTIST' | 'SHOP' | 'ADMIN';
export type UserStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'WITHDRAWAL_PENDING'
  | 'WITHDRAWN';
