export const ROLE_STYLE: Record<string, string> = {
  CUSTOMER: 'bg-blue-50 text-blue-600',
  ARTIST: 'bg-purple-50 text-purple-600',
  SHOP: 'bg-emerald-50 text-emerald-600',
  TEMP: 'bg-gray-100 text-gray-500',
  ADMIN: 'bg-red-50 text-red-500',
};

export const STATUS_STYLE: Record<string, string> = {
  ACTIVE: 'text-emerald-500',
  INACTIVE: 'text-gray-400',
  WITHDRAWAL_PENDING: 'text-amber-500',
  WITHDRAWN: 'text-red-400',
};

export const STATUS_LABEL: Record<string, string> = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
  WITHDRAWAL_PENDING: '탈퇴진행',
  WITHDRAWN: '탈퇴',
};
