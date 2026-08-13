import type { ContentItem } from '../types/admin-post-types';

export const POST_STATUS_STYLE = {
  VISIBLE: 'bg-emerald-50 text-emerald-600',
  BLIND: 'bg-red-50 text-red-400',
} as const;

export const POST_STATUS_LABEL = {
  VISIBLE: '게시중',
  BLIND: '블라인드',
} as const;

export const STATUS_STYLE: Record<ContentItem['status'], string> = {
  VISIBLE: 'bg-emerald-50 text-emerald-600',
  BLIND: 'bg-red-50 text-red-400',
};

export const STATUS_LABEL: Record<ContentItem['status'], string> = {
  VISIBLE: '게시중',
  BLIND: '블라인드',
};
