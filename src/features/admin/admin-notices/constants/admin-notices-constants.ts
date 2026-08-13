import type {
  NoticeTarget,
  NoticeCategory,
  NoticeStatus,
  NoticeForm,
} from '../types/admin-notices-types';

export const TARGET_LABEL: Record<NoticeTarget, string> = {
  USER: '메인 (고객)',
  ARTIST_SHOP: '파트너',
};

export const TARGET_STYLE: Record<NoticeTarget, string> = {
  USER: 'bg-blue-50 text-blue-600',
  ARTIST_SHOP: 'bg-purple-50 text-purple-600',
};

export const CATEGORY_LABEL: Record<NoticeCategory, string> = {
  IMPORTANT: '주요공지',
  GENERAL: '일반',
  FESTIVAL: '축제',
  CULTURE_PERFORMANCE: '문화공연',
  EVENT: '이벤트',
};

export const STATUS_LABEL: Record<NoticeStatus, string> = {
  DRAFT: '임시저장',
  PUBLISHED: '게시중',
  HIDDEN: '숨김',
};

export const STATUS_STYLE: Record<NoticeStatus, string> = {
  DRAFT: 'bg-amber-50 text-amber-600',
  PUBLISHED: 'bg-emerald-50 text-emerald-600',
  HIDDEN: 'bg-gray-100 text-gray-400',
};

export const DEFAULT_FORM: NoticeForm = {
  title: '',
  target: 'USER',
  category: 'GENERAL',
  status: 'DRAFT',
  body: '',
  pinned: false,
};
