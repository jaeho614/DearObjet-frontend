export type NoticeTarget = 'USER' | 'ARTIST_SHOP';
export type NoticeCategory =
  | 'IMPORTANT'
  | 'GENERAL'
  | 'FESTIVAL'
  | 'CULTURE_PERFORMANCE'
  | 'EVENT';
export type NoticeStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';
export type TabFilter = 'ALL' | NoticeTarget;

export interface NoticeItem {
  noticeId: number;
  target: NoticeTarget;
  category: NoticeCategory;
  badge: string | null;
  title: string;
  body: string;
  status: NoticeStatus;
  pinned: boolean;
  createdAt: string;
  isNew: boolean;
}

export interface NoticeListResponse {
  items: NoticeItem[];
  page: number;
  totalPages: number;
}

export interface NoticeCreateRequest {
  target: NoticeTarget;
  category: NoticeCategory;
  badge?: string;
  title: string;
  body: string;
  status: NoticeStatus;
  pinned: boolean;
  publishedAt?: string;
}

export interface NoticeUpdateRequest {
  target?: NoticeTarget;
  category?: NoticeCategory;
  badge?: string;
  title?: string;
  body?: string;
  status?: NoticeStatus;
  pinned?: boolean;
  publishedAt?: string;
}

export interface NoticeListPanelProps {
  items: NoticeItem[];
  isLoading: boolean;
  isFetching: boolean;
  selectedNoticeId: number | null;
  tabFilter: TabFilter;
  inputValue: string;
  page: number;
  totalPages: number;
  onSelectNotice: (notice: NoticeItem) => void;
  onTabChange: (tab: TabFilter) => void;
  onInputChange: (value: string) => void;
  onSearch: () => void;
  onNew: () => void;
  onPageChange: (page: number) => void;
}

export interface NoticeForm {
  title: string;
  target: NoticeTarget;
  category: NoticeCategory;
  status: NoticeStatus;
  body: string;
  pinned: boolean;
}

export interface NoticeDetailPanelProps {
  noticeId: number;
  onDeleted: () => void;
}

export interface NoticeCreatePanelProps {
  onCancel: () => void;
}
